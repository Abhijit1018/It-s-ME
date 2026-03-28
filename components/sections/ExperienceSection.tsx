"use client";

import { useEffect, useRef } from "react";

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Full-Stack Developer & AI Engineer",
    company: "Independent / Freelance",
    period: "2024 — Present",
    location: "Vadodara, India",
    type: "Self-Employed",
    highlights: [
      "Built Arora AI — an autonomous Python agent with tool use, persistent memory, and multi-step reasoning.",
      "Developed Bharat Biz Agent: a voice + chat assistant handling Hindi, Hinglish, and English for Indian SMEs.",
      "Shipped 39+ public GitHub repositories across Python, TypeScript, JavaScript, .NET/C#, and HTML.",
      "Built full-stack TypeScript projects: ShieldRoute (secure routing framework), Nexus OS (browser OS UI), Living Blossom.",
    ],
  },
  {
    role: "SAP Backend Developer",
    company: "SAP Certified",
    period: "2024",
    location: "Remote",
    type: "Certification & Practice",
    highlights: [
      "Achieved SAP Backend Certification, covering ABAP development, data dictionary, and ERP integration patterns.",
      "Built internal tooling to bridge SAP systems with modern REST APIs and Python microservices.",
      "Explored CQRS and clean architecture patterns applied to enterprise-scale ERP data flows.",
    ],
  },
  {
    role: ".NET & Enterprise Developer",
    company: "Independent",
    period: "2024 — Present",
    location: "Vadodara, India",
    type: "Learning & Projects",
    highlights: [
      "Deep dived into ASP.NET Core, Entity Framework Core, and CQRS architecture patterns.",
      "Implemented REST APIs and data-intensive backend systems in C# alongside Python and TypeScript work.",
      "Exploring Unity with C# for indie game development as a side focus.",
    ],
  },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
        gsap.fromTo(
          ".exp-item",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }, sectionRef);
    }

    animate();
    return () => { isMounted = false; ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} className="py-24" aria-label="Experience">
      <div className="container-editorial">
        <div className="mb-12">
          <p className="section-number mb-3">Experience</p>
          <h2
            className="font-serif"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
          >
            Work & Practice
          </h2>
        </div>

        <div className="space-y-0">
          {EXPERIENCE.map((item, i) => (
            <div
              key={i}
              className="exp-item grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10"
              style={{ borderBottom: "1px solid var(--border-subtle)", opacity: 0 }}
            >
              {/* Left: period + meta */}
              <div className="md:col-span-3">
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                >
                  {item.period}
                </p>
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                >
                  {item.location}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                  style={{
                    color: "var(--accent-sage)",
                    border: "1px solid var(--accent-sage)",
                    fontFamily: "var(--font-mono)",
                    opacity: 0.7,
                  }}
                >
                  {item.type}
                </span>
              </div>

              {/* Right: role + highlights */}
              <div className="md:col-span-9">
                <h3
                  className="font-serif text-xl mb-1"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)", fontSize: "1.25rem" }}
                >
                  {item.role}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--accent-sage)", fontFamily: "var(--font-mono)" }}
                >
                  {item.company}
                </p>
                <ul className="space-y-2">
                  {item.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-sage)", flexShrink: 0, marginTop: "0.3rem" }}>◦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
