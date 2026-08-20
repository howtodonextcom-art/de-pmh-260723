"use client";

import { useMemo } from "react";

import {
  getBranchSlugs,
  parseNamGroupId,
  parseNavZoneId,
  type ProjectNamGroupId,
  type ProjectNavZoneId,
} from "@/lib/project-nav-taxonomy";

export interface NavScope {
  zone: ProjectNavZoneId | null;
  nhom: ProjectNamGroupId | null;
}

/**
 * Pure — no React/DOM dependency. Parses raw `zone`/`nhom` query values (as read from
 * `URLSearchParams.get(...)`) into a validated `NavScope`. `nhom` is only meaningful
 * under `zone === "nam"`, mirroring the nav taxonomy (Bắc has no sub-groups).
 */
export function parseNavScope(rawZone: string | null, rawNhom: string | null): NavScope {
  const zone = parseNavZoneId(rawZone);
  const nhom = zone === "nam" ? parseNamGroupId(rawNhom) : null;
  return { zone, nhom };
}

/**
 * Pure — no React/DOM dependency. Filters `items` down to those whose `slug` falls
 * within the given nav scope (zone, optionally group). An unset zone is "no filter".
 */
export function filterBySlugInScope<T extends { slug: string }>(items: T[], scope: NavScope): T[] {
  if (!scope.zone) return items;
  const allowed = new Set(getBranchSlugs(scope.zone, scope.nhom));
  return items.filter((item) => allowed.has(item.slug));
}

export interface UseNavScopeFilterOptions {
  /**
   * Extra `URLSearchParams` keys to clear whenever the zone/group scope changes —
   * e.g. `["slugs"]` on `/so-sanh`, `["slug"]` on `/phap-ly`, `["xem"]` on `/du-an` —
   * since a prior selection made outside the new scope is no longer valid.
   */
  clearParamsOnScopeChange?: string[];
}

/**
 * F15 — zone/group ("Phía Bắc" / "Phía Nam" → "Site A" / "Outsite") scope filter,
 * previously duplicated across compare-table, legal-page-client and project-explorer.
 *
 * Reads `zone`/`nhom` off `searchParams`, derives the validated scope + filtered list
 * (both memoized, wrapping the pure functions above), and hands back `setZoneFilter`/
 * `setNhomFilter` writers built on top of `replaceParams` (see `useReplaceSearchParams`).
 */
export function useNavScopeFilter<T extends { slug: string }>(
  items: T[],
  searchParams: Pick<URLSearchParams, "get">,
  replaceParams: (mutate: (params: URLSearchParams) => void) => void,
  options?: UseNavScopeFilterOptions,
) {
  const rawZone = searchParams.get("zone");
  const rawNhom = searchParams.get("nhom");
  const clearKeys = options?.clearParamsOnScopeChange ?? [];

  const scope = useMemo(() => parseNavScope(rawZone, rawNhom), [rawZone, rawNhom]);
  const filtered = useMemo(() => filterBySlugInScope(items, scope), [items, scope]);

  function setZoneFilter(next: ProjectNavZoneId | "all") {
    replaceParams((params) => {
      for (const key of clearKeys) params.delete(key);
      if (next === "all") {
        params.delete("zone");
        params.delete("nhom");
      } else {
        params.set("zone", next);
        if (next === "nam") {
          if (!parseNamGroupId(params.get("nhom"))) params.set("nhom", "site-a");
        } else {
          params.delete("nhom");
        }
      }
    });
  }

  function setNhomFilter(next: ProjectNamGroupId | "all") {
    replaceParams((params) => {
      for (const key of clearKeys) params.delete(key);
      params.set("zone", "nam");
      if (next === "all") params.delete("nhom");
      else params.set("nhom", next);
    });
  }

  return { ...scope, filtered, setZoneFilter, setNhomFilter };
}
