import type { Project as FullProject } from "@library/types/project";
import { citySlug as vendorCitySlug, groupProjectsByRegion } from "@library/lib/data/region-slug";

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

/**
 * Canonical city→slug — re-exported here for existing importers of this
 * module. The one real implementation lives in `vendor/library` (shared
 * with the `/du-an` "Khu vực" filter/dropdown so Home and the Explorer
 * always agree on every slug); this file must not keep its own copy.
 */
export const citySlug = vendorCitySlug;

/**
 * One Home-map marker per project with real, finite coordinates. A project
 * missing `coordinates.lat`/`coordinates.lng` gets no pin here — no
 * city-cluster centroid, no `{lng:106,lat:16}`-style guess, no invented
 * numbers. That is a real, pre-existing data gap for some projects, not
 * something this function papers over.
 */
export interface HomeProjectPin {
  slug: string;
  displayNameVi: string;
  lat: number;
  lng: number;
}

export function buildProjectPins(projects: FullProject[]): HomeProjectPin[] {
  return projects.flatMap((p) => {
    const { lat, lng } = p.coordinates;
    if (typeof lat !== "number" || !Number.isFinite(lat)) return [];
    if (typeof lng !== "number" || !Number.isFinite(lng)) return [];
    return [{ slug: p.slug, displayNameVi: p.displayNameVi, lat, lng }];
  });
}

/**
 * A region card for the Home map's right-hand list — grouped by the same
 * canonical slug as the `/du-an` filter (`groupProjectsByRegion`), so a
 * region resolving to exactly one project can link straight to it and a
 * region with several links to a `khu-vuc` filter guaranteed to return
 * more than zero results (same grouping key on both sides).
 */
export interface HomeRegionGroup {
  slug: string;
  region: string;
  count: number;
  /** Set only when `count === 1` — that project's slug, for a direct link. */
  soloSlug: string | null;
  saBanUrl: string | null;
}

export function buildRegionGroups(projects: FullProject[]): HomeRegionGroup[] {
  return groupProjectsByRegion(projects).map((g) => {
    const saBanUrl = projects.find((p) => g.projectSlugs.includes(p.slug) && p.saBanUrl)?.saBanUrl ?? null;
    return {
      slug: g.slug,
      region: g.label,
      count: g.projectSlugs.length,
      soloSlug: g.projectSlugs.length === 1 ? g.projectSlugs[0] : null,
      saBanUrl,
    };
  });
}
