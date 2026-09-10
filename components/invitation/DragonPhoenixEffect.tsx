"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DragonPhoenixEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Họa tiết Rồng Vàng Hoàng Gia (Thần Long Thăng Hoa)
 * Thiết kế vector chuẩn mỹ thuật truyền thống cung đình Việt Nam:
 * Thân uốn lượn chữ S mềm mại, sừng hươu, râu rồng, vây lửa lưng, móng vuốt và mây lành.
 */
export const DragonVector: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 240,
}) => {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 240 312"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Dải màu vàng kim hoàng gia */}
        <linearGradient id="dragonGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Dải màu son đỏ cát tường */}
        <linearGradient id="dragonCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        {/* Ánh kim dạ quang */}
        <linearGradient id="dragonLightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#B45309" stopOpacity="0.2" />
        </linearGradient>

        <filter id="dragonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ─── CỤM MÂY CÁT TƯỜNG UỐN LƯỢN QUANH THÂN RỒNG ─── */}
      <g opacity="0.6" stroke="url(#dragonGoldGrad)" strokeWidth="1.5" fill="none">
        <path d="M40 240 C20 230 15 205 35 195 C45 190 60 195 65 205 C75 220 60 245 40 240 Z" fill="url(#dragonLightGrad)" fillOpacity="0.2" />
        <path d="M160 180 C180 170 195 185 185 205 C175 220 150 215 145 200 C140 185 155 175 160 180 Z" fill="url(#dragonLightGrad)" fillOpacity="0.2" />
        <path d="M120 70 C105 60 95 75 105 90 C115 100 135 95 135 80 C135 70 125 65 120 70 Z" fill="url(#dragonLightGrad)" fillOpacity="0.2" />
      </g>

      {/* ─── VIÊN MINH CHÂU (NGỌC RỒNG) TỎA SÁNG ĐẦU RỒNG ─── */}
      <g filter="url(#dragonGlow)">
        <circle cx="215" cy="55" r="9" fill="url(#dragonGoldGrad)" />
        <circle cx="215" cy="55" r="14" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
        {/* Hào quang minh châu */}
        <path d="M215 36 L215 42 M215 68 L215 74 M196 55 L202 55 M228 55 L234 55" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="212" cy="52" r="2.5" fill="#FFFDF0" />
      </g>

      {/* ─── VÂY LỬA LƯNG RỒNG (DORSAL FLAME CRESTS) ─── */}
      <g fill="url(#dragonCrimsonGrad)" stroke="#F59E0B" strokeWidth="1">
        {/* Vây vùng cổ */}
        <path d="M152 48 C145 35 135 38 140 54 Z" />
        <path d="M138 58 C128 46 118 52 126 66 Z" />
        {/* Vây uốn khúc 1 */}
        <path d="M102 85 C88 75 80 88 95 100 Z" />
        <path d="M78 115 C60 108 58 124 75 134 Z" />
        {/* Vây uốn khúc 2 */}
        <path d="M82 175 C70 185 80 198 94 186 Z" />
        <path d="M112 196 C105 210 120 220 128 205 Z" />
        {/* Vây đuôi */}
        <path d="M100 248 C90 260 105 272 115 258 Z" />
      </g>

      {/* ─── THÂN RỒNG UỐN LƯỢN HÌNH CHỮ S (DRAGON BODY) ─── */}
      {/* Lớp bóng đổ thân rồng */}
      <path
        d="M175 75 C150 60 115 65 95 95 C75 125 70 160 100 185 C130 210 135 240 105 270 C85 290 60 285 45 270"
        stroke="#78350F"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* Thân chính rồng - Đậm đà vương giả */}
      <path
        d="M175 72 C150 57 115 62 95 92 C75 122 70 157 100 182 C130 207 135 237 105 267 C85 287 60 282 45 267"
        stroke="url(#dragonGoldGrad)"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
        filter="url(#dragonGlow)"
      />

      {/* Bụng rồng (Sọc vảy bụng màu vàng nhạt) */}
      <path
        d="M173 75 C149 61 117 66 98 94 C80 122 75 155 102 179 C129 203 133 234 105 264 C88 282 65 279 48 266"
        stroke="#FEF3C7"
        strokeWidth="5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* ─── ĐẦU RỒNG HOÀNG GIA (DRAGON HEAD) ─── */}
      <g filter="url(#dragonGlow)">
        {/* Sừng hươu dài kiêu hãnh */}
        <path
          d="M165 45 C160 25 170 10 182 5 C178 18 185 25 190 32"
          stroke="url(#dragonGoldGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M172 20 C180 15 186 18 188 24"
          stroke="url(#dragonGoldGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Bờm rồng sau gáy cuồn cuộn */}
        <path
          d="M150 50 C130 38 120 45 110 35 C125 50 115 60 135 62"
          fill="url(#dragonCrimsonGrad)"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        <path
          d="M140 60 C120 55 110 65 105 58 C118 70 112 80 130 76"
          fill="url(#dragonCrimsonGrad)"
          stroke="#F59E0B"
          strokeWidth="1"
        />

        {/* Khung mặt và hàm trên */}
        <path
          d="M155 58 C165 52 180 50 192 56 C200 60 205 68 198 74 C188 80 175 75 168 76 Z"
          fill="url(#dragonGoldGrad)"
          stroke="#78350F"
          strokeWidth="1.2"
        />

        {/* Hàm dưới mở đón minh châu */}
        <path
          d="M172 76 C182 82 195 82 198 77 C190 84 178 85 168 80 Z"
          fill="url(#dragonCrimsonGrad)"
        />

        {/* Mắt rồng rực sáng */}
        <ellipse cx="178" cy="58" rx="4" ry="2.8" fill="#FFFDF0" />
        <circle cx="179" cy="58" r="1.6" fill="#7F1D1D" />
        <circle cx="180" cy="57" r="0.6" fill="#FFFFFF" />

        {/* Râu rồng dài uốn lượn thướt tha */}
        <path
          d="M192 68 C205 72 215 85 208 95 C202 102 190 98 195 88 C198 80 188 74 185 72"
          stroke="url(#dragonGoldGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M188 64 C200 62 212 68 220 62"
          stroke="url(#dragonGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* ─── CHÂN & MÓNG VUỐT RỒNG (DRAGON CLAWS) ─── */}
      {/* Chân trước vươn tới */}
      <g stroke="url(#dragonGoldGrad)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M125 90 C135 110 150 115 160 120" />
        {/* 3 móng vuốt sắc sảo */}
        <path d="M160 120 L168 116 M160 120 L170 121 M160 120 L166 127" stroke="#FEF3C7" strokeWidth="2.5" />
      </g>

      {/* Chân sau đạp mây */}
      <g stroke="url(#dragonGoldGrad)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M105 190 C115 210 108 225 100 235" />
        <path d="M100 235 L93 240 M100 235 L102 243 M100 235 L108 239" stroke="#FEF3C7" strokeWidth="2.5" />
      </g>

      {/* ─── ĐUÔI RỒNG TỎA LỬA CÁT TƯỜNG (DRAGON TAIL) ─── */}
      <g fill="url(#dragonCrimsonGrad)" stroke="#F59E0B" strokeWidth="1">
        <path d="M45 268 C25 265 15 280 22 295 C35 285 45 292 48 275 Z" />
        <path d="M38 260 C20 252 10 262 12 274 C25 270 32 275 40 266 Z" />
        <path d="M48 276 C32 290 40 305 52 308 C50 295 56 288 48 276 Z" />
      </g>
    </svg>
  );
};

/**
 * Họa tiết Phượng Hoàng Hoàng Kim (Phượng Vũ Cửu Thiên)
 * Thiết kế vector chuẩn mỹ thuật truyền thống:
 * Đầu đội mào vương giả, cánh xoè tầng lớp mềm mại, thân mình quý phái và chùm đuôi ngũ sắc uốn lượn thướt tha.
 */
export const PhoenixVector: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 240,
}) => {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 240 312"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Dải màu vàng kim rực rỡ */}
        <linearGradient id="phoenixGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Dải màu phượng hoàng lửa (Hồng đào & Đỏ son) */}
        <linearGradient id="phoenixFlameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Ánh sáng đuôi chim phượng */}
        <linearGradient id="phoenixPlumeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="80%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#4C0519" />
        </linearGradient>

        <filter id="phoenixGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ─── CÁNH PHƯỢNG TRÁI / PHÍA TRƯỚC (FORE WING) ─── */}
      <g filter="url(#phoenixGlow)">
        {/* Lớp lông vũ lớn ngoài cùng */}
        <path
          d="M105 105 C75 80 40 65 15 75 C8 78 12 88 22 90 C50 94 75 110 95 125 Z"
          fill="url(#phoenixFlameGrad)"
          stroke="#FBBF24"
          strokeWidth="1"
        />
        <path
          d="M110 115 C85 95 55 85 28 95 C22 98 26 106 35 108 C60 112 82 125 100 138 Z"
          fill="url(#phoenixGoldGrad)"
          stroke="#D97706"
          strokeWidth="1"
        />
        <path
          d="M115 125 C95 110 70 105 45 115 C40 118 45 126 55 127 C75 130 92 140 108 150 Z"
          fill="url(#phoenixFlameGrad)"
          stroke="#FBBF24"
          strokeWidth="0.8"
        />
      </g>

      {/* ─── CÁNH PHƯỢNG PHẢI / SẢI CAO TUNG TRỜI (MAIN HIGH WING) ─── */}
      <g filter="url(#phoenixGlow)">
        {/* Lông vũ tầng 1 - vút cao */}
        <path
          d="M125 95 C145 60 175 30 215 20 C225 18 228 28 218 34 C185 54 160 85 145 115 Z"
          fill="url(#phoenixFlameGrad)"
          stroke="#FDE68A"
          strokeWidth="1.2"
        />
        {/* Lông vũ tầng 2 */}
        <path
          d="M128 105 C150 75 180 50 215 45 C222 44 224 52 216 58 C185 75 162 102 148 125 Z"
          fill="url(#phoenixGoldGrad)"
          stroke="#B45309"
          strokeWidth="1"
        />
        {/* Lông vũ tầng 3 */}
        <path
          d="M130 118 C155 90 185 75 210 72 C218 71 220 78 212 84 C188 98 168 118 150 135 Z"
          fill="url(#phoenixFlameGrad)"
          stroke="#FBBF24"
          strokeWidth="0.8"
        />
        {/* Lông vũ tầng 4 */}
        <path
          d="M132 128 C152 108 178 98 198 98 C205 98 206 104 200 108 C180 120 165 132 148 145 Z"
          fill="url(#phoenixGoldGrad)"
          stroke="#B45309"
          strokeWidth="0.8"
        />
      </g>

      {/* ─── THÂN MÌNH & CỔ PHƯỢNG HOÀNG (BODY & NECK) ─── */}
      <g filter="url(#phoenixGlow)">
        {/* Cổ uốn cong kiêu hãnh */}
        <path
          d="M85 65 C95 72 108 82 115 105 C122 128 120 155 115 170 C108 155 105 130 95 108 C90 95 80 82 75 75 Z"
          fill="url(#phoenixGoldGrad)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {/* Ngực phượng hoàng nở nang */}
        <path
          d="M85 72 C80 85 85 105 95 118 C102 128 110 132 112 125 C105 115 95 98 92 85 Z"
          fill="url(#phoenixFlameGrad)"
          opacity="0.85"
        />
      </g>

      {/* ─── ĐẦU & MÀO PHƯỢNG HOÀNG (CROWNED HEAD) ─── */}
      <g filter="url(#phoenixGlow)">
        {/* 3 Lông mào vương giả kiêu hãnh */}
        <path
          d="M75 52 C70 32 60 20 48 12 C58 22 62 35 68 48"
          stroke="url(#phoenixGoldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="46" cy="11" r="3.5" fill="url(#phoenixFlameGrad)" stroke="#FDE68A" strokeWidth="1" />

        <path
          d="M80 50 C80 30 75 16 68 6 C75 18 78 30 80 46"
          stroke="url(#phoenixGoldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="67" cy="5" r="3.5" fill="url(#phoenixFlameGrad)" stroke="#FDE68A" strokeWidth="1" />

        <path
          d="M85 52 C92 35 95 22 96 10 C93 24 90 36 86 48"
          stroke="url(#phoenixGoldGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="96" cy="9" r="3" fill="url(#phoenixFlameGrad)" stroke="#FDE68A" strokeWidth="1" />

        {/* Đầu phượng */}
        <path
          d="M88 52 C84 48 76 48 70 54 C66 58 65 65 72 68 C78 70 85 68 88 62 Z"
          fill="url(#phoenixGoldGrad)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {/* Mỏ phượng hoàng thanh tú */}
        <path
          d="M68 56 L55 60 C58 63 64 64 68 64 Z"
          fill="url(#phoenixGoldGrad)"
          stroke="#92400E"
          strokeWidth="0.8"
        />

        {/* Mắt phượng sắc sảo quý phái */}
        <ellipse cx="76" cy="58" rx="3.5" ry="2.2" fill="#FFFDF0" />
        <circle cx="75.5" cy="58" r="1.5" fill="#881337" />
        <circle cx="76.5" cy="57.5" r="0.5" fill="#FFFFFF" />
      </g>

      {/* ─── CHÙM ĐUÔI NGŨ SẮC UỐN LƯỢN THƯỚT THA (LONG FLOWING TAIL PLUMES) ─── */}
      <g filter="url(#phoenixGlow)" fill="none" strokeLinecap="round">
        {/* Dải đuôi chính 1 (Trung tâm - uốn dài nhất) */}
        <path
          d="M115 168 C125 190 145 210 160 235 C175 260 180 285 165 305 C155 315 138 312 135 298 C132 280 150 268 152 250"
          stroke="url(#phoenixPlumeGrad)"
          strokeWidth="3.5"
        />
        {/* Mắt ngọc đuôi 1 */}
        <ellipse cx="165" cy="305" rx="7" ry="9" fill="url(#phoenixFlameGrad)" stroke="#FDE68A" strokeWidth="1.5" />
        <circle cx="165" cy="305" r="3.5" fill="url(#phoenixGoldGrad)" />

        {/* Dải đuôi 2 (Bên trái - uốn lượn mềm) */}
        <path
          d="M112 170 C95 195 80 225 88 250 C95 275 120 285 118 302 C115 312 102 315 95 305 C85 292 90 270 98 255"
          stroke="url(#phoenixPlumeGrad)"
          strokeWidth="2.8"
        />
        {/* Mắt ngọc đuôi 2 */}
        <ellipse cx="118" cy="302" rx="6" ry="8" fill="url(#phoenixFlameGrad)" stroke="#FDE68A" strokeWidth="1.2" />
        <circle cx="118" cy="302" r="2.8" fill="url(#phoenixGoldGrad)" />

        {/* Dải đuôi 3 (Bên phải - vút bổng) */}
        <path
          d="M118 168 C140 190 170 205 190 225 C210 248 220 275 205 292 C195 302 180 298 178 285 C175 270 190 260 192 245"
          stroke="url(#phoenixPlumeGrad)"
          strokeWidth="2.8"
        />
        {/* Mắt ngọc đuôi 3 */}
        <ellipse cx="205" cy="292" rx="6" ry="8" fill="url(#phoenixFlameGrad)" stroke="#FDE68A" strokeWidth="1.2" />
        <circle cx="205" cy="292" r="2.8" fill="url(#phoenixGoldGrad)" />

        {/* Các dải tơ đuôi phụ bồng bềnh */}
        <path
          d="M116 175 C130 200 135 230 128 255 C122 275 135 285 142 278"
          stroke="#FBBF24"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.8"
        />
      </g>
    </svg>
  );
};

/**
 * Hiệu ứng Toàn Màn Hình: Rồng bay bên trái, Phượng bay bên phải
 * Khi khách ấn mở thiệp:
 * - Rồng từ góc dưới bên trái vút bay lên và uốn lượn sang bên trái.
 * - Phượng từ góc dưới bên phải vút bay lên và uốn lượn sang bên phải.
 * - Kèm theo bụi sao vàng lấp lánh (Golden Stardust Particles) và câu chúc "Long Phụng Sum Vầy".
 */
export const DragonPhoenixEffect: React.FC<DragonPhoenixEffectProps> = ({
  isActive,
  onComplete,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      // Tự động kết thúc hiệu ứng sau 4.5 giây
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden select-none">
          {/* Lớp ánh hào quang vàng kim bừng sáng nhẹ lúc mở thiệp */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute inset-0 bg-radial from-[#F59E0B]/20 via-[#C4715A]/10 to-transparent"
          />

          {/* ── BỤI SAO VÀNG LẤP LÁNH BAY DỌC THEO HAI BÊN ── */}
          {[...Array(16)].map((_, i) => {
            const isLeft = i % 2 === 0;
            const startX = isLeft ? 5 + (i * 2.5) : 95 - (i * 2.5);
            const delay = 0.15 + (i * 0.12);
            const size = 5 + ((i * 5) % 8);

            return (
              <motion.div
                key={`sparkle-${i}`}
                initial={{
                  x: `${startX}vw`,
                  y: "105vh",
                  opacity: 0,
                  scale: 0.2,
                }}
                animate={{
                  x: [
                    `${startX}vw`,
                    `${isLeft ? startX + 6 : startX - 6}vw`,
                    `${isLeft ? startX - 12 : startX + 12}vw`,
                  ],
                  y: ["100vh", "45vh", "-15vh"],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.3, 1.2, 0.4],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3.5 + (i % 3) * 0.4,
                  delay,
                  ease: "easeInOut",
                }}
                className="absolute"
              >
                <div
                  className="rounded-full shadow-lg"
                  style={{
                    width: size,
                    height: size,
                    background:
                      i % 3 === 0
                        ? "linear-gradient(135deg, #FFFDF0 0%, #F59E0B 100%)"
                        : i % 3 === 1
                        ? "linear-gradient(135deg, #FDE68A 0%, #E11D48 100%)"
                        : "linear-gradient(135deg, #FFFFFF 0%, #C9A84C 100%)",
                    boxShadow: "0 0 12px 2px rgba(245, 158, 11, 0.8)",
                  }}
                />
              </motion.div>
            );
          })}

          {/* ── 1. RỒNG VÀNG BÊN TRÁI: TỪ DƯỚI VÚT LÊN & LƯỢN SANG TRÁI ── */}
          <motion.div
            initial={{
              x: "-80px",
              y: "110vh",
              rotate: -20,
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              x: [
                "-80px",   // Bắt đầu từ mép dưới góc trái
                "3vw",     // 22%: lượn uốn vào gần thiệp cưới
                "-3vw",    // 50%: uốn lượn uyển chuyển
                "-14vw",   // 75%: lượn rộng sang bên trái
                "-30vw",   // 100%: vút lên trời xanh bên trái
              ],
              y: [
                "105vh",   // 0%
                "68vh",    // 22%
                "32vh",    // 50%
                "2vh",     // 75%
                "-35vh",   // 100%
              ],
              rotate: [
                -25,
                10,
                -16,
                -36,
                -55,
              ],
              scale: [0.75, 1.05, 1.15, 1.0, 0.8],
              opacity: [0, 0.95, 1, 0.9, 0],
            }}
            transition={{
              duration: 4.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute left-0 top-0 will-change-transform filter drop-shadow-[0_12px_28px_rgba(245,158,11,0.55)]"
          >
            {/* Thần Long bay với vệt sáng lấp lánh */}
            <div className="relative w-[190px] sm:w-[280px]">
              <DragonVector className="w-full h-auto" />
              {/* Huy hiệu chữ son đỏ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.95, 0.95, 0], scale: [0.8, 1, 1, 0.9] }}
                transition={{ duration: 3.4, delay: 0.5 }}
                className="absolute -bottom-3 left-4 sm:left-8 px-3 py-1 rounded-full bg-[#7F1D1D]/85 border border-[#FDE68A]/60 text-[#FDE68A] text-[10px] sm:text-xs font-serif font-bold tracking-widest uppercase backdrop-blur-md shadow-md whitespace-nowrap"
              >
                🐲 Thanh Long Cát Khánh
              </motion.div>
            </div>
          </motion.div>

          {/* ── 2. PHƯỢNG HOÀNG BÊN PHẢI: TỪ DƯỚI VÚT LÊN & LƯỢN SANG PHẢI ── */}
          <motion.div
            initial={{
              x: "80px",
              y: "110vh",
              rotate: 20,
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              x: [
                "80px",    // Bắt đầu từ mép dưới góc phải
                "-3vw",    // 22%: lượn uốn vào gần thiệp cưới
                "3vw",     // 50%: uốn lượn uyển chuyển
                "14vw",    // 75%: lượn rộng sang bên phải
                "30vw",    // 100%: vút lên trời xanh bên phải
              ],
              y: [
                "105vh",
                "68vh",
                "32vh",
                "2vh",
                "-35vh",
              ],
              rotate: [
                25,
                -10,
                16,
                36,
                55,
              ],
              scale: [0.75, 1.05, 1.15, 1.0, 0.8],
              opacity: [0, 0.95, 1, 0.9, 0],
            }}
            transition={{
              duration: 4.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute right-0 top-0 will-change-transform filter drop-shadow-[0_12px_28px_rgba(225,29,72,0.5)]"
          >
            {/* Phượng Hoàng bay với đuôi lượn ngũ sắc */}
            <div className="relative w-[190px] sm:w-[280px]">
              <PhoenixVector className="w-full h-auto" />
              {/* Huy hiệu chữ son đỏ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.95, 0.95, 0], scale: [0.8, 1, 1, 0.9] }}
                transition={{ duration: 3.4, delay: 0.5 }}
                className="absolute -bottom-3 right-4 sm:right-8 px-3 py-1 rounded-full bg-[#881337]/85 border border-[#FDE68A]/60 text-[#FDE68A] text-[10px] sm:text-xs font-serif font-bold tracking-widest uppercase backdrop-blur-md shadow-md whitespace-nowrap"
              >
                🪶 Phượng Vũ Trình Tường
              </motion.div>
            </div>
          </motion.div>

          {/* ── HUY HIỆU CHÚC PHÚC "LONG PHỤNG SUM VẦY" XUẤT HIỆN Ở GIỮA RỒI TAN BIẾN ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [30, 0, 0, -20],
              scale: [0.8, 1.05, 1, 0.95],
            }}
            transition={{ duration: 3.2, delay: 0.5, ease: "easeOut" }}
            className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
          >
            <div className="px-5 py-2 rounded-full bg-[#FDFAF5]/95 border-2 border-[#C9A84C] shadow-2xl backdrop-blur-md flex items-center gap-2.5">
              <span className="text-base">🐲</span>
              <span className="font-calligraphy text-xl sm:text-2xl text-[#C4715A] font-bold tracking-wide">
                Long Phụng Sum Vầy
              </span>
              <span className="text-base">🪶</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-serif font-bold mt-1 drop-shadow-md">
              Trăm Năm Hạnh Phúc • Vẹn Tròn Lứa Đôi
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
