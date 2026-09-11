"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, ArrowUp, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { LacBirdPair, DongSonSun } from "@/components/ui/VietnamesePattern";

interface FooterProps {
  isGuestView?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isGuestView = false }) => {
  const { data } = useWeddingData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative pt-16 pb-12 px-4 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1C2919 0%, #354D2E 50%, #1C2919 100%)" }}
    >
      {/* Ambient top radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center top, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
      />

      {/* Subtle star-field dots */}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            background: "#C9A84C",
            opacity: 0.08 + (i % 5) * 0.04,
            top: `${5 + (i * 31) % 90}%`,
            left: `${3 + (i * 47) % 94}%`,
            animation: `twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}

      {/* Dong Son Sun decorative watermark */}
      <div className="absolute top-8 right-6 opacity-[0.04] pointer-events-none hidden sm:block">
        <DongSonSun size={140} color="#C9A84C" opacity={1} />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <LacBirdPair color="#C9A84C" className="mb-4 opacity-60" />
        </motion.div>

        {/* Tên dâu rể thư pháp — shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4"
        >
          <div
            className="font-calligraphy text-4xl sm:text-5xl shimmer-gold-text"
            style={{ color: "#F5E8A0" }}
          >
            {data.groom.shortName} &amp; {data.bride.shortName}
          </div>
        </motion.div>

        {/* Thin gold separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-5 h-px w-32 origin-center"
          style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}
        />

        {/* Lời cảm ơn */}
        <p className="text-sm leading-relaxed max-w-sm mx-auto mb-6 font-serif italic"
          style={{ color: "#7A9670" }}
        >
          &ldquo;Hạnh phúc trọn vẹn nhất là khi được sẻ chia cùng những người thân yêu.
          Cảm ơn sự hiện diện và tình cảm quý báu của bạn trong ngày trọng đại của chúng mình.&rdquo;
        </p>

        {/* Ngày cưới */}
        <div
          className="inline-block px-5 py-2 rounded-2xl text-xs font-serif font-medium mb-8"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(201,168,76,0.2)",
            color: "#C9A84C",
            backdropFilter: "blur(4px)",
          }}
        >
          {data.weddingDateFormatted} • {data.lunarDateFormatted}
        </div>

        {/* Nút Cuộn Lên Đầu Trang */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer active:scale-95 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              color: "#FDFAF5",
            }}
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Về Đầu Trang</span>
          </button>
        </div>

        <div className="text-[10px] tracking-wider uppercase font-sans mb-4" style={{ color: "rgba(168,188,161,0.5)" }}>
          © 2027 {data.groom.shortName} &amp; {data.bride.shortName} • Botanical Romance
        </div>

        {/* Link admin */}
        {!isGuestView && (
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: "rgba(168,188,161,0.5)" }}
            >
              <Edit3 className="w-3 h-3" />
              <span>Mở thư phòng biên tập (Admin)</span>
            </Link>
          </div>
        )}
      </div>

      {/* CSS for shimmer + twinkle */}
      <style>{`
        .shimmer-gold-text {
          background: linear-gradient(90deg, #E8C96A 0%, #FFFDF5 40%, #C9A84C 60%, #E8C96A 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 4s linear infinite;
        }
        @keyframes shimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 250% center; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.8); }
        }
      `}</style>
    </footer>
  );
};

