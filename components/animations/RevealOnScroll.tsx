"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
  className?: string;
}

const dirMap = {
  up:    { y: 28, x: 0 },
  down:  { y: -28, x: 0 },
  left:  { x: -28, y: 0 },
  right: { x: 28, y: 0 },
  none:  { x: 0, y: 0 },
};

export function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  blur = false,
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const offset = dirMap[direction];
  const blurVal = blur ? "blur(6px)" : "blur(0px)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset, filter: blurVal }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, ...offset, filter: blurVal }
      }
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
