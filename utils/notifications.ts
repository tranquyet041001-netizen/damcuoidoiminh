import { RSVPSubmission, WishSubmission, WeddingData } from "@/types/wedding";

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

/**
 * Gửi tin nhắn tức thì tới tài khoản hoặc nhóm Telegram của dâu rể
 */
export async function sendTelegramNotification(
  message: string,
  config?: TelegramConfig
): Promise<{ success: boolean; error?: string }> {
  const token = config?.botToken?.trim() || process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = config?.chatId?.trim() || process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    return {
      success: false,
      error: "Chưa cấu hình Telegram Bot Token hoặc Chat ID.",
    };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const result = await res.json();
    if (!result.ok) {
      console.error("[Telegram API Error]:", result);
      return {
        success: false,
        error: result.description || "Lỗi khi gửi tin nhắn qua Telegram Bot.",
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Telegram Network Error]:", err);
    return {
      success: false,
      error: err.message || "Không thể kết nối đến máy chủ Telegram.",
    };
  }
}

/**
 * Gửi dữ liệu phản hồi tới Google Sheets qua Webhook (Google Apps Script)
 */
export async function sendGoogleSheetWebhook(
  payload: any,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const url = webhookUrl?.trim() || process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim();

  if (!url) {
    return { success: false, error: "Chưa cấu hình Google Sheet Webhook URL." };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return { success: res.ok };
  } catch (err: any) {
    console.error("[Google Sheet Webhook Error]:", err);
    return { success: false, error: err.message || "Lỗi kết nối Webhook." };
  }
}

/**
 * Định dạng tin nhắn RSVP cho Telegram
 */
export function formatRSVPTelegramMessage(
  rsvp: RSVPSubmission,
  weddingData?: WeddingData
): string {
  const isAttending = rsvp.attendance === "attending";
  const statusIcon = isAttending
    ? "✅ Sẽ tham dự"
    : rsvp.attendance === "declined"
    ? "❌ Tiếc quá, vắng mặt"
    : "❓ Chưa chắc chắn";

  const guestSide =
    rsvp.guestOf === "groom"
      ? "👨‍💼 Khách Nhà Trai"
      : rsvp.guestOf === "bride"
      ? "👰‍♀️ Khách Nhà Gái"
      : "💐 Khách Cả Hai";

  const groomName = weddingData?.groom.shortName || "Công Quyết";
  const brideName = weddingData?.bride.shortName || "Ngọc Hân";

  return `
💌 <b>[THIỆP CƯỚI ${groomName.toUpperCase()} & ${brideName.toUpperCase()}]</b>
🔔 <b>CÓ KHÁCH XÁC NHẬN THAM DỰ MỚI!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Họ & Tên:</b> ${rsvp.fullName}
📞 <b>Số điện thoại:</b> <a href="tel:${rsvp.phone}">${rsvp.phone}</a>
🏷️ <b>Khách của:</b> ${guestSide}
✨ <b>Tình trạng:</b> <b>${statusIcon}</b>
👥 <b>Số lượng:</b> <b>${rsvp.guestCount} người</b>
${rsvp.dietaryOrNote ? `📝 <b>Lời nhắn:</b> <i>"${rsvp.dietaryOrNote}"</i>\n` : ""}
⏰ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
━━━━━━━━━━━━━━━━━━
<i>Hệ thống tự động thông báo từ thiệp cưới trực tuyến.</i>
`.trim();
}

/**
 * Định dạng tin nhắn Lời Chúc cho Telegram
 */
export function formatWishTelegramMessage(
  wish: WishSubmission,
  weddingData?: WeddingData
): string {
  const groomName = weddingData?.groom.shortName || "Công Quyết";
  const brideName = weddingData?.bride.shortName || "Ngọc Hân";

  return `
🎉 <b>[LỜI CHÚC MỪNG HÔN LỄ]</b>
💍 <b>${groomName} & ${brideName}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Người gửi:</b> <b>${wish.name}</b>
${wish.relationship ? `🤝 <b>Mối quan hệ:</b> ${wish.relationship}\n` : ""}
💬 <b>Lời chúc gửi trao:</b>
<i>"${wish.content}"</i>
━━━━━━━━━━━━━━━━━━
⏰ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
`.trim();
}
