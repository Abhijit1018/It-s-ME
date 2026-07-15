import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { lexicalToHtml } from "@/lib/serialize-richtext";
import { PROJECTS as projects } from "@/lib/projects";

type ProjectData = {
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
  richProblem?: string;
  richSolution?: string;
};

async function getProject(slug: string): Promise<ProjectData | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (!docs.length) return null;
    const doc = docs[0] as any;

    // find adjacent project for "next project" nav
    const { docs: allDocs } = await payload.find({
      collection: "projects",
      where: { published: { equals: true } },
      sort: "order",
      limit: 100,
    });
    const idx = allDocs.findIndex((d: any) => d.slug === slug);
    const next = allDocs[(idx + 1) % allDocs.length] as any;

    return {
      title: doc.title,
      year: doc.year ?? "",
      category: doc.category ?? "",
      liveUrl: doc.liveUrl,
      githubUrl: doc.githubRepo,
      accent: doc.color ?? "#7B9E87",
      overview: doc.summary ?? "",
      problem: "",
      solution: "",
      richProblem: lexicalToHtml(doc.problem),
      richSolution: lexicalToHtml(doc.solution),
      techStack: (doc.techStack ?? []).map((t: any) => t.name).filter(Boolean),
      nextSlug: next?.slug ?? slug,
      nextTitle: next?.title ?? doc.title,
    };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const hardcoded = Object.keys(projects).map((slug) => ({ slug }));
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({ collection: "projects", limit: 200 });
    const fromCms = (docs as any[]).map((d) => ({ slug: d.slug }));
    return [...hardcoded, ...fromCms.filter((d) => !projects[d.slug])];
  } catch {
    return hardcoded;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fromCms = await getProject(slug);
  const project = fromCms ?? projects[slug];
  if (!project) return {};
  return {
    title: project.title,
    description: project.overview || (fromCms as any)?.overview,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fromCms = await getProject(slug);
  const project: ProjectData | undefined = fromCms ?? (projects[slug] as any);
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
              {(project as ProjectData).richProblem ? (
                <div
                  className="prose-editorial leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: (project as ProjectData).richProblem! }}
                />
              ) : (
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {project.problem}
                </p>
              )}
            </section>

            <div className="rule-horizontal" />

            <section>
              <p className="section-number mb-4">The Approach</p>
              {(project as ProjectData).richSolution ? (
                <div
                  className="prose-editorial leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: (project as ProjectData).richSolution! }}
                />
              ) : (
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {project.solution}
                </p>
              )}
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
