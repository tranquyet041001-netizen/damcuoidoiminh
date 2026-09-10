"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingData } from "@/types/wedding";
import { BotanicalCorner } from "@/components/ui/VietnamesePattern";

interface CinematicOpeningVideoProps {
  weddingData: WeddingData;
  onOpenInvitation: () => void;
  isOpen?: boolean;
}

export const CinematicOpeningVideo: React.FC<CinematicOpeningVideoProps> = ({
  weddingData,
  onOpenInvitation,
  isOpen = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mốc thời gian chính xác (giây)
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  // Giai đoạn hiển thị theo đúng yêu cầu:
  // 0.0s → 3.8s: Chỉ có video và vi hạt bụi vàng
  // 3.8s → 4.1s: Xung ánh sáng vàng kim tinh tế ở khoảng trời trung tâm
  // 4.1s → 5.3s: Khắc chữ "LỄ THÀNH HÔN" & Tên Dâu Rể vào không gian
  // 5.2s → 6.0s: Xuất hiện thẻ bài son thiếp vàng "MỞ THIỆP"
  const showPulse = currentTime >= 3.75 && currentTime < 4.8;
  const showTypography = currentTime >= 4.0;
  const showSeal = currentTime >= 5.15;

  // Lắng nghe timeline video với độ mượt 60fps
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const checkTime = () => {
      if (video) {
        const t = video.currentTime;
        setCurrentTime(t);

        // Giữ frame cuối tại 5.95s - tuyệt đối không giật về frame đầu
        if (t >= 5.92 && !video.paused) {
          video.pause();
          setHasEnded(true);
        }
      }
      rafId = requestAnimationFrame(checkTime);
    };

    rafId = requestAnimationFrame(checkTime);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Tự động play video với thuộc tính muted playsInline chuẩn mobile & desktop
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Trình duyệt tự quản lý nếu có hạn chế
        });
      }
    }
  }, []);

  // Xử lý sự kiện click "MỞ THIỆP" với Cinematic Transition 1.2s
  const handleOpenClick = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // 1. Thẻ bài mở thiệp mờ dần
    // 2. Vệt sáng quét qua không gian
    // 3. Toàn cảnh phóng lớn nhẹ và fade out
    // 4. Mở khóa toàn bộ thiệp cưới chính
    setTimeout(() => {
      onOpenInvitation();
    }, 1250);
  }, [isTransitioning, onOpenInvitation]);

  // Thông tin tên cô dâu và chú rể chính xác từng ký tự tiếng Việt
  const brideName = weddingData.bride.fullName || weddingData.bride.shortName;
  const groomName = weddingData.groom.fullName || weddingData.groom.shortName;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 select-none ${
        isTransitioning ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#EBEBEB", // Màu ngà tự nhiên hòa quyện tuyệt đối với viền video
      }}
    >
      {/* ── 4 GÓC HOA VĂN HOÀNG GIA CỔ PHONG TRÊN TOÀN MÀN HÌNH (DESKTOP & MOBILE) ── */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 opacity-35 pointer-events-none z-10">
        <BotanicalCorner size={56} color="#8B1A1E" position="top-left" />
      </div>
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-35 pointer-events-none z-10">
        <BotanicalCorner size={56} color="#8B1A1E" position="top-right" />
      </div>
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 opacity-35 pointer-events-none z-10">
        <BotanicalCorner size={56} color="#8B1A1E" position="bottom-left" />
      </div>
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 opacity-35 pointer-events-none z-10">
        <BotanicalCorner size={56} color="#8B1A1E" position="bottom-right" />
      </div>

      {/* ── KHUNG HÌNH 16:9 CHUẨN XÁC KHÔNG BỊ CẮT XÉN RỒNG - PHƯỢNG TRÊN CẢ DESKTOP & MOBILE ── */}
      <div className="relative w-full aspect-video max-h-[100dvh] max-w-[1920px] flex items-center justify-center overflow-hidden">
        {/* VIDEO GỐC RỒNG - PHƯỢNG NGUYÊN BẢN */}
        <video
          ref={videoRef}
          src="/videos/longphung.mp4"
          playsInline
          muted
          autoPlay
          preload="auto"
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* ── BỤI VÀNG CỔ PHONG SIÊU NHẸ (SUBTLE ATMOSPHERIC STARDUST) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="antique-particle particle-a" />
          <div className="antique-particle particle-b" />
          <div className="antique-particle particle-c" />
          <div className="antique-particle particle-d" />
          <div className="antique-particle particle-e" />
        </div>

        {/* ── 3.8s → 4.1s: XUNG ÁNH SÁNG VÀNG KIM TINH TẾ (GOLDEN LIGHT REVEAL PULSE) ── */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              key="ceremonial-golden-pulse"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 0.55, 0], scale: [0.7, 1.35, 1.7] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-[17%] left-1/2 -translate-x-1/2 w-52 h-52 sm:w-80 sm:h-80 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(254, 230, 138, 0.7) 0%, rgba(212, 175, 55, 0.3) 40%, transparent 70%)",
                filter: "blur(24px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── HÀO QUANG NỀN DỊU DÀNG GIÚP CHỮ HÒA QUYỆN VÀO MÂY TRỜI (ATMOSPHERIC INTEGRATION) ── */}
        <AnimatePresence>
          {showTypography && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1.5 }}
              className="absolute top-[10%] left-1/2 -translate-x-1/2 w-72 sm:w-[480px] md:w-[620px] h-36 sm:h-52 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255, 253, 247, 0.75) 0%, rgba(254, 243, 199, 0.45) 45%, transparent 75%)",
                filter: "blur(18px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── 4.1s → 6.0s: TYPOGRAPHY CỔ PHONG & THẺ BÀI SƠN SON THIẾP VÀNG KHẮC VÀO KHOẢNG TRỜI GIỮA RỒNG VÀ PHƯỢNG ── */}
        <div className="absolute top-[8%] sm:top-[10%] md:top-[12%] left-0 right-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none">
          <AnimatePresence>
            {showTypography && (
              <motion.div
                key="ceremonial-inscription"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* DÒNG TIÊU ĐỀ "LỄ THÀNH HÔN" (CỔ PHONG, TRANG TRỌNG, NHỎ HƠN RÕ RỆT) */}
                <motion.div
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.38em" }}
                  transition={{ duration: 1.1, delay: 0.15 }}
                  className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-1.5"
                >
                  {/* Họa tiết hoa văn chỉ vàng hai bên */}
                  <span className="text-[#C9A84C] text-[10px] sm:text-xs opacity-75">❖</span>
                  <span
                    className="font-serif text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold uppercase tracking-[0.38em] text-[#8B1A1E]"
                    style={{
                      textShadow:
                        "0 1px 2px rgba(255, 255, 255, 0.9), 0 0 10px rgba(245, 215, 120, 0.6), 0 2px 4px rgba(139, 26, 30, 0.25)",
                    }}
                  >
                    LỄ THÀNH HÔN
                  </span>
                  <span className="text-[#C9A84C] text-[10px] sm:text-xs opacity-75">❖</span>
                </motion.div>

                {/* ĐƯỜNG CHỈ VÀNG KIM CUNG ĐÌNH MỎNG NHẸ */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.8 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="w-20 sm:w-32 md:w-44 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-1.5 sm:mb-2.5"
                />

                {/* TÊN CÔ DÂU & TÊN CHÚ RỂ (THÀNH PHẦN LỚN NHẤT, NÉT SƠN SON THIẾP VÀNG HOÀNG GIA) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.35 }}
                  className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 md:gap-5 font-serif"
                >
                  {/* Tên Cô Dâu */}
                  <span
                    className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide text-[#8B1A1E]"
                    style={{
                      textShadow:
                        "0 1px 2px rgba(255, 255, 255, 0.95), 0 0 14px rgba(245, 215, 120, 0.55), 0 2px 5px rgba(139, 26, 30, 0.3)",
                    }}
                  >
                    {brideName}
                  </span>

                  {/* Ký tự nối & */}
                  <span
                    className="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-[#C9A84C]"
                    style={{
                      textShadow: "0 0 10px rgba(201, 168, 76, 0.65), 0 1px 1px rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    &amp;
                  </span>

                  {/* Tên Chú Rể */}
                  <span
                    className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide text-[#8B1A1E]"
                    style={{
                      textShadow:
                        "0 1px 2px rgba(255, 255, 255, 0.95), 0 0 14px rgba(245, 215, 120, 0.55), 0 2px 5px rgba(139, 26, 30, 0.3)",
                    }}
                  >
                    {groomName}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 5.2s → 6.0s: THẺ BÀI SƠN SON THIẾP VÀNG "MỞ THIỆP" ── */}
          <div className="mt-3 sm:mt-4 md:mt-5 pointer-events-auto">
            <AnimatePresence>
              {showSeal && !isTransitioning && (
                <motion.button
                  key="ceremonial-seal-button"
                  onClick={handleOpenClick}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-5 py-1.5 sm:px-6 sm:py-2 rounded-full cursor-pointer transition-all duration-400 select-none overflow-hidden shadow-lg"
                  style={{
                    background: "radial-gradient(ellipse at 50% 30%, #9F171B 0%, #7F1D1D 65%, #590B0E 100%)",
                    border: "1px solid rgba(212, 175, 55, 0.75)",
                    boxShadow:
                      "0 4px 16px rgba(127, 29, 29, 0.35), 0 0 10px rgba(212, 175, 55, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {/* Viền chỉ vàng kép tinh xảo */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#FDE68A]/40 pointer-events-none" />

                  {/* Vệt sáng ánh vàng lướt nhẹ qua thẻ bài khi hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#FFF8D6]/25 to-transparent pointer-events-none" />

                  {/* Điểm xuyết hoa văn cát tường nhỏ */}
                  <span className="relative z-10 text-[#FDE68A] text-[9px] sm:text-[10px] opacity-80">❖</span>

                  {/* Chữ "MỞ THIỆP" màu ngà son quý phái */}
                  <span
                    className="relative z-10 font-serif text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.3em] text-[#FFFDF7] uppercase"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.5), 0 0 8px rgba(253, 230, 138, 0.4)",
                    }}
                  >
                    MỞ THIỆP
                  </span>

                  <span className="relative z-10 text-[#FDE68A] text-[9px] sm:text-[10px] opacity-80">❖</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── LÀN ÁNH SÁNG KHI CLICK "MỞ THIỆP" (CINEMATIC GOLDEN LIGHT SWEEP) ── */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.75, 0], scale: [0.8, 1.4, 2.0] }}
              transition={{ duration: 1.25, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(254, 240, 138, 0.85) 0%, rgba(212, 175, 55, 0.45) 45%, transparent 75%)",
                  filter: "blur(32px)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ĐỊNH DẠNG CSS VI HẠT BỤI VÀNG CỔ PHONG ── */}
      <style jsx>{`
        .antique-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 8px rgba(245, 215, 120, 0.65);
          pointer-events: none;
        }
        .particle-a {
          top: 22%;
          left: 38%;
          animation: floatAntique 8s ease-in-out infinite;
        }
        .particle-b {
          top: 17%;
          left: 60%;
          animation: floatAntique 10s ease-in-out infinite reverse;
        }
        .particle-c {
          top: 32%;
          left: 45%;
          animation: floatAntique 9s ease-in-out infinite 1s;
        }
        .particle-d {
          top: 26%;
          left: 54%;
          animation: floatAntique 11s ease-in-out infinite 2s;
        }
        .particle-e {
          top: 35%;
          left: 63%;
          animation: floatAntique 8.5s ease-in-out infinite 1.5s;
        }
        @keyframes floatAntique {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(10px, -15px) scale(1.25);
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
};
