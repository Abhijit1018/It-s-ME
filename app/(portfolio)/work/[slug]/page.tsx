import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";

const projects: Record<string, {
  title: string;
  year: string;
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  accent: string;
  overview: string;
  problem: string;
  solution: string;
  techStack: string[];
  nextSlug: string;
  nextTitle: string;
}> = {
  "arora-ai": {
    title: "Arora AI",
    year: "2025",
    category: "AI / Python",
    githubUrl: "https://github.com/Abhijit1018/Arora-Ai",
    accent: "#7B9E87",
    overview: "Arora AI is an autonomous agent built in Python — a master orchestrator that can use tools, maintain memory, and execute multi-step tasks on your machine.",
    problem: "Most AI assistants are stateless chat interfaces that forget context and can't take real actions. They're useful for generating text but fall short when you need something that actually works on your behalf.",
    solution: "Arora AI uses an agent loop architecture with tool use, persistent memory, and a planning layer that breaks complex goals into executable steps — closer to an autonomous assistant than a chatbot.",
    techStack: ["Python", "LLM APIs", "Tool Use / Function Calling", "Memory Management", "Async Python", "CLI"],
    nextSlug: "bharat-biz-agent",
    nextTitle: "Bharat Biz Agent",
  },
  "bharat-biz-agent": {
    title: "Bharat Biz Agent",
    year: "2025",
    category: "AI / Voice",
    githubUrl: "https://github.com/Abhijit1018/Bharat-Biz-Agent",
    accent: "#D4B896",
    overview: "A voice and chat based business assistant designed for Indian SMEs — supporting Hindi, English, and Hinglish in a single unified interface.",
    problem: "Language is a barrier for millions of small business owners in India. Most AI tools are English-only and miss the natural code-switching (Hinglish) that's ubiquitous in everyday business conversations.",
    solution: "A multi-lingual agent pipeline that handles voice input, language detection, LLM inference in the appropriate language, and voice output — all optimized for business use cases like inventory, billing queries, and customer management.",
    techStack: ["Python", "Speech-to-Text", "LLM Orchestration", "Hindi NLP", "Voice Interface", "FastAPI"],
    nextSlug: "shieldroute",
    nextTitle: "ShieldRoute",
  },
  "shieldroute": {
    title: "ShieldRoute",
    year: "2025",
    category: "TypeScript",
    githubUrl: "https://github.com/Abhijit1018/ShieldRoute",
    accent: "#C4847A",
    overview: "A TypeScript-first secure routing framework that brings declarative route protection, role-based access control, and middleware composition to modern web applications.",
    problem: "Authentication and authorization logic gets scattered across codebases — sometimes in middleware, sometimes in components, sometimes nowhere. The result is security gaps that are hard to audit.",
    solution: "ShieldRoute centralizes access control into a declarative route configuration. Routes express their requirements; the framework enforces them. Middleware composes cleanly and the security model is auditable at a glance.",
    techStack: ["TypeScript", "Middleware Composition", "RBAC", "JWT", "Node.js"],
    nextSlug: "living-blossom",
    nextTitle: "Living Blossom",
  },
  "living-blossom": {
    title: "Living Blossom",
    year: "2025",
    category: "Web",
    githubUrl: "https://github.com/Abhijit1018/Living-Blossom",
    accent: "#A8C4B0",
    overview: "A TypeScript web application with a focus on elegant UI design, fluid interactions, and a clean component architecture.",
    problem: "Building web interfaces that feel alive — not just functional — requires deliberate investment in motion, hierarchy, and interaction design at every layer.",
    solution: "Living Blossom explores these questions through a carefully designed component system with intentional animations, semantic color tokens, and interaction states that feel considered.",
    techStack: ["TypeScript", "React", "CSS Animations", "Component Architecture", "Design Tokens"],
    nextSlug: "nexus-os",
    nextTitle: "Nexus OS",
  },
  "nexus-os": {
    title: "Nexus OS",
    year: "2025",
    category: "TypeScript",
    githubUrl: "https://github.com/Abhijit1018/Nexus-OS",
    accent: "#9BB8A4",
    overview: "An operating-system-inspired browser experience — windowed UI, simulated file system, and process management, all running in TypeScript.",
    problem: "OS-level UI concepts (windows, taskbars, file explorers) are rarely explored in browser contexts, yet they represent some of the most complex interaction patterns in software.",
    solution: "Nexus OS implements a windowed desktop environment entirely in the browser, with draggable windows, a virtual file system, and a process model — pushing TypeScript and DOM APIs to their limits.",
    techStack: ["TypeScript", "DOM APIs", "Virtual File System", "Window Management", "State Machine"],
    nextSlug: "legacy-lens",
    nextTitle: "LegacyLens",
  },
  "legacy-lens": {
    title: "LegacyLens",
    year: "2025",
    category: "Python",
    githubUrl: "https://github.com/Abhijit1018/LegacyLens",
    accent: "#BFA090",
    overview: "A code legacy optimizer — analyzes Python codebases for technical debt, identifies problematic patterns, and generates prioritized refactoring recommendations.",
    problem: "Every codebase accumulates legacy code — deprecated patterns, dead code, over-coupled modules — but there's no systematic way to understand the scope of the problem or where to start.",
    solution: "LegacyLens uses static analysis, dependency graphs, and heuristics to score code health and produce an actionable, prioritized roadmap for refactoring legacy systems.",
    techStack: ["Python", "AST Analysis", "Static Analysis", "Dependency Graphs", "CLI"],
    nextSlug: "arora-ai",
    nextTitle: "Arora AI",
  },
  "code-legacy-frontend": {
    title: "Code Legacy Frontend",
    year: "2025",
    category: "Web",
    githubUrl: "https://github.com/Abhijit1018/Code-Legacy-frontend",
    accent: "#B0A8C4",
    overview: "The frontend dashboard for the Code Legacy platform — visualizing codebase health metrics, technical debt scores, and refactoring recommendations.",
    problem: "Static analysis data is only useful if it's presented clearly. Raw JSON from a Python analyzer doesn't help a team make decisions about where to invest refactoring effort.",
    solution: "An interactive dashboard that transforms analyzer output into visual health scores, dependency graphs, and prioritized action lists — making complex codebase data immediately understandable.",
    techStack: ["Python", "JavaScript", "Data Visualization", "Dashboard UI", "REST API"],
    nextSlug: "e-flower",
    nextTitle: "E-Flower",
  },
  "e-flower": {
    title: "E-Flower",
    year: "2025",
    category: "Web",
    githubUrl: "https://github.com/Abhijit1018/E-flower",
    accent: "#C4A8B0",
    overview: "A full-stack e-commerce application for a floral business — product catalog, cart management, order processing, and a backend API.",
    problem: "Local florist businesses need affordable, custom online storefronts that match their brand without the overhead of Shopify or WooCommerce.",
    solution: "A lightweight full-stack e-commerce solution with a JavaScript frontend, backend API, and a clean product catalog UX designed for visual products like flowers.",
    techStack: ["JavaScript", "Node.js", "REST API", "E-commerce UX", "Full-Stack"],
    nextSlug: "arora-ai",
    nextTitle: "Arora AI",
  },
};

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return {};
  return {
    title: project.title,
    description: project.overview,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  return (
    <>
      {/* Hero */}
      <div
        className="min-h-[60vh] flex items-end pt-32 pb-16"
        style={{ background: `${project.accent}15`, borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="container-editorial">
          <div
            className="w-12 h-1 mb-8 rounded-full"
            style={{ background: project.accent }}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs"
              style={{ color: project.accent, fontFamily: "var(--font-mono)" }}
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
          <h1
            className="font-serif mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)", maxWidth: "20ch" }}
          >
            {project.title}
          </h1>
          <div className="flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 rounded-full transition-colors"
                style={{ background: project.accent, color: "#F7F4EF" }}
              >
                Live site →
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 rounded-full"
                style={{ border: `1px solid ${project.accent}`, color: project.accent }}
              >
                GitHub →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Case study */}
      <article className="py-24">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto space-y-16">
            <section>
              <p className="section-number mb-4">Overview</p>
              <p
                className="font-serif text-xl md:text-2xl leading-relaxed"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
              >
                {project.overview}
              </p>
            </section>

            <div className="rule-horizontal" />

            <section>
              <p className="section-number mb-4">The Problem</p>
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.problem}
              </p>
            </section>

            <div className="rule-horizontal" />

            <section>
              <p className="section-number mb-4">The Approach</p>
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.solution}
              </p>
            </section>

            <div className="rule-horizontal" />

            <section>
              <p className="section-number mb-6">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{
                      border: "1px solid var(--border-medium)",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* Next project */}
      <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <Link
          href={`/work/${project.nextSlug}`}
          className="group flex items-center justify-between container-editorial py-12 transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <div>
            <p className="section-number mb-1">Next Project</p>
            <p
              className="font-serif text-2xl group-hover:text-[var(--accent-sage)] transition-colors"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              {project.nextTitle}
            </p>
          </div>
          <span
            className="text-3xl transition-transform group-hover:translate-x-2"
            style={{ color: "var(--accent-sage)" }}
          >
            →
          </span>
        </Link>
      </div>

      <Footer />
    </>
  );
}
