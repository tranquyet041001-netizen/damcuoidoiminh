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

const LOCAL_STORAGE_KEY = "wedding_invitation_custom_data_v1";

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(undefined);

export const WeddingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isModified, setIsModified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client-side mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setIsModified(true);
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
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
      {isLoaded ? children : null}
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
