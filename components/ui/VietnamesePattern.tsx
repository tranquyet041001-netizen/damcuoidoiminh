import React from "react";

interface PatternProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}

/**
 * Trống đồng Đông Sơn cách điệu tối giản:
 * Mặt trời trung tâm, các vòng tròn đồng tâm, họa tiết răng cưa chữ gãy và vành chim Lạc bay.
 */
export const DongSonSun: React.FC<PatternProps> = ({
  className = "",
  size = 180,
  color = "currentColor",
  opacity = 0.15,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {/* Vòng tròn ngoài cùng */}
      <circle cx="100" cy="100" r="95" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="1.2" />

      {/* Vành chim Lạc bay */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <path
            d="M96 15 C88 20 82 28 85 34 C87 38 93 39 100 37 C104 35 110 28 114 18 C115 15 110 14 105 15 Z"
            stroke={color}
            strokeWidth="1"
            fill="none"
          />
          <path d="M100 37 C105 45 112 48 120 46" stroke={color} strokeWidth="0.8" />
        </g>
      ))}

      <circle cx="100" cy="100" r="62" stroke={color} strokeWidth="1" />
      <circle cx="100" cy="100" r="54" stroke={color} strokeWidth="1" strokeDasharray="2 2" />

      {/* Họa tiết răng cưa gãy khúc */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1="100"
          y1="47"
          x2="100"
          y2="53"
          stroke={color}
          strokeWidth="1.2"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}

      <circle cx="100" cy="100" r="46" stroke={color} strokeWidth="1" />
      <circle cx="100" cy="100" r="32" stroke={color} strokeWidth="1.2" />

      {/* Mặt trời 12 tia trung tâm */}
      {[...Array(12)].map((_, i) => {
        const angle = i * 30;
        return (
          <path
            key={i}
            d="M96 72 L100 64 L104 72 Z"
            fill={color}
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
      <circle cx="100" cy="100" r="10" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
    </svg>
  );
};

/**
 * Biểu tượng Cặp Nhẫn Cưới & Kim Cương Hoàng Gia lồng nhau (Trang nhã, ý nghĩa trọn vẹn, không nhạy cảm)
 */
export const WeddingRingsCrest: React.FC<PatternProps> = ({
  className = "",
  size = 46,
  color = "currentColor",
  opacity = 0.9,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {/* Tia sáng kim cương lấp lánh */}
      <path
        d="M38 5 L38 9 M38 25 L38 29 M24 17 L28 17 M48 17 L52 17"
        stroke="#C9A84C"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="38" cy="17" r="1.5" fill="#C9A84C" />

      {/* Viên kim cương trên nhẫn cô dâu */}
      <path
        d="M38 10 L44 17 L38 24 L32 17 Z"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="#FDFAF5"
        strokeLinejoin="round"
      />
      <line x1="32" y1="17" x2="44" y2="17" stroke="#C9A84C" strokeWidth="1" />
      <line x1="38" y1="10" x2="38" y2="24" stroke="#C9A84C" strokeWidth="0.8" />

      {/* Nhẫn 1 (Cô dâu - có kim cương) */}
      <circle
        cx="38"
        cy="46"
        r="19"
        stroke={color}
        strokeWidth="2.2"
      />
      <circle
        cx="38"
        cy="46"
        r="15.5"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.5"
      />

      {/* Nhẫn 2 (Chú rể - lồng vào bên phải) */}
      <circle
        cx="60"
        cy="50"
        r="19"
        stroke={color}
        strokeWidth="2.2"
      />
      <circle
        cx="60"
        cy="50"
        r="15.5"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.5"
      />

      {/* Điểm lồng đan xen 3D */}
      <path
        d="M47 34 A 19 19 0 0 1 54 37"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Cành lá hạnh phúc uốn cong nâng đỡ hai chiếc nhẫn */}
      <path
        d="M18 72 C32 84 46 86 50 86"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M82 72 C68 84 54 86 50 86"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Lá nguyệt quế */}
      <path
        d="M28 75 C24 73 24 67 28 68 C30 71 29 74 28 75 Z"
        fill={color}
        fillOpacity="0.5"
        stroke={color}
        strokeWidth="0.6"
      />
      <path
        d="M38 80 C35 78 36 72 40 73 C41 76 40 79 38 80 Z"
        fill={color}
        fillOpacity="0.5"
        stroke={color}
        strokeWidth="0.6"
      />
      <path
        d="M72 75 C76 73 76 67 72 68 C70 71 71 74 72 75 Z"
        fill={color}
        fillOpacity="0.5"
        stroke={color}
        strokeWidth="0.6"
      />
      <path
        d="M62 80 C65 78 64 72 60 73 C59 76 60 79 62 80 Z"
        fill={color}
        fillOpacity="0.5"
        stroke={color}
        strokeWidth="0.6"
      />

      {/* Điểm xuyết hoa quả son đỏ trung tâm */}
      <circle cx="50" cy="86" r="2.2" fill="#C4715A" />
    </svg>
  );
};

// Giữ alias tương thích ngược để toàn bộ thiệp cưới tự động cập nhật biểu tượng mới
export const VietnameseLotus = WeddingRingsCrest;

/**
 * Đường viền họa tiết hoa cành / Đông Sơn kết hợp
 */
export const DongSonBorder: React.FC<{
  className?: string;
  color?: string;
  opacity?: number;
}> = ({ className = "", color = "#4A6741", opacity = 0.35 }) => {
  return (
    <div
      className={`w-full flex items-center justify-center gap-2 my-4 select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-current to-current" style={{ color }} />
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="8" r="2.5" fill={color} />
        <path d="M12 8 L6 8 M28 8 L34 8" stroke={color} strokeWidth="1" />
        <path d="M15 5 C17 6.5 17 9.5 15 11 M25 5 C23 6.5 23 9.5 25 11" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-current to-current" style={{ color }} />
    </div>
  );
};

/**
 * Cành lá hoa botanical thanh lịch cho góc khung hoặc phân cách
 */
export const BotanicalBranch: React.FC<PatternProps> = ({
  className = "",
  size = 48,
  color = "#4A6741",
  opacity = 0.7,
}) => {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M10 25 C30 24 50 26 90 25"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Lá chét bên trên */}
      <path d="M30 25 C32 15 42 12 45 18 C40 22 36 24 30 25 Z" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="0.8" />
      <path d="M55 25 C58 13 70 12 72 19 C66 23 62 25 55 25 Z" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="0.8" />
      {/* Lá chét bên dưới */}
      <path d="M42 25 C45 35 55 37 57 31 C52 28 48 26 42 25 Z" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="0.8" />
      <path d="M68 25 C72 36 82 36 84 30 C78 27 75 25 68 25 Z" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="0.8" />
      {/* Nụ hoa nhỏ ở đầu */}
      <circle cx="92" cy="25" r="2" fill="#C4715A" />
    </svg>
  );
};

/**
 * Họa tiết góc hoa lá Botanical Corner
 */
export const BotanicalCorner: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}> = ({ className = "", size = 64, color = "#4A6741", position = "top-left" }) => {
  const transform =
    position === "top-right"
      ? "scaleX(-1)"
      : position === "bottom-left"
      ? "scaleY(-1)"
      : position === "bottom-right"
      ? "scale(-1, -1)"
      : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform }}
      aria-hidden="true"
    >
      {/* Dây leo cong theo góc */}
      <path
        d="M5 75 C10 40 40 10 75 5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Lá dọc theo nhánh */}
      <path d="M22 45 C15 36 20 28 28 32 C26 39 24 43 22 45 Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.8" />
      <path d="M45 22 C36 15 28 20 32 28 C39 26 43 24 45 22 Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.8" />
      <path d="M38 34 C44 26 52 28 50 36 C45 37 41 36 38 34 Z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="0.8" />
      {/* Hoa nhỏ ở góc đỉnh */}
      <circle cx="75" cy="5" r="2.5" fill="#C4715A" />
      <circle cx="5" cy="75" r="2.5" fill="#C4715A" />
    </svg>
  );
};

/**
 * Con dấu sáp đỏ son truyền thống (Cinnabar seal)
 */
export const RedSealStamp: React.FC<{
  text?: string;
  className?: string;
  size?: number;
}> = ({ text = "SONG HỶ", className = "", size = 60 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#C4715A] text-[#FDFAF5] shadow-md border border-[#E8D5CF] select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-1 rounded-full border border-dashed border-[#FDFAF5]/60" />
      <div className="text-center font-serif text-[11px] leading-tight font-semibold tracking-widest px-1">
        {text}
      </div>
    </div>
  );
};

/**
 * Cặp chim Lạc đối xứng
 */
export const LacBirdPair: React.FC<{ className?: string; color?: string }> = ({
  className = "",
  color = "#4A6741",
}) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <svg
        width="36"
        height="20"
        viewBox="0 0 50 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform scale-x-[-1] opacity-60"
      >
        <path
          d="M5 25 C15 24 25 15 32 8 C38 2 46 2 48 5 C45 10 38 14 30 18 C22 22 12 24 5 25 Z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path d="M30 18 C33 22 40 25 46 24" stroke={color} strokeWidth="1.2" />
      </svg>

      <span className="w-1.5 h-1.5 rounded-full bg-[#C4715A] opacity-75" />

      <svg
        width="36"
        height="20"
        viewBox="0 0 50 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-60"
      >
        <path
          d="M5 25 C15 24 25 15 32 8 C38 2 46 2 48 5 C45 10 38 14 30 18 C22 22 12 24 5 25 Z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path d="M30 18 C33 22 40 25 46 24" stroke={color} strokeWidth="1.2" />
      </svg>
    </div>
  );
};
