"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const PhotoGallery: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % weddingData.gallery.length);
  }, [lightboxIndex]);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + weddingData.gallery.length) % weddingData.gallery.length
    );
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  return (
    <section id="gallery" className="py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          subtitle="Khoảnh Khắc Đẹp"
          title="Album Ảnh Cưới"
          description="Lưu giữ từng nụ cười, ánh mắt và những ngày tháng thanh xuân rực rỡ nhất."
          variant="birds"
        />

        {/* Lưới ảnh linh hoạt */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {weddingData.gallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-4/5 sm:aspect-square bg-[#FAF3E8] border border-[#E5D4B6] rounded-xs overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              />
              <div className="absolute inset-0 bg-[#183A3A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-[#FFF9EE]">
                <Maximize2 className="w-5 h-5 mb-1.5 opacity-80" />
                <span className="font-serif text-sm font-medium line-clamp-1">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox xem ảnh toàn màn hình */}
        {lightboxIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-[#183A3A]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Nút đóng */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Đóng ảnh"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#FFF9EE]/10 hover:bg-[#FFF9EE]/20 text-[#FFF9EE] flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nút lùi */}
            <button
              type="button"
              onClick={prevImage}
              aria-label="Ảnh trước đó"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFF9EE]/10 hover:bg-[#FFF9EE]/20 text-[#FFF9EE] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Nút tiến */}
            <button
              type="button"
              onClick={nextImage}
              aria-label="Ảnh kế tiếp"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFF9EE]/10 hover:bg-[#FFF9EE]/20 text-[#FFF9EE] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Khung hiển thị ảnh lớn */}
            <div className="relative max-w-3xl max-h-[75vh] w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-h-[75vh]">
                <Image
                  src={weddingData.gallery[lightboxIndex].url}
                  alt={weddingData.gallery[lightboxIndex].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            {/* Chú thích ảnh */}
            <div className="text-center mt-4 text-[#FFF9EE] max-w-md px-4">
              <div className="font-serif text-lg font-medium">
                {weddingData.gallery[lightboxIndex].title}
              </div>
              {weddingData.gallery[lightboxIndex].caption && (
                <div className="text-xs sm:text-sm text-[#F4E8D2]/80 mt-1 italic">
                  {weddingData.gallery[lightboxIndex].caption}
                </div>
              )}
              <div className="text-[11px] text-[#78928A] mt-2">
                {lightboxIndex + 1} / {weddingData.gallery.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
