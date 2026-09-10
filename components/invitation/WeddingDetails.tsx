"use client";

import React from "react";
import { Navigation, CalendarPlus } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { WeddingEvent } from "@/types/wedding";
import { VietnameseLotus, DongSonSun } from "@/components/ui/VietnamesePattern";
import { useToast } from "@/components/ui/Toast";

export const WeddingDetails: React.FC = () => {
  const { showToast } = useToast();
  const { data: weddingData } = useWeddingData();

  const handleAddToCalendar = (event: WeddingEvent) => {
    const startDate = event.isoDate.replace(/[-:]/g, "").split("+")[0] + "Z";
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DamCuoiVietCo//WeddingInvitation//VI",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title} - ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
      `DESCRIPTION:${event.subtitle || event.title}. ${event.notes || ""}`,
      `LOCATION:${event.venue} - ${event.address}`,
      `DTSTART:${startDate}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hon-le-${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Đã tải file lịch (.ics)!", "success");
  };

  return (
    <section id="details" className="py-12 px-4 bg-[#FAF3E8]">
      <div className="max-w-md mx-auto">
        {/* Tiêu đề theo ảnh mẫu */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wider uppercase text-[#183A3A]">
            THÔNG TIN HÔN LỄ
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </div>

        {/* Các thẻ sự kiện bo tròn với hoa văn hoa sen và trống đồng */}
        <div className="space-y-4">
          {weddingData.events.map((event, idx) => (
            <div
              key={event.id}
              className="relative bg-[#FFF9EE] border-2 border-[#EADBCE] rounded-2xl p-5 shadow-md overflow-hidden transition-all hover:border-[#D4AF37]/60"
            >
              {/* Hoa văn Trống Đồng in chìm mờ ở góc phải theo ảnh mẫu */}
              <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-20">
                <DongSonSun size={130} color="#D4AF37" opacity={0.6} />
              </div>

              <div className="flex items-center gap-4 relative z-10">
                {/* Minh họa hoa sen (sự kiện 1) hoặc trống đồng (sự kiện 2) ở góc trái */}
                <div className="w-14 h-14 rounded-xl bg-[#FAF3E8] border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {idx === 0 ? (
                    <VietnameseLotus size={36} color="#D4AF37" opacity={0.9} />
                  ) : (
                    <DongSonSun size={40} color="#D4AF37" opacity={0.85} />
                  )}
                </div>

                {/* Thông tin chính */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#183A3A] tracking-wide uppercase">
                    {event.title}
                  </h3>
                  <div className="text-xs text-[#9E3D32] font-semibold mt-0.5">
                    Thời gian: {event.time} — {event.date}
                  </div>
                  <div className="text-xs text-[#5A473E] truncate mt-0.5">
                    Địa điểm: <strong>{event.venue}</strong>
                  </div>
                </div>
              </div>

              {/* Địa chỉ chi tiết và nút tác vụ */}
              <div className="mt-3 pt-3 border-t border-[#EADBCE]/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#78928A] truncate max-w-[200px]">
                  {event.address}
                </span>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-[11px] font-medium transition-all shadow-2xs"
                  >
                    <Navigation className="w-3 h-3 text-[#D4AF37]" />
                    <span>Chỉ đường</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleAddToCalendar(event)}
                    className="p-1 rounded-full text-[#9E3D32] hover:bg-[#FAF3E8]"
                    title="Thêm vào lịch"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
