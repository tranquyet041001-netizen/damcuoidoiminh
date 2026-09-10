"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PetalConfig {
  id: number;
  startX: number; // in vw
  endXOffset: number; // in vw
  duration: number;
  delay: number;
  size: number;
  colorType: "crimson" | "rose" | "gold-crimson" | "pink-petal";
  rotations: number;
}

export const FallingPetals: React.FC<{
  enabled?: boolean;
  theme?: "crimson-gold" | "sage-green";
}> = ({ enabled = true, theme = "crimson-gold" }) => {
  const [petals, setPetals] = useState<PetalConfig[]>([]);

  useEffect(() => {
    // Tạo 20 cánh hoa ngẫu nhiên
    const generated: PetalConfig[] = Array.from({ length: 22 }).map((_, i) => {
      const colorTypes: PetalConfig["colorType"][] =
        theme === "crimson-gold"
          ? ["crimson", "rose", "gold-crimson", "crimson"]
          : ["rose", "pink-petal", "gold-crimson", "rose"];
      return {
        id: i,
        startX: Math.random() * 96 + 2, // 2vw - 98vw
        endXOffset: (Math.random() - 0.5) * 26, // lượn gió sang trái/phải 13vw
        duration: Math.random() * 6 + 7, // 7s - 13s rơi nhẹ nhàng
        delay: Math.random() * 8, // rải rác delay
        size: Math.random() * 10 + 14, // 14px - 24px
        colorType: colorTypes[i % colorTypes.length],
        rotations: Math.floor(Math.random() * 3) + 1,
      };
    });
    setPetals(generated);
  }, [theme]);

  if (!enabled || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {petals.map((p) => {
        // Gradient màu cho từng loại cánh hoa
        let bgGradient = "linear-gradient(135deg, #E11D48 0%, #9F171B 100%)";
        if (p.colorType === "rose") {
          bgGradient = "linear-gradient(135deg, #FB7185 0%, #BE123C 100%)";
        } else if (p.colorType === "gold-crimson") {
          bgGradient = "linear-gradient(135deg, #FDE68A 0%, #DC2626 100%)";
        } else if (p.colorType === "pink-petal") {
          bgGradient = "linear-gradient(135deg, #FDA4AF 0%, #F43F5E 100%)";
        }

        return (
          <motion.div
            key={`petal-${p.id}`}
            initial={{
              x: `${p.startX}vw`,
              y: "-5vh",
              opacity: 0,
              rotateZ: 0,
              rotateX: 0,
            }}
            animate={{
              x: [
                `${p.startX}vw`,
                `${p.startX + p.endXOffset * 0.5}vw`,
                `${p.startX - p.endXOffset * 0.3}vw`,
                `${p.startX + p.endXOffset}vw`,
              ],
              y: ["-5vh", "35vh", "70vh", "105vh"],
              opacity: [0, 0.85, 0.8, 0],
              rotateZ: [0, 180 * p.rotations, 360 * p.rotations],
              rotateX: [0, 180, 360],
              rotateY: [0, 240, 480],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute will-change-transform"
          >
            {/* Hình dạng cánh hoa đào/hoa hồng mềm mại */}
            <div
              style={{
                width: p.size,
                height: p.size * 1.35,
                background: bgGradient,
                borderRadius: "50% 0 50% 50%",
                boxShadow: "0 2px 6px rgba(159, 23, 27, 0.25)",
                transform: "rotate(-45deg)",
                opacity: 0.85,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FallingPetals;
