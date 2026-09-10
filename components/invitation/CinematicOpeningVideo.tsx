"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { WeddingData } from "@/types/wedding";

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
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  // Các giai đoạn timeline
  const showPulse = currentTime >= 3.8 && currentTime < 5.0;
  const showTypography = currentTime >= 4.1;
  const showButton = currentTime >= 5.2;

  // Lắng nghe timeline video với độ mượt cao
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const checkTime = () => {
      if (video) {
        const t = video.currentTime;
        setCurrentTime(t);

        // Giữ frame cuối tại 5.95s - không để giật về frame đầu
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

  // Tự động play video ngay khi sẵn sàng
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Trình duyệt chặn autoplay thì fallback
        });
      }
    }
  }, []);

  // Xử lý sự kiện click "MỞ THIỆP" với Cinematic Transition 1.2s
  const handleOpenClick = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Kịch bản chuyển cảnh 1.2s:
    // 1. Nút fade out
    // 2. Vệt sáng vàng kim quét qua
    // 3. Toàn cảnh zoom nhẹ và fade out
    // 4. Mở khóa wedding website
    setTimeout(() => {
      onOpenInvitation();
    }, 1200);
  }, [isTransitioning, onOpenInvitation]);

  // Thông tin cô dâu và chú rể
  const brideName = weddingData.bride.shortName || weddingData.bride.fullName;
  const groomName = weddingData.groom.shortName || weddingData.groom.fullName;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 select-none ${
        isTransitioning ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#EBEBEB", // Màu ngà tự nhiên chuẩn màu viền video
      }}
    >
      {/* ── 1. KHUNG CHỨA VIDEO CHÍNH (GIỮ NGUYÊN 100% ARTWORK & NỀN TRẮNG/NGÀ) ── */}
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center">
        <video
          ref={videoRef}
          src="/videos/longphung.mp4"
          playsInline
          muted
          autoPlay
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-contain md:object-cover pointer-events-none"
          style={{
            objectPosition: "center center",
          }}
        />

        {/* ── 2. FLOATING SUBTLE GOLD PARTICLES (BỤI VÀNG CỔ PHONG SIÊU NHẸ) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="particle-gold particle-1" />
          <div className="particle-gold particle-2" />
          <div className="particle-gold particle-3" />
          <div className="particle-gold particle-4" />
          <div className="particle-gold particle-5" />
          <div className="particle-gold particle-6" />
        </div>

        {/* ── 3. TIMELINE 3.8s → 4.1s: SUBTLE GOLDEN LIGHT PULSE Ở KHOẢNG TRỜI GIỮA RỒNG VÀ PHƯỢNG ── */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              key="golden-light-pulse"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.45, 0], scale: [0.6, 1.3, 1.6] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute top-[16%] md:top-[18%] left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(245, 215, 120, 0.65) 0%, rgba(212, 175, 55, 0.25) 45%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── 4. TIMELINE 4.1s → 5.3s: TYPOGRAPHY KHẮC VÀO KHOẢNG TRỜI GIỮA RỒNG VÀ PHƯỢNG ── */}
        <div className="absolute top-[12%] sm:top-[14%] md:top-[16%] left-0 right-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-20">
          <AnimatePresence>
            {showTypography && (
              <motion.div
                key="ceremonial-typography"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* LỄ THÀNH HÔN (Trang trọng, nhỏ hơn rõ rệt, nét cổ phong) */}
                <motion.span
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.35em" }}
                  transition={{ duration: 1.0, delay: 0.1 }}
                  className="font-serif text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.35em] text-[#8B1A1E] mb-1.5 sm:mb-2"
                  style={{
                    textShadow: "0 0 12px rgba(245, 215, 120, 0.55), 0 1px 2px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  LỄ THÀNH HÔN
                </motion.span>

                {/* Họa tiết gạch nối chỉ vàng cổ điển */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.85 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-2 sm:mb-2.5"
                />

                {/* TÊN CÔ DÂU & TÊN CHÚ RỂ (Thành phần lớn nhất, màu đỏ son sẫm hoàng cung) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 font-serif"
                >
                  {/* Tên Cô Dâu */}
                  <span
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide text-[#8B1A1E]"
                    style={{
                      textShadow: "0 0 16px rgba(245, 215, 120, 0.5), 0 1px 2px rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {brideName}
                  </span>

                  {/* Ký tự nối & */}
                  <span
                    className="text-base sm:text-lg md:text-2xl italic font-serif text-[#C9A84C]"
                    style={{
                      textShadow: "0 0 10px rgba(201, 168, 76, 0.6)",
                    }}
                  >
                    &amp;
                  </span>

                  {/* Tên Chú Rể */}
                  <span
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide text-[#8B1A1E]"
                    style={{
                      textShadow: "0 0 16px rgba(245, 215, 120, 0.5), 0 1px 2px rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {groomName}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 5. TIMELINE 5.2s → 5.8s: NÚT "MỞ THIỆP" XUẤT HIỆN THANH LỊCH ── */}
        <div className="absolute top-[28%] sm:top-[30%] md:top-[33%] left-0 right-0 flex justify-center z-30 pointer-events-auto">
          <AnimatePresence>
            {showButton && !isTransitioning && (
              <motion.button
                key="open-invitation-btn"
                onClick={handleOpenClick}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-2 px-6 py-2 sm:px-7 sm:py-2.5 rounded-full backdrop-blur-md cursor-pointer transition-all duration-300 shadow-md select-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(139, 26, 30, 0.88)", // Dark vermilion translucent
                  border: "1px solid rgba(201, 168, 76, 0.65)", // Thin gold border
                  boxShadow: "0 4px 18px rgba(139, 26, 30, 0.25), 0 0 12px rgba(201, 168, 76, 0.3)",
                }}
              >
                {/* Hiệu ứng ánh sáng vàng kim lướt qua viền khi hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#FDE68A]/30 to-transparent pointer-events-none" />

                {/* Biểu tượng ánh sao nhỏ */}
                <Sparkles className="w-3.5 h-3.5 text-[#FDE68A] transition-transform duration-300 group-hover:rotate-45" />

                {/* Chữ MỞ THIỆP màu ngà cao cấp */}
                <span
                  className="font-serif text-xs sm:text-sm font-medium tracking-[0.25em] text-[#FFFDF7] uppercase"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  MỞ THIỆP
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── 6. LÀN ÁNH SÁNG KHI CLICK "MỞ THIỆP" (LIGHT SWEEP TRANSITION) ── */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.4, 2.0] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(253, 230, 138, 0.8) 0%, rgba(201, 168, 76, 0.4) 40%, transparent 75%)",
                  filter: "blur(30px)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CSS CHO VI HẠT BỤI VÀNG CỔ PHONG (SUBTLE FLOATING GOLD PARTICLES) ── */}
      <style jsx>{`
        .particle-gold {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.55);
          box-shadow: 0 0 6px rgba(245, 215, 120, 0.6);
          pointer-events: none;
        }
        .particle-1 {
          top: 25%;
          left: 35%;
          animation: floatSlow 7s ease-in-out infinite;
        }
        .particle-2 {
          top: 18%;
          left: 62%;
          animation: floatSlow 9s ease-in-out infinite reverse;
        }
        .particle-3 {
          top: 45%;
          left: 48%;
          animation: floatSlow 8s ease-in-out infinite 1s;
        }
        .particle-4 {
          top: 30%;
          left: 55%;
          animation: floatSlow 10s ease-in-out infinite 2s;
        }
        .particle-5 {
          top: 22%;
          left: 42%;
          animation: floatSlow 7.5s ease-in-out infinite 1.5s;
        }
        .particle-6 {
          top: 38%;
          left: 68%;
          animation: floatSlow 11s ease-in-out infinite 3s;
        }
        @keyframes floatSlow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(12px, -18px) scale(1.3);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};
