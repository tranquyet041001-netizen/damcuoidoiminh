"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  CalendarPlus,
  Navigation,
  Sparkles,
  Shirt,
  HeartHandshake,
  Car,
  ExternalLink,
  Info,
} from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

interface DresscodePaletteItem {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  mood: string;
  gentlemen: string;
  ladies: string;
  recommended: boolean;
}

const DRESSCODE_PALETTE: DresscodePaletteItem[] = [
  {
    id: "ivory",
    name: "Trắng Kem",
    hex: "#FAF7F2",
    borderHex: "#D8C7B5",
    mood: "Tinh Khôi & Thuần Khiết",
    gentlemen: "Sơ mi trắng kem, suit sáng màu hoặc áo dài cách tân nhẹ nhàng.",
    ladies: "Váy midi thanh lịch, áo dài trắng phối họa tiết thêu chỉ vàng nhẹ.",
    recommended: true,
  },
  {
    id: "champagne",
    name: "Be Champagne",
    hex: "#E8DACB",
    borderHex: "#C5B29E",
    mood: "Trang Nhã & Ấm Áp",
    gentlemen: "Bộ vest be cát, quần âu kết hợp áo sơ mi trang nhã, giày da nâu.",
    ladies: "Đầm dạ hội be champagne, đầm ren tơ tằm hoặc váy lụa thướt tha.",
    recommended: true,
  },
  {
    id: "sage",
    name: "Xanh Xô Thơm",
    hex: "#9DB39A",
    borderHex: "#779374",
    mood: "Quý Phái & Bình Yên",
    gentlemen: "Áo sơ mi xanh mint/sage, cà vạt màu rêu nhã hoặc áo blazer trẻ trung.",
    ladies: "Váy xanh sage xòe nhẹ, đầm voan bồng bềnh hoặc áo dài xanh ngọc.",
    recommended: true,
  },
  {
    id: "blush",
    name: "Hồng Pastel",
    hex: "#F1CEC6",
    borderHex: "#D9A89E",
    mood: "Dịu Dàng & Ngọt Ngào",
    gentlemen: "Sơ mi trắng phối caravat hồng phấn nhã nhặn hoặc vest xám tro.",
    ladies: "Váy hồng pastel, đầm dạ hội trễ vai hoặc áo dài tơ gấm thanh tú.",
    recommended: false,
  },
];

export const DresscodeAndUtilities: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const { showToast } = useToast();

  const [selectedColor, setSelectedColor] = useState<DresscodePaletteItem>(DRESSCODE_PALETTE[0]);

  // Tạo và tải file .ics cho Apple Calendar / Outlook
  const handleDownloadICS = (event: (typeof weddingData.events)[0]) => {
    try {
      const summary = `${event.title} - ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`;
      const description = `Trân trọng kính mời quý khách tham dự ${event.title} của ${weddingData.groom.fullName} & ${weddingData.bride.fullName}.\\nĐịa điểm: ${event.venue}\\nĐịa chỉ: ${event.address}`;
      const location = `${event.venue}, ${event.address}`;

      // Tạo thời gian ISO
      const now = new Date();
      const dateParts = (weddingData.weddingDate || "2026-10-18T11:00:00").split("T")[0].replace(/-/g, "");
      const timeClean = (event.time || "11:00").replace(/[^0-9]/g, "");
      const startHour = timeClean.slice(0, 2) || "11";
      const startMin = timeClean.slice(2, 4) || "00";

      const dtStart = `${dateParts}T${startHour}${startMin}00`;
      const dtEnd = `${dateParts}T${(parseInt(startHour, 10) + 3).toString().padStart(2, "0")}${startMin}00`;

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Dam Cuoi Doi Minh//Wedding Invitation//VI",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:wedding-${Date.now()}@damcuoidoiminh.com`,
        `DTSTAMP:${now.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        "DESCRIPTION:Nhắc nhở: Ngày mai là đám cưới của " + weddingData.groom.shortName + " & " + weddingData.bride.shortName,
        "END:VALARM",
        "BEGIN:VALARM",
        "TRIGGER:-PT2H",
        "ACTION:DISPLAY",
        "DESCRIPTION:Nhắc nhở: Hôn lễ sẽ diễn ra sau 2 tiếng nữa!",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lich-Cuoi-${weddingData.groom.shortName}-${weddingData.bride.shortName}.ics`;
      a.click();
      URL.revokeObjectURL(url);

      showToast("Đã tải lịch hẹn iCal (.ics) về máy!", "success");
    } catch {
      showToast("Không thể tạo file lịch tự động", "info");
    }
  };

  // Mở Google Calendar trực tiếp
  const handleOpenGoogleCalendar = (event: (typeof weddingData.events)[0]) => {
    const title = encodeURIComponent(`${event.title} - ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`);
    const details = encodeURIComponent(
      `Trân trọng kính mời quý khách tham dự ${event.title} tại ${event.venue}.\nĐịa chỉ: ${event.address}\n\nXem thiệp cưới: ${typeof window !== "undefined" ? window.location.origin : ""}`
    );
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);
    const dateClean = (weddingData.weddingDate || "2026-10-18T11:00:00").split("T")[0].replace(/-/g, "");
    const timeClean = (event.time || "11:00").replace(/[^0-9]/g, "");
    const hour = timeClean.slice(0, 2) || "11";
    const min = timeClean.slice(2, 4) || "00";

    const dates = `${dateClean}T${hour}${min}00/${dateClean}T${(parseInt(hour, 10) + 3).toString().padStart(2, "0")}${min}00`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(url, "_blank");
  };

  const mainEvent = weddingData.events[0] || { venue: "Trung Tâm Tiệc Cưới", address: "Hà Nội" };

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-6 bg-[#FAF6F0] relative overflow-hidden">
      <div className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto relative z-10">
        {/* Header Mục Dresscode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FDFAF5] border border-[#C9A84C]/40 text-[#4A6741] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-sans font-bold shadow-2xs mb-2">
            <Palette className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Tone Màu Hỷ Sự</span>
            <Palette className="w-3.5 h-3.5 text-[#C9A84C]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide">
            Gợi Ý Trang Phục &amp; Tiện Ích
          </h2>

          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto mt-2 leading-relaxed">
            Để những khung hình kỷ niệm cùng cô dâu chú rể thêm phần hài hòa và trọn vẹn
          </p>
        </motion.div>

        {/* ── BẢNG MÀU DRESSCODE TƯƠNG TÁC ── */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFDF9] border border-[#E8D5CF] shadow-lg mb-10">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C4715A] font-sans font-bold block mb-1">
              Bảng Màu Trang Phục Danh Dự (Chạm để chọn xem gợi ý)
            </span>
            <p className="text-xs text-[#8C6A58] italic font-serif">
              Quý khách có thể lựa chọn một trong các gam màu nhã nhặn sau:
            </p>
          </div>

          {/* Hàng nút chọn màu tròn ngọc trai */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-4">
            {DRESSCODE_PALETTE.map((item) => {
              const isSelected = selectedColor.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedColor(item)}
                  className={`group relative flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isSelected ? "scale-105 bg-[#F0F5EE] shadow-md" : "hover:scale-102 hover:bg-black/5"
                  }`}
                >
                  {/* Viên ngọc màu sắc */}
                  <div
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-transform duration-300 shadow-md flex items-center justify-center"
                    style={{
                      backgroundColor: item.hex,
                      border: `3px solid ${item.borderHex}`,
                      boxShadow: isSelected
                        ? `0 0 0 3px #C9A84C, 0 8px 16px -2px ${item.borderHex}`
                        : `0 4px 10px rgba(0,0,0,0.08)`,
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-swatch-ring"
                        className="w-3 h-3 rounded-full bg-[#354D2E] shadow-xs"
                      />
                    )}
                  </div>

                  <span
                    className={`text-xs font-serif font-bold tracking-wide transition-colors ${
                      isSelected ? "text-[#354D2E]" : "text-[#5C4033]"
                    }`}
                  >
                    {item.name}
                  </span>

                  {item.recommended && (
                    <span className="absolute -top-1.5 px-2 py-0.5 rounded-full bg-[#C9A84C] text-[#FDFAF5] text-[8px] font-sans font-bold uppercase tracking-wider shadow-2xs">
                      Ưu tiên
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Khung hiển thị gợi ý trang phục theo màu đang chọn */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedColor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mt-6 p-5 sm:p-6 rounded-2xl border border-[#E8D5CF]/70 bg-[#FDFAF5] grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Cột Quý Ông */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E8D5CF]/40">
                <div className="p-2.5 rounded-xl bg-[#F0F5EE] text-[#4A6741] shrink-0 shadow-2xs">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#354D2E]">
                    Dành Cho Quý Ông ({selectedColor.name})
                  </h4>
                  <p className="text-xs text-[#5C4033] mt-1 leading-relaxed">
                    {selectedColor.gentlemen}
                  </p>
                </div>
              </div>

              {/* Cột Quý Cô */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E8D5CF]/40">
                <div className="p-2.5 rounded-xl bg-[#FDF0EC] text-[#C4715A] shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#354D2E]">
                    Dành Cho Quý Cô ({selectedColor.name})
                  </h4>
                  <p className="text-xs text-[#5C4033] mt-1 leading-relaxed">
                    {selectedColor.ladies}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Lưu ý nhỏ tinh tế */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8C6A58] italic font-serif text-center">
            <Info className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
            <span>
              Quý khách vui lòng hạn chế trang phục màu đen toàn bộ hoặc màu đỏ đậm để cô dâu chú rể được nổi bật nhất.
            </span>
          </div>
        </div>

        {/* ── KHỐI TIỆN ÍCH THỜI ĐẠI 1-CHẠM ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tiện ích 1: Đồng bộ Lịch hẹn (Calendar) */}
          <div className="rounded-3xl p-6 bg-[#FFFDF9] border border-[#E8D5CF] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarPlus className="w-5 h-5 text-[#C4715A]" />
                <h3 className="font-serif font-bold text-lg text-[#354D2E]">
                  Thêm Lịch Hẹn Vào Điện Thoại
                </h3>
              </div>
              <p className="text-xs text-[#8C6A58] font-serif leading-relaxed mb-4">
                Tự động tạo lịch nhắc trước ngày cưới 1 ngày &amp; trước giờ khai tiệc 2 tiếng để quý khách không bỏ lỡ khoảnh khắc trọng đại.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-3 border-t border-[#E8D5CF]/60">
              <button
                type="button"
                onClick={() => handleOpenGoogleCalendar(mainEvent)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-serif font-bold bg-[#F0F5EE] hover:bg-[#E4ECE1] text-[#354D2E] border border-[#A8BCA1]/50 transition-all cursor-pointer shadow-xs"
              >
                <span>Google Calendar</span>
                <ExternalLink className="w-3 h-3 text-[#4A6741]" />
              </button>

              <button
                type="button"
                onClick={() => handleDownloadICS(mainEvent)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-serif font-bold bg-[#FDF0EC] hover:bg-[#FBE4DD] text-[#C4715A] border border-[#E8D5CF] transition-all cursor-pointer shadow-xs"
              >
                <span>Apple / iCal (.ics)</span>
                <CalendarPlus className="w-3 h-3 text-[#C4715A]" />
              </button>
            </div>
          </div>

          {/* Tiện ích 2: Chỉ đường & Đặt xe Grab */}
          <div className="rounded-3xl p-6 bg-[#FFFDF9] border border-[#E8D5CF] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-[#4A6741]" />
                <h3 className="font-serif font-bold text-lg text-[#354D2E]">
                  Chỉ Đường &amp; Đón Tiếp Chu Đáo
                </h3>
              </div>
              <p className="text-xs text-[#8C6A58] font-serif leading-relaxed mb-4">
                Mở định vị chỉ đường chính xác tới sảnh tiệc cưới hoặc hỗ trợ gọi xe di chuyển thuận tiện nhất.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-3 border-t border-[#E8D5CF]/60">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${mainEvent.venue} ${mainEvent.address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-serif font-bold bg-[#F0F5EE] hover:bg-[#E4ECE1] text-[#354D2E] border border-[#A8BCA1]/50 transition-all cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#4A6741]" />
                <span>Google Maps</span>
              </a>

              <a
                href={`https://maps.apple.com/?q=${encodeURIComponent(`${mainEvent.venue} ${mainEvent.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-serif font-bold bg-[#FDF0EC] hover:bg-[#FBE4DD] text-[#C4715A] border border-[#E8D5CF] transition-all cursor-pointer shadow-xs"
              >
                <Car className="w-3.5 h-3.5 text-[#C4715A]" />
                <span>Apple Maps / Đi xe</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
