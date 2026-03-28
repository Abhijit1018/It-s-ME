"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function EasterEggs() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  // Konami code
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      setSequence((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.join(",") === KONAMI.join(",")) {
          setKonamiActive(true);
          setTimeout(() => setKonamiActive(false), 3000);
        }
        return next;
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Logo click 5x — hidden terminal
  useEffect(() => {
    let count = 0;
    let timer: ReturnType<typeof setTimeout>;

    function onClick() {
      count += 1;
      clearTimeout(timer);
      timer = setTimeout(() => { count = 0; }, 1000);

      if (count >= 5) {
        count = 0;
        // Trigger terminal modal (handled separately)
        document.dispatchEvent(new CustomEvent("open-terminal"));
      }
    }

    const logo = document.getElementById("logo-trigger");
    logo?.addEventListener("click", onClick);
    return () => logo?.removeEventListener("click", onClick);
  }, []);

  return (
    <AnimatePresence>
      {konamiActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[9000] flex items-center justify-center pointer-events-none"
        >
          <div
            className="px-10 py-8 rounded-2xl text-center"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--accent-sage)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <div className="text-5xl mb-3">🕹</div>
            <p
              className="font-serif text-2xl mb-1"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              You found it.
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              ↑↑↓↓←→←→BA — classic
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
