"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { RedSealStamp } from "@/components/ui/VietnamesePattern";

export const ImperialCoupleStory: React.FC = () => {
  const { data: weddingData } = useWeddingData();

  if (!weddingData.story || weddingData.story.length === 0) {
    return null;
  }

  return (
    <section
      id="story"
      className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none"
      style={{ backgroundColor: "#120204" }}
    >
      {/* Nền gấm đỏ thẫm sơn son */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, #2A0508 0%, #170305 65%, #0D0203 100%)",
        }}
      />

      <div className="max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-10">
        {/* Header - Thư Họa Gấm Truyền Thống */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
              DUYÊN KHỞI TRĂM NĂM
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF8D6] tracking-wide">
            Thư Họa Chuyện Tình Yêu
          </h2>

          <div
            className="mx-auto mt-3 h-[1.5px] w-28 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #E5C368, transparent)" }}
          />

          <p className="text-xs sm:text-sm text-[#E8D5CF] italic font-serif max-w-md mx-auto mt-3 leading-relaxed">
            &ldquo;Hữu duyên thiên lý năng tương ngộ &bull; Từng dấu mốc ghi khắc hẹn ước sắc son một đời&rdquo;
          </p>
        </motion.div>

        {/* Trục Cuộn Thời Gian Chỉ Vàng Hoàng Kim */}
        <div className="relative pl-7 sm:pl-10 space-y-8 sm:space-y-10">
          {/* Sợi chỉ tơ vàng dọc trục thời gian */}
          <div
            className="absolute left-[14px] sm:left-[20px] top-4 bottom-4 w-[2px] -translate-x-1/2 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #E5C368 0%, #BA1B22 50%, #E5C368 100%)",
              boxShadow: "0 0 8px rgba(229,195,104,0.4)",
            }}
          />

          {weddingData.story.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Nút Thắt Gấm Cát Tường trên trục */}
              <div className="absolute -left-7 sm:-left-10 top-5 w-7 sm:w-10 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15, type: "spring", stiffness: 300 }}
                  className="w-5 h-5 rounded-full bg-[#3B090D] border-2 border-[#E5C368] flex items-center justify-center shadow-[0_0_10px_rgba(229,195,104,0.6)]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FDE68A] animate-ping" />
                </motion.div>
              </div>

              {/* Thẻ Thư Họa Giai Kỳ */}
              <div
                className="rounded-3xl p-5 sm:p-7 border border-[#E5C368]/60 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FDE68A] hover:shadow-[0_20px_45px_-10px_rgba(229,195,104,0.25)] relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #240507 0%, #1A0406 60%, #100203 100%)",
                }}
              >
                {/* Viền hoa văn chỉ vàng nội thất */}
                <div className="absolute inset-2 rounded-2xl border border-dashed border-[#FDE68A]/25 pointer-events-none" />

                {/* Dấu triện chu sa góc phải */}
                <div className="absolute top-4 right-4 opacity-70 pointer-events-none">
                  <RedSealStamp text="HỶ" size={32} />
                </div>

                <div className="flex items-center gap-3 mb-3 pr-10">
                  <span className="px-3.5 py-1 rounded-full bg-[#3D0A0E] border border-[#E5C368] text-[#FDE68A] text-[11px] sm:text-xs font-serif font-bold tracking-wider shadow-xs">
                    {milestone.yearOrDate}
                  </span>

                  {milestone.location && (
                    <span className="flex items-center gap-1 text-[11px] sm:text-xs text-[#E5C368] font-serif">
                      <MapPin className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>{milestone.location}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FFF8D6] mb-3">
                  {milestone.title}
                </h3>

                {milestone.imageUrl && (
                  <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-4 border border-[#E5C368]/40 shadow-inner">
                    <Image
                      src={milestone.imageUrl}
                      alt={milestone.title}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140204]/70 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#E8D5CF] font-serif leading-relaxed italic">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
