"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getGuestNameFromUrl } from "@/utils/guest";
import { VietnameseLotus, RedSealStamp } from "@/components/ui/VietnamesePattern";

export const ImperialLongPhungInvitation: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());
  }, []);

  return (
    <section id="letter" className="relative py-16 sm:py-24 px-3 sm:px-6 overflow-hidden select-none" style={{ backgroundColor: "#0F0708" }}>
      {/* ── NỀN TRUYỀN THỐNG SƠN MÀI & GẤM VÓC HUYẾT DỤ ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, #3B090D 0%, #200406 50%, #0D0203 100%)",
        }}
      />

      {/* Ánh hào quang vàng hoàng đế tỏa ra từ chính tâm */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full pointer-events-none opacity-45"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 215, 120, 0.5) 0%, rgba(212, 175, 55, 0.25) 45%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      {/* Các hạt bụi vàng lấp lánh như sương khói trong video mở màn */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={`gold-dust-${i}`}
            className="absolute rounded-full bg-[#FDE68A] animate-pulse"
            style={{
              top: `${(i * 19) % 92}%`,
              left: `${(i * 27) % 95}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.25 + (i % 5) * 0.12,
              animationDuration: `${3 + (i % 4)}s`,
              boxShadow: "0 0 8px rgba(254, 240, 138, 0.8)",
            }}
          />
        ))}
      </div>

      {/* ── KHUNG KIM THIẾP LONG PHỤNG SƠN SON THIẾP VÀNG ── */}
      <div className="relative max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-5 sm:p-10 md:p-12 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(186,27,34,0.35)] border-2 border-[#E5C368] overflow-hidden"
          style={{
            background:
              "linear-gradient(165deg, #240507 0%, #170304 40%, #2A0609 70%, #150204 100%)",
          }}
        >
          {/* Họa tiết dập chìm gấm truyền thống */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#E5C368 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Viền đôi mạ vàng dập nổi truyền thống */}
          <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-dashed border-[#FDE68A]/60 pointer-events-none" />
          <div className="absolute inset-3.5 sm:inset-4.5 rounded-xl border border-[#E5C368]/30 pointer-events-none" />

          {/* ── HOA VĂN RỒNG PHƯỢNG CHẦU CHỮ HỶ TRÊN ĐỈNH THIỆP ── */}
          <div className="relative flex flex-col items-center justify-center mb-6">
            {/* Phù điêu Rồng bên Tả - Phượng bên Hữu chầu chữ 囍 */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-md">
              {/* Rồng vàng uốn lượn (Tả) */}
              <div className="flex items-center gap-1 text-[#E5C368] opacity-90">
                <span className="text-xl sm:text-2xl animate-pulse">🐉</span>
                <div className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#E5C368] to-[#FFF3B0]" />
              </div>

              {/* Đại triện Chữ Hỷ tròn vàng ròng */}
              <div
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(229,195,104,0.6)] border-2 border-[#FDE68A] shrink-0"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #BA1B22 0%, #7F1D1D 60%, #450A0A 100%)",
                }}
              >
                <div className="absolute inset-1 rounded-full border border-dashed border-[#FFF8D6]/60 pointer-events-none" />
                <span
                  className="font-serif font-bold text-2xl sm:text-3xl text-[#FFF6C8] select-none"
                  style={{
                    textShadow: "0 0 14px rgba(254, 230, 138, 0.9)",
                    fontFamily: "'Noto Serif SC', 'Songti SC', 'STSong', serif",
                  }}
                >
                  囍
                </span>
              </div>

              {/* Phượng hoàng tung cánh (Hữu) */}
              <div className="flex items-center gap-1 text-[#E5C368] opacity-90">
                <div className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#E5C368] to-[#FFF3B0]" />
                <span className="text-xl sm:text-2xl animate-pulse">🪶</span>
              </div>
            </div>

            {/* Dòng biểu tự đại hỷ */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-[#3B090D] border border-[#E5C368]/60 shadow-md">
              <Sparkles className="w-3 h-3 text-[#FDE68A]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#FFF3B0] font-serif font-bold">
                LONG PHỤNG HÒA MINH • KIM THIẾP HỶ THƯ
              </span>
              <Sparkles className="w-3 h-3 text-[#FDE68A]" />
            </div>
          </div>

          {/* ── THẺ BÀI KIM TỰ: KÍNH MỜI ĐÍCH DANH KHÁCH QUÝ ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="my-5 sm:my-6 p-4 sm:p-5 rounded-2xl border border-[#E5C368]/75 shadow-lg max-w-md mx-auto relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, #4A0B10 0%, #2A0508 70%, #150204 100%)",
              boxShadow: "inset 0 0 15px rgba(229, 195, 104, 0.15)",
            }}
          >
            <div className="absolute inset-1 rounded-xl border border-dashed border-[#FDE68A]/35 pointer-events-none" />

            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-[#E5C368] text-xs">❖</span>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C368] font-serif font-bold">
                TRÂN TRỌNG KÍNH MỜI
              </span>
              <span className="text-[#E5C368] text-xs">❖</span>
            </div>

            <div
              className="font-calligraphy text-3xl sm:text-4xl md:text-5xl text-[#FFF8D6] font-bold my-1 tracking-wide leading-tight"
              style={{
                textShadow:
                  "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(229, 195, 104, 0.75)",
              }}
            >
              {guestName || "Quý Khách Quý & Gia Đình"}
            </div>

            <p className="text-[11px] sm:text-xs text-[#E8D5CF] italic font-serif mt-1">
              Tới tham dự và nâng ly chúc phúc trong ngày đại hỷ thành hôn
            </p>
          </motion.div>

          {/* ── TIÊU ĐỀ LỄ THÀNH HÔN ── */}
          <div className="my-4 sm:my-5 space-y-1">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-[#E5C368] font-serif font-bold">
              CỬ HÀNH HÔN LỄ
            </p>
            <h1
              className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-[#FFF3B0] tracking-widest leading-none pt-1"
              style={{
                textShadow:
                  "0 2px 6px rgba(0,0,0,0.95), 0 0 24px rgba(229, 195, 104, 0.65)",
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
              }}
            >
              LỄ THÀNH HÔN
            </h1>
          </div>

          {/* ── THÔNG TIN HAI BÊN THÂN TỘC & DÂU RỂ ── */}
          <div className="my-6 sm:my-8 py-5 sm:py-6 border-y border-[#E5C368]/40 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center justify-center pointer-events-none">
              <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#E5C368] to-transparent" />
              <div className="w-7 h-7 rounded-full bg-[#8B1217] border border-[#E5C368] flex items-center justify-center my-1 shadow-md">
                <Heart className="w-3.5 h-3.5 text-[#FDE68A] fill-[#FDE68A]" />
              </div>
              <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#E5C368] to-transparent" />
            </div>

            {/* NHÀ TRAI */}
            <div className="flex flex-col items-center text-center space-y-2 sm:pr-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E5C368] font-serif font-bold">
                NHÀ TRAI
              </span>
              <p className="text-xs text-[#E8D5CF] font-serif max-w-[240px] leading-relaxed">
                {weddingData.groom.parents}
              </p>

              {/* Avatar Tân Lang */}
              <div className="pt-2 flex flex-col items-center">
                {weddingData.groom.avatarUrl && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#996515] via-[#FDE68A] to-[#C99B26] shadow-[0_0_20px_rgba(229,195,104,0.55)] border border-[#FFF8D6] mb-2 group">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#1A0305]">
                      <Image
                        src={weddingData.groom.avatarUrl}
                        alt={weddingData.groom.fullName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </div>
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-wider text-[#E5C368]/80 block font-sans font-semibold">
                  Tân Lang (Chú Rể)
                </span>
                <span className="font-calligraphy text-3xl sm:text-4xl text-[#FFF8D6] font-bold block mt-0.5 drop-shadow-[0_2px_10px_rgba(229,195,104,0.6)]">
                  {weddingData.groom.fullName}
                </span>
              </div>
            </div>

            {/* NHÀ GÁI */}
            <div className="flex flex-col items-center text-center space-y-2 sm:pl-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E5C368] font-serif font-bold">
                NHÀ GÁI
              </span>
              <p className="text-xs text-[#E8D5CF] font-serif max-w-[240px] leading-relaxed">
                {weddingData.bride.parents}
              </p>

              {/* Avatar Tân Nương */}
              <div className="pt-2 flex flex-col items-center">
                {weddingData.bride.avatarUrl && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#C99B26] via-[#FDE68A] to-[#996515] shadow-[0_0_20px_rgba(229,195,104,0.55)] border border-[#FFF8D6] mb-2 group">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#1A0305]">
                      <Image
                        src={weddingData.bride.avatarUrl}
                        alt={weddingData.bride.fullName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </div>
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-wider text-[#E5C368]/80 block font-sans font-semibold">
                  Tân Nương (Cô Dâu)
                </span>
                <span className="font-calligraphy text-3xl sm:text-4xl text-[#FFF8D6] font-bold block mt-0.5 drop-shadow-[0_2px_10px_rgba(229,195,104,0.6)]">
                  {weddingData.bride.fullName}
                </span>
              </div>
            </div>
          </div>

          {/* ── CÂU ĐỐI GIAI KỲ TRĂM NĂM ── */}
          <div className="my-5 max-w-lg mx-auto">
            <p className="text-sm sm:text-base text-[#FFF3B0] font-serif italic leading-relaxed">
              &ldquo;Duyên tao ngộ trăm năm ước hẹn • Hoa kết đôi nhánh một tấm chân tình&rdquo;
            </p>
          </div>


          {/* Con dấu son "CÁT TƯỜNG BẢO CHỨNG" */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <RedSealStamp size={46} text="TRĂM NĂM" />
            <span className="text-[11px] text-[#E5C368] font-serif tracking-widest uppercase">
              Hỷ Khí Tràn Đầy • Phúc Đức Vô Biên
            </span>
            <RedSealStamp size={46} text="CÁT TƯỜNG" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
