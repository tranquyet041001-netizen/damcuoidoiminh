"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

  return (
    <section id="countdown" className="py-16 px-4 bg-peach-texture relative overflow-hidden">
      <div className="max-w-lg mx-auto relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <Heart className="w-5 h-5 text-[#C4715A] fill-[#C4715A]/20 animate-heartbeat" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4715A] font-sans font-semibold mb-1">
            Đếm Ngược Thời Gian
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#354D2E] tracking-wide">
            Cùng Đếm Ngày Hạnh Phúc
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={48} color="#4A6741" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif">
            Hồi hộp từng giây phút mong chờ ngày được sum vầy cùng người thương.
          </p>
        </motion.div>

        {/* Khung đếm ngược */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto mb-8">
          {[
            { label: "Ngày", value: timeLeft.days },
            { label: "Giờ", value: timeLeft.hours },
            { label: "Phút", value: timeLeft.minutes },
            { label: "Giây", value: timeLeft.seconds },
          ].map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-2xl p-3 sm:p-4 bg-[#FDFAF5] border border-[#E8D5CF] shadow-xs flex flex-col items-center justify-center"
            >
              <div className="font-serif text-2xl sm:text-4xl font-bold text-[#354D2E] tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </div>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8C6A58] font-sans mt-1 font-semibold">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trích thơ tình */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9]/80 border border-[#E8D5CF]/60 max-w-sm mx-auto">
          <p className="font-serif italic text-sm text-[#5C4033] leading-relaxed">
            &ldquo;Trăm năm tình viên mãn, bạc đầu nghĩa phu thê.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
