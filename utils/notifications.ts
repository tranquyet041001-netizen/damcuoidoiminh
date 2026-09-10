import { Redis } from "@upstash/redis";
import { RSVPSubmission, WishSubmission, WeddingData } from "@/types/wedding";

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
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
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Gửi tin nhắn tức thì tới tài khoản hoặc nhóm Telegram của dâu rể
 */
export async function sendTelegramNotification(
  message: string,
  config?: TelegramConfig
): Promise<{ success: boolean; error?: string }> {
  let token = config?.botToken?.trim() || process.env.TELEGRAM_BOT_TOKEN?.trim();
  let chatId = config?.chatId?.trim() || process.env.TELEGRAM_CHAT_ID?.trim();

  // 1. Tự động chuẩn hóa nếu người dùng copy thừa chữ "bot" ở đầu token
  if (token && /^bot\d+:/i.test(token)) {
    token = token.replace(/^bot/i, "");
  }

  // 2. Nếu thiếu token hoặc chatId, đọc trực tiếp từ Redis
  if (!token || !chatId) {
    const redis = getRedisClient();
    if (redis) {
      try {
        const stored = await redis.get<TelegramConfig>("wedding_telegram_config");
        if (stored?.botToken && stored?.chatId) {
          token = token || stored.botToken.trim();
          chatId = chatId || stored.chatId.trim();
        }
        if (!token || !chatId) {
          const weddingCustom = await redis.get<WeddingData>("wedding_custom_data");
          if (weddingCustom?.notifications?.telegram) {
            token = token || weddingCustom.notifications.telegram.botToken?.trim();
            chatId = chatId || weddingCustom.notifications.telegram.chatId?.trim();
          }
        }
      } catch (err) {
        console.warn("[Redis Read Telegram Config Error]:", err);
      }
    }
  }

  // Chuẩn hóa token lần 2
  if (token && /^bot\d+:/i.test(token)) {
    token = token.replace(/^bot/i, "");
  }

  if (!token || !chatId) {
    console.warn("[Telegram Notification Warning]: Chưa cấu hình Telegram Bot Token hoặc Chat ID.", {
      hasToken: Boolean(token),
      hasChatId: Boolean(chatId),
    });
    return {
      success: false,
      error: "Chưa cấu hình Telegram Bot Token hoặc Chat ID. Vui lòng kiểm tra tab Thông báo trong /admin hoặc cài đặt Environment Variables trên Vercel.",
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
      let friendlyError = result.description || "Lỗi khi gửi tin nhắn qua Telegram Bot.";
      if (result.description?.includes("chat not found")) {
        friendlyError = "Lỗi 'chat not found': Bạn hoặc nhóm của bạn chưa gửi tin nhắn cho Bot! Hãy mở Telegram, tìm bot của bạn và bấm nút 'Start' (hoặc gõ /start) để kích hoạt trước.";
      } else if (result.description?.includes("bot can't initiate conversation")) {
        friendlyError = "Lỗi 'bot can't initiate conversation': Telegram yêu cầu bạn phải mở Bot và bấm nút 'Start' (/start) trước thì bot mới có quyền gửi tin nhắn cho bạn.";
      } else if (result.description?.includes("Unauthorized")) {
        friendlyError = "Lỗi 'Unauthorized': Bot Token không chính xác. Hãy vào @BotFather trên Telegram lấy lại Token chuẩn.";
      }
      return {
        success: false,
        error: friendlyError,
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
