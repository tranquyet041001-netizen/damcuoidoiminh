import fs from "fs";
import path from "path";
import os from "os";
import { Redis } from "@upstash/redis";
import { weddingData as defaultData } from "@/data/wedding";
import { WeddingData } from "@/types/wedding";

const jsonFilePath = path.join(process.cwd(), "data", "saved_wedding_data.json");
const tsFilePath = path.join(process.cwd(), "data", "wedding.ts");
const tmpFilePath = path.join(os.tmpdir(), "saved_wedding_data.json");

declare global {
  var __latestWeddingData: WeddingData | undefined;
}

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
    } catch (err) {
      console.warn("Could not initialize Upstash Redis:", err);
    }
  }
  return null;
}

/**
 * Đọc dữ liệu thiệp cưới mới nhất (Đồng bộ)
 */
export function getLatestWeddingData(): WeddingData {
  if (globalThis.__latestWeddingData) {
    return globalThis.__latestWeddingData;
  }

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
  const redis = getRedisClient();
  if (redis) {
    try {
      const cached = await redis.get<WeddingData>("wedding_custom_data");
      if (cached && typeof cached === "object" && cached.groom && cached.bride) {
        globalThis.__latestWeddingData = cached;
        return cached;
      }
    } catch (err) {
      console.warn("Could not read from Upstash Redis:", err);
    }
  }

  return getLatestWeddingData();
}

/**
 * Lưu dữ liệu thiệp cưới đa tầng an toàn:
 * - Tầng 1: Upstash Redis / Vercel KV (Lưu vĩnh viễn trên đám mây)
 * - Tầng 2: Ghi file data/saved_wedding_data.json và data/wedding.ts (trên localhost)
 * - Tầng 3: Ghi file /tmp/saved_wedding_data.json (luôn ghi được trên Vercel Serverless)
 * - Tầng 4: Lưu vào bộ nhớ toàn cục (globalThis.__latestWeddingData)
 */
export async function saveLatestWeddingData(data: WeddingData): Promise<{
  success: boolean;
  persistedTo: "redis" | "local_disk" | "tmp_storage";
}> {
  globalThis.__latestWeddingData = data;
  let target: "redis" | "local_disk" | "tmp_storage" = "tmp_storage";

  // 1. Tầng 1: Upstash Redis / Vercel KV
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set("wedding_custom_data", data);
      target = "redis";
    } catch (err) {
      console.warn("Could not save to Upstash Redis:", err);
    }
  }

  // 2. Tầng 2: Ghi vào file mã nguồn (chạy tốt trên localhost / PC)
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");

    const tsCode = `import { WeddingData } from "@/types/wedding";\n\nexport const weddingData: WeddingData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;
    fs.writeFileSync(tsFilePath, tsCode, "utf8");

    if (target !== "redis") {
      target = "local_disk";
    }
  } catch {
    // EROFS trên Vercel là bình thường
  }

  // 3. Tầng 3: Ghi vào /tmp (luôn ghi được trên Vercel Serverless)
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
