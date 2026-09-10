"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { DongSonSun, VietnameseLotus, RedSealStamp } from "@/components/ui/VietnamesePattern";
import confetti from "canvas-confetti";

interface HeroInvitationProps {
  onOpenCard?: () => void;
}

export const HeroInvitation: React.FC<HeroInvitationProps> = ({ onOpenCard }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { data: weddingData } = useWeddingData();

  const handleOpen = () => {
    setIsOpened(true);
    if (onOpenCard) onOpenCard();

    // Fire subtle celebratory confetti in traditional colors (cinnabar, gold, ivory)
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#9E3D32", "#F4E8D2", "#78928A", "#D4AF37"],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      const letterElement = document.getElementById("letter");
      if (letterElement) {
        letterElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 700);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden"
    >
      {/* Nền hoa văn Đông Sơn mờ ảo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <DongSonSun
          size={520}
          color="#183A3A"
          opacity={0.06}
          className="animate-spin-slow"
          style={{ animationDuration: "120s" }}
        />
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* TRẠNG THÁI PHONG BÌ THIỆP CHƯA MỞ */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
              className="relative bg-[#FFF9EE] border-2 border-[#E5D4B6] rounded-md p-8 sm:p-10 shadow-xl text-center overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 40px -15px rgba(58, 45, 38, 0.12), 0 0 0 1px rgba(229, 212, 182, 0.5)",
              }}
            >
              {/* Họa tiết góc khung */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#9E3D32]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#9E3D32]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#9E3D32]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#9E3D32]" />

              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs tracking-[0.3em] uppercase text-[#9E3D32] font-semibold border-b border-[#9E3D32]/30">
                  THIỆP BÁO HỶ
                </span>
              </div>

              <div className="my-6">
                <VietnameseLotus size={48} color="#9E3D32" opacity={0.85} className="mx-auto mb-4" />
                <h1 className="font-serif text-3xl sm:text-4xl text-[#183A3A] font-semibold tracking-tight mb-2">
                  {weddingData.groom.shortName}
                  <span className="text-[#9E3D32] mx-2 font-light">&</span>
                  {weddingData.bride.shortName}
                </h1>
                <p className="text-sm sm:text-base text-[#6B5549] italic mt-2">
                  {weddingData.welcomeQuote}
                </p>
              </div>

              <div className="py-4 border-y border-[#EADBCE] my-6">
                <div className="text-xs uppercase tracking-widest text-[#78928A] font-medium mb-1">
                  NGÀY THÀNH HÔN
                </div>
                <div className="text-xl sm:text-2xl font-serif text-[#183A3A] font-medium">
                  {weddingData.weddingDateFormatted}
                </div>
                <div className="text-xs text-[#8A7569] mt-1 font-sans">
                  ({weddingData.lunarDateFormatted})
                </div>
              </div>

              {/* Nút bấm Mở Thiệp gắn con dấu son */}
              <div className="mt-8 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#9E3D32] hover:bg-[#BD4B3F] text-[#FFF9EE] font-serif text-base tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-[#F4E8D2] animate-pulse" />
                  <span>Mở Thiệp Cưới</span>
                  <RedSealStamp
                    size={32}
                    text="HỶ"
                    className="border-none shadow-none bg-[#7B2E25]"
                  />
                </button>
                <span className="text-[12px] text-[#8A7569] mt-3 italic">
                  Chạm để mở phong thiệp chúc phúc
                </span>
              </div>
            </motion.div>
          ) : (
            /* TRẠNG THÁI THIỆP ĐÃ MỞ RỘNG */
            <motion.div
              key="opened-card"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative bg-[#FFF9EE] border border-[#E5D4B6] rounded-sm p-8 sm:p-12 shadow-2xl text-center"
            >
              {/* Trang trí góc cổ */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#9E3D32]" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#9E3D32]" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#9E3D32]" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#9E3D32]" />

              <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#9E3D32] font-semibold mb-2">
                TRÂN TRỌNG BÁO HỶ
              </span>

              <div className="my-4">
                <VietnameseLotus size={44} color="#9E3D32" opacity={0.8} className="mx-auto mb-3" />
                <h1 className="font-serif text-3xl sm:text-5xl text-[#183A3A] font-semibold tracking-tight">
                  {weddingData.groom.shortName}
                </h1>
                <div className="text-xl sm:text-2xl text-[#9E3D32] my-1 font-serif italic">&</div>
                <h1 className="font-serif text-3xl sm:text-5xl text-[#183A3A] font-semibold tracking-tight">
                  {weddingData.bride.shortName}
                </h1>
              </div>

              <div className="my-6 py-4 border-y border-[#EADBCE]">
                <p className="text-sm sm:text-base text-[#5A473E] italic leading-relaxed max-w-sm mx-auto">
                  &ldquo;{weddingData.welcomeMessage}&rdquo;
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-base sm:text-lg font-serif font-medium text-[#183A3A]">
                  {weddingData.weddingDateFormatted}
                </div>
                <div className="text-xs text-[#8A7569]">
                  {weddingData.lunarDateFormatted}
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#letter"
                  className="inline-flex flex-col items-center text-xs text-[#78928A] hover:text-[#183A3A] tracking-wider uppercase transition-colors"
                >
                  <span>Cuộn để đọc tiếp</span>
                  <ChevronDown className="w-4 h-4 mt-1 animate-bounce" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
