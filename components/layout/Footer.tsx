import React from "react";
import { weddingData } from "@/data/wedding";
import { VietnameseLotus, DongSonBorder } from "@/components/ui/VietnamesePattern";

export const Footer: React.FC = () => {
  return (
    <footer className="relative pt-16 pb-24 text-center px-4 overflow-hidden border-t border-[#E5D4B6]/60">
      <div className="max-w-md mx-auto relative z-10">
        <VietnameseLotus size={40} color="#9E3D32" opacity={0.8} className="mx-auto mb-4" />

        <h3 className="text-xl sm:text-2xl font-serif text-[#183A3A] font-medium tracking-tight mb-2">
          Cảm Ơn Bạn Đã Đến
        </h3>

        <p className="text-sm sm:text-base text-[#5A473E] italic leading-relaxed mb-6">
          &ldquo;Hạnh phúc trọn vẹn nhất là khi được sẻ chia cùng những người thân yêu. Cảm ơn tình cảm và sự hiện diện của bạn trên từng chặng đường chúng mình đi qua.&rdquo;
        </p>

        <DongSonBorder color="#9E3D32" opacity={0.3} className="max-w-xs mx-auto mb-6" />

        {/* Chữ ký dâu rể */}
        <div className="flex items-center justify-center gap-8 text-[#183A3A] mb-8">
          <div>
            <div className="font-serif italic text-lg sm:text-xl font-medium tracking-wide">
              {weddingData.groom.shortName}
            </div>
            <div className="text-[11px] text-[#78928A] tracking-widest uppercase mt-0.5">
              Chú Rể
            </div>
          </div>

          <span className="text-[#9E3D32] text-xl font-serif">&</span>

          <div>
            <div className="font-serif italic text-lg sm:text-xl font-medium tracking-wide">
              {weddingData.bride.shortName}
            </div>
            <div className="text-[11px] text-[#78928A] tracking-widest uppercase mt-0.5">
              Cô Dâu
            </div>
          </div>
        </div>

        <div className="text-xs text-[#8A7569] tracking-wider">
          © 2027 Quang Minh & Thục An • Đám cưới phong cách Việt Cổ
        </div>
      </div>
    </footer>
  );
};
