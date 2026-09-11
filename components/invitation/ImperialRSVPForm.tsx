"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, Check, X, HelpCircle, Loader2 } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";
import { getGuestNameFromUrl } from "@/utils/guest";

export const ImperialRSVPForm: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestOf, setGuestOf] = useState<"groom" | "bride" | "both">("both");
  const [attendance, setAttendance] = useState<"attending" | "declined" | "undecided">("attending");
  const [guestCount, setGuestCount] = useState(1);
  const [dietaryOrNote, setDietaryOrNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Đọc tên khách từ URL (?to=, ?guest=, ?khach=)
  useEffect(() => {
    const name = getGuestNameFromUrl();
    if (name) {
      setFullName(name);
    }
  }, []);

  if (weddingData.rsvpSettings?.enabled === false) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast("Vui lòng nhập họ tên và số điện thoại", "info");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          guestOf,
          attendance,
          guestCount: attendance === "attending" ? guestCount : 0,
          dietaryOrNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        showToast("Kính báo hồi đáp thành công!", "success");
      } else {
        showToast(data.message || "Không thể gửi xác nhận", "info");
      }
    } catch {
      showToast("Có lỗi xảy ra, xin vui lòng thử lại sau", "info");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none"
      style={{ backgroundColor: "#110204" }}
    >
      {/* Nền gấm đỏ thẫm sơn son */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, #2A0508 0%, #150305 60%, #0A0102 100%)",
        }}
      />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header - Tráp Hỷ Hồi Đáp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
              {weddingData.rsvpSettings?.subtitle || "HỶ BÁO TƯƠNG TRI"}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF8D6] tracking-wide">
            {weddingData.rsvpSettings?.title || "Kính Báo Tham Dự Hôn Lễ"}
          </h2>

          <div
            className="mx-auto mt-3 h-[1.5px] w-28 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #E5C368, transparent)" }}
          />

          <p className="text-xs sm:text-sm text-[#E8D5CF] italic font-serif max-w-sm mx-auto mt-3 leading-relaxed">
            {weddingData.rsvpSettings?.deadlineText ||
              `Để gia đình chuẩn bị hoa đường đón tiếp chu đáo nhất, kính mong quý khách hồi đáp trước ngày ${weddingData.weddingDateFormatted}.`}
          </p>
        </motion.div>

        {/* Tráp Thư Đại Hỷ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-9 border-2 border-[#E5C368]/80 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(229,195,104,0.18)] relative overflow-hidden"
          style={{
            background: "linear-gradient(155deg, #260507 0%, #190305 60%, #100203 100%)",
          }}
        >
          {/* Viền hoa văn chỉ vàng nội thất */}
          <div className="absolute inset-2 rounded-2xl border border-dashed border-[#FDE68A]/25 pointer-events-none" />

          {/* Dấu triện Chu Sa */}
          <div className="absolute top-4 right-4 opacity-50 pointer-events-none hidden sm:block">
            <RedSealStamp text="KÍNH" size={32} />
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#3D0A0E] border-2 border-[#E5C368] text-[#FDE68A] flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(229,195,104,0.5)]">
                  <CheckCircle2 className="w-9 h-9 text-[#FDE68A]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#FFF8D6]">
                  Chân Thành Cảm Tạ Quý Khách!
                </h3>
                <p className="text-sm text-[#E8D5CF] font-serif italic max-w-sm mx-auto leading-relaxed">
                  Thông tin xác nhận của quý vị đã được lưu vào sổ hỷ sự. Hai bên gia đình rất hân hạnh được đón tiếp quý khách tại hôn lễ!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full text-xs font-serif font-bold text-[#FFF8D6] bg-[#3D0A0E] border border-[#E5C368] hover:bg-[#520E13] transition-all cursor-pointer shadow-md"
                >
                  Gửi Phản Hồi Khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Bạn là khách của ai */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-2">
                    Quý Khách Là Thân Hữu Của <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "groom", label: "Nhà Trai", emoji: "🤵" },
                      { id: "bride", label: "Nhà Gái", emoji: "👰" },
                      { id: "both", label: "Cả Hai", emoji: "💑" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGuestOf(item.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          guestOf === item.id
                            ? "border-[#FDE68A] bg-[#3E0A0E] text-[#FFF8D6] shadow-[0_0_12px_rgba(229,195,104,0.4)]"
                            : "border-[#E5C368]/40 bg-[#1A0305] text-[#E8D5CF] hover:border-[#E5C368]"
                        }`}
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-xs font-serif font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Họ tên */}
                <div>
                  <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1">
                    Quý Danh / Họ Và Tên <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A0305] border border-[#E5C368]/50 text-base sm:text-sm text-[#FFF8D6] placeholder-[#E8D5CF]/40 focus:outline-none focus:ring-2 focus:ring-[#E5C368]/30 focus:border-[#FDE68A] transition-all font-sans"
                  />
                </div>

                {/* Điện thoại */}
                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1">
                    Số Điện Thoại Liên Lạc <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A0305] border border-[#E5C368]/50 text-base sm:text-sm text-[#FFF8D6] placeholder-[#E8D5CF]/40 focus:outline-none focus:ring-2 focus:ring-[#E5C368]/30 focus:border-[#FDE68A] transition-all font-sans"
                  />
                </div>

                {/* Trạng thái tham dự */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-2">
                    Quý Khách Sẽ Đến Chung Vui? <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "attending", label: "Có Tham Dự", icon: Check, color: "text-[#68D391]" },
                      { id: "declined", label: "Kính Chúc Phúc Từ Xa", icon: X, color: "text-[#FC8181]" },
                      { id: "undecided", label: "Chưa Rõ Lịch", icon: HelpCircle, color: "text-[#FDE68A]" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAttendance(item.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            attendance === item.id
                              ? "border-[#FDE68A] bg-[#3E0A0E] text-[#FFF8D6] shadow-[0_0_12px_rgba(229,195,104,0.4)]"
                              : "border-[#E5C368]/40 bg-[#1A0305] text-[#E8D5CF] hover:border-[#E5C368]"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-[11px] font-serif font-medium leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Số lượng người nếu tham dự */}
                {attendance === "attending" && weddingData.rsvpSettings?.allowGuestCount !== false && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1">
                      Số Lượng Khách Cùng Đi
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Array.from({ length: weddingData.rsvpSettings?.maxGuests || 4 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestCount(num)}
                          className={`flex-1 min-w-[60px] py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                            guestCount === num
                              ? "bg-[#E5C368] text-[#1A0305] font-bold shadow-[0_0_10px_rgba(229,195,104,0.6)]"
                              : "bg-[#1A0305] border border-[#E5C368]/50 text-[#FFF8D6] hover:border-[#FDE68A]"
                          }`}
                        >
                          {num} Người
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lời nhắn / Ghi chú */}
                {weddingData.rsvpSettings?.showNotesField !== false && (
                  <div>
                    <label htmlFor="dietary" className="block text-xs uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1">
                      Lời Nhắn Gửi Tới Gia Đình
                    </label>
                    <textarea
                      id="dietary"
                      rows={2}
                      value={dietaryOrNote}
                      onChange={(e) => setDietaryOrNote(e.target.value)}
                      placeholder="Ví dụ: Ăn chay, chúc mừng hạnh phúc đôi uyên ương..."
                      className="w-full px-4 py-2 rounded-xl bg-[#1A0305] border border-[#E5C368]/50 text-base sm:text-sm text-[#FFF8D6] placeholder-[#E8D5CF]/40 focus:outline-none focus:ring-2 focus:ring-[#E5C368]/30 focus:border-[#FDE68A] transition-all font-sans resize-none"
                    />
                  </div>
                )}

                {/* Nút gửi sơn son thiếp vàng */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-serif font-bold text-[#FFF8D6] transition-all shadow-[0_10px_25px_rgba(186,27,34,0.5)] active:scale-98 disabled:opacity-70 cursor-pointer border border-[#FDE68A]"
                  style={{
                    background: "linear-gradient(135deg, #BA1B22 0%, #830B0F 100%)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FDE68A]" />
                      <span>Đang Gửi Hồi Đáp...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#FDE68A]" />
                      <span>Kính Báo Tham Dự Hôn Lễ</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
