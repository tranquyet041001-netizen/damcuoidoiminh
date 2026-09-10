"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DragonPhoenixEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Hiệu ứng Rồng & Phượng Hoàng bay xoắn vào nhau (Long Phụng Giao Hòa / Song Hỷ Lâm Môn)
 * Sử dụng trực tiếp họa tiết Rồng Vàng - Phượng Hoàng - Hỏa Châu thêu gấm cung đình
 * từ hình ảnh người dùng cung cấp.
 * 
 * Quỹ đạo bay (Double-Helix Intertwining Spiral):
 * - Rồng & Phượng xuất phát từ đáy màn hình, lượn xoắn uốn lượn quanh Hỏa Châu ở giữa.
 * - Giao cắt tầng 1: Rồng bay đè lên trước, Phượng lượn phía sau.
 * - Đổi hướng vòng cung mở rộng sang 2 bên.
 * - Giao cắt tầng 2: Phượng vút đè lên trước, Rồng lượn phía sau.
 * - Vút lên đỉnh trời và lượn dang rộng cánh sang hai bên để mở ra toàn bộ thiệp cưới.
 */
export const DragonPhoenixEffect: React.FC<DragonPhoenixEffectProps> = ({
  isActive,
  onComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 4800); // 4.8 giây cho toàn bộ vũ đạo bay xoắn lượn
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
          {/* Lớp nền ánh kim vàng son nhẹ nhàng khi bắt đầu bay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.4, 0] }}
            transition={{ duration: 4.6, times: [0, 0.2, 0.8, 1] }}
            className="absolute inset-0 bg-gradient-to-b from-[#7F1D1D]/15 via-transparent to-[#B45309]/15 backdrop-blur-[1.5px]"
          />

          {/* ── BỤI ÁNH KIM & TIA SÁNG CÁT TƯỜNG BAY THEO ĐƯỜNG XOẮN ── */}
          {Array.from({ length: 24 }).map((_, i) => {
            const delay = (i % 6) * 0.4 + 0.2;
            const startX = 20 + ((i * 19) % 60); // 20vw to 80vw
            const size = (i % 4) * 3 + 4;
            return (
              <motion.div
                key={`sparkle-${i}`}
                initial={{
                  x: `${startX}vw`,
                  y: "105vh",
                  scale: 0.2,
                  opacity: 0,
                }}
                animate={{
                  x: [
                    `${startX}vw`,
                    `${startX + (i % 2 === 0 ? 12 : -12)}vw`,
                    `${startX + (i % 2 === 0 ? -8 : 8)}vw`,
                    `${startX + (i % 2 === 0 ? 18 : -18)}vw`,
                  ],
                  y: ["105vh", "65vh", "30vh", "-15vh"],
                  scale: [0.3, 1.3, 1.1, 0],
                  opacity: [0, 0.9, 0.8, 0],
                }}
                transition={{
                  duration: 4.2 + (i % 3) * 0.4,
                  delay,
                  ease: "easeInOut",
                }}
                className="absolute"
              >
                <div
                  className="rounded-full"
                  style={{
                    width: size,
                    height: size,
                    background:
                      i % 3 === 0
                        ? "radial-gradient(circle, #FFFDF0 20%, #F59E0B 80%)"
                        : i % 3 === 1
                        ? "radial-gradient(circle, #FDE68A 30%, #DC2626 90%)"
                        : "radial-gradient(circle, #FFFFFF 40%, #EAB308 100%)",
                    boxShadow: "0 0 14px 3px rgba(245, 158, 11, 0.85)",
                  }}
                />
              </motion.div>
            );
          })}

          {/* ── 1. HỎA CHÂU (VIÊN MINH CHÂU LỬA) BAY TRUNG TÂM XOẮN ỐC ── */}
          <motion.div
            initial={{
              x: "46vw",
              y: "105vh",
              rotate: 0,
              scale: 0.6,
              opacity: 0,
            }}
            animate={{
              x: ["46vw", "50vw", "44vw", "48vw", "47vw", "47vw"],
              y: ["105vh", "74vh", "48vh", "24vh", "4vh", "-25vh"],
              rotate: [0, 180, 360, 540, 720, 900],
              scale: [0.6, 1.1, 1.25, 1.1, 0.95, 0.6],
              opacity: [0, 1, 1, 1, 0.9, 0],
            }}
            transition={{
              duration: 4.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute top-0 left-0 -ml-8 sm:-ml-12 z-[93] will-change-transform filter drop-shadow-[0_0_24px_rgba(245,158,11,0.9)]"
          >
            <div className="relative w-16 h-16 sm:w-24 sm:h-24">
              <img
                src="/images/flaming-pearl.png"
                alt="Hỏa Châu"
                className="w-full h-full object-contain animate-pulse"
              />
              <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-md pointer-events-none animate-ping" />
            </div>
          </motion.div>

          {/* ── 2. RỒNG VÀNG HOÀNG GIA (BÊN TRÁI VÚT LÊN & XOẮN VÀO PHƯỢNG) ── */}
          <motion.div
            initial={{
              x: "10vw",
              y: "108vh",
              rotate: -15,
              scale: 0.75,
              opacity: 0,
            }}
            animate={{
              x: [
                "10vw",   // 0%: Dưới bên trái
                "48vw",   // 22%: Crossover 1 đè lên Phượng ở giữa
                "66vw",   // 45%: Uốn lượn sang mạn phải
                "38vw",   // 68%: Crossover 2 luồn phía sau Phượng
                "12vw",   // 86%: Lượn rộng sang mạn trái
                "-25vw",  // 100%: Vút lên cao tỏa sang góc trái
              ],
              y: [
                "108vh",  // 0%
                "72vh",   // 22%
                "47vh",   // 45%
                "23vh",   // 68%
                "2vh",    // 86%
                "-35vh",  // 100%
              ],
              rotate: [
                -15,      // Hướng chếch vào tâm
                18,       // Lượn uốn chữ S mềm mại
                -8,       // Ôm lấy vòng xoay bên phải
                -24,      // Lao về phía mạn trái
                -45,      // Dang rộng vút lên
                -60,      // Bay khuất khỏi màn hình
              ],
              scale: [0.75, 1.15, 1.05, 0.92, 1.0, 0.75],
              opacity: [0, 1, 1, 1, 0.95, 0],
              zIndex: [96, 96, 92, 91, 95, 95], // Tầng 1: 96 (đè trước), Tầng 2: 91 (luồn sau)
            }}
            transition={{
              duration: 4.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute top-0 left-0 will-change-transform filter drop-shadow-[0_12px_32px_rgba(245,158,11,0.65)]"
          >
            <div className="relative w-[210px] sm:w-[320px] md:w-[380px]">
              <img
                src="/images/dragon-gold.png"
                alt="Thần Long Cát Khánh"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(217,119,6,0.6)]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.95, 0.95, 0], scale: [0.8, 1, 1, 0.9] }}
                transition={{ duration: 3.4, delay: 0.4 }}
                className="absolute -bottom-2 left-6 sm:left-12 px-3 py-1 rounded-full bg-[#7F1D1D]/90 border border-[#FDE68A]/70 text-[#FDE68A] text-[10px] sm:text-xs font-serif font-bold tracking-widest uppercase backdrop-blur-md shadow-xl whitespace-nowrap"
              >
                🐲 Thanh Long Đắc Kỷ
              </motion.div>
            </div>
          </motion.div>

          {/* ── 3. PHƯỢNG HOÀNG NGŨ SẮC (BÊN PHẢI VÚT LÊN & XOẮN VÀO RỒNG) ── */}
          <motion.div
            initial={{
              x: "72vw",
              y: "108vh",
              rotate: 15,
              scale: 0.75,
              opacity: 0,
            }}
            animate={{
              x: [
                "72vw",   // 0%: Dưới bên phải
                "36vw",   // 22%: Crossover 1 luồn sau Rồng sang trái
                "18vw",   // 45%: Uốn lượn sang mạn trái
                "50vw",   // 68%: Crossover 2 đè lên Rồng sang phải
                "74vw",   // 86%: Lượn rộng sang mạn phải
                "110vw",  // 100%: Vút lên cao tỏa sang góc phải
              ],
              y: [
                "108vh",  // 0%
                "72vh",   // 22%
                "47vh",   // 45%
                "23vh",   // 68%
                "2vh",    // 86%
                "-35vh",  // 100%
              ],
              rotate: [
                15,       // Hướng chếch vào tâm
                -18,      // Lượn uốn mềm mại
                8,        // Ôm lấy vòng xoay bên trái
                24,       // Lao về phía mạn phải
                45,       // Dang rộng vút lên
                60,       // Bay khuất khỏi màn hình
              ],
              scale: [0.75, 0.92, 1.05, 1.15, 1.0, 0.75],
              opacity: [0, 1, 1, 1, 0.95, 0],
              zIndex: [91, 91, 92, 96, 95, 95], // Tầng 1: 91 (luồn sau), Tầng 2: 96 (đè trước)
            }}
            transition={{
              duration: 4.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute top-0 left-0 will-change-transform filter drop-shadow-[0_12px_32px_rgba(225,29,72,0.65)]"
          >
            <div className="relative w-[210px] sm:w-[320px] md:w-[380px]">
              <img
                src="/images/phoenix-gold.png"
                alt="Phượng Hoàng Trình Tường"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(225,29,72,0.6)]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.95, 0.95, 0], scale: [0.8, 1, 1, 0.9] }}
                transition={{ duration: 3.4, delay: 0.4 }}
                className="absolute -bottom-2 right-6 sm:right-12 px-3 py-1 rounded-full bg-[#881337]/90 border border-[#FDE68A]/70 text-[#FDE68A] text-[10px] sm:text-xs font-serif font-bold tracking-widest uppercase backdrop-blur-md shadow-xl whitespace-nowrap"
              >
                🪶 Phượng Vũ Cát Khánh
              </motion.div>
            </div>
          </motion.div>

          {/* ── HUY HIỆU HOÀNG GIA CHÚC PHÚC "LONG PHỤNG SUM VẦY" ── */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [35, 0, 0, -25],
              scale: [0.8, 1.05, 1, 0.95],
            }}
            transition={{ duration: 3.6, delay: 0.45, ease: "easeOut" }}
            className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 z-[99] pointer-events-none flex flex-col items-center"
          >
            <div className="px-6 py-2.5 rounded-full bg-[#FFFDF7]/95 border-2 border-[#C9A84C] shadow-2xl backdrop-blur-md flex items-center gap-3">
              <span className="text-lg">🐲</span>
              <span className="font-calligraphy text-2xl sm:text-3xl text-[#9F171B] font-bold tracking-wide">
                Long Phụng Sum Vầy
              </span>
              <span className="text-lg">🪶</span>
            </div>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#B45309] font-serif font-bold mt-1.5 drop-shadow bg-[#FFFDF7]/85 px-4 py-0.5 rounded-full border border-[#C9A84C]/40">
              Trăm Năm Tình Viên Mãn • Vạn Đại Nghĩa Trường Tồn
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DragonPhoenixEffect;
