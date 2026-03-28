"use client";

import { useEffect, useRef } from "react";

interface MarqueeTickerProps {
  items: string[];
  speed?: number; // px/s, default 60
  separator?: string;
}

export function MarqueeTicker({ items, speed = 60, separator = "·" }: MarqueeTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const totalWidth = track.scrollWidth / 2; // two copies
    const duration = (totalWidth / speed) * 1000;

    animRef.current = track.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(-${totalWidth}px)` }],
      { duration, iterations: Infinity, easing: "linear" }
    );

    return () => animRef.current?.cancel();
  }, [speed]);

  const repeated = [...items, ...items]; // duplicate for seamless loop

  return (
    <div
      className="overflow-hidden py-5 select-none"
      style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex items-center gap-8 whitespace-nowrap w-max">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              {item}
            </span>
            <span style={{ color: "var(--accent-sage)" }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
