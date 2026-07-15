import type { Metadata } from "next";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { PROJECTS, PROJECT_SLUGS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "A curated selection of projects across web, mobile, and open source.",
};

type GalleryProject = { slug: string; title: string; year: string; category: string; description: string; accent: string };

const hardcodedProjects: GalleryProject[] = PROJECT_SLUGS.map((slug) => ({
  slug,
  title: PROJECTS[slug].title,
  year: PROJECTS[slug].year,
  category: PROJECTS[slug].category,
  description: PROJECTS[slug].blurb,
  accent: PROJECTS[slug].accent,
}));

export default async function WorkPage() {
  let projects: GalleryProject[] = hardcodedProjects;
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "projects",
      where: { published: { equals: true } },
      sort: "order",
      limit: 100,
    });
    const fromCms: GalleryProject[] = (docs as any[]).map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      year: doc.year ?? "",
      category: doc.category ?? "Other",
      description: doc.summary ?? "",
      accent: doc.color ?? "#7B9E87",
    }));
    const cmsSlugs = new Set(fromCms.map((p) => p.slug));
    projects = [...fromCms, ...hardcodedProjects.filter((p) => !cmsSlugs.has(p.slug))];
  } catch {
    // falls back to hardcoded data
  }

  return (
    <>
      <WorkGallery projects={projects} />
      <Footer />
    </>
  );
}
