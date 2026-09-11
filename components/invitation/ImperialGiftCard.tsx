"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Sparkles, Download, ZoomIn, X, QrCode } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";
import { findBank, generateVietQrUrl, generateGenericQrUrl } from "@/utils/vietnamBanks";

export const ImperialGiftCard: React.FC = () => {
  const { showToast } = useToast();
  const { data: weddingData } = useWeddingData();
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentAccount =
    weddingData.bankAccounts?.find((acc) => acc.ownerType === activeTab) ||
    weddingData.bankAccounts?.[0] || {
      ownerType: "groom",
      label: "Mừng Cưới",
      bankName: "Ngân hàng",
      accountNumber: "",
      accountHolder: "",
      qrImageUrl: "",
    };

  // Reset imgError khi đổi tab dâu/rể
  useEffect(() => {
    setImgError(false);
  }, [activeTab]);

  // Xử lý link QR tối ưu: chuyển từ api.vietqr.io chậm sang img.vietqr.io siêu tốc
  const bank = findBank(currentAccount.bankCode || currentAccount.bankBin || currentAccount.bankName);
  const bin = bank?.bin || currentAccount.bankBin || "970436";

  let effectiveQrUrl = currentAccount.qrImageUrl?.trim() || "";
  if (!effectiveQrUrl && currentAccount.accountNumber) {
    effectiveQrUrl = generateVietQrUrl(bin, currentAccount.accountNumber, currentAccount.accountHolder, currentAccount.customNote || "");
  } else if (effectiveQrUrl.includes("api.vietqr.io/image/")) {
    effectiveQrUrl = effectiveQrUrl.replace("api.vietqr.io/image/", "img.vietqr.io/image/");
  }

  // URL dự phòng nếu ảnh chính bị lỗi tải
  const fallbackUrl = currentAccount.accountNumber
    ? generateGenericQrUrl(`STK: ${currentAccount.accountNumber} - ${currentAccount.bankName} - ${currentAccount.accountHolder}`)
    : "";

  const displayQrUrl = imgError && fallbackUrl ? fallbackUrl : effectiveQrUrl;

  const handleCopy = async (accountNumber: string) => {
    if (!accountNumber) return;
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      showToast("Đã sao chép số tài khoản!", "success");
      setTimeout(() => {
        setCopiedAccount(null);
      }, 2500);
    } catch {
      showToast("Không thể sao chép số tài khoản", "info");
    }
  };

  const handleDownloadQr = async () => {
    if (!displayQrUrl) return;
    try {
      // Nếu là ảnh data:image hoặc blob, tải trực tiếp
      if (displayQrUrl.startsWith("data:image/")) {
        const a = document.createElement("a");
        a.href = displayQrUrl;
        a.download = `QR-MungCuoi-${activeTab === "groom" ? "ChuRe" : "CoDau"}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Đã lưu mã QR thành công!", "success");
        return;
      }

      // Đối với URL ngoài, mở tab mới để tải hoặc lưu ảnh an toàn
      const res = await fetch(displayQrUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `QR-MungCuoi-${activeTab === "groom" ? "ChuRe" : "CoDau"}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      showToast("Đã tải mã QR về máy!", "success");
    } catch {
      window.open(displayQrUrl, "_blank");
      showToast("Đã mở ảnh mã QR trong tab mới để lưu", "info");
    }
  };

  return (
    <section
      id="gift"
      className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none"
      style={{ backgroundColor: "#140305" }}
    >
      {/* Nền gấm sâu thẳm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, #2A0508 0%, #160305 60%, #0B0102 100%)",
        }}
      />

      <div className="max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-10">
        {/* Header - Hộp Mừng Cưới Chúc Phúc */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
              TRÁP CƯỚI CÁT TƯỜNG
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF8D6] tracking-wide">
            Hộp Mừng Cưới Chúc Phúc
          </h2>

          <div
            className="mx-auto mt-3 h-[1.5px] w-28 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #E5C368, transparent)" }}
          />

          <p className="text-xs sm:text-sm text-[#E8D5CF] italic font-serif max-w-md mx-auto mt-3 leading-relaxed">
            Sự hiện diện của quý quan khách là niềm vinh hạnh lớn nhất của gia đình. Nếu muốn gửi lời mừng từ phương xa, quý khách có thể quét mã QR hoặc gửi qua tài khoản cát tường dưới đây.
          </p>
        </motion.div>

        {/* Khung Tráp Cưới Sơn Son Thiếp Vàng */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-9 border-2 border-[#E5C368]/80 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(229,195,104,0.18)] text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(155deg, #260507 0%, #190305 60%, #100203 100%)",
          }}
        >
          {/* Viền hoa văn chỉ vàng nội thất */}
          <div className="absolute inset-2 rounded-2xl border border-dashed border-[#FDE68A]/25 pointer-events-none" />

          {/* Dấu triện HỶ */}
          <div className="absolute top-4 right-4 opacity-40 pointer-events-none hidden sm:block">
            <RedSealStamp text="HỶ" size={32} />
          </div>

          {/* Tabs đổi Chú Rể / Cô Dâu */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="inline-flex p-1.5 bg-[#1C0406] border border-[#E5C368]/50 rounded-full shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("groom")}
                className={`px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                  activeTab === "groom"
                    ? "bg-[#3D0A0E] text-[#FFF8D6] border border-[#FDE68A] shadow-[0_0_12px_rgba(229,195,104,0.4)]"
                    : "text-[#E8D5CF] hover:text-[#FFF8D6]"
                }`}
              >
                Mừng Chú Rể ({weddingData.groom.shortName})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bride")}
                className={`px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                  activeTab === "bride"
                    ? "bg-[#BA1B22] text-[#FFF8D6] border border-[#FDE68A] shadow-[0_0_12px_rgba(229,195,104,0.4)]"
                    : "text-[#E8D5CF] hover:text-[#FFF8D6]"
                }`}
              >
                Mừng Cô Dâu ({weddingData.bride.shortName})
              </button>
            </div>
          </div>

          {/* Chi tiết tài khoản - 2 cột trên Desktop, 1 cột trên Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center relative z-10">
            {/* Cột 1: Mã QR trong Khung Mạ Vàng */}
            <div className="flex flex-col items-center justify-center">
              <div
                onClick={() => setIsZoomOpen(true)}
                className="group relative w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border-2 border-[#E5C368] shadow-[0_0_20px_rgba(229,195,104,0.35)] cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                title="Chạm để xem ảnh phóng to"
              >
                {displayQrUrl ? (
                  <Image
                    src={displayQrUrl}
                    alt={`Mã QR ${currentAccount.label}`}
                    fill
                    unoptimized
                    onError={() => setImgError(true)}
                    className="object-contain p-2"
                    sizes="250px"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                    <QrCode className="w-12 h-12 mb-2 text-[#BA1B22]/60" />
                    <span className="text-xs text-[#3B090D] font-serif">Chưa có mã QR</span>
                  </div>
                )}

                {/* Overlay hover phóng to */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-[#FFF8D6] text-xs font-serif font-bold">
                  <ZoomIn className="w-4 h-4" />
                  <span>Phóng to</span>
                </div>
              </div>

              {/* Nút thao tác dưới ảnh QR */}
              <div className="flex items-center gap-2 mt-3.5">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2A0508] hover:bg-[#3D0A0E] text-[#FFF8D6] border border-[#E5C368]/70 text-xs font-serif font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>Lưu ảnh QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-[#E8D5CF] hover:text-[#FFF8D6] border border-[#E5C368]/40 text-xs font-serif transition-all active:scale-95 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>Xem to</span>
                </button>
              </div>

              <span className="text-[11px] text-[#FDE68A] uppercase tracking-wider font-serif font-semibold mt-2">
                Quét mã chuyển khoản tiện lợi
              </span>
            </div>

            {/* Cột 2: Thông tin chi tiết ngân hàng & nút sao chép */}
            <div className="space-y-3.5 w-full text-left bg-[#1B0305] p-5 sm:p-6 rounded-2xl border border-[#E5C368]/50 shadow-inner">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold">
                  Ngân Hàng Tiếp Nhận
                </div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#FFF8D6] mt-0.5 flex items-center justify-between">
                  <span>{currentAccount.bankName}</span>
                  {currentAccount.bankCode && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#BA1B22]/40 text-[#FDE68A] border border-[#E5C368]/30 font-mono">
                      {currentAccount.bankCode}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E5C368]/30">
                <div className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold">
                  Số Tài Khoản
                </div>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#FDE68A] tracking-wider select-all">
                    {currentAccount.accountNumber || "Chưa cập nhật"}
                  </span>
                  {currentAccount.accountNumber && (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAccount.accountNumber)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3D0A0E] hover:bg-[#520E13] text-[#FFF8D6] border border-[#E5C368] text-xs font-serif font-bold transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
                    >
                      {copiedAccount === currentAccount.accountNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#68D391]" />
                          <span className="text-[#68D391]">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#FDE68A]" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E5C368]/30">
                <div className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold">
                  Chủ Tài Khoản
                </div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#FFF8D6] mt-0.5 uppercase tracking-wide">
                  {currentAccount.accountHolder || "Chưa cập nhật"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MODAL PHÓNG TO MÃ QR */}
      <AnimatePresence>
        {isZoomOpen && displayQrUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm sm:max-w-md w-full bg-[#1F0407] border-2 border-[#E5C368] rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_50px_rgba(229,195,104,0.5)] cursor-default"
            >
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 border border-[#E5C368]/60 flex items-center justify-center text-[#FFF8D6] hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-xs uppercase tracking-[0.25em] text-[#FDE68A] font-serif font-bold mb-1">
                MÃ VIETQR MỪNG CƯỚI
              </div>
              <div className="font-serif font-bold text-base text-[#FFF8D6] mb-4">
                {currentAccount.label || (activeTab === "groom" ? `Mừng Chú Rể (${weddingData.groom.fullName})` : `Mừng Cô Dâu (${weddingData.bride.fullName})`)}
              </div>

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto bg-white p-3 rounded-2xl border-2 border-[#E5C368] shadow-lg mb-4">
                <Image
                  src={displayQrUrl}
                  alt="Mã QR phóng to"
                  fill
                  unoptimized
                  className="object-contain p-2"
                  sizes="320px"
                />
              </div>

              <div className="bg-[#140204] p-3 rounded-xl border border-[#E5C368]/40 text-left text-xs text-[#FFF8D6] space-y-1 mb-4">
                <div><span className="text-[#FDE68A]">Ngân hàng:</span> {currentAccount.bankName}</div>
                <div><span className="text-[#FDE68A]">Số TK:</span> <span className="font-mono font-bold text-[#FDE68A]">{currentAccount.accountNumber}</span></div>
                <div><span className="text-[#FDE68A]">Chủ TK:</span> {currentAccount.accountHolder}</div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BA1B22] hover:bg-[#991B1B] text-[#FFF8D6] border border-[#E5C368] text-xs font-serif font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh về máy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-transparent hover:bg-white/10 text-[#E8D5CF] border border-white/20 text-xs font-serif transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
