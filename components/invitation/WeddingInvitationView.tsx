"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingControls } from "@/components/layout/FloatingControls";
import { HeroInvitation } from "@/components/invitation/HeroInvitation";
import { CinematicOpeningVideo } from "@/components/invitation/CinematicOpeningVideo";
import { ImperialLongPhungInvitation } from "@/components/invitation/ImperialLongPhungInvitation";
import { ImperialCeremonySchedule } from "@/components/invitation/ImperialCeremonySchedule";
import { ImperialCoupleStory } from "@/components/invitation/ImperialCoupleStory";
import { ImperialCountdown } from "@/components/invitation/ImperialCountdown";
import { ImperialRSVPForm } from "@/components/invitation/ImperialRSVPForm";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { WishBook } from "@/components/invitation/WishBook";
import { ImperialGiftCard } from "@/components/invitation/ImperialGiftCard";
import { ImperialScrollOpeningAnimation } from "@/components/invitation/ImperialScrollOpeningAnimation";
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

  const [isShowingScrollAnimation, setIsShowingScrollAnimation] = useState<boolean>(false);

  const { data: weddingData } = useWeddingData();
  const { playMusic } = useMusic();

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

  const handleStartScrollOpening = () => {
    playMusic();
    setIsShowingScrollAnimation(true);
  };

  const handleScrollAnimationComplete = () => {
    setIsShowingScrollAnimation(false);
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    onOpenChange?.(true);
  };

  const handleOpen = () => {
    playMusic();
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    onOpenChange?.(true);
  };

  const handleReplayOpening = () => {
    setIsShowingScrollAnimation(false);
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
      } bg-[#0D0203] text-[#FFF8D6] flex flex-col selection:bg-[#BA1B22] selection:text-[#FFF8D6] ${
        isPreview ? "text-[95%]" : ""
      }`}
    >
      {/* ── MÀN HÌNH MỞ ĐẦU CINEMATIC VIDEO RỒNG - PHƯỢNG (CHỈ KHI CHỌN VIDEO) ── */}
      {isVideoOpening && !isEnvelopeOpen && !isShowingScrollAnimation && (
        <CinematicOpeningVideo
          weddingData={weddingData}
          onOpenInvitation={handleStartScrollOpening}
          isOpen={isEnvelopeOpen}
        />
      )}

      {/* ── HOẠT ẢNH MỞ CHIẾU THƯ HOÀNG GIA (SAU KHI ẤN CHỮ HỶ) ── */}
      {isShowingScrollAnimation && (
        <ImperialScrollOpeningAnimation
          weddingData={weddingData}
          onComplete={handleScrollAnimationComplete}
        />
      )}

      {/* Thanh tiêu đề cuộn hoàng gia */}
      <Header isGuestView={isGuestView} isPreview={isPreview} />

      {/* ── AMBIENT FLOATING PETALS (chỉ sau khi mở thiệp, desktop only) ── */}
      {isEnvelopeOpen && <FloatingPetals />}

      <main className="flex-1">
        {/* Màn hình mở thiệp (Thiệp Báo Hỷ / Bìa Thiệp Phong Thư Cũ) - Chỉ hiển thị khi chọn envelope */}
        {!isVideoOpening && (
          <HeroInvitation
            isOpen={isEnvelopeOpen}
            onOpen={handleOpen}
            onReplayOpening={handleReplayOpening}
          />
        )}

        {/* ── CÁC PHẦN HOÀNG GIA ĐỒNG BỘ - CHỈ HIỂN THỊ KHI ĐÃ ẤN "MỞ THIỆP" ── */}
        <AnimatePresence>
          {isEnvelopeOpen && (
            <motion.div
              key="wedding-subsequent-content"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="space-y-0"
            >
              {/* 1. HOÀNG GIA HỶ THƯ • LONG PHỤNG CÁT TƯỜNG (Kính mời đích danh & Phụ mẫu dâu rể) */}
              <ImperialLongPhungInvitation />

              {/* Dải phân cách hoa văn kim chỉ hoàng gia */}
              <SectionDivider fromColor="#0F0708" toColor="#140406" variant="lotus" />

              {/* 2. ĐIỂN LỄ HỶ SỰ HOÀNG TRIỀU (Lễ Thành Hôn & Tiệc Cưới Hoa Đường, Chỉ đường & Lưu lịch) */}
              <ImperialCeremonySchedule />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#140406" toColor="#120204" variant="lotus" />

              {/* 3. DUYÊN KHỞI TRĂM NĂM • THƯ HỌA CHUYỆN TÌNH YÊU (Trục cuộn gấm thêu hoàng cung) */}
              <ImperialCoupleStory />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#120204" toColor="#150305" variant="lotus" />

              {/* 4. KHẮC THỜI HOÀNG ĐẠO • ĐẾM NGƯỢC NGÀY CÁT NHẬT */}
              <ImperialCountdown />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#150305" toColor="#110204" variant="lotus" />

              {/* 5. HỶ BÁO TƯƠNG TRI • KÍNH BÁO THAM DỰ HÔN LỄ (Tráp thư hồi đáp hoàng gia) */}
              <ImperialRSVPForm />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#110204" toColor="#100203" variant="lotus" />

              {/* 6. HOÀNG TRIỀU HỶ ẢNH • KHOẢNH KHẮC GIAI KỲ (Album ảnh cưới & Lightbox) */}
              <PhotoGallery />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#100203" toColor="#0C0204" variant="lotus" />

              {/* 7. BẦU TRỜI HOA ĐĂNG & THẮP SÁNG HOA ĐĂNG CUNG ĐÌNH */}
              <WishBook />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#0C0204" toColor="#140305" variant="lotus" />

              {/* 8. TRÁP CƯỚI CÁT TƯỜNG • HỘP MỪNG CƯỚI CHÚC PHÚC & VIETQR KHUNG VÀNG */}
              <ImperialGiftCard />

              {/* Dải phân cách */}
              <SectionDivider fromColor="#140305" toColor="#160305" variant="lotus" />

              {/* 9. LỜI CẢM TẠ & DẤU ẤN TRIỆN SON HOÀNG GIA */}
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
