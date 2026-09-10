import { NextResponse } from "next/server";
import {
  getLatestWeddingDataAsync,
  saveLatestWeddingData,
} from "@/utils/serverWeddingData";

export async function GET() {
  const data = await getLatestWeddingDataAsync();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();
    if (!updatedData || !updatedData.groom || !updatedData.bride) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu thiệp cưới không hợp lệ" },
        { status: 400 }
      );
    }
    const result = await saveLatestWeddingData(updatedData);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error saving wedding data:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to persist wedding data" },
      { status: 500 }
    );
  }
}


