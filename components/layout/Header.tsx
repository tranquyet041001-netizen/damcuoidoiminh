"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useWeddingData();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF3E8]/95 backdrop-blur-md shadow-xs py-2.5 border-b border-[#E5D4B6]/60"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2 text-[#183A3A] font-serif hover:opacity-80 transition-opacity"
        >
          <span className="text-base sm:text-lg font-semibold tracking-wide">
            {data.groom.shortName}
          </span>
          <span className="text-[#9E3D32] text-xs sm:text-sm font-serif">&</span>
          <span className="text-base sm:text-lg font-semibold tracking-wide">
            {data.bride.shortName}
          </span>
        </a>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B5549] tracking-wider uppercase font-medium hidden sm:inline">
            24.01.2027
          </span>

          <Link
            href="/admin"
            title="Mở trang chỉnh sửa thiệp cưới"
            className="flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#FAF3E8] hover:bg-[#F4E8D2] text-[#9E3D32] border border-[#9E3D32]/30 shadow-2xs transition-all active:scale-95"
          >
            <Edit3 className="w-3 h-3" />
            <span>Chỉnh Sửa</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
