import { NextResponse } from "next/server";
import { sendTelegramNotification, sendGoogleSheetWebhook } from "@/utils/notifications";
import { getLatestWeddingDataAsync } from "@/utils/serverWeddingData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channel, botToken, chatId, webhookUrl } = body;
    const currentData = await getLatestWeddingDataAsync();

    if (channel === "telegram") {
      const testMsg = `
🔔 <b>[KIỂM TRA KẾT NỐI THIỆP CƯỚI]</b>
🎉 Xin chào <b>${currentData.groom.fullName} & ${currentData.bride.fullName}</b>!
━━━━━━━━━━━━━━━━━━
✅ Kết nối Telegram Bot thành công!
Kể từ bây giờ, bất cứ khi nào có khách:
  • 💌 <b>Xác nhận tham dự (RSVP)</b>
  • 🎉 <b>Gửi lời chúc mừng</b>
Điện thoại của bạn sẽ nhận được tin nhắn tức thì tại đây!
⏰ <i>${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</i>
`.trim();

      const effectiveToken = botToken || currentData.notifications?.telegram?.botToken;
      const effectiveChatId = chatId || currentData.notifications?.telegram?.chatId;
      const result = await sendTelegramNotification(testMsg, {
        botToken: effectiveToken,
        chatId: effectiveChatId,
      });
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Đã gửi tin nhắn thử nghiệm tới Telegram thành công!",
      });
    }

    if (channel === "googlesheet") {
      const testPayload = {
        type: "TEST",
        fullName: `Khách Thử Nghiệm (${currentData.groom.shortName} & ${currentData.bride.shortName})`,
        phone: "0999888777",
        guestOf: "both",
        attendance: "attending",
        guestCount: 2,
        dietaryOrNote: "Kiểm tra kết nối Google Sheets thành công!",
        createdAt: new Date().toISOString(),
      };

      const result = await sendGoogleSheetWebhook(testPayload, webhookUrl);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || "Không thể kết nối tới Google Sheets Webhook." },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Đã gửi dữ liệu thử nghiệm tới Google Sheet thành công!",
      });
    }

    return NextResponse.json(
      { success: false, error: "Kênh kiểm tra không hợp lệ." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Lỗi xử lý yêu cầu." },
      { status: 500 }
    );
  }
}
