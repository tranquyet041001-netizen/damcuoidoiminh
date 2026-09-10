"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WeddingData } from "@/types/wedding";
import { weddingData as defaultData } from "@/data/wedding";

interface WeddingDataContextType {
  data: WeddingData;
  updateData: (updater: Partial<WeddingData> | ((prev: WeddingData) => WeddingData)) => void;
  resetToDefault: () => void;
  isModified: boolean;
  saveChanges: () => void;
  exportAsCode: () => string;
}

const LOCAL_STORAGE_KEY = "wedding_invitation_custom_data_v4";
const LEGACY_LOCAL_STORAGE_KEY = "wedding_invitation_custom_data_v3";

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(undefined);

export const WeddingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isModified, setIsModified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage & server API on client-side mount
  useEffect(() => {
    let localData: WeddingData | null = null;
    try {
      let saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) {
        saved = localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.musicUrl ||
          parsed.musicUrl.includes("pixabay.com") ||
          parsed.musicUrl.includes("3gVd3gY8E0o") ||
          parsed.musicUrl.includes("9jDkx_k_N_U")
        ) {
          parsed.musicUrl = "/audio/wedding-acoustic.mp3";
        }
        localData = parsed;
        setData(parsed);
        setIsModified(true);
      }
    } catch {
      // ignore
    }

    // Fetch dữ liệu mới nhất từ server nếu client chưa có hoặc đồng bộ
    fetch("/api/wedding-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData) {
          // Nếu không có dữ liệu local hoặc server có dữ liệu hợp lệ
          if (!localData || JSON.stringify(serverData) !== JSON.stringify(defaultData)) {
            setData(serverData);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  const updateData = useCallback(
    (updater: Partial<WeddingData> | ((prev: WeddingData) => WeddingData)) => {
      setData((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        setIsModified(true);
        return next;
      });
    },
    []
  );

  const saveChanges = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setIsModified(true);
      // Đồng bộ lên server để mọi thiết bị / điện thoại quét mã QR đều xem được dữ liệu mới
      fetch("/api/wedding-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch((err) => console.warn("Failed to persist to server API:", err));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }
  }, [data]);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData(defaultData);
    setIsModified(false);
  }, []);

  const exportAsCode = useCallback(() => {
    return `import { WeddingData } from "@/types/wedding";\n\nexport const weddingData: WeddingData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;
  }, [data]);

  return (
    <WeddingDataContext.Provider
      value={{
        data,
        updateData,
        resetToDefault,
        isModified,
        saveChanges,
        exportAsCode,
      }}
    >
      {children}
    </WeddingDataContext.Provider>
  );
};

export const useWeddingData = () => {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error("useWeddingData must be used within a WeddingDataProvider");
  }
  return context;
};
