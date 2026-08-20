import type { HeaderProject } from "@/lib/types";

import { PROJECT_NAV_ZONES } from "@/lib/config/site-nav";

export { PROJECT_NAV_ZONES };

/** Geographic zone for the desktop “Dự án” mega-menu. */
export type ProjectNavZoneId = "bac" | "nam";

/** Sub-groups under Phía Nam only. */
export type ProjectNamGroupId = "site-a" | "outsite";

/**
 * Nav leaf — may map to a live catalog slug or be a coming-soon placeholder.
 * Labels follow the portfolio IA (plot codes / site names), not always displayNameVi.
 */
export type ProjectNavLeaf = {
  id: string;
  /** Primary label in the menu (VI). */
  label: string;
  /** Short location / meta line. */
  location: string;
  /**
   * When set, resolve against `HeaderProject[]` and link to `/du-an/{slug}`.
   * When omitted, render as non-navigable “coming soon”.
   */
  slug?: string;
};

export type ProjectNamGroup = {
  id: ProjectNamGroupId;
  label: string;
  projects: ProjectNavLeaf[];
};

export type ProjectNavZone =
  | {
      id: "bac";
      label: string;
      projects: ProjectNavLeaf[];
      groups?: undefined;
    }
  | {
      id: "nam";
      label: string;
      projects?: undefined;
      groups: ProjectNamGroup[];
    };

/**
 * Desktop nav IA — Phía Bắc | Phía Nam → (Site A | Outsite).
 * Raw data lives in `lib/config/site-nav.ts` (white-label swap point);
 * re-exported here so existing consumers keep importing from this module.
 */

export type ResolvedNavLeaf = ProjectNavLeaf & {
  project: HeaderProject | null;
  href: string | null;
};

export function resolveNavLeaves(
  leaves: ProjectNavLeaf[],
  projects: HeaderProject[]
): ResolvedNavLeaf[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return leaves.map((leaf) => {
    const project = leaf.slug ? bySlug.get(leaf.slug) ?? null : null;
    return {
      ...leaf,
      project,
      href: leaf.slug ? `/du-an/${leaf.slug}` : null,
    };
  });
}

export function getZoneProjects(
  zone: ProjectNavZone,
  namGroupId: ProjectNamGroupId
): ProjectNavLeaf[] {
  if (zone.id === "bac") return zone.projects;
  return zone.groups.find((g) => g.id === namGroupId)?.projects ?? [];
}

/** Max thumb rows in the desktop mega-menu — full browse belongs on `/du-an`. */
export const NAV_MENU_PREVIEW_LIMIT = 6;

export function parseNavZoneId(value: string | null | undefined): ProjectNavZoneId | null {
  return value === "bac" || value === "nam" ? value : null;
}

export function parseNamGroupId(value: string | null | undefined): ProjectNamGroupId | null {
  return value === "site-a" || value === "outsite" ? value : null;
}

/** Leaves for a catalog branch: Bắc, or Nam (+ optional group), or all Nam groups. */
export function getBranchLeaves(
  zoneId: ProjectNavZoneId,
  namGroupId?: ProjectNamGroupId | null
): ProjectNavLeaf[] {
  const zone = PROJECT_NAV_ZONES.find((z) => z.id === zoneId);
  if (!zone) return [];
  if (zone.id === "bac") return zone.projects;
  if (namGroupId) {
    return zone.groups.find((g) => g.id === namGroupId)?.projects ?? [];
  }
  return zone.groups.flatMap((g) => g.projects);
}

/** Live catalog slugs under a nav branch (placeholders omitted). */
export function getBranchSlugs(
  zoneId: ProjectNavZoneId,
  namGroupId?: ProjectNamGroupId | null
): string[] {
  return getBranchLeaves(zoneId, namGroupId)
    .map((leaf) => leaf.slug)
    .filter((slug): slug is string => Boolean(slug));
}

/**
 * Deep-link from mega-menu → `/du-an` with nav context.
 * Keeps map’s `khu-vuc` contract untouched (orthogonal query key).
 */
export function buildCatalogHref(
  zoneId: ProjectNavZoneId,
  namGroupId?: ProjectNamGroupId | null
): string {
  const params = new URLSearchParams();
  params.set("zone", zoneId);
  if (zoneId === "nam" && namGroupId) params.set("nhom", namGroupId);
  return `/du-an?${params.toString()}`;
}

/**
 * Preview slice for the mega-menu: live projects first, then coming-soon,
 * capped so the popup never becomes a 100-row scroller.
 */
export function previewNavLeaves(leaves: ResolvedNavLeaf[], limit = NAV_MENU_PREVIEW_LIMIT): {
  preview: ResolvedNavLeaf[];
  hiddenCount: number;
} {
  const live = leaves.filter((l) => l.href);
  const soon = leaves.filter((l) => !l.href);
  const ordered = [...live, ...soon];
  return {
    preview: ordered.slice(0, limit),
    hiddenCount: Math.max(0, ordered.length - limit),
  };
}
