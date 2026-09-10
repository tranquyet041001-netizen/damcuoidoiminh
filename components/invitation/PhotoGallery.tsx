"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

export const PhotoGallery: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = weddingData.gallery;

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);
  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % gallery.length);
  }, [lightboxIndex, gallery.length]);
  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, next, prev]);

  // Chia thành 2 cột masonry
  const col1 = gallery.filter((_, i) => i % 2 === 0);
  const col2 = gallery.filter((_, i) => i % 2 === 1);

  return (
    <section id="gallery" className="py-16 px-4 bg-sage-texture relative overflow-hidden">
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
            Khoảnh Khắc Đẹp
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#354D2E] tracking-wide">
            Album Ảnh Cưới
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-sm mx-auto">
            Lưu giữ từng ánh mắt, nụ cười và những ngày tháng thanh xuân dịu dàng bên nhau.
          </p>
        </motion.div>

        {/* Masonry 2 cột */}
        <div className="flex gap-3 sm:gap-4">
          {/* Cột 1 */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            {col1.map((item, idx) => {
              const globalIdx = idx * 2;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => openLightbox(globalIdx)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-xs hover:shadow-lg transition-all border border-[#E8D5CF]"
                  style={{
                    aspectRatio: idx % 3 === 0 ? "3/4" : idx % 3 === 1 ? "1/1" : "4/3",
                  }}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                    sizes="(max-width: 640px) 50vw, 300px"
                  />
                  {/* Subtle soft overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#354D2E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex items-center gap-1.5 text-[#FDFAF5]">
                      <ZoomIn className="w-4 h-4 text-[#C9A84C]" />
                      <span className="text-xs font-serif line-clamp-1">{item.title}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cột 2 lệch nhịp */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 mt-6">
            {col2.map((item, idx) => {
              const globalIdx = idx * 2 + 1;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 + 0.05 }}
                  onClick={() => openLightbox(globalIdx)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-xs hover:shadow-lg transition-all border border-[#E8D5CF]"
                  style={{
                    aspectRatio: idx % 3 === 0 ? "1/1" : idx % 3 === 1 ? "3/4" : "4/3",
                  }}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                    sizes="(max-width: 640px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#354D2E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex items-center gap-1.5 text-[#FDFAF5]">
                      <ZoomIn className="w-4 h-4 text-[#C9A84C]" />
                      <span className="text-xs font-serif line-clamp-1">{item.title}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#1B291A]/95 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-[#FDFAF5] bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-[#FDFAF5] bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-2xl max-h-[75vh] w-full h-full flex items-center justify-center"
              >
                <div className="relative w-full h-full max-h-[75vh]">
                  <Image
                    src={gallery[lightboxIndex].url}
                    alt={gallery[lightboxIndex].title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-[#FDFAF5] bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="mt-4 text-center space-y-1 max-w-sm px-4 text-[#FDFAF5]">
              <p className="font-serif text-base font-medium">
                {gallery[lightboxIndex].title}
              </p>
              {gallery[lightboxIndex].caption && (
                <p className="text-xs text-[#A8BCA1] italic">{gallery[lightboxIndex].caption}</p>
              )}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === lightboxIndex ? 16 : 6,
                      height: 6,
                      background: i === lightboxIndex ? "#C9A84C" : "rgba(253,250,245,0.3)",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
