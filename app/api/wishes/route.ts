import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { WishSubmission } from "@/types/wedding";
import { getLatestWeddingData } from "@/utils/serverWeddingData";
import {
  sendTelegramNotification,
  formatWishTelegramMessage,
  sendGoogleSheetWebhook,
} from "@/utils/notifications";

const wishesFilePath = path.join(process.cwd(), "data", "saved_wishes.json");

function getStoredWishes(): WishSubmission[] {
  try {
    if (fs.existsSync(wishesFilePath)) {
      const content = fs.readFileSync(wishesFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read saved_wishes.json:", err);
  }
  return [
    {
      id: "wish-1",
      name: "Thanh Tùng & Mai Anh",
      relationship: "Bạn thân đại học",
      content:
        "Chúc mừng hạnh phúc Công Quyết & Ngọc Hân! Chúc hai bạn trăm năm viên mãn, răng long đầu bạc, tổ ấm nhỏ luôn tràn ngập tiếng cười và yêu thương.",
      createdAt: "2026-09-08T14:20:00Z",
    },
    {
      id: "wish-2",
      name: "Bác Hùng & Cô Lan",
      relationship: "Bà con xóm 6 Minh Châu",
      content:
        "Chúc hai cháu trăm năm kết tóc se tơ, sớm hôm hòa thuận, cùng nhau vun vén cho mái ấm nhỏ thật hạnh phúc và bình an!",
      createdAt: "2026-09-09T09:15:00Z",
    },
    {
      id: "wish-3",
      name: "Hội Bạn Thân Minh Châu",
      relationship: "Bạn bè chú rể",
      content:
        "Chúc mừng người anh em Công Quyết rước được nàng dâu thảo Ngọc Hân về dinh! Chúc đôi bạn trẻ sớm có quý tử, vạn sự như ý!",
      createdAt: "2026-09-09T18:40:00Z",
    },
  ];
}

function saveWishes(list: WishSubmission[]) {
  try {
    fs.writeFileSync(wishesFilePath, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write to saved_wishes.json (possibly read-only env):", err);
  }
}

const wishesStore: WishSubmission[] = getStoredWishes();

export async function GET() {
  return NextResponse.json({
    success: true,
    data: wishesStore,
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
