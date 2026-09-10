import React from "react";
import { LacBirdPair, VietnameseLotus } from "./VietnamesePattern";

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
  variant?: "birds" | "lotus" | "minimal";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  className = "",
  variant = "birds",
}) => {
  return (
    <div className={`text-center mb-8 sm:mb-10 ${className}`}>
      {subtitle && (
        <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#9E3D32] font-medium mb-1.5">
          {subtitle}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#183A3A] font-medium tracking-tight">
        {title}
      </h2>

      <div className="mt-2.5 mb-3 flex items-center justify-center">
        {variant === "birds" && <LacBirdPair color="#78928A" />}
        {variant === "lotus" && (
          <VietnameseLotus size={32} color="#9E3D32" opacity={0.7} className="mx-auto" />
        )}
        {variant === "minimal" && (
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#9E3D32]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E3D32]" />
            <span className="h-[1px] w-8 bg-[#9E3D32]/40" />
          </div>
        )}
      </div>

      {description && (
        <p className="max-w-md mx-auto text-sm sm:text-base text-[#5A473E] font-normal leading-relaxed italic">
          {description}
        </p>
      )}
    </div>
  );
};
