"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

export const CoupleStory: React.FC = () => {
  const { data: weddingData } = useWeddingData();

  return (
    <section id="story" className="py-16 sm:py-20 px-4 bg-sage-texture relative overflow-hidden">
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-[#C4715A] fill-[#C4715A]/15 animate-heartbeat" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#4A6741] font-sans font-semibold mb-1">
            Hành Trình Yêu Thương
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide">
            Câu Chuyện Chúng Mình
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={48} color="#C4715A" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto leading-relaxed">
            Từng khoảnh khắc, từng kỷ niệm đơm hoa kết trái thành một bến đỗ bình yên.
          </p>
        </motion.div>

        {/* Timeline List với trục căn chuẩn tuyệt đối */}
        <div className="relative pl-7 sm:pl-9 space-y-8">
          {/* Đường chỉ dọc xuyên suốt */}
          <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#4A6741]/40 via-[#C4715A]/40 to-[#C9A84C]/40 pointer-events-none" />

          {weddingData.story.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Dot trên timeline được căn chính giữa trục */}
              <div className="absolute -left-7 sm:-left-9 top-4 w-7 sm:w-9 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#FDFAF5] border-2 border-[#4A6741] flex items-center justify-center shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4715A]" />
                </div>
              </div>

              {/* Card nội dung */}
              <div className="rounded-2xl p-5 sm:p-6 bg-[#FFFDF9] border border-[#E8D5CF]/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#FDF0EC] text-[#C4715A] text-[11px] font-sans font-bold tracking-wider">
                    {milestone.yearOrDate}
                  </span>
                  {milestone.location && (
                    <span className="flex items-center gap-1 text-[11px] text-[#8C6A58] font-sans">
                      <MapPin className="w-3 h-3 text-[#4A6741]" />
                      <span>{milestone.location}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#354D2E] mb-2">
                  {milestone.title}
                </h3>

                {milestone.imageUrl && (
                  <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-3 border border-[#E8D5CF]">
                    <Image
                      src={milestone.imageUrl}
                      alt={milestone.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#5C4033] font-serif leading-relaxed italic">
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
