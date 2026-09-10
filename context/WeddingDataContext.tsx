"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { WeddingData } from "@/types/wedding";
import { weddingData as defaultData } from "@/data/wedding";

interface WeddingDataContextType {
  data: WeddingData;
  updateData: (
    updater: Partial<WeddingData> | ((prev: WeddingData) => WeddingData)
  ) => void;
  resetToDefault: () => Promise<void>;
  isModified: boolean;
  saveChanges: (customData?: WeddingData) => Promise<boolean>;
  exportAsCode: () => string;
}

const LOCAL_STORAGE_KEY = "wedding_invitation_custom_data_v4";

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(
  undefined
);

export const WeddingDataProvider: React.FC<{
  children: React.ReactNode;
  initialData?: WeddingData;
}> = ({ children, initialData }) => {
  const [data, setData] = useState<WeddingData>(initialData || defaultData);
  const [isModified, setIsModified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(Boolean(initialData));

  // Tải dữ liệu đồng nhất: Server API là nguồn chuẩn, localStorage làm bộ nhớ đệm
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setIsLoaded(true);
      return;
    }

    let isSubscribed = true;

    // Ưu tiên đồng bộ dữ liệu mới nhất từ server
    fetch("/api/wedding-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (!isSubscribed) return;
        if (serverData && typeof serverData === "object" && serverData.groom) {
          setData(serverData);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        if (!isSubscribed) return;
        // Nếu offline, đọc từ localStorage
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            setData(JSON.parse(saved));
          }
        } catch {
          // ignore
        }
      })
      .finally(() => {
        if (isSubscribed) setIsLoaded(true);
      });

    return () => {
      isSubscribed = false;
    };
  }, [initialData]);

  const updateData = useCallback(
    (updater: Partial<WeddingData> | ((prev: WeddingData) => WeddingData)) => {
      setData((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        setIsModified(true);
        return next;
      });
    },
    []
  );

  const saveChanges = useCallback(
    async (customData?: WeddingData): Promise<boolean> => {
      const payload = customData || data;
      try {
        // 1. Lưu vào localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
        setIsModified(false);

        // 2. Lưu đồng bộ lên server qua API (ghi vào data/saved_wedding_data.json và data/wedding.ts)
        const res = await fetch("/api/wedding-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        return res.ok;
      } catch (err) {
        console.error("Lỗi khi lưu dữ liệu thiệp cưới:", err);
        return false;
      }
    },
    [data]
  );


  const resetToDefault = useCallback(async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setData(defaultData);
      setIsModified(false);
      await fetch("/api/wedding-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultData),
      });
    } catch {
      // ignore
    }
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
