"use client";

import React from "react";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";

export default function Home() {
  return (
    <WeddingDataProvider>
      <ToastProvider>
        <WeddingInvitationView />
      </ToastProvider>
    </WeddingDataProvider>
  );
}
