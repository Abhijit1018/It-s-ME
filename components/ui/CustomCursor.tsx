"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select, label, [tabindex]";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReduced || isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let raf: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    // Event delegation: check if hovered target matches interactive selector
    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        ring?.classList.add("expanded");
      }
    }
    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        ring?.classList.remove("expanded");
      }
    }

    // Hide cursor over canvas elements
    function onMouseOverCanvas(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "CANVAS") {
        dot?.classList.add("hidden-cursor");
        ring?.classList.add("hidden-cursor");
      }
    }
    function onMouseOutCanvas(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "CANVAS") {
        dot?.classList.remove("hidden-cursor");
        ring?.classList.remove("hidden-cursor");
      }
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mouseover", onMouseOverCanvas);
    document.addEventListener("mouseout", onMouseOutCanvas);

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseover", onMouseOverCanvas);
      document.removeEventListener("mouseout", onMouseOutCanvas);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--accent-sage);
          pointer-events: none;
          z-index: 10000;
          will-change: transform;
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--accent-sage);
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          opacity: 0.6;
          transition: width 250ms cubic-bezier(0.16,1,0.3,1),
                      height 250ms cubic-bezier(0.16,1,0.3,1),
                      opacity 250ms;
        }
        .cursor-ring.expanded {
          width: 56px; height: 56px;
          opacity: 1;
        }
        .cursor-dot.hidden-cursor,
        .cursor-ring.hidden-cursor {
          opacity: 0;
        }
        @media (hover: none), (pointer: coarse) {
          .cursor-dot, .cursor-ring { display: none; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
