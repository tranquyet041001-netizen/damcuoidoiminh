import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { WishSubmission } from "@/types/wedding";
import { getLatestWeddingData } from "@/utils/serverWeddingData";
import {
  sendTelegramNotification,
  formatWishTelegramMessage,
  sendGoogleSheetWebhook,
} from "@/utils/notifications";

const wishesFilePath = path.join(process.cwd(), "data", "saved_wishes.json");

function getRedisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_KV_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_TOKEN;

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch {
      return null;
    }
  }
  return null;
}

function getStoredWishes(): WishSubmission[] {
  try {
    if (fs.existsSync(wishesFilePath)) {
      const content = fs.readFileSync(wishesFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not read saved_wishes.json:", err);
  }
  return [];
}

function saveWishes(list: WishSubmission[]) {
  try {
    fs.writeFileSync(wishesFilePath, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write to saved_wishes.json (possibly read-only env):", err);
  }
}

let wishesStore: WishSubmission[] = getStoredWishes();

export async function GET() {
  const redis = getRedisClient();
  if (redis) {
    try {
      const remote = await redis.get<WishSubmission[]>("wedding_wishes_list");
      if (Array.isArray(remote)) {
        wishesStore = remote;
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.json({
    success: true,
    data: wishesStore,
    total: wishesStore.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, relationship, content } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập tên của bạn." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập lời chúc của bạn." },
        { status: 400 }
      );
    }

    const currentWeddingData = getLatestWeddingData();

    const newWish: WishSubmission = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      relationship: relationship?.trim() || "Người thương mến",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    wishesStore.unshift(newWish);
    saveWishes(wishesStore);

    // Lưu vào Redis (nếu cấu hình)
    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.set("wedding_wishes_list", wishesStore);
      } catch (redisErr) {
        console.warn("[Wishes Redis Error]", redisErr);
      }
    }

    // 1. Gửi thông báo lời chúc tới Telegram của dâu rể
    try {
      const telegramText = formatWishTelegramMessage(newWish, currentWeddingData);
      await sendTelegramNotification(
        telegramText,
        currentWeddingData.notifications?.telegram
      );
    } catch (telegramErr) {
      console.warn("[Telegram Wish Notification Error]:", telegramErr);
    }

    // 2. Tự động ghi vào Google Sheets qua Webhook nếu có
    try {
      await sendGoogleSheetWebhook(
        {
          type: "WISH",
          id: newWish.id,
          name: newWish.name,
          relationship: newWish.relationship,
          content: newWish.content,
          createdAt: newWish.createdAt,
        },
        currentWeddingData.notifications?.googleSheet?.webhookUrl
      );
    } catch (sheetErr) {
      console.warn("[Google Sheet Wish Webhook Error]:", sheetErr);
    }

    return NextResponse.json({
      success: true,
      message: "Cảm ơn lời chúc tốt đẹp của bạn!",
      data: newWish,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Không thể gửi lời chúc vào lúc này. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID lời chúc cần xóa" }, { status: 400 });
    }

    wishesStore = wishesStore.filter((w) => w.id !== id);
    saveWishes(wishesStore);

    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.set("wedding_wishes_list", wishesStore);
      } catch (redisErr) {
        console.warn("[Wishes Delete Redis Error]", redisErr);
      }
    }

    return NextResponse.json({ success: true, message: "Đã xóa lời chúc", data: wishesStore });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
