"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Heart, MailOpen, RotateCcw } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useMusic } from "@/context/MusicContext";
import {
  VietnameseLotus,
  DongSonBorder,
  RedSealStamp,
  BotanicalCorner,
  BotanicalBranch,
} from "@/components/ui/VietnamesePattern";
import { CelestialScene3D } from "@/components/invitation/three/CelestialScene3D";

interface HeroInvitationProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onReplayDragonPhoenix?: () => void;
}

/**
 * Con Dấu Sáp Hoàng Gia 3D Chân Thực (Realistic Royal Wax Seal)
 */
export const WaxSealButton: React.FC<{
  onClick: () => void;
  isOpening: boolean;
  theme?: "crimson-gold" | "sage-green";
  label?: string;
}> = ({ onClick, isOpening, theme = "crimson-gold", label = "囍" }) => {
  const isRed = theme === "crimson-gold";

  return (
    <div className="relative flex flex-col items-center group cursor-pointer" onClick={onClick}>
      {/* Vòng hào quang phát sáng nhịp thở */}
      <div
        className={`absolute -inset-3 rounded-full opacity-60 blur-md transition-all group-hover:opacity-90 ${
          isRed ? "bg-amber-400/40 animate-pulse" : "bg-emerald-400/30 animate-pulse"
        }`}
      />

      {/* Con dấu sáp vật lý */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={isOpening ? { scale: [1, 1.25, 0], opacity: [1, 1, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl select-none"
        style={{
          background: isRed
            ? "radial-gradient(circle at 35% 30%, #C42B30 0%, #8E1519 65%, #590B0E 100%)"
            : "radial-gradient(circle at 35% 30%, #5E8055 0%, #354D2E 65%, #1F301B 100%)",
          boxShadow: isRed
            ? "0 10px 25px -4px rgba(142, 21, 25, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -3px 6px rgba(0, 0, 0, 0.5)"
            : "0 10px 25px -4px rgba(53, 77, 46, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -3px 6px rgba(0, 0, 0, 0.5)",
          border: isRed ? "2px solid rgba(245, 158, 11, 0.5)" : "2px solid rgba(201, 168, 76, 0.4)",
        }}
        aria-label="Mở phong bì thư cưới"
      >
        {/* Viền sáp chảy dập nổi */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-[#FDE68A]/60 pointer-events-none" />

        {/* Chữ Song Hỷ hoặc con dấu dát vàng */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span
            className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[#FFF8D6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.8), 0 0 10px rgba(253, 230, 138, 0.6)",
            }}
          >
            {label}
          </span>
          <span className="text-[8px] uppercase tracking-widest text-[#FDE68A]/90 font-serif -mt-0.5">
            Trăm Năm
          </span>
        </div>
      </motion.button>

      {/* Lời nhắc chạm mở */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: [0.7, 1, 0.7], y: [0, -3, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-2.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#FDE68A]/40 text-[#FFF8D6] text-[10px] sm:text-xs font-serif font-medium tracking-wider uppercase whitespace-nowrap shadow-md flex items-center gap-1.5"
      >
        <Sparkles className="w-3 h-3 text-[#FDE68A] animate-spin-slow" />
        <span>Chạm Con Dấu Để Mở Thiệp</span>
      </motion.div>
    </div>
  );
};

export const HeroInvitation: React.FC<HeroInvitationProps> = ({
  isOpen: controlledIsOpen,
  onOpen,
  onReplayDragonPhoenix,
}) => {
  const { data: weddingData } = useWeddingData();
  const { playMusic, isPlaying } = useMusic();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string>("");
  const [isOpeningSequence, setIsOpeningSequence] = useState<boolean>(false);

  const theme = weddingData.theme || "crimson-gold";
  const isRed = theme === "crimson-gold";
  const isEnvelopeOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("guest") || params.get("khach");
      if (to) {
        setGuestName(decodeURIComponent(to).trim());
      }
    }
  }, []);

  const handleOpenInvitation = () => {
    if (isOpeningSequence || isEnvelopeOpen) return;
    setIsOpeningSequence(true);

    if (!isPlaying) {
      playMusic();
    }

    // Thời gian cho vũ đạo mở nắp phong bì 3D và trượt thiệp trước khi bung toàn bộ
    setTimeout(() => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(true);
      }
      onOpen?.();
      setIsOpeningSequence(false);
    }, 1200);
  };

  const handleReplay = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onReplayDragonPhoenix?.();
  };

  const scrollToContent = () => {
    const nextSection = document.getElementById("letter") || document.getElementById("events");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroStyle = weddingData.heroStyle || "cinematic-3d";

  // Nếu chọn Vũ Điệu Long Phụng 3D (Three.js WebGL)
  if (heroStyle === "cinematic-3d") {
    return (
      <section id="hero" className="relative w-full overflow-hidden">
        <CelestialScene3D
          weddingData={weddingData}
          isOpen={isEnvelopeOpen}
          onOpenInvitation={() => {
            if (!isPlaying) playMusic();
            if (controlledIsOpen === undefined) {
              setInternalIsOpen(true);
            }
            onOpen?.();
          }}
          isRedTheme={isRed}
        />
      </section>
    );
  }

  return (
    <section
      id="hero"
      className={`relative ${
        isEnvelopeOpen ? "min-h-[92vh] py-14 sm:py-18" : "min-h-[100dvh] py-8 sm:py-12"
      } flex flex-col items-center justify-center px-4 overflow-hidden ${
        isRed ? "bg-red-ivory-texture" : "bg-peach-texture"
      }`}
    >
      {/* Decorative Botanical corners */}
      <div className="absolute top-3 left-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color={isRed ? "#9F171B" : "#4A6741"} position="top-left" />
      </div>
      <div className="absolute top-3 right-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color={isRed ? "#9F171B" : "#4A6741"} position="top-right" />
      </div>
      <div className="absolute bottom-3 left-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color={isRed ? "#9F171B" : "#4A6741"} position="bottom-left" />
      </div>
      <div className="absolute bottom-3 right-3 opacity-60 pointer-events-none">
        <BotanicalCorner size={72} color={isRed ? "#9F171B" : "#4A6741"} position="bottom-right" />
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!isEnvelopeOpen ? (
            /* ═══════════════════════════════════════════════════════════════ */
            /* ─── PHONG BÌ THƯ HOÀNG GIA 3D (INTERACTIVE VINTAGE ENVELOPE) ── */
            /* ═══════════════════════════════════════════════════════════════ */
            <motion.div
              key="closed-envelope-container"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full flex flex-col items-center"
            >
              {/* Khối Phong Bì 3D Perspective */}
              <div className="relative w-full max-w-md perspective-1400 select-none">
                {/* 1. Lớp Nền / Bóng Đổ Của Phong Bì */}
                <div
                  className="relative w-full rounded-3xl overflow-visible shadow-2xl p-0.5"
                  style={{
                    boxShadow: isRed
                      ? "0 30px 65px -15px rgba(139, 26, 30, 0.45), 0 0 0 1px rgba(245, 158, 11, 0.3)"
                      : "0 25px 55px -15px rgba(53, 77, 46, 0.35), 0 0 0 1px rgba(201, 168, 76, 0.3)",
                  }}
                >
                  {/* Thân Phong Bì (Envelope Pocket Body) */}
                  <div
                    className={`relative w-full min-h-[380px] sm:min-h-[420px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden ${
                      isRed ? "bg-envelope-velvet text-[#FFFDF7]" : "bg-[#354D2E] text-[#FDFAF5]"
                    }`}
                  >
                    {/* Họa tiết hoa văn góc mạ vàng hoàng gia */}
                    <div className="absolute inset-3 rounded-2xl border-2 border-[#C9A84C]/50 pointer-events-none" />
                    <div className="absolute inset-5 rounded-xl border border-dashed border-[#FDE68A]/30 pointer-events-none" />

                    {/* Họa tiết Song Hỷ chìm giữa lòng phong bì */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <span className="font-serif font-extrabold text-[160px] text-[#C9A84C]">囍</span>
                    </div>

                    {/* Mép nắp gập hình chữ V bên dưới khi phong bì đóng */}
                    <div
                      className="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-25"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
                      }}
                    />

                    {/* ── PHẦN TRÊN PHONG BÌ: TIÊU ĐỀ & KHÁCH MỜI ── */}
                    <div className="relative z-10 text-center pt-2">
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/35 border border-[#C9A84C]/60 text-[#FDE68A] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium mb-3 shadow-inner">
                        <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                        <span>Thiệp Báo Hỷ Hoàng Gia</span>
                        <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                      </div>

                      {/* Thẻ đề tên đích danh khách mời nếu có */}
                      {guestName ? (
                        <div className="my-2 px-5 py-2.5 rounded-2xl bg-[#FFFDF7]/95 border border-[#C9A84C] text-[#8B1A1E] shadow-xl inline-block max-w-[90%]">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6A58] block font-sans font-bold">
                            Kính gửi Quý Khách:
                          </span>
                          <span className="font-calligraphy text-2xl sm:text-3xl text-[#9F171B] font-bold block mt-0.5">
                            {guestName}
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#FDE68A] font-serif">
                          Trân Trọng Kính Mời Quý Khách
                        </p>
                      )}
                    </div>

                    {/* ── PHẦN GIỮA PHONG BÌ: NẮP TAM GIÁC GẬP VÀ CON DẤU SÁP ── */}
                    <div className="relative z-20 my-auto flex flex-col items-center justify-center py-4">
                      {/* Nắp gập tam giác 3D (3D Envelope Flap) */}
                      <motion.div
                        initial={false}
                        animate={
                          isOpeningSequence
                            ? { rotateX: -160, zIndex: 5, y: -20 }
                            : { rotateX: 0, zIndex: 25, y: 0 }
                        }
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        style={{ transformOrigin: "top center" }}
                        className="relative w-full flex flex-col items-center"
                      >
                        {/* Cạnh nắp tam giác phong bì */}
                        <div
                          className="w-0 h-0 border-l-[160px] sm:border-l-[190px] border-l-transparent border-r-[160px] sm:border-r-[190px] border-r-transparent border-t-[100px] sm:border-t-[120px] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                          style={{
                            borderTopColor: isRed ? "#8B1A1E" : "#2E4428",
                          }}
                        />

                        {/* Con dấu sáp đặt ở chóp nắp tam giác */}
                        <div className="absolute top-[65px] sm:top-[80px] z-30">
                          <WaxSealButton
                            onClick={handleOpenInvitation}
                            isOpening={isOpeningSequence}
                            theme={theme}
                            label="囍"
                          />
                        </div>
                      </motion.div>

                      {/* Tờ thiệp bên trong hé lộ & trượt lên khi mở */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={
                          isOpeningSequence
                            ? { y: -90, opacity: 1, scale: 1.02 }
                            : { y: 20, opacity: 0 }
                        }
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="absolute inset-x-8 top-16 min-h-[260px] rounded-2xl bg-[#FFFDF7] p-5 text-center shadow-2xl border-2 border-[#C9A84C] pointer-events-none z-15"
                      >
                        <span className="text-[10px] uppercase tracking-widest text-[#B45309] font-bold">
                          Hôn Lễ Thành Hôn
                        </span>
                        <h2 className="font-calligraphy text-2xl text-[#9F171B] font-bold mt-1">
                          {weddingData.groom.shortName} &amp; {weddingData.bride.shortName}
                        </h2>
                        <div className="mt-2 text-xs text-[#5C4033] font-serif italic">
                          Đang mở thiệp mừng...
                        </div>
                      </motion.div>
                    </div>

                    {/* ── PHẦN DƯỚI PHONG BÌ: TÊN DÂU RỂ & NGÀY THÁNG ── */}
                    <div className="relative z-10 text-center pb-2">
                      <div className="flex items-center justify-center gap-3 my-1.5">
                        <span className="font-calligraphy text-2xl sm:text-3xl text-[#FFF8D6] font-bold drop-shadow-md">
                          {weddingData.groom.shortName}
                        </span>
                        <span className="font-serif italic text-lg text-[#FDE68A]">&amp;</span>
                        <span className="font-calligraphy text-2xl sm:text-3xl text-[#FFF8D6] font-bold drop-shadow-md">
                          {weddingData.bride.shortName}
                        </span>
                      </div>

                      <div className="inline-block px-4 py-1 rounded-full bg-black/30 border border-[#C9A84C]/40 text-[#FDE68A] text-[11px] font-serif">
                        {weddingData.weddingDateFormatted}
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleOpenInvitation}
                          disabled={isOpeningSequence}
                          className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-xs sm:text-sm font-serif font-bold text-[#8B1A1E] bg-gradient-to-r from-[#FFF8D6] via-[#FDE68A] to-[#F59E0B] shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <MailOpen className="w-4 h-4 text-[#8B1A1E] group-hover:rotate-12 transition-transform" />
                          <span>Mở Phong Bì Thư Cưới</span>
                          <Heart className="w-3.5 h-3.5 fill-[#8B1A1E] text-[#8B1A1E]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════ */
            /* ─── TRẠNG THÁI ĐÃ MỞ THIỆP (REVEALED INVITATION CARD) ───────── */
            /* ═══════════════════════════════════════════════════════════════ */
            <motion.div
              key="opened-invitation-card"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`relative rounded-3xl p-6 sm:p-10 text-center shadow-2xl border ${
                isRed
                  ? "bg-[#FFFDF7] border-[#C9A84C]/60"
                  : "bg-[#FDFAF5] border-[#E8D5CF]"
              }`}
              style={{
                boxShadow: isRed
                  ? "0 25px 60px -12px rgba(159, 23, 27, 0.22), 0 0 0 1px rgba(201, 168, 76, 0.35)"
                  : "0 25px 50px -12px rgba(74, 103, 65, 0.15)",
              }}
            >
              <div
                className={`absolute inset-2.5 rounded-2xl border border-dashed ${
                  isRed ? "border-[#C9A84C]/45" : "border-[#C9A84C]/30"
                } pointer-events-none`}
              />

              {/* Con dấu son nhỏ góc thiệp */}
              <div className="absolute -top-4 right-6 sm:right-8">
                <RedSealStamp size={46} text="TRĂM NĂM" />
              </div>

              {/* Lời trân trọng */}
              <p className="text-xs uppercase tracking-[0.3em] text-[#8C6A58] font-sans font-semibold mb-2">
                Hôn Lễ Thành Hôn
              </p>

              {/* Tên dâu rể */}
              <div className="my-2">
                <h2
                  className={`font-calligraphy text-4xl sm:text-5xl font-bold ${
                    isRed ? "text-[#9F171B]" : "text-[#354D2E]"
                  }`}
                >
                  {weddingData.groom.shortName} &amp; {weddingData.bride.shortName}
                </h2>
              </div>

              {/* Cặp ảnh chân dung dâu rể */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 my-6">
                {/* Chú Rể */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 shadow-md ${
                      isRed
                        ? "bg-gradient-to-tr from-[#C9A84C] via-[#DC2626] to-[#FDE68A]"
                        : "bg-gradient-to-tr from-[#C9A84C] to-[#A8BCA1]"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={weddingData.groom.avatarUrl}
                        alt={weddingData.groom.fullName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                  <span
                    className={`font-serif font-bold text-xs sm:text-sm mt-2 ${
                      isRed ? "text-[#9F171B]" : "text-[#354D2E]"
                    }`}
                  >
                    {weddingData.groom.shortName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C6A58]">
                    Chú Rể
                  </span>
                </div>

                {/* Trái tim kết nối */}
                <div className="flex flex-col items-center justify-center">
                  <Heart
                    className={`w-6 h-6 animate-heartbeat ${
                      isRed ? "text-[#DC2626] fill-[#DC2626]/20" : "text-[#C4715A] fill-[#C4715A]/20"
                    }`}
                  />
                  <span className="text-[10px] text-[#C9A84C] font-serif italic mt-1 font-bold">
                    Duyên
                  </span>
                </div>

                {/* Cô Dâu */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 shadow-md ${
                      isRed
                        ? "bg-gradient-to-tr from-[#DC2626] via-[#C9A84C] to-[#FDE68A]"
                        : "bg-gradient-to-tr from-[#C4715A] to-[#E8D5CF]"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={weddingData.bride.avatarUrl}
                        alt={weddingData.bride.fullName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                  <span
                    className={`font-serif font-bold text-xs sm:text-sm mt-2 ${
                      isRed ? "text-[#9F171B]" : "text-[#354D2E]"
                    }`}
                  >
                    {weddingData.bride.shortName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C6A58]">
                    Cô Dâu
                  </span>
                </div>
              </div>

              <DongSonBorder color={isRed ? "#9F171B" : "#4A6741"} opacity={0.35} className="max-w-xs mx-auto" />

              {/* Tên khách mời trên thiệp đã mở */}
              {guestName && (
                <div
                  className={`my-3.5 px-5 py-2.5 rounded-2xl inline-block shadow-xs border ${
                    isRed
                      ? "bg-[#FEF2F2] border-[#FCA5A5]/60 text-[#9F171B]"
                      : "bg-[#FDF0EC]/80 border-[#E8D5CF] text-[#C4715A]"
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-widest text-[#8C6A58] block font-sans font-bold">
                    Trân trọng kính mời
                  </span>
                  <span className="font-calligraphy text-2xl sm:text-3xl font-bold block mt-0.5">
                    {guestName}
                  </span>
                </div>
              )}

              {/* Lời ngỏ / chúc phúc mở đầu */}
              <p className="font-serif italic text-sm sm:text-base text-[#5C4033] leading-relaxed max-w-md mx-auto my-4">
                &ldquo;{weddingData.welcomeMessage}&rdquo;
              </p>

              {/* Ngày tháng cử hành */}
              <div
                className={`my-5 p-3.5 rounded-2xl max-w-sm mx-auto border ${
                  isRed
                    ? "bg-[#FEF2F2] border-[#C9A84C]/40"
                    : "bg-[#F0F5EE] border-[#A8BCA1]/30"
                }`}
              >
                <div
                  className={`text-xs uppercase tracking-widest font-bold ${
                    isRed ? "text-[#9F171B]" : "text-[#4A6741]"
                  }`}
                >
                  Ngày Hỷ Sự
                </div>
                <div
                  className={`text-base sm:text-lg font-serif font-bold mt-0.5 ${
                    isRed ? "text-[#8B1A1E]" : "text-[#354D2E]"
                  }`}
                >
                  {weddingData.weddingDateFormatted}
                </div>
                <div className="text-xs text-[#8C6A58] italic font-serif">
                  ({weddingData.lunarDateFormatted})
                </div>
              </div>

              {/* Nút hành động */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={scrollToContent}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[#FDFAF5] text-xs uppercase tracking-wider font-bold shadow-lg transition-all active:scale-95 cursor-pointer ${
                    isRed
                      ? "bg-gradient-to-r from-[#9F171B] to-[#7F1D1D] hover:brightness-110 shadow-red-900/20"
                      : "bg-[#4A6741] hover:bg-[#354D2E]"
                  }`}
                >
                  <span>Xem Chi Tiết Hôn Lễ</span>
                  <ChevronDown className="w-4 h-4 animate-bounce text-[#FDE68A]" />
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FFFDF7] hover:bg-amber-50 text-[#9F171B] border border-[#C9A84C]/60 text-xs font-serif font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Đóng lại để xem lại mở phong bì & Rồng Phượng bay"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Xem Lại Mở Phong Bì</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroInvitation;
