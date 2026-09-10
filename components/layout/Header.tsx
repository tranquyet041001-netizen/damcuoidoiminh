"use client";

import React, { useState, useEffect } from "react";
import { weddingData } from "@/data/wedding";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

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
          ? "bg-[#FAF3E8]/90 backdrop-blur-md shadow-xs py-2.5 border-b border-[#E5D4B6]/60"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2 text-[#183A3A] font-serif hover:opacity-80 transition-opacity"
        >
          <span className="text-base sm:text-lg font-semibold tracking-wide">
            {weddingData.groom.shortName}
          </span>
          <span className="text-[#9E3D32] text-xs sm:text-sm font-serif">&</span>
          <span className="text-base sm:text-lg font-semibold tracking-wide">
            {weddingData.bride.shortName}
          </span>
        </a>

        <div className="text-xs text-[#6B5549] tracking-wider uppercase font-medium">
          24.01.2027
        </div>
      </div>
    </header>
  );
};
