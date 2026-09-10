"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, BotanicalBranch } from "@/components/ui/VietnamesePattern";

export const PhotoGallery: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const gallery = weddingData.gallery;

  const openLightbox = (i: number) => {
    setDirection(0);
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const next = useCallback(() => {
    if (lightboxIndex === null || gallery.length <= 1) return;
    setDirection(1);
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
  }, [gallery.length, lightboxIndex]);

  const prev = useCallback(() => {
    if (lightboxIndex === null || gallery.length <= 1) return;
    setDirection(-1);
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0));
  }, [gallery.length, lightboxIndex]);

  // Nhận diện thao tác vuốt cảm ứng trên màn hình điện thoại
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Ưu tiên cử chỉ vuốt ngang nếu khoảng cách vuốt ngang lớn hơn
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 35) {
        if (deltaX < 0) {
          next(); // Vuốt sang trái -> xem ảnh tiếp
        } else {
          prev(); // Vuốt sang phải -> xem ảnh trước
        }
      }
    } else {
      // Vuốt dọc xuống (> 60px) -> đóng album
      if (deltaY > 60) {
        closeLightbox();
      }
    }
  };

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

  // Đảm bảo mở lại cuộn trang khi component bị tháo dỡ
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <section id="gallery" className="py-16 sm:py-20 px-4 bg-sage-texture relative overflow-hidden">
      <div className="max-w-xl md:max-w-5xl lg:max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <VietnameseLotus size={36} color="#4A6741" opacity={0.85} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4715A] font-sans font-semibold mb-1">
            Khoảnh Khắc Đẹp
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide">
            Album Ảnh Cưới
          </h2>
          <div className="flex items-center justify-center my-3">
            <BotanicalBranch size={52} color="#C9A84C" opacity={0.7} />
          </div>
          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto leading-relaxed">
            Lưu giữ từng ánh mắt, nụ cười và những ngày tháng thanh xuân dịu dàng bên nhau.
          </p>
        </motion.div>

        {/* Masonry Tự Động: 2 Cột trên Điện Thoại, 3 Cột trên Màn Hình Lớn */}
        <div className="columns-2 md:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          {gallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.07 }}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid relative overflow-hidden rounded-2xl cursor-pointer group shadow-xs hover:shadow-xl transition-all duration-300 border border-[#E8D5CF] hover:-translate-y-1"
              style={{
                aspectRatio: idx % 4 === 0 ? "3/4" : idx % 4 === 1 ? "1/1" : idx % 4 === 2 ? "4/3" : "3/4",
              }}
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-106"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
              />
              {/* Lớp phủ tinh tế khi hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#354D2E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                <div className="flex items-center gap-1.5 text-[#FDFAF5]">
                  <ZoomIn className="w-4 h-4 text-[#C9A84C]" />
                  <span className="text-xs sm:text-sm font-serif line-clamp-1 font-medium">{item.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Chi Tiết Ảnh Cưới - Thao Tác Cực Mượt Trên Điện Thoại */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Xem chi tiết ảnh cưới"
            onClick={(e) => {
              // Chạm vào nền tối bên ngoài ảnh để đóng album ngay lập tức
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-3 sm:p-6 bg-black/92 backdrop-blur-md select-none"
          >
            {/* Thanh trên cùng: Đếm số ảnh & Nút Đóng siêu dễ chạm */}
            <div className="w-full max-w-4xl flex items-center justify-between z-50 pt-2 px-1">
              {/* Badge số thứ tự ảnh */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FDFAF5] text-xs font-serif shadow-md backdrop-blur-md">
                <span className="text-[#C9A84C] font-bold text-sm">
                  {lightboxIndex + 1}
                </span>
                <span className="text-white/40">/</span>
                <span className="text-white/80">{gallery.length}</span>
              </div>

              {/* Nút Đóng to, rõ ràng với chữ và icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                aria-label="Đóng album ảnh"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-[#FDFAF5] border border-white/30 backdrop-blur-md shadow-lg transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
                <span className="text-xs font-serif font-semibold">Đóng</span>
              </button>
            </div>

            {/* Vùng giữa: Hiển thị ảnh & 2 Nút Mũi Tên điều hướng */}
            <div
              className="relative flex-1 w-full max-w-4xl flex items-center justify-center my-2 overflow-hidden"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeLightbox();
                }
              }}
            >
              {/* Nút Ảnh trước */}
              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Ảnh trước"
                  className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-[#FDFAF5] bg-black/50 hover:bg-black/75 border border-white/25 backdrop-blur-md shadow-2xl transition-all active:scale-90 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              )}

              {/* Ảnh trình diễn với hiệu ứng trượt mượt mà theo phương hướng */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={lightboxIndex}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 80 : dir < 0 ? -80 : 0,
                      opacity: 0,
                      scale: 0.96,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 350, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                      },
                    },
                    exit: (dir: number) => ({
                      x: dir > 0 ? -80 : dir < 0 ? 80 : 0,
                      opacity: 0,
                      scale: 0.96,
                      transition: {
                        x: { type: "spring", stiffness: 350, damping: 30 },
                        opacity: { duration: 0.15 },
                        scale: { duration: 0.15 },
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full h-full max-h-[66vh] sm:max-h-[74vh] flex items-center justify-center p-1"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={gallery[lightboxIndex].url}
                      alt={gallery[lightboxIndex].title || "Ảnh cưới"}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="(max-width: 768px) 100vw, 900px"
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nút Ảnh tiếp theo */}
              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-[#FDFAF5] bg-black/50 hover:bg-black/75 border border-white/25 backdrop-blur-md shadow-2xl transition-all active:scale-90 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              )}
            </div>

            {/* Thanh dưới cùng: Tiêu đề ảnh, Dải chấm chọn & Hướng dẫn cử chỉ */}
            <div className="w-full max-w-md text-center space-y-2 px-4 pb-2 z-50">
              {/* Tiêu đề & Chú thích ảnh */}
              <div>
                <p className="font-serif text-sm sm:text-base font-bold text-[#FDFAF5] drop-shadow-sm line-clamp-1">
                  {gallery[lightboxIndex].title}
                </p>
                {gallery[lightboxIndex].caption && (
                  <p className="text-xs text-[#A8BCA1] italic mt-0.5 line-clamp-2">
                    {gallery[lightboxIndex].caption}
                  </p>
                )}
              </div>

              {/* Dải chấm chỉ số có vùng chạm lớn */}
              {gallery.length > 1 && (
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap max-w-xs mx-auto">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDirection(i > (lightboxIndex ?? 0) ? 1 : -1);
                        setLightboxIndex(i);
                      }}
                      aria-label={`Xem ảnh ${i + 1}`}
                      className="py-1.5 px-0.5 cursor-pointer group"
                    >
                      <span
                        className="block rounded-full transition-all duration-300"
                        style={{
                          width: i === lightboxIndex ? 20 : 6,
                          height: 6,
                          background:
                            i === lightboxIndex
                              ? "#C9A84C"
                              : "rgba(253,250,245,0.35)",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Hướng dẫn thao tác vuốt & thoát */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-white/50 font-sans tracking-wide">
                <span>Vuốt ngón tay để đổi ảnh</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="underline hover:text-white transition-colors cursor-pointer"
                >
                  Chạm nền đen để đóng
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
