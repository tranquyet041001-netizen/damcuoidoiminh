"use client";

import React from "react";
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

interface WeddingInvitationViewProps {
  isPreview?: boolean;
}

export const WeddingInvitationView: React.FC<WeddingInvitationViewProps> = ({ isPreview = false }) => {
  return (
    <div
      className={`relative w-full min-h-full bg-do-texture flex flex-col selection:bg-[#9E3D32] selection:text-[#FFF9EE] ${
        isPreview ? "text-[95%]" : ""
      }`}
    >
      {/* Thanh tiêu đề cuộn nhẹ */}
      <Header />

      <main className="flex-1">
        {/* 1. Màn hình mở thiệp */}
        <HeroInvitation />

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
      </main>

      {/* 10. Lời cảm ơn & Chữ ký */}
      <Footer />

      {/* Nút nổi điều khiển nhạc, chia sẻ và RSVP nhanh */}
      {!isPreview && <FloatingControls />}
    </div>
  );
};
