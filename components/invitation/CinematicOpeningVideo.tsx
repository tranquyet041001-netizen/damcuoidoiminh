"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { WeddingData } from "@/types/wedding";
import { getGuestNameFromUrl } from "@/utils/guest";
import { useMusic } from "@/context/MusicContext";

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
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);

  const { playMusic, pauseMusic } = useMusic();

  // Tên khách mời đích danh
  const [guestName, setGuestName] = useState<string>("");

  // Trạng thái âm thanh & lặp động
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Khi màn hình video mở đầu đang hiển thị, tạm dừng nhạc thiệp cưới để nhường chỗ cho âm thanh rồng phượng
  useEffect(() => {
    if (!isOpen && !openedRef.current) {
      pauseMusic();
    }
  }, [isOpen]);

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());
  }, []);

  // Nhận diện thiết bị di động
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

  // Đường dẫn video chính (kèm âm thanh gốc) & video lặp vô tận (rồng phượng luôn cử động)
  const videoSrc = isMobile ? "/videos/longphung2.mp4" : "/videos/longphung.mp4";
  const loopVideoSrc = isMobile ? "/videos/longphung2_seamless.mp4" : "/videos/longphung_seamless.mp4";

  // Lắng nghe timeline video để bật con dấu Chữ Hỷ và chuyển sang đoạn hoạt ảnh cử động liên tục
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const t = video.currentTime;
    setCurrentTime(t);

    if (t >= 3.8) {
      setShowSongHySeal(true);
    }

    // Khi video chính đạt ~5.7s, kích hoạt đoạn lặp hoạt ảnh rồng phượng để cử động không ngừng
    if (t >= 5.7 && !isLooping) {
      setIsLooping(true);
      if (loopVideoRef.current && loopVideoRef.current.paused) {
        loopVideoRef.current.play().catch(() => {});
      }
    }
  }, [isLooping]);

  // Vòng lặp RAF mượt mà 60fps
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
        if (t >= 5.7 && !isLooping) {
          setIsLooping(true);
          if (loopVideoRef.current && loopVideoRef.current.paused) {
            loopVideoRef.current.play().catch(() => {});
          }
        }
      }
      rafId = requestAnimationFrame(checkLoop);
    };

    rafId = requestAnimationFrame(checkLoop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [videoSrc, isLooping]);

  // Tự động phát video với âm thanh gốc
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");

    // Thử phát có âm thanh trước
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Nếu trình duyệt di động chặn phát kèm tiếng (Autoplay policy), tạm tắt tiếng để chạy
        video.muted = true;
        setIsAudioMuted(true);
        video.play().catch(() => {
          setShowSongHySeal(true);
        });
      });
    }
  }, [videoSrc]);

  // Bật/tắt âm thanh
  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsAudioMuted(newMuted);
    if (!newMuted && video.paused) {
      video.play().catch(() => {});
    }
  };

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
      if (openedRef.current || isTransitioning) return;
      openedRef.current = true;
      setIsTransitioning(true);

      // 1. KÍCH HOẠT PHÁT NHẠC CƯỚI TRỰC TIẾP TẠI GESTURE NGƯỜI DÙNG (TRƯỚC KHI PAUSE VIDEO)
      playMusic();

      // 2. Sau đó mới tạm dừng video mở màn rồng phượng
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (loopVideoRef.current) {
        loopVideoRef.current.pause();
      }

      // 3. Sau hiệu ứng ánh sáng hoàng kim 750ms, mở thẳng vào nội dung thiệp cưới chính
      setTimeout(() => {
        onOpenInvitation();
      }, 750);
    },
    [isTransitioning, onOpenInvitation, playMusic]
  );

  // Mở khóa toàn diện âm thanh khi chạm bất cứ đâu trên màn hình mở đầu
  const handleContainerInteraction = (e?: React.SyntheticEvent) => {
    const video = videoRef.current;
    if (video) {
      if (video.muted) {
        video.muted = false;
        setIsAudioMuted(false);
      }
      if (video.paused && video.currentTime < 5.8) {
        video.play().catch(() => {});
      }
    }
  };

  const showPulse = currentTime >= 3.6 && currentTime < 5.2;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerInteraction}
      onTouchEnd={handleContainerInteraction}
      className={`fixed inset-0 z-50 w-full h-[100dvh] flex items-center justify-center overflow-hidden transition-all duration-1000 select-none ${
        isTransitioning ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#0C0C0C",
      }}
    >
      {/* ── NÚT BẬT / TẮT ÂM THANH MỞ ĐẦU HOÀNG GIA (GÓC PHẢI) ── */}
      <button
        type="button"
        onClick={toggleAudio}
        onTouchEnd={(e) => {
          e.stopPropagation();
          toggleAudio();
        }}
        className="absolute top-5 sm:top-7 right-5 sm:right-7 z-40 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-[#E5C368] text-[#FDE68A] hover:bg-black/80 transition-all cursor-pointer shadow-xl active:scale-95 flex items-center gap-1.5"
        title={isAudioMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        aria-label="Bật tắt âm thanh"
      >
        {isAudioMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#FFF8D6]">Bật Tiếng 🔊</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-[#FDE68A] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#FFF8D6]">Âm Thanh</span>
          </>
        )}
      </button>

      {/* ── BANNER NHẮC BẬT ÂM THANH RỒNG PHƯỢNG KHI MỞ TRÊN ĐIỆN THOẠI ── */}
      <AnimatePresence>
        {isAudioMuted && !isTransitioning && !showSongHySeal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[92vw]"
          >
            <button
              type="button"
              onClick={handleContainerInteraction}
              onTouchEnd={handleContainerInteraction}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#BA1B22] via-[#8C1217] to-[#4F0609] border-2 border-[#FDE68A] shadow-[0_0_25px_rgba(229,195,104,0.7)] text-[#FFF8D6] text-xs sm:text-sm font-serif font-bold flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
            >
              <Volume2 className="w-4 h-4 text-[#FDE68A] animate-pulse" />
              <span>Chạm để bật âm thanh rồng phượng 🔊</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIDEO RỒNG - PHƯỢNG CHÍNH (CÓ ÂM THANH GỐC) ── */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        autoPlay
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onError={() => setShowSongHySeal(true)}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
          isLooping ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* ── HOẠT ẢNH RỒNG PHƯỢNG CỬ ĐỘNG LIÊN TỤC VÔ TẬN (SEAMLESS LOOP MOTION) ── */}
      <video
        ref={loopVideoRef}
        key={loopVideoSrc}
        src={loopVideoSrc}
        loop
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        muted
        autoPlay
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
          isLooping ? "opacity-100" : "opacity-0"
        }`}
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
              onTouchEnd={handleOpenClick}
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
