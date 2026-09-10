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
}

const navItems = [
  { id: "hero", label: "Bìa Thiệp", emoji: "🌸" },
  { id: "letter", label: "Lời Ngỏ", emoji: "✉️" },
  { id: "story", label: "Chuyện Tình", emoji: "🌿" },
  { id: "details", label: "Hôn Lễ", emoji: "🏮" },
  { id: "countdown", label: "Đếm Ngược", emoji: "⏳" },
  { id: "rsvp", label: "RSVP", emoji: "✅" },
  { id: "gallery", label: "Album Ảnh", emoji: "📷" },
  { id: "wishes", label: "Lời Chúc", emoji: "💌" },
  { id: "gift", label: "Mừng Cưới", emoji: "🎁" },
];

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isGuestView = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPillDismissed, setIsPillDismissed] = useState(false);

  const { data } = useWeddingData();
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
            className="fixed bottom-19 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[350px] px-3.5 py-2 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#C9A84C]/50 shadow-lg flex items-center justify-between gap-2"
          >
            {/* Đĩa xoay / Hoa sen & Tên bài hát */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-[#F0F5EE] border border-[#A8BCA1] flex items-center justify-center shrink-0 shadow-xs">
                {isYouTube ? (
                  <YouTubeIcon className="w-3.5 h-3.5 text-[#C4715A] animate-pulse" />
                ) : (
                  <span className="text-xs animate-spin-slow inline-block">🌸</span>
                )}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-serif font-bold text-[#354D2E] truncate leading-tight">
                  {currentSongTitle}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {/* Equalizer bars */}
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 bg-[#4A6741] animate-equalizer-1 rounded-full" />
                    <span className="w-0.5 bg-[#C4715A] animate-equalizer-2 rounded-full" />
                    <span className="w-0.5 bg-[#C9A84C] animate-equalizer-3 rounded-full" />
                  </div>
                  <span className="text-[9px] text-[#8C6A58] uppercase tracking-wider font-sans font-medium">
                    {isYouTube ? "YouTube Audio" : "Acoustic Wedding"}
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
                  className="px-2 py-1 rounded-full bg-[#FDF0EC] text-[#C4715A] border border-[#E8D5CF] text-[10px] font-semibold flex items-center gap-1 hover:bg-[#F5E2DB] cursor-pointer"
                >
                  <Video className="w-3 h-3" />
                  <span>{showVideoPreview ? "Ẩn" : "MV"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
                className="p-1.5 rounded-full text-[#5C4033] hover:text-[#4A6741] hover:bg-black/5 cursor-pointer transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#4A6741]" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMusic}
                title="Tạm dừng nhạc"
                className="w-7 h-7 rounded-full bg-[#4A6741] text-white flex items-center justify-center hover:bg-[#354D2E] transition-colors cursor-pointer shadow-xs"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsPillDismissed(true)}
                title="Thu gọn thanh nhạc"
                className="w-5 h-5 rounded-full flex items-center justify-center text-[#8C6A58] hover:text-[#354D2E] cursor-pointer text-xs"
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
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-[#FFFDF9] border border-[#E8D5CF]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header menu */}
              <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[#E8D5CF]/70 bg-[#FDF0EC]/60">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C4715A] font-sans font-bold">
                    Mục Lục Thiệp Cưới
                  </p>
                  <h3 className="font-calligraphy text-2xl text-[#354D2E] leading-tight mt-0.5">
                    {data.groom.shortName} &amp; {data.bride.shortName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C6A58] hover:text-[#354D2E] hover:bg-black/5 transition-colors cursor-pointer"
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
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left transition-all hover:bg-[#F0F5EE] active:scale-98 group border border-transparent hover:border-[#A8BCA1]/30 cursor-pointer"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="font-serif text-xs text-[#5C4033] group-hover:text-[#354D2E] transition-colors font-semibold">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Nút tác vụ chân menu */}
              <div className="px-4 pb-5 pt-2 flex gap-2 border-t border-[#E8D5CF]/70">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsShareOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-serif font-semibold bg-[#FDF0EC] text-[#C4715A] border border-[#E8D5CF] transition-all hover:bg-[#F5E2DB] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia Sẻ Thiệp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsPillDismissed(false);
                    toggleMusic();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer ${
                    isPlaying
                      ? "bg-[#F0F5EE] text-[#4A6741] border border-[#A8BCA1]/40"
                      : "bg-[#FDFAF5] text-[#8C6A58] border border-[#E8D5CF]"
                  }`}
                >
                  {isYouTube ? (
                    <YouTubeIcon
                      className={`w-3.5 h-3.5 ${
                        isPlaying ? "text-[#C4715A] animate-pulse" : ""
                      }`}
                    />
                  ) : isPlaying ? (
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#4A6741]" />
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
        className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[360px]"
      >
        <div className="flex items-center justify-around px-2 py-2 rounded-full bg-[#FFFDF9]/92 backdrop-blur-md border border-[#E8D5CF] shadow-lg">
          {/* Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#5C4033] hover:text-[#4A6741] transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">
              Menu
            </span>
          </button>

          {/* Địa điểm */}
          <button
            type="button"
            onClick={() => scrollToSection("details")}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#5C4033] hover:text-[#4A6741] transition-colors cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">
              Địa Điểm
            </span>
          </button>

          {/* Nút RSVP Nhô Cao */}
          <button
            type="button"
            onClick={() => scrollToSection("rsvp")}
            className="flex flex-col items-center gap-0.5 -mt-4 transition-transform active:scale-95 cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-[#FDFAF5] shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #C4715A 0%, #A4503B 100%)",
                boxShadow: "0 6px 16px -2px rgba(196, 113, 90, 0.45)",
              }}
            >
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#C4715A] font-sans mt-0.5">
              RSVP
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
              isPlaying ? "text-[#4A6741]" : "text-[#8C6A58]"
            }`}
          >
            {isYouTube ? (
              <div className="relative">
                <Volume2
                  className={`w-4 h-4 ${
                    isPlaying ? "animate-pulse text-[#4A6741]" : ""
                  }`}
                />
                <span className="absolute -top-1 -right-2 text-[8px] font-bold text-[#C4715A] leading-none">
                  YT
                </span>
              </div>
            ) : isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse text-[#4A6741]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">
              {isPlaying ? "Đang phát" : "Nhạc"}
            </span>
          </button>

          {/* Lời chúc */}
          <button
            type="button"
            onClick={() => scrollToSection("wishes")}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#5C4033] hover:text-[#C4715A] transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">
              Lời Chúc
            </span>
          </button>
        </div>
      </nav>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
