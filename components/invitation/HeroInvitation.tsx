"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useMusic } from "@/context/MusicContext";
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
  const { playMusic } = useMusic();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string>("");
  const [isOpening, setIsOpening] = useState(false);
  const openTriggeredRef = useRef(false);

  const isEnvelopeOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());
  }, []);

  const handleOpenInvitation = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (openTriggeredRef.current) return;
    openTriggeredRef.current = true;

    setIsOpening(true);

    // Kích hoạt phát nhạc cưới tức thì trong call stack tương tác người dùng
    playMusic();

    setTimeout(() => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(true);
      }
      onOpen?.();
      setIsOpening(false);
      openTriggeredRef.current = false;
    }, 600);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] pt-16 pb-8 sm:py-12 flex flex-col items-center justify-center px-3 sm:px-4 overflow-hidden select-none"
      style={{
        backgroundColor: "#0A0102",
        background: "radial-gradient(circle at 50% 40%, #35070B 0%, #170305 60%, #080102 100%)",
      }}
    >
      {/* Vầng hào quang đại hỷ huyền ảo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(229,195,104,0.65) 0%, rgba(186,27,34,0.2) 50%, transparent 75%)",
          filter: "blur(35px)",
        }}
      />

      {/* Hạt bụi vàng bay lơ lửng */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={`gold-star-${i}`}
            className="absolute rounded-full bg-[#FDE68A] animate-pulse"
            style={{
              top: `${(i * 17) % 92}%`,
              left: `${(i * 23) % 95}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.2 + (i % 5) * 0.15,
              animationDuration: `${2.5 + (i % 3)}s`,
              boxShadow: "0 0 8px rgba(254, 240, 138, 0.8)",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!isEnvelopeOpen && (
            /* ─── BÌA PHONG THƯ ĐẠI HỶ (CEREMONIAL ENVELOPE) ─── */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={
                isOpening
                  ? { opacity: 0, scale: 1.08, filter: "blur(4px)" }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full rounded-3xl p-6 sm:p-8 md:p-10 text-center shadow-2xl border-2 border-[#E5C368] overflow-hidden"
              style={{
                background:
                  "linear-gradient(150deg, #2E0508 0%, #170305 45%, #290609 80%, #140204 100%)",
                boxShadow:
                  "0 25px 60px -10px rgba(0,0,0,0.95), 0 0 35px rgba(229,195,104,0.35)",
              }}
            >
              {/* Hoa văn dập nổi gấm truyền thống */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#E5C368 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Viền hoa văn chỉ vàng kép dập nổi */}
              <div className="absolute inset-2 sm:inset-2.5 rounded-2xl border border-dashed border-[#FDE68A]/40 pointer-events-none" />

              {/* Dải lụa gấm thắt ngang nắp phong thư */}
              <div className="w-full flex items-center justify-center my-2 relative">
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5C368]/70 to-transparent" />
                <div className="relative z-10 px-4 py-0.5 rounded-full bg-gradient-to-r from-[#996515] via-[#FDE68A] to-[#996515] border border-[#FFF8D6] shadow-[0_0_15px_rgba(229,195,104,0.6)]">
                  <span className="text-[10px] font-serif font-bold text-[#2A0508] uppercase tracking-widest">
                    HỶ SỰ KIM PHONG
                  </span>
                </div>
              </div>

              {/* Con dấu triện sáp đỏ Chu Sa mạ vàng chữ 囍 ở tâm nắp thư */}
              <div className="flex justify-center my-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#D32F2F] via-[#BA1B22] to-[#7F1D1D] border-2 border-[#FFF8D6] shadow-[0_0_25px_rgba(229,195,104,0.7)] flex items-center justify-center relative transform hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#FFF8D6]/60 pointer-events-none" />
                  <span className="font-serif font-bold text-3xl sm:text-4xl text-[#FFF8D6] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    囍
                  </span>
                </div>
              </div>

              {/* Tag đầu thiệp */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/80 shadow-md mb-2">
                <Sparkles className="w-3 h-3 text-[#FDE68A]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-serif font-bold text-[#FFF3B0]">
                  KIM THIẾP HỶ THƯ &bull; THIỆP BÁO HỶ
                </span>
                <Sparkles className="w-3 h-3 text-[#FDE68A]" />
              </div>

              {/* Badge Đích Danh Khách Mời (Nếu link có ?to= hoặc ?guest=) */}
              {guestName && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-2.5 inline-flex flex-col items-center px-5 py-2 rounded-2xl bg-black/40 border border-[#E5C368]/60 shadow-md max-w-[92%]"
                >
                  <span className="text-[10px] uppercase tracking-widest text-[#E5C368] font-serif font-bold">
                    TRÂN TRỌNG KÍNH MỜI
                  </span>
                  <span className="font-serif font-bold text-lg sm:text-2xl text-[#FFF8D6] mt-0.5 truncate max-w-full">
                    {guestName} &amp; Gia Đình
                  </span>
                </motion.div>
              )}

              {/* Tiêu đề thiệp */}
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C368]/90 font-serif font-semibold my-1">
                {guestName ? "TỚI DỰ ĐẠI LỄ HÔN PHỐI CỦA" : "TRÂN TRỌNG KÍNH MỜI QUÝ QUAN KHÁCH"}
              </p>

              {/* Cặp Avatar Tân Lang & Tân Nương */}
              {(weddingData.groom.avatarUrl || weddingData.bride.avatarUrl) && (
                <div className="flex items-center justify-center gap-3 sm:gap-5 my-3">
                  {weddingData.groom.avatarUrl && (
                    <div className="flex flex-col items-center group">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#996515] via-[#FDE68A] to-[#C99B26] shadow-[0_0_18px_rgba(229,195,104,0.6)] border border-[#FFF8D6]">
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#1A0305]">
                          <Image
                            src={weddingData.groom.avatarUrl}
                            alt={weddingData.groom.fullName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 64px, 80px"
                          />
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#E5C368] font-serif font-bold mt-1">
                        Tân Lang
                      </span>
                    </div>
                  )}

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D32F2F] to-[#7F1D1D] border border-[#FFF8D6] flex items-center justify-center shadow-[0_0_12px_rgba(229,195,104,0.5)] self-center mb-4">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF8D6] fill-[#FFF8D6] animate-pulse" />
                  </div>

                  {weddingData.bride.avatarUrl && (
                    <div className="flex flex-col items-center group">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#C99B26] via-[#FDE68A] to-[#996515] shadow-[0_0_18px_rgba(229,195,104,0.6)] border border-[#FFF8D6]">
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#1A0305]">
                          <Image
                            src={weddingData.bride.avatarUrl}
                            alt={weddingData.bride.fullName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 64px, 80px"
                          />
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#E5C368] font-serif font-bold mt-1">
                        Tân Nương
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Tên dâu rể thư pháp thếp vàng */}
              <div className="my-2 sm:my-3 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                <span className="font-calligraphy text-3xl sm:text-4xl md:text-5xl text-[#FFF8D6] font-bold drop-shadow-[0_2px_10px_rgba(229,195,104,0.7)]">
                  {weddingData.groom.fullName}
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#BA1B22] border border-[#E5C368] flex items-center justify-center shadow-md">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF8D6] fill-[#FFF8D6]" />
                </div>
                <span className="font-calligraphy text-3xl sm:text-4xl md:text-5xl text-[#FFF8D6] font-bold drop-shadow-[0_2px_10px_rgba(229,195,104,0.7)]">
                  {weddingData.bride.fullName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#E8D5CF] font-serif italic max-w-xs sm:max-w-md mx-auto leading-relaxed my-2">
                &ldquo;Loan phượng hòa minh kết trăm năm duyên thắm, hoa khai phú quý vạn sự cát tường.&rdquo;
              </p>

              {/* Badge ngày cưới */}
              <div className="inline-block px-5 py-2 rounded-2xl bg-black/40 border border-[#E5C368]/50 text-[#FFF8D6] text-xs sm:text-sm font-serif my-2.5 shadow-xs">
                <span className="text-[#FDE68A] font-bold">{weddingData.weddingDateFormatted}</span>
                <span className="text-[#E8D5CF]/80 text-[11px] block mt-0.5">({weddingData.lunarDateFormatted})</span>
              </div>

              {/* Nút Mở Thiệp Đại Hỷ - Nổi bật, sang trọng, hiệu ứng vàng kim lộng lẫy */}
              <div className="flex flex-col items-center justify-center gap-2 mt-2 sm:mt-3">
                <button
                  type="button"
                  onClick={handleOpenInvitation}
                  onTouchEnd={handleOpenInvitation}
                  className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-serif font-bold text-[#1A0305] shadow-[0_0_30px_rgba(229,195,104,0.8)] transition-all duration-300 transform active:scale-95 hover:scale-105 cursor-pointer overflow-hidden border-2 border-[#FFF8D6]"
                  style={{
                    background: "linear-gradient(135deg, #FFF3B0 0%, #E5C368 50%, #C99B26 100%)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2 tracking-wider uppercase text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-[#1A0305]" />
                    <span>Khai Mở Hỷ Thư</span>
                    <Sparkles className="w-4 h-4 text-[#1A0305]" />
                  </span>
                  <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <span className="text-[10px] sm:text-[11px] text-[#E5C368]/80 tracking-widest uppercase font-serif">
                  Chạm nhẹ để mở thiệp cưới đại hỷ
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Luồng ánh sáng hoàng kim khi ấn mở */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.85, 0], scale: [0.8, 1.4, 2.0] }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(254, 240, 138, 0.9) 0%, rgba(212, 175, 55, 0.5) 45%, transparent 75%)",
                filter: "blur(32px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
