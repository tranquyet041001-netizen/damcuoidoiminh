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
  MailOpen,
  Send,
  Share2,
  Copy,
  Check,
  Lock,
  QrCode,
  Play,
  Pause,
  Save,
  Bell,
  HelpCircle,
  MessageSquare,
  Palette,
} from "lucide-react";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { MusicProvider, useMusic } from "@/context/MusicContext";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";
import { ShareModal } from "@/components/invitation/ShareModal";
import { processAndUploadImage } from "@/utils/imageUpload";
import { copyToClipboard } from "@/utils/clipboard";
import {
  extractYouTubeId,
  isYouTubeUrl,
  SUGGESTED_WEDDING_SONGS,
  YouTubeIcon,
} from "@/utils/youtube";
import {
  RSVPSubmission,
  WishSubmission,
  WeddingEvent,
  StoryMilestone,
  GalleryItem,
  WeddingData,
} from "@/types/wedding";

const ADMIN_TABS = [
  { id: "couple", label: "Dâu & Rể", icon: Heart },
  { id: "theme", label: "Giao Diện & Phong Thư", icon: Palette },
  { id: "email", label: "Báo Tin & Link", icon: Bell },
  { id: "time", label: "Lịch & Nhạc YT", icon: Calendar },
  { id: "events", label: "Sự Kiện Cưới", icon: Clock },
  { id: "story", label: "Chuyện Tình", icon: Sparkles },
  { id: "gallery", label: "Album Ảnh", icon: Camera },
  { id: "bank", label: "Mừng Cưới", icon: CreditCard },
  { id: "rsvps", label: "Khách Mời", icon: Users },
] as const;

type TabId = (typeof ADMIN_TABS)[number]["id"];

function StudioContent() {
  const { data, updateData, saveChanges, resetToDefault, exportAsCode, isModified } = useWeddingData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>("couple");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [previewEnvelopeOpen, setPreviewEnvelopeOpen] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving">("saved");
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [origin, setOrigin] = useState("");

  // Notification testing states
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [testingSheet, setTestingSheet] = useState(false);
  const [showTelegramGuide, setShowTelegramGuide] = useState(false);
  const [showSheetGuide, setShowSheetGuide] = useState(false);

  const isInitialMount = useRef(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Local state for RSVPs and Wishes
  const [rsvps, setRsvps] = useState<RSVPSubmission[]>([]);
  const [wishes, setWishes] = useState<WishSubmission[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  // Trạng thái tạo link mời đích danh và thêm khách thủ công
  const [guestInviteName, setGuestInviteName] = useState("");
  const [guestInvitePrefix, setGuestInvitePrefix] = useState("Kính mời");
  const [showAddGuestPanel, setShowAddGuestPanel] = useState(false);
  const [manualGuest, setManualGuest] = useState({
    fullName: "",
    phone: "",
    guestOf: "both" as "groom" | "bride" | "both",
    attendance: "attending" as "attending" | "declined",
    guestCount: 1,
    dietaryOrNote: "",
  });
  const [submittingManualGuest, setSubmittingManualGuest] = useState(false);

  // Upload states
  const [uploadingGroomAvatar, setUploadingGroomAvatar] = useState(false);
  const [uploadingBrideAvatar, setUploadingBrideAvatar] = useState(false);
  const [uploadingStoryIdx, setUploadingStoryIdx] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Debounced auto-save: chỉ tự động lưu khi người dùng thực sự thay đổi dữ liệu (isModified === true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isModified) return;

    setAutoSaveStatus("saving");
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      const ok = await saveChanges();
      if (ok) {
        setAutoSaveStatus("saved");
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [data, isModified, saveChanges]);

  // Nút lưu thay đổi chủ động của người dùng
  const handleManualSave = async () => {
    setIsManualSaving(true);
    try {
      const ok = await saveChanges();
      if (ok) {
        setAutoSaveStatus("saved");
        showToast("Đã lưu thành công! Dữ liệu đã đồng bộ sang link khách mời và trang chủ.", "success");
      } else {
        showToast("Lưu thất bại, vui lòng thử lại.", "info");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu dữ liệu.", "info");
    } finally {
      setIsManualSaving(false);
    }
  };

  // Test gửi tin nhắn qua Telegram
  const handleTestTelegram = async () => {
    const token = data.notifications?.telegram?.botToken?.trim();
    const chatId = data.notifications?.telegram?.chatId?.trim();
    if (!token || !chatId) {
      showToast("Vui lòng nhập Bot Token và Chat ID trước khi gửi thử.", "info");
      return;
    }
    setTestingTelegram(true);
    try {
      const res = await fetch("/api/test-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "telegram", botToken: token, chatId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Thành công! Đã gửi tin nhắn tới Telegram của bạn.", "success");
      } else {
        showToast(json.error || "Không thể gửi tin nhắn Telegram.", "info");
      }
    } catch {
      showToast("Lỗi kết nối khi gửi thử.", "info");
    } finally {
      setTestingTelegram(false);
    }
  };

  // Test gửi dữ liệu sang Google Sheet
  const handleTestGoogleSheet = async () => {
    const webhookUrl = data.notifications?.googleSheet?.webhookUrl?.trim();
    if (!webhookUrl) {
      showToast("Vui lòng nhập Google Sheet Webhook URL trước khi gửi thử.", "info");
      return;
    }
    setTestingSheet(true);
    try {
      const res = await fetch("/api/test-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "googlesheet", webhookUrl }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Thành công! Dữ liệu mẫu đã được ghi vào Google Sheet.", "success");
      } else {
        showToast(json.error || "Không thể kết nối tới Google Sheet Webhook.", "info");
      }
    } catch {
      showToast("Lỗi kết nối khi gửi thử.", "info");
    } finally {
      setTestingSheet(false);
    }
  };

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
    if (window.confirm("Khôi phục toàn bộ nội dung thiệp cưới về mặc định?")) {
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

  // Xóa phản hồi của khách
  const handleDeleteRSVP = async (id?: string) => {
    if (!id) return;
    if (!confirm("Bạn có chắc chắn muốn xóa phản hồi này khỏi danh sách?")) return;
    try {
      const res = await fetch(`/api/rsvp?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRsvps((prev) => prev.filter((r) => r.id !== id));
        showToast("Đã xóa phản hồi thành công!", "success");
      } else {
        showToast("Không thể xóa phản hồi", "info");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa phản hồi", "info");
    }
  };

  // Xóa lời chúc lưu bút
  const handleDeleteWish = async (id?: string) => {
    if (!id) return;
    if (!confirm("Bạn có chắc chắn muốn xóa lời chúc này?")) return;
    try {
      const res = await fetch(`/api/wishes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== id));
        showToast("Đã xóa lời chúc thành công!", "success");
      } else {
        showToast("Không thể xóa lời chúc", "info");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa lời chúc", "info");
    }
  };

  // Thêm khách mời thủ công
  const handleAddManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualGuest.fullName.trim()) {
      showToast("Vui lòng nhập tên khách mời", "info");
      return;
    }
    setSubmittingManualGuest(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualGuest),
      });
      const resData = await res.json();
      if (resData.success) {
        setRsvps((prev) => [resData.data, ...prev]);
        setShowAddGuestPanel(false);
        setManualGuest({
          fullName: "",
          phone: "",
          guestOf: "both",
          attendance: "attending",
          guestCount: 1,
          dietaryOrNote: "",
        });
        showToast("Đã thêm khách mời vào danh sách!", "success");
      } else {
        showToast(resData.message || "Không thể thêm khách mời", "info");
      }
    } catch {
      showToast("Lỗi kết nối khi thêm khách", "info");
    } finally {
      setSubmittingManualGuest(false);
    }
  };

  const currentYtId = extractYouTubeId(data.musicUrl);
  const { isPlaying: isMusicPlaying, toggleMusic } = useMusic();

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#5C4033] flex flex-col font-sans selection:bg-[#C4715A] selection:text-[#FDFAF5]">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="h-14 sm:h-16 bg-[#FFFDF9] border-b border-[#E8D5CF] px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-[#5C4033] hover:text-[#4A6741] transition-colors p-1.5 rounded-lg hover:bg-[#F0F5EE]"
          >
            <ArrowLeft className="w-4 h-4 text-[#4A6741]" />
            <span className="hidden md:inline font-medium">Về Thiệp Cưới</span>
          </Link>

          <span className="text-[#E8D5CF] hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#4A6741] text-[#FDFAF5] flex items-center justify-center font-serif text-xs font-bold shadow-2xs">
              HỶ
            </div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-[#354D2E] tracking-wide flex items-center gap-1.5">
              <span>Thư Phòng Chỉnh Sửa</span>
            </h1>
          </div>
        </div>

        {/* Center: Status & Device Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trạng thái tự động lưu & đồng bộ máy chủ */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-serif font-medium px-3 py-1 rounded-full bg-[#F0F5EE] border border-[#A8BCA1]/40">
            {autoSaveStatus === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#C4715A] animate-ping" />
                <span className="text-[#C4715A]">Đang lưu...</span>
              </>
            ) : isModified ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-700">Chưa lưu thay đổi</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-[#4A6741]">Đã đồng bộ máy chủ</span>
              </>
            )}
          </div>

          {/* Device Switcher */}
          <div className="flex items-center bg-[#F0F5EE] p-0.5 sm:p-1 rounded-xl border border-[#A8BCA1]/30">
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

          {/* Envelope State Switcher in Preview */}
          <div className="flex items-center bg-[#F0F5EE] p-0.5 sm:p-1 rounded-xl border border-[#A8BCA1]/30">
            <button
              type="button"
              onClick={() => setPreviewEnvelopeOpen(!previewEnvelopeOpen)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewEnvelopeOpen
                  ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                  : "bg-white text-[#8C6A58] hover:text-[#354D2E] shadow-2xs"
              }`}
              title={
                previewEnvelopeOpen
                  ? "Xem bìa thiệp đóng"
                  : "Xem thiệp khi đã mở"
              }
            >
              {previewEnvelopeOpen ? (
                <>
                  <MailOpen className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span className="hidden sm:inline">Đã Mở</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-[#C4715A]" />
                  <span className="hidden sm:inline">Bìa Đóng</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* NÚT LƯU THAY ĐỔI CHỦ ĐỘNG */}
          <button
            type="button"
            onClick={handleManualSave}
            disabled={isManualSaving}
            title="Lưu ngay lập tức toàn bộ thay đổi lên máy chủ"
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
          >
            {isManualSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#C9A84C]" />
            )}
            <span>{isManualSaving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
          </button>

          {/* NÚT MỞ LINK KHÁCH MỜI ĐỂ TEST */}
          <Link
            href={`/i/${data.slug || "quyet-han"}`}
            target="_blank"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#FDFAF5] hover:bg-[#FDF0EC] text-[#C4715A] text-xs border border-[#E8D5CF] flex items-center gap-1 transition-colors font-semibold shadow-2xs"
            title="Mở giao diện khách mời để kiểm tra trực tiếp"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C4715A]" />
            <span className="hidden md:inline">Link Khách Mời</span>
          </Link>

          {/* Chia sẻ link cho khách & mã QR */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#C4715A] hover:bg-[#A4503B] text-[#FDFAF5] text-xs font-semibold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#FDFAF5]" />
            <span className="hidden lg:inline">Chia Sẻ Link & QR</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Khôi phục dữ liệu ban đầu"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#FDFAF5] hover:bg-[#FDF0EC] text-[#8C6A58] text-xs border border-[#E8D5CF] flex items-center gap-1 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Khôi Phục</span>
          </button>

          <button
            type="button"
            onClick={handleExportCode}
            title="Tải về file data/wedding.ts để deploy Vercel"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#FDFAF5] hover:bg-[#F0F5EE] text-[#4A6741] text-xs border border-[#A8BCA1]/40 flex items-center gap-1 transition-colors font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C4715A]" />
            <span className="hidden xl:inline">Xuất Code</span>
          </button>
        </div>
      </header>

      {/* ── MAIN STUDIO BODY (SPLIT EDITOR & PREVIEW) ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Sidebar Tabs + Form Content */}
        <div className="w-full lg:w-[480px] xl:w-[540px] bg-[#FFFDF9] border-r border-[#E8D5CF] flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] overflow-hidden shrink-0">
          {/* Tabs 4x2 Grid (Luôn hiển thị đầy đủ 8 tab, không bị cuộn mất) */}
          <div className="p-2.5 border-b border-[#E8D5CF] bg-[#FDFAF5] shrink-0 shadow-2xs">
            <div className="grid grid-cols-4 gap-1.5">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-serif font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                      isActive
                        ? "bg-[#4A6741] text-[#FDFAF5] shadow-xs"
                        : "bg-[#FFFDF9] text-[#5C4033] hover:bg-[#F0F5EE] border border-[#E8D5CF]/60 hover:border-[#A8BCA1]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C9A84C]" : "text-[#4A6741]"}`} />
                    <span className="leading-tight line-clamp-1">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* 1. DÂU & RỂ */}
            {activeTab === "couple" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Chú Rể */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 rounded-2xl space-y-3 shadow-2xs">
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
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 rounded-2xl space-y-3 shadow-2xs">
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

            {/* 1.5. TÙY CHỌN GIAO DIỆN & PHONG BÌ THƯ 3D */}
            {activeTab === "theme" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 1. CHỌN MÀU CHỦ ĐẠO (THEME COLOR) */}
                <div className="bg-[#FFFDF9] border border-[#E8D5CF] p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5CF]">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#354D2E]">
                        Tông Màu Chủ Đạo Của Thiệp
                      </h3>
                      <p className="text-[11px] text-[#8C6A58]">
                        Chọn phong cách màu sắc hiển thị cho toàn bộ website thiệp cưới
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Giao diện Đỏ Hoàng Gia */}
                    <div
                      onClick={() => updateData({ theme: "crimson-gold" })}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        (data.theme || "crimson-gold") === "crimson-gold"
                          ? "border-[#9F171B] bg-[#FEF2F2]/60 shadow-md ring-2 ring-[#9F171B]/20"
                          : "border-[#E8D5CF] bg-[#FDFAF5] hover:border-[#9F171B]/40"
                      }`}
                    >
                      {(data.theme || "crimson-gold") === "crimson-gold" && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#9F171B] text-white text-[10px] font-bold">
                          Đang Chọn
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🏮</span>
                          <h4 className="font-serif font-bold text-sm text-[#9F171B]">
                            Đỏ Hoàng Gia (Song Hỷ & Long Phụng)
                          </h4>
                        </div>
                        <p className="text-xs text-[#5C4033] leading-relaxed mb-3">
                          Sắc đỏ son cung đình kết hợp viền vàng kim cát tường, họa tiết Long Phụng sum vầy và chữ Song Hỷ 囍 đậm nét truyền thống đại hỷ.
                        </p>
                      </div>

                      {/* Bảng màu mẫu */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#FCA5A5]/40">
                        <div className="w-5 h-5 rounded-full bg-[#9F171B] shadow-xs" title="Đỏ son" />
                        <div className="w-5 h-5 rounded-full bg-[#881337] shadow-xs" title="Đỏ rượu" />
                        <div className="w-5 h-5 rounded-full bg-[#C9A84C] shadow-xs" title="Vàng kim" />
                        <div className="w-5 h-5 rounded-full bg-[#FFFDF7] border border-[#C9A84C]/50 shadow-xs" title="Giấy ngà son" />
                        <span className="text-[10px] text-[#8C6A58] ml-auto font-serif italic">Khuyên dùng</span>
                      </div>
                    </div>

                    {/* Giao diện Xanh Thanh Nhã */}
                    <div
                      onClick={() => updateData({ theme: "sage-green" })}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        data.theme === "sage-green"
                          ? "border-[#4A6741] bg-[#F0F5EE]/60 shadow-md ring-2 ring-[#4A6741]/20"
                          : "border-[#E8D5CF] bg-[#FDFAF5] hover:border-[#4A6741]/40"
                      }`}
                    >
                      {data.theme === "sage-green" && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#4A6741] text-white text-[10px] font-bold">
                          Đang Chọn
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🌿</span>
                          <h4 className="font-serif font-bold text-sm text-[#4A6741]">
                            Xanh Thanh Nhã (Botanical Romance)
                          </h4>
                        </div>
                        <p className="text-xs text-[#5C4033] leading-relaxed mb-3">
                          Tông màu xanh lá trà thanh khiết, hoa sen thanh tao và giấy ngà ấm, phong cách lãng mạn, trẻ trung hiện đại.
                        </p>
                      </div>

                      {/* Bảng màu mẫu */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#A8BCA1]/40">
                        <div className="w-5 h-5 rounded-full bg-[#4A6741] shadow-xs" title="Xanh trà" />
                        <div className="w-5 h-5 rounded-full bg-[#A8BCA1] shadow-xs" title="Xanh sage" />
                        <div className="w-5 h-5 rounded-full bg-[#C4715A] shadow-xs" title="Hồng đào" />
                        <div className="w-5 h-5 rounded-full bg-[#FDFAF5] border border-[#E8D5CF] shadow-xs" title="Giấy ngà ấm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CHỌN KIỂU MỞ THIỆP (ENVELOPE STYLE) */}
                <div className="bg-[#FFFDF9] border border-[#E8D5CF] p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5CF]">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                      <MailOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#354D2E]">
                        Kiểu Dáng Mở Thiệp
                      </h3>
                      <p className="text-[11px] text-[#8C6A58]">
                        Chọn cách thiệp cưới xuất hiện trước mắt khách mời
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Phong Bì Thư 3D */}
                    <div
                      onClick={() => updateData({ envelopeStyle: "vintage-envelope" })}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        (data.envelopeStyle || "vintage-envelope") === "vintage-envelope"
                          ? "border-[#9F171B] bg-[#FEF2F2]/60 shadow-md ring-2 ring-[#9F171B]/20"
                          : "border-[#E8D5CF] bg-[#FDFAF5] hover:border-[#9F171B]/40"
                      }`}
                    >
                      {(data.envelopeStyle || "vintage-envelope") === "vintage-envelope" && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#9F171B] text-white text-[10px] font-bold">
                          Đang Chọn
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">✉️</span>
                        <h4 className="font-serif font-bold text-sm text-[#9F171B]">
                          Phong Bì Thư Hoàng Gia 3D
                        </h4>
                      </div>
                      <p className="text-xs text-[#5C4033] leading-relaxed">
                        Phong bì dập nổi chỉ vàng kim, nắp gập tam giác với con dấu sáp Song Hỷ mở lật 3D chân thực và thiệp cưới trượt lên sống động.
                      </p>
                    </div>

                    {/* Bìa Thiệp Tròn */}
                    <div
                      onClick={() => updateData({ envelopeStyle: "modern-card" })}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        data.envelopeStyle === "modern-card"
                          ? "border-[#4A6741] bg-[#F0F5EE]/60 shadow-md ring-2 ring-[#4A6741]/20"
                          : "border-[#E8D5CF] bg-[#FDFAF5] hover:border-[#4A6741]/40"
                      }`}
                    >
                      {data.envelopeStyle === "modern-card" && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#4A6741] text-white text-[10px] font-bold">
                          Đang Chọn
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📜</span>
                        <h4 className="font-serif font-bold text-sm text-[#4A6741]">
                          Bìa Thiệp Hiện Đại
                        </h4>
                      </div>
                      <p className="text-xs text-[#5C4033] leading-relaxed">
                        Bìa thiệp phẳng truyền thống thanh lịch với nút mở thiệp bo tròn trang nhã.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. HOẠT ẢNH CƯỚI LÃNG MẠN (WEDDING ANIMATIONS) */}
                <div className="bg-[#FFFDF9] border border-[#E8D5CF] p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5CF]">
                    <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#354D2E]">
                        Hoạt Ảnh Đám Cưới
                      </h3>
                      <p className="text-[11px] text-[#8C6A58]">
                        Bật hoặc tắt các hiệu ứng động đẹp mắt tạo không khí ngày đại hỷ
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Cánh hoa rơi */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🌸</span>
                        <div>
                          <p className="text-xs font-serif font-bold text-[#354D2E]">
                            Mưa Cánh Hoa Đào / Hoa Hồng Rơi
                          </p>
                          <p className="text-[11px] text-[#8C6A58]">
                            Những cánh hoa đào son và hồng phấn bay bồng bềnh lãng mạn
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={data.animations?.fallingPetals !== false}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            animations: { ...prev.animations, fallingPetals: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#9F171B] rounded cursor-pointer"
                      />
                    </div>

                    {/* Rồng Phượng bay xoắn */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🐲</span>
                        <div>
                          <p className="text-xs font-serif font-bold text-[#354D2E]">
                            Rồng Phượng Thêu Gấm Bay Xoắn Vào Nhau
                          </p>
                          <p className="text-[11px] text-[#8C6A58]">
                            Vũ điệu Long Phụng Sum Vầy quanh Hỏa Châu khi ấn mở thiệp
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={data.animations?.dragonPhoenix !== false}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            animations: { ...prev.animations, dragonPhoenix: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#9F171B] rounded cursor-pointer"
                      />
                    </div>

                    {/* Song Hỷ & Trái Tim Bay */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFAF5] border border-[#E8D5CF]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">囍</span>
                        <div>
                          <p className="text-xs font-serif font-bold text-[#354D2E]">
                            Song Hỷ 囍 &amp; Trái Tim Bay Bồng Bềnh
                          </p>
                          <p className="text-[11px] text-[#8C6A58]">
                            Biểu tượng Song Hỷ vàng kim và trái tim son lơ lửng hai bên mạn thiệp
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={data.animations?.floatingHearts !== false}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            animations: { ...prev.animations, floatingHearts: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#9F171B] rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. THÔNG BÁO TIN NHẮN & CHIA SẺ LINK */}
            {activeTab === "email" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* 1. THÔNG BÁO TỨC THÌ QUA TELEGRAM BOT (KHUYÊN DÙNG) */}
                <div className="bg-[#FDFAF5] border-2 border-[#4A6741]/40 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                          Tin Nhắn Báo Về Điện Thoại (Telegram Bot)
                        </h3>
                        <p className="text-[11px] text-[#8C6A58]">
                          Nhận chuông báo tức thì mỗi khi có khách phản hồi RSVP hoặc gửi lời chúc
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#4A6741] bg-[#F0F5EE] font-bold px-2 py-0.5 rounded-full border border-[#A8BCA1]/40 uppercase tracking-wider shrink-0">
                      Khuyên Dùng • Miễn Phí
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                        Telegram Bot Token
                      </label>
                      <input
                        type="text"
                        value={data.notifications?.telegram?.botToken || ""}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              telegram: {
                                ...prev.notifications?.telegram,
                                botToken: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Ví dụ: 7891234567:AAHxyz..."
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                        Telegram Chat ID (Cá Nhân hoặc Nhóm 2 Vợ Chồng)
                      </label>
                      <input
                        type="text"
                        value={data.notifications?.telegram?.chatId || ""}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              telegram: {
                                ...prev.notifications?.telegram,
                                chatId: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Ví dụ: 123456789 (Cá nhân) hoặc -1001234567890 (Nhóm)"
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    {/* Action buttons for Telegram */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleTestTelegram}
                        disabled={testingTelegram}
                        className="px-3.5 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                      >
                        {testingTelegram ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>{testingTelegram ? "Đang gửi thử..." : "Gửi Tin Nhắn Thử Nghiệm"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowTelegramGuide(!showTelegramGuide)}
                        className="px-3 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#F0F5EE] border border-[#E8D5CF] text-[#5C4033] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#C4715A]" />
                        <span>{showTelegramGuide ? "Thu gọn hướng dẫn" : "Xem cách lấy Token & Chat ID (1 phút)"}</span>
                      </button>
                    </div>

                    {/* Collapsible Guide */}
                    {showTelegramGuide && (
                      <div className="p-3.5 bg-[#F0F5EE] border border-[#A8BCA1]/50 rounded-xl text-xs space-y-2 text-[#354D2E] animate-in fade-in">
                        <div className="font-bold text-[#2C3E28] pb-1 border-b border-[#A8BCA1]/40">
                          📌 3 Bước Kích Hoạt Nhận Tin Nhắn Telegram:
                        </div>
                        <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                          <li>
                            <strong>Lấy Bot Token:</strong> Mở Telegram, tìm bot{" "}
                            <a
                              href="https://t.me/BotFather"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0088cc] underline font-bold"
                            >
                              @BotFather
                            </a>
                            , bấm <strong>Start</strong> và gửi lệnh <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">/newbot</code>. Nhập tên bot (ví dụ: <em>DamCuoiQuyetHanBot</em>). BotFather sẽ gửi cho bạn một dòng <strong>API Token</strong> dài dạng <code className="bg-white px-1 rounded font-mono">123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11</code> $\rightarrow$ Dán vào ô Bot Token.
                          </li>
                          <li>
                            <strong>Lấy Chat ID:</strong> Mở Telegram, tìm bot{" "}
                            <a
                              href="https://t.me/userinfobot"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0088cc] underline font-bold"
                            >
                              @userinfobot
                            </a>
                            , bấm <strong>Start</strong> để xem số <strong>Id</strong> của bạn $\rightarrow$ Dán vào ô Chat ID.
                            <br />
                            <em>💡 Mẹo:</em> Muốn cả 2 vợ chồng cùng nhận, hãy tạo 1 nhóm Telegram gồm Chú Rể, Cô Dâu và thêm con bot vừa tạo vào nhóm, gửi 1 tin nhắn bất kỳ trong nhóm để bot nhận diện.
                          </li>
                          <li>
                            <strong>Kiểm tra:</strong> Nhớ mở bot vừa tạo và bấm <strong>/start</strong> để cho phép bot gửi tin, sau đó bấm nút <strong>"Gửi Tin Nhắn Thử Nghiệm"</strong> ở trên!
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. TỰ ĐỘNG GHI VÀO GOOGLE SHEETS (BẢNG TÍNH GOOGLE DRIVE) */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                          Tự Động Ghi Vào Google Sheets
                        </h3>
                        <p className="text-[11px] text-[#8C6A58]">
                          Tự động thêm mỗi phản hồi của khách thành 1 dòng trong file Excel Google Drive
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider shrink-0">
                      Bảng Tính Trực Tuyến
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                        Google Apps Script Webhook URL
                      </label>
                      <input
                        type="url"
                        value={data.notifications?.googleSheet?.webhookUrl || ""}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              googleSheet: {
                                ...prev.notifications?.googleSheet,
                                webhookUrl: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleTestGoogleSheet}
                        disabled={testingSheet}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                      >
                        {testingSheet ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="w-3.5 h-3.5 text-[#C9A84C]" />
                        )}
                        <span>{testingSheet ? "Đang gửi thử..." : "Gửi Thử Sang Google Sheet"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowSheetGuide(!showSheetGuide)}
                        className="px-3 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#F0F5EE] border border-[#E8D5CF] text-[#5C4033] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#4A6741]" />
                        <span>{showSheetGuide ? "Đóng hướng dẫn" : "Lấy mã Google Apps Script"}</span>
                      </button>
                    </div>

                    {showSheetGuide && (
                      <div className="p-3.5 bg-[#F0F5EE] border border-[#A8BCA1]/50 rounded-xl text-xs space-y-2 text-[#354D2E] animate-in fade-in">
                        <div className="font-bold text-[#2C3E28]">
                          📋 Cách cấu hình Google Sheet nhận phản hồi:
                        </div>
                        <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                          <li>Mở một file Google Trang tính (Google Sheets) mới.</li>
                          <li>Trên thanh menu, chọn <strong>Tiện ích mở rộng (Extensions)</strong> $\rightarrow$ <strong>Apps Script</strong>.</li>
                          <li>Xóa hết mã cũ và dán đoạn mã ngắn sau:</li>
                        </ol>
                        <div className="relative">
                          <pre className="p-2.5 bg-[#1C2919] text-[#A8BCA1] rounded-lg text-[11px] overflow-x-auto font-mono">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var d = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    d.type,
    d.fullName || d.name,
    d.phone || "",
    d.guestOf || d.relationship || "",
    d.attendance === "attending" ? "Tham dự" : d.attendance === "declined" ? "Vắng mặt" : (d.attendance || ""),
    d.guestCount || 1,
    d.dietaryOrNote || d.content || ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);
}`}
                          </pre>
                          <button
                            type="button"
                            onClick={async () => {
                              const code = `function doPost(e) {\n  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\n  var d = JSON.parse(e.postData.contents);\n  sheet.appendRow([\n    new Date(),\n    d.type,\n    d.fullName || d.name,\n    d.phone || "",\n    d.guestOf || d.relationship || "",\n    d.attendance === "attending" ? "Tham dự" : d.attendance === "declined" ? "Vắng mặt" : (d.attendance || ""),\n    d.guestCount || 1,\n    d.dietaryOrNote || d.content || ""\n  ]);\n  return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);\n}`;
                              await copyToClipboard(code);
                              showToast("Đã sao chép mã Apps Script vào bộ nhớ tạm!", "success");
                            }}
                            className="absolute top-2 right-2 px-2 py-1 rounded bg-[#4A6741] hover:bg-[#354D2E] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </button>
                        </div>
                        <ol start={4} className="list-decimal list-inside space-y-1 leading-relaxed">
                          <li>Bấm <strong>Triển khai (Deploy)</strong> $\rightarrow$ <strong>Triển khai mới (New deployment)</strong>.</li>
                          <li>Chọn loại <strong>Ứng dụng web (Web app)</strong>, mục <em>Ai có quyền truy cập (Who has access)</em> chọn <strong>Bất kỳ ai (Anyone)</strong>.</li>
                          <li>Sao chép URL ứng dụng web và dán vào ô Webhook URL ở trên!</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. PHÂN LUỒNG EMAIL NHẬN PHẢN HỒI (RSVP) */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
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

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                        Resend API Key (Tùy chọn - Gửi email HTML tự động)
                      </label>
                      <input
                        type="password"
                        value={data.notifications?.email?.resendApiKey || ""}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              email: {
                                ...prev.notifications?.email,
                                resendApiKey: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="re_123456789..."
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. ĐƯỜNG DẪN RÚT GỌN (SHORT LINK) */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
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
                          const base = origin || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
                          const link = `${base}/i/${data.slug || "quyet-han"}`;
                          const success = await copyToClipboard(link);
                          if (success) {
                            showToast("Đã sao chép link rút gọn cho khách!", "success");
                          } else {
                            showToast("Vui lòng bôi đen và sao chép thủ công", "info");
                          }
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
              </div>
            )}

            {/* 3. THỜI GIAN & NHẠC (HỖ TRỢ YOUTUBE) */}
            {activeTab === "time" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Thời gian hôn lễ */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                      Thời Gian Hôn Lễ &amp; Lời Mở Đầu
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.events.map((ev) => ({
                          ...ev,
                          date: data.weddingDateFormatted,
                        }));
                        updateData({ events: updated });
                        showToast(`Đã đồng bộ ngày "${data.weddingDateFormatted}" sang tất cả ${data.events.length} sự kiện cưới!`, "success");
                      }}
                      className="text-[11px] text-[#4A6741] hover:text-[#354D2E] font-medium underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>Đồng bộ ngày sang tất cả Sự Kiện</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-[#8C6A58] font-bold">Ngày Dương Lịch (Chính)</label>
                      </div>
                      <input
                        type="text"
                        value={data.weddingDateFormatted}
                        onChange={(e) => {
                          const newDateStr = e.target.value;
                          updateData((prev) => {
                            const updatedEvts = prev.events.map((ev) => ({
                              ...ev,
                              date: ev.date === prev.weddingDateFormatted || !ev.date ? newDateStr : ev.date,
                            }));
                            return {
                              ...prev,
                              weddingDateFormatted: newDateStr,
                              events: updatedEvts,
                            };
                          });
                        }}
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-serif text-[#354D2E] font-bold focus:outline-none focus:border-[#4A6741]"
                        placeholder="Ví dụ: Chủ Nhật, 24 Tháng 01 Năm 2027"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#8C6A58] block mb-1 font-bold">Ngày Âm Lịch</label>
                      <input
                        type="text"
                        value={data.lunarDateFormatted}
                        onChange={(e) => updateData({ lunarDateFormatted: e.target.value })}
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        placeholder="Ví dụ: Nhằm ngày 17 tháng Chạp năm Bính Ngọ"
                      />
                    </div>
                  </div>

                  {/* Tiện ích chọn lịch nhanh tự động định dạng */}
                  <div className="p-3 bg-[#F0F5EE] border border-[#A8BCA1]/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#354D2E] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#4A6741]" />
                        <span>Bộ Chọn Lịch Tự Động:</span>
                      </span>
                      <span className="text-[10px] text-[#8C6A58]">Tự điền Ngày Dương + Đếm Ngược + Sự Kiện</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="date"
                        value={(() => {
                          try {
                            const d = new Date(data.weddingDate);
                            if (isNaN(d.getTime())) return "";
                            const pad = (n: number) => n.toString().padStart(2, "0");
                            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                          } catch {
                            return "";
                          }
                        })()}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          const [year, month, day] = val.split("-").map(Number);
                          const d = new Date(year, month - 1, day, 10, 30, 0);
                          const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
                          const dayName = daysOfWeek[d.getDay()];
                          const pad = (n: number) => n.toString().padStart(2, "0");
                          const formattedDate = `${dayName}, ${pad(day)} Tháng ${pad(month)} Năm ${year}`;
                          const iso = `${val}T10:30:00+07:00`;

                          updateData((prev) => {
                            const updatedEvts = prev.events.map((ev) => ({
                              ...ev,
                              date: formattedDate,
                            }));
                            return {
                              ...prev,
                              weddingDate: iso,
                              weddingDateFormatted: formattedDate,
                              events: updatedEvts,
                            };
                          });
                          showToast(`Đã cập nhật ngày: ${formattedDate} và đồng bộ các sự kiện!`, "success");
                        }}
                        className="bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741] cursor-pointer"
                      />
                      <span className="text-[11px] text-[#5C4033] italic">
                        Bấm biểu tượng lịch để chọn ngày, hệ thống sẽ tự động cập nhật đồng bộ!
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-medium">Chuỗi ISO Cho Đồng Hồ Đếm Ngược</label>
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
                </div>

                {/* Hộp Nhạc Nền YouTube & MP3 */}
                <div className="bg-[#FDFAF5] border-2 border-[#C4715A]/40 p-4 sm:p-5 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <div className="flex items-center gap-2">
                      <YouTubeIcon className="w-5 h-5 text-[#C4715A]" />
                      <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                        Nhạc Nền Thiệp Cưới (Hỗ trợ YouTube &amp; MP3)
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#C4715A] bg-[#FDF0EC] px-2.5 py-0.5 rounded-full font-bold uppercase">
                      YouTube Audio
                    </span>
                  </div>

                  <p className="text-xs text-[#5C4033] leading-relaxed">
                    Bạn có thể dán bất kỳ link bài hát nào từ <strong>YouTube</strong> (ví dụ: <code>https://www.youtube.com/watch?v=...</code> hoặc <code>https://youtu.be/...</code>) hoặc đường dẫn file <code>.mp3</code>. Khi khách chạm nút <strong>Nhạc</strong> trên thiệp, nhạc sẽ tự động phát!
                  </p>

                  <div>
                    <label className="text-xs text-[#8C6A58] block mb-1 font-bold">
                      Đường Dẫn Link Nhạc
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#F0F5EE] border border-[#E8D5CF]">
                        {currentYtId ? (
                          <YouTubeIcon className="w-4 h-4 text-[#C4715A]" />
                        ) : (
                          <Music className="w-4 h-4 text-[#4A6741]" />
                        )}
                      </div>
                      <input
                        type="url"
                        value={data.musicUrl}
                        placeholder="Dán link YouTube (https://www.youtube.com/watch?v=...) hoặc file .mp3..."
                        onChange={(e) => updateData({ musicUrl: e.target.value })}
                        className="flex-1 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-mono focus:outline-none focus:border-[#4A6741]"
                      />
                      <button
                        type="button"
                        onClick={toggleMusic}
                        title={isMusicPlaying ? "Dừng nghe thử" : "Nghe thử nhạc ngay"}
                        className={`px-3 py-2 rounded-xl text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                          isMusicPlaying
                            ? "bg-[#4A6741] text-[#FDFAF5] border border-[#4A6741] shadow-2xs animate-pulse"
                            : "bg-[#FDF0EC] text-[#C4715A] border border-[#E8D5CF] hover:bg-[#F5E2DB]"
                        }`}
                      >
                        {isMusicPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Dừng Nghe</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Nghe Thử</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Trạng thái nhận diện link YouTube */}
                    {currentYtId && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#F0F5EE] border border-[#A8BCA1]/40 flex items-center justify-between text-xs text-[#4A6741]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã nhận diện video YouTube:</span>
                          <strong className="font-mono">{currentYtId}</strong>
                        </span>
                        <a
                          href={`https://www.youtube.com/watch?v=${currentYtId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#C4715A] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Nghe thử trên YT</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Danh sách gợi ý bài hát cưới 1-click */}
                  <div className="pt-2 border-t border-[#E8D5CF]">
                    <div className="text-[11px] font-bold text-[#8C6A58] uppercase tracking-wider mb-2">
                      Gợi Ý Bài Hát Cưới Lãng Mạn (Bấm để chọn nhanh):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SUGGESTED_WEDDING_SONGS.map((song, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            updateData({ musicUrl: song.url });
                            showToast(`Đã chọn bài: ${song.title}`, "success");
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            data.musicUrl === song.url
                              ? "bg-[#4A6741] text-[#FDFAF5] border-[#4A6741] shadow-2xs"
                              : "bg-[#FFFDF9] text-[#5C4033] border-[#E8D5CF] hover:border-[#A8BCA1] hover:bg-[#F0F5EE]"
                          }`}
                        >
                          {song.type === "youtube" ? (
                            <YouTubeIcon className={`w-3.5 h-3.5 shrink-0 ${data.musicUrl === song.url ? "text-[#C9A84C]" : "text-[#C4715A]"}`} />
                          ) : (
                            <Music className={`w-3.5 h-3.5 shrink-0 ${data.musicUrl === song.url ? "text-[#C9A84C]" : "text-[#4A6741]"}`} />
                          )}
                          <div className="truncate">
                            <div className="text-xs font-serif font-bold truncate">{song.title}</div>
                            <div className={`text-[10px] ${data.musicUrl === song.url ? "text-[#FDFAF5]/80" : "text-[#8C6A58]"}`}>
                              {song.artist} • {song.type.toUpperCase()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
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
                        title: "LỄ MỚI",
                        subtitle: "Nghi thức",
                        date: data.weddingDateFormatted,
                        isoDate: data.weddingDate,
                        time: "10:30 Sáng",
                        venue: "Tư Gia Hôn Trường",
                        address: "Khu 5, Xóm 6, Xã Minh Châu, Thành phố Hà Nội",
                        mapUrl: "https://maps.google.com/?q=Khu+5+Xóm+6+Minh+Châu+Hà+Nội",
                        notes: "Trân trọng kính mời quý khách tới chung vui cùng gia đình.",
                      };
                      updateData((prev) => ({ ...prev, events: [...prev.events, newEvt] }));
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm sự kiện</span>
                  </button>
                </div>

                {/* Thanh đồng bộ ngày nhanh */}
                <div className="p-3 bg-[#F0F5EE] border border-[#A8BCA1]/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                  <div className="text-xs text-[#354D2E]">
                    <span className="text-[#8C6A58]">Ngày cưới chính: </span>
                    <strong className="font-serif font-bold">{data.weddingDateFormatted}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.events.map((e) => ({
                        ...e,
                        date: data.weddingDateFormatted,
                      }));
                      updateData({ events: updated });
                      showToast(`Đã đồng bộ ngày "${data.weddingDateFormatted}" sang tất cả ${data.events.length} sự kiện!`, "success");
                    }}
                    className="px-3 py-1.5 bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>Đồng bộ tất cả theo Ngày Cưới Chính</span>
                  </button>
                </div>

                {data.events.map((evt, idx) => (
                  <div key={evt.id} className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 rounded-2xl space-y-3 relative shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#4A6741] text-white text-[11px] font-serif font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-serif font-bold text-[#354D2E]">
                          {evt.title || `Sự kiện #${idx + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.filter((e) => e.id !== evt.id),
                          }));
                        }}
                        className="text-zinc-400 hover:text-[#C4715A] p-1 cursor-pointer transition-colors"
                        title="Xóa sự kiện này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tiêu đề chính & Tiêu đề phụ (Subtitle) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                          Tiêu Đề Sự Kiện
                        </label>
                        <input
                          type="text"
                          value={evt.title}
                          placeholder="Ví dụ: Tiệc Cưới Chung Vui / Lễ Vu Quy..."
                          onChange={(e) => {
                            const evts = [...data.events];
                            evts[idx].title = e.target.value;
                            updateData({ events: evts });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                          Dòng Phụ Đề (Dòng Chữ Hoa Trên Cùng)
                        </label>
                        <input
                          type="text"
                          value={evt.subtitle || ""}
                          placeholder="Ví dụ: ĐÓN KHÁCH & KHAI TIỆC CHUNG VUI HAI HỌ"
                          onChange={(e) => {
                            const evts = [...data.events];
                            evts[idx].subtitle = e.target.value;
                            updateData({ events: evts });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-medium text-[#C4715A] focus:outline-none focus:border-[#C4715A]"
                        />
                      </div>
                    </div>

                    {/* Ngày tổ chức & Giờ tổ chức */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-[#8C6A58] font-bold uppercase tracking-wider">
                            Ngày Diễn Ra Sự Kiện
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const evts = [...data.events];
                              evts[idx].date = data.weddingDateFormatted;
                              updateData({ events: evts });
                              showToast("Đã lấy ngày cưới chính!", "success");
                            }}
                            className="text-[10px] text-[#4A6741] hover:underline font-medium cursor-pointer"
                          >
                            ⚡ Lấy ngày cưới chính
                          </button>
                        </div>
                        <input
                          type="text"
                          value={evt.date || ""}
                          placeholder="Ví dụ: Chủ Nhật, 24 Tháng 01 Năm 2027"
                          onChange={(e) => {
                            const evts = [...data.events];
                            evts[idx].date = e.target.value;
                            updateData({ events: evts });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                          Giờ Tổ Chức / Đón Khách
                        </label>
                        <input
                          type="text"
                          value={evt.time}
                          placeholder="Ví dụ: 11:30 Trưa (Đón khách từ 11:00)"
                          onChange={(e) => {
                            const evts = [...data.events];
                            evts[idx].time = e.target.value;
                            updateData({ events: evts });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                    </div>

                    {/* Tên Hôn Trường & Địa Chỉ Cụ Thể */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                          Tên Hôn Trường / Địa Điểm
                        </label>
                        <input
                          type="text"
                          value={evt.venue}
                          placeholder="Ví dụ: Hôn Trường Tư Gia Hai Họ"
                          onChange={(e) => {
                            const evts = [...data.events];
                            evts[idx].venue = e.target.value;
                            updateData({ events: evts });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                          Địa Chỉ Cụ Thể
                        </label>
                        <input
                          type="text"
                          value={evt.address}
                          placeholder="Ví dụ: Khu 5, Xóm 6, Xã Minh Châu, Thành phố Hà Nội"
                          onChange={(e) => {
                            const evts = [...data.events];
                            evts[idx].address = e.target.value;
                            updateData({ events: evts });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#5C4033] focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                    </div>

                    {/* Lời nhắn / Ghi chú cho khách */}
                    <div>
                      <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                        Lời Nhắn / Lời Dặn Cho Khách
                      </label>
                      <input
                        type="text"
                        value={evt.notes || ""}
                        placeholder="Ví dụ: Trân trọng kính mời quý khách dùng bữa cơm thân mật chung vui cùng gia đình."
                        onChange={(e) => {
                          const evts = [...data.events];
                          evts[idx].notes = e.target.value;
                          updateData({ events: evts });
                        }}
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs italic font-serif text-[#8C6A58] focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>

                    {/* Đường dẫn Google Maps */}
                    <div>
                      <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase tracking-wider">
                        Đường Dẫn Bản Đồ Google Maps
                      </label>
                      <input
                        type="url"
                        value={evt.mapUrl}
                        placeholder="https://maps.google.com/?q=..."
                        onChange={(e) => {
                          const evts = [...data.events];
                          evts[idx].mapUrl = e.target.value;
                          updateData({ events: evts });
                        }}
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs font-mono text-[#4A6741] focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
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
                      className="p-2 rounded-xl bg-[#FFFDF9] border border-[#E8D5CF] hover:bg-[#F0F5EE] text-xs cursor-pointer"
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

            {/* 8. KHÁCH MỜI & TÙY CHỈNH PHẦN KHÁCH */}
            {activeTab === "rsvps" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* 1. TẠO LINK MỜI ĐÍCH DANH TỪNG KHÁCH (IN TÊN LÊN BÌA THIỆP) */}
                <div className="bg-[#FDFAF5] border-2 border-[#C4715A]/40 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C4715A]" />
                      <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                        Tạo Link Mời Đích Danh Cho Từng Khách
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#C4715A] bg-[#FDF0EC] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      In Tên Lên Thiệp
                    </span>
                  </div>

                  <p className="text-xs text-[#5C4033] leading-relaxed">
                    Nhập tên khách mời để tạo đường link riêng. Khi khách mở thiệp, trên phong bì sẽ hiện trang trọng <strong>&quot;Kính mời: [Tên khách]&quot;</strong> và tự động điền sẵn tên vào phần xác nhận!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase">
                        Xưng hô
                      </label>
                      <select
                        value={guestInvitePrefix}
                        onChange={(e) => setGuestInvitePrefix(e.target.value)}
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-2.5 py-2 text-xs text-[#354D2E] focus:outline-none focus:border-[#4A6741]"
                      >
                        <option value="Kính mời">Kính mời</option>
                        <option value="Thân gửi">Thân gửi</option>
                        <option value="Trân trọng kính mời">Trân trọng kính mời</option>
                        <option value="Mời bạn">Mời bạn</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase">
                        Tên Khách Mời / Đại Gia Đình
                      </label>
                      <input
                        type="text"
                        value={guestInviteName}
                        onChange={(e) => setGuestInviteName(e.target.value)}
                        placeholder="Ví dụ: Bác Tuấn &amp; Gia Đình, Bạn Lan C3, Anh Hoàng..."
                        className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-2 text-xs text-[#354D2E] font-medium focus:outline-none focus:border-[#4A6741]"
                      />
                    </div>
                  </div>

                  {/* Xem trước link và nút sao chép */}
                  <div className="p-3 bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C6A58]">
                      Link Mời Dành Riêng Cho Khách Này:
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[#C4715A] font-bold truncate">
                        {`${origin}/i/${data.slug || "quyet-han"}${
                          guestInviteName.trim()
                            ? `?to=${encodeURIComponent(guestInviteName.trim())}`
                            : ""
                        }`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E8D5CF]/60">
                      <button
                        type="button"
                        onClick={async () => {
                          const name = guestInviteName.trim() || "Quý Khách";
                          const base = origin || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
                          const link = `${base}/i/${data.slug || "quyet-han"}?to=${encodeURIComponent(name)}`;
                          const inviteMsg = `${guestInvitePrefix} ${name},\n\n${data.groom.shortName} & ${data.bride.shortName} trân trọng kính mời ${name} cùng người thương tới dự bữa cơm thân mật chung vui cùng gia đình chúng mình vào ngày ${data.weddingDateFormatted}.\n\n💌 Thiệp cưới online dành riêng cho ${name}:\n${link}\n\nSự hiện diện của ${name} là niềm hạnh phúc lớn nhất của chúng mình!`;

                          const ok = await copyToClipboard(inviteMsg);
                          if (ok) {
                            showToast(`Đã sao chép lời mời Zalo dành riêng cho "${name}"!`, "success");
                          } else {
                            showToast("Vui lòng sao chép thủ công", "info");
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#C9A84C]" />
                        <span>Sao Chép Lời Mời Kèm Link (Zalo)</span>
                      </button>

                      <a
                        href={`/i/${data.slug || "quyet-han"}${
                          guestInviteName.trim() ? `?to=${encodeURIComponent(guestInviteName.trim())}` : ""
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-[#FDFAF5] hover:bg-[#FDF0EC] border border-[#E8D5CF] text-[#C4715A] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#C4715A]" />
                        <span>Xem Thử Bìa Thiệp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. CẤU HÌNH TÙY CHỈNH FORM XÁC NHẬN (RSVP SETTINGS) */}
                <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8D5CF]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#4A6741]" />
                      <h3 className="font-serif font-bold text-sm text-[#354D2E]">
                        Tùy Chỉnh Form Khách Mời (RSVP)
                      </h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-bold text-[#5C4033]">
                        {data.rsvpSettings?.enabled !== false ? "Đang bật" : "Đã tắt"}
                      </span>
                      <input
                        type="checkbox"
                        checked={data.rsvpSettings?.enabled !== false}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            rsvpSettings: {
                              ...prev.rsvpSettings,
                              enabled: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 accent-[#4A6741] cursor-pointer"
                      />
                    </label>
                  </div>

                  {data.rsvpSettings?.enabled !== false ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase">
                            Tiêu Đề Mục Trên Thiệp
                          </label>
                          <input
                            type="text"
                            value={data.rsvpSettings?.title || "Sự Hiện Diện Của Bạn"}
                            onChange={(e) =>
                              updateData((prev) => ({
                                ...prev,
                                rsvpSettings: { ...prev.rsvpSettings, title: e.target.value },
                              }))
                            }
                            placeholder="Sự Hiện Diện Của Bạn"
                            className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#354D2E]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#8C6A58] block mb-1 font-bold uppercase">
                            Phụ Đề Mục
                          </label>
                          <input
                            type="text"
                            value={data.rsvpSettings?.subtitle || "Xác Nhận Tham Dự"}
                            onChange={(e) =>
                              updateData((prev) => ({
                                ...prev,
                                rsvpSettings: { ...prev.rsvpSettings, subtitle: e.target.value },
                              }))
                            }
                            placeholder="Xác Nhận Tham Dự"
                            className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#C4715A]"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-[#8C6A58] font-bold uppercase">
                            Lời Dặn / Hạn Chót Xác Nhận
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateData((prev) => ({
                                ...prev,
                                rsvpSettings: {
                                  ...prev.rsvpSettings,
                                  deadlineText: `Để gia đình đón tiếp chu đáo nhất, xin vui lòng phản hồi trước ngày ${prev.weddingDateFormatted}.`,
                                },
                              }));
                              showToast("Đã cập nhật theo ngày cưới chính!", "success");
                            }}
                            className="text-[10px] text-[#4A6741] hover:underline font-medium cursor-pointer"
                          >
                            ⚡ Lấy theo ngày cưới chính
                          </button>
                        </div>
                        <input
                          type="text"
                          value={
                            data.rsvpSettings?.deadlineText ||
                            `Để gia đình đón tiếp chu đáo nhất, xin vui lòng phản hồi trước ngày ${data.weddingDateFormatted}.`
                          }
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              rsvpSettings: { ...prev.rsvpSettings, deadlineText: e.target.value },
                            }))
                          }
                          className="w-full bg-[#FFFDF9] border border-[#E8D5CF] rounded-xl px-3 py-1.5 text-xs text-[#354D2E]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#E8D5CF]/60">
                        <label className="flex items-center gap-2 text-xs text-[#5C4033] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={data.rsvpSettings?.allowGuestCount !== false}
                            onChange={(e) =>
                              updateData((prev) => ({
                                ...prev,
                                rsvpSettings: { ...prev.rsvpSettings, allowGuestCount: e.target.checked },
                              }))
                            }
                            className="w-3.5 h-3.5 accent-[#4A6741] cursor-pointer"
                          />
                          <span>Cho phép chọn số lượng người đi cùng</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8C6A58]">Số người tối đa:</span>
                          <select
                            value={data.rsvpSettings?.maxGuests || 4}
                            onChange={(e) =>
                              updateData((prev) => ({
                                ...prev,
                                rsvpSettings: { ...prev.rsvpSettings, maxGuests: Number(e.target.value) },
                              }))
                            }
                            className="bg-[#FFFDF9] border border-[#E8D5CF] rounded-lg px-2 py-1 text-xs text-[#354D2E]"
                          >
                            <option value={2}>2 Người</option>
                            <option value={3}>3 Người</option>
                            <option value={4}>4 Người</option>
                            <option value={5}>5 Người</option>
                            <option value={6}>6 Người</option>
                            <option value={8}>8 Người</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#F0F5EE] rounded-xl text-xs text-[#4A6741]">
                      Mục Xác Nhận Tham Dự đang tạm ẩn trên thiệp cưới của bạn. Khách sẽ chỉ xem thông tin cưới và sổ lời chúc.
                    </div>
                  )}
                </div>

                {/* 3. THỐNG KÊ & QUẢN LÝ DANH SÁCH KHÁCH PHẢN HỒI */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-3 rounded-2xl text-center shadow-2xs">
                      <div className="text-[10px] uppercase text-[#8C6A58] font-semibold">Phản Hồi</div>
                      <div className="font-serif font-bold text-lg text-[#354D2E]">{rsvps.length}</div>
                    </div>
                    <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-3 rounded-2xl text-center shadow-2xs">
                      <div className="text-[10px] uppercase text-emerald-700 font-semibold">Tham Dự</div>
                      <div className="font-serif font-bold text-lg text-emerald-700">
                        {rsvps.filter((r) => r.attendance === "attending").length}
                      </div>
                    </div>
                    <div className="bg-[#FDFAF5] border border-[#E8D5CF] p-3 rounded-2xl text-center shadow-2xs">
                      <div className="text-[10px] uppercase text-[#C4715A] font-semibold">Tổng Khách</div>
                      <div className="font-serif font-bold text-lg text-[#C4715A]">
                        {rsvps
                          .filter((r) => r.attendance === "attending")
                          .reduce((sum, r) => sum + (r.guestCount || 1), 0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <h4 className="font-serif font-bold text-xs text-[#354D2E]">
                      Danh Sách Khách Phản Hồi ({rsvps.length})
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowAddGuestPanel(!showAddGuestPanel)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FDFAF5] hover:bg-[#F0F5EE] text-[#4A6741] text-xs font-semibold border border-[#A8BCA1]/40 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Khách</span>
                      </button>

                      <button
                        type="button"
                        onClick={exportRsvpsToCSV}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-[#FDFAF5] text-xs font-semibold shadow-2xs cursor-pointer transition-all"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#C9A84C]" />
                        <span>Xuất Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Form thêm khách mời thủ công (khi người nhà gọi điện báo) */}
                  {showAddGuestPanel && (
                    <form
                      onSubmit={handleAddManualGuest}
                      className="p-3.5 bg-[#F0F5EE] border border-[#A8BCA1]/50 rounded-2xl space-y-2.5 text-xs animate-in fade-in"
                    >
                      <div className="font-serif font-bold text-xs text-[#354D2E] pb-1 border-b border-[#A8BCA1]/30">
                        Thêm Khách Mời Thủ Công (Báo trực tiếp)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Họ và tên khách *"
                          value={manualGuest.fullName}
                          onChange={(e) =>
                            setManualGuest((prev) => ({ ...prev, fullName: e.target.value }))
                          }
                          className="bg-white border border-[#E8D5CF] rounded-xl px-2.5 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Số điện thoại"
                          value={manualGuest.phone}
                          onChange={(e) =>
                            setManualGuest((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="bg-white border border-[#E8D5CF] rounded-xl px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={manualGuest.guestOf}
                          onChange={(e) =>
                            setManualGuest((prev) => ({
                              ...prev,
                              guestOf: e.target.value as any,
                            }))
                          }
                          className="bg-white border border-[#E8D5CF] rounded-xl px-2 py-1.5 text-xs"
                        >
                          <option value="both">Khách Cả Hai</option>
                          <option value="groom">Khách Nhà Trai</option>
                          <option value="bride">Khách Nhà Gái</option>
                        </select>

                        <select
                          value={manualGuest.attendance}
                          onChange={(e) =>
                            setManualGuest((prev) => ({
                              ...prev,
                              attendance: e.target.value as any,
                            }))
                          }
                          className="bg-white border border-[#E8D5CF] rounded-xl px-2 py-1.5 text-xs"
                        >
                          <option value="attending">Tham dự</option>
                          <option value="declined">Vắng mặt</option>
                        </select>

                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-[#8C6A58] shrink-0">Đi cùng:</span>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={manualGuest.guestCount}
                            onChange={(e) =>
                              setManualGuest((prev) => ({
                                ...prev,
                                guestCount: Number(e.target.value),
                              }))
                            }
                            className="w-full bg-white border border-[#E8D5CF] rounded-xl px-2 py-1.5 text-xs"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Ghi chú / Chế độ ăn uống..."
                        value={manualGuest.dietaryOrNote}
                        onChange={(e) =>
                          setManualGuest((prev) => ({ ...prev, dietaryOrNote: e.target.value }))
                        }
                        className="w-full bg-white border border-[#E8D5CF] rounded-xl px-2.5 py-1.5 text-xs"
                      />

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddGuestPanel(false)}
                          className="px-3 py-1 rounded-xl bg-white border border-[#E8D5CF] text-xs cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={submittingManualGuest}
                          className="px-3 py-1 rounded-xl bg-[#4A6741] text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                        >
                          {submittingManualGuest ? "Đang lưu..." : "Lưu Khách Mời"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Danh sách phản hồi */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {loadingGuests ? (
                      <div className="text-center py-6 text-xs text-[#8C6A58]">Đang tải phản hồi...</div>
                    ) : rsvps.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#8C6A58] bg-[#FDFAF5] rounded-2xl p-4 border border-[#E8D5CF]">
                        Chưa có phản hồi nào.
                      </div>
                    ) : (
                      rsvps.map((r, i) => (
                        <div key={r.id || i} className="p-3 bg-[#FDFAF5] border border-[#E8D5CF] rounded-2xl text-xs space-y-1 relative group shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#354D2E] text-sm">{r.fullName}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-[#C4715A]">{r.phone}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteRSVP(r.id)}
                                title="Xóa phản hồi này"
                                className="text-zinc-400 hover:text-[#C4715A] p-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#5C4033]">
                            <span>
                              {r.guestOf === "groom"
                                ? "Khách Nhà Trai"
                                : r.guestOf === "bride"
                                ? "Khách Nhà Gái"
                                : "Khách Cả Hai"}{" "}
                              • <strong className="text-[#354D2E]">{r.guestCount || 1} người</strong>
                            </span>
                            <span className={r.attendance === "attending" ? "text-emerald-700 font-bold" : "text-[#8C6A58]"}>
                              {r.attendance === "attending" ? "Tham dự" : "Vắng mặt"}
                            </span>
                          </div>

                          {r.dietaryOrNote && (
                            <p className="text-[11px] text-[#8C6A58] italic font-serif pt-0.5">
                              &ldquo;{r.dietaryOrNote}&rdquo;
                            </p>
                          )}

                          {r.emailSentTo && r.emailSentTo.length > 0 && (
                            <div className="text-[10px] text-[#8C6A58] flex items-center gap-1 pt-0.5 border-t border-[#E8D5CF]/40">
                              <Send className="w-2.5 h-2.5 text-[#4A6741]" />
                              <span>Đã gửi tới: {r.emailSentTo.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Danh sách lời chúc từ Sổ Lưu Bút */}
                  <div className="pt-4 border-t border-[#E8D5CF]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider font-bold text-[#354D2E] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C4715A]" />
                        Sổ Lưu Bút ({wishes.length})
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {wishes.length === 0 ? (
                        <div className="text-center py-5 text-xs text-[#8C6A58] bg-[#FDFAF5] rounded-2xl p-4 border border-[#E8D5CF]">
                          Chưa có lời chúc nào từ khách.
                        </div>
                      ) : (
                        wishes.map((w, i) => (
                          <div
                            key={w.id || i}
                            className="p-3 bg-[#FDFAF5] border border-[#E8D5CF] rounded-2xl text-xs space-y-1 relative group shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#354D2E] text-sm">{w.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#8C6A58] font-mono">
                                  {new Date(w.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteWish(w.id)}
                                  title="Xóa lời chúc này"
                                  className="text-zinc-400 hover:text-[#C4715A] p-1 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {w.relationship && (
                              <p className="text-[10px] text-[#C4715A] font-semibold">{w.relationship}</p>
                            )}
                            <p className="text-[11px] text-[#5C4033] italic font-serif leading-relaxed">
                              &ldquo;{w.content}&rdquo;
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sticky Action Bar */}
          <div className="p-3 bg-[#FDFAF5] border-t border-[#E8D5CF] flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  autoSaveStatus === "saving"
                    ? "bg-amber-500 animate-ping"
                    : isModified
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
              <span className="text-xs text-[#5C4033] font-medium">
                {autoSaveStatus === "saving"
                  ? "Đang lưu máy chủ..."
                  : isModified
                  ? "Có thay đổi chưa lưu"
                  : "Đã đồng bộ máy chủ"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleManualSave}
              disabled={isManualSaving}
              className="px-4 py-2 rounded-xl bg-[#4A6741] hover:bg-[#354D2E] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
            >
              {isManualSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Save className="w-3.5 h-3.5 text-[#C9A84C]" />
              )}
              <span>{isManualSaving ? "Đang lưu..." : "Lưu Thay Đổi Này"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Real-time Live Interactive Preview */}
        <div className="flex-1 bg-[#2C3E28] p-3 sm:p-5 flex items-center justify-center overflow-hidden relative">
          {previewDevice === "mobile" ? (
            /* Khung điện thoại thông minh viền cong cao cấp */
            <div className="w-[375px] max-w-full h-[700px] max-h-[calc(100vh-80px)] rounded-[44px] border-[10px] border-[#1C2919] shadow-2xl overflow-hidden relative bg-[#FDFAF5] flex flex-col ring-1 ring-[#C9A84C]/30">
              {/* Phone Notch */}
              <div className="h-6 bg-[#1C2919] w-36 mx-auto rounded-b-2xl z-40 shrink-0 flex items-center justify-center">
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
              </div>

              {/* Màn hình thiệp cưới tương tác trực tiếp */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-16 relative">
                <WeddingInvitationView
                  isPreview={true}
                  isOpen={previewEnvelopeOpen}
                  onOpenChange={setPreviewEnvelopeOpen}
                />
              </div>
            </div>
          ) : (
            /* Khung máy tính với thanh trình duyệt */
            <div className="w-full h-full max-h-[calc(100vh-80px)] rounded-2xl border-2 border-[#1C2919] shadow-2xl overflow-hidden flex flex-col bg-[#FDFAF5]">
              <div className="h-9 bg-[#1C2919] px-4 flex items-center gap-2 z-30 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C4715A]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A6741]" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-[#2C3E28] rounded-md py-0.5 px-3 text-[11px] text-[#A8BCA1] font-mono text-center truncate">
                  https://an-minh.vn/i/{data.slug || "quyet-han"}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pb-16 relative">
                <WeddingInvitationView
                  isPreview={true}
                  isOpen={previewEnvelopeOpen}
                  onOpenChange={setPreviewEnvelopeOpen}
                />
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

export default function AdminStudio({ initialData }: { initialData?: WeddingData }) {
  return (
    <WeddingDataProvider initialData={initialData}>
      <ToastProvider>
        <MusicProvider>
          <StudioContent />
        </MusicProvider>
      </ToastProvider>
    </WeddingDataProvider>
  );
}
