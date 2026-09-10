import { NextResponse } from "next/server";
import { RSVPSubmission } from "@/types/wedding";

// In-memory mock storage for development, easily replaceable with Supabase or Google Sheets
const rsvpStore: RSVPSubmission[] = [
  {
    id: "rsvp-1",
    fullName: "Nguyễn Văn Đức",
    phone: "0901234567",
    guestOf: "groom",
    attendance: "attending",
    guestCount: 2,
    dietaryOrNote: "Chúc hai bạn trăm năm hạnh phúc!",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: rsvpStore,
    total: rsvpStore.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, guestOf, attendance, guestCount, dietaryOrNote } = body;

    // Validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập họ và tên của bạn." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập số điện thoại liên hệ." },
        { status: 400 }
      );
    }

    const newRSVP: RSVPSubmission = {
      id: `rsvp-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      guestOf: guestOf || "both",
      attendance: attendance || "attending",
      guestCount: Number(guestCount) || 1,
      dietaryOrNote: dietaryOrNote?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    rsvpStore.unshift(newRSVP);

    return NextResponse.json({
      success: true,
      message: "Cảm ơn bạn đã phản hồi! Dâu rể rất mong được đón tiếp bạn.",
      data: newRSVP,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
