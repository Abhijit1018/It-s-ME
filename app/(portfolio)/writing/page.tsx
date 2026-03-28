import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on design, engineering, and the craft of building digital things.",
};

const FALLBACK_POSTS = [
  { slug: "building-ai-agents-from-scratch", title: "Building AI Agents From Scratch", date: "2025-03-01", readingTime: "7 min", excerpt: "Everyone is wrapping GPT-4 in a for-loop and calling it an agent. Here's what real autonomous tool-use looks like — the architecture, the failure modes, and the lessons from building Arora AI.", tags: ["AI", "Python", "Engineering"] },
  { slug: "sap-meets-modern-web", title: "SAP Meets the Modern Web", date: "2025-01-15", readingTime: "6 min", excerpt: "SAP has a reputation problem. It's powerful, battle-tested, and genuinely excellent at what it does — but the developer experience is decades behind. Here's what bridging it with a Next.js frontend actually looks like.", tags: ["SAP", "Enterprise", ".NET"] },
  { slug: "zero-to-39-repos", title: "Zero to 39 Repos — What I Learned", date: "2024-11-20", readingTime: "5 min", excerpt: "In less than a year I went from no public GitHub presence to 39 repositories across Python, TypeScript, JavaScript, and C#. What I'd tell myself at repo #1.", tags: ["Process", "Learning"] },
  { slug: "hindi-nlp-is-hard", title: "Hindi NLP Is Hard, and That's the Point", date: "2024-09-10", readingTime: "8 min", excerpt: "Building a voice assistant for Hindi and Hinglish speakers exposed every assumption baked into English-first AI tooling. A technical deep dive into the Bharat Biz Agent language pipeline.", tags: ["AI", "NLP", "Python"] },
];

type PostItem = { slug: string; title: string; date: string; readingTime: string; excerpt: string; tags: string[] };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function WritingPage() {
  let posts: PostItem[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "writing",
      where: { published: { equals: true } },
      sort: "-publishedAt",
      limit: 50,
    });
    if (docs.length > 0) {
      posts = docs.map((doc: any) => ({
        slug: doc.slug,
        title: doc.title,
        date: doc.publishedAt ? doc.publishedAt.split("T")[0] : "",
        readingTime: doc.readingTime ?? "",
        excerpt: doc.excerpt ?? "",
        tags: (doc.tags ?? []).map((t: any) => t.tag).filter(Boolean),
      }));
    }
  } catch {
    // falls back to hardcoded
  }

  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  return (
    <>
      <section className="pt-40 pb-32" aria-label="Writing">
        <div className="container-editorial">
          <div className="mb-20">
            <p className="section-number mb-3">Writing</p>
            <h1 className="font-serif" style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
              Essays & Notes
            </h1>
          </div>

          <div className="space-y-0">
            {displayPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group block py-10"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
                aria-label={`Read: ${post.title}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                  <div className="md:col-span-2">
                    <p className="text-xs pt-1" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                      {post.date ? formatDate(post.date) : ""}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h2
                      className="font-serif text-2xl md:text-3xl mb-3 group-hover:text-[var(--accent-sage)] transition-colors duration-300"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-4 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)" }}
                        >
                          {tag}
                        </span>
                      ))}
                      {post.readingTime && (
                        <span className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                          {post.readingTime} read
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1 flex items-start justify-end pt-1">
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                      style={{ color: "var(--accent-sage)" }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
