"use client";

import { motion } from "framer-motion";

export function ScrollCue() {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-1"
      >
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "rgba(237, 232, 223, 0.5)", fontFamily: "var(--font-mono)" }}
        >
          Scroll
        </span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          style={{ color: "rgba(237, 232, 223, 0.5)" }}
        >
          <rect
            x="6"
            y="2"
            width="4"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </div>
  );
}
