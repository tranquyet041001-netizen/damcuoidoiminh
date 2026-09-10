"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  VietnameseLotus,
  DongSonBorder,
  RedSealStamp,
  BotanicalBranch,
} from "@/components/ui/VietnamesePattern";

export const OpeningLetter: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const isRed = (weddingData.theme || "crimson-gold") === "crimson-gold";

  return (
    <section
      id="letter"
      className={`py-16 px-4 relative overflow-hidden ${
        isRed ? "bg-red-ivory-texture" : "bg-ivory-texture"
      }`}
    >
      <div className="max-w-xl mx-auto relative z-10">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-3">
            <VietnameseLotus size={38} color={isRed ? "#9F171B" : "#4A6741"} opacity={0.9} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4715A] font-sans font-semibold mb-1">
            Thiệp Hồng Báo Hỷ
          </p>
          <h2
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-wide ${
              isRed ? "text-[#9F171B]" : "text-[#354D2E]"
            }`}
          >
            {weddingData.openingLetter.title || "Lời Ngỏ Yêu Thương"}
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </div>
        </motion.div>

        {/* Khung thư chính phong cách giấy cao cấp */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-9 bg-[#FFFDF9] border border-[#E8D5CF] shadow-sm relative"
          style={{
            boxShadow: "0 10px 30px -5px rgba(74, 103, 65, 0.08)",
          }}
        >
          {/* Con dấu sáp đỏ */}
          <div className="absolute top-6 right-6 opacity-90 hidden sm:block">
            <RedSealStamp size={48} text="HỶ SỰ" />
          </div>

          {/* Hai gia đình */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 pb-6 border-b border-[#E8D5CF]/70">
            {/* Nhà Trai */}
            <div
              className={`text-center sm:text-left p-4 rounded-2xl border ${
                isRed
                  ? "bg-[#FEF2F2]/70 border-[#FCA5A5]/40"
                  : "bg-[#F0F5EE]/60 border-[#A8BCA1]/30"
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold block mb-1 ${
                  isRed ? "text-[#9F171B]" : "text-[#4A6741]"
                }`}
              >
                Họ Nhà Trai
              </span>
              <p className="text-xs sm:text-sm text-[#5C4033] font-serif leading-relaxed">
                {weddingData.groom.parents}
              </p>
              <div
                className={`font-calligraphy text-2xl mt-2 ${
                  isRed ? "text-[#9F171B]" : "text-[#354D2E]"
                }`}
              >
                CR. {weddingData.groom.fullName}
              </div>
            </div>

            {/* Nhà Gái */}
            <div className="text-center sm:text-right p-4 rounded-2xl bg-[#FDF0EC]/60 border border-[#E8D5CF]/60">
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#C4715A] block mb-1">
                Họ Nhà Gái
              </span>
              <p className="text-xs sm:text-sm text-[#5C4033] font-serif leading-relaxed">
                {weddingData.bride.parents}
              </p>
              <div className="font-calligraphy text-2xl text-[#C4715A] mt-2">
                CD. {weddingData.bride.fullName}
              </div>
            </div>
          </div>

          {/* Các đoạn văn lời ngỏ */}
          <div className="space-y-4 text-center sm:text-left">
            {weddingData.openingLetter.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm sm:text-base text-[#5C4033] font-serif leading-relaxed italic"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Lời kết & Chữ ký */}
          <div className="mt-8 pt-6 border-t border-[#E8D5CF]/70 text-right">
            <p className="text-xs text-[#8C6A58] uppercase tracking-wider font-sans mb-1">
              {weddingData.openingLetter.closing || "Trân trọng kính mời"}
            </p>
            <div
              className={`font-calligraphy text-2xl sm:text-3xl ${
                isRed ? "text-[#9F171B]" : "text-[#4A6741]"
              }`}
            >
              {weddingData.groom.shortName} &amp; {weddingData.bride.shortName}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
