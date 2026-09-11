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
import { SectionDivider } from "@/components/ui/SectionDivider";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
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

  // Cho phép kiểm tra nhanh qua URL ?opening=video hoặc ?opening=envelope
  const [urlOpeningStyle, setUrlOpeningStyle] = useState<"video" | "envelope" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("opening");
      if (param === "video" || param === "envelope") {
        setUrlOpeningStyle(param);
      }
    }
  }, []);

  const activeOpeningStyle: "video" | "envelope" =
    urlOpeningStyle || weddingData.openingStyle || "video";
  const isVideoOpening = activeOpeningStyle === "video";

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
      const ignoredHash = isVideoOpening ? "" : "#hero";
      if (hash && hash !== ignoredHash) {
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(true);
        }
        onOpenChange?.(true);
      }
    }
  }, [controlledIsOpen, onOpenChange, isVideoOpening]);

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
      {/* ── MÀN HÌNH MỞ ĐẦU CINEMATIC VIDEO RỒNG - PHƯỢNG (CHỈ KHI CHỌN VIDEO) ── */}
      {isVideoOpening && !isEnvelopeOpen && (
        <CinematicOpeningVideo
          weddingData={weddingData}
          onOpenInvitation={handleOpen}
          isOpen={isEnvelopeOpen}
        />
      )}

      {/* Thanh tiêu đề cuộn nhẹ */}
      <Header isGuestView={isGuestView} isPreview={isPreview} />

      {/* ── AMBIENT FLOATING PETALS (chỉ sau khi mở thiệp, desktop only) ── */}
      {isEnvelopeOpen && <FloatingPetals />}

      <main className="flex-1">
        {/* 1. Màn hình mở thiệp (Thiệp Báo Hỷ / Bìa Thiệp Phong Thư Cũ)
            CHỈ hiển thị khi người dùng chọn phong cách "envelope".
            Khi chọn "video", ẩn hoàn toàn màn hình mở thiệp cũ này. */}
        {!isVideoOpening && (
          <HeroInvitation
            isOpen={isEnvelopeOpen}
            onOpen={handleOpen}
            onReplayOpening={handleReplayOpening}
          />
        )}

        {/* ── CÁC PHẦN SAU CHỈ HIỂN THỊ KHI ĐÃ ẤN "MỞ THIỆP" ── */}
        <AnimatePresence>
          {isEnvelopeOpen && (
            <motion.div
              key="wedding-subsequent-content"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              {/* 2. Lời ngỏ từ hai bên gia đình (hiển thị đích danh khách trên cả 2 chế độ) */}
              <OpeningLetter showGuestGreeting={true} isTopSection={isVideoOpening} />

              {/* ── DIVIDER: ivory → sage ── */}
              <SectionDivider fromColor="#FDFAF5" toColor="#F0F5EE" variant="wave" />

              {/* 3. Dòng thời gian chuyện tình yêu */}
              <CoupleStory />

              {/* ── DIVIDER: sage → ivory ── */}
              <SectionDivider fromColor="#F0F5EE" toColor="#FDFAF5" variant="botanical" />

              {/* 4. Thông tin Lễ Thành Hôn & Tiệc Cưới */}
              <WeddingDetails />

              {/* ── DIVIDER: ivory → dark green (for countdown dark bg) ── */}
              <SectionDivider fromColor="#FDFAF5" toColor="#1C2919" variant="wave-reverse" />

              {/* 5. Bộ đếm ngược thời gian */}
              <Countdown />

              {/* ── DIVIDER: dark green → peach ── */}
              <SectionDivider fromColor="#1C2919" toColor="#FDF0EC" variant="wave" />

              {/* 6. Form xác nhận tham dự */}
              <RSVPForm />

              {/* ── DIVIDER: peach → sage ── */}
              <SectionDivider fromColor="#FDF0EC" toColor="#F0F5EE" variant="botanical" />

              {/* 7. Album ảnh cưới & Lightbox */}
              <PhotoGallery />

              {/* ── DIVIDER: sage → peach ── */}
              <SectionDivider fromColor="#F0F5EE" toColor="#FDF0EC" variant="wave-reverse" />

              {/* 8. Sổ lưu bút */}
              <WishBook />

              {/* ── DIVIDER: peach → ivory ── */}
              <SectionDivider fromColor="#FDF0EC" toColor="#FDFAF5" variant="lotus" />

              {/* 9. Mừng cưới kín đáo / QR ngân hàng */}
              <GiftCard />

              {/* ── DIVIDER: ivory → dark green (footer) ── */}
              <SectionDivider fromColor="#FDFAF5" toColor="#354D2E" variant="botanical" />

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
              <FloatingControls
                isGuestView={isGuestView}
                onReplayOpening={handleReplayOpening}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
