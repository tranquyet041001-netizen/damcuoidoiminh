"use client";

import React from "react";
import { Calendar, Clock, MapPin, Navigation, CalendarPlus } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { WeddingEvent } from "@/types/wedding";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PaperCard } from "@/components/ui/PaperTexture";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";
import { useToast } from "@/components/ui/Toast";

export const WeddingDetails: React.FC = () => {
  const { showToast } = useToast();

  const handleAddToCalendar = (event: WeddingEvent) => {
    // Generate .ics calendar file content
    const startDate = event.isoDate.replace(/[-:]/g, "").split("+")[0] + "Z";
    // 3 hours duration
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
    link.setAttribute("download", `dam-cuoi-${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Đã tải lịch nhắc nhở (.ics)!", "success");
  };

  return (
    <section id="details" className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          subtitle="Thời Gian & Địa Điểm"
          title="Thông Tin Hôn Lễ"
          description="Rất mong được đón tiếp quý vị trong niềm hân hoan của hai gia đình."
          variant="lotus"
        />

        <div className="space-y-8">
          {weddingData.events.map((event, idx) => (
            <PaperCard key={event.id} className="relative overflow-hidden">
              {/* Con dấu son nhỏ góc card */}
              <div className="absolute top-4 right-4 hidden sm:block opacity-90">
                <RedSealStamp
                  size={42}
                  text={idx === 0 ? "THÀNH HÔN" : "TIỆC CƯỚI"}
                  className="bg-[#9E3D32]"
                />
              </div>

              <div className="pr-0 sm:pr-14">
                <span className="text-xs uppercase tracking-widest text-[#9E3D32] font-semibold">
                  {event.subtitle || "Sự Kiện"}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#183A3A] mt-1 mb-4">
                  {event.title}
                </h3>
              </div>

              <div className="space-y-3.5 my-6 text-sm sm:text-base text-[#3A2D26]">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#9E3D32] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#183A3A]">{event.date}</div>
                    <div className="text-xs text-[#78928A]">({weddingData.lunarDateFormatted})</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#9E3D32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#183A3A]">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#9E3D32] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#183A3A]">{event.venue}</div>
                    <div className="text-xs sm:text-sm text-[#5A473E] mt-0.5 leading-relaxed">
                      {event.address}
                    </div>
                  </div>
                </div>
              </div>

              {event.notes && (
                <div className="p-3 bg-[#FAF3E8] rounded-xs border border-[#EADBCE] text-xs sm:text-sm text-[#6B5549] italic mb-6">
                  {event.notes}
                </div>
              )}

              {/* Nút tác vụ: Chỉ đường & Thêm vào lịch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-[#F4E8D2]" />
                  <span>Chỉ Đường (Google Maps)</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleAddToCalendar(event)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FFF9EE] hover:bg-[#FAF3E8] text-[#183A3A] border border-[#183A3A]/30 text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4 text-[#9E3D32]" />
                  <span>Thêm Vào Lịch (.ics)</span>
                </button>
              </div>
            </PaperCard>
          ))}
        </div>
      </div>
    </section>
  );
};
