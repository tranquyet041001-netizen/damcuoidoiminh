"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Gift } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";

export const ImperialGiftCard: React.FC = () => {
  const { showToast } = useToast();
  const { data: weddingData } = useWeddingData();
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const currentAccount =
    weddingData.bankAccounts.find((acc) => acc.ownerType === activeTab) ||
    weddingData.bankAccounts[0];

  const handleCopy = async (accountNumber: string) => {
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
            Sự hiện diện của quý quan khách là niềm vinh hạnh lớn nhất của gia đình. Nếu muốn gửi lời mừng từ phương xa, quý khách có thể gửi qua tài khoản cát tường dưới đây.
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
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border-2 border-[#E5C368] shadow-[0_0_20px_rgba(229,195,104,0.3)]">
                <Image
                  src={currentAccount.qrImageUrl}
                  alt={`Mã QR ${currentAccount.label}`}
                  fill
                  className="object-contain p-2"
                  sizes="250px"
                />
              </div>
              <span className="text-[11px] text-[#FDE68A] uppercase tracking-wider font-serif font-semibold mt-3">
                Quét mã VietQR tiện lợi
              </span>
            </div>

            {/* Cột 2: Thông tin chi tiết ngân hàng & nút sao chép */}
            <div className="space-y-3.5 w-full text-left bg-[#1B0305] p-5 sm:p-6 rounded-2xl border border-[#E5C368]/50">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold">
                  Ngân Hàng Tiếp Nhận
                </div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#FFF8D6] mt-0.5">
                  {currentAccount.bankName}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E5C368]/30">
                <div className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold">
                  Số Tài Khoản
                </div>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#FDE68A] tracking-wider">
                    {currentAccount.accountNumber}
                  </span>
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
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E5C368]/30">
                <div className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold">
                  Chủ Tài Khoản
                </div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#FFF8D6] mt-0.5 uppercase tracking-wide">
                  {currentAccount.accountHolder}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
