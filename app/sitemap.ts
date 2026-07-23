import type { MetadataRoute } from "next";

import { getFullCatalog } from "@/lib/library-bridge";

/** Public demo is live and unauthenticated (see docs/WHAT_YOU_BUY.md) — index it. `/lab` is excluded (internal, see robots.ts). */
const BASE_URL = "https://de-division-pmh.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getFullCatalog();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/du-an`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/so-sanh`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/phap-ly`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/du-an/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
