import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { notFound } from "next/navigation";

const posts: Record<string, {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: string;
}> = {
  "the-case-for-slower-animations": {
    title: "The Case for Slower Animations",
    date: "2024-11-15",
    readingTime: "5 min",
    tags: ["Design", "Motion"],
    content: `
We've collectively overcorrected. The web is twitchy, anxious, full of micro-interactions that fire before you've finished thinking.

Open any modern SaaS product and count how many things move in the first five seconds. Notifications slide in. Tooltips bounce. Modals spring open. Elements fade in as you scroll past them, because the designer wanted you to know something was *there*.

The animations say: look at me. Look at how alive I am.

But living things don't move like this. Trees sway slowly. People turn their heads with measured intent. The best natural motion is purposeful and contained — it communicates direction, not energy.

**The problem is attention**

Every animation makes a claim on your attention. A good animation says: *this matters, look here*. A gratuitous animation says: *look at me being animated*.

When everything animates, nothing does. Attention becomes fractured. The interface becomes noise.

**What I've been doing instead**

For the past year, I've been cutting animation durations by 30%, removing entrance animations from elements below the fold, and reserving motion for transitions that carry semantic meaning: opening, closing, moving between states.

The result is interfaces that feel *calm*. Not dead — calm. Users report feeling less fatigued. Fewer people ask "wait, what just happened?"

**The right pace**

Slower doesn't mean long. A 400ms transition can feel luxurious or sluggish depending on its easing curve. The secret is an ease-out curve with a long tail — fast at the start, imperceptibly slow at the end. It feels fast and resolved simultaneously.

The best animations are the ones you don't consciously register. They do their work and get out of the way.
    `,
  },
  "design-tokens-in-practice": {
    title: "Design Tokens in Practice",
    date: "2024-09-03",
    readingTime: "8 min",
    tags: ["Design Systems", "Engineering"],
    content: `
A design token is, at its simplest, a named value. \`color.primary\` is \`#7B9E87\`. \`spacing.lg\` is \`2rem\`. Nothing magical.

The magic — and the difficulty — is in making those names mean the same thing to designers, engineers, iOS developers, Android developers, and the marketing team updating a landing page in Webflow.

**The technical problems are easy**

Style Dictionary. Theo. Token Transformer. There are good tools. The pipeline from Figma variables to CSS custom properties to Tailwind tokens is solved.

We implemented this in about three days. It worked.

Then we showed it to the design team.

**The naming wars**

The first meeting was two hours long. We debated whether the token for a border on a card should be called \`color.border.card\` or \`color.surface.card.outline\` or \`color.stroke.container\`.

Nobody agreed. Everyone had a different mental model of what a "surface" was. Designers thought in terms of components. Engineers thought in terms of properties. Neither spoke the other's language.

We ended up with a three-tier system: global tokens (raw values), semantic tokens (purpose-named), and component tokens (specific overrides). Classic. Lots of people told us this was the answer. It helped, but it didn't solve the fundamental problem.

**The organisational problem**

The real issue was ownership. Who decides what \`color.interactive\` means? Who reviews a PR that renames a token used in 400 components?

We eventually formed a token council — three designers, two engineers, one product manager — who met every two weeks. Changes required a proposal document. Deprecations had a three-release grace period.

This sounds bureaucratic. It was, slightly. But it also meant the system stayed coherent for two years instead of two months.

**What I'd do differently**

Start with the governance model, not the pipeline. The tools are easy to change. The culture is not.
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return { title: post.title };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />

      <article className="pt-40 pb-24">
        <div
          className="mx-auto px-6"
          style={{ maxWidth: "680px" }}
        >
          {/* Back */}
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 text-sm mb-12 group"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            All writing
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  color: "var(--accent-sage)",
                  border: "1px solid var(--accent-sage)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tag}
              </span>
            ))}
            <span
              className="text-xs"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              {formatDate(post.date)} · {post.readingTime} read
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-serif mb-12"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </h1>

          <div className="rule-horizontal mb-12" />

          {/* Content */}
          <div
            className="prose-editorial"
            style={{
              color: "var(--text-secondary)",
              lineHeight: "1.8",
            }}
          >
            {post.content.trim().split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h2
                    key={i}
                    className="font-serif mt-10 mb-4"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "var(--text-primary)",
                      fontSize: "1.4rem",
                    }}
                  >
                    {para.slice(2, -2)}
                  </h2>
                );
              }
              return (
                <p key={i} className="mb-5" style={{ color: "var(--text-secondary)" }}>
                  {para}
                </p>
              );
            })}
          </div>

          {/* Share */}
          <div
            className="mt-16 pt-8 flex items-center gap-6"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Share this:
            </p>
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              X / Twitter →
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://portfolio.dev/writing/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              LinkedIn →
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
