"use client";

import Link from "next/link";
import { AmbientSound } from "@/components/ui/AmbientSound";

const socialLinks = [
  { href: "https://github.com", label: "GitHub", handle: "@username" },
  { href: "https://linkedin.com", label: "LinkedIn", handle: "username" },
  { href: "https://x.com", label: "X / Twitter", handle: "@username" },
  { href: "mailto:hello@example.com", label: "Email", handle: "hello@example.com" },
];

const footerLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/writing", label: "Writing" },
  { href: "/lab", label: "Lab" },
  { href: "/uses", label: "Uses" },
  { href: "/now", label: "Now" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: "4rem",
        paddingBottom: "3rem",
      }}
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <p
              className="font-serif text-3xl mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              A.L
            </p>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Crafting digital experiences with intention. Available for select projects.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="section-number mb-4">Navigate</p>
            <nav className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm transition-colors hover:text-[var(--accent-sage)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="section-number mb-4">Connect</p>
            <div className="space-y-2">
              {socialLinks.map(({ href, label, handle }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm group"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="group-hover:text-[var(--accent-sage)] transition-colors">
                    {label}
                  </span>
                  <span style={{ color: "var(--text-tertiary)" }}>{handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rule-horizontal mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © {year} — All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <AmbientSound />
            <p
              className="text-xs"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              Built with Next.js + Three.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
