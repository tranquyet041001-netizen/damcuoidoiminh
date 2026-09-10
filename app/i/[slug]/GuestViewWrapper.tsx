"use client";

import React from "react";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";

export default function GuestViewWrapper() {
  return (
    <WeddingDataProvider>
      <ToastProvider>
        {/* Chế độ khách xem: không hiển thị nút chỉnh sửa / admin */}
        <WeddingInvitationView isGuestView={true} />
      </ToastProvider>
    </WeddingDataProvider>
  );
}
