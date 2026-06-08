"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const commands = [
  { label: "Home", href: "/", group: "Navigate" },
  { label: "Work", href: "/work", group: "Navigate" },
  { label: "About", href: "/about", group: "Navigate" },
  { label: "Skills", href: "/skills", group: "Navigate" },
  { label: "Writing", href: "/writing", group: "Navigate" },
  { label: "Lab", href: "/lab", group: "Navigate" },
  { label: "Uses", href: "/uses", group: "Navigate" },
  { label: "Now", href: "/now", group: "Navigate" },
  { label: "Contact", href: "/contact", group: "Navigate" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Keyboard navigation within palette
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIdx];
        if (cmd) navigate(cmd.href);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function navigate(href: string) {
    router.push(href);
    setOpen(false);
    setQuery("");
  }

  function handleClose() {
    setOpen(false);
    setQuery("");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(28, 28, 26, 0.5)" }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 -translate-x-1/2 top-[20vh] z-[201] w-full max-w-lg rounded-xl overflow-hidden"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-medium)",
              boxShadow: "var(--shadow-medium)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                }}
                aria-label="Search navigation"
                aria-autocomplete="list"
                aria-controls="command-palette-list"
                aria-activedescendant={
                  filtered[activeIdx] ? `cmd-${filtered[activeIdx].href}` : undefined
                }
                role="combobox"
                aria-expanded="true"
              />
              <kbd
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  color: "var(--text-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              id="command-palette-list"
              ref={listRef}
              className="max-h-72 overflow-y-auto py-2"
              role="listbox"
            >
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  No results found.
                </p>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.href}
                    id={`cmd-${cmd.href}`}
                    data-active={i === activeIdx}
                    onClick={() => navigate(cmd.href)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
                    style={{
                      color: "var(--text-primary)",
                      background: i === activeIdx ? "var(--border-subtle)" : "transparent",
                    }}
                    role="option"
                    aria-selected={i === activeIdx}
                  >
                    <span>{cmd.label}</span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                    >
                      {cmd.group}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div
              className="px-4 py-2 flex items-center gap-4"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                ↑↓ navigate · ↵ select · ESC close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
