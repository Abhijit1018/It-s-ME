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
  { slug: "the-case-for-slower-animations", title: "The Case for Slower Animations", date: "2024-11-15", readingTime: "5 min", excerpt: "We've collectively overcorrected. The web is twitchy, anxious, full of micro-interactions that fire before you've finished thinking. Here's why I've been slowing everything down.", tags: ["Design", "Motion"] },
  { slug: "design-tokens-in-practice", title: "Design Tokens in Practice", date: "2024-09-03", readingTime: "8 min", excerpt: "A year of building a design token system taught me that the technical problems are the easy part. The organisational problems are where systems go to die.", tags: ["Design Systems", "Engineering"] },
  { slug: "on-building-in-public", title: "On Building in Public", date: "2024-06-20", readingTime: "4 min", excerpt: "I spent six months building in public and mostly hated it. Then something changed. A reflection on visibility, vulnerability, and why I'm doing it differently now.", tags: ["Meta", "Process"] },
  { slug: "the-last-15-percent", title: "The Last 15 Percent", date: "2024-02-08", readingTime: "6 min", excerpt: "Every project has a last 15%. The part where it's mostly done but nothing is right. This is about that part — and why it's actually the most important.", tags: ["Process", "Craft"] },
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
