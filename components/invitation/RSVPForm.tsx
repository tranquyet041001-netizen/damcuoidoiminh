"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Heart, User, Phone, Users, MessageSquare } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PaperCard } from "@/components/ui/PaperTexture";
import { useToast } from "@/components/ui/Toast";
import confetti from "canvas-confetti";

export const RSVPForm: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    guestOf: "both" as "groom" | "bride" | "both",
    attendance: "attending" as "attending" | "declined" | "undecided",
    guestCount: 1,
    dietaryOrNote: "",
  });

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  const validate = () => {
    const err: { fullName?: string; phone?: string } = {};
    if (!formData.fullName.trim()) {
      err.fullName = "Vui lòng nhập họ và tên của bạn";
    }
    if (!formData.phone.trim()) {
      err.phone = "Vui lòng nhập số điện thoại liên hệ";
    } else if (!/^[0-9+-\s.]{8,15}$/.test(formData.phone.trim())) {
      err.phone = "Số điện thoại không đúng định dạng";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        showToast("Xác nhận tham dự thành công!", "success");
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
            colors: ["#9E3D32", "#F4E8D2", "#183A3A"],
          });
        } catch {
          // ignore
        }
      } else {
        showToast(data.message || "Không thể gửi dữ liệu", "info");
      }
    } catch {
      showToast("Có lỗi kết nối, vui lòng thử lại sau", "info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          subtitle="Sự Hiện Diện Của Bạn"
          title="Xác Nhận Tham Dự"
          description="Để chúng mình chuẩn bị đón tiếp chu đáo nhất, xin vui lòng gửi phản hồi trước ngày 15 tháng 01 năm 2027."
          variant="lotus"
        />

        <PaperCard className="relative overflow-hidden">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3E8] border border-[#78928A] flex items-center justify-center text-[#9E3D32]">
                <Heart className="w-8 h-8 fill-current" />
              </div>

              <h3 className="font-serif text-2xl text-[#183A3A] font-semibold">
                Cảm Ơn Bạn Rất Nhiều!
              </h3>

              <p className="text-sm sm:text-base text-[#5A473E] max-w-md mx-auto leading-relaxed">
                Thông tin của bạn đã được ghi nhận. Sự hiện diện và lời chúc của bạn chính là niềm vinh hạnh to lớn của gia đình chúng mình.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs uppercase tracking-wider text-[#9E3D32] hover:underline font-medium"
                >
                  Gửi lại phản hồi khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Bạn là khách của ai */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-2">
                  Bạn Là Khách Của
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "both", label: "Cả Hai Bạn" },
                    { id: "groom", label: "Nhà Trai" },
                    { id: "bride", label: "Nhà Gái" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, guestOf: option.id as "groom" | "bride" | "both" })
                      }
                      className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-sm border transition-all text-center ${
                        formData.guestOf === option.id
                          ? "bg-[#183A3A] text-[#FFF9EE] border-[#183A3A]"
                          : "bg-[#FFF9EE] text-[#5A473E] border-[#E5D4B6] hover:bg-[#FAF3E8]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dự định tham dự */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-2">
                  Dự Định Tham Dự
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: "attending" })}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-sm border flex items-center justify-center gap-2 transition-all ${
                      formData.attendance === "attending"
                        ? "bg-[#9E3D32] text-[#FFF9EE] border-[#9E3D32]"
                        : "bg-[#FFF9EE] text-[#5A473E] border-[#E5D4B6] hover:bg-[#FAF3E8]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rất hân hạnh tham dự</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: "declined" })}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-sm border flex items-center justify-center gap-2 transition-all ${
                      formData.attendance === "declined"
                        ? "bg-[#78928A] text-[#FFF9EE] border-[#78928A]"
                        : "bg-[#FFF9EE] text-[#5A473E] border-[#E5D4B6] hover:bg-[#FAF3E8]"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Rất tiếc vắng mặt & Gửi lời chúc</span>
                  </button>
                </div>
              </div>

              {/* Họ tên */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1.5"
                >
                  Họ Và Tên <span className="text-[#9E3D32]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#78928A] absolute left-3 top-3" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF3E8] border rounded-sm text-sm text-[#183A3A] placeholder-[#8A7569] focus:outline-none focus:ring-1 focus:ring-[#183A3A] transition-all ${
                      errors.fullName ? "border-[#9E3D32]" : "border-[#E5D4B6]"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-[#9E3D32] mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Số điện thoại & Số người đi cùng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1.5"
                  >
                    Số Điện Thoại <span className="text-[#9E3D32]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#78928A] absolute left-3 top-3" />
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="0912 345 678"
                      className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF3E8] border rounded-sm text-sm text-[#183A3A] placeholder-[#8A7569] focus:outline-none focus:ring-1 focus:ring-[#183A3A] transition-all ${
                        errors.phone ? "border-[#9E3D32]" : "border-[#E5D4B6]"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-[#9E3D32] mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="guestCount"
                    className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1.5"
                  >
                    Số Khách Tham Dự
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#78928A] absolute left-3 top-3" />
                    <select
                      id="guestCount"
                      value={formData.guestCount}
                      disabled={formData.attendance === "declined"}
                      onChange={(e) =>
                        setFormData({ ...formData, guestCount: Number(e.target.value) })
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm text-[#183A3A] focus:outline-none focus:ring-1 focus:ring-[#183A3A] transition-all disabled:opacity-50"
                    >
                      <option value={1}>1 người (Mình tôi)</option>
                      <option value={2}>2 người (Cùng người thương)</option>
                      <option value={3}>3 người</option>
                      <option value={4}>4 người (Gia đình)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lời nhắn gửi riêng */}
              <div>
                <label
                  htmlFor="dietaryOrNote"
                  className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1.5"
                >
                  Lời Nhắn Cho Dâu Rể (Hoặc Ghi Chú Ăn Uống)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#78928A] absolute left-3 top-3" />
                  <textarea
                    id="dietaryOrNote"
                    rows={3}
                    value={formData.dietaryOrNote}
                    onChange={(e) =>
                      setFormData({ ...formData, dietaryOrNote: e.target.value })
                    }
                    placeholder="Ví dụ: Ăn chay, nhắn gửi lời chúc đặc biệt..."
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm text-[#183A3A] placeholder-[#8A7569] focus:outline-none focus:ring-1 focus:ring-[#183A3A] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Nút gửi form */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] font-serif text-base tracking-wide shadow-md hover:shadow-lg active:scale-98 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Đang gửi xác nhận...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#F4E8D2]" />
                      <span>Gửi Xác Nhận Tham Dự</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </PaperCard>
      </div>
    </section>
  );
};
