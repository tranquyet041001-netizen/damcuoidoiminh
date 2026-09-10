"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";

export const CoupleStory: React.FC = () => {
  const { data: weddingData } = useWeddingData();

  return (
    <section id="story" className="py-14 px-4 bg-[#FAF3E8]">
      <div className="max-w-md mx-auto">
        {/* Tiêu đề theo ảnh mẫu */}
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wider uppercase text-[#183A3A]">
            CÂU CHUYỆN CỦA CHÚNG TÔI
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </div>

        {/* Trục thời gian với ảnh tròn và nối chỉ vàng theo ảnh mẫu */}
        <div className="relative">
          {/* Đường chỉ dọc trung tâm */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-8 w-[2px] bg-[#D4AF37]/50 pointer-events-none" />

          <div className="space-y-10 relative z-10">
            {weddingData.story.map((milestone, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center"
                >
                  {/* Cột Trái */}
                  <div className={`w-1/2 pr-4 ${!isEven ? "text-right" : "opacity-0 pointer-events-none"}`}>
                    {!isEven && (
                      <div>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#183A3A] uppercase tracking-wide">
                          {milestone.title} ({milestone.yearOrDate})
                        </h3>
                        <p className="text-xs text-[#5A473E] mt-1 leading-relaxed line-clamp-3">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ảnh mốc tròn ở chính giữa */}
                  <div className="relative z-20 flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] bg-[#FFF9EE] shadow-md overflow-hidden p-0.5 ring-4 ring-[#FAF3E8]">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={milestone.imageUrl}
                          alt={milestone.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cột Phải */}
                  <div className={`w-1/2 pl-4 ${isEven ? "text-left" : "opacity-0 pointer-events-none"}`}>
                    {isEven && (
                      <div>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#183A3A] uppercase tracking-wide">
                          {milestone.title} ({milestone.yearOrDate})
                        </h3>
                        <p className="text-xs text-[#5A473E] mt-1 leading-relaxed line-clamp-3">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
