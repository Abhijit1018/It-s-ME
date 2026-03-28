import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experiments, generative art, mini tools, and half-finished ideas.",
};

const labItems = [
  {
    slug: "arora-ai-terminal",
    title: "Arora AI — Agent Terminal",
    description: "An autonomous AI assistant that runs in a terminal UI. Uses tool-calling, persistent memory, and multi-step reasoning to execute tasks. Built in Python with custom agent loop.",
    tech: ["Python", "LLM", "Tool Use", "Rich TUI"],
    status: "Ongoing" as const,
    demoUrl: "https://github.com/Abhijit1018/",
    sourceUrl: "https://github.com/Abhijit1018/",
  },
  {
    slug: "bharat-biz-voice",
    title: "Bharat Biz — Hindi Voice Mode",
    description: "Voice interface experiment for the Bharat Biz Agent. Handles mixed Hindi/Hinglish/English speech, transcribes with Whisper, and routes to the correct LLM chain.",
    tech: ["Python", "Whisper", "NLP", "Voice"],
    status: "Ongoing" as const,
    demoUrl: "https://github.com/Abhijit1018/",
    sourceUrl: "https://github.com/Abhijit1018/",
  },
  {
    slug: "nexus-os",
    title: "Nexus OS — Browser OS",
    description: "An operating-system-inspired UI in the browser. Windowed apps, a virtual file system, and draggable processes — all in TypeScript without a backend.",
    tech: ["TypeScript", "React", "CSS"],
    status: "Finished" as const,
    demoUrl: "https://github.com/Abhijit1018/",
    sourceUrl: "https://github.com/Abhijit1018/",
  },
  {
    slug: "shieldroute",
    title: "ShieldRoute — Secure Routing",
    description: "A TypeScript routing framework with declarative route protection, middleware composition, and role-based access. Zero runtime deps.",
    tech: ["TypeScript", "Node.js"],
    status: "Finished" as const,
    demoUrl: "https://github.com/Abhijit1018/",
    sourceUrl: "https://github.com/Abhijit1018/",
  },
  {
    slug: "unity-prototype",
    title: "Unity Indie — First Prototype",
    description: "A 3D game prototype built with Unity and C#. Exploring movement systems, basic physics, and level design as part of learning game development.",
    tech: ["Unity", "C#", "Game Dev"],
    status: "Archived" as const,
    demoUrl: "#",
    sourceUrl: "https://github.com/Abhijit1018/",
  },
];

const statusColors: Record<"Finished" | "Ongoing" | "Archived", string> = {
  Finished: "var(--accent-sage)",
  Ongoing: "var(--accent-sand)",
  Archived: "var(--text-tertiary)",
};

export default function LabPage() {
  return (
    <>
      <section className="pt-40 pb-32" aria-label="Lab">
        <div className="container-editorial">
          {/* Header */}
          <div className="mb-16">
            <p className="section-number mb-3">Lab</p>
            <h1
              className="font-serif mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              Experiments
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "55ch" }}>
              Half-finished ideas, generative sketches, mini tools. Things I build because
              I'm curious, not because anyone asked for them.
            </p>
          </div>

          {/* Mosaic grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labItems.map((item, i) => (
              <div
                key={item.slug}
                className={`rounded-xl p-6 flex flex-col ${i === 0 ? "md:col-span-2" : ""}`}
                style={{
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  minHeight: i === 0 ? "240px" : "200px",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: statusColors[item.status],
                      border: `1px solid ${statusColors[item.status]}`,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <h2
                  className="font-serif text-xl mb-2 flex-1"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
                >
                  {item.title}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "var(--border-subtle)",
                        color: "var(--text-tertiary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={item.demoUrl}
                    className="text-xs"
                    style={{ color: "var(--accent-sage)" }}
                  >
                    Demo →
                  </a>
                  <a
                    href={item.sourceUrl}
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Source
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
