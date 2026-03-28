"use client";

import { useEffect, useRef } from "react";
import { VideoBackground } from "@/components/ui/VideoBackground";

export function AboutHero() {
  const textRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = textRef.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.3,
        }
      );

      if (sectionRef.current) {
        gsap.to(".about-video-wrap", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }

    init();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex items-end pb-20 overflow-hidden"
      aria-label="About hero"
    >
      {/* Mixkit – "Landscape of mountains and sunset" (ID 3128) */}
      <div className="about-video-wrap absolute inset-0">
        <VideoBackground
          mp4="https://assets.mixkit.co/videos/3128/3128-720.mp4"
          overlay
        />
      </div>

      <div className="container-editorial relative z-20">
        <div className="max-w-3xl" ref={textRef} style={{ opacity: 0 }}>
          <p className="section-number mb-6" style={{ color: "var(--accent-sage)" }}>
            Chapter 04 — About
          </p>
          <h1
            className="font-serif mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#F7F4EF",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.2,
            }}
          >
            I believe the best work lives at the boundary between what is possible and what
            is beautiful.
          </h1>
          <p style={{ color: "rgba(237, 232, 223, 0.75)", maxWidth: "55ch" }}>
            Designer-developer. I think in systems, feel in details, and build with both.
            Based in Berlin, working globally.
          </p>
        </div>
      </div>
    </section>
  );
}
