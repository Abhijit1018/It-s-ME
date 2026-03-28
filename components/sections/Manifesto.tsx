"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const beliefs = [
  {
    number: "01",
    statement: "Build across the full spectrum. The most interesting problems live at the edges of what people think is possible.",
  },
  {
    number: "02",
    statement: "Language is infrastructure. If your tool only speaks English, half the world can't use it.",
  },
  {
    number: "03",
    statement: "AI should augment, not replace. The best agent is the one that makes you ten times more capable.",
  },
  {
    number: "04",
    statement: "Ship it and learn. A working prototype teaches more than a perfect design document.",
  },
  {
    number: "05",
    statement: "Enterprise software doesn't have to be ugly. SAP and beauty are not mutually exclusive.",
  },
  {
    number: "06",
    statement: "Write code for the next developer, not just the next release.",
  },
];

export function Manifesto() {
  return (
    <section
      className="py-32"
      aria-label="What I believe"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <RevealOnScroll direction="left" className="md:col-span-3">
            <p className="section-number mb-3">Chapter 06</p>
            <h2
              className="font-serif"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              What I Believe
            </h2>
          </RevealOnScroll>
        </div>

        <div className="space-y-0">
          {beliefs.map(({ number, statement }, i) => (
            <RevealOnScroll key={number} direction="up" delay={i * 0.07} blur>
              <div
                className="group py-6 flex items-start gap-8"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <span
                  className="text-xs pt-1 w-8 flex-shrink-0"
                  style={{ color: "var(--accent-sage)", fontFamily: "var(--font-mono)" }}
                >
                  {number}
                </span>
                <p
                  className="font-serif text-xl md:text-2xl transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--text-secondary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {statement}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
