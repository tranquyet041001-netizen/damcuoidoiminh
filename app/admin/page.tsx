"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Camera,
  CreditCard,
  Users,
  Save,
  RotateCcw,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { RSVPSubmission, WishSubmission, WeddingEvent, StoryMilestone, GalleryItem } from "@/types/wedding";

function AdminContent() {
  const { data, updateData, saveChanges, resetToDefault, exportAsCode, isModified } = useWeddingData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "couple" | "time" | "events" | "story" | "gallery" | "bank" | "rsvps"
  >("couple");

  // Local state for RSVPs and Wishes management
  const [rsvps, setRsvps] = useState<RSVPSubmission[]>([]);
  const [wishes, setWishes] = useState<WishSubmission[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  useEffect(() => {
    if (activeTab === "rsvps") {
      fetchGuestsData();
    }
  }, [activeTab]);

  const fetchGuestsData = async () => {
    setLoadingGuests(true);
    try {
      const [rsvpRes, wishRes] = await Promise.all([
        fetch("/api/rsvp"),
        fetch("/api/wishes"),
      ]);
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

  const handleSave = () => {
    saveChanges();
    showToast("Đã lưu mọi thay đổi vào bộ nhớ trình duyệt!", "success");
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

    const headers = ["Họ và tên", "Số điện thoại", "Khách của", "Tham dự", "Số người", "Lời nhắn / Ghi chú", "Thời gian"];
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

    showToast("Đã xuất danh sách khách mời ra file Excel (CSV)!", "success");
  };

  return (
    <div className="min-h-screen bg-[#FAF3E8] text-[#3A2D26]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#FFF9EE] border-b border-[#E5D4B6] px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-[#183A3A] font-medium hover:text-[#9E3D32] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Thiệp Cưới</span>
            </Link>
            <span className="text-[#E5D4B6]">|</span>
            <h1 className="font-serif font-bold text-base sm:text-lg text-[#183A3A] flex items-center gap-1.5">
              <span>Chỉnh Sửa Thiệp Cưới</span>
              {isModified && (
                <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-full bg-[#9E3D32]/10 text-[#9E3D32] border border-[#9E3D32]/30">
                  Đã chỉnh sửa
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              title="Khôi phục mặc định ban đầu"
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#FFF9EE] hover:bg-[#FAF3E8] text-[#8A7569] border border-[#E5D4B6] text-xs font-medium transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi Phục</span>
            </button>

            <button
              type="button"
              onClick={handleExportCode}
              title="Tải về file data/wedding.ts để deploy Vercel"
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#FAF3E8] hover:bg-[#EADBCE] text-[#183A3A] border border-[#183A3A]/20 text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất wedding.ts</span>
            </button>

            <Link
              href="/"
              target="_blank"
              title="Mở trang thiệp cưới trong tab mới"
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#FFF9EE] hover:bg-[#FAF3E8] text-[#183A3A] border border-[#183A3A]/30 text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#78928A]" />
              <span>Xem Thiệp</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#9E3D32] hover:bg-[#BD4B3F] text-[#FFF9EE] text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Lại</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 border-b border-[#E5D4B6] no-scrollbar">
          {[
            { id: "couple", label: "Dâu & Rể", icon: Heart },
            { id: "time", label: "Thời Gian & Lời Ngỏ", icon: Calendar },
            { id: "events", label: "Sự Kiện Cưới", icon: Clock },
            { id: "story", label: "Chuyện Tình Yêu", icon: Sparkles },
            { id: "gallery", label: "Album Ảnh Cưới", icon: Camera },
            { id: "bank", label: "Tài Khoản & QR", icon: CreditCard },
            { id: "rsvps", label: "Khách Mời & Lời Chúc", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs sm:text-sm font-serif font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#183A3A] text-[#FFF9EE] shadow-xs"
                    : "bg-[#FFF9EE] text-[#6B5549] hover:bg-[#F4E8D2] border border-[#E5D4B6]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#F4E8D2]" : "text-[#78928A]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Cô Dâu & Chú Rể */}
        {activeTab === "couple" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chú Rể */}
            <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
                <h2 className="font-serif text-lg font-bold text-[#183A3A]">Thông Tin Chú Rể</h2>
                <span className="text-xs uppercase tracking-wider text-[#9E3D32] font-semibold">Nhà Trai</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Họ Và Tên Đầy Đủ
                </label>
                <input
                  type="text"
                  value={data.groom.fullName}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      groom: { ...prev.groom, fullName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Tên Thân Mật (Hiển thị tiêu đề)
                </label>
                <input
                  type="text"
                  value={data.groom.shortName}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      groom: { ...prev.groom, shortName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Phụ Mẫu Chú Rể
                </label>
                <input
                  type="text"
                  value={data.groom.parents}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      groom: { ...prev.groom, parents: e.target.value },
                    }))
                  }
                  placeholder="Quý nam của Ông... & Bà..."
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Đường Dẫn Ảnh Chú Rể (URL)
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
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm mb-2"
                />
                {data.groom.avatarUrl && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#E5D4B6]">
                    <Image src={data.groom.avatarUrl} alt="Chú rể" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Cô Dâu */}
            <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
                <h2 className="font-serif text-lg font-bold text-[#183A3A]">Thông Tin Cô Dâu</h2>
                <span className="text-xs uppercase tracking-wider text-[#9E3D32] font-semibold">Nhà Gái</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Họ Và Tên Đầy Đủ
                </label>
                <input
                  type="text"
                  value={data.bride.fullName}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      bride: { ...prev.bride, fullName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Tên Thân Mật (Hiển thị tiêu đề)
                </label>
                <input
                  type="text"
                  value={data.bride.shortName}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      bride: { ...prev.bride, shortName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Phụ Mẫu Cô Dâu
                </label>
                <input
                  type="text"
                  value={data.bride.parents}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      bride: { ...prev.bride, parents: e.target.value },
                    }))
                  }
                  placeholder="Ái nữ của Ông... & Bà..."
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Đường Dẫn Ảnh Cô Dâu (URL)
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
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm mb-2"
                />
                {data.bride.avatarUrl && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#E5D4B6]">
                    <Image src={data.bride.avatarUrl} alt="Cô dâu" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Thời Gian & Lời Ngỏ */}
        {activeTab === "time" && (
          <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-6 rounded-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-[#183A3A] pb-3 border-b border-[#EADBCE]">
              Thời Gian Cưới & Lời Ngỏ Chúc Phúc
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Ngày Hôn Lễ (Dương Lịch)
                </label>
                <input
                  type="text"
                  value={data.weddingDateFormatted}
                  onChange={(e) =>
                    updateData({ weddingDateFormatted: e.target.value })
                  }
                  placeholder="Chủ Nhật, 24 Tháng 01 Năm 2027"
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Ngày Âm Lịch
                </label>
                <input
                  type="text"
                  value={data.lunarDateFormatted}
                  onChange={(e) =>
                    updateData({ lunarDateFormatted: e.target.value })
                  }
                  placeholder="Nhằm ngày 17 tháng Chạp năm Bính Ngọ"
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Chuỗi ISO Cho Đếm Ngược
                </label>
                <input
                  type="text"
                  value={data.weddingDate}
                  onChange={(e) => updateData({ weddingDate: e.target.value })}
                  placeholder="2027-01-24T10:30:00+07:00"
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EADBCE]">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Câu Châm Ngôn (Quote Trang Chủ)
                </label>
                <input
                  type="text"
                  value={data.welcomeQuote}
                  onChange={(e) => updateData({ welcomeQuote: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                  Link Nhạc Nền (.mp3)
                </label>
                <input
                  type="url"
                  value={data.musicUrl}
                  onChange={(e) => updateData({ musicUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EADBCE] space-y-3">
              <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium">
                Nội Dung Bức Thư Ngỏ
              </label>
              {data.openingLetter.content.map((para, idx) => (
                <div key={idx} className="flex gap-2">
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
                    className="flex-1 px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm resize-none"
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
                    className="p-2 text-[#9E3D32] hover:bg-[#FAF3E8] rounded-sm self-start"
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
                      content: [...prev.openingLetter.content, "Đoạn thư ngỏ mới..."],
                    },
                  }));
                }}
                className="flex items-center gap-1.5 text-xs text-[#183A3A] font-semibold hover:underline mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm đoạn thư ngỏ</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Sự Kiện Cưới */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#183A3A]">
                Danh Sách Sự Kiện (Lễ & Tiệc)
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newEvent: WeddingEvent = {
                    id: `event-${Date.now()}`,
                    title: "Sự Kiện Mới",
                    subtitle: "Lễ Cưới",
                    date: data.weddingDateFormatted,
                    isoDate: data.weddingDate,
                    time: "11:00",
                    venue: "Tên địa điểm",
                    address: "Địa chỉ đầy đủ",
                    mapUrl: "https://maps.google.com",
                  };
                  updateData((prev) => ({
                    ...prev,
                    events: [...prev.events, newEvent],
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#183A3A] text-[#FFF9EE] text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Sự Kiện</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.events.map((evt, idx) => (
                <div key={evt.id} className="bg-[#FFF9EE] border border-[#E5D4B6] p-5 rounded-sm space-y-3 relative">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
                    <span className="font-serif font-bold text-base text-[#183A3A]">
                      Sự kiện #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateData((prev) => ({
                          ...prev,
                          events: prev.events.filter((e) => e.id !== evt.id),
                        }));
                      }}
                      className="text-[#9E3D32] hover:opacity-80 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                        Tiêu Đề
                      </label>
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => {
                          const newEvents = [...data.events];
                          newEvents[idx].title = e.target.value;
                          updateData({ events: newEvents });
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                        Phụ Đề
                      </label>
                      <input
                        type="text"
                        value={evt.subtitle || ""}
                        onChange={(e) => {
                          const newEvents = [...data.events];
                          newEvents[idx].subtitle = e.target.value;
                          updateData({ events: newEvents });
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                        Giờ
                      </label>
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => {
                          const newEvents = [...data.events];
                          newEvents[idx].time = e.target.value;
                          updateData({ events: newEvents });
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                        Ngày
                      </label>
                      <input
                        type="text"
                        value={evt.date}
                        onChange={(e) => {
                          const newEvents = [...data.events];
                          newEvents[idx].date = e.target.value;
                          updateData({ events: newEvents });
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                      Tên Địa Điểm
                    </label>
                    <input
                      type="text"
                      value={evt.venue}
                      onChange={(e) => {
                        const newEvents = [...data.events];
                        newEvents[idx].venue = e.target.value;
                        updateData({ events: newEvents });
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                      Địa Chỉ Chi Tiết
                    </label>
                    <input
                      type="text"
                      value={evt.address}
                      onChange={(e) => {
                        const newEvents = [...data.events];
                        newEvents[idx].address = e.target.value;
                        updateData({ events: newEvents });
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                      Đường Dẫn Google Maps
                    </label>
                    <input
                      type="url"
                      value={evt.mapUrl}
                      onChange={(e) => {
                        const newEvents = [...data.events];
                        newEvents[idx].mapUrl = e.target.value;
                        updateData({ events: newEvents });
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Chuyện Tình Yêu */}
        {activeTab === "story" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#183A3A]">
                Cột Mốc Chuyện Tình Yêu (Timeline)
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newStory: StoryMilestone = {
                    yearOrDate: "Mốc mới",
                    title: "Kỷ Niệm Mới",
                    description: "Chia sẻ câu chuyện kỷ niệm ngọt ngào của hai bạn...",
                    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
                    location: "Địa điểm",
                  };
                  updateData((prev) => ({
                    ...prev,
                    story: [...prev.story, newStory],
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#183A3A] text-[#FFF9EE] text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Cột Mốc</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.story.map((item, idx) => (
                <div key={idx} className="bg-[#FFF9EE] border border-[#E5D4B6] p-5 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-1 space-y-2">
                    <div className="relative w-full h-32 rounded-sm overflow-hidden border border-[#E5D4B6]">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <input
                      type="url"
                      value={item.imageUrl}
                      placeholder="Link ảnh"
                      onChange={(e) => {
                        const newStory = [...data.story];
                        newStory[idx].imageUrl = e.target.value;
                        updateData({ story: newStory });
                      }}
                      className="w-full px-2 py-1 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={item.yearOrDate}
                          onChange={(e) => {
                            const newStory = [...data.story];
                            newStory[idx].yearOrDate = e.target.value;
                            updateData({ story: newStory });
                          }}
                          placeholder="Mốc thời gian"
                          className="w-32 px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs font-bold text-[#9E3D32]"
                        />
                        <input
                          type="text"
                          value={item.location || ""}
                          onChange={(e) => {
                            const newStory = [...data.story];
                            newStory[idx].location = e.target.value;
                            updateData({ story: newStory });
                          }}
                          placeholder="Địa điểm"
                          className="w-36 px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs"
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
                        className="text-[#9E3D32] hover:opacity-80 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newStory = [...data.story];
                        newStory[idx].title = e.target.value;
                        updateData({ story: newStory });
                      }}
                      placeholder="Tiêu đề kỷ niệm"
                      className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm font-serif font-semibold text-[#183A3A]"
                    />

                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const newStory = [...data.story];
                        newStory[idx].description = e.target.value;
                        updateData({ story: newStory });
                      }}
                      placeholder="Mô tả kỷ niệm..."
                      className="w-full px-2.5 py-1.5 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Album Ảnh Cưới */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#183A3A]">
                Album Ảnh Cưới ({data.gallery.length} ảnh)
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newItem: GalleryItem = {
                    id: `gal-${Date.now()}`,
                    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
                    title: "Ảnh cưới mới",
                    caption: "Khoảnh khắc hạnh phúc",
                  };
                  updateData((prev) => ({
                    ...prev,
                    gallery: [...prev.gallery, newItem],
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#183A3A] text-[#FFF9EE] text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Ảnh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((item, idx) => (
                <div key={item.id} className="bg-[#FFF9EE] border border-[#E5D4B6] p-3 rounded-sm space-y-2 relative">
                  <div className="relative aspect-4/3 w-full rounded-xs overflow-hidden border border-[#EADBCE]">
                    <Image src={item.url} alt={item.title} fill className="object-cover" />
                  </div>

                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => {
                      const newGallery = [...data.gallery];
                      newGallery[idx].url = e.target.value;
                      updateData({ gallery: newGallery });
                    }}
                    placeholder="Đường dẫn ảnh (URL)"
                    className="w-full px-2 py-1 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newGallery = [...data.gallery];
                        newGallery[idx].title = e.target.value;
                        updateData({ gallery: newGallery });
                      }}
                      placeholder="Tiêu đề ảnh"
                      className="flex-1 px-2 py-1 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs font-medium"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        updateData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter((g) => g.id !== item.id),
                        }));
                      }}
                      className="text-[#9E3D32] hover:opacity-80 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const newGallery = [...data.gallery];
                      newGallery[idx].caption = e.target.value;
                      updateData({ gallery: newGallery });
                    }}
                    placeholder="Chú thích ảnh..."
                    className="w-full px-2 py-1 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-[11px] text-[#6B5549] italic"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Tài Khoản Mừng Cưới & QR */}
        {activeTab === "bank" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.bankAccounts.map((acc, idx) => (
              <div key={idx} className="bg-[#FFF9EE] border border-[#E5D4B6] p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
                  <h2 className="font-serif text-lg font-bold text-[#183A3A]">{acc.label}</h2>
                  <span className="text-xs uppercase tracking-wider text-[#9E3D32] font-semibold">
                    {acc.ownerType === "groom" ? "Chú Rể" : "Cô Dâu"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                    Tên Ngân Hàng
                  </label>
                  <input
                    type="text"
                    value={acc.bankName}
                    onChange={(e) => {
                      const newAccounts = [...data.bankAccounts];
                      newAccounts[idx].bankName = e.target.value;
                      updateData({ bankAccounts: newAccounts });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                    Số Tài Khoản
                  </label>
                  <input
                    type="text"
                    value={acc.accountNumber}
                    onChange={(e) => {
                      const newAccounts = [...data.bankAccounts];
                      newAccounts[idx].accountNumber = e.target.value;
                      // Cập nhật URL VietQR tự động nếu dùng link VietQR
                      if (newAccounts[idx].qrImageUrl.includes("api.vietqr.io")) {
                        newAccounts[idx].qrImageUrl = `https://api.vietqr.io/image/970436-${e.target.value}-compact.jpg?accountName=${encodeURIComponent(
                          newAccounts[idx].accountHolder
                        )}&amount=0`;
                      }
                      updateData({ bankAccounts: newAccounts });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm font-mono font-bold text-[#9E3D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                    Chủ Tài Khoản (In hoa)
                  </label>
                  <input
                    type="text"
                    value={acc.accountHolder}
                    onChange={(e) => {
                      const newAccounts = [...data.bankAccounts];
                      newAccounts[idx].accountHolder = e.target.value.toUpperCase();
                      updateData({ bankAccounts: newAccounts });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                    Link Ảnh Mã QR
                  </label>
                  <input
                    type="url"
                    value={acc.qrImageUrl}
                    onChange={(e) => {
                      const newAccounts = [...data.bankAccounts];
                      newAccounts[idx].qrImageUrl = e.target.value;
                      updateData({ bankAccounts: newAccounts });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs mb-2"
                  />
                  {acc.qrImageUrl && (
                    <div className="relative w-32 h-32 bg-white p-2 rounded-sm border border-[#E5D4B6]">
                      <Image src={acc.qrImageUrl} alt="QR Code" fill className="object-contain p-1" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5549] font-medium mb-1">
                    Ghi Chú Chuyển Khoản
                  </label>
                  <input
                    type="text"
                    value={acc.customNote || ""}
                    onChange={(e) => {
                      const newAccounts = [...data.bankAccounts];
                      newAccounts[idx].customNote = e.target.value;
                      updateData({ bankAccounts: newAccounts });
                    }}
                    placeholder="Mừng cưới..."
                    className="w-full px-3 py-2 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: Quản Lý Khách Mời & Lời Chúc (RSVP & Wishes) */}
        {activeTab === "rsvps" && (
          <div className="space-y-6">
            {/* Header thống kê */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-4 rounded-sm">
                <div className="text-xs uppercase tracking-wider text-[#78928A] font-semibold">Tổng Phản Hồi</div>
                <div className="font-serif text-2xl font-bold text-[#183A3A] mt-1">{rsvps.length}</div>
              </div>

              <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-4 rounded-sm">
                <div className="text-xs uppercase tracking-wider text-[#9E3D32] font-semibold">Chắc Chắn Đến</div>
                <div className="font-serif text-2xl font-bold text-[#9E3D32] mt-1">
                  {rsvps.filter((r) => r.attendance === "attending").length}
                </div>
              </div>

              <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-4 rounded-sm">
                <div className="text-xs uppercase tracking-wider text-[#183A3A] font-semibold">Tổng Số Khách Dự</div>
                <div className="font-serif text-2xl font-bold text-[#183A3A] mt-1">
                  {rsvps
                    .filter((r) => r.attendance === "attending")
                    .reduce((sum, r) => sum + (r.guestCount || 1), 0)}
                </div>
              </div>

              <div className="bg-[#FFF9EE] border border-[#E5D4B6] p-4 rounded-sm">
                <div className="text-xs uppercase tracking-wider text-[#8A7569] font-semibold">Lời Chúc Đã Nhận</div>
                <div className="font-serif text-2xl font-bold text-[#183A3A] mt-1">{wishes.length}</div>
              </div>
            </div>

            {/* Bảng danh sách khách mời */}
            <div className="bg-[#FFF9EE] border border-[#E5D4B6] rounded-sm p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EADBCE]">
                <h2 className="font-serif text-lg font-bold text-[#183A3A] flex items-center gap-2">
                  <span>Danh Sách Khách Phản Hồi</span>
                  <span className="text-xs font-sans text-[#78928A] font-normal">({rsvps.length} lượt)</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchGuestsData}
                    className="px-3 py-1.5 rounded-sm bg-[#FAF3E8] hover:bg-[#EADBCE] text-[#183A3A] text-xs font-medium border border-[#E5D4B6]"
                  >
                    Làm mới
                  </button>

                  <button
                    type="button"
                    onClick={exportRsvpsToCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#183A3A] hover:bg-[#2B5757] text-[#FFF9EE] text-xs font-medium shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#F4E8D2]" />
                    <span>Xuất Excel (CSV)</span>
                  </button>
                </div>
              </div>

              {loadingGuests ? (
                <div className="py-8 text-center text-sm text-[#8A7569]">Đang tải dữ liệu...</div>
              ) : rsvps.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#8A7569]">Chưa có khách nào gửi phản hồi RSVP.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#EADBCE] text-[#78928A] uppercase tracking-wider text-[11px]">
                        <th className="pb-2 font-semibold">Khách</th>
                        <th className="pb-2 font-semibold">SĐT</th>
                        <th className="pb-2 font-semibold">Khách của</th>
                        <th className="pb-2 font-semibold">Tình trạng</th>
                        <th className="pb-2 font-semibold">Số lượng</th>
                        <th className="pb-2 font-semibold">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADBCE]/60 text-[#3A2D26]">
                      {rsvps.map((r, i) => (
                        <tr key={i} className="hover:bg-[#FAF3E8]/50">
                          <td className="py-2.5 font-medium">{r.fullName}</td>
                          <td className="py-2.5 font-mono text-xs">{r.phone}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-xs text-[11px] bg-[#FAF3E8] border border-[#E5D4B6]">
                              {r.guestOf === "groom" ? "Nhà Trai" : r.guestOf === "bride" ? "Nhà Gái" : "Cả Hai"}
                            </span>
                          </td>
                          <td className="py-2.5">
                            {r.attendance === "attending" ? (
                              <span className="text-green-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Tham dự</span>
                              </span>
                            ) : (
                              <span className="text-[#8A7569]">Vắng mặt</span>
                            )}
                          </td>
                          <td className="py-2.5 font-semibold text-center sm:text-left">{r.guestCount} người</td>
                          <td className="py-2.5 text-xs text-[#6B5549] max-w-xs truncate">{r.dietaryOrNote || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Danh sách lời chúc */}
            <div className="bg-[#FFF9EE] border border-[#E5D4B6] rounded-sm p-5 space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#183A3A] pb-3 border-b border-[#EADBCE]">
                Sổ Lưu Bút & Lời Chúc ({wishes.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {wishes.map((w) => (
                  <div key={w.id} className="p-3 bg-[#FAF3E8] border border-[#E5D4B6] rounded-sm text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#183A3A]">{w.name}</span>
                      <span className="text-[#78928A]">{w.relationship}</span>
                    </div>
                    <p className="italic text-[#5A473E]">&ldquo;{w.content}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <WeddingDataProvider>
      <ToastProvider>
        <AdminContent />
      </ToastProvider>
    </WeddingDataProvider>
  );
}
