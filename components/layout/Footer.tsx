"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, ArrowUp, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { VietnameseLotus, LacBirdPair, BotanicalBranch } from "@/components/ui/VietnamesePattern";

interface FooterProps {
  isGuestView?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isGuestView = false }) => {
  const { data } = useWeddingData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-16 pb-12 px-4 text-center overflow-hidden bg-green-texture text-[#FDFAF5]">
      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <LacBirdPair color="#C9A84C" className="mb-4 opacity-70" />
        </motion.div>

        {/* Tên dâu rể thư pháp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4"
        >
          <div className="font-calligraphy text-4xl sm:text-5xl text-[#FDFAF5]">
            {data.groom.shortName} &amp; {data.bride.shortName}
          </div>
        </motion.div>

        {/* Lời cảm ơn */}
        <p className="text-sm text-[#A8BCA1] italic font-serif leading-relaxed max-w-sm mx-auto mb-6">
          &ldquo;Hạnh phúc trọn vẹn nhất là khi được sẻ chia cùng những người thân yêu. Cảm ơn sự hiện diện và tình cảm quý báu của bạn trong ngày trọng đại của chúng mình.&rdquo;
        </p>

        {/* Ngày cưới */}
        <div className="inline-block px-5 py-2 rounded-2xl bg-white/10 border border-white/15 text-[#FDFAF5] text-xs font-serif font-medium mb-8">
          {data.weddingDateFormatted} • {data.lunarDateFormatted}
        </div>

        {/* Nút Cuộn Lên Đầu Trang */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-serif font-semibold text-[#FDFAF5] transition-all cursor-pointer active:scale-95"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Về Đầu Trang</span>
          </button>
        </div>

        <div className="text-[10px] text-[#A8BCA1]/80 tracking-wider uppercase font-sans mb-4">
          © 2027 {data.groom.shortName} &amp; {data.bride.shortName} • Phong Cách Botanical Romance
        </div>

        {/* Link admin nếu không phải guest view */}
        {!isGuestView && (
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-[#A8BCA1] hover:text-[#FDFAF5] transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Mở thư phòng biên tập (Admin)</span>
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
};
