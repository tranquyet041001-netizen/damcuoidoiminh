"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Navigation, CalendarPlus, Sparkles, Flame } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, RedSealStamp } from "@/components/ui/VietnamesePattern";

export const ImperialCeremonySchedule: React.FC = () => {
  const { data: weddingData } = useWeddingData();

  const handleOpenGoogleCalendar = (event: (typeof weddingData.events)[0]) => {
    const title = encodeURIComponent(`${event.title} - ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`);
    const details = encodeURIComponent(
      `Trân trọng kính mời quý khách tham dự ${event.title} của ${weddingData.groom.fullName} & ${weddingData.bride.fullName} tại ${event.venue}.\nĐịa chỉ: ${event.address}\n\nKính chúc quý khách vạn sự cát tường!`
    );
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);
    const dateClean = (weddingData.weddingDate || "2027-01-24T10:30:00").split("T")[0].replace(/-/g, "");
    const timeClean = (event.time || "11:00").replace(/[^0-9]/g, "");
    const hour = timeClean.slice(0, 2) || "11";
    const min = timeClean.slice(2, 4) || "00";

    const dates = `${dateClean}T${hour}${min}00/${dateClean}T${(parseInt(hour, 10) + 3).toString().padStart(2, "0")}${min}00`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(url, "_blank");
  };

  return (
    <section id="details" className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none" style={{ backgroundColor: "#140406" }}>
      {/* Nền gấm đại hỷ đỏ thẫm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, #2E060A 0%, #170305 60%, #0D0203 100%)",
        }}
      />

      <div className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto relative z-10">
        {/* Header Điển Lễ Giai Kỳ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
              NGHI THỨC &amp; HOA ĐƯỜNG ĐÓN KHÁCH
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF8D6] tracking-wide">
            Điển Lễ Hỷ Sự Giai Kỳ
          </h2>

          <p className="text-xs sm:text-sm text-[#E8D5CF] italic font-serif max-w-md mx-auto mt-2 leading-relaxed">
            Kính mời quý quan khách thân hữu hội tụ chung vui, chứng giám thời khắc giao bôi kết tóc trăm năm
          </p>
        </motion.div>

        {/* ── DANH SÁCH SỰ KIỆN: LỄ VU QUY, LỄ THÀNH HÔN & KHAI TIỆC ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {weddingData.events.map((event, index) => {
            const isKhaiTiec =
              event.id === "tiec-cuoi" ||
              index === 2 ||
              (index === weddingData.events.length - 1 && weddingData.events.length % 2 === 1);

            return (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-3xl p-6 sm:p-8 border-2 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_25px_rgba(229,195,104,0.2)] overflow-hidden flex flex-col justify-between transition-all ${
                  isKhaiTiec
                    ? "md:col-span-2 md:max-w-xl md:mx-auto w-full border-[#FDE68A] shadow-[0_25px_55px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(229,195,104,0.35)]"
                    : "border-[#E5C368]/80"
                }`}
                style={{
                  background: isKhaiTiec
                    ? "linear-gradient(165deg, #2E060A 0%, #1A0305 60%, #100203 100%)"
                    : "linear-gradient(165deg, #240507 0%, #180305 60%, #100203 100%)",
                }}
              >
                {/* Viền hoa văn chỉ vàng */}
                <div className="absolute inset-2 rounded-2xl border border-dashed border-[#FDE68A]/35 pointer-events-none" />

                <div>
                  {/* Header sự kiện */}
                  <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E5C368]/40">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#E5C368] font-serif font-bold block">
                        {isKhaiTiec
                          ? "HOA ĐƯỜNG ĐẠI HỶ • KHAI TIỆC CHUNG VUI"
                          : event.subtitle || (index === 0 ? "NGHI ĐIỂN HỶ SỰ" : "HOA ĐƯỜNG ĐẠI HỶ")}
                      </span>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#FFF8D6] mt-0.5">
                        {event.title}
                      </h3>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-full bg-[#3B090D] border border-[#E5C368] text-[#FDE68A] text-xs font-serif font-bold flex items-center gap-1.5 shadow-md shrink-0">
                      <Clock className="w-3.5 h-3.5 text-[#E5C368]" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Thông tin thời gian & địa điểm */}
                  <div className="space-y-3.5 text-sm text-[#E8D5CF]">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#E5C368] mt-1 shrink-0" />
                      <div>
                        <div className="text-xs text-[#E5C368]/90 font-serif font-semibold uppercase tracking-wider">
                          Ngày Cát Nhật Cử Hành:
                        </div>
                        <div className="font-serif font-bold text-[#FFF3B0] text-base mt-0.5">
                          {event.date || weddingData.weddingDateFormatted}
                        </div>
                        <div className="text-xs text-[#FDE68A]/80 italic font-serif">
                          ({weddingData.lunarDateFormatted})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#E5C368] mt-1 shrink-0" />
                      <div>
                        <div className="text-xs text-[#E5C368]/90 font-serif font-semibold uppercase tracking-wider">
                          Hoa Đường Tiếp Đón:
                        </div>
                        <div className="font-serif font-bold text-[#FFF8D6] text-base mt-0.5">
                          {event.venue}
                        </div>
                        <p className="text-xs text-[#E8D5CF]/80 font-serif mt-0.5 leading-relaxed">
                          {event.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hàng nút tác vụ thông minh: Chỉ đường & Lưu lịch */}
                <div
                  className={`pt-6 mt-6 border-t border-[#E5C368]/30 flex flex-wrap gap-2.5 ${
                    isKhaiTiec ? "justify-center" : ""
                  }`}
                >
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-serif font-bold text-[#FDFAF5] transition-all transform active:scale-95 hover:scale-102 cursor-pointer shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #BA1B22 0%, #8C1217 100%)",
                      border: "1px solid #E5C368",
                    }}
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#FDE68A]" />
                    <span>Chỉ Đường Hoa Đường</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenGoogleCalendar(event)}
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-serif font-bold text-[#FFF3B0] bg-[#3B090D] hover:bg-[#4E0D12] border border-[#E5C368]/70 transition-all transform active:scale-95 cursor-pointer shadow-md"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#E5C368]" />
                    <span>Lưu Lịch Hẹn</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
