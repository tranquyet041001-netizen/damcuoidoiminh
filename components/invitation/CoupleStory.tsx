"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PaperCard } from "@/components/ui/PaperTexture";

export const CoupleStory: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  return (
    <section id="story" className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          subtitle="Hành Trình Yêu Thương"
          title="Chuyện Mình"
          description="Từng chặng đường đi qua, dẫu bình dị hay sóng gió, đều là những mảnh ghép quý giá để chúng mình trọn vẹn bên nhau."
          variant="birds"
        />

        {/* Timeline container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E5D4B6] space-y-12 ml-2 sm:ml-4">
          {weddingData.story.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Nút mốc thời gian trên trục dọc */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#9E3D32] border-4 border-[#FAF3E8] shadow-sm flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFF9EE]" />
              </div>

              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#9E3D32] bg-[#FAF3E8] px-2.5 py-0.5 rounded-sm border border-[#E5D4B6]">
                  {milestone.yearOrDate}
                </span>
                {milestone.location && (
                  <span className="flex items-center text-[12px] text-[#78928A]">
                    <MapPin className="w-3 h-3 mr-0.5" />
                    {milestone.location}
                  </span>
                )}
              </div>

              <PaperCard className="mt-2 p-5 sm:p-6" withCorners={false}>
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#183A3A] mb-3">
                  {milestone.title}
                </h3>

                {/* Ảnh mốc kỷ niệm */}
                <div className="relative w-full h-52 sm:h-64 rounded-sm overflow-hidden mb-4 border border-[#EADBCE]">
                  <Image
                    src={milestone.imageUrl}
                    alt={milestone.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183A3A]/25 via-transparent to-transparent pointer-events-none" />
                </div>

                <p className="text-sm sm:text-base text-[#5A473E] leading-relaxed">
                  {milestone.description}
                </p>
              </PaperCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
