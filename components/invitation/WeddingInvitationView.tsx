"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingControls } from "@/components/layout/FloatingControls";
import { HeroInvitation } from "@/components/invitation/HeroInvitation";
import { DragonPhoenixEffect } from "@/components/invitation/DragonPhoenixEffect";
import { FallingPetals } from "@/components/invitation/FallingPetals";
import { FloatingLoveSymbols } from "@/components/invitation/FloatingLoveSymbols";
import { OpeningLetter } from "@/components/invitation/OpeningLetter";
import { CoupleStory } from "@/components/invitation/CoupleStory";
import { WeddingDetails } from "@/components/invitation/WeddingDetails";
import { Countdown } from "@/components/invitation/Countdown";
import { RSVPForm } from "@/components/invitation/RSVPForm";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { WishBook } from "@/components/invitation/WishBook";
import { GiftCard } from "@/components/invitation/GiftCard";
import { useWeddingData } from "@/context/WeddingDataContext";

interface WeddingInvitationViewProps {
  isPreview?: boolean;
  isGuestView?: boolean;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const WeddingInvitationView: React.FC<WeddingInvitationViewProps> = ({
  isPreview = false,
  isGuestView = false,
  defaultOpen,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const { data: weddingData, updateData } = useWeddingData();

  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(() => {
    if (defaultOpen !== undefined) return defaultOpen;
    if (isPreview) return true;
    return false;
  });

  const isEnvelopeOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const [playDragonPhoenix, setPlayDragonPhoenix] = useState<boolean>(false);
  const prevOpenRef = useRef(isEnvelopeOpen);

  // Nhận diện theme từ query param hoặc data
  const [urlTheme, setUrlTheme] = useState<"crimson-gold" | "sage-green" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("theme");
      if (t === "red" || t === "crimson" || t === "crimson-gold") {
        setUrlTheme("crimson-gold");
      } else if (t === "green" || t === "sage" || t === "sage-green") {
        setUrlTheme("sage-green");
      }
    }
  }, []);

  const activeTheme = urlTheme || weddingData.theme || "crimson-gold";
  const isRedTheme = activeTheme === "crimson-gold";
  const animations = weddingData.animations || {
    fallingPetals: true,
    dragonPhoenix: true,
    floatingHearts: true,
    sparkles: true,
  };

  const handleOpen = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    if (animations.dragonPhoenix !== false) {
      setPlayDragonPhoenix(true);
    }
    onOpenChange?.(true);
  };

  // Kích hoạt hiệu ứng Long Phụng khi thiệp chuyển từ đóng sang mở
  useEffect(() => {
    if (!prevOpenRef.current && isEnvelopeOpen && animations.dragonPhoenix !== false) {
      setPlayDragonPhoenix(true);
    }
    prevOpenRef.current = isEnvelopeOpen;
  }, [isEnvelopeOpen, animations.dragonPhoenix]);

  // Tự động mở nếu khách truy cập bằng anchor link trực tiếp (#rsvp, #details, #gallery, #wishes)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      if (hash && hash !== "#hero") {
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(true);
        }
        onOpenChange?.(true);
      }
    }
  }, [controlledIsOpen, onOpenChange]);

  const toggleTheme = () => {
    const nextTheme = activeTheme === "crimson-gold" ? "sage-green" : "crimson-gold";
    updateData({ theme: nextTheme });
    setUrlTheme(null);
  };

  return (
    <div
      data-theme={activeTheme}
      className={`relative w-full ${
        isEnvelopeOpen
          ? "min-h-full"
          : "min-h-[100dvh] overflow-x-hidden overscroll-none"
      } ${
        isRedTheme
          ? "bg-red-ivory-texture selection:bg-[#9F171B] selection:text-[#FDFAF5]"
          : "bg-ivory-texture selection:bg-[#C4715A] selection:text-[#FDFAF5]"
      } flex flex-col ${isPreview ? "text-[95%]" : ""}`}
    >
      {/* ── HOẠT ẢNH CƯỚI: MƯA CÁNH HOA ĐÀO/HỒNG RƠI LÃNG MẠN ── */}
      <FallingPetals
        enabled={animations.fallingPetals !== false}
        theme={activeTheme}
      />

      {/* ── HOẠT ẢNH CƯỚI: SONG HỶ 囍 & TRÁI TIM BAY BỒNG BỀNH ── */}
      <FloatingLoveSymbols
        enabled={animations.floatingHearts !== false}
        theme={activeTheme}
      />

      {/* Thanh tiêu đề cuộn nhẹ */}
      <Header isGuestView={isGuestView} isPreview={isPreview} />

      {/* Nút chuyển đổi nhanh giao diện xem thử */}
      {isPreview && (
        <div className="fixed top-20 right-4 z-50">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold shadow-xl border backdrop-blur-md transition-all active:scale-95 cursor-pointer bg-white/95 text-[#9F171B] border-[#C9A84C]"
            title="Đổi giữa Giao diện Đỏ Hoàng Gia và Xanh Thanh Nhã"
          >
            <span>{isRedTheme ? "🏮 Đỏ Hoàng Gia" : "🌿 Xanh Thanh Nhã"}</span>
            <span className="text-[10px] text-[#B45309] font-sans font-normal underline">(Đổi)</span>
          </button>
        </div>
      )}

      <main className="flex-1">
        {/* 1. Màn hình mở thiệp (Phong Bì Thư 3D / Bìa Thiệp) */}
        <HeroInvitation
          isOpen={isEnvelopeOpen}
          onOpen={handleOpen}
          onReplayDragonPhoenix={() => setPlayDragonPhoenix(true)}
        />

        {/* Hiệu ứng Rồng Phượng thêu gấm bay xoắn vào nhau khi mở thiệp */}
        <DragonPhoenixEffect
          isActive={playDragonPhoenix}
          onComplete={() => setPlayDragonPhoenix(false)}
        />

        {/* ── CÁC PHẦN SAU CHỈ HIỂN THỊ KHI ĐÃ ẤN "MỞ THIỆP CHÚC MỪNG" ── */}
        <AnimatePresence>
          {isEnvelopeOpen && (
            <motion.div
              key="wedding-subsequent-content"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              {/* 2. Lời ngỏ từ hai bên gia đình */}
              <OpeningLetter />

              {/* 3. Dòng thời gian chuyện tình yêu */}
              <CoupleStory />

              {/* 4. Thông tin Lễ Thành Hôn & Tiệc Cưới */}
              <WeddingDetails />

              {/* 5. Bộ đếm ngược thời gian */}
              <Countdown />

              {/* 6. Form xác nhận tham dự */}
              <RSVPForm />

              {/* 7. Album ảnh cưới & Lightbox */}
              <PhotoGallery />

              {/* 8. Sổ lưu bút */}
              <WishBook />

              {/* 9. Mừng cưới kín đáo / QR ngân hàng */}
              <GiftCard />

              {/* 10. Lời cảm ơn & Chữ ký */}
              <Footer isGuestView={isGuestView} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Nút nổi điều khiển nhạc, chia sẻ và RSVP nhanh - chỉ xuất hiện sau khi mở thiệp */}
      {!isPreview && (
        <AnimatePresence>
          {isEnvelopeOpen && (
            <motion.div
              key="floating-controls-dock"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <FloatingControls isGuestView={isGuestView} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default WeddingInvitationView;
