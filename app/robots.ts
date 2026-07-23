import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/lab",
    },
    sitemap: "https://de-division-pmh.vercel.app/sitemap.xml",
  };
}
