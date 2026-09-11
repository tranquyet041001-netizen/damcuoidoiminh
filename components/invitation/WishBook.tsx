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
    <section
      id="wishes"
      className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none"
      style={{ backgroundColor: "#0C0204" }}
    >
      {/* Nền dạ yến chúc phúc */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, #250507 0%, #120204 60%, #080102 100%)",
        }}
      />

      <div className="max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-10">
        {/* Header Mục Sổ Lưu Bút Hỷ Sự */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
              GỬI TRỌN TÂM TÌNH
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF8D6] tracking-wide">
            Bầu Trời Hoa Đăng Chúc Phúc
          </h2>

          <div
            className="mx-auto mt-3 h-[1.5px] w-28 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #E5C368, transparent)" }}
          />

          <p className="text-xs sm:text-sm text-[#E8D5CF] italic font-serif max-w-md mx-auto mt-3 leading-relaxed">
            Mỗi lời chúc phúc chân thành sẽ thắp sáng một ngọn đèn hoa đăng lung linh bay vút lên bầu trời đêm chúc phúc cho đôi tân nhân.
          </p>

          {/* Thanh chuyển đổi chế độ xem: Bầu trời 3D / Danh sách */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#1C0406] border border-[#E5C368]/50 shadow-inner mt-5">
            <button
              type="button"
              onClick={() => setViewMode("sky")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                viewMode === "sky"
                  ? "bg-[#E5C368] text-[#140204] shadow-[0_0_10px_rgba(229,195,104,0.5)]"
                  : "text-[#E8D5CF] hover:text-[#FFF8D6]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#BA1B22]" />
              <span>Bầu Trời Hoa Đăng (3D)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#E5C368] text-[#140204] shadow-[0_0_10px_rgba(229,195,104,0.5)]"
                  : "text-[#E8D5CF] hover:text-[#FFF8D6]"
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
                  <div className="p-8 text-center rounded-3xl bg-[#1C0406] border border-[#E5C368]/40 text-[#E8D5CF] italic font-serif text-sm">
                    Chưa có lời chúc nào. Hãy là người đầu tiên thắp sáng ngọn đèn hoa đăng chúc phúc nhé!
                  </div>
                ) : (
                  wishes.map((item, idx) => {
                    return (
                      <div
                        key={item.id || idx}
                        className="rounded-2xl p-4 sm:p-5 border border-[#E5C368]/50 shadow-md relative"
                        style={{ backgroundColor: "#1C0406" }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#3D0A0E] border border-[#E5C368] flex items-center justify-center text-xs font-serif font-bold text-[#FDE68A]">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-serif font-bold text-sm text-[#FFF8D6]">
                                {item.name}
                              </span>
                              {item.relationship && (
                                <span className="text-[10px] text-[#E5C368] ml-2 font-serif">
                                  • {item.relationship}
                                </span>
                              )}
                            </div>
                          </div>
                          <Heart className="w-4 h-4 text-[#BA1B22]" fill="#BA1B22" />
                        </div>

                        <p className="text-xs sm:text-sm text-[#E8D5CF] font-serif leading-relaxed italic pl-10">
                          &ldquo;{item.content}&rdquo;
                        </p>

                        <div className="text-[10px] text-[#E5C368]/70 text-right mt-2 font-sans">
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
          className="rounded-3xl p-6 sm:p-8 border-2 border-[#E5C368]/80 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(229,195,104,0.18)] relative overflow-hidden"
          style={{
            background: "linear-gradient(155deg, #240507 0%, #180305 60%, #100203 100%)",
          }}
        >
          {/* Viền hoa văn chỉ vàng nội thất */}
          <div className="absolute inset-2 rounded-2xl border border-dashed border-[#FDE68A]/25 pointer-events-none" />

          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5C368]/40 text-[#FDE68A] relative z-10">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FDE68A]" />
              <span className="text-xs sm:text-sm uppercase tracking-wider font-serif font-bold text-[#FFF8D6]">
                Thắp Sáng Đèn Hoa Đăng Chúc Phúc
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-[#FDE68A]" />
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-2 relative z-10"
              >
                <div className="w-14 h-14 rounded-full bg-[#3D0A0E] border-2 border-[#E5C368] flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(229,195,104,0.5)]">
                  <Flame className="w-7 h-7 text-[#FDE68A] animate-bounce" />
                </div>
                <p className="font-serif text-lg font-bold text-[#FFF8D6]">
                  Hoa Đăng Đã Được Thả Lên Trời!
                </p>
                <p className="text-xs text-[#E8D5CF] font-serif italic">
                  Chân thành cảm ơn tấm lòng và lời chúc phúc quý báu của quý khách.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="wishName"
                      className="block text-[11px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1"
                    >
                      Quý Danh Của Bạn <span className="text-[#FF6B6B]">*</span>
                    </label>
                    <input
                      id="wishName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Bác Tuấn &amp; Gia đình"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#140204] border border-[#E5C368]/50 text-base sm:text-sm text-[#FFF8D6] placeholder-[#E8D5CF]/40 focus:outline-none focus:ring-2 focus:ring-[#E5C368]/30 focus:border-[#FDE68A] font-sans"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wishRel"
                      className="block text-[11px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1"
                    >
                      Mối Quan Hệ Với Dâu Rể
                    </label>
                    <input
                      id="wishRel"
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="Bạn thân, Đồng nghiệp, Người thân..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#140204] border border-[#E5C368]/50 text-base sm:text-sm text-[#FFF8D6] placeholder-[#E8D5CF]/40 focus:outline-none focus:ring-2 focus:ring-[#E5C368]/30 focus:border-[#FDE68A] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="wishContent"
                    className="block text-[11px] uppercase tracking-wider text-[#FDE68A] font-serif font-bold mb-1"
                  >
                    Lời Chúc Phúc Trăm Năm <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <textarea
                    id="wishContent"
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Kính chúc đôi uyên ương trăm năm hoà hợp, răng long đầu bạc, vạn sự như ý..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#140204] border border-[#E5C368]/50 text-base sm:text-sm text-[#FFF8D6] placeholder-[#E8D5CF]/40 focus:outline-none focus:ring-2 focus:ring-[#E5C368]/30 focus:border-[#FDE68A] font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs sm:text-sm font-serif font-bold text-[#FFF8D6] transition-all shadow-[0_10px_25px_rgba(186,27,34,0.5)] active:scale-98 disabled:opacity-70 cursor-pointer border border-[#FDE68A]"
                  style={{
                    background: "linear-gradient(135deg, #BA1B22 0%, #830B0F 100%)",
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
