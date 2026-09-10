"use client";

import React, { useState, useEffect } from "react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus } from "@/components/ui/VietnamesePattern";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(weddingData.weddingDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingData.weddingDate]);

  if (!mounted) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-[#FAF3E8]">
      <div className="max-w-md mx-auto text-center relative">
        {/* Tiêu đề theo ảnh mẫu */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wider uppercase text-[#183A3A] mb-8">
          ĐẾM NGƯỢC ĐẾN NGÀY VUI
        </h2>

        {/* Khung số đếm ngược với hoa sen in chìm ở tâm */}
        <div className="relative py-4">
          {/* Đóa sen in chìm trung tâm theo ảnh mẫu */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <VietnameseLotus size={100} color="#D4AF37" opacity={0.25} />
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6 relative z-10">
            {[
              { label: "NGÀY", value: timeLeft.days },
              { label: "GIỜ", value: timeLeft.hours },
              { label: "PHÚT", value: timeLeft.minutes },
              { label: "GIÂY", value: timeLeft.seconds },
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center min-w-[50px] sm:min-w-[65px]">
                  <div className="font-serif text-3xl sm:text-4xl font-semibold text-[#B8860B] tabular-nums tracking-tight">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs tracking-[0.2em] font-medium text-[#78928A] uppercase mt-1">
                    {item.label}
                  </div>
                </div>

                {/* Dấu hai chấm giữa các cụm */}
                {idx < 3 && (
                  <span className="text-2xl sm:text-3xl text-[#D4AF37]/80 font-serif -mt-4 select-none">
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
