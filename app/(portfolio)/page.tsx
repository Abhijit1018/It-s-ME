import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { StatsSection } from "@/components/sections/StatsSection";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";

const tickerItems = [
  "Python",
  "TypeScript",
  ".NET / C#",
  "SAP Backend",
  "AI Agents",
  "Next.js",
  "Three.js",
  "Game Dev",
  "Full-Stack",
  "Open Source",
];

export default async function HomePage() {
  // Try fetching projects from CMS backend
  let fetchedProjects: any[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "projects",
      where: { featured: { equals: true } },
      sort: "order",
      limit: 5,
    });
    // map the fields to the schema expected by the frontend
    fetchedProjects = docs.map((doc: any) => ({
      slug: doc.slug,
      title: doc.title,
      year: doc.year,
      category: doc.category,
      description: doc.summary,
      color: doc.color,
    }));
  } catch (error) {
    console.warn("Failed to fetch Payload backend, falling back to mock UI");
  }

  return (
    <>
      <HeroSection />
      <MarqueeTicker items={tickerItems} speed={50} />
      <FeaturedWork projects={fetchedProjects} />
      <StatsSection />
      <AboutTeaser />
      <Footer />
    </>
  );
}
