import fs from "fs";
import path from "path";
import { weddingData as defaultData } from "@/data/wedding";
import { WeddingData } from "@/types/wedding";

const jsonFilePath = path.join(process.cwd(), "data", "saved_wedding_data.json");
const tsFilePath = path.join(process.cwd(), "data", "wedding.ts");

export function getLatestWeddingData(): WeddingData {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.groom && parsed.bride) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read saved_wedding_data.json on server:", err);
  }
  return defaultData;
}

export function saveLatestWeddingData(data: WeddingData): boolean {
  try {
    // 1. Ghi file JSON để server Next.js dynamic load
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");

    // 2. Ghi file TS để Next.js SSR / Metadata / build-time static luôn đồng nhất
    const tsCode = `import { WeddingData } from "@/types/wedding";\n\nexport const weddingData: WeddingData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;
    fs.writeFileSync(tsFilePath, tsCode, "utf8");

    return true;
  } catch (err) {
    console.error("Error writing wedding data files:", err);
    return false;
  }
}
