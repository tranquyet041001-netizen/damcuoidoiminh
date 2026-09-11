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
        {/* Header — stagger reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
          className="text-center mb-12 sm:mb-14"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
            className="inline-flex items-center justify-center mb-2"
          >
            <Heart className="w-6 h-6 text-[#C4715A] fill-[#C4715A]/15 animate-heartbeat" />
          </motion.div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#4A6741] font-sans font-semibold mb-1"
          >
            Hành Trình Yêu Thương
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide"
          >
            Câu Chuyện Chúng Mình
          </motion.h2>
          <motion.div
            variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, delay: 0.1 } } }}
            className="mx-auto mt-2 h-[1.5px] w-20 origin-center"
            style={{ background: "linear-gradient(to right, transparent, #C4715A, transparent)" }}
          />
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
            className="flex items-center justify-center my-3"
          >
            <BotanicalBranch size={48} color="#C4715A" opacity={0.7} />
          </motion.div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto leading-relaxed"
          >
            Từng khoảnh khắc, từng kỷ niệm đơm hoa kết trái thành một bến đỗ bình yên.
          </motion.p>
        </motion.div>

        {/* Timeline — alternating left/right slide */}
        <div className="relative pl-7 sm:pl-9 space-y-8">
          <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#4A6741]/40 via-[#C4715A]/40 to-[#C9A84C]/40 pointer-events-none" />

          {weddingData.story.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Dot on timeline */}
              <div className="absolute -left-7 sm:-left-9 top-4 w-7 sm:w-9 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15, type: "spring", stiffness: 300 }}
                  className="w-4 h-4 rounded-full bg-[#FDFAF5] border-2 border-[#4A6741] flex items-center justify-center shadow-xs"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4715A]" />
                </motion.div>
              </div>

              {/* Card */}
              <div
                className="rounded-2xl p-5 sm:p-6 bg-[#FFFDF9] border border-[#E8D5CF]/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
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
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
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
