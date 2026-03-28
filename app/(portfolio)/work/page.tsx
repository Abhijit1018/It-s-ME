import type { Metadata } from "next";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { Footer } from "@/components/layout/Footer";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Work",
  description: "A curated selection of projects across web, mobile, and open source.",
};

export default async function WorkPage() {
  let projects: { slug: string; title: string; year: string; category: string; description: string; accent: string }[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "projects",
      where: { published: { equals: true } },
      sort: "order",
      limit: 100,
    });
    if (docs.length > 0) {
      projects = docs.map((doc: any) => ({
        slug: doc.slug,
        title: doc.title,
        year: doc.year ?? "",
        category: doc.category ?? "Other",
        description: doc.summary ?? "",
        accent: doc.color ?? "#7B9E87",
      }));
    }
  } catch {
    // falls back to hardcoded data in WorkGallery
  }

  return (
    <>
      <WorkGallery projects={projects.length > 0 ? projects : undefined} />
      <Footer />
    </>
  );
}
