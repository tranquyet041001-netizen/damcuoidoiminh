"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, Share2 } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ShareModal } from "@/components/invitation/ShareModal";

interface HeaderProps {
  isGuestView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isGuestView = false }) => {
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#FDFAF5]/90 backdrop-blur-md shadow-2xs border-b border-[#E8D5CF]/60 py-2.5"
            : "bg-transparent py-4"
        }`}
      >
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#4A6741] via-[#C9A84C] to-[#C4715A] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-2 text-[#354D2E] hover:opacity-85 transition-opacity"
          >
            <span className="font-serif font-bold text-base sm:text-lg tracking-wide">
              {data.groom.shortName}
            </span>
            <span className="text-[#C4715A] font-serif text-sm">&amp;</span>
            <span className="font-serif font-bold text-base sm:text-lg tracking-wide">
              {data.bride.shortName}
            </span>
          </a>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8C6A58] uppercase tracking-wider font-sans hidden sm:inline">
              {data.weddingDateFormatted.slice(0, 10)}
            </span>

            {/* Nút chia sẻ */}
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1 text-[11px] font-serif font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FDF0EC] text-[#354D2E] border border-[#E8D5CF] shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-[#C4715A]" />
              <span>Chia Sẻ</span>
            </button>

            {/* Nút Chỉnh sửa (ẩn nếu khách xem) */}
            {!isGuestView && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-[11px] font-serif font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] shadow-2xs transition-all active:scale-95"
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
