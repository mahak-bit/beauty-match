"use client";

import { motion } from "framer-motion";

export default function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}