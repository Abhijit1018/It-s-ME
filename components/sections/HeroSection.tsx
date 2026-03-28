"use client";

import { useEffect, useRef } from "react";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { HeroModel } from "@/components/3d/HeroModel";
import { ScrollCue } from "@/components/ui/ScrollCue";

const HERO = {
  name: "Abhijit Singh",
  tagline: "Full-Stack · AI · .NET · Game Dev",
  description:
    "Python developer, .NET engineer, SAP Backend Certified, and web builder — crafting tools that think, interact, and scale.",
  chapterLabel: "Chapter 01",
  availability: "Open to opportunities",
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ctx: any = null;
    let isMounted = true;

    async function animate() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!isMounted || !sectionRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo(
          ".hero-chapter",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.3
        );

        if (lineRef.current) {
          tl.fromTo(
            lineRef.current,
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 0.8, ease: "expo.inOut" },
            0.5
          );
        }

        const chars = headlineRef.current?.querySelectorAll<HTMLSpanElement>(".char");
        if (chars && chars.length > 0) {
          tl.fromTo(
            chars,
            { opacity: 0, y: 60, rotateX: -40 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.03,
              duration: 0.8,
              ease: "expo.out",
            },
            0.6
          );
        }

        tl.fromTo(
          ".hero-tagline",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.2
        );
        tl.fromTo(
          ".hero-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.35
        );

        if (metaRef.current && metaRef.current.children.length > 0) {
          tl.fromTo(
            Array.from(metaRef.current.children),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
            1.5
          );
        }

        gsap.to(".hero-video-wrap", {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-content", {
          opacity: 0,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "20% top",
            end: "60% top",
            scrub: true,
          },
        });
      }, sectionRef);
    }

    animate();

    return () => {
      isMounted = false;
      ctx?.revert();
    };
  }, []);

  function wrapChars(text: string, extraClass = "") {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={`char inline-block ${char === " " ? "mr-[0.25em]" : ""} ${extraClass}`}
        style={{ opacity: 0 }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Video background with parallax wrapper */}
      <div className="hero-video-wrap absolute inset-0 scale-110">
        <VideoBackground
          mp4="https://assets.mixkit.co/videos/28342/28342-720.mp4"
        />
      </div>

      {/* Layered gradient overlays */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(28,24,20,0.75) 0%, rgba(28,24,20,0.3) 60%, rgba(28,24,20,0.6) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{
          background: "linear-gradient(to top, var(--bg-primary), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="hero-content container-editorial relative z-20 pt-32 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center">
          {/* Left */}
          <div>
            {/* Chapter label + rule */}
            <div className="flex items-center gap-4 mb-8">
              <p
                className="hero-chapter section-number"
                style={{ opacity: 0, color: "var(--accent-sage)" }}
              >
                {HERO.chapterLabel}
              </p>
              <div
                ref={lineRef}
                className="flex-1 h-px"
                style={{ background: "rgba(123,158,135,0.4)", transform: "scaleX(0)", transformOrigin: "left" }}
              />
            </div>

            {/* Name headline — perspective for 3D char reveal */}
            <div
              ref={headlineRef}
              aria-label={HERO.name}
              style={{ perspective: "600px" }}
            >
              <h1
                className="font-serif leading-none"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#F7F4EF",
                  fontSize: "clamp(3.5rem, 10vw, 8rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                {wrapChars(HERO.name.split(" ")[0])}
              </h1>
              <h1
                className="font-serif leading-none"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--accent-sage)",
                  fontSize: "clamp(3.5rem, 10vw, 8rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                {wrapChars(HERO.name.split(" ").slice(1).join(" "))}
              </h1>
            </div>

            {/* Tagline */}
            <p
              className="hero-tagline font-serif mt-6 mb-4"
              style={{
                fontFamily: "var(--font-serif)",
                color: "rgba(237, 232, 223, 0.7)",
                fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                opacity: 0,
                fontStyle: "italic",
              }}
            >
              {HERO.tagline}
            </p>

            {/* Description */}
            <p
              className="hero-desc text-sm leading-relaxed max-w-sm"
              style={{ color: "rgba(237, 232, 223, 0.6)", opacity: 0 }}
            >
              {HERO.description}
            </p>

            {/* Meta row */}
            <div
              ref={metaRef}
              className="flex flex-wrap items-center gap-6 mt-10"
            >
              <span
                className="flex items-center gap-2 text-xs"
                style={{ color: "rgba(237, 232, 223, 0.5)", fontFamily: "var(--font-mono)", opacity: 0 }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "var(--accent-sage)" }}
                />
                {HERO.availability}
              </span>
              <span
                className="text-xs"
                style={{ color: "rgba(237, 232, 223, 0.3)", fontFamily: "var(--font-mono)", opacity: 0 }}
              >
                Vadodara, India
              </span>
            </div>
          </div>

          {/* Right: 3D Model */}
          <div
            className="relative hidden lg:block"
            style={{ height: "660px" }}
          >
            <HeroModel />
          </div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
