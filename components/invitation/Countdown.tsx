"use client";

import React, { useState, useEffect } from "react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { SectionTitle } from "@/components/ui/SectionTitle";

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
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="py-10 px-4">
      <div className="max-w-xl mx-auto text-center">
        <SectionTitle
          subtitle="Khoảnh Khắc Mong Chờ"
          title="Đếm Ngược Ngày Vui"
          variant="minimal"
        />

        {timeLeft.isPast ? (
          <div className="p-6 bg-[#FFF9EE] border border-[#EADBCE] rounded-sm max-w-sm mx-auto shadow-sm">
            <p className="font-serif text-lg text-[#9E3D32]">
              Hôn lễ đã diễn ra trong niềm hân hoan trọn vẹn!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
            {[
              { label: "Ngày", value: timeLeft.days },
              { label: "Giờ", value: timeLeft.hours },
              { label: "Phút", value: timeLeft.minutes },
              { label: "Giây", value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="relative bg-[#FFF9EE] border border-[#E5D4B6] rounded-sm py-4 px-2 shadow-sm text-center"
              >
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#9E3D32]/40" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#9E3D32]/40" />

                <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#183A3A] tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[#78928A] font-medium mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
