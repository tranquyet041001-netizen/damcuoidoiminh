import { NextResponse } from "next/server";
import { WishSubmission } from "@/types/wedding";

const initialWishes: WishSubmission[] = [
  {
    id: "wish-1",
    name: "Thanh Tùng & Mai Anh",
    relationship: "Bạn thân đại học",
    content: "Chúc mừng hạnh phúc Công Quyết & Ngọc Hân! Chúc hai bạn trăm năm viên mãn, răng long đầu bạc, tổ ấm nhỏ luôn tràn ngập tiếng cười và yêu thương.",
    createdAt: "2026-09-08T14:20:00Z",
  },
  {
    id: "wish-2",
    name: "Bác Hùng & Cô Lan",
    relationship: "Bà con xóm 6 Minh Châu",
    content: "Chúc hai cháu trăm năm kết tóc se tơ, sớm hôm hòa thuận, cùng nhau vun vén cho mái ấm nhỏ thật hạnh phúc và bình an!",
    createdAt: "2026-09-09T09:15:00Z",
  },
  {
    id: "wish-3",
    name: "Hội Bạn Thân Minh Châu",
    relationship: "Bạn bè chú rể",
    content: "Chúc mừng người anh em Công Quyết rước được nàng dâu thảo Ngọc Hân về dinh! Chúc đôi bạn trẻ sớm có quý tử, vạn sự như ý!",
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
