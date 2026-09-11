"use client";

import React, { useEffect, useState, useRef } from "react";

interface Petal {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  type: "petal" | "sakura" | "star";
  opacity: number;
}

/**
 * Ambient floating petals / golden particles overlay for entire wedding page.
 * Fixed overlay, very low z-index, pointer-events none.
 * Disabled on mobile screens (<768px) for performance.
 */
export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const generatedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || generatedRef.current) return;
    generatedRef.current = true;

    const types: Array<"petal" | "sakura" | "star"> = ["petal", "sakura", "star"];
    const generated: Petal[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 20,
      duration: 30 + Math.random() * 35,
      drift: (Math.random() - 0.5) * 120,
      rotate: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
      opacity: 0.15 + Math.random() * 0.25,
    }));
    setPetals(generated);
  }, [isMobile]);

  if (isMobile || petals.length === 0) return null;

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute top-0"
            style={{
              left: `${p.x}%`,
              animation: `petalFloat ${p.duration}s linear ${p.delay}s infinite`,
              "--drift": `${p.drift}px`,
              "--rotate-start": `${p.rotate}deg`,
              "--rotate-end": `${p.rotate + 360}deg`,
            } as React.CSSProperties}
          >
            {p.type === "star" ? (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 10 10"
                fill="none"
                style={{ opacity: p.opacity }}
              >
                <circle cx="5" cy="5" r="2.5" fill="#C9A84C" />
                <circle cx="5" cy="5" r="4" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
              </svg>
            ) : p.type === "sakura" ? (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 20 20"
                fill="none"
                style={{ opacity: p.opacity }}
              >
                {[0, 72, 144, 216, 288].map((angle, i) => (
                  <ellipse
                    key={i}
                    cx="10" cy="10"
                    rx="4" ry="2.2"
                    fill="#E8B4B8"
                    transform={`rotate(${angle} 10 10) translate(0 -5.5)`}
                  />
                ))}
                <circle cx="10" cy="10" r="2" fill="#F7C5C0" />
              </svg>
            ) : (
              <svg
                width={p.size * 1.4}
                height={p.size}
                viewBox="0 0 28 20"
                fill="none"
                style={{ opacity: p.opacity }}
              >
                <path
                  d="M14 1 C8 1 2 7 2 12 C2 17 7 19 14 19 C21 19 26 17 26 12 C26 7 20 1 14 1Z"
                  fill="#C9A84C"
                  fillOpacity="0.7"
                />
                <path d="M14 4 C14 4 8 10 8 14" stroke="#A8843A" strokeWidth="0.6" strokeOpacity="0.5" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes petalFloat {
          0% {
            transform: translateY(-40px) translateX(0) rotate(var(--rotate-start));
            opacity: 0;
          }
          5% { opacity: 1; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotate-end));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
