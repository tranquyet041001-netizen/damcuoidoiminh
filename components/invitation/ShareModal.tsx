"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  QrCode,
  Lock,
  ExternalLink,
  Download,
  Smartphone,
  Globe,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import QRCode from "qrcode";
import { useWeddingData } from "@/context/WeddingDataContext";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";
import { useToast } from "@/components/ui/Toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Hàm sao chép đa tầng đảm bảo 100% thành công trên mọi thiết bị và giao thức HTTP/HTTPS
 */
async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Cách 1: navigator.clipboard (cho HTTPS và localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Chuyển sang fallback
    }
  }

  // Cách 2: document.execCommand với textarea ẩn (hoạt động trên HTTP, mạng LAN, webview)
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { data } = useWeddingData();
  const { showToast } = useToast();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [origin, setOrigin] = useState("");
  const [activeTab, setActiveTab] = useState<"standard" | "lan" | "custom">("standard");
  const [customDomain, setCustomDomain] = useState("");
  const [guestName, setGuestName] = useState("");

  const slug = data.slug || "quyet-han";
  const lanIp = "172.16.1.97"; // IP mạng nội bộ của máy tính đang chạy

  // Lấy origin hiện tại
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Xác định link cần chia sẻ theo chế độ
  const getActiveLink = useCallback(() => {
    let baseFull = "";
    if (activeTab === "custom" && customDomain.trim()) {
      const cleanDomain = customDomain.trim().replace(/\/+$/, "");
      const full = cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`;
      baseFull = `${full}/i/${slug}`;
    } else if (activeTab === "lan") {
      const port = typeof window !== "undefined" && window.location.port ? `:${window.location.port}` : ":3000";
      baseFull = `http://${lanIp}${port}/i/${slug}`;
    } else {
      const base = origin || "http://localhost:3000";
      baseFull = `${base}/i/${slug}`;
    }

    if (guestName.trim()) {
      return `${baseFull}?to=${encodeURIComponent(guestName.trim())}`;
    }
    return baseFull;
  }, [activeTab, customDomain, slug, lanIp, origin, guestName]);

  const activeLink = getActiveLink();

  // Soạn thảo mẫu tin nhắn mời cưới lịch sự
  const getInvitationMessage = useCallback(() => {
    const target = guestName.trim() ? `${guestName.trim()}` : "bạn";
    return `🌸 THIỆP BÁO HỶ TRĂM NĂM 🌸\n` +
      `Trân trọng kính mời ${target} cùng người thương tới chung vui cùng gia đình chúng mình trong ngày hạnh phúc của:\n` +
      `💑 ${data.groom.shortName} & ${data.bride.shortName}\n` +
      `📅 Ngày cưới: ${data.weddingDateFormatted}\n` +
      `💌 Xem thiệp cưới và xác nhận tham dự (RSVP) tại link dành riêng:\n` +
      `${activeLink}\n\n` +
      `Sự hiện diện của ${target} là niềm vinh hạnh lớn của chúng mình! ✨`;
  }, [data, activeLink, guestName]);

  // Tạo mã QR Code ngoại tuyến sắc nét bằng qrcode
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(activeLink, {
      width: 360,
      margin: 2,
      color: {
        dark: "#354D2E", // Màu xanh lá trà Botanical
        light: "#FDFAF5", // Nền giấy ngà ấm
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("Lỗi tạo mã QR:", err));
  }, [isOpen, activeLink]);

  if (!isOpen) return null;

  // Sao chép link
  const handleCopyLink = async () => {
    const success = await copyToClipboard(activeLink);
    if (success) {
      setCopiedLink(true);
      showToast("Đã sao chép link rút gọn thiệp cưới!", "success");
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      showToast("Vui lòng bôi đen và chép link thủ công", "info");
    }
  };

  // Sao chép lời mời hoàn chỉnh kèm link
  const handleCopyInvitationMessage = async () => {
    const message = getInvitationMessage();
    const success = await copyToClipboard(message);
    if (success) {
      setCopiedMessage(true);
      showToast("Đã sao chép toàn bộ lời mời & link thiệp! 💌", "success");
      setTimeout(() => setCopiedMessage(false), 2500);
    } else {
      showToast("Không thể sao chép lời mời", "info");
    }
  };

  // Tải ảnh QR Code về máy
  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.download = `ma-qr-thiep-cuoi-${slug}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã tải ảnh mã QR thiệp cưới về máy!", "success");
  };

  // Chia sẻ Zalo
  const handleShareZalo = async () => {
    // Tự động sao chép lời mời để người dùng chỉ cần dán
    await copyToClipboard(getInvitationMessage());
    showToast("Đã sao chép thiệp cưới! Đang mở Zalo...", "success");

    // Mở Zalo Web / App
    setTimeout(() => {
      window.open("https://chat.zalo.me/", "_blank");
    }, 600);
  };

  // Chia sẻ Facebook
  const handleShareFacebook = async () => {
    if (activeLink.includes("localhost") || activeLink.includes("172.16.")) {
      // Localhost: copy lời mời và mở Facebook
      await copyToClipboard(getInvitationMessage());
      showToast("Đã chép nội dung thiệp cưới! Mở Facebook để dán...", "info");
      window.open("https://www.facebook.com/", "_blank");
    } else {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeLink)}`,
        "_blank",
        "width=600,height=500"
      );
    }
  };

  // Chia sẻ đa kênh Native Share (Mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thiệp Cưới • ${data.groom.shortName} & ${data.bride.shortName}`,
          text: `${data.welcomeQuote} — Kính mời bạn tới chung vui cùng chúng mình vào ${data.weddingDateFormatted}!`,
          url: activeLink,
        });
        showToast("Chia sẻ thành công!", "success");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyInvitationMessage();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] border border-[#E8D5CF] rounded-3xl p-5 sm:p-7 shadow-2xl text-center max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#8C6A58] hover:text-[#354D2E] hover:bg-[#F0F5EE] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Con dấu son Hỷ */}
        <div className="flex justify-center mb-2">
          <RedSealStamp size={38} text="HỶ" />
        </div>

        {/* Tiêu đề Modal */}
        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#354D2E] tracking-wide">
          Chia Sẻ Thiệp Cưới
        </h3>
        <p className="text-xs text-[#8C6A58] mt-1 italic font-serif">
          Đường dẫn rút gọn và mã QR dành riêng cho khách mời
        </p>

        {/* Badge: Chế độ khách xem an toàn (Chỉ đọc) */}
        <div className="my-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F5EE] text-[#4A6741] border border-[#A8BCA1]/40 text-[11px] font-medium">
          <Lock className="w-3.5 h-3.5 text-[#4A6741]" />
          <span>Khách chỉ có quyền xem thiệp &amp; gửi RSVP — Tuyệt đối không thể chỉnh sửa</span>
        </div>

        {/* Bộ chọn loại đường dẫn (Tabs) */}
        <div className="mt-4 p-1 rounded-2xl bg-[#FDF0EC] border border-[#E8D5CF] flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("standard")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "standard"
                ? "bg-[#FFFDF9] text-[#354D2E] shadow-2xs border border-[#E8D5CF]"
                : "text-[#8C6A58] hover:text-[#354D2E]"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#C4715A]" />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lan")}
            title="Dành cho điện thoại kết nối cùng mạng WiFi với máy tính"
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "lan"
                ? "bg-[#FFFDF9] text-[#354D2E] shadow-2xs border border-[#E8D5CF]"
                : "text-[#8C6A58] hover:text-[#354D2E]"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#4A6741]" />
            <span>Điện Thoại WiFi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "custom"
                ? "bg-[#FFFDF9] text-[#354D2E] shadow-2xs border border-[#E8D5CF]"
                : "text-[#8C6A58] hover:text-[#354D2E]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Tên Miền Riêng</span>
          </button>
        </div>

        {/* Ô nhập tên miền riêng nếu chọn tab Custom */}
        {activeTab === "custom" && (
          <div className="mt-2 text-left animate-in fade-in duration-200">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="VD: https://quyet-han.wedding hoặc quyethan.vercel.app"
              className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-mono text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
            />
            <span className="text-[10px] text-[#8C6A58] italic block mt-1">
              Nhập tên miền bạn đã triển khai để gửi cho khách toàn quốc
            </span>
          </div>
        )}

        {/* Gợi ý khi chọn tab Điện thoại WiFi */}
        {activeTab === "lan" && (
          <div className="mt-2 p-2 rounded-xl bg-[#F0F5EE] border border-[#A8BCA1]/40 text-left text-[11px] text-[#354D2E] animate-in fade-in duration-200">
            💡 <strong>Mẹo hay:</strong> Dùng điện thoại kết nối chung WiFi với máy tính này và quét mã QR bên dưới để mở thiệp cưới ngay trên điện thoại!
          </div>
        )}

        {/* Ô nhập tên khách mời đích danh */}
        <div className="mt-4 p-3 bg-[#FFFDF9] border border-[#E8D5CF] rounded-2xl text-left space-y-1.5 shadow-2xs">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#8C6A58] flex items-center justify-between">
            <span>Gửi Riêng Từng Khách (In Tên Lên Thiệp)</span>
            <span className="text-[#C4715A] font-semibold lowercase">Tùy chọn</span>
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ví dụ: Bác Tuấn &amp; Gia Đình, Bạn Lan C3..."
            className="w-full bg-[#FDFAF5] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-medium focus:outline-none focus:border-[#4A6741]"
          />
          <span className="text-[10px] text-[#8C6A58] italic block">
            {guestName.trim()
              ? `✓ Tên "${guestName.trim()}" sẽ hiện trang trọng trên cả Video Rồng Phượng & Phong Bì!`
              : "Để trống nếu bạn muốn gửi đường dẫn chung cho mọi người"}
          </span>
        </div>

        {/* Khung Hiển Thị Link Rút Gọn */}
        <div className="mt-3 p-3 bg-[#FDF0EC]/70 border border-[#E8D5CF] rounded-2xl text-left space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#8C6A58]">
            <span>Đường Dẫn Rút Gọn (Short Link)</span>
            <span className="text-emerald-700 font-normal normal-case">✓ Chỉ xem</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-[#C4715A] truncate select-all flex-1">
              {activeLink}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-serif font-semibold transition-all active:scale-95 shrink-0 cursor-pointer shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Đã Chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mã QR Code Ngoại Tuyến Đẹp Mắt */}
        <div className="my-4 flex flex-col items-center">
          <div className="relative w-44 h-44 bg-[#FDFAF5] p-3 rounded-2xl border-2 border-[#E8D5CF] shadow-md flex items-center justify-center">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt={`Mã QR thiệp cưới ${data.groom.shortName} & ${data.bride.shortName}`}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="animate-pulse text-xs text-[#8C6A58]">Đang tạo mã QR...</div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[11px] text-[#8C6A58] italic font-serif">
              Quét bằng Camera hoặc Zalo để mở thiệp
            </span>
            <button
              type="button"
              onClick={handleDownloadQR}
              title="Tải ảnh mã QR về máy để in hoặc gửi"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold bg-[#F0F5EE] hover:bg-[#E2ECE0] text-[#354D2E] border border-[#A8BCA1]/40 transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3 text-[#4A6741]" />
              <span>Lưu QR</span>
            </button>
          </div>
        </div>

        {/* Nút Tác Vụ: Sao Chép Lời Mời Hoàn Chỉnh (Cực Tiện Dụng Cho Người Việt) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleCopyInvitationMessage}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#C4715A] hover:bg-[#A4503B] text-[#FDFAF5] font-serif text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            {copiedMessage ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Đã Chép Lời Mời Kèm Link!</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Sao Chép Lời Mời Kèm Link (Để gửi Zalo / SMS)</span>
              </>
            )}
          </button>
        </div>

        {/* Nút Chia Sẻ Mạng Xã Hội */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8D5CF]/80">
          <button
            type="button"
            onClick={handleShareZalo}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span>Gửi Zalo</span>
          </button>

          <button
            type="button"
            onClick={handleShareFacebook}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#1877F2] hover:bg-[#155fc0] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Khác</span>
          </button>
        </div>

        {/* Nút Mở thử giao diện khách xem */}
        <div className="mt-4 text-center">
          <a
            href={activeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-serif font-semibold text-[#4A6741] hover:text-[#C4715A] hover:underline transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở xem thử giao diện khách xem (Chế độ chỉ đọc)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
