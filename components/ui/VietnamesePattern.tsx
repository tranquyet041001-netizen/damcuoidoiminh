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
 * Hoa sen thuần Việt tối giản, tao nhã
 */
export const VietnameseLotus: React.FC<PatternProps> = ({
  className = "",
  size = 64,
  color = "currentColor",
  opacity = 0.8,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Cánh sen chính giữa */}
      <path
        d="M50 20 C42 40 44 65 50 78 C56 65 58 40 50 20 Z"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cánh sen bên trái */}
      <path
        d="M50 45 C32 40 22 55 26 72 C35 75 44 68 50 62"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cánh sen bên phải */}
      <path
        d="M50 45 C68 40 78 55 74 72 C65 75 56 68 50 62"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cánh sen phụ nở ngoài */}
      <path
        d="M28 68 C15 72 16 82 28 82 C38 82 46 76 50 72"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M72 68 C85 72 84 82 72 82 C62 82 54 76 50 72"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      {/* Đáy đài sen */}
      <path
        d="M36 84 C45 87 55 87 64 84"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Đường viền họa tiết Đông Sơn (dùng phân cách các section hoặc khung thiệp)
 */
export const DongSonBorder: React.FC<{
  className?: string;
  color?: string;
  opacity?: number;
}> = ({ className = "", color = "#9E3D32", opacity = 0.35 }) => {
  return (
    <div
      className={`w-full flex items-center justify-center gap-2 my-4 select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#9E3D32] to-[#9E3D32]" />
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="8" r="3" fill={color} />
        <path d="M12 8 L6 8 M28 8 L34 8" stroke={color} strokeWidth="1" />
        <path d="M16 4 L20 8 L16 12 M24 4 L20 8 L24 12" stroke={color} strokeWidth="1" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#9E3D32] to-[#9E3D32]" />
    </div>
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
      className={`relative inline-flex items-center justify-center rounded-full bg-[#9E3D32] text-[#FFF9EE] shadow-md border border-[#BD4B3F] select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-1 rounded-full border border-dashed border-[#F4E8D2]/50" />
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
  color = "#183A3A",
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
          strokeWidth="1.8"
          fill="none"
        />
        <path d="M30 18 C33 22 40 25 46 24" stroke={color} strokeWidth="1.4" />
      </svg>

      <span className="w-1.5 h-1.5 rounded-full bg-[#9E3D32] opacity-75" />

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
          strokeWidth="1.8"
          fill="none"
        />
        <path d="M30 18 C33 22 40 25 46 24" stroke={color} strokeWidth="1.4" />
      </svg>
    </div>
  );
};
