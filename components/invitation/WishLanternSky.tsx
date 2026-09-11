"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, X, MessageSquare, Flame } from "lucide-react";
import { WishSubmission } from "@/types/wedding";
import { RedSealStamp, VietnameseLotus } from "@/components/ui/VietnamesePattern";

interface WishLanternSkyProps {
  wishes: WishSubmission[];
  onLanternClick?: (wish: WishSubmission) => void;
  newlyAddedWish?: WishSubmission | null;
}

interface LanternItem extends WishSubmission {
  lanternId: string;
  x: number; // Tọa độ X (0 - 90%)
  duration: number; // Thời gian bay từ dưới lên (14s - 26s)
  delay: number; // Độ trễ ban đầu
  scale: number; // Độ sâu 3D (0.75 - 1.15)
  swayDuration: number;
}

export const WishLanternSky: React.FC<WishLanternSkyProps> = ({
  wishes,
  newlyAddedWish,
}) => {
  const [selectedWish, setSelectedWish] = useState<WishSubmission | null>(null);
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  // Sinh tọa độ và hiệu ứng chuyển động ngẫu nhiên nhưng ổn định cho các ngọn đèn
  const lanternList: LanternItem[] = useMemo(() => {
    // Nếu chưa có lời chúc nào, tạo vài lời chúc mẫu ấm áp
    const source: WishSubmission[] =
      wishes.length > 0
        ? wishes.slice(0, 18)
        : [
            {
              id: "sample-1",
              name: "Gia đình Bác Tuấn",
              content: "Chúc hai cháu trăm năm hạnh phúc, răng long đầu bạc, vạn sự cát tường!",
              relationship: "Bác ruột",
              createdAt: "2026-09-10",
            },
            {
              id: "sample-2",
              name: "Nhóm Bạn Đại Học",
              content: "Mừng ngày trọng đại của đôi bạn thân! Chúc đôi uyên ương sớm sinh quý tử nhé!",
              relationship: "Bạn thân",
              createdAt: "2026-09-10",
            },
            {
              id: "sample-3",
              name: "Chị Minh Anh",
              content: "Cô dâu xinh đẹp tuyệt vời, chúc hai em một đời bình an, yêu thương đong đầy.",
              relationship: "Chị họ",
              createdAt: "2026-09-10",
            },
          ];

    return source.map((w, i) => {
      // Phân bố đều tọa độ X ngang màn hình (5% - 88%)
      const segment = 85 / Math.max(source.length, 1);
      const x = 6 + i * segment + ((i * 17) % 8);
      const duration = 16 + (i % 6) * 2.2;
      const delay = (i * 1.6) % 9;
      const scale = 0.8 + ((i * 13) % 4) * 0.1;
      const swayDuration = 3.5 + (i % 4) * 0.7;

      return {
        ...w,
        lanternId: `lantern-${w.id || i}-${w.name}`,
        x: Math.min(88, Math.max(6, x)),
        duration,
        delay,
        scale,
        swayDuration,
      };
    });
  }, [wishes]);

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden border border-[#E5C368]/50 shadow-2xl select-none">
      {/* ── BẦU TRỜI ĐÊM HUYỀN ẢO ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, #1F1735 0%, #120E22 45%, #08060F 100%)",
        }}
      />

      {/* Ánh trăng vàng huyền ảo trên cao */}
      <div
        className="absolute top-6 right-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(254, 240, 138, 0.5) 0%, rgba(212, 175, 55, 0.2) 50%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute top-10 right-12 w-14 h-14 sm:w-18 sm:h-18 rounded-full border border-[#FFF8D6]/40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #FFFBEB 0%, #FEF3C7 60%, #FDE68A 100%)",
          boxShadow: "0 0 35px rgba(254, 243, 199, 0.8)",
        }}
      />

      {/* Lớp ngàn sao lấp lánh */}
      <div className="absolute inset-0 pointer-events-none opacity-70">
        {[...Array(28)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-[#FFF8D6] animate-pulse"
            style={{
              top: `${(i * 17) % 85}%`,
              left: `${(i * 23) % 96}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDuration: `${2 + (i % 4)}s`,
              boxShadow: "0 0 6px rgba(254, 243, 199, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Dòng hướng dẫn tương tác chạm đèn trên đỉnh */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-xs border border-[#E5C368]/35 text-[#FFF3B0] text-[10px] sm:text-xs font-serif">
        <Sparkles className="w-3 h-3 text-[#FDE68A] animate-spin-slow" />
        <span>Chạm vào ngọn đèn để đọc lời chúc phúc</span>
      </div>

      {/* ── CÁC NGỌN ĐÈN HOA ĐĂNG BAY BỒNG BỀNH ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-auto">
        {lanternList.map((item) => (
          <motion.div
            key={item.lanternId}
            onClick={() => setSelectedWish(item)}
            initial={{ y: 520, opacity: 0 }}
            animate={{
              y: [-20, -560],
              opacity: [0, 0.95, 1, 1, 0.4, 0],
              x: [0, 10, -10, 0],
            }}
            transition={{
              y: {
                duration: item.duration,
                repeat: Infinity,
                ease: "linear",
                delay: item.delay,
              },
              opacity: {
                duration: item.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              },
              x: {
                duration: item.swayDuration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: item.scale * 1.15 }}
            whileTap={{ scale: item.scale * 0.95 }}
            className="absolute bottom-0 cursor-pointer group flex flex-col items-center select-none"
            style={{
              left: `${item.x}%`,
              transform: `scale(${item.scale})`,
            }}
          >
            {/* Hào quang tỏa sáng của đèn */}
            <div
              className="absolute -inset-3 rounded-full opacity-65 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(254, 215, 120, 0.75) 0%, rgba(234, 88, 12, 0.3) 55%, transparent 75%)",
                filter: "blur(10px)",
              }}
            />

            {/* Thân Đèn Lồng Hoa Đăng Chúc Phúc */}
            <div
              className="relative w-11 h-14 sm:w-13 sm:h-16 rounded-2xl flex flex-col items-center justify-between p-1 shadow-lg transition-transform duration-300"
              style={{
                background:
                  "linear-gradient(180deg, #FDE68A 0%, #F59E0B 45%, #DC2626 85%, #991B1B 100%)",
                border: "1.5px solid #FEF08A",
                boxShadow:
                  "0 0 20px rgba(251, 191, 36, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.7), inset 0 -3px 6px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Nắp đèn trên */}
              <div className="w-6 h-1 rounded-full bg-[#78350F] border border-[#FDE68A]/60" />

              {/* Ngọn lửa / Tim đèn lung linh bên trong */}
              <div className="relative flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#FFFBEB] animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                <span className="absolute text-[9px] font-serif font-bold text-[#78350F]">囍</span>
              </div>

              {/* Đáy đèn */}
              <div className="w-7 h-1 rounded-full bg-[#78350F] border border-[#FDE68A]/60" />
            </div>

            {/* Tua rua rủ xuống của đèn */}
            <div className="flex flex-col items-center -mt-0.5">
              <div className="w-0.5 h-3 bg-[#FDE68A]" />
              <div className="w-2 h-3.5 rounded-b-md bg-[#DC2626] border border-[#FDE68A]/50" />
            </div>

            {/* Nhãn tên người gửi bay lơ lửng dưới chân đèn */}
            <div className="mt-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-xs border border-[#FDE68A]/40 text-[#FFFBEB] text-[9px] sm:text-[10px] font-serif font-medium whitespace-nowrap shadow-md group-hover:border-[#FDE68A] group-hover:scale-105 transition-all">
              {item.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hiệu ứng đèn mới bay lên khi khách vừa gửi lời chúc */}
      {newlyAddedWish && (
        <motion.div
          initial={{ y: 350, opacity: 0, scale: 0.5 }}
          animate={{ y: -300, opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1] }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30 pointer-events-none flex flex-col items-center"
        >
          <div className="p-3 rounded-full bg-amber-400/30 blur-xl animate-ping" />
          <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-yellow-200 via-amber-400 to-red-600 border-2 border-yellow-100 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.9)]">
            <Flame className="w-8 h-8 text-white animate-bounce" />
          </div>
          <span className="mt-2 px-3 py-1 rounded-full bg-black/80 text-yellow-200 text-xs font-serif border border-yellow-300">
            ✨ {newlyAddedWish.name} vừa thả đèn chúc phúc ✨
          </span>
        </motion.div>
      )}

      {/* ── MODAL CUỘN THƯ CỔ PHONG KHI CHẠM VÀO NGỌN ĐÈN ── */}
      <AnimatePresence>
        {selectedWish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWish(null)}
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl p-6 sm:p-7 text-center shadow-2xl cursor-default overflow-hidden border-2 border-[#E5C368]"
              style={{
                background:
                  "radial-gradient(circle at 50% 15%, #FFFDF9 0%, #FAF5EC 65%, #F4E8D6 100%)",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(229, 195, 104, 0.45)",
              }}
            >
              {/* Nút đóng */}
              <button
                type="button"
                onClick={() => setSelectedWish(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-[#78350F] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Viền hoa văn chỉ vàng */}
              <div className="absolute inset-2 rounded-2xl border border-dashed border-[#C9A84C]/50 pointer-events-none" />

              {/* Hoa sen vẽ nét */}
              <div className="flex justify-center mb-2">
                <VietnameseLotus size={32} color="#C4715A" opacity={0.85} />
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-[#C4715A] font-sans font-bold mb-1">
                <Flame className="w-3 h-3 text-[#EA580C]" />
                <span>Lời Chúc Hoa Đăng</span>
                <Flame className="w-3 h-3 text-[#EA580C]" />
              </div>

              {/* Tên khách mời */}
              <h3 className="font-calligraphy text-2xl sm:text-3xl text-[#354D2E] leading-tight">
                {selectedWish.name}
              </h3>

              {selectedWish.relationship && (
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-[#FDF0EC] text-[#C4715A] text-[10px] font-serif border border-[#E8D5CF]">
                  {selectedWish.relationship}
                </span>
              )}

              {/* Nội dung lời chúc */}
              <div className="my-4 px-3 py-3 rounded-2xl bg-white/60 border border-[#E8D5CF]/60 shadow-inner">
                <p className="font-serif italic text-sm sm:text-base text-[#5C4033] leading-relaxed">
                  &ldquo;{selectedWish.content}&rdquo;
                </p>
              </div>

              {/* Con dấu son & nút thả tim */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8D5CF]/70 text-xs">
                <div className="text-[11px] text-[#8C6A58] italic font-serif">
                  {selectedWish.createdAt ? new Date(selectedWish.createdAt).toLocaleDateString("vi-VN") : "Hỷ Sự Trăm Năm"}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedWish.id || selectedWish.name;
                      setHasLiked((prev) => ({ ...prev, [id]: !prev[id] }));
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDF0EC] border border-[#E8D5CF] text-[#C4715A] text-xs font-serif font-bold transition-transform active:scale-90 cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasLiked[selectedWish.id || selectedWish.name]
                          ? "fill-[#C4715A] text-[#C4715A]"
                          : "text-[#C4715A]"
                      }`}
                    />
                    <span>Thả Tim</span>
                  </button>

                  <RedSealStamp size={36} text="CÁT TƯỜNG" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
