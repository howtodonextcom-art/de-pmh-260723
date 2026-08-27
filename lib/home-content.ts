import type { Project as FullProject } from "@library/types/project";

import { DEFAULT_SITE_BRAND } from "@/lib/cms/empty-project";
import type { SiteContent, SiteContentUpdate } from "@/lib/types";

export type UpdateEntry = SiteContentUpdate;

export interface SiteSettings {
  brandStatementVi: string;
  maxLastVerifiedAt: string;
}

export function buildUpdates(content?: SiteContent | null): UpdateEntry[] {
  return content?.updates ?? [];
}

export function buildSiteSettings(
  projects: FullProject[],
  content?: SiteContent | null,
): SiteSettings {
  const maxLastVerifiedAt = projects.map((p) => p.lastVerifiedAt).filter(Boolean).sort().at(-1) ?? "";
  return {
    brandStatementVi: content?.brandStatementVi || DEFAULT_SITE_BRAND,
    maxLastVerifiedAt,
  };
}

/** Real WGS84 coordinates used when a city has catalog projects. */
export const REGION_LNG_LAT: Record<string, { lng: number; lat: number }> = {
  "Bắc Ninh": { lng: 106.076, lat: 21.186 },
  "TP.HCM": { lng: 106.721, lat: 10.729 },
};

export function citySlug(city: string): string {
  return city
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
