"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * The animated circular Beauty Match score — counts up while the ring draws
 * in. Sized for both the compact product-card badge and the large quiz
 * result "climax" moment via the `size` prop.
 */
export default function MatchScore({
  score,
  size = 64,
  label = "MATCH",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const [display, setDisplay] = useState(0);
  const progress = useMotionValue(0);
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = useTransform(progress, (v) => circumference * (1 - v / 100));

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [score, progress]);

  const tone = score >= 80 ? "var(--gold)" : score >= 60 ? "var(--gold-soft)" : "var(--muted)";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} percent beauty match`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display leading-none"
          style={{ fontSize: size * 0.28, color: "var(--ink)" }}
        >
          {display}
          <span style={{ fontSize: size * 0.16 }}>%</span>
        </span>
        {size >= 56 && (
          <span
            className="font-mono uppercase tracking-widest text-[var(--muted)]"
            style={{ fontSize: Math.max(7, size * 0.09) }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
