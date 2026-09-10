"use client";

import React from "react";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { MusicProvider } from "@/context/MusicContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WeddingInvitationView } from "@/components/invitation/WeddingInvitationView";
import { WeddingData } from "@/types/wedding";

export default function HomeViewWrapper({
  initialData,
}: {
  initialData?: WeddingData;
}) {
  return (
    <WeddingDataProvider initialData={initialData}>
      <ToastProvider>
        <MusicProvider>
          <WeddingInvitationView />
        </MusicProvider>
      </ToastProvider>
    </WeddingDataProvider>
  );
}
