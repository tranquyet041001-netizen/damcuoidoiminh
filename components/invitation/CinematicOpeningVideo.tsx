"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingData } from "@/types/wedding";
import { getGuestNameFromUrl } from "@/utils/guest";

interface CinematicOpeningVideoProps {
  weddingData?: WeddingData;
  onOpenInvitation: () => void;
  isOpen?: boolean;
}

export const CinematicOpeningVideo: React.FC<CinematicOpeningVideoProps> = ({
  onOpenInvitation,
  isOpen = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lấy tên khách mời đích danh từ URL (?to=, ?guest=, ?khach=)
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());
  }, []);

  // Nhận diện thiết bị di động ngay từ lần khởi tạo đầu tiên trên client
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        window.innerWidth <= 768 ||
        window.innerHeight > window.innerWidth ||
        (typeof window.matchMedia === "function" && window.matchMedia("(max-width: 768px)").matches)
      );
    }
    return false;
  });

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showSongHySeal, setShowSongHySeal] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        window.innerWidth <= 768 ||
        window.innerHeight > window.innerWidth ||
        (typeof window.matchMedia === "function" && window.matchMedia("(max-width: 768px)").matches);
      setIsMobile(mobile);
    };

    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  // Điện thoại: longphung2.mp4 (1080x1920 dọc không tiếng), Máy tính: longphung.mp4 (1920x1080 ngang không tiếng)
  const videoSrc = isMobile ? "/videos/longphung2.mp4" : "/videos/longphung.mp4";

  // Lắng nghe timeline video để bật con dấu Chữ Hỷ
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const t = video.currentTime;
    setCurrentTime(t);

    if (t >= 3.8) {
      setShowSongHySeal(true);
    }

    // Dừng tại frame cuối cùng (5.92s) để rồng và phượng ôm lấy chữ Hỷ
    if (t >= 5.92 && !video.paused) {
      video.pause();
    }
  }, []);

  // requestAnimationFrame để mượt mà 60fps
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const checkLoop = () => {
      if (video) {
        const t = video.currentTime;
        setCurrentTime(t);
        if (t >= 3.8) {
          setShowSongHySeal(true);
        }
        if (t >= 5.92 && !video.paused) {
          video.pause();
        }
      }
      rafId = requestAnimationFrame(checkLoop);
    };

    rafId = requestAnimationFrame(checkLoop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [videoSrc]);

  // Đảm bảo video tự động play trên mọi thiết bị di động (kể cả Low Power Mode)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Nếu trình duyệt di động chặn autoplay, hiển thị con dấu 囍 ngay để khách chạm mở
        setShowSongHySeal(true);
      });
    }
  }, [videoSrc]);

  // CƠ CHẾ BẢO VỆ (SAFEGUARD): Sau tối đa 3.8s, chắc chắn 100% con dấu 囍 xuất hiện
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSongHySeal(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  // Xử lý sự kiện chạm mở thiệp
  const handleOpenClick = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (isTransitioning) return;
      setIsTransitioning(true);

      setTimeout(() => {
        onOpenInvitation();
      }, 1000);
    },
    [isTransitioning, onOpenInvitation]
  );

  // Nếu video đang dừng do chính sách mobile, người dùng chạm vào màn hình sẽ kích hoạt chạy video
  const handleContainerClick = () => {
    const video = videoRef.current;
    if (video && video.paused && video.currentTime < 5.8) {
      video.play().catch(() => {});
    }
  };

  const showPulse = currentTime >= 3.6 && currentTime < 5.2;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`fixed inset-0 z-50 w-full h-[100dvh] flex items-center justify-center overflow-hidden transition-all duration-1000 select-none ${
        isTransitioning ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#0C0C0C",
      }}
    >
      {/* ── VIDEO RỒNG - PHƯỢNG TOÀN MÀN HÌNH (OBJECT-COVER) ── */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        muted
        autoPlay
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onError={() => setShowSongHySeal(true)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* ── BỤI VÀNG CỔ PHONG BAY TRONG KHÔNG GIAN ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="antique-particle particle-a" />
        <div className="antique-particle particle-b" />
        <div className="antique-particle particle-c" />
        <div className="antique-particle particle-d" />
        <div className="antique-particle particle-e" />
      </div>

      {/* ── THẺ KÍNH MỜI ĐÍCH DANH KHÁCH MỜI TRÊN MÀN HÌNH VIDEO MỞ ĐẦU ── */}
      <AnimatePresence>
        {guestName && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center max-w-[92vw]"
          >
            <div
              className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-3 shadow-2xl backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 26, 30, 0.92) 0%, rgba(92, 11, 14, 0.96) 100%)",
                border: "1.5px solid rgba(229, 195, 104, 0.9)",
                boxShadow:
                  "0 8px 30px rgba(0, 0, 0, 0.65), 0 0 22px rgba(201, 168, 76, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.35)",
              }}
            >
              <span className="text-[#FDE68A] text-xs sm:text-sm opacity-90">❖</span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#FDE68A] font-semibold">
                Kính mời:
              </span>
              <span
                className="font-calligraphy text-2xl sm:text-3xl md:text-4xl text-[#FFFDF7] font-bold tracking-wide"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.8), 0 0 14px rgba(254, 230, 138, 0.75)",
                }}
              >
                {guestName}
              </span>
              <span className="text-[#FDE68A] text-xs sm:text-sm opacity-90">❖</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── XUNG ÁNH SÁNG VÀNG KIM TẠI TRUNG TÂM KHI RỒNG PHƯỢNG QUAY VỀ ── */}
      <AnimatePresence>
        {showPulse && (
          <motion.div
            key="ceremonial-golden-pulse"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.35, 1.8] }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(circle, rgba(254, 230, 138, 0.8) 0%, rgba(212, 175, 55, 0.35) 45%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── HÀO QUANG NỀN NHẸ GIỮA RỒNG VÀ PHƯỢNG ── */}
      <AnimatePresence>
        {showSongHySeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ duration: 1.0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 253, 247, 0.65) 0%, rgba(254, 243, 199, 0.35) 45%, transparent 75%)",
              filter: "blur(22px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── NÚT CHỮ HỶ (囍) BẰNG CHỮ HÁN ĐỂ ẤN MỞ THIỆP CƯỚI ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center pointer-events-auto">
        <AnimatePresence>
          {showSongHySeal && !isTransitioning && (
            <motion.button
              key="ceremonial-songhy-seal"
              type="button"
              onClick={handleOpenClick}
              initial={{ opacity: 0, scale: 0.65, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex flex-col items-center justify-center cursor-pointer select-none outline-none p-4"
              aria-label="Mở thiệp cưới"
            >
              {/* Vòng hào quang vàng tỏa sáng nhịp nhàng */}
              <div className="absolute -inset-2 sm:-inset-4 rounded-full bg-gradient-to-tr from-[#D4AF37]/35 to-[#F59E0B]/20 blur-xl animate-pulse pointer-events-none" />

              {/* Vòng sóng gợn nhẹ lan tỏa */}
              <div className="absolute inset-2 rounded-full border-2 border-[#FDE68A]/70 animate-ping opacity-25 pointer-events-none duration-1000" />
              <div className="absolute inset-0 rounded-full border border-[#FDE68A]/40 animate-pulse pointer-events-none" />

              {/* Khối triện tròn sơn son thiếp vàng chứa chữ 囍 */}
              <div
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 36% 32%, #BA1B22 0%, #8C1217 55%, #4F0609 100%)",
                  border: "2.5px solid #E5C368",
                  boxShadow:
                    "0 10px 35px rgba(139, 17, 21, 0.6), 0 0 28px rgba(229, 195, 104, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.45), inset 0 -3px 6px rgba(0, 0, 0, 0.55)",
                }}
              >
                {/* Viền họa tiết chỉ vàng kép tinh xảo */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-[#FDE68A]/75 pointer-events-none" />
                <div className="absolute inset-2.5 rounded-full border border-[#FDE68A]/35 pointer-events-none" />

                {/* Vệt sáng lướt qua khi hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#FFF8D6]/35 to-transparent pointer-events-none" />

                {/* Chữ Hỷ bằng chữ Hán (囍) */}
                <span
                  className="relative z-10 font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-[#FFF6C8] select-none leading-none pt-0.5"
                  style={{
                    textShadow:
                      "0 2px 5px rgba(0, 0, 0, 0.75), 0 0 16px rgba(254, 230, 138, 0.9), 0 0 32px rgba(212, 175, 55, 0.55)",
                    fontFamily:
                      "'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', 'Georgia', serif",
                  }}
                >
                  囍
                </span>
              </div>

              {/* Dòng chữ hướng dẫn chạm nhẹ thanh nhã */}
              <div className="mt-3 px-3.5 py-1 rounded-full bg-black/55 backdrop-blur-xs border border-[#E5C368]/45 shadow-lg">
                <span
                  className="font-serif text-[11px] sm:text-xs text-[#FFF3B0] tracking-[0.25em] uppercase font-medium"
                  style={{
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  Chạm để mở
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── LÀN ÁNH SÁNG KHI CLICK "MỞ THIỆP" (CINEMATIC GOLDEN LIGHT SWEEP) ── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.85, 0], scale: [0.8, 1.4, 2.0] }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
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
