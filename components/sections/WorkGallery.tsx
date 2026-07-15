"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const FALLBACK_PROJECTS = [
  { slug: "recall-sap", title: "Recall", year: "2025", category: "SAP / AI", description: "AI-driven SAP outreach system — identifies overdue customers and automates communication workflows via Twilio and email, integrated with SAP OData and CAP model.", accent: "#7B9E87" },
  { slug: "arora-ai", title: "Arora AI", year: "2025", category: "AI", description: "The master agent for your machine — an autonomous AI assistant built in Python with tool use, memory, and multi-step reasoning.", accent: "#9BB8A4" },
  { slug: "bharat-biz-agent", title: "Bharat Biz Agent", year: "2025", category: "AI", description: "Voice + chat based business assistant for Hindi, English, and Hinglish speakers. Multi-lingual LLM orchestration for Indian SMEs.", accent: "#D4B896" },
  { slug: "numen", title: "Numen", year: "2026", category: "SAP / AI", description: "Autonomous Enterprise Intelligence Platform for SAP — 17 multi-agent AI reasoning over a live business graph, from incident to root cause to rupee impact.", accent: "#6B5B95" },
  { slug: "whitewire", title: "WhiteWire", year: "2026", category: "AI / Web", description: "AI-native canvas for product teams — describe an idea, get a connected board with real schemas, APIs, ORM models, ER diagrams, and docs per node.", accent: "#7B93C4" },
  { slug: "mindinspo", title: "MindInspo", year: "2026", category: "AI / Automation", description: "AI-powered idea incubator — submit a concept, get back a structured technical catalog: stack, trade-offs, comparables, and an architecture diagram.", accent: "#C4847A" },
  { slug: "redhope", title: "REDHOPE", year: "2025", category: "Django", description: "Blood and organ delivery logistics platform — inventory management, delivery tracking, and real-time coordination between hospitals and vendors.", accent: "#B07070" },
  { slug: "sap-fiori-sales", title: "SAP Fiori Sales Order App", year: "2025", category: "SAP", description: "Fiori UI5 application for sales order processing — built with SAPUI5, ABAP backend logic, and OData services for real-time synchronization.", accent: "#6090A0" },
  { slug: "shieldroute", title: "ShieldRoute", year: "2025", category: "TypeScript", description: "A TypeScript-based secure routing framework. Declarative route protection with middleware composition.", accent: "#8890C4" },
  { slug: "living-blossom", title: "Living Blossom", year: "2025", category: "Web", description: "A TypeScript web application — elegant UI with a focus on interaction design and component architecture.", accent: "#A8C4B0" },
  { slug: "nexus-os", title: "Nexus OS", year: "2025", category: "TypeScript", description: "An operating-system-inspired TypeScript project exploring windowed UI, file system abstractions, and process management in the browser.", accent: "#9BB8A4" },
  { slug: "legacy-lens", title: "LegacyLens", year: "2025", category: "Python", description: "The code legacy optimizer — analyzes Python codebases, identifies technical debt, and suggests refactoring paths using static analysis.", accent: "#BFA090" },
  { slug: "e-flower", title: "E-Flower", year: "2025", category: "Web", description: "Full-stack e-commerce application for a floral business, with product catalog, cart, and order management.", accent: "#C4A8B0" },
];

type ProjectItem = {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  accent: string;
};

interface WorkGalleryProps {
  projects?: ProjectItem[];
}

export function WorkGallery({ projects = FALLBACK_PROJECTS }: WorkGalleryProps) {
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category))).sort()];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="pt-40 pb-32" aria-label="Work gallery">
      <div className="container-editorial">
        {/* Header */}
        <RevealOnScroll direction="up" className="mb-16">
          <p className="section-number mb-3">All Work</p>
          <h1
            className="font-serif"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
          >
            Projects
          </h1>
        </RevealOnScroll>

        {/* Filter bar */}
        <div
          className="flex flex-wrap gap-2 mb-16 pb-8"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
          role="tablist"
          aria-label="Filter projects by category"
        >
          {categories.map((cat: string) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                background: activeCategory === cat ? "var(--accent-sage)" : "transparent",
                color: activeCategory === cat ? "#F7F4EF" : "var(--text-secondary)",
                border: `1px solid ${activeCategory === cat ? "var(--accent-sage)" : "var(--border-medium)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: [0.87, 0, 0.13, 1] } }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-12 py-8"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  aria-label={`${project.title} — ${project.category}`}
                >
                  <span
                    className="text-xs w-12 pt-1 flex-shrink-0"
                    style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-4 mb-2">
                      <h2
                        className="font-serif text-2xl md:text-3xl transition-colors duration-300 group-hover:text-[var(--accent-sage)]"
                        style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
                      >
                        {project.title}
                      </h2>
                      <span
                        className="text-xs"
                        style={{ color: project.accent, fontFamily: "var(--font-mono)" }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 md:pt-1">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                    >
                      {project.year}
                    </span>
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                      style={{ color: "var(--accent-sage)" }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
