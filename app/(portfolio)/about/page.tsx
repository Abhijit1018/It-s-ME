import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { AboutHero } from "@/components/sections/AboutHero";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Timeline } from "@/components/sections/Timeline";
import { Manifesto } from "@/components/sections/Manifesto";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { lexicalToParagraphs } from "@/lib/serialize-richtext";

export const metadata: Metadata = {
  title: "About",
  description: "The story, philosophy, and process behind the work.",
};

function formatPeriod(startDate?: string, endDate?: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (!startDate) return "";
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : "Present"}`;
}

export default async function AboutPage() {
  let milestones: { year: string; title: string; company: string; type: string; description: string }[] = [];
  let experience: { role: string; company: string; period: string; location: string; type: string; highlights: string[] }[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const [milestoneRes, experienceRes] = await Promise.all([
      payload.find({
        collection: "milestones",
        where: { visible: { equals: true } },
        sort: "order",
        limit: 50,
      }),
      payload.find({
        collection: "experience",
        where: { visible: { equals: true } },
        sort: "-startDate",
        limit: 20,
      }),
    ]);
    if (milestoneRes.docs.length > 0) {
      milestones = milestoneRes.docs.map((doc: any) => ({
        year: doc.year ?? "",
        title: doc.title ?? "",
        company: doc.company ?? "",
        type: doc.type ?? "",
        description: doc.description ?? "",
      }));
    }
    if (experienceRes.docs.length > 0) {
      experience = experienceRes.docs.map((doc: any) => ({
        role: doc.role ?? "",
        company: doc.company ?? "",
        period: formatPeriod(doc.startDate, doc.endDate),
        location: doc.location ?? "Remote",
        type: doc.type ?? "Experience",
        highlights: lexicalToParagraphs(doc.description),
      }));
    }
  } catch {
    // falls back to hardcoded data in ExperienceSection/Timeline
  }

  return (
    <>
      <AboutHero />
      <ExperienceSection items={experience.length > 0 ? experience : undefined} />
      <Timeline milestones={milestones.length > 0 ? milestones : undefined} />
      <Manifesto />
      <Footer />
    </>
  );
}
