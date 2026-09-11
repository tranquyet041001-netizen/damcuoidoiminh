"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Flip digit: reveals new number with a vertical flip when value changes */
const FlipDigit: React.FC<{ value: string; label: string; index: number }> = ({
  value,
  label,
  index,
}) => {
  const prevRef = useRef(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setIsFlipping(true);
      const t = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 280);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center"
    >
      {/* Glass card */}
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
          border: "1px solid rgba(201,168,76,0.3)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.12), 0 0 0 1px rgba(201,168,76,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 60%)",
          }}
        />

        {/* Flip animation */}
        <div
          className="relative font-serif font-bold tabular-nums text-[#F7E8B0] select-none"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            textShadow: "0 0 20px rgba(201,168,76,0.5), 0 2px 4px rgba(0,0,0,0.6)",
            transition: isFlipping
              ? "transform 0.14s ease-in, opacity 0.14s"
              : "transform 0.14s ease-out, opacity 0.14s",
            transform: isFlipping ? "translateY(-8px) scaleY(0.7)" : "translateY(0) scaleY(1)",
            opacity: isFlipping ? 0.2 : 1,
          }}
        >
          {displayValue}
        </div>

        {/* Horizontal mid-line (flip clock style) */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: "50%",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)",
          }}
        />

        {/* Pulse ring on seconds change */}
        {label === "Giây" && (
          <motion.div
            key={value}
            initial={{ opacity: 0.5, scale: 0.7 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl pointer-events-none border border-[#C9A84C]/25"
          />
        )}
      </div>

      {/* Label */}
      <span
        className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold"
        style={{ color: "#A8BCA1" }}
      >
        {label}
      </span>
    </motion.div>
  );
};

/** Separator ":" between units */
const Separator: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center gap-1.5 pb-5 sm:pb-6 px-0.5 sm:px-1"
    aria-hidden="true"
  >
    <span
      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
      style={{ background: "#C9A84C", opacity: 0.45, boxShadow: "0 0 6px #C9A84C" }}
    />
    <span
      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
      style={{ background: "#C9A84C", opacity: 0.45, boxShadow: "0 0 6px #C9A84C" }}
    />
  </div>
);

export const Countdown: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventStarted, setIsEventStarted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(weddingData.weddingDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsEventStarted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [weddingData.weddingDate]);

  const units = [
    { label: "Ngày", value: String(timeLeft.days).padStart(2, "0") },
    { label: "Giờ", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "Phút", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "Giây", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <section
      id="countdown"
      className="relative py-16 sm:py-20 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #111B0F 0%, #1C2919 40%, #0D1A0C 100%)",
      }}
    >
      {/* Ambient golden glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(201,168,76,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Subtle star-field dots */}
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            background: "#C9A84C",
            opacity: 0.15 + (i % 4) * 0.05,
            top: `${10 + (i * 37) % 80}%`,
            left: `${5 + (i * 53) % 90}%`,
          }}
        />
      ))}

      <div className="max-w-lg mx-auto relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          {/* Gold ornament line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C9A84C] opacity-60" />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-70">
              <path d="M9 1L10.5 6.5H16L11.5 9.5L13 15L9 12L5 15L6.5 9.5L2 6.5H7.5Z" fill="#C9A84C" />
            </svg>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C9A84C] opacity-60" />
          </div>

          <p
            className="text-[11px] uppercase tracking-[0.32em] font-sans font-semibold mb-2"
            style={{ color: "#C9A84C" }}
          >
            Đếm Ngược Thời Gian
          </p>
          <h2
            className="font-serif text-2xl sm:text-3xl font-bold tracking-wide"
            style={{ color: "#F5EDD0" }}
          >
            {isEventStarted ? "Ngày Trọng Đại Đã Đến!" : "Cùng Đếm Ngày Hạnh Phúc"}
          </h2>

          {/* Thin gold underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-3 h-px w-24 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}
          />

          <p className="text-xs sm:text-sm italic font-serif mt-4 leading-relaxed" style={{ color: "#7A9670" }}>
            Hồi hộp từng giây phút mong chờ ngày được sum vầy cùng người thương.
          </p>
        </motion.div>

        {/* Flip digit countdown */}
        <div className="flex items-end justify-center gap-1 sm:gap-2 mb-10">
          {units.map((unit, idx) => (
            <React.Fragment key={unit.label}>
              <FlipDigit value={unit.value} label={unit.label} index={idx} />
              {idx < units.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-block px-6 py-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(201,168,76,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="font-serif italic text-sm leading-relaxed" style={{ color: "#8A9E7A" }}>
            &ldquo;Trăm năm tình viên mãn, bạc đầu nghĩa phu thê.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
};
