"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function AboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      // Words in the big quote stagger in
      const words = sectionRef.current.querySelectorAll<HTMLElement>(".reveal-word");
      gsap.fromTo(
        words,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.04,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Side elements
      gsap.fromTo(
        ".at-chapter",
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          delay: 0.1,
        }
      );
      gsap.fromTo(
        ".at-link",
        { opacity: 0, x: 16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          delay: 0.2,
        }
      );
    }

    init();
  }, []);

  const quoteText =
    "From AI agents to game engines to enterprise SAP systems — I build across the full spectrum because the most interesting problems live at the edges of what people think is possible.";

  return (
    <section
      ref={sectionRef}
      className="py-32"
      aria-label="About teaser"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-2 at-chapter" style={{ opacity: 0 }}>
            <p className="section-number">Chapter 03</p>
          </div>
          <div className="md:col-span-7">
            <p
              className="font-serif text-2xl md:text-3xl leading-relaxed"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {quoteText.split(" ").map((word, i) => (
                <span key={i} className="reveal-word inline-block mr-[0.3em]" style={{ opacity: 0 }}>
                  {word}
                </span>
              ))}
            </p>
          </div>
          <div className="md:col-span-3 flex justify-end at-link" style={{ opacity: 0 }}>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="block pb-0.5"
                style={{ borderBottom: "1px solid var(--border-medium)" }}
              >
                Read more
              </span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
