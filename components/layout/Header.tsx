"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, Share2 } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ShareModal } from "@/components/invitation/ShareModal";

interface HeaderProps {
  isGuestView?: boolean;
  isPreview?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isGuestView = false,
  isPreview = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { data } = useWeddingData();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min((y / docH) * 100, 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trong chế độ preview (Admin live preview), dùng sticky để không bị đè lên header của trang Admin
  const positionClass = isPreview
    ? "sticky top-0 left-0 right-0 z-20"
    : "fixed top-0 left-0 right-0 z-40";

  return (
    <>
      <header
        className={`${positionClass} transition-all duration-300 ${
          scrolled || isPreview
            ? "bg-[#FDFAF5]/95 backdrop-blur-md shadow-2xs border-b border-[#E8D5CF]/60 py-2.5"
            : "bg-transparent py-4"
        }`}
      >
        {/* Progress bar */}
        {!isPreview && (
          <div
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#4A6741] via-[#C9A84C] to-[#C4715A] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        )}

        <div className="max-w-xl md:max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-2 text-[#354D2E] hover:opacity-85 transition-opacity"
          >
            <span className="font-serif font-bold text-sm sm:text-base tracking-wide">
              {data.groom.shortName}
            </span>
            <span className="text-[#C4715A] font-serif text-xs sm:text-sm">&amp;</span>
            <span className="font-serif font-bold text-sm sm:text-base tracking-wide">
              {data.bride.shortName}
            </span>
          </a>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] text-[#8C6A58] uppercase tracking-wider font-sans hidden sm:inline">
              {data.weddingDateFormatted ? data.weddingDateFormatted.slice(0, 10) : ""}
            </span>

            {/* Nút chia sẻ */}
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-serif font-semibold tracking-wide uppercase px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FDF0EC] text-[#354D2E] border border-[#E8D5CF] shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-[#C4715A]" />
              <span>Chia Sẻ</span>
            </button>

            {/* Nút Chỉnh sửa (chỉ hiện trên trang thiệp chính khi không phải khách và không phải preview) */}
            {!isGuestView && !isPreview && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-[10px] sm:text-[11px] font-serif font-semibold tracking-wide uppercase px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] shadow-2xs transition-all active:scale-95"
              >
                <Edit3 className="w-3 h-3" />
                <span>Chỉnh Sửa</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
