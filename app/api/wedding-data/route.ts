import { NextResponse } from "next/server";
import { getLatestWeddingData, saveLatestWeddingData } from "@/utils/serverWeddingData";

export async function GET() {
  const data = getLatestWeddingData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();
    const success = saveLatestWeddingData(updatedData);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to persist wedding data" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving wedding data:", err);
    return NextResponse.json(
      { success: false, error: "Failed to persist wedding data" },
      { status: 500 }
    );
  }
}

