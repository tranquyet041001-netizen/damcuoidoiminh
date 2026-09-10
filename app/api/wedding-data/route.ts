import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { weddingData as defaultData } from "@/data/wedding";

const dataFilePath = path.join(process.cwd(), "data", "saved_wedding_data.json");

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8");
      return NextResponse.json(JSON.parse(fileContent));
    }
  } catch (err) {
    console.error("Error reading saved wedding data:", err);
  }
  return NextResponse.json(defaultData);
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving wedding data:", err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}
