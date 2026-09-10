"use client";

import React, { useState, useRef } from "react";
import {
  Menu,
  Map,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Share2,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { ShareModal } from "@/components/invitation/ShareModal";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { showToast } = useToast();
  const { data } = useWeddingData();

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      showToast("Đã tạm dừng nhạc nền", "info");
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          showToast("Đang phát điệu nhạc hạnh phúc 🎵", "success");
        })
        .catch(() => showToast("Vui lòng chạm lại để bật âm thanh", "info"));
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <audio ref={audioRef} src={data.musicUrl} preload="none" loop aria-hidden="true" />

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
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left transition-all hover:bg-[#F0F5EE] active:scale-98 group border border-transparent hover:border-[#A8BCA1]/30"
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
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-serif font-semibold bg-[#FDF0EC] text-[#C4715A] border border-[#E8D5CF] transition-all hover:bg-[#F5E2DB]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia Sẻ Thiệp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleMusic();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-serif font-semibold transition-all ${
                    isPlaying
                      ? "bg-[#F0F5EE] text-[#4A6741] border border-[#A8BCA1]/40"
                      : "bg-[#FDFAF5] text-[#8C6A58] border border-[#E8D5CF]"
                  }`}
                >
                  {isPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? "Tắt Nhạc" : "Bật Nhạc"}</span>
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
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#5C4033] hover:text-[#4A6741] transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">Menu</span>
          </button>

          {/* Địa điểm */}
          <button
            type="button"
            onClick={() => scrollToSection("details")}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#5C4033] hover:text-[#4A6741] transition-colors"
          >
            <Map className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">Địa Điểm</span>
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
                background: "linear-gradient(135deg, #C4715A 0%, #A4503B 100%)",
                boxShadow: "0 6px 16px -2px rgba(196, 113, 90, 0.45)",
              }}
            >
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#C4715A] font-sans mt-0.5">
              RSVP
            </span>
          </button>

          {/* Nhạc nền */}
          <button
            type="button"
            onClick={toggleMusic}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
              isPlaying ? "text-[#4A6741]" : "text-[#8C6A58]"
            }`}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">Nhạc</span>
          </button>

          {/* Lời chúc */}
          <button
            type="button"
            onClick={() => scrollToSection("wishes")}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#5C4033] hover:text-[#C4715A] transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold">Lời Chúc</span>
          </button>
        </div>
      </nav>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
