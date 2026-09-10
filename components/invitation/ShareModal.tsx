"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, Share2, QrCode, Lock, ExternalLink } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";
import { useToast } from "@/components/ui/Toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { data } = useWeddingData();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  const slug = data.slug || "quyet-han";
  const shortLink = `${origin}/i/${slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    shortLink
  )}&bgcolor=FAF3E8&color=183A3A&margin=10`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      showToast("Đã sao chép link rút gọn cho khách!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Không thể sao chép liên kết", "info");
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: `Thiệp Cưới • ${data.groom.shortName} & ${data.bride.shortName}`,
      text: `${data.welcomeQuote} — Kính mời bạn tới chung vui cùng chúng mình vào ${data.weddingDateFormatted}!`,
      url: shortLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortLink)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToZalo = () => {
    window.open(
      `https://zalo.me/share?url=${encodeURIComponent(shortLink)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#183A3A]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-[#FFF9EE] border-2 border-[#EADBCE] rounded-2xl p-6 sm:p-7 shadow-2xl text-center">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8A7569] hover:bg-[#FAF3E8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="flex justify-center mb-2">
          <RedSealStamp size={36} text="HỶ" className="bg-[#9E3D32] text-[10px]" />
        </div>

        <h3 className="font-serif font-bold text-xl text-[#183A3A] tracking-wide">
          Chia Sẻ Thiệp Cưới
        </h3>
        <p className="text-xs text-[#6B5549] mt-1 italic">
          Link rút gọn dành riêng cho khách mời
        </p>

        {/* Badge: Chỉ Đọc - Không Thể Chỉnh Sửa */}
        <div className="my-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-medium">
          <Lock className="w-3 h-3 text-emerald-700" />
          <span>Chế độ khách xem: Hoàn toàn bảo mật, không thể chỉnh sửa</span>
        </div>

        {/* Khung Link Rút Gọn */}
        <div className="mt-4 p-3 bg-[#FAF3E8] border border-[#E5D4B6] rounded-xl text-left space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#78928A]">
            Đường dẫn rút gọn (Short Link)
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold text-[#9E3D32] truncate">
              {shortLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-xs font-medium transition-all active:scale-95 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mã QR Quét Trên Điện Thoại */}
        <div className="my-5 flex flex-col items-center">
          <div className="relative w-44 h-44 bg-white p-2.5 rounded-xl border border-[#EADBCE] shadow-xs">
            <img
              src={qrCodeUrl}
              alt="Mã QR thiệp cưới"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[11px] text-[#8A7569] mt-2 italic">
            Quét mã QR bằng Camera điện thoại hoặc Zalo để mở thiệp ngay
          </span>
        </div>

        {/* Nút Chia Sẻ Mạng Xã Hội */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EADBCE]">
          <button
            type="button"
            onClick={shareToZalo}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs font-semibold transition-all"
          >
            <span>Gửi Zalo</span>
          </button>

          <button
            type="button"
            onClick={shareToFacebook}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#1877F2] hover:bg-[#155fc0] text-white text-xs font-semibold transition-all"
          >
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-xs font-semibold transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Khác</span>
          </button>
        </div>

        {/* Nút Mở thử link khách xem */}
        <div className="mt-4 text-center">
          <a
            href={shortLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#78928A] hover:text-[#9E3D32] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở xem thử giao diện khách xem</span>
          </a>
        </div>
      </div>
    </div>
  );
};
