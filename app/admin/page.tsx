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
  Share2,
  Copy,
  Check,
  Lock,
  QrCode,
  Sliders,
} from "lucide-react";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";
import { ShareModal } from "@/components/invitation/ShareModal";
import { VietnameseLotus, RedSealStamp } from "@/components/ui/VietnamesePattern";
import { processAndUploadImage } from "@/utils/imageUpload";
import {
  RSVPSubmission,
  WishSubmission,
  WeddingEvent,
  StoryMilestone,
  GalleryItem,
} from "@/types/wedding";

const ADMIN_TABS = [
  { id: "couple", label: "Đôi Uyên Ương", icon: Heart, badge: "Dâu & Rể" },
  { id: "email", label: "Chia Sẻ & Email", icon: Share2, badge: "Link & Mail" },
  { id: "time", label: "Thời Gian & Nhạc", icon: Calendar, badge: "Lịch & Âm nhạc" },
  { id: "events", label: "Sự Kiện Cưới", icon: Clock, badge: "Địa điểm" },
  { id: "story", label: "Chuyện Chúng Mình", icon: Sparkles, badge: "Timeline" },
  { id: "gallery", label: "Album Ảnh Cưới", icon: Camera, badge: "Hình ảnh" },
  { id: "bank", label: "Mừng Cưới & QR", icon: CreditCard, badge: "Tài khoản" },
  { id: "rsvps", label: "Khách Mời RSVP", icon: Users, badge: "Phản hồi" },
] as const;

type TabId = (typeof ADMIN_TABS)[number]["id"];

function StudioContent() {
  const { data, updateData, saveChanges, resetToDefault, exportAsCode } = useWeddingData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>("couple");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving">("saved");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

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
    if (window.confirm("Khôi phục toàn bộ nội dung thiệp cưới về mẫu ban đầu?")) {
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
    <div className="min-h-screen bg-[#F7F4EE] text-[#5C4033] flex flex-col font-sans selection:bg-[#C4715A] selection:text-[#FDFAF5]">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="h-16 bg-[#FFFDF9] border-b border-[#E8D5CF] px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#5C4033] hover:text-[#4A6741] transition-colors p-1.5 rounded-lg hover:bg-[#F0F5EE]"
          >
            <ArrowLeft className="w-4 h-4 text-[#4A6741]" />
            <span className="hidden sm:inline font-medium">Về Thiệp Cưới</span>
          </Link>

          <span className="text-[#E8D5CF] hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#4A6741] text-[#FDFAF5] flex items-center justify-center font-serif text-xs font-bold shadow-2xs">
              HỶ
            </div>
            <h1 className="font-serif font-bold text-base text-[#354D2E] tracking-wide flex items-center gap-2">
              <span>Studio Chỉnh Sửa</span>
              <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full bg-[#4A6741]/10 text-[#4A6741] border border-[#4A6741]/20">
                Botanical
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Status & Device Switcher */}
        <div className="flex items-center gap-3">
          {/* Trạng thái tự động lưu */}
          <div className="flex items-center gap-1.5 text-xs font-serif font-medium px-3 py-1 rounded-full bg-[#F0F5EE] border border-[#A8BCA1]/40">
            {autoSaveStatus === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#C4715A] animate-ping" />
                <span className="text-[#C4715A]">Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-[#4A6741] hidden sm:inline">Đã lưu tự động</span>
              </>
            )}
          </div>

          {/* Device Switcher */}
          <div className="flex items-center bg-[#F0F5EE] p-1 rounded-xl border border-[#A8BCA1]/30">
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                previewDevice === "mobile"
                  ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                  : "text-[#8C6A58] hover:text-[#354D2E]"
              }`}
              title="Khung điện thoại"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                previewDevice === "desktop"
                  ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                  : "text-[#8C6A58] hover:text-[#354D2E]"
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
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#FDFAF5] hover:bg-[#FDF0EC] text-[#8C6A58] text-xs border border-[#E8D5CF] flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Khôi Phục</span>
          </button>

          <button
            type="button"
            onClick={handleExportCode}
            title="Tải về file data/wedding.ts để deploy Vercel"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#FDFAF5] hover:bg-[#F0F5EE] text-[#4A6741] text-xs border border-[#A8BCA1]/40 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C4715A]" />
            <span className="hidden md:inline">Xuất wedding.ts</span>
          </button>

          {/* Chia sẻ link cho khách */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="hidden sm:inline">Chia Sẻ Link Khách</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-1.5 rounded-full bg-[#C4715A] hover:bg-[#A4503B] text-[#FDFAF5] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FDFAF5]" />
            <span>Xem Thiệp</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN STUDIO BODY (SPLIT EDITOR & PREVIEW) ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Sidebar Tabs + Form Content */}
        <div className="w-full lg:w-[500px] xl:w-[540px] bg-[#FFFDF9] border-r border-[#E8D5CF] flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          {/* Tabs thanh cuộn ngang hoặc grid */}
          <div className="p-2 border-b border-[#E8D5CF] bg-[#FDFAF5] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-serif font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                      : "text-[#5C4033] hover:bg-[#F0F5EE] border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C9A84C]" : "text-[#8C6A58]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. DÂU & RỂ */}
            {activeTab === "couple" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Chú Rể */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <h3 className="font-serif font-bold text-sm text-[#354D2E]">Thông Tin Chú Rể</h3>
                    <span className="text-[10px] text-[#4A6741] bg-[#F0F5EE] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      Nhà Trai
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Họ Và Tên</label>
                      <input
                        type="text"
                        value={data.groom.fullName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, fullName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-serif focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Tên Thân Mật</label>
                      <input
                        type="text"
                        value={data.groom.shortName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, shortName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-serif focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Phụ Mẫu Chú Rể</label>
                    <input
                      type="text"
                      value={data.groom.parents}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, parents: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Ảnh Chú Rể</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A6741] bg-white shrink-0 shadow-2xs">
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
                        <label className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F0F5EE] hover:bg-[#E2EBDD] text-xs font-semibold text-[#4A6741] border border-[#A8BCA1]/40 cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải ảnh</span>
                          <input type="file" accept="image/*" onChange={handleUploadGroomAvatar} className="hidden" />
                        </label>
                        <input
                          type="url"
                          value={data.groom.avatarUrl}
                          placeholder="Hoặc dán URL ảnh..."
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              groom: { ...prev.groom, avatarUrl: e.target.value },
                            }))
                          }
                          className="flex-1 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cô Dâu */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <h3 className="font-serif font-bold text-sm text-[#354D2E]">Thông Tin Cô Dâu</h3>
                    <span className="text-[10px] text-[#C4715A] bg-[#FDF0EC] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      Nhà Gái
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Họ Và Tên</label>
                      <input
                        type="text"
                        value={data.bride.fullName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, fullName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-serif focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Tên Thân Mật</label>
                      <input
                        type="text"
                        value={data.bride.shortName}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, shortName: e.target.value },
                          }))
                        }
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-serif focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Phụ Mẫu Cô Dâu</label>
                    <input
                      type="text"
                      value={data.bride.parents}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, parents: e.target.value },
                        }))
                      }
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Ảnh Cô Dâu</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C4715A] bg-white shrink-0 shadow-2xs">
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
                        <label className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FDF0EC] hover:bg-[#F5E2DB] text-xs font-semibold text-[#C4715A] border border-[#E8D5CF] cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải ảnh</span>
                          <input type="file" accept="image/*" onChange={handleUploadBrideAvatar} className="hidden" />
                        </label>
                        <input
                          type="url"
                          value={data.bride.avatarUrl}
                          placeholder="Hoặc dán URL ảnh..."
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              bride: { ...prev.bride, avatarUrl: e.target.value },
                            }))
                          }
                          className="flex-1 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CHIA SẺ & MAIL */}
            {activeTab === "email" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Slug link rút gọn */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-5 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#C4715A]" />
                      <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                        Đường Dẫn Rút Gọn (Short Link)
                      </h3>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                      <Lock className="w-2.5 h-2.5" />
                      Chỉ Đọc (Read-Only)
                    </span>
                  </div>

                  <p className="text-xs text-[#5C4033] leading-relaxed">
                    Link rút gọn chia sẻ cho khách qua Zalo / Facebook. Link này <strong>ẩn toàn bộ nút Admin</strong> và <strong>không thể chỉnh sửa</strong>.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8C6A58] block font-bold">
                      Tùy Chỉnh Định Danh (Slug)
                    </label>
                    <div className="flex items-center">
                      <span className="bg-[#F0F5EE] text-[#4A6741] px-3 py-2 rounded-l-xl text-xs font-mono font-bold border border-r-0 border-[#E8D5CF]">
                        /i/
                      </span>
                      <input
                        type="text"
                        value={data.slug || "quyet-han"}
                        onChange={(e) =>
                          updateData({
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        placeholder="quyet-han"
                        className="flex-1 bg-[#FFFDF9] border border-[#E8D5CF] rounded-r-xl px-3 py-2 text-xs text-[#354D2E] font-mono font-bold focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C6A58]">
                      Link gửi khách thực tế:
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#C4715A] truncate">
                        {`${origin}/i/${data.slug || "quyet-han"}`}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          const link = `${origin}/i/${data.slug || "quyet-han"}`;
                          await navigator.clipboard.writeText(link);
                          showToast("Đã sao chép link rút gọn cho khách!", "success");
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-medium transition-all active:scale-95 shrink-0 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao Chép</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#C4715A] hover:bg-[#A4503B] text-[#FDFAF5] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Mở Mã QR &amp; Chia Sẻ</span>
                    </button>

                    <a
                      href={`/i/${data.slug || "quyet-han"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#FFFDF9] hover:bg-[#F0F5EE] border border-[#E8D5CF] text-[#354D2E] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#4A6741]" />
                      <span>Xem Thử</span>
                    </a>
                  </div>
                </div>

                {/* Phân luồng email */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-5 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5CF]">
                    <Mail className="w-4 h-4 text-[#4A6741]" />
                    <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                      Email Phân Luồng Nhận Phản Hồi RSVP
                    </h3>
                  </div>

                  <p className="text-xs text-[#5C4033]">
                    Phản hồi từ khách Nhà Trai gửi về mail Chú Rể; Nhà Gái về mail Cô Dâu; Cả Hai gửi tới cả hai mail.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                        Email Chú Rể (Khách Nhà Trai)
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
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                        Email Cô Dâu (Khách Nhà Gái)
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
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. THỜI GIAN & NHẠC */}
            {activeTab === "time" && (
              <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-5 rounded-2xl space-y-4 shadow-2xs animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-sm text-[#354D2E] pb-2 border-b border-[#E8D5CF]">
                  Thời Gian Hôn Lễ &amp; Lời Mở Đầu
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Ngày Dương Lịch</label>
                    <input
                      type="text"
                      value={data.weddingDateFormatted}
                      onChange={(e) => updateData({ weddingDateFormatted: e.target.value })}
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-serif text-[#354D2E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Ngày Âm Lịch</label>
                    <input
                      type="text"
                      value={data.lunarDateFormatted}
                      onChange={(e) => updateData({ lunarDateFormatted: e.target.value })}
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Chuỗi ISO Cho Đếm Ngược</label>
                  <input
                    type="text"
                    value={data.weddingDate}
                    onChange={(e) => updateData({ weddingDate: e.target.value })}
                    className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-mono text-[#354D2E]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Câu Châm Ngôn Bìa Thiệp</label>
                  <input
                    type="text"
                    value={data.welcomeQuote}
                    onChange={(e) => updateData({ welcomeQuote: e.target.value })}
                    className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-serif italic text-[#354D2E]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Link Nhạc Nền (.mp3)</label>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#4A6741]" />
                    <input
                      type="url"
                      value={data.musicUrl}
                      onChange={(e) => updateData({ musicUrl: e.target.value })}
                      className="flex-1 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. SỰ KIỆN CƯỚI */}
            {activeTab === "events" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#354D2E]">
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
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm sự kiện</span>
                  </button>
                </div>

                {data.events.map((evt, idx) => (
                  <div key={evt.id} className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 rounded-2xl space-y-2.5 relative shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E8D5CF]">
                      <span className="text-xs font-serif font-bold text-[#354D2E]">Sự kiện #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.filter((e) => e.id !== evt.id),
                          }));
                        }}
                        className="text-zinc-400 hover:text-[#C4715A] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={evt.title}
                        placeholder="Tiêu đề sự kiện"
                        onChange={(e) => {
                          const evts = [...data.events];
                          evts[idx].title = e.target.value;
                          updateData({ events: evts });
                        }}
                        className="bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs font-serif font-bold text-[#354D2E]"
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
                        className="bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#354D2E]"
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
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#354D2E]"
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
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#5C4033]"
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
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs font-mono text-[#4A6741]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 5. CHUYỆN CHÚNG MÌNH */}
            {activeTab === "story" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                    Cột Mốc Kỷ Niệm ({data.story.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newMilestone: StoryMilestone = {
                        yearOrDate: "2024",
                        title: "KỶ NIỆM MỚI",
                        description: "Chia sẻ câu chuyện kỷ niệm của hai bạn...",
                        imageUrl:
                          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
                        location: "Địa điểm",
                      };
                      updateData((prev) => ({ ...prev, story: [...prev.story, newMilestone] }));
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mốc</span>
                  </button>
                </div>

                {data.story.map((item, idx) => (
                  <div key={idx} className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 rounded-2xl space-y-2.5 relative shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E8D5CF]">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].title = e.target.value;
                            updateData({ story });
                          }}
                          className="w-36 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-2.5 py-1 text-xs font-serif font-bold text-[#354D2E]"
                        />
                        <input
                          type="text"
                          value={item.yearOrDate}
                          onChange={(e) => {
                            const story = [...data.story];
                            story[idx].yearOrDate = e.target.value;
                            updateData({ story });
                          }}
                          className="w-20 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-[#C4715A]"
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
                        className="text-zinc-400 hover:text-[#C4715A] p-1 cursor-pointer"
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
                      className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl p-2.5 text-xs text-[#5C4033] resize-none"
                    />

                    {/* Ảnh kỷ niệm */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A84C] bg-white shrink-0 shadow-2xs">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        {uploadingStoryIdx === idx && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <label className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0F5EE] hover:bg-[#E2EBDD] text-[11px] font-semibold text-[#4A6741] border border-[#A8BCA1]/40 cursor-pointer">
                          <Upload className="w-3 h-3 text-[#4A6741]" />
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
                          placeholder="Hoặc dán URL ảnh..."
                          className="flex-1 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-2.5 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. ALBUM ẢNH CƯỚI */}
            {activeTab === "gallery" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                    Album Ảnh Cưới ({data.gallery.length})
                  </h3>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C4715A] hover:bg-[#A4503B] text-white text-xs font-semibold cursor-pointer shadow-xs transition-all">
                      {uploadingGallery ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Tải nhiều ảnh</span>
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
                      className="p-2 rounded-xl bg-[#FFFDF9] border border-[#E8D5CF] hover:bg-[#F0F5EE] text-xs"
                      title="Thêm ảnh qua URL"
                    >
                      <Plus className="w-4 h-4 text-[#4A6741]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {data.gallery.map((item, idx) => (
                    <div key={item.id} className="bg-[#FDFAF5] border border-[#E8D5CF] p-2 rounded-2xl space-y-1.5 relative group shadow-2xs">
                      <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-[#E8D5CF] bg-white">
                        <Image src={item.url} alt={item.title} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            updateData((prev) => ({
                              ...prev,
                              gallery: prev.gallery.filter((g) => g.id !== item.id),
                            }));
                          }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-lg px-2 py-1 text-xs font-serif"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. MỪNG CƯỚI & QR */}
            {activeTab === "bank" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-sm text-[#354D2E] pb-1 border-b border-[#E8D5CF]">
                  Tài Khoản Mừng Cưới &amp; Mã VietQR
                </h3>

                {data.bankAccounts.map((acc, idx) => (
                  <div key={idx} className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 rounded-2xl space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E8D5CF]">
                      <span className="font-serif font-bold text-xs text-[#354D2E]">
                        {acc.ownerType === "groom" ? "Tài khoản Chú Rể" : "Tài khoản Cô Dâu"}
                      </span>
                      <span className="text-[11px] text-[#C4715A] uppercase font-bold">
                        {acc.ownerType === "groom" ? data.groom.shortName : data.bride.shortName}
                      </span>
                    </div>

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Tên Ngân Hàng</label>
                      <input
                        type="text"
                        value={acc.bankName}
                        onChange={(e) => {
                          const accs = [...data.bankAccounts];
                          accs[idx].bankName = e.target.value;
                          updateData({ bankAccounts: accs });
                        }}
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#354D2E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Số Tài Khoản</label>
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
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#C4715A]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Chủ Tài Khoản</label>
                        <input
                          type="text"
                          value={acc.accountHolder}
                          onChange={(e) => {
                            const accs = [...data.bankAccounts];
                            accs[idx].accountHolder = e.target.value.toUpperCase();
                            updateData({ bankAccounts: accs });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs uppercase text-[#354D2E]"
                        />
                      </div>
                    </div>

                    {/* QR Code preview & auto generator */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative w-16 h-16 bg-white p-1 rounded-xl border border-[#E8D5CF] shrink-0">
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
                            showToast("Đã tự động tạo mã VietQR!", "success");
                          }}
                          className="text-[11px] text-[#C4715A] hover:underline block font-semibold cursor-pointer"
                        >
                          ⚡ Tự động tạo VietQR
                        </button>
                        <input
                          type="url"
                          value={acc.qrImageUrl}
                          onChange={(e) => {
                            const accs = [...data.bankAccounts];
                            accs[idx].qrImageUrl = e.target.value;
                            updateData({ bankAccounts: accs });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-2.5 py-1 text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. KHÁCH MỜI & PHẢN HỒI */}
            {activeTab === "rsvps" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-3 rounded-2xl text-center">
                    <div className="text-[10px] uppercase text-[#8C6A58] font-semibold">Phản Hồi</div>
                    <div className="font-serif font-bold text-lg text-[#354D2E]">{rsvps.length}</div>
                  </div>
                  <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-3 rounded-2xl text-center">
                    <div className="text-[10px] uppercase text-emerald-700 font-semibold">Tham Dự</div>
                    <div className="font-serif font-bold text-lg text-emerald-700">
                      {rsvps.filter((r) => r.attendance === "attending").length}
                    </div>
                  </div>
                  <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-3 rounded-2xl text-center">
                    <div className="text-[10px] uppercase text-[#C4715A] font-semibold">Tổng Khách</div>
                    <div className="font-serif font-bold text-lg text-[#C4715A]">
                      {rsvps
                        .filter((r) => r.attendance === "attending")
                        .reduce((sum, r) => sum + (r.guestCount || 1), 0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <h4 className="font-serif font-bold text-xs text-[#354D2E]">Danh Sách Phản Hồi</h4>
                  <button
                    type="button"
                    onClick={exportRsvpsToCSV}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>Xuất Excel / CSV</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {loadingGuests ? (
                    <div className="text-center py-6 text-xs text-[#8C6A58]">Đang tải phản hồi...</div>
                  ) : rsvps.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#8C6A58] bg-[#FDFAF5] rounded-2xl p-4 border border-[#E8D5CF]">
                      Chưa có phản hồi nào.
                    </div>
                  ) : (
                    rsvps.map((r, i) => (
                      <div key={i} className="p-3 bg-[#FDFAF5] border border-[#E8D5CF] rounded-2xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#354D2E]">{r.fullName}</span>
                          <span className="font-mono text-[11px] text-[#C4715A]">{r.phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#5C4033]">
                          <span>
                            {r.guestOf === "groom"
                              ? "Nhà Trai"
                              : r.guestOf === "bride"
                              ? "Nhà Gái"
                              : "Cả Hai"}{" "}
                            • <strong className="text-[#354D2E]">{r.guestCount} người</strong>
                          </span>
                          <span className={r.attendance === "attending" ? "text-emerald-700 font-bold" : "text-[#8C6A58]"}>
                            {r.attendance === "attending" ? "Tham dự" : "Vắng mặt"}
                          </span>
                        </div>

                        {r.emailSentTo && r.emailSentTo.length > 0 && (
                          <div className="text-[10px] text-[#8C6A58] flex items-center gap-1 pt-0.5">
                            <Send className="w-2.5 h-2.5 text-[#4A6741]" />
                            <span>Đã gửi tới: {r.emailSentTo.join(", ")}</span>
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

        {/* Right Side: Real-time Live Interactive Preview */}
        <div className="flex-1 bg-[#2C3E28] p-4 sm:p-6 flex items-center justify-center overflow-hidden relative">
          {previewDevice === "mobile" ? (
            /* Khung điện thoại thông minh viền cong cao cấp */
            <div className="w-[375px] h-[730px] rounded-[48px] border-[10px] border-[#1C2919] shadow-2xl overflow-hidden relative bg-[#FDFAF5] flex flex-col ring-1 ring-[#C9A84C]/30">
              {/* Phone Notch */}
              <div className="h-6 bg-[#1C2919] w-36 mx-auto rounded-b-2xl z-50 shrink-0 flex items-center justify-center">
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
              </div>

              {/* Màn hình thiệp cưới tương tác trực tiếp */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
                <WeddingInvitationView isPreview={true} />
              </div>
            </div>
          ) : (
            /* Khung máy tính với thanh trình duyệt */
            <div className="w-full h-full max-h-[820px] rounded-2xl border-2 border-[#1C2919] shadow-2xl overflow-hidden flex flex-col bg-[#FDFAF5]">
              <div className="h-9 bg-[#1C2919] px-4 flex items-center gap-2 z-30 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C4715A]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A6741]" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-[#2C3E28] rounded-md py-0.5 px-3 text-[11px] text-[#A8BCA1] font-mono text-center truncate">
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

      {/* Hộp thoại chia sẻ link rút gọn & QR Code */}
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
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
