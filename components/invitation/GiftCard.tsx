"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, QrCode } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

export const GiftCard: React.FC = () => {
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
    <section id="gift" className="py-16 px-4 bg-ivory-texture relative overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <VietnameseLotus size={36} color="#4A6741" opacity={0.85} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4715A] font-sans font-semibold mb-1">
            Hộp Mừng Cưới
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#354D2E] tracking-wide">
            Mừng Cưới Chúc Phúc
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-sm mx-auto">
            Sự hiện diện của quý khách là món quà trọn vẹn nhất. Nếu muốn gửi lời chúc mừng từ xa, quý khách có thể chuyển qua tài khoản bên dưới.
          </p>
        </motion.div>

        {/* Card Chuyển Khoản */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-9 bg-[#FFFDF9] border border-[#E8D5CF] shadow-xs text-center"
        >
          {/* Tabs đổi Chú Rể / Cô Dâu */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-[#F0F5EE] border border-[#A8BCA1]/30 rounded-full">
              <button
                type="button"
                onClick={() => setActiveTab("groom")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all ${
                  activeTab === "groom"
                    ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                    : "text-[#5C4033] hover:text-[#354D2E]"
                }`}
              >
                Mừng Chú Rể ({weddingData.groom.shortName})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bride")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all ${
                  activeTab === "bride"
                    ? "bg-[#C4715A] text-[#FDFAF5] shadow-xs"
                    : "text-[#5C4033] hover:text-[#354D2E]"
                }`}
              >
                Mừng Cô Dâu ({weddingData.bride.shortName})
              </button>
            </div>
          </div>

          {/* Chi tiết tài khoản */}
          <div className="flex flex-col items-center">
            {/* Mã QR viền vàng mật thanh lịch */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border-2 border-[#C9A84C]/40 shadow-xs mb-6">
              <Image
                src={currentAccount.qrImageUrl}
                alt={`Mã QR ${currentAccount.label}`}
                fill
                className="object-contain p-2"
                sizes="250px"
              />
            </div>

            <div className="space-y-3 max-w-sm w-full text-left bg-[#FDFAF5] p-5 rounded-2xl border border-[#E8D5CF]">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold">
                  Ngân Hàng
                </div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#354D2E]">
                  {currentAccount.bankName}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8D5CF]">
                <div className="text-[10px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold">
                  Số Tài Khoản
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#C4715A] tracking-wider">
                    {currentAccount.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentAccount.accountNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#F0F5EE] text-[#4A6741] border border-[#A8BCA1]/40 text-xs font-serif font-semibold transition-all active:scale-95"
                  >
                    {copiedAccount === currentAccount.accountNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Đã chép</span>
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

              <div className="pt-2 border-t border-[#E8D5CF]">
                <div className="text-[10px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold">
                  Chủ Tài Khoản
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#354D2E] uppercase tracking-wide">
                  {currentAccount.accountHolder}
                </div>
              </div>

              {currentAccount.customNote && (
                <div className="pt-2 text-[11px] text-[#8C6A58] italic font-serif">
                  Nội dung chuyển khoản gợi ý: &ldquo;{currentAccount.customNote}&rdquo;
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
