"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, DongSonSun } from "@/components/ui/VietnamesePattern";
import confetti from "canvas-confetti";

export const HeroInvitation: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  const { data: weddingData } = useWeddingData();

  const handleOpen = () => {
    setIsOpened(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#9E3D32", "#F4E8D2", "#78928A"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      const targetElement = document.getElementById("letter") || document.getElementById("story");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-14 pb-12 px-3 overflow-hidden"
    >
      {/* Nền chàm hoa văn Trống đồng Đông Sơn mờ quay chậm */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <DongSonSun
          size={560}
          color="#183A3A"
          opacity={0.07}
          className="animate-spin-slow"
          style={{ animationDuration: "140s" }}
        />
      </div>

      <div className="w-full max-w-[420px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* BÌA THIỆP PHONG BÌ UỐN VÒM VIỆT CỔ - THEO ẢNH MẪU */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4 } }}
              className="relative bg-[#183A3A] text-[#FFF9EE] rounded-2xl overflow-hidden shadow-2xl border border-[#78928A]/30 flex flex-col text-center"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(24, 58, 58, 0.45), 0 0 0 1px rgba(212, 175, 55, 0.25)",
              }}
            >
              {/* Nắp phong bì uốn vòm cong bằng giấy dó bên trên */}
              <div className="relative bg-[#FAF3E8] text-[#3A2D26] pt-6 pb-8 px-6 border-b-2 border-[#9E3D32] shadow-sm">
                {/* Viền nắp phong bì uốn lượn cổ điển */}
                <div className="absolute -bottom-3 left-0 right-0 h-6 flex justify-center pointer-events-none">
                  <svg
                    viewBox="0 0 400 30"
                    fill="none"
                    preserveAspectRatio="none"
                    className="w-full h-full text-[#FAF3E8]"
                  >
                    <path
                      d="M0 0 C120 0 150 25 200 25 C250 25 280 0 400 0 Z"
                      fill="#FAF3E8"
                      stroke="#9E3D32"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Đóa sen vàng mờ trên đỉnh nắp phong bì */}
                <div className="flex justify-center mb-1">
                  <VietnameseLotus size={36} color="#D4AF37" opacity={0.85} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E3D32] font-semibold">
                  THIỆP BÁO HỶ
                </div>
              </div>

              {/* Phần thân thiệp màu chàm sang trọng */}
              <div className="pt-10 pb-10 px-6 sm:px-8 space-y-6 flex-1 flex flex-col items-center justify-center">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
                    MỜI TRÂN TRỌNG
                  </div>

                  {/* Tên dâu rể theo phong cách chữ vàng dát kim */}
                  <div className="py-2 space-y-1">
                    <h1 className="font-serif italic text-3xl sm:text-4xl text-[#EADBCE] font-medium tracking-wide drop-shadow-sm text-center">
                      {weddingData.groom.fullName}
                    </h1>
                    <div className="font-serif italic text-xl text-[#D4AF37]">&</div>
                    <h1 className="font-serif italic text-3xl sm:text-4xl text-[#EADBCE] font-medium tracking-wide drop-shadow-sm text-center">
                      {weddingData.bride.fullName}
                    </h1>
                  </div>
                </div>

                <div className="py-3 border-y border-[#78928A]/30 w-full max-w-xs mx-auto">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]/90 font-medium mb-1">
                    HÔN LỄ ĐƯỢC CỬ HÀNH VÀO
                  </div>
                  <div className="font-serif text-lg sm:text-xl font-semibold text-[#FFF9EE] tracking-wide">
                    {weddingData.weddingDateFormatted}
                  </div>
                  <div className="text-[11px] text-[#A7BCB6] mt-0.5">
                    ({weddingData.lunarDateFormatted})
                  </div>
                </div>

                {/* Nút bấm XEM CHI TIẾT INVITATION mộc bản cổ điển */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#FFF9EE] border-2 border-[#D4AF37] shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(158, 61, 50, 0.25) 100%)",
                    }}
                  >
                    <span className="font-serif text-xs sm:text-sm tracking-[0.15em] uppercase font-bold text-[#F4E8D2] group-hover:text-white">
                      XEM CHI TIẾT INVITATION
                    </span>
                    <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  </button>

                  <div className="text-[11px] text-[#78928A] mt-3 italic">
                    Chạm để mở thiệp chúc phúc
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* TRẠNG THÁI THIỆP ĐÃ MỞ (NỀN GIẤY DÓ CỔ ĐIỂN) */
            <motion.div
              key="opened-invitation"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-[#FFF9EE] border-2 border-[#E5D4B6] rounded-2xl p-8 sm:p-10 shadow-2xl text-center"
            >
              {/* Viền góc son đỏ */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#9E3D32]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#9E3D32]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#9E3D32]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#9E3D32]" />

              <div className="flex justify-center mb-3">
                <VietnameseLotus size={40} color="#9E3D32" opacity={0.85} />
              </div>

              <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[#9E3D32] font-semibold mb-2">
                TRÂN TRỌNG BÁO HỶ
              </span>

              <div className="my-3 space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#183A3A] font-semibold tracking-tight">
                  {weddingData.groom.fullName}
                </h1>
                <div className="text-lg text-[#9E3D32] font-serif italic">&</div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#183A3A] font-semibold tracking-tight">
                  {weddingData.bride.fullName}
                </h1>
              </div>

              <div className="my-5 py-4 border-y border-[#EADBCE]">
                <p className="text-sm sm:text-base text-[#5A473E] italic leading-relaxed max-w-sm mx-auto">
                  &ldquo;{weddingData.welcomeMessage}&rdquo;
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-serif font-semibold text-[#183A3A]">
                  {weddingData.weddingDateFormatted}
                </div>
                <div className="text-xs text-[#8A7569]">
                  {weddingData.lunarDateFormatted}
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#story"
                  className="inline-flex flex-col items-center text-xs text-[#78928A] hover:text-[#183A3A] tracking-wider uppercase transition-colors"
                >
                  <span>Cuộn để xem tiếp</span>
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
