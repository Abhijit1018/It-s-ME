"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SkillsOrbit = dynamic(
  () => import("@/components/3d/SkillsOrbit").then((m) => m.SkillsOrbit),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const skillData: Record<string, { name: string; proficiency: number }[]> = {
  Frontend: [
    { name: "TypeScript", proficiency: 5 },
    { name: "React / Next.js", proficiency: 4 },
    { name: "JavaScript (ES2024)", proficiency: 5 },
    { name: "HTML / CSS / Tailwind", proficiency: 4 },
    { name: "Three.js / WebGL", proficiency: 3 },
  ],
  Backend: [
    { name: "Python", proficiency: 5 },
    { name: ".NET / C#", proficiency: 4 },
    { name: "Node.js", proficiency: 4 },
    { name: "REST API Design", proficiency: 4 },
    { name: "PostgreSQL / SQL", proficiency: 3 },
  ],
  AI: [
    { name: "LLM Orchestration", proficiency: 4 },
    { name: "Agent Architecture", proficiency: 4 },
    { name: "Tool Use / Function Calling", proficiency: 4 },
    { name: "NLP / Text Processing", proficiency: 3 },
    { name: "Voice / Speech Interfaces", proficiency: 3 },
  ],
  Enterprise: [
    { name: "SAP Backend", proficiency: 4 },
    { name: "SAP ABAP", proficiency: 3 },
    { name: "ERP Integration", proficiency: 3 },
    { name: "Business Process", proficiency: 4 },
  ],
  DevOps: [
    { name: "Git / GitHub", proficiency: 5 },
    { name: "GitHub Actions", proficiency: 3 },
    { name: "Vercel / Netlify", proficiency: 4 },
    { name: "Docker (basics)", proficiency: 2 },
  ],
};

const currentlyLearning = ["Three.js / 3D Web", "Advanced .NET", "GSAP Animations", "Game Dev (Unity)"];

function ProficiencyBar({ level }: { level: number }) {
  return (
    <div
      className="flex gap-1"
      aria-label={`Proficiency: ${level} out of 5`}
      role="meter"
      aria-valuenow={level}
      aria-valuemin={1}
      aria-valuemax={5}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-4 h-1 rounded-full"
          style={{
            background: i <= level ? "var(--accent-sage)" : "var(--border-medium)",
          }}
        />
      ))}
    </div>
  );
}

export function SkillsPage() {
  const [selectedCluster, setSelectedCluster] = useState<string>("");

  const displayCategory = selectedCluster && skillData[selectedCluster]
    ? selectedCluster
    : null;

  return (
    <section className="pt-32 pb-24" aria-label="Skills">
      <div className="container-editorial">
        {/* Header */}
        <div className="mb-12">
          <p className="section-number mb-3">Skills</p>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
          >
            Skill Universe
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Click a cluster to explore. Or scroll down for the full list.
          </p>
        </div>

        {/* 3D canvas */}
        <div
          className="relative rounded-xl overflow-hidden mb-12"
          style={{
            height: "500px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-primary)",
          }}
        >
          <SkillsOrbit onSelect={setSelectedCluster} />

          {/* Selected cluster info overlay */}
          {displayCategory && (
            <div
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-72 glass-panel rounded-xl p-5"
            >
              <p
                className="text-xs mb-3"
                style={{ color: "var(--accent-sage)", fontFamily: "var(--font-mono)" }}
              >
                {displayCategory}
              </p>
              <ul className="space-y-3">
                {skillData[displayCategory].map(({ name, proficiency }) => (
                  <li key={name} className="flex items-center justify-between gap-4">
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {name}
                    </span>
                    <ProficiencyBar level={proficiency} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Full skill list */}
        <div
          className="rule-horizontal mb-12"
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {Object.entries(skillData).map(([category, skills]) => (
            <div key={category}>
              <p
                className="section-number mb-4"
                style={{ color: "var(--accent-sage)" }}
              >
                {category}
              </p>
              <ul className="space-y-3">
                {skills.map(({ name, proficiency }) => (
                  <li key={name} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {name}
                    </span>
                    <ProficiencyBar level={proficiency} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Currently learning */}
        <div
          className="mt-16 pt-12"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p className="section-number mb-4">Currently Learning</p>
          <div className="flex flex-wrap gap-3">
            {currentlyLearning.map((item) => (
              <span
                key={item}
                className="text-sm px-4 py-2 rounded-full"
                style={{
                  border: "1px dashed var(--accent-sage)",
                  color: "var(--accent-sage)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
