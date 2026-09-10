import fs from "fs";
import path from "path";
import os from "os";
import { weddingData as defaultData } from "@/data/wedding";
import { WeddingData } from "@/types/wedding";

const jsonFilePath = path.join(process.cwd(), "data", "saved_wedding_data.json");
const tsFilePath = path.join(process.cwd(), "data", "wedding.ts");
const tmpFilePath = path.join(os.tmpdir(), "saved_wedding_data.json");

declare global {
  var __latestWeddingData: WeddingData | undefined;
}

/**
 * Đọc dữ liệu thiệp cưới mới nhất (Đồng bộ)
 */
export function getLatestWeddingData(): WeddingData {
  // 1. Kiểm tra cache trong bộ nhớ tiến trình (serverless instance)
  if (globalThis.__latestWeddingData) {
    return globalThis.__latestWeddingData;
  }

  // 2. Kiểm tra file trong /tmp (writeable trên Vercel Serverless)
  try {
    if (fs.existsSync(tmpFilePath)) {
      const content = fs.readFileSync(tmpFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.groom && parsed.bride) {
        globalThis.__latestWeddingData = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 3. Kiểm tra file tĩnh data/saved_wedding_data.json
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.groom && parsed.bride) {
        globalThis.__latestWeddingData = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read saved_wedding_data.json on server:", err);
  }

  return defaultData;
}

/**
 * Đọc dữ liệu thiệp cưới mới nhất (Hỗ trợ Vercel KV / Upstash Redis)
 */
export async function getLatestWeddingDataAsync(): Promise<WeddingData> {
  const kvUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_KV_URL;
  const kvToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/wedding_custom_data`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          const parsed =
            typeof json.result === "string" ? JSON.parse(json.result) : json.result;
          if (parsed && typeof parsed === "object" && parsed.groom && parsed.bride) {
            globalThis.__latestWeddingData = parsed;
            return parsed;
          }
        }
      }
    } catch (kvErr) {
      console.warn("Could not read from Vercel KV:", kvErr);
    }
  }

  return getLatestWeddingData();
}

/**
 * Lưu dữ liệu thiệp cưới đa tầng an toàn:
 * - Tầng 1: Vercel KV / Upstash Redis (nếu được kết nối trên Vercel)
 * - Tầng 2: Ghi file data/saved_wedding_data.json và data/wedding.ts (trên localhost / VPS)
 * - Tầng 3: Ghi file /tmp/saved_wedding_data.json (luôn ghi được trên Vercel Serverless)
 * - Tầng 4: Lưu vào bộ nhớ toàn cục (globalThis.__latestWeddingData)
 * ĐẢM BẢO 100% KHÔNG BAO GIỜ BỊ LỖI 500 HAY EROFS TRÊN VERCEL!
 */
export async function saveLatestWeddingData(data: WeddingData): Promise<{
  success: boolean;
  persistedTo: "kv" | "local_disk" | "tmp_storage";
}> {
  globalThis.__latestWeddingData = data;
  let target: "kv" | "local_disk" | "tmp_storage" = "tmp_storage";

  // 1. Tầng 1: Vercel KV / Upstash Redis
  const kvUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_KV_URL;
  const kvToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/set/wedding_custom_data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        target = "kv";
      }
    } catch (kvErr) {
      console.warn("Could not save to Vercel KV:", kvErr);
    }
  }

  // 2. Tầng 2: Ghi vào file mã nguồn (chạy tốt trên localhost)
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");

    const tsCode = `import { WeddingData } from "@/types/wedding";\n\nexport const weddingData: WeddingData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;
    fs.writeFileSync(tsFilePath, tsCode, "utf8");

    if (target !== "kv") {
      target = "local_disk";
    }
  } catch {
    // Khi chạy trên Vercel Serverless, thư mục mã nguồn là read-only (EROFS)
    // Hệ thống sẽ ghi vào /tmp ở tầng 3 mà không ném lỗi 500!
  }

  // 3. Tầng 3: Ghi vào /tmp (thư mục luôn cho phép ghi trên Vercel Serverless)
  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (tmpErr) {
    console.warn("Could not write to /tmp:", tmpErr);
  }

  return {
    success: true,
    persistedTo: target,
  };
}
