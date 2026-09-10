"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Share2, Send, ArrowUp } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { useToast } from "@/components/ui/Toast";

export const FloatingControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleShare = async () => {
    const shareData = {
      title: `Thiệp Cưới • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
      text: `${weddingData.welcomeQuote} — Kính mời bạn tới chung vui cùng chúng mình vào ${weddingData.weddingDateFormatted}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Đã sao chép liên kết thiệp cưới!", "success");
      } catch {
        showToast("Không thể sao chép liên kết", "info");
      }
    }
  };

  const scrollToRSVP = () => {
    const element = document.getElementById("rsvp");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={weddingData.musicUrl}
        preload="none"
        loop
        aria-hidden="true"
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5">
        {/* Nút lên đầu trang */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Cuộn lên đầu trang"
            className="w-10 h-10 rounded-full bg-[#FFF9EE] text-[#183A3A] border border-[#E5D4B6] shadow-md flex items-center justify-center hover:bg-[#F4E8D2] active:scale-95 transition-all"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Nút chia sẻ thiệp */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Chia sẻ thiệp cưới"
          title="Chia sẻ thiệp cưới"
          className="w-11 h-11 rounded-full bg-[#FFF9EE] text-[#183A3A] border border-[#E5D4B6] shadow-md flex items-center justify-center hover:bg-[#F4E8D2] active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Nút bật/tắt nhạc nền (mặc định tắt) */}
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Tắt nhạc nền" : "Bật khúc nhạc chúc phúc"}
          title={isPlaying ? "Tắt nhạc nền" : "Bật khúc nhạc chúc phúc"}
          className={`w-11 h-11 rounded-full shadow-md flex items-center justify-center transition-all active:scale-95 ${
            isPlaying
              ? "bg-[#9E3D32] text-[#FFF9EE] animate-spin-slow ring-2 ring-[#9E3D32]/30"
              : "bg-[#FFF9EE] text-[#183A3A] border border-[#E5D4B6] hover:bg-[#F4E8D2]"
          }`}
          style={{ animationDuration: "10s" }}
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Nút Xác nhận tham dự nổi bật */}
        <button
          type="button"
          onClick={scrollToRSVP}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#183A3A] text-[#FFF9EE] font-serif text-sm font-medium shadow-lg hover:bg-[#2B5757] active:scale-95 transition-all border border-[#78928A]/40"
        >
          <Send className="w-3.5 h-3.5 text-[#F4E8D2]" />
          <span>Gửi Lời Chúc / RSVP</span>
        </button>
      </div>
    </>
  );
};
