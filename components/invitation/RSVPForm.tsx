"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Heart, Users, Check, X, HelpCircle, Loader2 } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { useToast } from "@/components/ui/Toast";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

export const RSVPForm: React.FC = () => {
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

  // Đọc tên khách từ URL (?to= hoặc ?guest=)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("guest") || params.get("khach");
      if (to) {
        setFullName(decodeURIComponent(to).trim());
      }
    }
  }, []);

  // Nếu gia đình tắt mục RSVP
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
        showToast("Xác nhận tham dự thành công!", "success");
      } else {
        showToast(data.message || "Không thể gửi xác nhận", "info");
      }
    } catch {
      showToast("Có lỗi xảy ra, vui lòng thử lại sau", "info");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-16 px-4 bg-ivory-texture relative overflow-hidden">
      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <VietnameseLotus size={36} color="#4A6741" opacity={0.85} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4715A] font-sans font-semibold mb-1">
            {weddingData.rsvpSettings?.subtitle || "Xác Nhận Tham Dự"}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#354D2E] tracking-wide">
            {weddingData.rsvpSettings?.title || "Sự Hiện Diện Của Bạn"}
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={48} color="#C9A84C" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-sm mx-auto">
            {weddingData.rsvpSettings?.deadlineText || `Để gia đình đón tiếp chu đáo nhất, xin vui lòng phản hồi trước ngày ${weddingData.weddingDateFormatted}.`}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-9 bg-[#FFFDF9] border border-[#E8D5CF] shadow-xs relative"
          style={{
            boxShadow: "0 14px 36px -10px rgba(74, 103, 65, 0.09)",
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#F0F5EE] text-[#4A6741] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 text-[#4A6741]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#354D2E]">
                  Cảm Ơn Bạn Rất Nhiều!
                </h3>
                <p className="text-sm text-[#5C4033] font-serif italic max-w-sm mx-auto leading-relaxed">
                  Thông tin phản hồi của bạn đã được chuyển tới gia đình dâu rể. Hẹn gặp lại bạn trong ngày vui!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full text-xs font-serif font-semibold text-[#4A6741] bg-[#F0F5EE] hover:bg-[#E2EBDD] transition-colors"
                >
                  Gửi Phản Hồi Khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Bạn là khách của ai */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-2">
                    Bạn Là Khách Của Ai? <span className="text-[#C4715A]">*</span>
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
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                          guestOf === item.id
                            ? "border-[#4A6741] bg-[#F0F5EE] text-[#354D2E] shadow-xs"
                            : "border-[#E8D5CF] bg-[#FDFAF5] text-[#8C6A58] hover:border-[#A8BCA1]"
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
                  <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                    Họ Và Tên Của Bạn <span className="text-[#C4715A]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] transition-all font-sans"
                  />
                </div>

                {/* Điện thoại */}
                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                    Số Điện Thoại <span className="text-[#C4715A]">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] transition-all font-sans"
                  />
                </div>

                {/* Trạng thái tham dự */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-2">
                    Bạn Sẽ Tham Dự Chứ? <span className="text-[#C4715A]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "attending", label: "Có Tham Dự", icon: Check, color: "text-[#4A6741]" },
                      { id: "declined", label: "Rất Tiếc Vắng Mặt", icon: X, color: "text-[#C4715A]" },
                      { id: "undecided", label: "Chưa Rõ Lịch", icon: HelpCircle, color: "text-[#C9A84C]" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAttendance(item.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            attendance === item.id
                              ? "border-[#4A6741] bg-[#F0F5EE] text-[#354D2E]"
                              : "border-[#E8D5CF] bg-[#FDFAF5] text-[#8C6A58] hover:border-[#A8BCA1]"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-[11px] font-serif font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Số lượng người nếu tham dự */}
                {attendance === "attending" && weddingData.rsvpSettings?.allowGuestCount !== false && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                      Số Lượng Người Tham Dự
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Array.from({ length: weddingData.rsvpSettings?.maxGuests || 4 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestCount(num)}
                          className={`flex-1 min-w-[60px] py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                            guestCount === num
                              ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                              : "bg-[#FDFAF5] border border-[#E8D5CF] text-[#5C4033] hover:border-[#4A6741]"
                          }`}
                        >
                          {num} Người
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lời nhắn / Ăn uống */}
                {weddingData.rsvpSettings?.showNotesField !== false && (
                  <div>
                    <label htmlFor="dietary" className="block text-xs uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                      Lời Nhắn Hoặc Chế Độ Ăn Uống (nếu có)
                    </label>
                    <textarea
                      id="dietary"
                      rows={2}
                      value={dietaryOrNote}
                      onChange={(e) => setDietaryOrNote(e.target.value)}
                      placeholder="Ví dụ: Ăn chay, dị ứng hải sản, gửi lời chúc..."
                      className="w-full px-4 py-2 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] transition-all font-sans resize-none"
                    />
                  </div>
                )}

                {/* Nút gửi */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-serif font-semibold text-[#FDFAF5] transition-all shadow-md active:scale-98 disabled:opacity-70 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #C4715A 0%, #A4503B 100%)",
                    boxShadow: "0 8px 20px -4px rgba(196, 113, 90, 0.4)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang Gửi Phản Hồi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Phản Hồi Xác Nhận</span>
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
