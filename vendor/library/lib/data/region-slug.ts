import type { Project } from "../../types/project";

/**
 * Canonical city/region → slug. Real diacritic + punctuation stripping (not
 * a static lookup table) so every catalog city string gets a stable slug,
 * including ones nobody hand-listed here (e.g. "Đồng Nai", "Tp. HCM (Bình
 * Dương cũ)") — a static map silently drops any city not enumerated in it,
 * which is what broke Home↔Explorer navigation before this fix: two
 * independent `citySlug` implementations (this file's old static map, and
 * `lib/home-content.ts`'s own copy) disagreed for every real city string
 * except "Bắc Ninh", so a Home map/region-card link built with one slug
 * never matched the Explorer filter built with the other.
 *
 * This is now the ONLY `citySlug` in the codebase — `lib/home-content.ts`
 * re-exports this function rather than keeping its own copy.
 */
export function citySlug(city: string): string {
  return city
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A project's city/region grouping key — trimmed `city`, falling back to
 * trimmed `region`. Both fields are non-nullable strings on `Project`, so a
 * CMS default of `""` must fall through via `||`, not survive a raw `??`
 * (which only catches `null`/`undefined`, not an empty-but-present string).
 */
export function cityOrRegion(p: Pick<Project, "city" | "region">): string {
  return p.city.trim() || p.region.trim();
}

export interface RegionGroup {
  /** Stable grouping key — see `citySlug()`. */
  slug: string;
  /** Display label — the first non-empty city/region string seen for this slug. */
  label: string;
  /** Project slugs in this group, in catalog order. */
  projectSlugs: string[];
}

/**
 * Groups projects by their canonical city/region slug, skipping projects
 * with neither a city nor a region. Single source of truth for both the
 * Home map's region-card list and the `/du-an` "Khu vực" dropdown + filter
 * — grouping by slug (not the raw string) means spelling variants of the
 * same city merge into one group instead of silently splitting counts
 * across near-duplicate keys.
 */
export function groupProjectsByRegion(
  projects: Pick<Project, "slug" | "city" | "region">[],
): RegionGroup[] {
  const bySlug = new Map<string, RegionGroup>();
  for (const p of projects) {
    const label = cityOrRegion(p);
    if (!label) continue;
    const slug = citySlug(label);
    const group = bySlug.get(slug);
    if (group) group.projectSlugs.push(p.slug);
    else bySlug.set(slug, { slug, label, projectSlugs: [p.slug] });
  }
  return [...bySlug.values()];
}
