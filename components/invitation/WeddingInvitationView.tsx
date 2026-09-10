"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingControls } from "@/components/layout/FloatingControls";
import { HeroInvitation } from "@/components/invitation/HeroInvitation";
import { OpeningLetter } from "@/components/invitation/OpeningLetter";
import { CoupleStory } from "@/components/invitation/CoupleStory";
import { WeddingDetails } from "@/components/invitation/WeddingDetails";
import { Countdown } from "@/components/invitation/Countdown";
import { RSVPForm } from "@/components/invitation/RSVPForm";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { WishBook } from "@/components/invitation/WishBook";
import { GiftCard } from "@/components/invitation/GiftCard";
import { CinematicOpeningVideo } from "@/components/invitation/CinematicOpeningVideo";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useMusic } from "@/context/MusicContext";

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
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(() => {
    if (defaultOpen !== undefined) return defaultOpen;
    if (isPreview) return true;
    return false;
  });

  const { data: weddingData } = useWeddingData();
  const { playMusic, isPlaying } = useMusic();

  const isEnvelopeOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (!isPlaying) {
      playMusic();
    }
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    onOpenChange?.(true);
  };

  const handleReplayOpening = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onOpenChange?.(false);
  };

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

  return (
    <div
      className={`relative w-full ${
        isEnvelopeOpen
          ? "min-h-full"
          : "min-h-[100dvh] overflow-x-hidden overscroll-none"
      } bg-ivory-texture flex flex-col selection:bg-[#C4715A] selection:text-[#FDFAF5] ${
        isPreview ? "text-[95%]" : ""
      }`}
    >
      {/* ── MÀN HÌNH MỞ ĐẦU CINEMATIC VIDEO RỒNG - PHƯỢNG ── */}
      {!isEnvelopeOpen && (
        <CinematicOpeningVideo
          weddingData={weddingData}
          onOpenInvitation={handleOpen}
          isOpen={isEnvelopeOpen}
        />
      )}

      {/* Thanh tiêu đề cuộn nhẹ */}
      <Header isGuestView={isGuestView} isPreview={isPreview} />

      <main className="flex-1">
        {/* 1. Màn hình mở thiệp (Thiệp Báo Hỷ / Bìa Thiệp) */}
        <HeroInvitation
          isOpen={isEnvelopeOpen}
          onOpen={handleOpen}
          onReplayOpening={handleReplayOpening}
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
