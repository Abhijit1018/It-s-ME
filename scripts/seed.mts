/**
 * Seed script — populates Payload collections with hardcoded frontend data.
 *
 * Usage:
 *   npm run seed
 *   (or: npx tsx scripts/seed.mts)
 *
 * Safe to run multiple times — skips items that already exist (matched by slug/title).
 * Requires DATABASE_URL to be set in .env.local or environment.
 */

import { pathToFileURL } from "node:url";
import path from "path";
import dotenv from "dotenv";

// tsx does not load .env.local automatically — load it before Payload initialises
dotenv.config({ path: ".env.local" });

const cwd = process.cwd();

// Load env the same way Payload does (reuses the patched loadEnv workaround)
process.env.DISABLE_PAYLOAD_HMR = "true";

const { getPayload } = await import("payload");
const { default: configPromise } = await import(
  pathToFileURL(path.join(cwd, "payload.config.ts")).toString()
);

const payload = await getPayload({ config: configPromise });

// ──────────────────────────────────────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────────────────────────────────────
async function upsertCollection(
  collection: string,
  items: Array<Record<string, unknown>>,
  uniqueField: string
) {
  let created = 0;
  let skipped = 0;
  for (const item of items) {
    const existing = await (payload as any).find({
      collection,
      where: { [uniqueField]: { equals: item[uniqueField] } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      skipped++;
    } else {
      await (payload as any).create({ collection, data: item });
      created++;
    }
  }
  console.log(`  ${collection}: ${created} created, ${skipped} skipped`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Projects (8 from WorkGallery, featured flags for top 3)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding projects...");
await upsertCollection(
  "projects",
  [
    { slug: "arora-ai", title: "Arora AI", year: "2025", category: "AI", color: "#7B9E87", summary: "The master agent for your machine — an autonomous AI assistant built in Python with tool use, memory, and multi-step reasoning.", featured: true, published: true, order: 1 },
    { slug: "bharat-biz-agent", title: "Bharat Biz Agent", year: "2025", category: "AI", color: "#D4B896", summary: "Voice + chat based business assistant for Hindi, English, and Hinglish speakers. Multi-lingual LLM orchestration for Indian SMEs.", featured: true, published: true, order: 2 },
    { slug: "shieldroute", title: "ShieldRoute", year: "2025", category: "TypeScript", color: "#C4847A", summary: "A TypeScript-based secure routing framework. Declarative route protection with middleware composition.", featured: true, published: true, order: 3 },
    { slug: "living-blossom", title: "Living Blossom", year: "2025", category: "Web", color: "#A8C4B0", summary: "A TypeScript web application — elegant UI with a focus on interaction design and component architecture.", featured: false, published: true, order: 4 },
    { slug: "nexus-os", title: "Nexus OS", year: "2025", category: "TypeScript", color: "#9BB8A4", summary: "An operating-system-inspired TypeScript project exploring windowed UI, file system abstractions, and process management in the browser.", featured: false, published: true, order: 5 },
    { slug: "legacy-lens", title: "LegacyLens", year: "2025", category: "Python", color: "#BFA090", summary: "The code legacy optimizer — analyzes Python codebases, identifies technical debt, and suggests refactoring paths using static analysis.", featured: false, published: true, order: 6 },
    { slug: "code-legacy-frontend", title: "Code Legacy Frontend", year: "2025", category: "Web", color: "#B0A8C4", summary: "Frontend dashboard for the Code Legacy platform — visualizing codebase health metrics and refactoring recommendations.", featured: false, published: true, order: 7 },
    { slug: "e-flower", title: "E-Flower", year: "2025", category: "Web", color: "#C4A8B0", summary: "Full-stack e-commerce application for a floral business, with product catalog, cart, and order management.", featured: false, published: true, order: 8 },
  ],
  "slug"
);

// ──────────────────────────────────────────────────────────────────────────────
// Milestones (Timeline entries)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding milestones...");
await upsertCollection(
  "milestones",
  [
    { year: "2025", title: "AI Agent Development", company: "Independent", type: "Open Source", description: "Building autonomous AI agents — Arora AI and Bharat Biz Agent — exploring voice interfaces, multi-lingual support, and LLM orchestration.", order: 1, visible: true },
    { year: "2025", title: "SAP Backend Certified", company: "SAP", type: "Certification", description: "Achieved SAP backend certification, bridging enterprise ERP systems with modern web and Python development.", order: 2, visible: true },
    { year: "2025", title: "Full-Stack TypeScript Projects", company: "Independent", type: "Projects", description: "Shipped multiple TypeScript projects — ShieldRoute, Living Blossom, Nexus OS — expanding into modern frontend architecture with Next.js and Three.js.", order: 3, visible: true },
    { year: "2025", title: ".NET & Enterprise Development", company: "Independent", type: "Learning", description: "Deep dived into the .NET ecosystem, building enterprise-grade backend systems alongside Python and JavaScript projects.", order: 4, visible: true },
    { year: "2025", title: "Started the Journey", company: "GitHub", type: "Milestone", description: "Joined GitHub and immediately shipped 39+ repositories across Python, TypeScript, JavaScript, and HTML — zero to full-stack in months.", order: 5, visible: true },
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
// Skills (25 skills across 5 categories)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeeding skills...");
const allSkills = [
  // Frontend
  { name: "TypeScript", category: "Frontend", proficiency: 5, visible: true, currentlyLearning: false, order: 1 },
  { name: "React / Next.js", category: "Frontend", proficiency: 4, visible: true, currentlyLearning: false, order: 2 },
  { name: "JavaScript (ES2024)", category: "Frontend", proficiency: 5, visible: true, currentlyLearning: false, order: 3 },
  { name: "HTML / CSS / Tailwind", category: "Frontend", proficiency: 4, visible: true, currentlyLearning: false, order: 4 },
  { name: "Three.js / WebGL", category: "Frontend", proficiency: 3, visible: true, currentlyLearning: true, order: 5 },
  // Backend
  { name: "Python", category: "Backend", proficiency: 5, visible: true, currentlyLearning: false, order: 6 },
  { name: ".NET / C#", category: "Backend", proficiency: 4, visible: true, currentlyLearning: true, order: 7 },
  { name: "Node.js", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 8 },
  { name: "REST API Design", category: "Backend", proficiency: 4, visible: true, currentlyLearning: false, order: 9 },
  { name: "PostgreSQL / SQL", category: "Backend", proficiency: 3, visible: true, currentlyLearning: false, order: 10 },
  // AI
  { name: "LLM Orchestration", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 11 },
  { name: "Agent Architecture", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 12 },
  { name: "Tool Use / Function Calling", category: "AI", proficiency: 4, visible: true, currentlyLearning: false, order: 13 },
  { name: "NLP / Text Processing", category: "AI", proficiency: 3, visible: true, currentlyLearning: false, order: 14 },
  { name: "Voice / Speech Interfaces", category: "AI", proficiency: 3, visible: true, currentlyLearning: false, order: 15 },
  // Enterprise
  { name: "SAP Backend", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 16 },
  { name: "SAP ABAP", category: "Enterprise", proficiency: 3, visible: true, currentlyLearning: false, order: 17 },
  { name: "ERP Integration", category: "Enterprise", proficiency: 3, visible: true, currentlyLearning: false, order: 18 },
  { name: "Business Process", category: "Enterprise", proficiency: 4, visible: true, currentlyLearning: false, order: 19 },
  // DevOps
  { name: "Git / GitHub", category: "DevOps", proficiency: 5, visible: true, currentlyLearning: false, order: 20 },
  { name: "GitHub Actions", category: "DevOps", proficiency: 3, visible: true, currentlyLearning: false, order: 21 },
  { name: "Vercel / Netlify", category: "DevOps", proficiency: 4, visible: true, currentlyLearning: false, order: 22 },
  { name: "Docker (basics)", category: "DevOps", proficiency: 2, visible: true, currentlyLearning: false, order: 23 },
  // GSAP as currently learning
  { name: "GSAP Animations", category: "Frontend", proficiency: 3, visible: true, currentlyLearning: true, order: 24 },
  { name: "Game Dev (Unity)", category: "Other", proficiency: 1, visible: true, currentlyLearning: true, order: 25 },
];
await upsertCollection("skills", allSkills, "name");

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
      { value: "39+", label: "GitHub repositories", description: "Public repos across Python, TypeScript, JavaScript, and more" },
      { value: "6", label: "Tech domains", description: "Frontend, Backend, AI, Enterprise, DevOps, Design" },
      { value: "5+", label: "Languages & frameworks", description: "Python, TypeScript, .NET/C#, JavaScript, SQL" },
      { value: "1", label: "SAP certification", description: "SAP backend certified — bridging ERP and modern dev" },
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
      { item: "Arora AI — expanding its tool use capabilities and adding a persistent memory layer." },
      { item: "Bharat Biz Agent — improving Hindi/Hinglish NLP accuracy and adding inventory features." },
    ],
    learning: [
      { item: "Advanced .NET — going deeper into ASP.NET Core, EF Core, and CQRS patterns." },
      { item: "Three.js and 3D web — building interactive 3D scenes for the web." },
      { item: "Game development — exploring Unity with C# for indie game projects." },
    ],
    reading: [
      { item: "Clean Architecture — Robert C. Martin" },
      { item: "The Pragmatic Programmer — David Thomas & Andrew Hunt" },
      { item: "Designing Data-Intensive Applications — Martin Kleppmann" },
    ],
    location: "Vadodara, Gujarat, India",
    lastUpdated: "2026-03-27",
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
      { name: "Sony WH-1000XM5", note: "ANC for deep work. The hinge creak is real, though." },
    ],
    software: [
      { name: "VS Code", note: "With Vim mode. I refuse to explain this." },
      { name: "Warp", note: "For the terminal. The AI autocomplete is actually useful." },
      { name: "TablePlus", note: "Database GUI. Worth every penny." },
      { name: "Proxyman", note: "HTTP proxy. Invaluable for debugging mobile API calls." },
      { name: "Raycast", note: "Spotlight replacement. The snippets alone justify it." },
    ],
    devEnv: [
      { name: "Figma", note: "Variables and dev mode finally made it worth staying." },
      { name: "Framer", note: "For prototypes that need to feel real." },
      { name: "Rive", note: "For production-ready interactive animations." },
      { name: "Typeface 3", note: "Font manager. Keeps the chaos organised." },
    ],
    fonts: [
      { name: "Playfair Display", note: "My current serif default for editorial work." },
      { name: "DM Sans", note: "Cleanest variable sans for interfaces." },
      { name: "JetBrains Mono", note: "Best monospaced for long coding sessions." },
      { name: "Söhne", note: "When I need something with more personality." },
    ],
    productivity: [
      { name: "Obsidian", note: "Second brain. Local-first, Markdown, no lock-in." },
      { name: "Linear", note: "Issue tracking that doesn't feel like punishment." },
      { name: "Cleanshot X", note: "Screenshots and screen recording. Best in class." },
      { name: "Bear", note: "Quick notes. Syncs fast, stays out of the way." },
    ],
  },
});
console.log("  uses: updated");

// ──────────────────────────────────────────────────────────────────────────────
console.log("\nSeed complete!\n");
process.exit(0);
