"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Sparkles, Feather, Flame, ListFilter } from "lucide-react";
import { WishSubmission } from "@/types/wedding";
import { useToast } from "@/components/ui/Toast";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";
import { WishLanternSky } from "./WishLanternSky";

const WISH_CARD_THEMES = [
  { bg: "#FDFAF5", border: "#E8D5CF", tagBg: "#FDF0EC", tagText: "#C4715A" },
  { bg: "#F0F5EE", border: "#C8D9C5", tagBg: "#E2EBDD", tagText: "#4A6741" },
  { bg: "#FFFDF9", border: "#E2C97A", tagBg: "#FDF9EB", tagText: "#C9A84C" },
];

export const WishBook: React.FC = () => {
  const { showToast } = useToast();
  const [wishes, setWishes] = useState<WishSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<"sky" | "list">("sky");
  const [newlyAddedWish, setNewlyAddedWish] = useState<WishSubmission | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) setWishes(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      showToast("Vui lòng nhập tên và lời chúc của bạn", "info");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, relationship, content }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newWish = data.data;
        setWishes([newWish, ...wishes]);
        setNewlyAddedWish(newWish);
        setName("");
        setRelationship("");
        setContent("");
        setSubmitted(true);
        showToast("Đã thả ngọn đèn hoa đăng chúc phúc lên bầu trời! ✨", "success");
        setTimeout(() => {
          setSubmitted(false);
          setNewlyAddedWish(null);
        }, 4000);
      } else {
        showToast(data.message || "Không thể gửi lời chúc", "info");
      }
    } catch {
      showToast("Có lỗi xảy ra, vui lòng thử lại sau", "info");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-16 sm:py-20 px-3 sm:px-6 bg-peach-texture relative overflow-hidden">
      <div className="max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-10">
        {/* Header Mục Sổ Lưu Bút */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <VietnameseLotus size={36} color="#4A6741" opacity={0.85} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4715A] font-sans font-semibold mb-1">
            Gửi Trọn Yêu Thương
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide">
            Sổ Lưu Bút &amp; Bầu Trời Hoa Đăng
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto leading-relaxed">
            Mỗi lời chúc chân thành sẽ hóa thành một ngọn đèn hoa đăng rực sáng bay lơ lửng trên bầu trời đêm chúc phúc cho đôi bạn trẻ.
          </p>

          {/* Thanh chuyển đổi chế độ xem: Bầu trời 3D / Danh sách */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#F0F5EE] border border-[#A8BCA1]/50 shadow-xs mt-5">
            <button
              type="button"
              onClick={() => setViewMode("sky")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                viewMode === "sky"
                  ? "bg-[#354D2E] text-[#FDFAF5] shadow-xs"
                  : "text-[#5C4033] hover:text-[#354D2E]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>Bầu Trời Hoa Đăng (3D)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#354D2E] text-[#FDFAF5] shadow-xs"
                  : "text-[#5C4033] hover:text-[#354D2E]"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Danh Sách Lời Chúc ({wishes.length})</span>
            </button>
          </div>
        </motion.div>

        {/* ── HIỂN THỊ THEO CHẾ ĐỘ ── */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            {viewMode === "sky" ? (
              <motion.div
                key="sky-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
              >
                <WishLanternSky wishes={wishes} newlyAddedWish={newlyAddedWish} />
              </motion.div>
            ) : (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 max-h-[500px] overflow-y-auto pr-1"
              >
                {wishes.length === 0 ? (
                  <div className="p-8 text-center rounded-3xl bg-white/60 border border-[#E8D5CF] text-[#8C6A58] italic font-serif text-sm">
                    Chưa có lời chúc nào. Hãy là người đầu tiên thắp sáng ngọn đèn hoa đăng chúc phúc nhé!
                  </div>
                ) : (
                  wishes.map((item, idx) => {
                    const theme = WISH_CARD_THEMES[idx % WISH_CARD_THEMES.length];
                    return (
                      <div
                        key={item.id || idx}
                        className="rounded-2xl p-4 sm:p-5 border shadow-2xs relative"
                        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#FDFAF5] border border-[#E8D5CF] flex items-center justify-center text-xs font-serif font-bold text-[#354D2E]">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-serif font-bold text-sm text-[#354D2E]">
                                {item.name}
                              </span>
                              {item.relationship && (
                                <span className="text-[10px] text-[#8C6A58] ml-2 font-sans">
                                  • {item.relationship}
                                </span>
                              )}
                            </div>
                          </div>
                          <Heart className="w-4 h-4 text-[#C4715A]/60" />
                        </div>

                        <p className="text-xs sm:text-sm text-[#5C4033] font-serif leading-relaxed italic pl-10">
                          &ldquo;{item.content}&rdquo;
                        </p>

                        <div className="text-[10px] text-[#8C6A58] text-right mt-2 font-sans">
                          {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FORM THẢ ĐÈN ƯỚC NGUYỆN / GỬI LỜI CHÚC PHÚC ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-8 bg-[#FFFDF9] border border-[#E8D5CF] shadow-lg"
        >
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E8D5CF]/60 text-[#4A6741]">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#EA580C]" />
              <span className="text-xs sm:text-sm uppercase tracking-wider font-sans font-bold text-[#354D2E]">
                Thả Ngọn Đèn Hoa Đăng Chúc Phúc
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#FDF0EC] border border-[#E8D5CF] flex items-center justify-center mx-auto shadow-md">
                  <Flame className="w-6 h-6 text-[#EA580C] animate-bounce" />
                </div>
                <p className="font-serif text-lg font-bold text-[#354D2E]">
                  Đèn Hoa Đăng Đã Được Thả Lên Trời!
                </p>
                <p className="text-xs text-[#8C6A58] font-serif italic">
                  Cảm ơn tấm lòng tốt lành và lời chúc quý báu của bạn.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="wishName"
                      className="block text-[11px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1"
                    >
                      Tên Của Bạn <span className="text-[#C4715A]">*</span>
                    </label>
                    <input
                      id="wishName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Bác Tuấn &amp; Gia đình"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-base sm:text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] font-sans"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wishRel"
                      className="block text-[11px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1"
                    >
                      Mối Quan Hệ
                    </label>
                    <input
                      id="wishRel"
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="Bạn cấp 3, Đồng nghiệp, Người thân..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-base sm:text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="wishContent"
                    className="block text-[11px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1"
                  >
                    Nội Dung Lời Chúc Phúc <span className="text-[#C4715A]">*</span>
                  </label>
                  <textarea
                    id="wishContent"
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long, mãi mãi mặn nồng..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-base sm:text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs sm:text-sm font-serif font-bold text-[#FDFAF5] transition-all shadow-md active:scale-98 disabled:opacity-70 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #C4715A 0%, #8C1217 100%)",
                    boxShadow: "0 6px 20px -3px rgba(140, 18, 23, 0.4)",
                  }}
                >
                  <Flame className="w-4 h-4 text-[#FDE68A]" />
                  <span>{submitting ? "Đang thắp đèn..." : "Thắp Sáng & Thả Đèn Hoa Đăng"}</span>
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
