"use client";

import React, { useState } from "react";
import {
  Menu,
  Map,
  CheckCircle2,
  Volume2,
  VolumeX,
  Pause,
  Play,
  X,
  Share2,
  Heart,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useMusic } from "@/context/MusicContext";
import { ShareModal } from "@/components/invitation/ShareModal";
import { YouTubeIcon } from "@/utils/youtube";

interface FloatingControlsProps {
  isGuestView?: boolean;
  onReplayOpening?: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isGuestView = false,
  onReplayOpening,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPillDismissed, setIsPillDismissed] = useState(false);

  const { data } = useWeddingData();
  const isVideoMode = (data.openingStyle ?? "video") === "video";

  const navItems = [
    ...(!isVideoMode
      ? [{ id: "hero", label: "Phong Thư", emoji: "✉️" }]
      : []),
    { id: "letter", label: "Hỷ Thư", emoji: "📜" },
    { id: "details", label: "Điển Lễ", emoji: "🏮" },
    { id: "story", label: "Chuyện Tình", emoji: "✨" },
    { id: "countdown", label: "Đếm Ngược", emoji: "⏳" },
    { id: "rsvp", label: "Kính Báo", emoji: "✍️" },
    { id: "gallery", label: "Hỷ Ảnh", emoji: "📷" },
    { id: "wishes", label: "Hoa Đăng", emoji: "🪔" },
    { id: "gift", label: "Tráp Cưới", emoji: "🎁" },
  ];
  const {
    isPlaying,
    toggleMusic,
    isYouTube,
    currentSongTitle,
    isMuted,
    toggleMute,
    showVideoPreview,
    setShowVideoPreview,
  } = useMusic();

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === "hero" && onReplayOpening) {
      onReplayOpening();
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── MINI FLOATING MUSIC PILL (HIỆN KHI NHẠC ĐANG PHÁT) ── */}
      <AnimatePresence>
        {isPlaying && !isPillDismissed && (
          <motion.aside
            key="music-pill"
            aria-label="Trình phát nhạc thu nhỏ"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[350px] px-3.5 py-2 rounded-full bg-[#1A0305]/95 backdrop-blur-md border border-[#E5C368]/60 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2"
            style={{
              bottom: "calc(4.85rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            {/* Đĩa xoay / Hoa sen & Tên bài hát */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-[#3B090D] border border-[#E5C368] flex items-center justify-center shrink-0 shadow-xs">
                {isYouTube ? (
                  <YouTubeIcon className="w-3.5 h-3.5 text-[#FDE68A] animate-pulse" />
                ) : (
                  <span className="text-xs animate-spin-slow inline-block">🪔</span>
                )}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-serif font-bold text-[#FFF8D6] truncate leading-tight">
                  {currentSongTitle}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {/* Equalizer bars */}
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 bg-[#BA1B22] animate-equalizer-1 rounded-full" />
                    <span className="w-0.5 bg-[#E5C368] animate-equalizer-2 rounded-full" />
                    <span className="w-0.5 bg-[#FDE68A] animate-equalizer-3 rounded-full" />
                  </div>
                  <span className="text-[9px] text-[#E5C368]/80 uppercase tracking-wider font-serif font-medium">
                    {isYouTube ? "YouTube Audio" : "Cổ Phong Nhã Nhạc"}
                  </span>
                </div>
              </div>
            </div>

            {/* Các nút tác vụ nhanh */}
            <div className="flex items-center gap-1 shrink-0">
              {isYouTube && (
                <button
                  type="button"
                  onClick={() => setShowVideoPreview(!showVideoPreview)}
                  title={showVideoPreview ? "Thu nhỏ MV" : "Xem MV YouTube"}
                  className="px-2 py-1 rounded-full bg-[#3D0A0E] text-[#FDE68A] border border-[#E5C368]/50 text-[10px] font-serif font-bold flex items-center gap-1 hover:bg-[#520E13] cursor-pointer"
                >
                  <Video className="w-3 h-3" />
                  <span>{showVideoPreview ? "Ẩn" : "MV"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
                className="p-1.5 rounded-full text-[#E8D5CF] hover:text-[#FFF8D6] hover:bg-white/10 cursor-pointer transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-[#FF6B6B]" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#FDE68A]" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMusic}
                title="Tạm dừng nhạc"
                className="w-7 h-7 rounded-full bg-[#BA1B22] text-[#FFF8D6] border border-[#FDE68A] flex items-center justify-center hover:bg-[#8E1015] transition-colors cursor-pointer shadow-xs"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsPillDismissed(true)}
                title="Thu gọn thanh nhạc"
                className="w-5 h-5 rounded-full flex items-center justify-center text-[#E8D5CF]/70 hover:text-[#FFF8D6] cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MENU DRAWER ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              key="menu-card"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-[#1A0305] border-2 border-[#E5C368]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header menu */}
              <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[#E5C368]/40 bg-[#2D0609]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#FDE68A] font-serif font-bold">
                    MỤC LỤC HỶ SỰ
                  </p>
                  <h3 className="font-calligraphy text-2xl text-[#FFF8D6] leading-tight mt-0.5">
                    {data.groom.shortName} &amp; {data.bride.shortName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#E8D5CF] hover:text-[#FFF8D6] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Danh sách mục */}
              <div className="p-4 grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left transition-all hover:bg-[#32070A] active:scale-98 group border border-transparent hover:border-[#E5C368]/40 cursor-pointer"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="font-serif text-xs text-[#E8D5CF] group-hover:text-[#FFF8D6] transition-colors font-bold">
                      {item.label}
                    </span>
                  </button>
                ))}

                {/* Nút xem lại màn hình mở thiệp */}
                {onReplayOpening && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onReplayOpening();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left transition-all bg-[#3B090D] hover:bg-[#4E0C12] active:scale-98 group border border-[#E5C368] cursor-pointer col-span-2 text-[#FFF8D6]"
                  >
                    <span className="text-base">{isVideoMode ? "🐉" : "🌸"}</span>
                    <span className="font-serif text-xs font-bold text-[#FDE68A]">
                      {isVideoMode ? "Xem Lại Video Rồng Phượng" : "Xem Lại Bìa Mở Thiệp"}
                    </span>
                  </button>
                )}
              </div>

              {/* Nút tác vụ chân menu */}
              <div className="px-4 pb-5 pt-2 flex gap-2 border-t border-[#E5C368]/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsShareOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-serif font-bold bg-[#3B090D] text-[#FFF8D6] border border-[#E5C368] transition-all hover:bg-[#520E13] cursor-pointer shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>Chia Sẻ Thiệp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsPillDismissed(false);
                    toggleMusic();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer shadow-sm ${
                    isPlaying
                      ? "bg-[#BA1B22] text-[#FFF8D6] border border-[#FDE68A]"
                      : "bg-[#1E0406] text-[#E8D5CF] border border-[#E5C368]/50"
                  }`}
                >
                  {isYouTube ? (
                    <YouTubeIcon
                      className={`w-3.5 h-3.5 ${
                        isPlaying ? "text-[#FDE68A] animate-pulse" : ""
                      }`}
                    />
                  ) : isPlaying ? (
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#FDE68A]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isPlaying
                      ? "Tắt Nhạc"
                      : isYouTube
                      ? "Bật Nhạc YouTube"
                      : "Bật Nhạc"}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── THANH ĐIỀU HƯỚNG DƯỚI (BOTTOM DOCK BAR) ── */}
      <nav
        aria-label="Điều hướng nhanh"
        className="fixed left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[360px]"
        style={{
          bottom: "calc(0.875rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-center justify-around px-2 py-2 rounded-full bg-[#180305]/95 backdrop-blur-md border border-[#E5C368]/60 shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
          {/* Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#E8D5CF] hover:text-[#FDE68A] transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 text-[#FDE68A]" />
            <span className="text-[9px] uppercase tracking-wider font-serif font-bold">
              Menu
            </span>
          </button>

          {/* Địa điểm */}
          <button
            type="button"
            onClick={() => scrollToSection("details")}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#E8D5CF] hover:text-[#FDE68A] transition-colors cursor-pointer"
          >
            <Map className="w-4 h-4 text-[#FDE68A]" />
            <span className="text-[9px] uppercase tracking-wider font-serif font-bold">
              Điển Lễ
            </span>
          </button>

          {/* Nút RSVP Nhô Cao */}
          <button
            type="button"
            onClick={() => scrollToSection("rsvp")}
            className="flex flex-col items-center gap-0.5 -mt-4 transition-transform active:scale-95 cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-[#FFF8D6] shadow-[0_6px_18px_rgba(186,27,34,0.6)] border border-[#FDE68A]"
              style={{
                background:
                  "linear-gradient(135deg, #BA1B22 0%, #830B0F 100%)",
              }}
            >
              <CheckCircle2 className="w-6 h-6 text-[#FDE68A]" />
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#FDE68A] font-serif mt-0.5">
              Kính Báo
            </span>
          </button>

          {/* Nhạc nền (Hỗ trợ cả YouTube và MP3) */}
          <button
            type="button"
            onClick={() => {
              setIsPillDismissed(false);
              toggleMusic();
            }}
            title={isYouTube ? "Nhạc nền từ YouTube" : "Nhạc nền cưới"}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors cursor-pointer ${
              isPlaying ? "text-[#FDE68A]" : "text-[#E8D5CF]"
            }`}
          >
            {isYouTube ? (
              <div className="relative">
                <Volume2
                  className={`w-4 h-4 ${
                    isPlaying ? "animate-pulse text-[#FDE68A]" : ""
                  }`}
                />
                <span className="absolute -top-1 -right-2 text-[8px] font-bold text-[#FDE68A] leading-none">
                  YT
                </span>
              </div>
            ) : isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse text-[#FDE68A]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="text-[9px] uppercase tracking-wider font-serif font-bold">
              {isPlaying ? "Đang phát" : "Nhạc"}
            </span>
          </button>

          {/* Lời chúc */}
          <button
            type="button"
            onClick={() => scrollToSection("wishes")}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#E8D5CF] hover:text-[#FDE68A] transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#FDE68A]" />
            <span className="text-[9px] uppercase tracking-wider font-serif font-bold">
              Lời Chúc
            </span>
          </button>
        </div>
      </nav>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
