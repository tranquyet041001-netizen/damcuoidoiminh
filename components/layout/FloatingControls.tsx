"use client";

import React, { useState, useRef } from "react";
import { Menu, Map, CheckCircle2, Volume2, VolumeX, X, ArrowUp } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";

export const FloatingControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          showToast("Đang phát khúc nhạc chúc phúc", "success");
        })
        .catch(() => {
          showToast("Vui lòng thử lại để bật âm thanh", "info");
        });
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <audio ref={audioRef} src={data.musicUrl} preload="none" loop aria-hidden="true" />

      {/* Menu Drawer Popup khi bấm nút Menu */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#183A3A]/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-[#FFF9EE] border-2 border-[#E5D4B6] w-full max-w-sm rounded-2xl p-6 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-[#8A7569] hover:bg-[#FAF3E8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs uppercase tracking-[0.25em] text-[#9E3D32] font-semibold mb-1">
              MỤC LỤC THIỆP CƯỚI
            </div>
            <h3 className="font-serif text-lg font-bold text-[#183A3A] mb-4">
              {data.groom.shortName} & {data.bride.shortName}
            </h3>

            <div className="space-y-2 text-sm font-serif">
              {[
                { id: "hero", label: "Mở Thiệp Báo Hỷ" },
                { id: "letter", label: "Lời Ngỏ Gia Đình" },
                { id: "story", label: "Câu Chuyện Chúng Tôi" },
                { id: "details", label: "Thông Tin Hôn Lễ" },
                { id: "rsvp", label: "Xác Nhận Tham Dự (RSVP)" },
                { id: "gallery", label: "Album Ảnh Cưới" },
                { id: "wishes", label: "Sổ Lưu Bút Lời Chúc" },
                { id: "gift", label: "Hộp Mừng Cưới" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="w-full py-2 px-3 rounded-lg hover:bg-[#FAF3E8] text-[#3A2D26] hover:text-[#9E3D32] transition-colors font-medium text-center"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG ĐÁY (BOTTOM DOCK BAR) - THEO ẢNH MẪU */}
      <nav
        aria-label="Thanh điều hướng nhanh"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[380px] bg-[#FFF9EE]/95 backdrop-blur-md border-2 border-[#EADBCE] rounded-full px-5 py-2 shadow-xl flex items-center justify-around ring-1 ring-[#D4AF37]/30"
      >
        {/* Nút Menu */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[#183A3A] hover:text-[#9E3D32] transition-colors group"
        >
          <Menu className="w-5 h-5 group-hover:scale-110 transition-transform text-[#183A3A]" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Menu</span>
        </button>

        {/* Nút Map (Chỉ đường / Bản đồ) */}
        <button
          type="button"
          onClick={() => scrollToSection("details")}
          className="flex flex-col items-center gap-0.5 text-[#183A3A] hover:text-[#9E3D32] transition-colors group"
        >
          <Map className="w-5 h-5 group-hover:scale-110 transition-transform text-[#183A3A]" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Map</span>
        </button>

        {/* Nút RSVP (Xác nhận tham dự) */}
        <button
          type="button"
          onClick={() => scrollToSection("rsvp")}
          className="flex flex-col items-center gap-0.5 text-[#9E3D32] hover:text-[#BD4B3F] transition-colors group"
        >
          <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform text-[#9E3D32]" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#9E3D32]">RSVP</span>
        </button>

        {/* Nút Nhạc Nền */}
        <button
          type="button"
          onClick={toggleMusic}
          className={`flex flex-col items-center gap-0.5 transition-colors group ${
            isPlaying ? "text-[#D4AF37]" : "text-[#78928A]"
          }`}
          title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse text-[#D4AF37]" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#78928A]" />
          )}
          <span className="text-[10px] uppercase tracking-wider font-semibold">Nhạc</span>
        </button>
      </nav>
    </>
  );
};
