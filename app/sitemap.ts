import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhijit-singh.in";

const staticRoutes = [
  "",
  "/about",
  "/work",
  "/skills",
  "/lab",
  "/writing",
  "/github",
  "/now",
  "/uses",
  "/contact",
];

const hardcodedProjectSlugs = [
  "recall-sap",
  "mindispo",
  "redhope",
  "sap-fiori-sales",
  "arora-ai",
  "bharat-biz-agent",
  "shieldroute",
  "living-blossom",
  "nexus-os",
  "legacy-lens",
  "code-legacy-frontend",
  "e-flower",
];

const hardcodedWritingSlugs = [
  "building-ai-agents-from-scratch",
  "sap-meets-modern-web",
  "zero-to-39-repos",
  "hindi-nlp-is-hard",
  "the-case-for-slower-animations",
  "design-tokens-in-practice",
];

async function getSlugs(
  collection: "projects" | "writing",
  hardcoded: string[]
): Promise<string[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({ collection, limit: 200 });
    const fromCms = (docs as any[]).map((d) => d.slug).filter(Boolean);
    return [...new Set([...hardcoded, ...fromCms])];
  } catch {
    return hardcoded;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, writingSlugs] = await Promise.all([
    getSlugs("projects", hardcodedProjectSlugs),
    getSlugs("writing", hardcodedWritingSlugs),
  ]);

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  for (const slug of projectSlugs) {
    entries.push({
      url: `${SITE_URL}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const slug of writingSlugs) {
    entries.push({
      url: `${SITE_URL}/writing/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
