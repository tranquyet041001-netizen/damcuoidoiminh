import { NextResponse } from "next/server";
import { RSVPSubmission } from "@/types/wedding";
import { weddingData } from "@/data/wedding";

// In-memory store for RSVPs and sent email logs
const rsvpStore: RSVPSubmission[] = [
  {
    id: "rsvp-1",
    fullName: "Nguyễn Văn Đức",
    phone: "0901234567",
    guestOf: "groom",
    attendance: "attending",
    guestCount: 2,
    dietaryOrNote: "Chúc hai bạn trăm năm hạnh phúc, viên mãn!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    emailSentTo: [weddingData.contactEmails?.groom || "chure@gmail.com"],
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
    emailSentTo: [weddingData.contactEmails?.bride || "codau@gmail.com"],
  },
];

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
function generateRSVPEmailHTML(rsvp: RSVPSubmission, recipients: string[]) {
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
<body style="margin: 0; padding: 24px; background-color: #F4E8D2; font-family: 'Times New Roman', Georgia, serif; color: #3A2D26;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFF9EE; border: 2px solid #E5D4B6; border-radius: 8px; box-shadow: 0 4px 20px rgba(58, 45, 38, 0.1); overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="background-color: #183A3A; padding: 28px 20px; text-align: center; color: #FFF9EE;">
        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; margin-bottom: 6px;">
          THIỆP CƯỚI TRỰC TUYẾN
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: normal; color: #FFF9EE; letter-spacing: 1px;">
          ${weddingData.groom.shortName} & ${weddingData.bride.shortName}
        </h1>
        <div style="font-size: 12px; color: #78928A; margin-top: 6px; font-style: italic;">
          ${weddingData.weddingDateFormatted}
        </div>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 28px 24px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; background-color: #9E3D32; color: #FFF9EE; font-size: 12px; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
            PHẢN HỒI THAM DỰ MỚI
          </span>
          <h2 style="font-size: 20px; color: #183A3A; margin: 12px 0 4px;">
            Khách Mời: <strong style="color: #9E3D32;">${rsvp.fullName}</strong>
          </h2>
          <p style="font-size: 13px; color: #78928A; margin: 0;">
            ${guestSideText}
          </p>
        </div>

        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px; border-collapse: collapse; background-color: #FAF3E8; border: 1px solid #E5D4B6; border-radius: 4px;">
          <tr style="border-bottom: 1px solid #EADBCE;">
            <td width="35%" style="color: #6B5549; font-weight: bold;">Họ và Tên:</td>
            <td style="color: #183A3A; font-weight: bold;">${rsvp.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EADBCE;">
            <td style="color: #6B5549; font-weight: bold;">Số Điện Thoại:</td>
            <td><a href="tel:${rsvp.phone}" style="color: #9E3D32; font-weight: bold; text-decoration: none;">${rsvp.phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #EADBCE;">
            <td style="color: #6B5549; font-weight: bold;">Tình Trạng:</td>
            <td style="color: ${isAttending ? '#1b7340' : '#8A7569'}; font-weight: bold;">
              ${isAttending ? '✓ Sẽ Tham Dự Hôn Lễ' : '✗ Rất Tiếc Vắng Mặt & Gửi Lời Chúc'}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #EADBCE;">
            <td style="color: #6B5549; font-weight: bold;">Số Khách Đi Cùng:</td>
            <td style="color: #183A3A; font-weight: bold;">${rsvp.guestCount} người</td>
          </tr>
          <tr>
            <td style="color: #6B5549; font-weight: bold;" valign="top">Lời Nhắn / Ghi Chú:</td>
            <td style="color: #3A2D26; font-style: italic;">${rsvp.dietaryOrNote || 'Không có ghi chú thêm.'}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 14px; background-color: #FFF9EE; border-left: 3px solid #9E3D32; font-size: 13px; color: #5A473E;">
          Email này được tự động gửi tới: <strong>${recipients.join(', ')}</strong> căn cứ theo lựa chọn đối tượng khách mời.
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #FAF3E8; border-top: 1px solid #E5D4B6; padding: 16px; text-align: center; font-size: 11px; color: #8A7569;">
        © 2027 ${weddingData.groom.shortName} & ${weddingData.bride.shortName} • Thiệp cưới Việt Cổ
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

    // 1. Phân luồng email nhận thông báo theo lựa chọn của khách
    const groomEmail = weddingData.contactEmails?.groom || "quangminh.wedding@gmail.com";
    const brideEmail = weddingData.contactEmails?.bride || "thucan.wedding@gmail.com";

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

    // 2. Gửi email thông báo (Nếu có RESEND_API_KEY hoặc log mô phỏng)
    const emailHtml = generateRSVPEmailHTML(newRSVP, recipients);
    const subject = `[Thiệp Cưới] Khách ${newRSVP.fullName} (${
      guestOf === "groom" ? "Bạn Chú Rể" : guestOf === "bride" ? "Bạn Cô Dâu" : "Bạn Cả Hai"
    }) đã xác nhận tham dự!`;

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Thiệp Cưới <onboarding@resend.dev>",
            to: recipients,
            subject,
            html: emailHtml,
          }),
        });
        console.log(`[RSVP Email] Successfully sent email to: ${recipients.join(", ")}`);
      } catch (emailErr) {
        console.error("[RSVP Email Error]", emailErr);
      }
    } else {
      // Chế độ phát triển hoặc khi chưa gắn API Key: Ghi log định tuyến thành công
      console.log(`[RSVP Email Dispatched via Simulation]:`);
      console.log(`- To: ${recipients.join(", ")}`);
      console.log(`- Subject: ${subject}`);
      console.log(`- Guest: ${newRSVP.fullName} (${newRSVP.phone})`);
    }

    return NextResponse.json({
      success: true,
      message: "Cảm ơn bạn đã phản hồi! Thông tin đã được chuyển tới dâu rể.",
      data: newRSVP,
      emailSentTo: recipients,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
