"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { AvailabilityDot } from "@/components/ui/AvailabilityDot";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

const allLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/writing", label: "Writing" },
  { href: "/lab", label: "Lab" },
  { href: "/uses", label: "Uses" },
  { href: "/now", label: "Now" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, cycleTheme } = useTheme();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const themeIcon =
    theme === "light" ? "☀" : theme === "dark" ? "☾" : "◑";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all"
        style={{
          padding: scrolled ? "1rem 0" : "1.5rem 0",
        }}
      >
        <div
          className="container-editorial flex items-center justify-between"
          style={{
            transition: "all 400ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Monogram */}
          <Link
            href="/"
            className="font-serif text-xl tracking-tight relative group"
            id="logo-trigger"
            style={{ fontFamily: "var(--font-serif)" }}
            aria-label="Home"
          >
            <span
              className="transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              A.L
            </span>
            <span
              className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
              style={{ background: "var(--accent-sage)" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-sm tracking-wide group"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px transition-all duration-300"
                    style={{
                      background: "var(--accent-sage)",
                      width: active ? "100%" : "0%",
                    }}
                  />
                  {active && (
                    <span
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--accent-sage)" }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Availability */}
            <AvailabilityDot />

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="text-base w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
              aria-label={`Switch theme (current: ${theme})`}
            >
              {themeIcon}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                background: "var(--text-primary)",
                transform: menuOpen ? "rotate(45deg) translate(3px, 4px)" : "none",
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                background: "var(--text-primary)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                background: "var(--text-primary)",
                transform: menuOpen ? "rotate(-45deg) translate(3px, -4px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Frosted glass background when scrolled */}
        {scrolled && (
          <div
            className="absolute inset-0 -z-10 glass-panel"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          />
        )}
      </header>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center px-8"
            style={{ background: "var(--bg-primary)" }}
            aria-modal="true"
            role="dialog"
            aria-label="Navigation menu"
          >
            <nav className="space-y-6" aria-label="Mobile navigation">
              {allLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={href}
                    className="block text-5xl font-serif tracking-tight"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: pathname === href ? "var(--accent-sage)" : "var(--text-primary)",
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
              <AvailabilityDot />
              <button
                onClick={cycleTheme}
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                Theme: {theme}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
