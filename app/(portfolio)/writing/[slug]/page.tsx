import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { lexicalToHtml } from "@/lib/serialize-richtext";

const posts: Record<string, {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: string;
}> = {
  "building-ai-agents-from-scratch": {
    title: "Building AI Agents From Scratch",
    date: "2025-03-01",
    readingTime: "7 min",
    tags: ["AI", "Python", "Engineering"],
    content: `
Everyone is wrapping GPT-4 in a for-loop and calling it an agent. Here's what real autonomous tool-use looks like — the architecture, the failure modes, and the lessons from building Arora AI.

**What an agent actually is**

An agent is a system that takes a goal, breaks it into steps, executes those steps using tools, and adapts based on results. The loop is: observe → plan → act → observe again. That's it. But the details in each stage are where complexity lives.

**The architecture of Arora AI**

Arora uses a three-layer approach: a planning layer that decomposes goals into subtasks, a tool-use layer that executes individual actions (file reads, web searches, shell commands), and a memory layer that persists context across sessions.

The planning layer is the hardest part. LLMs are good at generating plausible-sounding plans. They're bad at generating executable ones. The key insight was adding a validation step — before executing a plan, we check each step for feasibility and surface ambiguities back to the user.

**Failure modes nobody talks about**

The most common failure isn't hallucination. It's over-confidence. The agent proceeds with a wrong assumption for three steps before something breaks. The fix is explicit uncertainty tracking — when confidence on a step drops below a threshold, pause and ask.

**What I'd do differently**

Start with memory. Everything else can be retrofitted. A stateless agent that forgets context between sessions is frustrating in a way that's hard to fix later once users have expectations set.
    `,
  },
  "sap-meets-modern-web": {
    title: "SAP Meets the Modern Web",
    date: "2025-01-15",
    readingTime: "6 min",
    tags: ["SAP", "Enterprise", ".NET"],
    content: `
SAP has a reputation problem. It's powerful, battle-tested, and genuinely excellent at what it does — but the developer experience is decades behind. Here's what bridging it with a Next.js frontend actually looks like.

**The gap is real**

SAP's UI technologies — BSP, WebDynpro, Fiori — were built in different eras with different constraints. They work. They're not enjoyable. More importantly, they make it genuinely hard to build the kind of fluid, data-dense interfaces that modern enterprise users now expect after years of using consumer software.

**The bridge pattern**

The approach that worked was treating SAP as a pure data source via OData/REST APIs and building everything visual in Next.js. SAP handles the heavy lifting it's designed for — transactional integrity, authorization, workflow — and the frontend handles everything users actually see and touch.

**The hard parts**

Authentication is the first wall. SAP's auth model (SSO, certificates, SAML) doesn't map cleanly onto JWT-based web auth. We ended up building a thin .NET middleware layer that translates between them.

Data shapes are the second. SAP data comes back in formats shaped by ABAP conventions from the 1990s. CamelCase keys, nested structures, date formats that require parsing. A transformation layer is non-negotiable.

**What it looks like at the end**

When it works, it's genuinely impressive. Full SAP transactional power, live data, but a UI that feels like a modern product. The users don't know or care what's running underneath — which is exactly right.
    `,
  },
  "zero-to-39-repos": {
    title: "Zero to 39 Repos — What I Learned",
    date: "2024-11-20",
    readingTime: "5 min",
    tags: ["Process", "Learning"],
    content: `
In less than a year I went from no public GitHub presence to 39 repositories across Python, TypeScript, JavaScript, and C#. What I'd tell myself at repo #1.

**Ship ugly things**

The first few repos are embarrassing in retrospect. That's correct. The goal of repo #1 through #10 is to build the habit of finishing and shipping, not to build impressive software. Impressive comes later. Finishing first.

**Breadth before depth**

I deliberately spread across languages and domains early. Python agents, TypeScript frameworks, .NET APIs, HTML experiments. This felt scattered but it was actually the right call. Patterns transfer. A good abstraction in Python teaches you what to look for in C#. Cross-pollination is real.

**Documentation is a first-class deliverable**

The repos that get attention — even small amounts — are the ones with clear READMEs. Not long. Clear. What it is, why it exists, how to run it. Three minutes of writing per repo dramatically changes how useful it is to anyone including future-you.

**What changes around repo #20**

Something shifts around the midpoint. You stop asking "what should I build" and start noticing gaps — things you wish existed, tools you keep rebuilding from scratch, problems you've solved twice that deserve a proper solution. The project ideas get better as you accumulate more surface area.

**The compounding effect**

Each repo is practice. Each README is practice. Each architecture decision compounds into intuition. By repo #39 the gap between idea and implementation is smaller than it's ever been.
    `,
  },
  "hindi-nlp-is-hard": {
    title: "Hindi NLP Is Hard, and That's the Point",
    date: "2024-09-10",
    readingTime: "8 min",
    tags: ["AI", "NLP", "Python"],
    content: `
Building a voice assistant for Hindi and Hinglish speakers exposed every assumption baked into English-first AI tooling. A technical deep dive into the Bharat Biz Agent language pipeline.

**The Hinglish problem**

Hinglish isn't Hindi with English words swapped in. It's a fluid code-switching language where speakers move between registers mid-sentence based on context, relationship, and topic. "Mujhe ek meeting schedule karni hai for tomorrow" is natural speech, not broken language. Most NLP pipelines treat it as broken.

**What breaks first**

Language detection breaks first. Standard classifiers trained on clean monolingual text assign low confidence to Hinglish and often misclassify it as noise. We ended up building a custom classifier trained specifically on mixed-register Indian business speech.

Tokenization breaks second. Hindi is written in Devanagari; Hinglish in Devanagari, Roman, or both in the same sentence. Tokenizers that work well for one script need adaptation for the other.

**The transliteration layer**

One breakthrough was adding an explicit transliteration step before LLM inference. Romanized Hindi ("aap kaise hain") gets converted to Devanagari before being passed to the model. This dramatically improved response quality.

**What the pipeline looks like**

Audio → speech-to-text (custom fine-tuned model for Indian accents) → language detection → transliteration if needed → intent classification → LLM inference in detected language → TTS in matching register.

Each step is a place where English-first assumptions cause failures. Each step required Indian-specific training data or adaptation.

**Why it's worth it**

The model of "AI tools are for English speakers" is wrong and it's going to be proven wrong over the next decade at scale. Building for Hinglish now means building for 600 million people who currently get second-class AI experiences.
    `,
  },
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

type PostData = {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: string;
  richContent?: string;
};

async function getPost(slug: string): Promise<PostData | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "writing",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (!docs.length) return null;
    const doc = docs[0] as any;
    return {
      title: doc.title,
      date: doc.publishedAt ? doc.publishedAt.split("T")[0] : "",
      readingTime: doc.readingTime ?? "",
      tags: (doc.tags ?? []).map((t: any) => t.tag).filter(Boolean),
      content: "",
      richContent: lexicalToHtml(doc.content),
    };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const hardcoded = Object.keys(posts).map((slug) => ({ slug }));
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({ collection: "writing", limit: 200 });
    const fromCms = (docs as any[]).map((d) => ({ slug: d.slug }));
    return [...hardcoded, ...fromCms.filter((d) => !posts[d.slug])];
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
  const fromCms = await getPost(slug);
  const post = fromCms ?? posts[slug];
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
  const fromCms = await getPost(slug);
  const post: PostData | undefined = fromCms ?? (posts[slug] as any);
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
            style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
          >
            {post.richContent ? (
              <div dangerouslySetInnerHTML={{ __html: post.richContent }} />
            ) : (
              post.content.trim().split("\n\n").map((para, i) => {
                if (/^\*\*[^*]+\*\*$/.test(para.trim())) {
                  return (
                    <h2
                      key={i}
                      className="font-serif mt-10 mb-4"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)", fontSize: "1.4rem" }}
                    >
                      {para.trim().slice(2, -2)}
                    </h2>
                  );
                }
                return (
                  <p key={i} className="mb-5" style={{ color: "var(--text-secondary)" }}>
                    {para.split(/(\*\*[^*]+\*\*)/).map((chunk, j) =>
                      chunk.startsWith("**") && chunk.endsWith("**") ? (
                        <strong key={j} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                          {chunk.slice(2, -2)}
                        </strong>
                      ) : chunk
                    )}
                  </p>
                );
              })
            )}
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
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhijitsingh.dev"}/writing/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              X / Twitter →
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhijitsingh.dev"}/writing/${slug}`)}`}
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
