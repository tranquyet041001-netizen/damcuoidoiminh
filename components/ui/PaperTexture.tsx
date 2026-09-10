import React from "react";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  withCorners?: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  className = "",
  bordered = true,
  withCorners = true,
}) => {
  return (
    <div
      className={`relative bg-[#FFF9EE] text-[#3A2D26] rounded-sm p-6 sm:p-8 shadow-sm transition-all duration-300 ${
        bordered ? "border border-[#EADBCE]" : ""
      } ${className}`}
      style={{
        boxShadow: "0 10px 30px -10px rgba(58, 45, 38, 0.07), 0 2px 8px -2px rgba(58, 45, 38, 0.04)",
      }}
    >
      {/* 4 Góc khung hoa văn Việt cổ cách điệu */}
      {withCorners && (
        <>
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#9E3D32]/50 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#9E3D32]/50 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#9E3D32]/50 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#9E3D32]/50 pointer-events-none" />
        </>
      )}

      {children}
    </div>
  );
};
