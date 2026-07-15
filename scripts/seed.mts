/**
 * Seed script — populates Payload collections from the site's real data sources
 * (lib/projects.ts, resume, GitHub) so the CMS admin reflects what's live.
 *
 * Usage:
 *   npm run seed
 *   (or: npx tsx scripts/seed.mts)
 *
 * True upsert: updates existing docs (matched by slug/title/role) with the
 * latest data instead of skipping them, so re-running after a content change
 * actually syncs it. Requires DATABASE_URL to be set in .env or .env.local.
 */

import { pathToFileURL } from "node:url";
import path from "path";
import dotenv from "dotenv";

// tsx does not load .env.local automatically — load it before Payload initialises
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const cwd = process.cwd();

process.env.DISABLE_PAYLOAD_HMR = "true";

const { getPayload } = await import("payload");
const { default: configPromise } = await import(
  pathToFileURL(path.join(cwd, "payload.config.ts")).toString()
);
const { PROJECTS, PROJECT_SLUGS } = await import("../lib/projects.ts");

const payload = await getPayload({ config: configPromise });

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function toLexical(paragraphs: string | string[]) {
  const texts = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
  return {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: texts.map((text) => ({
        type: "paragraph",
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
        children: [{ type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
      })),
    },
  };
}

async function upsertCollection(
  collection: string,
  items: Array<Record<string, unknown>>,
  uniqueField: string
) {
  let created = 0;
  let updated = 0;
  for (const item of items) {
    const existing = await (payload as any).find({
      collection,
      where: { [uniqueField]: { equals: item[uniqueField] } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      await (payload as any).update({ collection, id: existing.docs[0].id, data: item });
      updated++;
    } else {
      await (payload as any).create({ collection, data: item });
      created++;
    }
  }
  console.log(`  ${collection}: ${created} created, ${updated} updated`);
}

// Deletes docs whose uniqueField value isn't in the current canonical list.
// Only safe for collections this script fully owns (skills, milestones) —
// never run on collections that may hold freeform admin-authored entries.
async function pruneCollection(
  collection: string,
  currentValues: string[],
  uniqueField: string
) {
  const { docs } = await (payload as any).find({ collection, limit: 500 });
  const keep = new Set(currentValues);
  let removed = 0;
  for (const doc of docs as any[]) {
    if (!keep.has(doc[uniqueField])) {
      await (payload as any).delete({ collection, id: doc.id });
      removed++;
    }
  }
  if (removed > 0) console.log(`  ${collection}: ${removed} stale entries removed`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Projects — derived from lib/projects.ts, the same source the UI fallback uses
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding projects...");
const FEATURED_SLUGS = new Set(["arora-ai", "bharat-biz-agent", "shieldroute"]);
await upsertCollection(
  "projects",
  PROJECT_SLUGS.map((slug, i) => {
    const p = PROJECTS[slug];
    return {
      slug,
      title: p.title,
      year: p.year,
      category: p.category,
      color: p.accent,
      summary: p.blurb,
      liveUrl: p.liveUrl,
      githubRepo: p.githubUrl,
      techStack: p.techStack.map((name) => ({ name })),
      problem: toLexical(p.problem),
      solution: toLexical(p.solution),
      featured: FEATURED_SLUGS.has(slug),
      published: true,
      order: i + 1,
    };
  }),
  "slug"
);

// ──────────────────────────────────────────────────────────────────────────────
// Experience — from resume (SAP_Python_Stack_Abhijit.pdf)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding experience...");
await upsertCollection(
  "experience",
  [
    {
      role: "SAP Full Stack Developer Intern",
      company: "VegaH LLC",
      startDate: "2025-11-01",
      description: toLexical([
        "Developed enterprise applications on SAP BTP using ABAP Cloud and RAP for SAP S/4HANA integration.",
        "Designed CDS Views, OData V2/V4 services, and SAP Fiori applications following clean architecture practices.",
        "Implemented business logic using RAP behavior definitions and service bindings.",
        "Integrated AI-powered automation workflows with enterprise SAP applications, including Recall — an AI-driven system to identify overdue customers and automate communication via Twilio and email pipelines.",
        "Worked with SAP HANA Cloud, Cloud Foundry, SAP Business Application Studio, Git, and Agile development practices.",
      ]),
      visible: true,
    },
    {
      role: "Python Django Intern",
      company: "Infosys Springboard",
      startDate: "2025-09-01",
      endDate: "2025-11-01",
      description: toLexical([
        "Developed full-stack web applications using Python, Django, HTML, CSS, JavaScript, and MySQL.",
        "Built REST APIs and scalable backend services for data-driven applications.",
        "Designed responsive user interfaces and collaborated in Agile project delivery.",
      ]),
      visible: true,
    },
    {
      role: "Independent Developer — AI & Open Source",
      company: "Self-directed",
      startDate: "2024-01-01",
      description: toLexical([
        "Built Arora AI — an autonomous Python agent with tool use, persistent memory, and multi-step reasoning.",
        "Developed Bharat Biz Agent — a voice + chat assistant handling Hindi, Hinglish, and English for Indian SMEs.",
        "Shipped 39+ public GitHub repositories across Python, TypeScript, JavaScript, ABAP, and C#.",
      ]),
      visible: true,
    },
  ],
  "role"
);

// ──────────────────────────────────────────────────────────────────────────────
// Milestones (Timeline entries + real certifications)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding milestones...");
await upsertCollection(
  "milestones",
  [
    { year: "2025", title: "SAP Certified Associate — Back-End Developer (ABAP Cloud)", company: "SAP", type: "Certification", description: "Certified in ABAP Cloud back-end development on SAP BTP.", order: 1, visible: true },
    { year: "2025", title: "SAP Certified Associate — SAP S/4HANA Cloud Public Edition", company: "SAP", type: "Certification", description: "Certified on SAP S/4HANA Cloud Public Edition implementation and configuration.", order: 2, visible: true },
    { year: "2025", title: "Oracle OCI 2025 Data Science Professional", company: "Oracle", type: "Certification", description: "Certified in data science on Oracle Cloud Infrastructure.", order: 3, visible: true },
    { year: "2025", title: "AWS Certified Cloud Practitioner", company: "AWS", type: "Certification", description: "Foundational certification in AWS cloud services and architecture.", order: 4, visible: true },
    { year: "2025", title: "SAP Full Stack Developer Intern — VegaH", company: "VegaH LLC", type: "Milestone", description: "Started building enterprise SAP BTP applications with ABAP Cloud, RAP, and CDS Views.", order: 5, visible: true },
    { year: "2025", title: "AI Agent Development", company: "Independent", type: "Open Source", description: "Building autonomous AI agents — Arora AI and Bharat Biz Agent — exploring voice interfaces, multi-lingual support, and LLM orchestration.", order: 6, visible: true },
    { year: "2025", title: "Full-Stack TypeScript Projects", company: "Independent", type: "Projects", description: "Shipped multiple TypeScript projects — ShieldRoute, Living Blossom, Nexus OS — expanding into modern frontend architecture with Next.js and Three.js.", order: 7, visible: true },
    { year: "2024", title: "Started the Journey", company: "GitHub", type: "Milestone", description: "Joined GitHub and shipped dozens of repositories across Python, TypeScript, JavaScript, and ABAP.", order: 8, visible: true },
  ],
  "title"
);
await pruneCollection(
  "milestones",
  [
    "SAP Certified Associate — Back-End Developer (ABAP Cloud)",
    "SAP Certified Associate — SAP S/4HANA Cloud Public Edition",
    "Oracle OCI 2025 Data Science Professional",
    "AWS Certified Cloud Practitioner",
    "SAP Full Stack Developer Intern — VegaH",
    "AI Agent Development",
    "Full-Stack TypeScript Projects",
    "Started the Journey",
  ],
  "title"
);

// ──────────────────────────────────────────────────────────────────────────────
// Writing (blog posts)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding writing...");
await upsertCollection(
  "writing",
  [
    { slug: "the-case-for-slower-animations", title: "The Case for Slower Animations", publishedAt: "2024-11-15", excerpt: "We've collectively overcorrected. The web is twitchy, anxious, full of micro-interactions that fire before you've finished thinking. Here's why I've been slowing everything down.", tags: [{ tag: "Design" }, { tag: "Motion" }], readingTime: "5 min", published: true, source: "local" },
    { slug: "design-tokens-in-practice", title: "Design Tokens in Practice", publishedAt: "2024-09-03", excerpt: "A year of building a design token system taught me that the technical problems are the easy part. The organisational problems are where systems go to die.", tags: [{ tag: "Design Systems" }, { tag: "Engineering" }], readingTime: "8 min", published: true, source: "local" },
    { slug: "on-building-in-public", title: "On Building in Public", publishedAt: "2024-06-20", excerpt: "I spent six months building in public and mostly hated it. Then something changed. A reflection on visibility, vulnerability, and why I'm doing it differently now.", tags: [{ tag: "Meta" }, { tag: "Process" }], readingTime: "4 min", published: true, source: "local" },
    { slug: "the-last-15-percent", title: "The Last 15 Percent", publishedAt: "2024-02-08", excerpt: "Every project has a last 15%. The part where it's mostly done but nothing is right. This is about that part — and why it's actually the most important.", tags: [{ tag: "Process" }, { tag: "Craft" }], readingTime: "6 min", published: true, source: "local" },
  ],
  "slug"
);

// ──────────────────────────────────────────────────────────────────────────────
// Skills — from resume's Technical Skills section + portfolio-proven extras
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding skills...");
const allSkills = [
  // Frontend
  { name: "TypeScript", category: "Frontend", proficiency: 5, visible: true, currentlyLearning: false, order: 1 },
  { name: "React / Next.js", category: "Frontend", proficiency: 4, visible: true, currentlyLearning: false, order: 2 },
  { name: "JavaScript (ES2024)", category: "Frontend", proficiency: 5, visible: true, currentlyLearning: false, order: 3 },
  { name: "HTML5 / CSS3 / Tailwind CSS", category: "Frontend", proficiency: 4, visible: true, currentlyLearning: false, order: 4 },
  { name: "SAPUI5", category: "Frontend", proficiency: 4, visible: true, currentlyLearning: false, order: 5 },
  { name: "Three.js / WebGL", category: "Frontend", proficiency: 3, visible: true, currentlyLearning: true, order: 6 },
  { name: "GSAP Animations", category: "Frontend", proficiency: 3, visible: true, currentlyLearning: true, order: 7 },
  // Backend
  { name: "Python", category: "Backend", proficiency: 5, visible: true, currentlyLearning: false, order: 8 },
  { name: "Django", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 9 },
  { name: "Flask / FastAPI", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 10 },
  { name: "REST API Design", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 11 },
  { name: "Node.js", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 12 },
  { name: "MySQL / PostgreSQL", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 13 },
  { name: ".NET / C#", category: "Backend", proficiency: 2, visible: true, currentlyLearning: true, order: 14 },
  // AI
  { name: "Generative AI", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 15 },
  { name: "Prompt Engineering", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 16 },
  { name: "AI Agents / Agent Architecture", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 17 },
  { name: "LLM Orchestration", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 18 },
  { name: "NLP / Text Processing", category: "AI", proficiency: 3, visible: true, currentlyLearning: false, order: 19 },
  { name: "Workflow Automation", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 20 },
  { name: "Voice / Speech Interfaces", category: "AI", proficiency: 3, visible: true, currentlyLearning: false, order: 21 },
  // Enterprise / SAP
  { name: "SAP BTP", category: "Enterprise", proficiency: 5, visible: true, currentlyLearning: false, order: 22 },
  { name: "ABAP Cloud", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 23 },
  { name: "RAP (RESTful ABAP Programming)", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 24 },
  { name: "CDS Views", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 25 },
  { name: "OData V2/V4", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 26 },
  { name: "SAP HANA Cloud", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 27 },
  { name: "SAP Fiori", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 28 },
  { name: "SAP Business Application Studio", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 29 },
  { name: "Cloud Foundry", category: "Enterprise", proficiency: 3, visible: true, currentlyLearning: false, order: 30 },
  { name: "SAP CAP", category: "Enterprise", proficiency: 3, visible: true, currentlyLearning: false, order: 31 },
  // DevOps / Cloud
  { name: "Git / GitHub", category: "DevOps", proficiency: 5, visible: true, currentlyLearning: false, order: 32 },
  { name: "AWS", category: "DevOps", proficiency: 3, visible: true, currentlyLearning: false, order: 33 },
  { name: "Oracle OCI", category: "DevOps", proficiency: 3, visible: true, currentlyLearning: false, order: 34 },
  { name: "Postman", category: "DevOps", proficiency: 4, visible: true, currentlyLearning: false, order: 35 },
  { name: "Vercel / Netlify", category: "DevOps", proficiency: 4, visible: true, currentlyLearning: false, order: 36 },
  { name: "Docker (basics)", category: "DevOps", proficiency: 2, visible: true, currentlyLearning: false, order: 37 },
  // Other
  { name: "SQL", category: "Other", proficiency: 4, visible: true, currentlyLearning: false, order: 38 },
  { name: "C", category: "Other", proficiency: 3, visible: true, currentlyLearning: false, order: 39 },
  { name: "Game Dev (Unity)", category: "Other", proficiency: 1, visible: true, currentlyLearning: true, order: 40 },
];
await upsertCollection("skills", allSkills, "name");
await pruneCollection("skills", allSkills.map((s) => s.name), "name");

// ──────────────────────────────────────────────────────────────────────────────
// Beliefs global (Manifesto)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding beliefs global...");
await (payload as any).updateGlobal({
  slug: "beliefs",
  data: {
    items: [
      { number: "01", statement: "Build across the full spectrum. The most interesting problems live at the edges of what people think is possible." },
      { number: "02", statement: "Language is infrastructure. If your tool only speaks English, half the world can't use it." },
      { number: "03", statement: "AI should augment, not replace. The best agent is the one that makes you ten times more capable." },
      { number: "04", statement: "Ship it and learn. A working prototype teaches more than a perfect design document." },
      { number: "05", statement: "Enterprise software doesn't have to be ugly. SAP and beauty are not mutually exclusive." },
      { number: "06", statement: "Write code for the next developer, not just the next release." },
    ],
  },
});
console.log("  beliefs: updated");

// ──────────────────────────────────────────────────────────────────────────────
// Stats global
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding stats global...");
await (payload as any).updateGlobal({
  slug: "stats",
  data: {
    items: [
      { value: "39+", label: "GitHub repositories", description: "Public repos across Python, TypeScript, JavaScript, ABAP, and more" },
      { value: "6", label: "Tech domains", description: "Frontend, Backend, AI, Enterprise (SAP), DevOps, Design" },
      { value: "5+", label: "Languages & frameworks", description: "Python, ABAP, TypeScript, JavaScript, SQL, C" },
      { value: "4", label: "Professional certifications", description: "2x SAP Certified Associate, Oracle OCI Data Science, AWS Cloud Practitioner" },
    ],
  },
});
console.log("  stats: updated");

// ──────────────────────────────────────────────────────────────────────────────
// Now global
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding now global...");
await (payload as any).updateGlobal({
  slug: "now",
  data: {
    building: [
      { item: "This portfolio — the one you're looking at right now." },
      { item: "Numen — an autonomous Enterprise Intelligence Platform for SAP, multi-agent AI across integration, finance, procurement, and governance." },
      { item: "WhiteWire — an AI-native canvas for product teams, live at whitewire.vercel.app." },
    ],
    learning: [
      { item: "Advanced .NET — going deeper into ASP.NET Core and enterprise backend patterns." },
      { item: "Three.js and 3D web — building interactive 3D scenes for the web." },
      { item: "Game development — exploring Unity with C# for indie game projects." },
    ],
    reading: [
      { item: "Clean Architecture — Robert C. Martin" },
      { item: "The Pragmatic Programmer — David Thomas & Andrew Hunt" },
      { item: "Designing Data-Intensive Applications — Martin Kleppmann" },
    ],
    location: "Vadodara, Gujarat, India",
    lastUpdated: new Date().toISOString().slice(0, 10),
    availableForWork: true,
  },
});
console.log("  now: updated");

// ──────────────────────────────────────────────────────────────────────────────
// Uses global
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding uses global...");
await (payload as any).updateGlobal({
  slug: "uses",
  data: {
    hardware: [
      { name: "MacBook Pro 14\"", note: "M3 Pro. The battery alone changed my life." },
      { name: "LG 27UK850-W", note: "27\" 4K. Good colour accuracy, USB-C passthrough." },
      { name: "Keychron Q1", note: "Gateron G Pro Red switches. Quiet enough for calls." },
      { name: "Logitech MX Master 3S", note: "The scroll wheel is genuinely a competitive advantage." },
    ],
    software: [
      { name: "SAP Business Application Studio", note: "Cloud IDE for ABAP Cloud and RAP development." },
      { name: "VS Code", note: "For everything outside the SAP stack — Python, TypeScript, Next.js." },
      { name: "Postman", note: "Testing OData and REST APIs before they touch a real integration." },
      { name: "TablePlus", note: "Database GUI for MySQL, PostgreSQL, and SAP HANA. Worth every penny." },
    ],
    devEnv: [
      { name: "SAP BTP Cockpit", note: "Where the CDS Views, RAP services, and Fiori apps actually run." },
      { name: "Cloud Foundry CLI", note: "Deploying and managing SAP BTP applications." },
      { name: "Figma", note: "For the UI passes before anything gets built." },
    ],
    fonts: [
      { name: "Playfair Display", note: "My current serif default for editorial work." },
      { name: "DM Sans", note: "Cleanest variable sans for interfaces." },
      { name: "JetBrains Mono", note: "Best monospaced for long coding sessions." },
    ],
    productivity: [
      { name: "Obsidian", note: "Second brain. Local-first, Markdown, no lock-in." },
      { name: "GitHub", note: "39+ repos and counting — where the actual work lives." },
      { name: "Linear", note: "Issue tracking that doesn't feel like punishment." },
    ],
  },
});
console.log("  uses: updated");

// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeed complete!\n");
process.exit(0);
