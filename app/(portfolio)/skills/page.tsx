import type { Metadata } from "next";
import { SkillsPage } from "@/components/sections/SkillsPage";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Skills",
  description: "An orbital view of the technologies, tools, and disciplines I work with.",
};

export default async function Skills() {
  let skillData: Record<string, { name: string; proficiency: number }[]> = {};
  let currentlyLearning: string[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "skills",
      where: { visible: { equals: true } },
      sort: "order",
      limit: 200,
    });
    for (const doc of docs as any[]) {
      const category = doc.category ?? "Other";
      if (!skillData[category]) skillData[category] = [];
      skillData[category].push({ name: doc.name, proficiency: doc.proficiency ?? 3 });
      if (doc.currentlyLearning) currentlyLearning.push(doc.name);
    }
  } catch {
    // falls back to hardcoded data in SkillsPage
  }

  return (
    <>
      <SkillsPage skillData={skillData} currentlyLearning={currentlyLearning} />
      <Footer />
    </>
  );
}
