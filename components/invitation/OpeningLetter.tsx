"use client";

import React from "react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { PaperCard } from "@/components/ui/PaperTexture";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DongSonBorder } from "@/components/ui/VietnamesePattern";

export const OpeningLetter: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  return (
    <section id="letter" className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          subtitle="Tâm Tình Ngày Chung Đôi"
          title="Lời Ngỏ"
          variant="lotus"
        />

        <PaperCard className="text-center sm:px-10">
          {/* Thông tin phụ mẫu hai bên gia đình */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-[#EADBCE]">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#9E3D32] font-semibold">
                NHÀ TRAI
              </span>
              <div className="text-sm sm:text-base font-serif font-medium text-[#183A3A]">
                {weddingData.groom.parents}
              </div>
              <div className="text-xs text-[#6B5549]">
                Hôn phối: <strong className="font-serif text-[#183A3A]">{weddingData.groom.fullName}</strong>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#9E3D32] font-semibold">
                NHÀ GÁI
              </span>
              <div className="text-sm sm:text-base font-serif font-medium text-[#183A3A]">
                {weddingData.bride.parents}
              </div>
              <div className="text-xs text-[#6B5549]">
                Hôn phối: <strong className="font-serif text-[#183A3A]">{weddingData.bride.fullName}</strong>
              </div>
            </div>
          </div>

          <DongSonBorder color="#9E3D32" opacity={0.25} className="my-6" />

          {/* Đoạn thư ngỏ chân thành */}
          <div className="space-y-4 text-sm sm:text-base text-[#5A473E] leading-relaxed text-justify sm:text-center">
            {weddingData.openingLetter.content.map((paragraph, idx) => (
              <p key={idx} className="indent-4 sm:indent-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-[#EADBCE]">
            <div className="font-serif italic text-base sm:text-lg text-[#183A3A]">
              {weddingData.openingLetter.closing.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </PaperCard>
      </div>
    </section>
  );
};
