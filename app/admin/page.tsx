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
  Save,
  RotateCcw,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Loader2,
  Music,
  MapPin,
} from "lucide-react";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";
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
    "couple" | "time" | "events" | "story" | "gallery" | "bank" | "rsvps"
  >("couple");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving">("saved");

  // Local state for RSVPs and Wishes
  const [rsvps, setRsvps] = useState<RSVPSubmission[]>([]);
  const [wishes, setWishes] = useState<WishSubmission[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  // Uploading state
  const [uploadingGroomAvatar, setUploadingGroomAvatar] = useState(false);
  const [uploadingBrideAvatar, setUploadingBrideAvatar] = useState(false);
  const [uploadingStoryIdx, setUploadingStoryIdx] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save whenever data changes
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

  // Fetch RSVP and Wishes when switching to 'rsvps' tab
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
      showToast("Đã cập nhật ảnh chú rể thành công!", "success");
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
      showToast("Đã cập nhật ảnh cô dâu thành công!", "success");
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
      showToast("Đã cập nhật ảnh mốc kỷ niệm!", "success");
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
          caption: "Khoảnh khắc hạnh phúc trọn vẹn",
        });
      }
      updateData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newItems],
      }));
      showToast(`Đã thêm ${newItems.length} ảnh mới từ máy tính!`, "success");
    } catch (err: any) {
      alert(err.message || "Lỗi tải ảnh");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ nội dung về mặc định ban đầu?")) {
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
    showToast("Đã tải xuống file data/wedding.ts mới!", "success");
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
      "Thời gian",
    ];
    const rows = rsvps.map((r) => [
      `"${r.fullName}"`,
      `"${r.phone}"`,
      r.guestOf === "groom" ? "Nhà Trai" : r.guestOf === "bride" ? "Nhà Gái" : "Cả Hai",
      r.attendance === "attending" ? "Có tham dự" : "Vắng mặt",
      r.guestCount,
      `"${(r.dietaryOrNote || "").replace(/"/g, '""')}"`,
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
    showToast("Đã xuất danh sách khách mời ra file CSV!", "success");
  };

  return (
    <div className="min-h-screen bg-[#111625] text-zinc-100 flex flex-col font-sans">
      {/* Studio Top Navigation Bar */}
      <header className="h-16 bg-[#161d31] border-b border-zinc-800 px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Về Thiệp</span>
          </Link>

          <span className="text-zinc-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-base text-[#F4E8D2] tracking-wide flex items-center gap-2">
              <span>Wedding Studio</span>
              <span className="text-[10px] font-sans font-medium uppercase px-2 py-0.5 rounded-full bg-[#9E3D32]/20 text-[#BD4B3F] border border-[#9E3D32]/40">
                Việt Cổ
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Auto-Save Status & Device Switcher */}
        <div className="flex items-center gap-3">
          {/* Auto-save badge */}
          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800">
            {autoSaveStatus === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-400">Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Đã tự động lưu</span>
              </>
            )}
          </div>

          {/* Device Switcher */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                previewDevice === "mobile"
                  ? "bg-[#9E3D32] text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
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
                  ? "bg-[#9E3D32] text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
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
            title="Khôi phục dữ liệu mặc định ban đầu"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Khôi Phục</span>
          </button>

          <button
            type="button"
            onClick={handleExportCode}
            title="Tải về file data/wedding.ts để deploy Vercel"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#F4E8D2]" />
            <span className="hidden md:inline">Xuất wedding.ts</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-full bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all border border-[#78928A]/40"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F4E8D2]" />
            <span>Xem Thiệp</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Body (Split Editor & Live Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Customization Controls & Tabs */}
        <div className="w-full lg:w-[480px] xl:w-[540px] bg-[#161d31] border-r border-zinc-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
          {/* Editor Tabs Navigation */}
          <div className="p-2 border-b border-zinc-800 grid grid-cols-7 gap-1 sticky top-0 bg-[#161d31] z-20">
            {[
              { id: "couple", label: "Dâu & Rể", icon: Heart },
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
                  className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? "bg-[#9E3D32]/20 text-[#F4E8D2] border border-[#9E3D32]/50 shadow-xs"
                      : "text-zinc-400 hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#BD4B3F]" : "text-zinc-400"}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="p-5 space-y-6">
            {/* Tab 1: Dâu & Rể */}
            {activeTab === "couple" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Chú Rể */}
                <div className="bg-[#1c243c] border border-zinc-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <h3 className="font-serif font-bold text-sm text-[#F4E8D2]">Thông Tin Chú Rể</h3>
                    <span className="text-[11px] text-[#BD4B3F] uppercase font-semibold">Nhà Trai</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1">Họ Tên Đầy Đủ</label>
                      <input
                        type="text"
                        value={data.groom.fullName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, fullName: e.target.value },
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 text-xs block mb-1">Tên Gọi Ngắn</label>
                      <input
                        type="text"
                        value={data.groom.shortName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, shortName: e.target.value },
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 text-xs block mb-1">Phụ Mẫu Chú Rể</label>
                    <input
                      type="text"
                      value={data.groom.parents}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, parents: e.target.value },
                        }))
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                    />
                  </div>

                  {/* Ảnh Chú rể */}
                  <div>
                    <label className="text-zinc-400 text-xs block mb-1">Ảnh Chú Rể</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900 flex-shrink-0">
                        {data.groom.avatarUrl ? (
                          <Image src={data.groom.avatarUrl} alt="Chú rể" fill className="object-cover" />
                        ) : null}
                        {uploadingGroomAvatar && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#BD4B3F]" />
                          <span>Tải ảnh từ máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadGroomAvatar}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="url"
                          value={data.groom.avatarUrl}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              groom: { ...prev.groom, avatarUrl: e.target.value },
                            }))
                          }
                          placeholder="Hoặc dán URL ảnh..."
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cô Dâu */}
                <div className="bg-[#1c243c] border border-zinc-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <h3 className="font-serif font-bold text-sm text-[#F4E8D2]">Thông Tin Cô Dâu</h3>
                    <span className="text-[11px] text-[#BD4B3F] uppercase font-semibold">Nhà Gái</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1">Họ Tên Đầy Đủ</label>
                      <input
                        type="text"
                        value={data.bride.fullName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, fullName: e.target.value },
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 text-xs block mb-1">Tên Gọi Ngắn</label>
                      <input
                        type="text"
                        value={data.bride.shortName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, shortName: e.target.value },
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 text-xs block mb-1">Phụ Mẫu Cô Dâu</label>
                    <input
                      type="text"
                      value={data.bride.parents}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, parents: e.target.value },
                        }))
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                    />
                  </div>

                  {/* Ảnh Cô dâu */}
                  <div>
                    <label className="text-zinc-400 text-xs block mb-1">Ảnh Cô Dâu</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900 flex-shrink-0">
                        {data.bride.avatarUrl ? (
                          <Image src={data.bride.avatarUrl} alt="Cô dâu" fill className="object-cover" />
                        ) : null}
                        {uploadingBrideAvatar && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#BD4B3F]" />
                          <span>Tải ảnh từ máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadBrideAvatar}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="url"
                          value={data.bride.avatarUrl}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              bride: { ...prev.bride, avatarUrl: e.target.value },
                            }))
                          }
                          placeholder="Hoặc dán URL ảnh..."
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#BD4B3F]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Thời Gian & Lời Ngỏ */}
            {activeTab === "time" && (
              <div className="bg-[#1c243c] border border-zinc-800 p-4 rounded-xl space-y-4 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-sm text-[#F4E8D2] pb-2 border-b border-zinc-800">
                  Thời Gian Hôn Lễ & Bức Thư Ngỏ
                </h3>

                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Ngày Cưới (Dương Lịch)</label>
                  <input
                    type="text"
                    value={data.weddingDateFormatted}
                    onChange={(e) => updateData({ weddingDateFormatted: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Ngày Âm Lịch</label>
                  <input
                    type="text"
                    value={data.lunarDateFormatted}
                    onChange={(e) => updateData({ lunarDateFormatted: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-xs block mb-1">
                    Chuỗi ISO Cho Đồng Hồ Đếm Ngược
                  </label>
                  <input
                    type="text"
                    value={data.weddingDate}
                    onChange={(e) => updateData({ weddingDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-300"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Câu Châm Ngôn Trang Chủ</label>
                  <input
                    type="text"
                    value={data.welcomeQuote}
                    onChange={(e) => updateData({ welcomeQuote: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Link Nhạc Nền (.mp3)</label>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#BD4B3F]" />
                    <input
                      type="url"
                      value={data.musicUrl}
                      onChange={(e) => updateData({ musicUrl: e.target.value })}
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                  </div>
                </div>

                {/* Đoạn thư ngỏ */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <label className="text-zinc-400 text-xs block font-medium">Bức Thư Ngỏ</label>
                  {data.openingLetter.content.map((para, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        rows={2}
                        value={para}
                        onChange={(e) => {
                          const newContent = [...data.openingLetter.content];
                          newContent[idx] = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            openingLetter: { ...prev.openingLetter, content: newContent },
                          }));
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newContent = data.openingLetter.content.filter((_, i) => i !== idx);
                          updateData((prev) => ({
                            ...prev,
                            openingLetter: { ...prev.openingLetter, content: newContent },
                          }));
                        }}
                        className="p-1.5 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      updateData((prev) => ({
                        ...prev,
                        openingLetter: {
                          ...prev.openingLetter,
                          content: [...prev.openingLetter.content, "Đoạn tâm sự mới..."],
                        },
                      }));
                    }}
                    className="flex items-center gap-1 text-xs text-[#BD4B3F] hover:underline pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm đoạn thư ngỏ</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Sự Kiện Cưới */}
            {activeTab === "events" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#F4E8D2]">
                    Sự Kiện Cưới ({data.events.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newEvt: WeddingEvent = {
                        id: `evt-${Date.now()}`,
                        title: "Lễ Cưới Mới",
                        subtitle: "Nghi lễ",
                        date: data.weddingDateFormatted,
                        isoDate: data.weddingDate,
                        time: "10:30",
                        venue: "Tên nơi tổ chức",
                        address: "Địa chỉ chi tiết",
                        mapUrl: "https://maps.google.com",
                      };
                      updateData((prev) => ({ ...prev, events: [...prev.events, newEvt] }));
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#9E3D32] hover:bg-[#BD4B3F] text-white text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm sự kiện</span>
                  </button>
                </div>

                {data.events.map((evt, idx) => (
                  <div key={evt.id} className="bg-[#1c243c] border border-zinc-800 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                      <span className="text-xs font-serif font-bold text-[#F4E8D2]">Sự kiện #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.filter((e) => e.id !== evt.id),
                          }));
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={evt.title}
                        placeholder="Tiêu đề (Lễ Thành Hôn)"
                        onChange={(e) => {
                          const evts = [...data.events];
                          evts[idx].title = e.target.value;
                          updateData({ events: evts });
                        }}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs"
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
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs"
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs"
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs"
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-400"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Chuyện Mình */}
            {activeTab === "story" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#F4E8D2]">
                    Cột Mốc Kỷ Niệm ({data.story.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newMilestone: StoryMilestone = {
                        yearOrDate: "Năm mới",
                        title: "Kỷ Niệm Mới",
                        description: "Kể về một kỷ niệm đáng nhớ của hai người...",
                        imageUrl:
                          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
                        location: "Địa điểm",
                      };
                      updateData((prev) => ({ ...prev, story: [...prev.story, newMilestone] }));
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#9E3D32] hover:bg-[#BD4B3F] text-white text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mốc kỷ niệm</span>
                  </button>
                </div>

                {data.story.map((item, idx) => (
                  <div key={idx} className="bg-[#1c243c] border border-zinc-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.yearOrDate}
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].yearOrDate = e.target.value;
                            updateData({ story });
                          }}
                          className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold text-[#BD4B3F]"
                        />
                        <input
                          type="text"
                          value={item.location || ""}
                          placeholder="Địa điểm"
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].location = e.target.value;
                            updateData({ story });
                          }}
                          className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-300"
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
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      placeholder="Tiêu đề mốc kỷ niệm"
                      onChange={(e) => {
                        const story = [...data.story];
                        story[idx].title = e.target.value;
                        updateData({ story });
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-100"
                    />

                    <textarea
                      rows={2}
                      value={item.description}
                      placeholder="Nội dung kỷ niệm..."
                      onChange={(e) => {
                        const story = [...data.story];
                        story[idx].description = e.target.value;
                        updateData({ story });
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 resize-none"
                    />

                    {/* Ảnh mốc kỷ niệm */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        {uploadingStoryIdx === idx && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] font-medium text-zinc-300 border border-zinc-700 cursor-pointer">
                          <Upload className="w-3 h-3 text-[#BD4B3F]" />
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
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Album Ảnh Cưới */}
            {activeTab === "gallery" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#F4E8D2]">
                    Album Ảnh Cưới ({data.gallery.length})
                  </h3>

                  <div className="flex items-center gap-2">
                    {/* Batch Upload from Computer */}
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9E3D32] hover:bg-[#BD4B3F] text-white text-xs font-medium cursor-pointer shadow-xs transition-all">
                      {uploadingGallery ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Chọn nhiều ảnh từ máy</span>
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
                          title: "Ảnh cưới mới",
                          caption: "Khoảnh khắc tuyệt đẹp",
                        };
                        updateData((prev) => ({ ...prev, gallery: [...prev.gallery, newPhoto] }));
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-xs"
                      title="Thêm ảnh bằng URL"
                    >
                      <Plus className="w-4 h-4 text-zinc-300" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {data.gallery.map((item, idx) => (
                    <div key={item.id} className="bg-[#1c243c] border border-zinc-800 p-2.5 rounded-xl space-y-2 relative group">
                      <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900">
                        <Image src={item.url} alt={item.title} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            updateData((prev) => ({
                              ...prev,
                              gallery: prev.gallery.filter((g) => g.id !== item.id),
                            }));
                          }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.title}
                        placeholder="Tiêu đề ảnh"
                        onChange={(e) => {
                          const gallery = [...data.gallery];
                          gallery[idx].title = e.target.value;
                          updateData({ gallery });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs"
                      />

                      <input
                        type="url"
                        value={item.url}
                        placeholder="Link URL ảnh"
                        onChange={(e) => {
                          const gallery = [...data.gallery];
                          gallery[idx].url = e.target.value;
                          updateData({ gallery });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-0.5 text-[11px] text-zinc-400 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Mừng Cưới & QR */}
            {activeTab === "bank" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-sm text-[#F4E8D2] pb-1 border-b border-zinc-800">
                  Tài Khoản Mừng Cưới & Mã QR
                </h3>

                {data.bankAccounts.map((acc, idx) => (
                  <div key={idx} className="bg-[#1c243c] border border-zinc-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                      <span className="font-serif font-bold text-xs text-[#F4E8D2]">
                        {acc.ownerType === "groom" ? "Tài khoản Chú Rể" : "Tài khoản Cô Dâu"}
                      </span>
                      <span className="text-[11px] text-[#BD4B3F] uppercase font-semibold">
                        {acc.ownerType === "groom" ? "Quang Minh" : "Thục An"}
                      </span>
                    </div>

                    <div>
                      <label className="text-zinc-400 text-xs block mb-1">Tên Ngân Hàng</label>
                      <input
                        type="text"
                        value={acc.bankName}
                        onChange={(e) => {
                          const accs = [...data.bankAccounts];
                          accs[idx].bankName = e.target.value;
                          updateData({ bankAccounts: accs });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1">Số Tài Khoản</label>
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
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-[#BD4B3F]"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-400 text-xs block mb-1">Chủ Tài Khoản</label>
                        <input
                          type="text"
                          value={acc.accountHolder}
                          onChange={(e) => {
                            const accs = [...data.bankAccounts];
                            accs[idx].accountHolder = e.target.value.toUpperCase();
                            updateData({ bankAccounts: accs });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs uppercase text-zinc-100"
                        />
                      </div>
                    </div>

                    {/* Mã QR */}
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1">Mã QR Thanh Toán</label>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 bg-white p-1 rounded-lg border border-zinc-700 flex-shrink-0">
                          {acc.qrImageUrl && (
                            <Image src={acc.qrImageUrl} alt="QR code" fill className="object-contain p-1" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const accs = [...data.bankAccounts];
                              accs[idx].qrImageUrl = `https://api.vietqr.io/image/970436-${acc.accountNumber}-compact.jpg?accountName=${encodeURIComponent(
                                acc.accountHolder
                              )}&amount=0`;
                              updateData({ bankAccounts: accs });
                              showToast("Đã tự động tạo mã VietQR theo STK!", "success");
                            }}
                            className="text-[11px] text-[#BD4B3F] hover:underline block"
                          >
                            ⚡ Tạo tự động bằng VietQR
                          </button>
                          <input
                            type="url"
                            value={acc.qrImageUrl}
                            onChange={(e) => {
                              const accs = [...data.bankAccounts];
                              accs[idx].qrImageUrl = e.target.value;
                              updateData({ bankAccounts: accs });
                            }}
                            placeholder="Hoặc dán URL ảnh QR..."
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 7: Khách Mời & Lời Chúc */}
            {activeTab === "rsvps" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#1c243c] border border-zinc-800 p-3 rounded-xl text-center">
                    <div className="text-[10px] uppercase text-zinc-400">Phản Hồi</div>
                    <div className="font-bold text-lg text-[#F4E8D2]">{rsvps.length}</div>
                  </div>
                  <div className="bg-[#1c243c] border border-zinc-800 p-3 rounded-xl text-center">
                    <div className="text-[10px] uppercase text-emerald-400">Tham Dự</div>
                    <div className="font-bold text-lg text-emerald-400">
                      {rsvps.filter((r) => r.attendance === "attending").length}
                    </div>
                  </div>
                  <div className="bg-[#1c243c] border border-zinc-800 p-3 rounded-xl text-center">
                    <div className="text-[10px] uppercase text-zinc-400">Tổng Khách</div>
                    <div className="font-bold text-lg text-[#BD4B3F]">
                      {rsvps
                        .filter((r) => r.attendance === "attending")
                        .reduce((sum, r) => sum + (r.guestCount || 1), 0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <h4 className="font-serif font-bold text-xs text-[#F4E8D2]">Danh Sách Khách</h4>
                  <button
                    type="button"
                    onClick={exportRsvpsToCSV}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-xs font-medium"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#F4E8D2]" />
                    <span>Xuất CSV / Excel</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {loadingGuests ? (
                    <div className="text-center py-6 text-xs text-zinc-500">Đang tải...</div>
                  ) : rsvps.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-500 bg-[#1c243c] rounded-xl p-4">
                      Chưa có phản hồi nào.
                    </div>
                  ) : (
                    rsvps.map((r, i) => (
                      <div key={i} className="p-3 bg-[#1c243c] border border-zinc-800 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-100">{r.fullName}</span>
                          <span className="font-mono text-[11px] text-zinc-400">{r.phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>
                            {r.guestOf === "groom" ? "Nhà Trai" : r.guestOf === "bride" ? "Nhà Gái" : "Cả Hai"} •{" "}
                            <strong className="text-zinc-200">{r.guestCount} người</strong>
                          </span>
                          <span className={r.attendance === "attending" ? "text-emerald-400" : "text-zinc-500"}>
                            {r.attendance === "attending" ? "Sẽ tham dự" : "Vắng mặt"}
                          </span>
                        </div>
                        {r.dietaryOrNote && (
                          <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800/80">
                            &ldquo;{r.dietaryOrNote}&rdquo;
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Real-time Live Interactive Preview Container */}
        <div className="flex-1 bg-[#090d18] p-4 sm:p-6 flex items-center justify-center overflow-hidden relative">
          {previewDevice === "mobile" ? (
            /* Khung điện thoại thông minh (Phone Mockup Frame) */
            <div className="w-[375px] h-[720px] rounded-[48px] border-[10px] border-zinc-800 shadow-2xl overflow-hidden relative bg-[#FAF3E8] flex flex-col ring-1 ring-zinc-700/50">
              {/* Phone Notch */}
              <div className="h-6 bg-zinc-800 w-36 mx-auto rounded-b-2xl z-50 flex-shrink-0 flex items-center justify-center">
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
              </div>

              {/* Phone Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <WeddingInvitationView isPreview={true} />
              </div>
            </div>
          ) : (
            /* Khung máy tính (Desktop Browser Frame) */
            <div className="w-full h-full max-h-[820px] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col bg-[#FAF3E8] ring-1 ring-zinc-700/50">
              {/* Browser Window Bar */}
              <div className="h-8 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center gap-2 z-30 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-zinc-800 rounded-md py-0.5 px-3 text-[11px] text-zinc-400 font-mono text-center truncate">
                  https://an-minh.vn/wedding-invitation
                </div>
              </div>

              {/* Desktop Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto">
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
