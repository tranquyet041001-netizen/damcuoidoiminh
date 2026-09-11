"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, Share2, Crown, Calendar, MapPin, QrCode, Check } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getGuestNameFromUrl } from "@/utils/guest";
import { useToast } from "@/components/ui/Toast";
import { VietnameseLotus, RedSealStamp } from "@/components/ui/VietnamesePattern";

export const VIPInvitationPass3D: React.FC = () => {
  const { data: weddingData } = useWeddingData();
  const { showToast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [guestName, setGuestName] = useState<string>("");
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setGuestName(getGuestNameFromUrl());
  }, []);

  // Xử lý góc nghiêng 3D bằng chuột trên máy tính
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -14;
    const rY = ((x - centerX) / centerX) * 14;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.85 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  // Xử lý vuốt chạm hoặc nghiêng thiết bị trên di động
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = Math.max(-16, Math.min(16, ((y - centerY) / centerY) * -16));
    const rY = Math.max(-16, Math.min(16, ((x - centerX) / centerX) * 16));

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.9 });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0.2 }));
  }, []);

  // Lắng nghe con quay hồi chuyển Gyroscope trên điện thoại nếu được hỗ trợ
  useEffect(() => {
    let handleOrientation: ((e: DeviceOrientationEvent) => void) | null = null;

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          const rY = Math.max(-18, Math.min(18, (e.gamma / 45) * 15));
          const rX = Math.max(-18, Math.min(18, ((e.beta - 45) / 45) * -15));
          setRotateX(rX);
          setRotateY(rY);
          setGlarePosition({
            x: 50 + (e.gamma / 45) * 40,
            y: 50 + ((e.beta - 45) / 45) * 40,
            opacity: 0.65,
          });
        }
      };

      try {
        window.addEventListener("deviceorientation", handleOrientation, true);
      } catch {
        // ignore
      }
    }

    return () => {
      if (handleOrientation) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, []);

  // Mã định danh thẻ VIP độc quyền
  const passCode = `VIP-2026-${(guestName ? guestName.length * 43 : 8888).toString().padStart(4, "0")}`;

  // Tải thẻ VIP về máy dạng ảnh Canvas chất lượng cao (1200x750)
  const handleDownloadPass = async () => {
    setIsDownloading(true);
    showToast("Đang tạo thẻ mời VIP độ phân giải cao...", "info");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 750;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Canvas not supported");

      // Nền thẻ: Sang trọng tone đen hoàng gia sơn son thiếp vàng
      const bgGradient = ctx.createRadialGradient(600, 375, 50, 600, 375, 650);
      bgGradient.addColorStop(0, "#2A1810");
      bgGradient.addColorStop(0.5, "#170E0A");
      bgGradient.addColorStop(1, "#0D0806");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1200, 750);

      // Khung viền kim loại vàng
      ctx.strokeStyle = "#E5C368";
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 690);

      ctx.strokeStyle = "rgba(229, 195, 104, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, 1116, 666);

      // Tiêu đề thương hiệu
      ctx.fillStyle = "#E5C368";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("❖ HOÀNG GIA HỶ SỰ • THẺ MỜI DANH DỰ VIP ❖", 600, 100);

      // Tên Dâu Rể
      ctx.fillStyle = "#FDFAF5";
      ctx.font = "bold italic 56px 'Times New Roman', serif";
      ctx.fillText(`${weddingData.groom.shortName}  &  ${weddingData.bride.shortName}`, 600, 185);

      // Kính mời đích danh
      ctx.fillStyle = "#C9A84C";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH", 600, 260);

      ctx.fillStyle = "#FFF6D6";
      ctx.font = "bold 64px 'Times New Roman', serif";
      ctx.fillText(guestName || "Quý Khách Quý & Gia Đình", 600, 350);

      // Đường kẻ trang trí vàng
      ctx.strokeStyle = "#E5C368";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(350, 390);
      ctx.lineTo(850, 390);
      ctx.stroke();

      // Thông tin chi tiết
      ctx.fillStyle = "#E8D5CF";
      ctx.font = "26px sans-serif";
      ctx.fillText(`📅 Ngày Thành Hôn: ${weddingData.weddingDateFormatted}`, 600, 450);

      const mainEvent = weddingData.events[0] || { venue: "Tư Gia", time: "11:00" };
      ctx.fillText(`📍 Địa điểm: ${mainEvent.venue} (${mainEvent.time})`, 600, 505);

      // Footer thẻ
      ctx.fillStyle = "#A8BCA1";
      ctx.font = "bold 22px monospace";
      ctx.fillText(`MÃ VÉ: ${passCode}  •  TRĂM NĂM HẠNH PHÚC`, 600, 610);

      // Dấu son đỏ
      ctx.fillStyle = "#991B1B";
      ctx.beginPath();
      ctx.arc(1060, 610, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#FDE68A";
      ctx.font = "bold 34px serif";
      ctx.fillText("囍", 1060, 622);

      // Tải ảnh về
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `The-Moi-VIP-${(guestName || "Hon-Le").replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();

      showToast("Đã lưu thẻ mời VIP thành công vào máy!", "success");
    } catch {
      showToast("Không thể xuất ảnh, bạn có thể chụp màn hình thẻ nhé!", "info");
    } finally {
      setIsDownloading(false);
    }
  };

  // Chia sẻ hoặc sao chép link thẻ
  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thẻ Mời Cưới VIP • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
          text: `Trân trọng kính mời ${guestName || "bạn"} tới tham dự hôn lễ của ${weddingData.groom.shortName} & ${weddingData.bride.shortName}!`,
          url: currentUrl,
        });
        showToast("Đã mở chia sẻ thẻ cưới", "success");
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        showToast("Đã sao chép link thẻ mời VIP vào bộ nhớ tạm!", "success");
        setTimeout(() => setIsCopied(false), 2500);
      } catch {
        showToast("Không thể sao chép tự động", "info");
      }
    }
  };

  return (
    <section className="py-14 sm:py-20 px-3 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#FDFAF5] via-[#FBF6EE] to-[#FDFAF5]">
      <div className="max-w-xl md:max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F0F5EE] border border-[#A8BCA1]/50 text-[#354D2E] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-sans font-bold shadow-2xs mb-3">
            <Crown className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Tấm Thẻ Danh Dự</span>
            <Crown className="w-3.5 h-3.5 text-[#C9A84C]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#354D2E] tracking-wide">
            Thẻ Khách Mời VIP Hologram
          </h2>

          <p className="text-xs sm:text-sm text-[#8C6A58] italic font-serif max-w-md mx-auto mt-2">
            Nghiêng điện thoại hoặc di chuột để trải nghiệm hiệu ứng phản quang 3D lấp lánh độc quyền
          </p>
        </motion.div>

        {/* ── KHỐI HIỂN THỊ THẺ VIP 3D ── */}
        <div className="flex justify-center items-center py-4 sm:py-6" style={{ perspective: "1000px" }}>
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            animate={{
              rotateX,
              rotateY,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-[500px] h-[300px] sm:h-[320px] rounded-3xl p-6 sm:p-8 cursor-grab active:cursor-grabbing select-none overflow-hidden shadow-2xl transition-shadow"
          >
            {/* Lớp nền thẻ: Sơn son thiếp vàng & sợi carbon hoàng gia */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle at 75% 20%, #2A1713 0%, #170D0A 60%, #0A0503 100%)",
                boxShadow:
                  "0 25px 50px -12px rgba(120, 20, 20, 0.45), inset 0 0 30px rgba(229, 195, 104, 0.2)",
              }}
            />

            {/* Lớp Holographic Foil Shimmer (Vệt sáng phản quang 7 màu đổi góc theo độ nghiêng) */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
              style={{
                opacity: glarePosition.opacity,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.75) 0%, rgba(254,230,138,0.5) 20%, rgba(244,114,182,0.4) 40%, rgba(56,189,248,0.4) 60%, transparent 80%)`,
              }}
            />

            {/* Viền đôi mạ vàng dập nổi hoàng gia */}
            <div className="absolute inset-2 sm:inset-3 rounded-2xl border-2 border-[#E5C368]/80 pointer-events-none shadow-inner" />
            <div className="absolute inset-3.5 sm:inset-4.5 rounded-xl border border-dashed border-[#FDE68A]/40 pointer-events-none" />

            {/* Họa tiết hoa văn góc */}
            <div className="absolute top-4 left-4 opacity-40 pointer-events-none">
              <VietnameseLotus size={28} color="#E5C368" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-40 pointer-events-none">
              <VietnameseLotus size={28} color="#E5C368" />
            </div>

            {/* Con dấu son đỏ "TRĂM NĂM" */}
            <div className="absolute top-4 sm:top-5 right-5 sm:right-6 pointer-events-none">
              <RedSealStamp size={42} text="HỶ SỰ" />
            </div>

            {/* Nội dung bên trong thẻ */}
            <div className="relative z-10 h-full flex flex-col justify-between text-[#FDFAF5]">
              {/* Top: Header & Mã số thẻ */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5C368] animate-ping" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#E5C368] font-mono font-bold">
                    WEDDING VIP PASS • {passCode}
                  </span>
                </div>
                <h3 className="font-calligraphy text-2xl sm:text-3xl text-[#FFF6D6] mt-1 drop-shadow-md">
                  {weddingData.groom.shortName} &amp; {weddingData.bride.shortName}
                </h3>
              </div>

              {/* Middle: Tên khách mời in dập nổi ánh kim */}
              <div className="my-auto py-2">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E5C368]/90 font-sans font-semibold">
                  Trân Trọng Kính Mời
                </p>
                <div className="mt-0.5 font-serif font-bold text-2xl sm:text-3xl text-[#FFFFFF] tracking-wide drop-shadow-[0_2px_10px_rgba(229,195,104,0.6)]">
                  {guestName || "Quý Khách Quý & Gia Đình"}
                </div>
              </div>

              {/* Bottom: Ngày cưới, sảnh tiệc & mã QR mini */}
              <div className="pt-3 border-t border-[#E5C368]/30 flex items-end justify-between gap-3 text-xs">
                <div className="space-y-1 text-[#E8D5CF]">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#E5C368] shrink-0" />
                    <span>{weddingData.weddingDateFormatted}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#E5C368] shrink-0" />
                    <span className="truncate max-w-[200px] sm:max-w-[260px]">
                      {weddingData.events[0]?.venue || "Trung Tâm Tiệc Cưới"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-1 rounded-lg bg-white/10 border border-[#E5C368]/40 backdrop-blur-xs flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-[#FDE68A]" />
                  </div>
                  <div className="text-[9px] text-[#E5C368] font-mono leading-tight uppercase hidden sm:block">
                    Valid
                    <br />
                    Access
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── HÀNG NÚT TƯƠNG TÁC THẺ ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={handleDownloadPass}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-serif font-bold text-[#FDFAF5] shadow-lg transition-all transform active:scale-95 hover:scale-105 cursor-pointer disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #C4715A 0%, #A4503B 100%)",
              boxShadow: "0 6px 18px -3px rgba(196, 113, 90, 0.4)",
            }}
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Đang xuất ảnh..." : "Lưu Thẻ VIP Về Máy"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-serif font-bold text-[#354D2E] bg-[#FFFDF9] border border-[#A8BCA1] shadow-md transition-all transform active:scale-95 hover:bg-[#F0F5EE] cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#C9A84C]" />}
            <span>{isCopied ? "Đã chép link!" : "Chia Sẻ Thẻ VIP"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
