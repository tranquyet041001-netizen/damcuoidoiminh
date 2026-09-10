"use client";

import React from "react";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { MusicProvider } from "@/context/MusicContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";

export default function GuestViewWrapper() {
  return (
    <WeddingDataProvider>
      <ToastProvider>
        <MusicProvider>
          {/* Chế độ khách xem: không hiển thị nút chỉnh sửa / admin */}
          <WeddingInvitationView isGuestView={true} />
        </MusicProvider>
      </ToastProvider>
    </WeddingDataProvider>
  );
}
