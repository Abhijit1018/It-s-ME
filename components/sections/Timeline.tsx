"use client";

import { useEffect, useRef } from "react";

const FALLBACK_MILESTONES = [
  { year: "2025", title: "AI Agent Development", company: "Independent", type: "Open Source", description: "Building autonomous AI agents — Arora AI and Bharat Biz Agent — exploring voice interfaces, multi-lingual support, and LLM orchestration." },
  { year: "2025", title: "SAP Backend Certified", company: "SAP", type: "Certification", description: "Achieved SAP backend certification, bridging enterprise ERP systems with modern web and Python development." },
  { year: "2025", title: "Full-Stack TypeScript Projects", company: "Independent", type: "Projects", description: "Shipped multiple TypeScript projects — ShieldRoute, Living Blossom, Nexus OS — expanding into modern frontend architecture with Next.js and Three.js." },
  { year: "2025", title: ".NET & Enterprise Development", company: "Independent", type: "Learning", description: "Deep dived into the .NET ecosystem, building enterprise-grade backend systems alongside Python and JavaScript projects." },
  { year: "2025", title: "Started the Journey", company: "GitHub", type: "Milestone", description: "Joined GitHub and immediately shipped 39+ repositories across Python, TypeScript, JavaScript, and HTML — zero to full-stack in months." },
];

type MilestoneItem = {
  year: string;
  title: string;
  company: string;
  type: string;
  description: string;
};

interface TimelineProps {
  milestones?: MilestoneItem[];
}

export function Timeline({ milestones = FALLBACK_MILESTONES }: TimelineProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            duration: 2,
            ease: "none",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          }
        );
      }

      const items = document.querySelectorAll<HTMLElement>(".timeline-item");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: i % 2 === 0 ? -24 : 24, filter: "blur(3px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }

    init();
  }, []);

  return (
    <section className="py-32" aria-label="Career timeline" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-3">
            <p className="section-number mb-3">Chapter 05</p>
            <h2
              className="font-serif"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              Timeline
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-0 md:left-[200px] top-0 bottom-0 w-px"
            style={{ background: "var(--border-medium)" }}
            aria-hidden="true"
          />

          <div className="space-y-12">
            {milestones.map((milestone, i) => (
              <div
                key={i}
                className="timeline-item grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pl-8 md:pl-0"
                style={{ opacity: 0 }}
              >
                {/* Year */}
                <div className="md:col-span-2 flex md:justify-end md:pr-8 relative">
                  <span
                    className="text-sm font-mono pt-0.5"
                    style={{ color: "var(--accent-sage)", fontFamily: "var(--font-mono)" }}
                  >
                    {milestone.year}
                  </span>
                  {/* Dot */}
                  <div
                    className="absolute left-[-33px] md:left-auto md:right-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--accent-sage)",
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-10 md:pl-8 pb-8 md:pb-0" style={{ borderBottom: i < milestones.length - 1 ? "none" : "none" }}>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3
                      className="font-serif text-lg"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
                    >
                      {milestone.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        color: "var(--accent-sage)",
                        border: "1px solid var(--accent-sage)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {milestone.type}
                    </span>
                  </div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                  >
                    {milestone.company}
                  </p>
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
