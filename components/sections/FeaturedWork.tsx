"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const featuredProjects = [
  {
    slug: "arora-ai",
    title: "Arora AI",
    year: "2025",
    category: "AI / Python",
    description: "The master agent for your machine — autonomous AI assistant with tool use, memory, and multi-step reasoning.",
    color: "#7B9E87",
  },
  {
    slug: "bharat-biz-agent",
    title: "Bharat Biz Agent",
    year: "2025",
    category: "AI / Voice",
    description: "Voice + chat business assistant supporting Hindi, English, and Hinglish — built for Indian SMEs.",
    color: "#D4B896",
  },
  {
    slug: "shieldroute",
    title: "ShieldRoute",
    year: "2025",
    category: "TypeScript",
    description: "Declarative secure routing framework with role-based access control and middleware composition.",
    color: "#C4847A",
  },
];

export function FeaturedWork({ projects }: { projects?: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const displayProjects = projects && projects.length > 0 ? projects : featuredProjects;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ctx: any = null;
    let isMounted = true;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!isMounted || !sectionRef.current) return;

      ctx = gsap.context(() => {
        // Section header reveal
        gsap.fromTo(
          ".fw-header",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: ".fw-header", start: "top 85%" },
          }
        );

        // Cards: clip-path + translate stagger
        const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".project-card");
        if (!cards) return;

        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              clipPath: "inset(100% 0% 0% 0%)",
              y: 40,
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
              },
              delay: i * 0.08,
            }
          );

          // Inner content slides up on card reveal
          const inner = card.querySelector<HTMLElement>(".card-inner");
          if (inner) {
            gsap.fromTo(
              inner,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "expo.out",
                scrollTrigger: { trigger: card, start: "top 85%" },
                delay: i * 0.08 + 0.2,
              }
            );
          }
        });
      }, sectionRef);
    }

    init();

    return () => {
      isMounted = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32"
      aria-label="Featured work"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="container-editorial">
        {/* Header */}
        <div className="fw-header flex items-end justify-between mb-16" style={{ opacity: 0 }}>
          <div>
            <p className="section-number mb-3">Chapter 02</p>
            <h2
              className="font-serif"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              Selected Work
            </h2>
          </div>
          <Link
            href="/work"
            className="text-sm group flex items-center gap-2 pb-0.5"
            style={{
              color: "var(--text-secondary)",
              borderBottom: "1px solid var(--border-medium)",
            }}
          >
            View all
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Project list — editorial numbered layout */}
        <div className="space-y-3">
          {displayProjects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="project-card group hover-lift relative flex flex-col md:flex-row md:items-center gap-4 p-6 md:p-8 rounded-xl overflow-hidden"
              style={{
                background: `${project.color}0C`,
                border: "1px solid var(--border-subtle)",
                clipPath: "inset(100% 0% 0% 0%)",
                opacity: 0,
              }}
              aria-label={`${project.title} — ${project.category}, ${project.year}`}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-500 group-hover:w-1"
                style={{ background: project.color }}
              />

              {/* Index number */}
              <span
                className="text-xs w-8 shrink-0"
                style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Category + Year */}
              <div className="flex items-center gap-3 shrink-0 md:w-36">
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ color: project.color, fontFamily: "var(--font-mono)" }}
                >
                  {project.category}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                >
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <div className="card-inner flex-1" style={{ opacity: 0 }}>
                <h3
                  className="font-serif text-xl md:text-2xl mb-1 group-hover:text-[var(--accent-sage)] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
                >
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
                  {project.description}
                </p>
              </div>

              {/* Arrow */}
              <span
                className="text-xl opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 shrink-0"
                style={{ color: project.color }}
                aria-hidden="true"
              >
                →
              </span>

              {/* Hover fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `${project.color}06` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
