import { NextResponse } from "next/server";
import { WishSubmission } from "@/types/wedding";

const initialWishes: WishSubmission[] = [
  {
    id: "wish-1",
    name: "Thanh Trúc & Quốc Bảo",
    relationship: "Bạn đại học",
    content: "Chúc Quang Minh & Thục An trăm năm hạnh phúc, răng long đầu bạc! Chúc gia đình nhỏ luôn ngập tràn tiếng cười và bình yên mỗi ngày.",
    createdAt: "2026-09-08T14:20:00Z",
  },
  {
    id: "wish-2",
    name: "Cô Chú Hoàng Mai",
    relationship: "Họ hàng nhà gái",
    content: "Chúc hai cháu vẹn tròn duyên kiếp, yêu thương sẻ chia và cùng nhau vun vén cho tổ ấm đơm hoa kết trái ngọt ngào.",
    createdAt: "2026-09-09T09:15:00Z",
  },
  {
    id: "wish-3",
    name: "Hội Bạn Cấp 3 Chu Văn An",
    relationship: "Bạn bè chú rể",
    content: "Mừng ngày Minh 'chống lầy' thành công! Chúc hai bạn sớm sinh quý tử, viên mãn như ý!",
    createdAt: "2026-09-09T18:40:00Z",
  },
];

const wishesStore: WishSubmission[] = [...initialWishes];

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

    const newWish: WishSubmission = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      relationship: relationship?.trim() || "Người thương mến",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    wishesStore.unshift(newWish);

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
