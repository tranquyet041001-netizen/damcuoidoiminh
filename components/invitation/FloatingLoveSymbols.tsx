"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SymbolItem {
  id: number;
  type: "double-happiness" | "heart" | "knot";
  x: number; // in vw
  duration: number;
  delay: number;
  size: number;
}

export const FloatingLoveSymbols: React.FC<{
  enabled?: boolean;
  theme?: "crimson-gold" | "sage-green";
}> = ({ enabled = true, theme = "crimson-gold" }) => {
  const [items, setItems] = useState<SymbolItem[]>([]);

  useEffect(() => {
    // 10 biểu tượng bay nhẹ ở 2 bên rìa màn hình (không che chính giữa)
    const generated: SymbolItem[] = Array.from({ length: 10 }).map((_, i) => {
      // Đặt ở 2 rìa màn hình: 3vw - 22vw hoặc 78vw - 97vw
      const isLeft = i % 2 === 0;
      const x = isLeft ? Math.random() * 18 + 2 : Math.random() * 18 + 80;
      const types: SymbolItem["type"][] =
        theme === "crimson-gold"
          ? ["double-happiness", "heart", "double-happiness", "knot"]
          : ["heart", "knot", "heart", "double-happiness"];

      return {
        id: i,
        type: types[i % types.length],
        x,
        duration: Math.random() * 5 + 9, // 9s - 14s
        delay: i * 1.5 + Math.random() * 2,
        size: Math.random() * 8 + 18, // 18px - 26px
      };
    });
    setItems(generated);
  }, [theme]);

  if (!enabled || items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden" aria-hidden="true">
      {items.map((item) => (
        <motion.div
          key={`sym-${item.id}`}
          initial={{
            x: `${item.x}vw`,
            y: "105vh",
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            x: [
              `${item.x}vw`,
              `${item.x + (item.id % 2 === 0 ? 3 : -3)}vw`,
              `${item.x}vw`,
            ],
            y: ["105vh", "55vh", "-10vh"],
            opacity: [0, 0.75, 0.7, 0],
            scale: [0.6, 1.05, 0.9],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute will-change-transform"
        >
          {item.type === "double-happiness" && (
            <div
              className="flex items-center justify-center font-serif font-bold text-[#C9A84C] select-none"
              style={{
                fontSize: item.size,
                textShadow: "0 0 10px rgba(245, 158, 11, 0.6), 0 2px 4px rgba(127, 29, 29, 0.4)",
              }}
            >
              囍
            </div>
          )}

          {item.type === "heart" && (
            <div
              className="flex items-center justify-center text-[#DC2626] select-none"
              style={{
                fontSize: item.size * 0.9,
                filter: "drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))",
              }}
            >
              ♥
            </div>
          )}

          {item.type === "knot" && (
            <div
              className="flex items-center justify-center text-[#F59E0B] font-bold select-none"
              style={{
                fontSize: item.size * 0.85,
                filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))",
              }}
            >
              ✦
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingLoveSymbols;
