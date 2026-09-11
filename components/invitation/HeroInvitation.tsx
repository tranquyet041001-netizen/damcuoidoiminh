"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useMusic } from "@/context/MusicContext";
import {
  VietnameseLotus,
  DongSonBorder,
  RedSealStamp,
  BotanicalCorner,
  BotanicalBranch,
} from "@/components/ui/VietnamesePattern";
import { getGuestNameFromUrl } from "@/utils/guest";

interface HeroInvitationProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onReplayOpening?: () => void;
}

export const HeroInvitation: React.FC<HeroInvitationProps> = ({
  isOpen: controlledIsOpen,
  onOpen,
  onReplayOpening,
}) => {
  const { data: weddingData } = useWeddingData();
  const { playMusic, isPlaying } = useMusic();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

  const isEnvelopeOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());
  }, []);

  const handleOpenInvitation = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    onOpen?.();
    if (!isPlaying) {
      playMusic();
    }
  };

  const scrollToContent = () => {
    const nextSection = document.getElementById("letter");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className={`relative ${
        isEnvelopeOpen ? "min-h-[92vh] py-16" : "min-h-[100dvh] py-8 sm:py-12"
      } flex flex-col items-center justify-center px-4 overflow-hidden bg-peach-texture`}
    >
      {/* Decorative Botanical corners */}
      <div className="absolute top-3 left-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color="#4A6741" position="top-left" />
      </div>
      <div className="absolute top-3 right-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color="#4A6741" position="top-right" />
      </div>
      <div className="absolute bottom-3 left-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color="#4A6741" position="bottom-left" />
      </div>
      <div className="absolute bottom-3 right-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color="#4A6741" position="bottom-right" />
      </div>

      <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!isEnvelopeOpen ? (
            /* ─── TRẠNG THÁI BÌA THIỆP (CLOSED ENVELOPE) ─── */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, y: -25 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full rounded-3xl p-6 sm:p-10 text-center shadow-xl border border-[#E8D5CF]/80 bg-[#FDFAF5]"
              style={{
                boxShadow: "0 20px 45px -12px rgba(196, 113, 90, 0.15), 0 0 0 1px rgba(232, 213, 207, 0.5)",
              }}
            >
              {/* Vòng viền thanh nhã */}
              <div className="absolute inset-2.5 rounded-2xl border border-dashed border-[#C9A84C]/40 pointer-events-none" />

              {/* Tag đầu thiệp */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F0F5EE] border border-[#A8BCA1]/40 text-[#4A6741] text-[11px] uppercase tracking-[0.25em] font-medium mb-5">
                <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                <span>Thiệp Báo Hỷ</span>
                <Sparkles className="w-3 h-3 text-[#C9A84C]" />
              </div>

              {/* Hoa sen vẽ nét */}
              <div className="flex justify-center mb-3">
                <VietnameseLotus size={46} color="#4A6741" opacity={0.85} className="animate-breathe" />
              </div>

              {/* Badge Đích Danh Khách Mời (Nếu link có ?to= hoặc ?guest=) */}
              {guestName && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#FDF0EC] border border-[#E8D5CF] shadow-xs"
                >
                  <span className="text-xs uppercase tracking-widest text-[#8C6A58] font-sans font-bold">
                    Kính mời:
                  </span>
                  <span className="font-calligraphy text-2xl sm:text-3xl text-[#C4715A] font-bold">
                    {guestName}
                  </span>
                </motion.div>
              )}

              {/* Tiêu đề thiệp */}
              <p className="text-xs uppercase tracking-[0.3em] text-[#8C6A58] font-sans font-semibold mb-2">
                {guestName ? "Tới Dự Hôn Lễ Của" : "Trân Trọng Kính Mời"}
              </p>

              {/* Tên dâu rể thư pháp lãng mạn */}
              <div className="my-4 space-y-1">
                <h1 className="font-calligraphy text-4xl sm:text-5xl md:text-6xl text-[#354D2E] leading-tight">
                  {weddingData.groom.shortName}
                </h1>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
                  <span className="font-serif italic text-2xl text-[#C4715A]">&amp;</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
                </div>
                <h1 className="font-calligraphy text-4xl sm:text-5xl md:text-6xl text-[#354D2E] leading-tight">
                  {weddingData.bride.shortName}
                </h1>
              </div>

              <p className="text-sm sm:text-base text-[#5C4033] font-serif italic max-w-sm mx-auto leading-relaxed my-4">
                &ldquo;Duyên tao ngộ kết trăm năm ước hẹn, hoa nở đôi nhánh một tấm chân tình.&rdquo;
              </p>

              <div className="flex items-center justify-center my-4">
                <BotanicalBranch size={56} color="#4A6741" opacity={0.7} />
              </div>

              {/* Badge ngày cưới */}
              <div className="inline-block px-5 py-2 rounded-xl bg-[#FDF0EC] border border-[#E8D5CF] text-[#4A6741] text-xs sm:text-sm font-serif font-medium mb-7">
                {weddingData.weddingDateFormatted}
              </div>

              {/* Nút Mở Thiệp - Nét son đào quý phái */}
              <div className="flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenInvitation}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm sm:text-base font-serif font-semibold text-[#FDFAF5] shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #C4715A 0%, #A4503B 100%)",
                    boxShadow: "0 8px 22px -4px rgba(196, 113, 90, 0.45)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2 tracking-wide">
                    <span>Mở Thiệp Chúc Mừng</span>
                    <Heart className="w-4 h-4 fill-current text-[#FDFAF5] group-hover:scale-125 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <span className="text-[11px] text-[#8C6A58] tracking-wider uppercase font-sans">
                  Chạm nhẹ để xem nội dung
                </span>
              </div>
            </motion.div>
          ) : (
            /* ─── TRẠNG THÁI ĐÃ MỞ THIỆP (OPENED CARD) ─── */
            <motion.div
              key="opened-invitation"
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative rounded-3xl p-6 sm:p-10 md:p-12 text-center shadow-2xl border border-[#E8D5CF] bg-[#FDFAF5]"
              style={{
                boxShadow: "0 25px 50px -12px rgba(74, 103, 65, 0.15)",
              }}
            >
              <div className="absolute inset-2.5 rounded-2xl border border-dashed border-[#C9A84C]/30 pointer-events-none" />

              {/* Con dấu son nhỏ */}
              <div className="absolute -top-4 right-8">
                <RedSealStamp size={44} text="TRĂM NĂM" />
              </div>

              {/* Lời trân trọng */}
              <p className="text-xs uppercase tracking-[0.3em] text-[#8C6A58] font-sans font-semibold mb-2">
                Hôn Lễ Thành Hôn
              </p>

              {/* Tên cặp đôi */}
              <div className="my-2">
                <h2 className="font-calligraphy text-3xl sm:text-4xl md:text-5xl text-[#354D2E]">
                  {weddingData.groom.shortName} &amp; {weddingData.bride.shortName}
                </h2>
              </div>

              {/* Cặp ảnh chân dung dâu rể */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
                {/* Chú Rể */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-[#C9A84C] to-[#A8BCA1] shadow-md">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={weddingData.groom.avatarUrl}
                        alt={weddingData.groom.fullName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 120px"
                      />
                    </div>
                  </div>
                  <span className="font-serif font-medium text-xs sm:text-sm md:text-base text-[#354D2E] mt-2">
                    {weddingData.groom.shortName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C6A58]">
                    Chú Rể
                  </span>
                </div>

                {/* Trái tim kết nối */}
                <div className="flex flex-col items-center justify-center">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-[#C4715A] fill-[#C4715A]/20 animate-heartbeat" />
                  <span className="text-[10px] text-[#C9A84C] font-serif italic mt-1">Duyên</span>
                </div>

                {/* Cô Dâu */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-[#C4715A] to-[#E8D5CF] shadow-md">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={weddingData.bride.avatarUrl}
                        alt={weddingData.bride.fullName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 120px"
                      />
                    </div>
                  </div>
                  <span className="font-serif font-medium text-xs sm:text-sm md:text-base text-[#354D2E] mt-2">
                    {weddingData.bride.shortName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C6A58]">
                    Cô Dâu
                  </span>
                </div>
              </div>

              <DongSonBorder color="#4A6741" opacity={0.3} className="max-w-xs mx-auto" />

              {/* Tên khách trên thiệp mở */}
              {guestName && (
                <div className="my-3 px-4 py-2 rounded-2xl bg-[#FDF0EC]/80 border border-[#E8D5CF] inline-block shadow-2xs">
                  <span className="text-[11px] uppercase tracking-widest text-[#8C6A58] block font-sans font-bold">
                    Trân trọng kính mời
                  </span>
                  <span className="font-calligraphy text-2xl sm:text-3xl text-[#C4715A] font-bold block mt-0.5">
                    {guestName}
                  </span>
                </div>
              )}

              {/* Lời chúc mở đầu */}
              <p className="font-serif italic text-sm sm:text-base text-[#5C4033] leading-relaxed max-w-md mx-auto my-4">
                &ldquo;{weddingData.welcomeMessage}&rdquo;
              </p>

              {/* Ngày tháng cử hành */}
              <div className="my-5 p-3 rounded-2xl bg-[#F0F5EE] border border-[#A8BCA1]/30 max-w-sm mx-auto">
                <div className="text-xs uppercase tracking-widest text-[#4A6741] font-semibold">
                  Ngày Hỷ Sự
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#354D2E] mt-0.5">
                  {weddingData.weddingDateFormatted}
                </div>
                <div className="text-xs text-[#8C6A58] italic font-serif">
                  ({weddingData.lunarDateFormatted})
                </div>
              </div>

              {/* Nút cuộn xuống xem chi tiết */}
              <div className="mt-2 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToContent}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A6741] hover:text-[#C4715A] font-medium transition-colors cursor-pointer"
                >
                  <span>Xem Chi Tiết Hôn Lễ</span>
                  <ChevronDown className="w-4 h-4 animate-bounce text-[#C4715A]" />
                </button>

                {onReplayOpening && (
                  <button
                    type="button"
                    onClick={onReplayOpening}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FDF0EC] hover:bg-[#FBE4DD] border border-[#E8D5CF] text-[#8B1A1E] text-[11px] font-serif transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    title="Xem lại video mở màn Long Phụng"
                  >
                    <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                    <span>Xem lại video Long Phụng</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
