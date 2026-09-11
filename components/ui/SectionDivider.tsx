import React from "react";

type DividerVariant = "wave" | "wave-reverse" | "botanical" | "lotus" | "gentle";

interface SectionDividerProps {
  fromColor?: string;
  toColor?: string;
  variant?: DividerVariant;
  className?: string;
  flip?: boolean;
}

/**
 * Chuyen tiep mem mai giua cac section voi wave / botanical SVG.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  fromColor = "#FDFAF5",
  toColor = "#FDF0EC",
  variant = "wave",
  className = "",
  flip = false,
}) => {
  if (variant === "wave" || variant === "wave-reverse") {
    const reverse = variant === "wave-reverse" || flip;
    return (
      <div
        className={`relative w-full overflow-hidden leading-none ${className}`}
        style={{ backgroundColor: fromColor, marginBottom: "-2px" }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 72"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
          style={{
            height: "clamp(32px, 5vw, 72px)",
            transform: reverse ? "scaleX(-1)" : undefined,
          }}
        >
          <path
            d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
            fill={toColor}
          />
          <path
            d="M0,48 C360,24 720,60 1080,40 C1260,30 1380,52 1440,48 L1440,72 L0,72 Z"
            fill={toColor}
            fillOpacity="0.5"
          />
        </svg>
      </div>
    );
  }

  if (variant === "lotus") {
    return (
      <div
        className={`relative w-full flex flex-col items-center py-4 overflow-hidden ${className}`}
        style={{ backgroundColor: fromColor }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)` }}
        />
        <svg
          width="200" height="32" viewBox="0 0 200 32" fill="none"
          xmlns="http://www.w3.org/2000/svg" className="relative z-10 opacity-30"
        >
          <line x1="0" y1="16" x2="80" y2="16" stroke="#C9A84C" strokeWidth="0.8" />
          <line x1="120" y1="16" x2="200" y2="16" stroke="#C9A84C" strokeWidth="0.8" />
          <path d="M88 16 C90 8 95 4 100 4 C105 4 110 8 112 16 C110 14 106 12 100 12 C94 12 90 14 88 16Z" fill="#C9A84C" fillOpacity="0.5" />
          <path d="M92 16 C92 22 95 26 100 26 C105 26 108 22 108 16 C106 18 104 20 100 20 C96 20 94 18 92 16Z" fill="#C9A84C" fillOpacity="0.35" />
          <circle cx="100" cy="16" r="3" fill="#C9A84C" fillOpacity="0.6" />
          <circle cx="84" cy="16" r="1.5" fill="#C9A84C" fillOpacity="0.4" />
          <circle cx="116" cy="16" r="1.5" fill="#C9A84C" fillOpacity="0.4" />
        </svg>
      </div>
    );
  }

  if (variant === "botanical") {
    return (
      <div
        className={`relative w-full overflow-hidden ${className}`}
        style={{ backgroundColor: fromColor }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)` }}
        />
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block relative z-10"
          style={{ height: "clamp(48px, 6vw, 80px)" }}
        >
          <path d="M0,60 Q360,20 720,50 Q1080,80 1440,40 L1440,80 L0,80 Z" fill={toColor} fillOpacity="0.8" />
          <path d="M0,70 Q480,40 960,65 Q1200,75 1440,60 L1440,80 L0,80 Z" fill={toColor} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${className}`}
      style={{ height: "clamp(24px, 4vw, 56px)", background: `linear-gradient(to bottom, ${fromColor}, ${toColor})` }}
      aria-hidden="true"
    />
  );
};
