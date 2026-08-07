"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function MagneticButton({ children, className = "", ...props }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  }

  return (
    <motion.button
      ref={ref}
      animate={{ x: pos.x, y: pos.y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}