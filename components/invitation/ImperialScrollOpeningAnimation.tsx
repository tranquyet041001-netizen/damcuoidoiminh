"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ChevronRight } from "lucide-react";
import { WeddingData } from "@/types/wedding";
import { getGuestNameFromUrl } from "@/utils/guest";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";

interface ImperialScrollOpeningAnimationProps {
  weddingData: WeddingData;
  onComplete: () => void;
}

export const ImperialScrollOpeningAnimation: React.FC<ImperialScrollOpeningAnimationProps> = ({
  weddingData,
  onComplete,
}) => {
  const [guestName, setGuestName] = useState<string>("");
  const [scrollPhase, setScrollPhase] = useState<"closed" | "untying" | "opening" | "opened">("closed");
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());

    // Kịch bản hoạt ảnh chiếu thư hoàng cung TỰ ĐỘNG MỞ mượt mà (không cần bất kỳ thao tác bấm nào):
    // T = 0.15s: Dây đai lụa và ấn triện vàng tháo mở
    const t1 = setTimeout(() => {
      setScrollPhase("untying");
    }, 150);

    // T = 0.5s: Hai trục cuộn mạ vàng tự động lăn mở sang hai bên tả - hữu
    const t2 = setTimeout(() => {
      setScrollPhase("opening");
    }, 500);

    // T = 1.1s: Chiếu thư mở hoàn toàn, hiển thị đại tự, tên khách & triện son Chu Sa
    const t3 = setTimeout(() => {
      setScrollPhase("opened");
      setCanSkip(true);
    }, 1100);

    // T = 2.8s: Chiếu thư tự động mở hoàn tất và chuyển tiếp êm ái vào thiệp chính
    const t4 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onClick={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor: "#0A0102" }}
    >
      {/* Nền gấm hoàng cung sâu thẳm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #35070B 0%, #170305 60%, #080102 100%)",
        }}
      />

      {/* Ánh hào quang vàng hoàng đế tỏa ra */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(229,195,104,0.6) 0%, rgba(186,27,34,0.2) 50%, transparent 75%)",
          filter: "blur(35px)",
        }}
      />

      {/* Hạt bụi vàng bay lơ lửng */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={`gold-star-${i}`}
            className="absolute rounded-full bg-[#FDE68A] animate-pulse"
            style={{
              top: `${(i * 17) % 90}%`,
              left: `${(i * 23) % 94}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.2 + (i % 5) * 0.12,
              animationDuration: `${2.5 + (i % 3)}s`,
              boxShadow: "0 0 8px rgba(254, 240, 138, 0.8)",
            }}
          />
        ))}
      </div>

      {/* ── KHỐI HOẠT ẢNH TRỤC CUỘN CHIẾU THƯ (ROYAL SCROLL) ── */}
      <div className="relative z-10 w-full max-w-[92vw] sm:max-w-xl md:max-w-2xl flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
        {/* Đai Thắt Vàng & Triện Khi Đang Đóng */}
        <AnimatePresence>
          {(scrollPhase === "closed" || scrollPhase === "untying") && (
            <motion.div
              key="scroll-ribbon"
              initial={{ scale: 1, opacity: 1 }}
              animate={
                scrollPhase === "untying"
                  ? { scale: 1.4, opacity: 0, filter: "blur(4px)" }
                  : { scale: 1, opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute z-40 flex flex-col items-center justify-center pointer-events-none"
            >
              {/* Dây lụa gấm vàng thắt ngang */}
              <div className="w-28 sm:w-36 h-8 rounded-full bg-gradient-to-r from-[#996515] via-[#FDE68A] to-[#996515] border border-[#FFF8D6] shadow-[0_0_20px_rgba(229,195,104,0.8)] flex items-center justify-center">
                <span className="text-[10px] font-serif font-bold text-[#3B090D] uppercase tracking-widest">
                  HỶ SỰ KIM PHONG
                </span>
              </div>
              {/* Triện son đỏ giữa dây đai */}
              <div className="w-14 h-14 -mt-3 rounded-full bg-[#BA1B22] border-2 border-[#FFF8D6] shadow-xl flex items-center justify-center">
                <span className="text-xl font-bold text-[#FFF8D6] font-serif">囍</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* THÂN CHIẾU THƯ MỞ RA TỪ TÂM */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={
            scrollPhase === "closed" || scrollPhase === "untying"
              ? { scaleX: 0 }
              : { scaleX: 1 }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border-y-4 border-[#E5C368] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(229,195,104,0.3)] origin-center flex flex-col justify-between p-5 sm:p-8 text-center"
          style={{
            background:
              "linear-gradient(150deg, #2E0508 0%, #1A0305 45%, #2B0609 80%, #150204 100%)",
          }}
        >
          {/* Họa tiết hoa văn dập nổi gấm cung đình */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#E5C368 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Đổ bóng 3D hai mép cuộn tạo cảm giác giấy lụa uốn cong */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />

          {/* Viền hoa văn chỉ vàng kép dập nổi */}
          <div className="absolute inset-2 sm:inset-3 rounded-xl border border-dashed border-[#FDE68A]/40 pointer-events-none" />

          {/* NỘI DUNG CHIẾU THƯ PHÁT SÁNG */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={scrollPhase === "opened" ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center justify-between h-full"
          >
            {/* Đỉnh chiếu thư: Phù điêu Long Phụng */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#3B090D] border border-[#E5C368]/70 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#FDE68A]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#FFF3B0] font-serif font-bold">
                  PHỤNG THIÊN THỪA VẬN
                </span>
                <Sparkles className="w-3 h-3 text-[#FDE68A]" />
              </div>

              <h2
                className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#FFF3B0] tracking-widest pt-1"
                style={{
                  textShadow:
                    "0 2px 6px rgba(0,0,0,0.9), 0 0 20px rgba(229,195,104,0.7)",
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                }}
              >
                CHIẾU THƯ HÔN LỄ
              </h2>
            </div>

            {/* Dòng kính mời đích danh hoặc chung */}
            <div className="my-2 py-2 px-4 rounded-xl bg-black/30 border border-[#E5C368]/40 max-w-sm w-full">
              <p className="text-[10px] sm:text-xs text-[#E5C368] font-serif uppercase tracking-widest">
                TRÂN TRỌNG KÍNH MỜI
              </p>
              <p className="font-serif font-bold text-base sm:text-lg text-[#FFF8D6] mt-0.5 line-clamp-1">
                {guestName ? `${guestName} & Gia Đình` : "Quý Quan Khách & Thân Hữu"}
              </p>
            </div>

            {/* Tên tân lang & tân nương thư pháp */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-1">
              <span className="font-calligraphy text-2xl sm:text-3xl text-[#FFF8D6] font-bold drop-shadow-[0_2px_8px_rgba(229,195,104,0.7)]">
                {weddingData.groom.fullName}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#BA1B22] border border-[#E5C368] flex items-center justify-center shadow-md">
                <Heart className="w-3.5 h-3.5 text-[#FFF8D6] fill-[#FFF8D6]" />
              </div>
              <span className="font-calligraphy text-2xl sm:text-3xl text-[#FFF8D6] font-bold drop-shadow-[0_2px_8px_rgba(229,195,104,0.7)]">
                {weddingData.bride.fullName}
              </span>
            </div>

            <p className="text-xs text-[#E8D5CF] italic font-serif max-w-xs leading-relaxed">
              &ldquo;Chứng giám thời khắc kết tóc se duyên &bull; Trăm năm hòa hợp vạn sự cát tường&rdquo;
            </p>

            {/* Con dấu triện son Chu Sa đóng xuống */}
            <div className="pt-2 flex items-center gap-2">
              <RedSealStamp size={36} text="HỶ SỰ" />
              <span className="text-[10px] text-[#FDE68A] font-serif tracking-widest uppercase font-bold">
                HOÀNG GIA HỶ SỰ
              </span>
              <RedSealStamp size={36} text="CÁT TƯỜNG" />
            </div>
          </motion.div>
        </motion.div>

        {/* TRỤC CUỘN BÊN TẢ (TRÁI) */}
        <motion.div
          initial={{ x: 0 }}
          animate={
            scrollPhase === "closed" || scrollPhase === "untying"
              ? { x: -8 }
              : { x: "calc(-50% - 6px)" }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-0 bottom-0 w-6 sm:w-8 -translate-y-4 z-30 flex flex-col items-center pointer-events-none"
        >
          {/* Đầu chốt ngọc vàng đỉnh */}
          <div className="w-7 sm:w-9 h-9 sm:h-11 rounded-t-full bg-gradient-to-b from-[#FFF8D6] via-[#E5C368] to-[#996515] border border-[#FFF8D6] shadow-[0_4px_10px_rgba(0,0,0,0.8)] shrink-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#3B090D]" />
          </div>

          {/* Thân trục gỗ sơn son viền vàng */}
          <div
            className="w-4 sm:w-5 flex-1 rounded-sm shadow-2xl relative"
            style={{
              background:
                "linear-gradient(to right, #450A0A 0%, #7F1D1D 40%, #B91C1C 60%, #450A0A 100%)",
              borderLeft: "1px solid #E5C368",
              borderRight: "1px solid #996515",
            }}
          >
            {/* Vòng đai vàng trên trục */}
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-[#E5C368] border-y border-[#FFF8D6]" />
            <div className="absolute bottom-6 left-0 right-0 h-1.5 bg-[#E5C368] border-y border-[#FFF8D6]" />
          </div>

          {/* Đầu chốt ngọc vàng đáy & tua rua */}
          <div className="w-7 sm:w-9 h-9 sm:h-11 rounded-b-full bg-gradient-to-b from-[#996515] via-[#E5C368] to-[#FFF8D6] border border-[#FFF8D6] shadow-[0_4px_10px_rgba(0,0,0,0.8)] shrink-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#3B090D]" />
          </div>
          {/* Tua rua rủ xuống */}
          <div className="w-1.5 h-7 bg-gradient-to-b from-[#E5C368] to-transparent" />
        </motion.div>

        {/* TRỤC CUỘN BÊN HỮU (PHẢI) */}
        <motion.div
          initial={{ x: 0 }}
          animate={
            scrollPhase === "closed" || scrollPhase === "untying"
              ? { x: 8 }
              : { x: "calc(50% + 6px)" }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-1/2 top-0 bottom-0 w-6 sm:w-8 -translate-y-4 z-30 flex flex-col items-center pointer-events-none"
        >
          {/* Đầu chốt ngọc vàng đỉnh */}
          <div className="w-7 sm:w-9 h-9 sm:h-11 rounded-t-full bg-gradient-to-b from-[#FFF8D6] via-[#E5C368] to-[#996515] border border-[#FFF8D6] shadow-[0_4px_10px_rgba(0,0,0,0.8)] shrink-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#3B090D]" />
          </div>

          {/* Thân trục gỗ sơn son viền vàng */}
          <div
            className="w-4 sm:w-5 flex-1 rounded-sm shadow-2xl relative"
            style={{
              background:
                "linear-gradient(to right, #450A0A 0%, #7F1D1D 40%, #B91C1C 60%, #450A0A 100%)",
              borderLeft: "1px solid #E5C368",
              borderRight: "1px solid #996515",
            }}
          >
            {/* Vòng đai vàng trên trục */}
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-[#E5C368] border-y border-[#FFF8D6]" />
            <div className="absolute bottom-6 left-0 right-0 h-1.5 bg-[#E5C368] border-y border-[#FFF8D6]" />
          </div>

          {/* Đầu chốt ngọc vàng đáy & tua rua */}
          <div className="w-7 sm:w-9 h-9 sm:h-11 rounded-b-full bg-gradient-to-b from-[#996515] via-[#E5C368] to-[#FFF8D6] border border-[#FFF8D6] shadow-[0_4px_10px_rgba(0,0,0,0.8)] shrink-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#3B090D]" />
          </div>
          {/* Tua rua rủ xuống */}
          <div className="w-1.5 h-7 bg-gradient-to-b from-[#E5C368] to-transparent" />
        </motion.div>
      </div>

      {/* NÚT VÀO NGAY GÓC TRÊN DÀNH CHO KHÁCH MUỐN VÀO NHANH */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className="fixed top-5 right-5 z-50 text-[11px] font-serif text-[#E5C368] hover:text-[#FFF8D6] bg-[#1A0305]/80 hover:bg-[#2E0508] px-3.5 py-1.5 rounded-full border border-[#E5C368]/40 transition-all cursor-pointer shadow-md flex items-center gap-1"
      >
        <span>Vào ngay</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#E5C368]" />
      </button>

      {/* CHỈ BÁO TỰ ĐỘNG MỞ CHIẾU THƯ & NGHÊNH TIẾP QUAN KHÁCH */}
      <div className="fixed bottom-6 sm:bottom-8 z-40 flex flex-col items-center gap-1 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0305]/85 border border-[#E5C368]/60 shadow-[0_4px_15px_rgba(0,0,0,0.6)] backdrop-blur-xs"
        >
          <Sparkles className="w-3 h-3 text-[#FDE68A] animate-spin" style={{ animationDuration: "3s" }} />
          <span className="text-[10px] sm:text-xs text-[#FFF8D6] font-serif tracking-widest uppercase font-semibold">
            Chiếu Thư Tự Động Mở &bull; Đang Vào Hôn Lễ
          </span>
          <Sparkles className="w-3 h-3 text-[#FDE68A] animate-spin" style={{ animationDuration: "3s" }} />
        </motion.div>
        <span className="text-[9px] text-[#E5C368]/70 font-serif italic pt-0.5">
          (Chạm bất kỳ đâu trên màn hình để vào thiệp tức thì)
        </span>
      </div>
    </motion.div>
  );
};
