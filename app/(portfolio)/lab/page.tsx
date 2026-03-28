import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experiments, generative art, mini tools, and half-finished ideas.",
};

const labItems = [
  {
    slug: "noise-field",
    title: "Noise Field",
    description: "Perlin noise flow field with configurable particle count and speed. Built with p5.js.",
    tech: ["p5.js", "Canvas"],
    status: "Finished" as const,
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    slug: "type-specimen",
    title: "Variable Font Specimen",
    description: "Interactive specimen for exploring variable font axes in real time.",
    tech: ["CSS", "TypeScript", "Variable Fonts"],
    status: "Finished" as const,
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    slug: "gradient-mesh",
    title: "Gradient Mesh Generator",
    description: "Generate smooth mesh gradients. Export as CSS or SVG. Ongoing experiment.",
    tech: ["WebGL", "GLSL"],
    status: "Ongoing" as const,
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    slug: "reading-time",
    title: "Honest Reading Time",
    description: "A bookmarklet that calculates reading time based on your actual WPM, not 200wpm fiction.",
    tech: ["Vanilla JS"],
    status: "Finished" as const,
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    slug: "terrain-gen",
    title: "Procedural Terrain",
    description: "WebGL terrain generator using simplex noise. Very much in progress.",
    tech: ["Three.js", "GLSL"],
    status: "Archived" as const,
    demoUrl: "#",
    sourceUrl: "#",
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
