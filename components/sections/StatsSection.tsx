"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: 39, suffix: "+", label: "GitHub repositories" },
  { value: 6, suffix: "", label: "Tech domains" },
  { value: 5, suffix: "+", label: "Languages & frameworks" },
  { value: 1, suffix: "", label: "SAP certification" },
];

function AnimatedCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: any = null;
    let isMounted = true;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!isMounted || !numRef.current) return;

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: numRef.current,
          start: "top 85%",
          onEnter: () => {
            if (hasAnimated.current) return;
            hasAnimated.current = true;
            if (prefersReduced) {
              if (numRef.current) numRef.current.textContent = `${value}${suffix}`;
              return;
            }
            const counter = { val: 0 };
            gsap.to(counter, {
              val: value,
              duration: 2,
              ease: "expo.out",
              onUpdate() {
                if (numRef.current) {
                  numRef.current.textContent = `${Math.round(counter.val)}${suffix}`;
                }
              },
            });
          },
        });
      }, numRef);
    }

    init();

    return () => {
      isMounted = false;
      ctx?.revert();
    };
  }, [value, suffix]);

  return (
    <div className="text-center">
      <div
        className="font-serif mb-2"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(3rem, 7vw, 5rem)",
          color: "var(--text-primary)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        <span ref={numRef}>0{suffix}</span>
      </div>
      <p
        className="text-xs tracking-widest uppercase"
        style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          }
        );
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
      className="py-24"
      aria-label="Stats"
      style={{ opacity: 0, borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="container-editorial">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat) => (
            <AnimatedCounter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
