"use client";

import { motion } from "framer-motion";
import { Footer } from "./Footer";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.3, ease: [0.87, 0, 0.13, 1] } }}
    >
      {children}
      <Footer />
    </motion.div>
  );
}
