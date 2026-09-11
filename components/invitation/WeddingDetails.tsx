"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, MapPin, Navigation, CalendarPlus } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

export const WeddingDetails: React.FC = () => {
  const { data: weddingData } = useWeddingData();

  const handleAddToCalendar = (event: (typeof weddingData.events)[0]) => {
    const title = encodeURIComponent(`${event.title} - ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`);
    const details = encodeURIComponent(`Trân trọng kính mời quý khách đến tham dự ${event.title} tại ${event.venue}.\nĐịa chỉ: ${event.address}`);
    const location = encodeURIComponent(event.address);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <section id="details" className="py-16 sm:py-20 px-4 bg-ivory-texture relative overflow-hidden">
      <div className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
            className="inline-flex items-center justify-center mb-2"
          >
            <VietnameseLotus size={36} color="#4A6741" opacity={0.85} />
          </motion.div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#C4715A] font-sans font-semibold mb-1"
          >
            Chương Trình Hôn Lễ
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide"
          >
            Thông Tin Tiệc Cưới
          </motion.h2>
          <motion.div
            variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, delay: 0.1 } } }}
            className="mx-auto mt-2 mb-3 h-[1.5px] w-20 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}
          />
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
            className="flex items-center justify-center my-3"
          >
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </motion.div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto leading-relaxed"
          >
            Sự hiện diện và chúc phúc của quý khách là niềm vinh hạnh lớn nhất của gia đình chúng tôi.
          </motion.p>
        </motion.div>

        {/* Cards danh sách sự kiện - 2 Cột trên Desktop, 1 Cột trên Điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {weddingData.events.map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12, type: "spring", stiffness: 120, damping: 18 }}
              whileHover={{ y: -4, boxShadow: "0 18px 48px -8px rgba(74, 103, 65, 0.15)" }}
              className="rounded-3xl p-6 sm:p-8 bg-[#FFFDF9] border border-[#E8D5CF] shadow-xs relative overflow-hidden flex flex-col justify-between"
              style={{ boxShadow: "0 12px 32px -8px rgba(74, 103, 65, 0.08)" }}
            >
              {/* Badge Tiêu đề & Subtitle */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E8D5CF]/60">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#C4715A] block">
                    {event.subtitle || "Sự Kiện"}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#354D2E] mt-0.5">
                    {event.title}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#F0F5EE] border border-[#A8BCA1]/40 text-[#4A6741] text-xs font-serif font-bold">
                  {event.time}
                </div>
              </div>

              {/* Thông tin thời gian & địa điểm */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-[#5C4033]">
                  <Calendar className="w-4 h-4 text-[#C4715A] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-[#354D2E]">{event.date || weddingData.weddingDateFormatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-[#5C4033]">
                  <Clock className="w-4 h-4 text-[#4A6741] mt-0.5 shrink-0" />
                  <div>
                    <span>Vào lúc </span>
                    <span className="font-semibold text-[#354D2E]">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-[#5C4033]">
                  <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-[#354D2E]">{event.venue}</div>
                    <div className="text-xs text-[#8C6A58] mt-0.5 leading-relaxed">{event.address}</div>
                  </div>
                </div>

                {event.notes && (
                  <p className="text-xs text-[#8C6A58] italic font-serif mt-2 pl-7">
                    * {event.notes.startsWith("*") ? event.notes.slice(1).trim() : event.notes}
                  </p>
                )}
              </div>

              {/* Các nút hành động: Chỉ đường & Thêm lịch */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8D5CF]/60">
                {event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-serif font-semibold tracking-wide transition-all shadow-xs active:scale-98"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Xem Bản Đồ &amp; Chỉ Đường</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleAddToCalendar(event)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#FDF0EC] hover:bg-[#F5E2DB] text-[#C4715A] text-xs font-serif font-semibold border border-[#E8D5CF] transition-all active:scale-98"
                  title="Thêm sự kiện vào Google Calendar"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lưu Lịch</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
