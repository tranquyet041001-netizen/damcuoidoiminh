"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  VietnameseLotus,
  DongSonBorder,
  RedSealStamp,
  BotanicalBranch,
} from "@/components/ui/VietnamesePattern";

interface OpeningLetterProps {
  showGuestGreeting?: boolean;
  isTopSection?: boolean;
}

export const OpeningLetter: React.FC<OpeningLetterProps> = ({
  showGuestGreeting = false,
  isTopSection = false,
}) => {
  const { data: weddingData } = useWeddingData();
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("guest") || params.get("khach");
      if (to) {
        setGuestName(decodeURIComponent(to).trim());
      }
    }
  }, []);

  return (
    <section
      id="letter"
      className={`${
        isTopSection ? "pt-24 sm:pt-28 pb-16 sm:pb-20" : "py-16 sm:py-20"
      } px-4 bg-ivory-texture relative overflow-hidden`}
    >
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto relative z-10">
        {/* Header section — stagger reveal từng dòng */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="text-center mb-8 sm:mb-10"
        >
          {/* Badge kính mời đích danh khi dùng video mở đầu */}
          {showGuestGreeting && guestName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#FDF0EC] border border-[#E8D5CF] shadow-xs mb-5"
            >
              <span className="text-[11px] uppercase tracking-widest text-[#8C6A58] font-sans font-bold">
                Kính mời:
              </span>
              <span className="font-calligraphy text-2xl text-[#C4715A] font-bold">
                {guestName}
              </span>
            </motion.div>
          )}

          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="inline-flex items-center justify-center mb-3"
          >
            <VietnameseLotus size={38} color="#4A6741" opacity={0.9} />
          </motion.div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#C4715A] font-sans font-semibold mb-1"
          >
            Thiệp Hồng Báo Hỷ
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide"
          >
            {weddingData.openingLetter.title || "Lời Ngỏ Yêu Thương"}
          </motion.h2>
          {/* Animated gold underline */}
          <motion.div
            variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, delay: 0.1 } } }}
            className="mx-auto mt-2 mb-3 h-[1.5px] w-20 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}
          />
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
            className="flex items-center justify-center my-3"
          >
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </motion.div>
        </motion.div>

        {/* Khung thư chính phong cách giấy cao cấp */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-10 md:p-12 bg-[#FFFDF9] border border-[#E8D5CF] shadow-sm relative"
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
            <div className="text-center sm:text-left p-4 rounded-2xl bg-[#F0F5EE]/60 border border-[#A8BCA1]/30">
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#4A6741] block mb-1">
                Họ Nhà Trai
              </span>
              <p className="text-xs sm:text-sm text-[#5C4033] font-serif leading-relaxed">
                {weddingData.groom.parents}
              </p>
              <div className="font-calligraphy text-2xl text-[#354D2E] mt-2">
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
            <div className="font-calligraphy text-2xl sm:text-3xl text-[#4A6741]">
              {weddingData.groom.shortName} &amp; {weddingData.bride.shortName}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
