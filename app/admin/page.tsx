"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Camera,
  CreditCard,
  Users,
  Smartphone,
  Monitor,
  RotateCcw,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  FileSpreadsheet,
  ArrowLeft,
  Upload,
  Loader2,
  Music,
  Mail,
  Send,
} from "lucide-react";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";
import { VietnameseLotus, RedSealStamp, DongSonSun } from "@/components/ui/VietnamesePattern";
import { processAndUploadImage } from "@/utils/imageUpload";
import {
  RSVPSubmission,
  WishSubmission,
  WeddingEvent,
  StoryMilestone,
  GalleryItem,
} from "@/types/wedding";

function StudioContent() {
  const { data, updateData, saveChanges, resetToDefault, exportAsCode, isModified } =
    useWeddingData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "couple" | "email" | "time" | "events" | "story" | "gallery" | "bank" | "rsvps"
  >("couple");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving">("saved");

  // Local state for RSVPs and Wishes
  const [rsvps, setRsvps] = useState<RSVPSubmission[]>([]);
  const [wishes, setWishes] = useState<WishSubmission[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  // Upload states
  const [uploadingGroomAvatar, setUploadingGroomAvatar] = useState(false);
  const [uploadingBrideAvatar, setUploadingBrideAvatar] = useState(false);
  const [uploadingStoryIdx, setUploadingStoryIdx] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save
  useEffect(() => {
    setAutoSaveStatus("saving");
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveChanges();
      setAutoSaveStatus("saved");
    }, 600);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [data, saveChanges]);

  useEffect(() => {
    if (activeTab === "rsvps") {
      fetchGuestsData();
    }
  }, [activeTab]);

  const fetchGuestsData = async () => {
    setLoadingGuests(true);
    try {
      const [rsvpRes, wishRes] = await Promise.all([fetch("/api/rsvp"), fetch("/api/wishes")]);
      const rsvpJson = await rsvpRes.json();
      const wishJson = await wishRes.json();
      if (rsvpJson.success && Array.isArray(rsvpJson.data)) {
        setRsvps(rsvpJson.data);
      }
      if (wishJson.success && Array.isArray(wishJson.data)) {
        setWishes(wishJson.data);
      }
    } catch {
      showToast("Không thể tải danh sách khách mời", "info");
    } finally {
      setLoadingGuests(false);
    }
  };

  // Upload handlers
  const handleUploadGroomAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingGroomAvatar(true);
      const url = await processAndUploadImage(file, { maxWidth: 600, maxHeight: 600 });
      updateData((prev) => ({ ...prev, groom: { ...prev.groom, avatarUrl: url } }));
      showToast("Đã cập nhật ảnh chú rể!", "success");
    } catch (err: any) {
      alert(err.message || "Lỗi tải ảnh");
    } finally {
      setUploadingGroomAvatar(false);
      e.target.value = "";
    }
  };

  const handleUploadBrideAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBrideAvatar(true);
      const url = await processAndUploadImage(file, { maxWidth: 600, maxHeight: 600 });
      updateData((prev) => ({ ...prev, bride: { ...prev.bride, avatarUrl: url } }));
      showToast("Đã cập nhật ảnh cô dâu!", "success");
    } catch (err: any) {
      alert(err.message || "Lỗi tải ảnh");
    } finally {
      setUploadingBrideAvatar(false);
      e.target.value = "";
    }
  };

  const handleUploadStoryImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingStoryIdx(idx);
      const url = await processAndUploadImage(file, { maxWidth: 1000, maxHeight: 1000 });
      const newStory = [...data.story];
      newStory[idx].imageUrl = url;
      updateData({ story: newStory });
      showToast("Đã cập nhật ảnh kỷ niệm!", "success");
    } catch (err: any) {
      alert(err.message || "Lỗi tải ảnh");
    } finally {
      setUploadingStoryIdx(null);
      e.target.value = "";
    }
  };

  const handleBatchUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploadingGallery(true);
      const newItems: GalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await processAndUploadImage(file, { maxWidth: 1200, maxHeight: 1200 });
        const nameClean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        newItems.push({
          id: `gal-${Date.now()}-${i}`,
          url,
          title: nameClean || `Ảnh cưới #${data.gallery.length + i + 1}`,
          caption: "Khoảnh khắc trăm năm hạnh phúc",
        });
      }
      updateData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newItems],
      }));
      showToast(`Đã thêm ${newItems.length} ảnh từ máy tính!`, "success");
    } catch (err: any) {
      alert(err.message || "Lỗi tải ảnh");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleReset = () => {
    if (window.confirm("Khôi phục toàn bộ nội dung thiệp cưới về mẫu Việt Cổ ban đầu?")) {
      resetToDefault();
      showToast("Đã khôi phục dữ liệu ban đầu!", "info");
    }
  };

  const handleExportCode = () => {
    const code = exportAsCode();
    const blob = new Blob([code], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wedding.ts");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Đã xuất file data/wedding.ts thành công!", "success");
  };

  const exportRsvpsToCSV = () => {
    if (rsvps.length === 0) {
      showToast("Chưa có phản hồi nào để xuất", "info");
      return;
    }
    const headers = [
      "Họ và tên",
      "Số điện thoại",
      "Khách của",
      "Tham dự",
      "Số người",
      "Lời nhắn / Ghi chú",
      "Email đã gửi tới",
      "Thời gian",
    ];
    const rows = rsvps.map((r) => [
      `"${r.fullName}"`,
      `"${r.phone}"`,
      r.guestOf === "groom" ? "Nhà Trai" : r.guestOf === "bride" ? "Nhà Gái" : "Cả Hai",
      r.attendance === "attending" ? "Có tham dự" : "Vắng mặt",
      r.guestCount,
      `"${(r.dietaryOrNote || "").replace(/"/g, '""')}"`,
      `"${(r.emailSentTo || []).join("; ")}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `danh-sach-khach-cuoi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Đã xuất danh sách khách mời ra file Excel (CSV)!", "success");
  };

  return (
    <div className="min-h-screen bg-[#FAF3E8] text-[#3A2D26] flex flex-col font-sans selection:bg-[#9E3D32] selection:text-[#FFF9EE]">
      {/* Antique Parchment Top Navigation Bar */}
      <header className="h-16 bg-[#FFF9EE] border-b-2 border-[#EADBCE] px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-[#183A3A] hover:text-[#9E3D32] transition-colors p-1.5 rounded-md hover:bg-[#FAF3E8]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Về Thiệp Cưới</span>
          </Link>

          <span className="text-[#EADBCE] hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <RedSealStamp size={28} text="HỶ" className="bg-[#9E3D32] text-[9px] shadow-none" />
            <h1 className="font-serif font-bold text-base text-[#183A3A] tracking-wide flex items-center gap-2">
              <span>Thư Phòng Biên Tập</span>
              <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full bg-[#9E3D32]/10 text-[#9E3D32] border border-[#9E3D32]/30">
                Việt Cổ
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Auto-Save Status & Device Switcher */}
        <div className="flex items-center gap-3">
          {/* Trạng thái chấm son tự động lưu */}
          <div className="flex items-center gap-1.5 text-xs font-serif font-medium px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#EADBCE]">
            {autoSaveStatus === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#9E3D32] animate-ping" />
                <span className="text-[#9E3D32]">Đang chấm mực...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-[#183A3A] hidden sm:inline">Mực son đã lưu</span>
              </>
            )}
          </div>

          {/* Bộ chuyển đổi thiết bị xem trước */}
          <div className="flex items-center bg-[#FAF3E8] p-1 rounded-xl border border-[#EADBCE]">
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                previewDevice === "mobile"
                  ? "bg-[#183A3A] text-[#FFF9EE] shadow-xs"
                  : "text-[#6B5549] hover:text-[#183A3A]"
              }`}
              title="Khung điện thoại"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                previewDevice === "desktop"
                  ? "bg-[#183A3A] text-[#FFF9EE] shadow-xs"
                  : "text-[#6B5549] hover:text-[#183A3A]"
              }`}
              title="Khung máy tính"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            title="Khôi phục dữ liệu ban đầu"
            className="p-2 sm:px-3 sm:py-1.5 rounded-md bg-[#FAF3E8] hover:bg-[#EADBCE] text-[#6B5549] text-xs border border-[#EADBCE] flex items-center gap-1.5 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Khôi Phục</span>
          </button>

          <button
            type="button"
            onClick={handleExportCode}
            title="Tải về file data/wedding.ts để deploy Vercel"
            className="p-2 sm:px-3 sm:py-1.5 rounded-md bg-[#FAF3E8] hover:bg-[#EADBCE] text-[#183A3A] text-xs border border-[#183A3A]/20 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5 text-[#9E3D32]" />
            <span className="hidden md:inline">Xuất wedding.ts</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-1.5 rounded-full bg-[#9E3D32] hover:bg-[#BD4B3F] text-[#FFF9EE] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F4E8D2]" />
            <span>Xem Thiệp</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Body (Split Editor & Live Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Thư phòng biên tập đa Tab */}
        <div className="w-full lg:w-[490px] xl:w-[540px] bg-[#FFF9EE] border-r-2 border-[#EADBCE] flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
          {/* Thẻ bài điều hướng Tab phong cách thẻ giấy dó */}
          <div className="p-2 border-b border-[#EADBCE] grid grid-cols-4 sm:grid-cols-8 gap-1 sticky top-0 bg-[#FFF9EE]/95 backdrop-blur-xs z-20">
            {[
              { id: "couple", label: "Dâu & Rể", icon: Heart },
              { id: "email", label: "Mail RSVP", icon: Mail },
              { id: "time", label: "Thời Gian", icon: Calendar },
              { id: "events", label: "Sự Kiện", icon: Clock },
              { id: "story", label: "Chuyện Mình", icon: Sparkles },
              { id: "gallery", label: "Ảnh Cưới", icon: Camera },
              { id: "bank", label: "Mừng Cưới", icon: CreditCard },
              { id: "rsvps", label: "Khách Mời", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 rounded-lg text-[10px] sm:text-[11px] font-serif font-medium flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? "bg-[#183A3A] text-[#FFF9EE] shadow-xs border border-[#183A3A]"
                      : "text-[#6B5549] hover:bg-[#FAF3E8] border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : "text-[#78928A]"}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Nội dung form chỉnh sửa */}
          <div className="p-5 space-y-6">
            {/* Tab 1: Dâu & Rể */}
            {activeTab === "couple" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Chú Rể */}
                <div className="bg-[#FAF3E8] border border-[#EADBCE] p-4 rounded-xl space-y-3 relative shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5D4B6]">
                    <h3 className="font-serif font-bold text-sm text-[#183A3A]">Thông Tin Chú Rể</h3>
                    <span className="text-[10px] text-[#9E3D32] uppercase font-bold tracking-wider">
                      Nhà Trai
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[#6B5549] block mb-1 font-medium">Họ Và Tên</label>
                      <input
                        type="text"
                        value={data.groom.fullName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, fullName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A] font-serif focus:outline-none focus:border-[#9E3D32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#6B5549] block mb-1 font-medium">Tên Thân Mật</label>
                      <input
                        type="text"
                        value={data.groom.shortName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, shortName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A] font-serif focus:outline-none focus:border-[#9E3D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-medium">Phụ Mẫu Chú Rể</label>
                    <input
                      type="text"
                      value={data.groom.parents}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, parents: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A] focus:outline-none focus:border-[#9E3D32]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-medium">Ảnh Chú Rể</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37] bg-white flex-shrink-0 shadow-xs">
                        {data.groom.avatarUrl && (
                          <Image src={data.groom.avatarUrl} alt="Chú rể" fill className="object-cover" />
                        )}
                        {uploadingGroomAvatar && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#FFF9EE] hover:bg-[#FAF3E8] text-xs font-medium text-[#183A3A] border border-[#EADBCE] cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#9E3D32]" />
                          <span>Tải từ máy</span>
                          <input type="file" accept="image/*" onChange={handleUploadGroomAvatar} className="hidden" />
                        </label>
                        <input
                          type="url"
                          value={data.groom.avatarUrl}
                          placeholder="Hoặc dán URL..."
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              groom: { ...prev.groom, avatarUrl: e.target.value },
                            }))
                          }
                          className="flex-1 bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cô Dâu */}
                <div className="bg-[#FAF3E8] border border-[#EADBCE] p-4 rounded-xl space-y-3 relative shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5D4B6]">
                    <h3 className="font-serif font-bold text-sm text-[#183A3A]">Thông Tin Cô Dâu</h3>
                    <span className="text-[10px] text-[#9E3D32] uppercase font-bold tracking-wider">
                      Nhà Gái
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[#6B5549] block mb-1 font-medium">Họ Và Tên</label>
                      <input
                        type="text"
                        value={data.bride.fullName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, fullName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A] font-serif focus:outline-none focus:border-[#9E3D32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#6B5549] block mb-1 font-medium">Tên Thân Mật</label>
                      <input
                        type="text"
                        value={data.bride.shortName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, shortName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A] font-serif focus:outline-none focus:border-[#9E3D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-medium">Phụ Mẫu Cô Dâu</label>
                    <input
                      type="text"
                      value={data.bride.parents}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, parents: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A] focus:outline-none focus:border-[#9E3D32]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-medium">Ảnh Cô Dâu</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37] bg-white flex-shrink-0 shadow-xs">
                        {data.bride.avatarUrl && (
                          <Image src={data.bride.avatarUrl} alt="Cô dâu" fill className="object-cover" />
                        )}
                        {uploadingBrideAvatar && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#FFF9EE] hover:bg-[#FAF3E8] text-xs font-medium text-[#183A3A] border border-[#EADBCE] cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#9E3D32]" />
                          <span>Tải từ máy</span>
                          <input type="file" accept="image/*" onChange={handleUploadBrideAvatar} className="hidden" />
                        </label>
                        <input
                          type="url"
                          value={data.bride.avatarUrl}
                          placeholder="Hoặc dán URL..."
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              bride: { ...prev.bride, avatarUrl: e.target.value },
                            }))
                          }
                          className="flex-1 bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Cài Đặt Email Phân Luồng RSVP */}
            {activeTab === "email" && (
              <div className="bg-[#FAF3E8] border border-[#EADBCE] p-5 rounded-xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E5D4B6]">
                  <Mail className="w-5 h-5 text-[#9E3D32]" />
                  <h3 className="font-serif font-bold text-sm text-[#183A3A]">
                    Cấu Hình Email Nhận Phản Hồi RSVP
                  </h3>
                </div>

                <div className="p-3 bg-[#FFF9EE] rounded-lg border border-[#EADBCE] text-xs text-[#5A473E] leading-relaxed">
                  💡 <strong>Quy tắc phân luồng tự động:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Khách chọn <strong>Nhà Trai (Bạn Chú Rể)</strong>: Gửi thông báo đến Email Chú Rể.</li>
                    <li>Khách chọn <strong>Nhà Gái (Bạn Cô Dâu)</strong>: Gửi thông báo đến Email Cô Dâu.</li>
                    <li>Khách chọn <strong>Cả Hai</strong>: Gửi thông báo đồng thời cho cả hai email.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-bold">
                      Email Chú Rể (Nhận phản hồi từ khách nhà trai)
                    </label>
                    <input
                      type="email"
                      value={data.contactEmails?.groom || ""}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          contactEmails: { ...prev.contactEmails, groom: e.target.value },
                        }))
                      }
                      placeholder="chure@gmail.com"
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-3 py-2 text-xs text-[#183A3A] font-mono focus:outline-none focus:border-[#9E3D32]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-bold">
                      Email Cô Dâu (Nhận phản hồi từ khách nhà gái)
                    </label>
                    <input
                      type="email"
                      value={data.contactEmails?.bride || ""}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          contactEmails: { ...prev.contactEmails, bride: e.target.value },
                        }))
                      }
                      placeholder="codau@gmail.com"
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-3 py-2 text-xs text-[#183A3A] font-mono focus:outline-none focus:border-[#9E3D32]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Thời Gian & Lời Ngỏ */}
            {activeTab === "time" && (
              <div className="bg-[#FAF3E8] border border-[#EADBCE] p-5 rounded-xl space-y-4 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-sm text-[#183A3A] pb-2 border-b border-[#E5D4B6]">
                  Thời Gian Hôn Lễ & Bức Thư Ngỏ
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-medium">Ngày Dương Lịch</label>
                    <input
                      type="text"
                      value={data.weddingDateFormatted}
                      onChange={(e) => updateData({ weddingDateFormatted: e.target.value })}
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs font-serif text-[#183A3A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B5549] block mb-1 font-medium">Ngày Âm Lịch</label>
                    <input
                      type="text"
                      value={data.lunarDateFormatted}
                      onChange={(e) => updateData({ lunarDateFormatted: e.target.value })}
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#6B5549] block mb-1 font-medium">Chuỗi ISO Cho Đếm Ngược</label>
                  <input
                    type="text"
                    value={data.weddingDate}
                    onChange={(e) => updateData({ weddingDate: e.target.value })}
                    className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs font-mono text-[#183A3A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6B5549] block mb-1 font-medium">Câu Châm Ngôn Trang Chủ</label>
                  <input
                    type="text"
                    value={data.welcomeQuote}
                    onChange={(e) => updateData({ welcomeQuote: e.target.value })}
                    className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs font-serif italic text-[#183A3A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6B5549] block mb-1 font-medium">Link Nhạc Nền (.mp3)</label>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#9E3D32]" />
                    <input
                      type="url"
                      value={data.musicUrl}
                      onChange={(e) => updateData({ musicUrl: e.target.value })}
                      className="flex-1 bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Sự Kiện Cưới */}
            {activeTab === "events" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#183A3A]">
                    Sự Kiện Hôn Lễ ({data.events.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newEvt: WeddingEvent = {
                        id: `evt-${Date.now()}`,
                        title: "LỄ BÁO HỶ MỚI",
                        subtitle: "Nghi lễ",
                        date: data.weddingDateFormatted,
                        isoDate: data.weddingDate,
                        time: "10:30",
                        venue: "Tên nơi tổ chức",
                        address: "Địa chỉ cụ thể",
                        mapUrl: "https://maps.google.com",
                      };
                      updateData((prev) => ({ ...prev, events: [...prev.events, newEvt] }));
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#183A3A] hover:bg-[#2B5757] text-white text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm sự kiện</span>
                  </button>
                </div>

                {data.events.map((evt, idx) => (
                  <div key={evt.id} className="bg-[#FAF3E8] border border-[#EADBCE] p-4 rounded-xl space-y-2.5 relative">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E5D4B6]">
                      <span className="text-xs font-serif font-bold text-[#183A3A]">Sự kiện #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.filter((e) => e.id !== evt.id),
                          }));
                        }}
                        className="text-zinc-400 hover:text-[#9E3D32] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={evt.title}
                        placeholder="Tiêu đề (Lễ Báo Hỷ / Tiệc Cưới)"
                        onChange={(e) => {
                          const evts = [...data.events];
                          evts[idx].title = e.target.value;
                          updateData({ events: evts });
                        }}
                        className="bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs font-serif font-bold text-[#183A3A]"
                      />
                      <input
                        type="text"
                        value={evt.time}
                        placeholder="Giờ (10:30)"
                        onChange={(e) => {
                          const evts = [...data.events];
                          evts[idx].time = e.target.value;
                          updateData({ events: evts });
                        }}
                        className="bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A]"
                      />
                    </div>

                    <input
                      type="text"
                      value={evt.venue}
                      placeholder="Tên địa điểm / Nhà hàng"
                      onChange={(e) => {
                        const evts = [...data.events];
                        evts[idx].venue = e.target.value;
                        updateData({ events: evts });
                      }}
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A]"
                    />

                    <input
                      type="text"
                      value={evt.address}
                      placeholder="Địa chỉ cụ thể"
                      onChange={(e) => {
                        const evts = [...data.events];
                        evts[idx].address = e.target.value;
                        updateData({ events: evts });
                      }}
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#5A473E]"
                    />

                    <input
                      type="url"
                      value={evt.mapUrl}
                      placeholder="Đường dẫn Google Maps"
                      onChange={(e) => {
                        const evts = [...data.events];
                        evts[idx].mapUrl = e.target.value;
                        updateData({ events: evts });
                      }}
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs font-mono text-[#78928A]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Chuyện Tình Yêu */}
            {activeTab === "story" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#183A3A]">
                    Cột Mốc Kỷ Niệm ({data.story.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newMilestone: StoryMilestone = {
                        yearOrDate: "2024",
                        title: "KỶ NIỆM MỚI",
                        description: "Chia sẻ câu chuyện kỷ niệm ngọt ngào của hai bạn...",
                        imageUrl:
                          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
                        location: "Địa điểm",
                      };
                      updateData((prev) => ({ ...prev, story: [...prev.story, newMilestone] }));
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#183A3A] hover:bg-[#2B5757] text-white text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mốc</span>
                  </button>
                </div>

                {data.story.map((item, idx) => (
                  <div key={idx} className="bg-[#FAF3E8] border border-[#EADBCE] p-4 rounded-xl space-y-2.5 relative">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E5D4B6]">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].title = e.target.value;
                            updateData({ story });
                          }}
                          className="w-32 bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2 py-1 text-xs font-serif font-bold text-[#183A3A]"
                        />
                        <input
                          type="text"
                          value={item.yearOrDate}
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].yearOrDate = e.target.value;
                            updateData({ story });
                          }}
                          className="w-20 bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2 py-1 text-xs font-mono font-bold text-[#9E3D32]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateData((prev) => ({
                            ...prev,
                            story: prev.story.filter((_, i) => i !== idx),
                          }));
                        }}
                        className="text-zinc-400 hover:text-[#9E3D32] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const story = [...data.story];
                        story[idx].description = e.target.value;
                        updateData({ story });
                      }}
                      className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md p-2 text-xs text-[#3A2D26] resize-none"
                    />

                    {/* Ảnh mốc kỷ niệm */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-white flex-shrink-0 shadow-xs">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        {uploadingStoryIdx === idx && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF9EE] hover:bg-[#FAF3E8] text-[11px] font-medium text-[#183A3A] border border-[#EADBCE] cursor-pointer">
                          <Upload className="w-3 h-3 text-[#9E3D32]" />
                          <span>Tải ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadStoryImage(idx, e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          value={item.imageUrl}
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].imageUrl = e.target.value;
                            updateData({ story });
                          }}
                          placeholder="Hoặc dán URL..."
                          className="flex-1 bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Album Ảnh Cưới */}
            {activeTab === "gallery" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#183A3A]">
                    Album Ảnh Cưới ({data.gallery.length})
                  </h3>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#9E3D32] hover:bg-[#BD4B3F] text-white text-xs font-medium cursor-pointer shadow-xs transition-all">
                      {uploadingGallery ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Tải nhiều ảnh từ máy</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingGallery}
                        onChange={handleBatchUploadGallery}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const newPhoto: GalleryItem = {
                          id: `gal-${Date.now()}`,
                          url:
                            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
                          title: "Khoảnh khắc mới",
                          caption: "Hạnh phúc trọn vẹn",
                        };
                        updateData((prev) => ({ ...prev, gallery: [...prev.gallery, newPhoto] }));
                      }}
                      className="p-1.5 rounded-md bg-[#FFF9EE] border border-[#EADBCE] hover:bg-[#FAF3E8] text-xs"
                      title="Thêm ảnh qua URL"
                    >
                      <Plus className="w-4 h-4 text-[#183A3A]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {data.gallery.map((item, idx) => (
                    <div key={item.id} className="bg-[#FAF3E8] border border-[#EADBCE] p-2 rounded-xl space-y-1.5 relative group">
                      <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden border border-[#E5D4B6] bg-white">
                        <Image src={item.url} alt={item.title} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            updateData((prev) => ({
                              ...prev,
                              gallery: prev.gallery.filter((g) => g.id !== item.id),
                            }));
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const gallery = [...data.gallery];
                          gallery[idx].title = e.target.value;
                          updateData({ gallery });
                        }}
                        className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2 py-0.5 text-xs font-serif"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 7: Mừng Cưới & QR */}
            {activeTab === "bank" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-sm text-[#183A3A] pb-1 border-b border-[#E5D4B6]">
                  Tài Khoản Mừng Cưới & Mã VietQR
                </h3>

                {data.bankAccounts.map((acc, idx) => (
                  <div key={idx} className="bg-[#FAF3E8] border border-[#EADBCE] p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E5D4B6]">
                      <span className="font-serif font-bold text-xs text-[#183A3A]">
                        {acc.ownerType === "groom" ? "Tài khoản Chú Rể" : "Tài khoản Cô Dâu"}
                      </span>
                      <span className="text-[11px] text-[#9E3D32] uppercase font-bold">
                        {acc.ownerType === "groom" ? data.groom.shortName : data.bride.shortName}
                      </span>
                    </div>

                    <div>
                      <label className="text-xs text-[#6B5549] block mb-1 font-medium">Tên Ngân Hàng</label>
                      <input
                        type="text"
                        value={acc.bankName}
                        onChange={(e) => {
                          const accs = [...data.bankAccounts];
                          accs[idx].bankName = e.target.value;
                          updateData({ bankAccounts: accs });
                        }}
                        className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs text-[#183A3A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-[#6B5549] block mb-1 font-medium">Số Tài Khoản</label>
                        <input
                          type="text"
                          value={acc.accountNumber}
                          onChange={(e) => {
                            const accs = [...data.bankAccounts];
                            accs[idx].accountNumber = e.target.value;
                            if (accs[idx].qrImageUrl.includes("api.vietqr.io")) {
                              accs[idx].qrImageUrl = `https://api.vietqr.io/image/970436-${e.target.value}-compact.jpg?accountName=${encodeURIComponent(
                                accs[idx].accountHolder
                              )}&amount=0`;
                            }
                            updateData({ bankAccounts: accs });
                          }}
                          className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs font-mono font-bold text-[#9E3D32]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#6B5549] block mb-1 font-medium">Chủ Tài Khoản</label>
                        <input
                          type="text"
                          value={acc.accountHolder}
                          onChange={(e) => {
                            const accs = [...data.bankAccounts];
                            accs[idx].accountHolder = e.target.value.toUpperCase();
                            updateData({ bankAccounts: accs });
                          }}
                          className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2.5 py-1.5 text-xs uppercase text-[#183A3A]"
                        />
                      </div>
                    </div>

                    {/* Mã QR */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative w-16 h-16 bg-white p-1 rounded-md border border-[#EADBCE] flex-shrink-0">
                        {acc.qrImageUrl && (
                          <Image src={acc.qrImageUrl} alt="QR" fill className="object-contain p-1" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            const accs = [...data.bankAccounts];
                            accs[idx].qrImageUrl = `https://api.vietqr.io/image/970436-${acc.accountNumber}-compact.jpg?accountName=${encodeURIComponent(
                              acc.accountHolder
                            )}&amount=0`;
                            updateData({ bankAccounts: accs });
                            showToast("Đã tự động cập nhật VietQR!", "success");
                          }}
                          className="text-[11px] text-[#9E3D32] hover:underline block font-semibold"
                        >
                          ⚡ Tự động tạo mã VietQR
                        </button>
                        <input
                          type="url"
                          value={acc.qrImageUrl}
                          onChange={(e) => {
                            const accs = [...data.bankAccounts];
                            accs[idx].qrImageUrl = e.target.value;
                            updateData({ bankAccounts: accs });
                          }}
                          className="w-full bg-[#FFF9EE] border border-[#EADBCE] rounded-md px-2 py-0.5 text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 8: Danh Sách Khách Mời & Lời Chúc */}
            {activeTab === "rsvps" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#FAF3E8] border border-[#EADBCE] p-3 rounded-xl text-center">
                    <div className="text-[10px] uppercase text-[#78928A] font-semibold">Phản Hồi</div>
                    <div className="font-serif font-bold text-lg text-[#183A3A]">{rsvps.length}</div>
                  </div>
                  <div className="bg-[#FAF3E8] border border-[#EADBCE] p-3 rounded-xl text-center">
                    <div className="text-[10px] uppercase text-emerald-700 font-semibold">Tham Dự</div>
                    <div className="font-serif font-bold text-lg text-emerald-700">
                      {rsvps.filter((r) => r.attendance === "attending").length}
                    </div>
                  </div>
                  <div className="bg-[#FAF3E8] border border-[#EADBCE] p-3 rounded-xl text-center">
                    <div className="text-[10px] uppercase text-[#9E3D32] font-semibold">Tổng Khách</div>
                    <div className="font-serif font-bold text-lg text-[#9E3D32]">
                      {rsvps
                        .filter((r) => r.attendance === "attending")
                        .reduce((sum, r) => sum + (r.guestCount || 1), 0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <h4 className="font-serif font-bold text-xs text-[#183A3A]">Danh Sách Khách & Gửi Mail</h4>
                  <button
                    type="button"
                    onClick={exportRsvpsToCSV}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-xs font-medium shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Xuất CSV / Excel</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {loadingGuests ? (
                    <div className="text-center py-6 text-xs text-[#8A7569]">Đang tải...</div>
                  ) : rsvps.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#8A7569] bg-[#FAF3E8] rounded-xl p-4">
                      Chưa có phản hồi nào.
                    </div>
                  ) : (
                    rsvps.map((r, i) => (
                      <div key={i} className="p-3 bg-[#FAF3E8] border border-[#EADBCE] rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#183A3A]">{r.fullName}</span>
                          <span className="font-mono text-[11px] text-[#9E3D32]">{r.phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#5A473E]">
                          <span>
                            {r.guestOf === "groom"
                              ? "Nhà Trai"
                              : r.guestOf === "bride"
                              ? "Nhà Gái"
                              : "Cả Hai"}{" "}
                            • <strong className="text-[#183A3A]">{r.guestCount} người</strong>
                          </span>
                          <span className={r.attendance === "attending" ? "text-emerald-700 font-semibold" : "text-[#8A7569]"}>
                            {r.attendance === "attending" ? "Tham dự" : "Vắng mặt"}
                          </span>
                        </div>

                        {r.emailSentTo && r.emailSentTo.length > 0 && (
                          <div className="text-[10px] text-[#78928A] flex items-center gap-1 pt-1">
                            <Send className="w-2.5 h-2.5 text-[#9E3D32]" />
                            <span>Đã chuyển tới: {r.emailSentTo.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Real-time Live Interactive Preview (Theo ảnh mẫu) */}
        <div className="flex-1 bg-[#102424] p-4 sm:p-6 flex items-center justify-center overflow-hidden relative">
          {previewDevice === "mobile" ? (
            /* Khung điện thoại thông minh viền cong cao cấp theo ảnh mẫu */
            <div className="w-[375px] h-[730px] rounded-[48px] border-[10px] border-[#0c1a1a] shadow-2xl overflow-hidden relative bg-[#FAF3E8] flex flex-col ring-2 ring-[#D4AF37]/20">
              {/* Phone Notch */}
              <div className="h-6 bg-[#0c1a1a] w-36 mx-auto rounded-b-2xl z-50 flex-shrink-0 flex items-center justify-center">
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
              </div>

              {/* Màn hình thiệp cưới tương tác trực tiếp */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
                <WeddingInvitationView isPreview={true} />
              </div>
            </div>
          ) : (
            /* Khung máy tính cổ điển với thanh trình duyệt */
            <div className="w-full h-full max-h-[820px] rounded-2xl border-2 border-[#183A3A] shadow-2xl overflow-hidden flex flex-col bg-[#FAF3E8]">
              <div className="h-8 bg-[#183A3A] px-4 flex items-center gap-2 z-30 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9E3D32]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#78928A]" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-[#112828] rounded-md py-0.5 px-3 text-[11px] text-[#A7BCB6] font-mono text-center truncate">
                  https://an-minh.vn/thiep-cuoi
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pb-16">
                <WeddingInvitationView isPreview={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <WeddingDataProvider>
      <ToastProvider>
        <StudioContent />
      </ToastProvider>
    </WeddingDataProvider>
  );
}
