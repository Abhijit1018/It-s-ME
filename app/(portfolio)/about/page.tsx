import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { AboutHero } from "@/components/sections/AboutHero";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Timeline } from "@/components/sections/Timeline";
import { Manifesto } from "@/components/sections/Manifesto";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "About",
  description: "The story, philosophy, and process behind the work.",
};

export default async function AboutPage() {
  let milestones: { year: string; title: string; company: string; type: string; description: string }[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "milestones",
      where: { visible: { equals: true } },
      sort: "order",
      limit: 50,
    });
    if (docs.length > 0) {
      milestones = docs.map((doc: any) => ({
        year: doc.year ?? "",
        title: doc.title ?? "",
        company: doc.company ?? "",
        type: doc.type ?? "",
        description: doc.description ?? "",
      }));
    }
  } catch {
    // falls back to hardcoded data in Timeline
  }

  return (
    <>
      <AboutHero />
      <ExperienceSection />
      <Timeline milestones={milestones.length > 0 ? milestones : undefined} />
      <Manifesto />
      <Footer />
    </>
  );
}
