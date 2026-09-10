"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, QrCode } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PaperCard } from "@/components/ui/PaperTexture";
import { useToast } from "@/components/ui/Toast";

export const GiftCard: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const currentAccount = weddingData.bankAccounts.find(
    (acc) => acc.ownerType === activeTab
  ) || weddingData.bankAccounts[0];

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
    <section id="gift" className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          subtitle="Hộp Mừng Cưới"
          title="Mừng Cưới Chúc Phúc"
          description="Sự hiện diện của bạn là món quà ý nghĩa nhất. Nếu muốn gửi thêm lời chúc mừng từ xa, bạn có thể gửi qua số tài khoản dưới đây."
          variant="birds"
        />

        <PaperCard className="text-center">
          {/* Tabs chuyển đổi Chú Rể / Cô Dâu */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-[#FAF3E8] border border-[#E5D4B6] rounded-full">
              <button
                type="button"
                onClick={() => setActiveTab("groom")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-serif font-medium transition-all ${
                  activeTab === "groom"
                    ? "bg-[#183A3A] text-[#FFF9EE] shadow-xs"
                    : "text-[#6B5549] hover:text-[#183A3A]"
                }`}
              >
                Mừng Chú Rể (Quang Minh)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bride")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-serif font-medium transition-all ${
                  activeTab === "bride"
                    ? "bg-[#9E3D32] text-[#FFF9EE] shadow-xs"
                    : "text-[#6B5549] hover:text-[#183A3A]"
                }`}
              >
                Mừng Cô Dâu (Thục An)
              </button>
            </div>
          </div>

          {/* Chi tiết tài khoản ngân hàng */}
          <div className="flex flex-col items-center">
            {/* Mã QR */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-md border border-[#E5D4B6] shadow-sm mb-5">
              <Image
                src={currentAccount.qrImageUrl}
                alt={`Mã QR ${currentAccount.label}`}
                fill
                className="object-contain p-2"
                sizes="250px"
              />
            </div>

            <div className="space-y-2 max-w-sm w-full text-left bg-[#FAF3E8] p-4 rounded-sm border border-[#EADBCE]">
              <div className="text-xs uppercase tracking-wider text-[#78928A] font-semibold">
                Ngân Hàng
              </div>
              <div className="font-serif font-semibold text-sm sm:text-base text-[#183A3A]">
                {currentAccount.bankName}
              </div>

              <div className="pt-2 border-t border-[#EADBCE]">
                <div className="text-xs uppercase tracking-wider text-[#78928A] font-semibold">
                  Số Tài Khoản
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#9E3D32] tracking-wider">
                    {currentAccount.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentAccount.accountNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#FFF9EE] hover:bg-[#FAF3E8] text-[#183A3A] border border-[#183A3A]/20 text-xs font-medium transition-all active:scale-95"
                  >
                    {copiedAccount === currentAccount.accountNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Đã chép</span>
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

              <div className="pt-2 border-t border-[#EADBCE]">
                <div className="text-xs uppercase tracking-wider text-[#78928A] font-semibold">
                  Chủ Tài Khoản
                </div>
                <div className="font-semibold text-sm text-[#183A3A] uppercase tracking-wide">
                  {currentAccount.accountHolder}
                </div>
              </div>

              {currentAccount.customNote && (
                <div className="pt-2 text-[11px] text-[#8A7569] italic">
                  Nội dung chuyển khoản gợi ý: &ldquo;{currentAccount.customNote}&rdquo;
                </div>
              )}
            </div>
          </div>
        </PaperCard>
      </div>
    </section>
  );
};
