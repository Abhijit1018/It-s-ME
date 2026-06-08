import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Uses",
  description: "The gear, software, and tools I actually use every day.",
};

const FALLBACK_SECTIONS = [
  { title: "Development", items: [{ name: "VS Code", note: "With Vim mode. I refuse to explain this." }, { name: "Eclipse ADT", note: "For SAP ABAP and CDS views — still the best for BTP work." }, { name: "SAP Business Application Studio", note: "Cloud IDE for Fiori + CAP development on BTP." }, { name: "TablePlus", note: "Database GUI for PostgreSQL and MySQL. Worth every penny." }, { name: "Warp", note: "Terminal with AI autocomplete. Actually useful." }] },
  { title: "Design", items: [{ name: "Figma", note: "Variables and dev mode finally made it worth staying." }, { name: "Framer", note: "For prototypes that need to feel real." }, { name: "Excalidraw", note: "Architecture diagrams, system design sketches. No fluff." }] },
  { title: "Productivity", items: [{ name: "Obsidian", note: "Second brain. Local-first, Markdown, no lock-in." }, { name: "Notion", note: "Project tracking and shared docs." }, { name: "Postman", note: "API testing for REST and OData services." }, { name: "GitHub CLI", note: "Living in the terminal. Faster than the web UI." }] },
  { title: "Fonts & Typography", items: [{ name: "Playfair Display", note: "My current serif default for editorial work." }, { name: "DM Sans", note: "Cleanest variable sans for interfaces." }, { name: "JetBrains Mono", note: "Best monospaced for long coding sessions." }] },
];

type UseItem = { name: string; note: string };
type UseSection = { title: string; items: UseItem[] };

export default async function UsesPage() {
  let sections: UseSection[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const data = await (payload as any).findGlobal({ slug: "uses" });
    if (data) {
      const build = (arr: any[], label: string): UseSection | null => {
        const items = (arr ?? []).filter((r: any) => r.name);
        return items.length > 0 ? { title: label, items } : null;
      };
      const built = [
        build(data.software, "Development"),
        build(data.devEnv, "Design"),
        build(data.productivity, "Productivity"),
        build(data.fonts, "Fonts & Typography"),
      ].filter(Boolean) as UseSection[];
      if (built.length > 0) sections = built;
    }
  } catch {
    // use fallback
  }

  const displaySections = sections.length > 0 ? sections : FALLBACK_SECTIONS;

  return (
    <>
      <section className="pt-40 pb-32" aria-label="Uses">
        <div className="container-editorial">
          <div className="mb-20">
            <p className="section-number mb-3">Uses</p>
            <h1 className="font-serif mb-4" style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
              Gear & Tools
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "55ch" }}>
              The things I actually use, honestly described. No affiliate links.
            </p>
          </div>

          <div className="space-y-16">
            {displaySections.map(({ title, items }) => (
              <div key={title}>
                <p className="section-number mb-6">{title}</p>
                <ul className="space-y-0">
                  {items.map(({ name, note }) => (
                    <li
                      key={name}
                      className="py-4 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8"
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <span className="font-medium text-sm w-48 flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                        {name}
                      </span>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
