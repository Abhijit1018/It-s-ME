import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, learning, and thinking about right now.",
};

const FALLBACK = {
  building: ["This portfolio — the one you're looking at right now.", "Arora AI — expanding its tool use capabilities and adding a persistent memory layer.", "Bharat Biz Agent — improving Hindi/Hinglish NLP accuracy and adding inventory features."],
  learning: ["Advanced .NET — going deeper into ASP.NET Core, EF Core, and CQRS patterns.", "Three.js and 3D web — building interactive 3D scenes for the web.", "Game development — exploring Unity with C# for indie game projects."],
  reading: ["Clean Architecture — Robert C. Martin", "The Pragmatic Programmer — David Thomas & Andrew Hunt", "Designing Data-Intensive Applications — Martin Kleppmann"],
  location: "Vadodara, Gujarat, India",
  lastUpdated: "27 March 2026",
};

export default async function NowPage() {
  let now = FALLBACK;
  try {
    const payload = await getPayload({ config: configPromise });
    const data = await (payload as any).findGlobal({ slug: "now" });
    if (data) {
      now = {
        building: (data.building ?? []).map((r: any) => r.item).filter(Boolean),
        learning: (data.learning ?? []).map((r: any) => r.item).filter(Boolean),
        reading: (data.reading ?? []).map((r: any) => r.item).filter(Boolean),
        location: data.location ?? FALLBACK.location,
        lastUpdated: data.lastUpdated
          ? new Date(data.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
          : FALLBACK.lastUpdated,
      };
    }
  } catch {
    // use fallback
  }

  return (
    <>
      <section className="pt-40 pb-32" aria-label="Now">
        <div className="container-editorial max-w-2xl">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <p className="section-number">Now</p>
              <span className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                Last updated: {now.lastUpdated}
              </span>
            </div>
            <h1 className="font-serif mb-4" style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
              What I&apos;m Up To
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Inspired by{" "}
              <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-sage)" }}>
                nownownow.com
              </a>
              . Current as of the date above.
            </p>
          </div>

          <div className="rule-horizontal mb-12" />

          {now.building.length > 0 && (
            <div className="mb-10">
              <p className="section-number mb-4">Currently Building</p>
              <ul className="space-y-3">
                {now.building.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: "var(--accent-sage)", marginTop: "0.3rem" }}>◦</span>
                    <p style={{ color: "var(--text-secondary)" }}>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {now.learning.length > 0 && (
            <div className="mb-10">
              <p className="section-number mb-4">Currently Learning</p>
              <ul className="space-y-3">
                {now.learning.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: "var(--accent-sage)", marginTop: "0.3rem" }}>◦</span>
                    <p style={{ color: "var(--text-secondary)" }}>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {now.reading.length > 0 && (
            <div className="mb-10">
              <p className="section-number mb-4">Currently Reading</p>
              <ul className="space-y-3">
                {now.reading.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: "var(--accent-sage)", marginTop: "0.3rem" }}>◦</span>
                    <p style={{ color: "var(--text-secondary)" }}>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rule-horizontal my-10" />

          <div className="flex items-center gap-3">
            <span style={{ color: "var(--text-tertiary)" }}>📍</span>
            <p style={{ color: "var(--text-secondary)" }}>{now.location}</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
