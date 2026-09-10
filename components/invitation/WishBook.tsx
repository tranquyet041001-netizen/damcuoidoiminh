"use client";

import React, { useState, useEffect } from "react";
import { Send, Heart, MessageCircle } from "lucide-react";
import { WishSubmission } from "@/types/wedding";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PaperCard } from "@/components/ui/PaperTexture";
import { useToast } from "@/components/ui/Toast";

export const WishBook: React.FC = () => {
  const { showToast } = useToast();
  const [wishes, setWishes] = useState<WishSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [content, setContent] = useState("");

  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/wishes");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setWishes(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      showToast("Vui lòng điền tên và lời chúc của bạn", "info");
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
        showToast("Cảm ơn lời chúc tốt lành của bạn!", "success");
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
    <section id="wishes" className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          subtitle="Gửi Trọn Yêu Thương"
          title="Sổ Lưu Bút"
          description="Những dòng tâm tình và lời chúc phúc chân tình là món quà vô giá gửi tới hai đứa mình."
          variant="lotus"
        />

        {/* Form gửi lời chúc */}
        <PaperCard className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="wishName"
                  className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1"
                >
                  Tên Của Bạn <span className="text-[#9E3D32]">*</span>
                </label>
                <input
                  id="wishName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Yến"
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm text-[#183A3A] placeholder-[#8A7569] focus:outline-none focus:ring-1 focus:ring-[#183A3A]"
                />
              </div>

              <div>
                <label
                  htmlFor="wishRel"
                  className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1"
                >
                  Mối Quan Hệ
                </label>
                <input
                  id="wishRel"
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="Ví dụ: Bạn đại học, Đồng nghiệp..."
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm text-[#183A3A] placeholder-[#8A7569] focus:outline-none focus:ring-1 focus:ring-[#183A3A]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="wishContent"
                className="block text-xs uppercase tracking-wider text-[#6B5549] font-semibold mb-1"
              >
                Lời Chúc Cho Dâu Rể <span className="text-[#9E3D32]">*</span>
              </label>
              <textarea
                id="wishContent"
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết lời chúc mừng hạnh phúc..."
                className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm text-[#183A3A] placeholder-[#8A7569] focus:outline-none focus:ring-1 focus:ring-[#183A3A] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#9E3D32] hover:bg-[#BD4B3F] text-[#FFF9EE] font-serif text-sm tracking-wide shadow-xs active:scale-95 transition-all disabled:opacity-70"
            >
              {submitting ? (
                <span>Đang gửi lời chúc...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Lời Chúc Mừng</span>
                </>
              )}
            </button>
          </form>
        </PaperCard>

        {/* Danh sách lời chúc */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-6 text-sm text-[#8A7569]">
              Đang mở sổ lưu bút...
            </div>
          ) : wishes.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#8A7569] bg-[#FFF9EE] border border-[#EADBCE] rounded-sm p-4">
              Hãy là người đầu tiên để lại lời chúc phúc cho dâu rể!
            </div>
          ) : (
            wishes.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFF9EE] border border-[#E5D4B6] rounded-sm p-4 sm:p-5 shadow-xs transition-all hover:border-[#78928A]/50"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FAF3E8] text-[#9E3D32] border border-[#E5D4B6] flex items-center justify-center text-xs font-serif font-bold">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-serif font-semibold text-sm text-[#183A3A]">
                        {item.name}
                      </span>
                      {item.relationship && (
                        <span className="text-[11px] text-[#78928A] ml-2 font-normal">
                          • {item.relationship}
                        </span>
                      )}
                    </div>
                  </div>
                  <Heart className="w-4 h-4 text-[#9E3D32]/40" />
                </div>

                <p className="text-sm text-[#5A473E] leading-relaxed italic pl-10">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="text-[10px] text-[#8A7569] text-right mt-2">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
