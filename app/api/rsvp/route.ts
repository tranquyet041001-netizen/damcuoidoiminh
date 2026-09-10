import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RSVPSubmission } from "@/types/wedding";
import { getLatestWeddingData } from "@/utils/serverWeddingData";
import {
  sendTelegramNotification,
  formatRSVPTelegramMessage,
  sendGoogleSheetWebhook,
} from "@/utils/notifications";

const rsvpsFilePath = path.join(process.cwd(), "data", "saved_rsvps.json");

function getStoredRSVPs(): RSVPSubmission[] {
  try {
    if (fs.existsSync(rsvpsFilePath)) {
      const content = fs.readFileSync(rsvpsFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read saved_rsvps.json:", err);
  }
  return [
    {
      id: "rsvp-1",
      fullName: "Nguyễn Văn Đức",
      phone: "0901234567",
      guestOf: "groom",
      attendance: "attending",
      guestCount: 2,
      dietaryOrNote: "Chúc hai bạn trăm năm hạnh phúc, viên mãn!",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "rsvp-2",
      fullName: "Trần Mai Phương",
      phone: "0988776655",
      guestOf: "bride",
      attendance: "attending",
      guestCount: 1,
      dietaryOrNote: "Háo hức chờ ngày được ngắm cô dâu xinh đẹp nhất!",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

function saveRSVPs(list: RSVPSubmission[]) {
  try {
    fs.writeFileSync(rsvpsFilePath, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write to saved_rsvps.json (possibly read-only env):", err);
  }
}

// Global in-memory cache
let rsvpStore: RSVPSubmission[] = getStoredRSVPs();

export async function GET() {
  return NextResponse.json({
    success: true,
    data: rsvpStore,
    total: rsvpStore.length,
  });
}

/**
 * Tạo nội dung email HTML thuần Việt trang nhã gửi tới dâu rể
 */
function generateRSVPEmailHTML(rsvp: RSVPSubmission, weddingData: any) {
  const isAttending = rsvp.attendance === "attending";
  const guestSideText =
    rsvp.guestOf === "groom"
      ? "Khách của Chú Rể (Nhà Trai)"
      : rsvp.guestOf === "bride"
      ? "Khách của Cô Dâu (Nhà Gái)"
      : "Khách chung của Cả Hai";

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Thông Báo Xác Nhận Tham Dự Hôn Lễ</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #FDFAF5; font-family: 'Times New Roman', Georgia, serif; color: #354D2E;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 2px solid #E8D5CF; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
    <tr>
      <td style="background-color: #4A6741; padding: 28px 20px; text-align: center; color: #FDFAF5;">
        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #C9A84C; margin-bottom: 6px;">
          THIỆP CƯỚI TRỰC TUYẾN
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #FDFAF5; letter-spacing: 1px;">
          ${weddingData.groom.shortName} & ${weddingData.bride.shortName}
        </h1>
        <div style="font-size: 12px; color: #E8D5CF; margin-top: 6px; font-style: italic;">
          ${weddingData.weddingDateFormatted}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 24px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; background-color: #C4715A; color: #FDFAF5; font-size: 12px; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
            PHẢN HỒI THAM DỰ MỚI
          </span>
          <h2 style="font-size: 20px; color: #354D2E; margin: 12px 0 4px;">
            Khách Mời: <strong style="color: #C4715A;">${rsvp.fullName}</strong>
          </h2>
          <p style="font-size: 13px; color: #8C6A58; margin: 0;">
            ${guestSideText}
          </p>
        </div>

        <table width="100%" cellpadding="10" cellspacing="0" style="font-size: 14px; border-collapse: collapse; background-color: #FDFAF5; border: 1px solid #E8D5CF; border-radius: 8px;">
          <tr style="border-bottom: 1px solid #E8D5CF;">
            <td width="35%" style="color: #8C6A58; font-weight: bold;">Họ và Tên:</td>
            <td style="color: #354D2E; font-weight: bold;">${rsvp.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E8D5CF;">
            <td style="color: #8C6A58; font-weight: bold;">Số Điện Thoại:</td>
            <td><a href="tel:${rsvp.phone}" style="color: #C4715A; font-weight: bold; text-decoration: none;">${rsvp.phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #E8D5CF;">
            <td style="color: #8C6A58; font-weight: bold;">Tình Trạng:</td>
            <td style="font-weight: bold; color: ${isAttending ? "#2E7D32" : "#C62828"};">
              ${isAttending ? "Sẽ tham dự cùng dâu rể" : "Tiếc quá, vắng mặt"}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #E8D5CF;">
            <td style="color: #8C6A58; font-weight: bold;">Số Người Đi Cùng:</td>
            <td style="color: #354D2E; font-weight: bold;">${rsvp.guestCount} người</td>
          </tr>
          ${
            rsvp.dietaryOrNote
              ? `
          <tr>
            <td style="color: #8C6A58; font-weight: bold; vertical-align: top;">Lời Nhắn / Lời Chúc:</td>
            <td style="color: #5C4033; font-style: italic;">"${rsvp.dietaryOrNote}"</td>
          </tr>
          `
              : ""
          }
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
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

    const currentWeddingData = getLatestWeddingData();

    // 1. Phân luồng email nhận thông báo theo lựa chọn của khách
    const groomEmail =
      currentWeddingData.contactEmails?.groom || "congquyet.wedding@gmail.com";
    const brideEmail =
      currentWeddingData.contactEmails?.bride || "ngochan.wedding@gmail.com";

    let recipients: string[] = [];
    if (guestOf === "groom") {
      recipients = [groomEmail];
    } else if (guestOf === "bride") {
      recipients = [brideEmail];
    } else {
      recipients = [groomEmail, brideEmail];
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
      emailSentTo: recipients,
    };

    rsvpStore.unshift(newRSVP);
    saveRSVPs(rsvpStore);

    // 2. KÊNH 1: BẮN TIN NHẮN TELEGRAM NGAY TỨC THÌ ĐẾN ĐIỆN THOẠI CỦA DÂU RỂ
    try {
      const telegramText = formatRSVPTelegramMessage(newRSVP, currentWeddingData);
      await sendTelegramNotification(
        telegramText,
        currentWeddingData.notifications?.telegram
      );
    } catch (telegramErr) {
      console.warn("[Telegram Notification Error]:", telegramErr);
    }

    // 3. KÊNH 2: TỰ ĐỘNG GHI VÀO GOOGLE SHEETS QUA WEBHOOK
    try {
      await sendGoogleSheetWebhook(
        {
          type: "RSVP",
          id: newRSVP.id,
          fullName: newRSVP.fullName,
          phone: newRSVP.phone,
          guestOf: newRSVP.guestOf,
          attendance: newRSVP.attendance,
          guestCount: newRSVP.guestCount,
          dietaryOrNote: newRSVP.dietaryOrNote,
          createdAt: newRSVP.createdAt,
        },
        currentWeddingData.notifications?.googleSheet?.webhookUrl
      );
    } catch (sheetErr) {
      console.warn("[Google Sheet Webhook Error]:", sheetErr);
    }

    // 4. KÊNH 3: GỬI EMAIL THÔNG BÁO (Nếu có RESEND_API_KEY)
    const emailApiKey =
      currentWeddingData.notifications?.email?.resendApiKey ||
      process.env.RESEND_API_KEY;

    if (emailApiKey) {
      try {
        const emailHtml = generateRSVPEmailHTML(newRSVP, currentWeddingData);
        const subject = `[Thiệp Cưới] Khách ${newRSVP.fullName} (${
          guestOf === "groom"
            ? "Bạn Chú Rể"
            : guestOf === "bride"
            ? "Bạn Cô Dâu"
            : "Bạn Cả Hai"
        }) đã xác nhận tham dự!`;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${emailApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Thiệp Cưới <onboarding@resend.dev>",
            to: recipients,
            subject,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.warn("[RSVP Email Error]", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cảm ơn bạn đã phản hồi! Thông tin đã được chuyển tới dâu rể.",
      data: newRSVP,
      emailSentTo: recipients,
    });
  } catch (err: any) {
    console.error("RSVP Error:", err);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
