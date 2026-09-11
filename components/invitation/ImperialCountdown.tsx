"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ImperialFlipDigit: React.FC<{ value: string; label: string; index: number }> = ({
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
      {/* Khung đếm số phong cách Thẻ Kim Bài Sơn Son Thiếp Vàng */}
      <div
        className="relative w-16 h-18 sm:w-22 sm:h-24 md:w-26 md:h-28 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-[#E5C368]/80 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,243,176,0.3)]"
        style={{
          background: "linear-gradient(145deg, #2D0609 0%, #1A0305 60%, #100203 100%)",
        }}
      >
        {/* Viền hoa văn chỉ vàng nội thất */}
        <div className="absolute inset-1 rounded-xl border border-dashed border-[#FDE68A]/30 pointer-events-none" />

        {/* Ánh kim tỏa sáng từ tâm */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(229,195,104,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Số đếm mạ vàng rực sáng */}
        <div
          className="relative font-serif font-bold tabular-nums text-[#FFF3B0] select-none"
          style={{
            fontSize: "clamp(1.7rem, 3.8vw, 2.7rem)",
            textShadow: "0 0 20px rgba(229,195,104,0.65), 0 2px 5px rgba(0,0,0,0.9)",
            transition: isFlipping
              ? "transform 0.14s ease-in, opacity 0.14s"
              : "transform 0.14s ease-out, opacity 0.14s",
            transform: isFlipping ? "translateY(-8px) scaleY(0.7)" : "translateY(0) scaleY(1)",
            opacity: isFlipping ? 0.2 : 1,
          }}
        >
          {displayValue}
        </div>

        {/* Đường khắc rãnh ngang phong cách flip clock kim loại */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: "50%",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(229,195,104,0.5), transparent)",
          }}
        />

        {/* Xung nhịp ánh sáng theo từng giây */}
        {label === "Giây" && (
          <motion.div
            key={value}
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl pointer-events-none border border-[#E5C368]/40"
          />
        )}
      </div>

      {/* Tên đơn vị thời gian (Ngày / Giờ / Phút / Giây) */}
      <span className="mt-2.5 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-serif font-bold text-[#FDE68A]">
        {label}
      </span>
    </motion.div>
  );
};

const ImperialSeparator: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-2 pb-6 px-1 sm:px-2" aria-hidden="true">
    <span
      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
      style={{ background: "#E5C368", boxShadow: "0 0 8px #E5C368" }}
    />
    <span
      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
      style={{ background: "#E5C368", boxShadow: "0 0 8px #E5C368" }}
    />
  </div>
);

export const ImperialCountdown: React.FC = () => {
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
      className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none"
      style={{ backgroundColor: "#150305" }}
    >
      {/* Nền gấm sâu thẳm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, #2E060A 0%, #180305 60%, #0D0203 100%)",
        }}
      />

      <div className="max-w-xl md:max-w-3xl mx-auto relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
              KHẮC THỜI HOÀNG ĐẠO
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF8D6] tracking-wide">
            Cùng Đếm Ngược Ngày Cát Nhật
          </h2>

          <div
            className="mx-auto mt-3 h-[1.5px] w-24 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #E5C368, transparent)" }}
          />

          <p className="text-xs sm:text-sm text-[#E8D5CF] italic font-serif max-w-md mx-auto mt-3 leading-relaxed">
            {isEventStarted
              ? "Giờ hoàng đạo đã điểm, hôn lễ cát tường đang diễn ra hân hoan!"
              : `Hướng về ngày đại hỷ ${weddingData.weddingDateFormatted}`}
          </p>
        </motion.div>

        {/* Các thẻ đếm ngược */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5">
          {units.map((unit, idx) => (
            <React.Fragment key={unit.label}>
              <ImperialFlipDigit value={unit.value} label={unit.label} index={idx} />
              {idx < units.length - 1 && <ImperialSeparator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
