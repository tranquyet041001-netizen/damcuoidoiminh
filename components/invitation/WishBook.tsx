"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Sparkles, Feather } from "lucide-react";
import { WishSubmission } from "@/types/wedding";
import { useToast } from "@/components/ui/Toast";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

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
        setWishes([data.data, ...wishes]);
        setName("");
        setRelationship("");
        setContent("");
        setSubmitted(true);
        showToast("Cảm ơn lời chúc tốt lành của bạn!", "success");
        setTimeout(() => setSubmitted(false), 3000);
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
    <section id="wishes" className="py-16 px-4 bg-peach-texture relative overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10">
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
            Gửi Trọn Yêu Thương
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#354D2E] tracking-wide">
            Sổ Lưu Bút
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-sm mx-auto">
            Những dòng nhắn gửi chân thành là món quà tinh thần quý báu nhất của chúng mình.
          </p>
        </motion.div>

        {/* Form viết lời chúc */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-8 bg-[#FFFDF9] border border-[#E8D5CF] shadow-xs mb-8"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8D5CF]/60 text-[#4A6741]">
            <Feather className="w-4 h-4 text-[#C4715A]" />
            <span className="text-xs uppercase tracking-wider font-sans font-bold text-[#354D2E]">
              Gửi Lời Chúc Phúc Cho Dâu Rể
            </span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-2"
              >
                <Heart className="w-8 h-8 text-[#C4715A] fill-[#C4715A] mx-auto animate-heartbeat" />
                <p className="font-serif text-lg font-bold text-[#354D2E]">Cảm Ơn Bạn Rất Nhiều!</p>
                <p className="text-xs text-[#8C6A58] font-serif italic">Lời chúc đã được lưu lại trong trang sổ.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="wishName" className="block text-[11px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                      Tên Của Bạn <span className="text-[#C4715A]">*</span>
                    </label>
                    <input
                      id="wishName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Thuỳ Trang"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-base sm:text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] font-sans"
                    />
                  </div>
                  <div>
                    <label htmlFor="wishRel" className="block text-[11px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                      Mối Quan Hệ
                    </label>
                    <input
                      id="wishRel"
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="Bạn cấp 3, Đồng nghiệp..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-base sm:text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="wishContent" className="block text-[11px] uppercase tracking-wider text-[#8C6A58] font-sans font-bold mb-1">
                    Lời Chúc Cho Đôi Bạn Trẻ <span className="text-[#C4715A]">*</span>
                  </label>
                  <textarea
                    id="wishContent"
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF] text-base sm:text-sm text-[#354D2E] placeholder-[#8C6A58]/60 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-serif font-semibold text-[#FDFAF5] transition-all shadow-sm active:scale-98 disabled:opacity-70 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4A6741 0%, #354D2E 100%)",
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Đang gửi..." : "Gửi Lời Chúc Mừng"}</span>
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Danh sách lời chúc - Chỉ hiển thị khi có khách gửi lời chúc thực tế */}
        {wishes.length > 0 && (
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-wider font-sans font-bold text-[#354D2E]">
                Lời Chúc Đã Gửi ({wishes.length})
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            </div>

            {wishes.map((item, idx) => {
              const theme = WISH_CARD_THEMES[idx % WISH_CARD_THEMES.length];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 sm:p-5 border shadow-2xs relative"
                  style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FDFAF5] border border-[#E8D5CF] flex items-center justify-center text-xs font-serif font-bold text-[#354D2E]">
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
                    <Heart className="w-3.5 h-3.5 text-[#C4715A]/60" />
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C4033] font-serif leading-relaxed italic pl-9">
                    &ldquo;{item.content}&rdquo;
                  </p>

                  <div className="text-[10px] text-[#8C6A58] text-right mt-2 font-sans">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
