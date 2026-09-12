import { describe, expect, it } from "vitest";

import { createEmptyProject } from "@/lib/cms/empty-project";
import { buildProjectPins, buildRegionGroups, citySlug } from "@/lib/home-content";
import type { Project } from "@library/types/project";

/**
 * Real coordinate pair from A1's verified catalog dump (Aristo). Used
 * as-is — not invented — to prove `buildProjectPins` (the new data path
 * this fix introduces between `project.coordinates` and the Home map)
 * carries a real project's lat/lng through unchanged, with no rounding
 * and no collapse onto a city-cluster centroid or the old
 * `{lng:106,lat:16}` fallback.
 */
const ARISTO_LAT = 10.719602;
const ARISTO_LNG = 106.716154;

function projectWith(slug: string, name: string, patch: Partial<Project>): Project {
  return { ...createEmptyProject(slug, name), ...patch };
}

describe("buildProjectPins", () => {
  it("carries a real project's coordinates through unchanged", () => {
    const aristo = projectWith("aristo", "The Aristo", {
      city: "Tp. HCM",
      coordinates: { lat: ARISTO_LAT, lng: ARISTO_LNG },
    });

    const pins = buildProjectPins([aristo]);

    expect(pins).toEqual([
      { slug: "aristo", displayNameVi: "The Aristo", lat: ARISTO_LAT, lng: ARISTO_LNG },
    ]);
  });

  it("emits no pin at all for a project with null coordinates — no fallback guess", () => {
    const maverick = projectWith("the-maverick", "The MAVERICK", {
      city: "Tp. HCM",
      coordinates: { lat: null, lng: null },
    });

    expect(buildProjectPins([maverick])).toEqual([]);
  });

  it("drops a project missing only one of lat/lng (defensive — the type allows it)", () => {
    const partial = projectWith("partial", "Partial", {
      coordinates: { lat: ARISTO_LAT, lng: null },
    });

    expect(buildProjectPins([partial])).toEqual([]);
  });

  it("mixes geocoded and ungeocoded projects correctly (matches the real 8-of-12 catalog gap)", () => {
    const geocoded = projectWith("hong-hac", "Hồng Hạc", {
      city: "Bắc Ninh",
      coordinates: { lat: 21.002, lng: 105.996 },
    });
    const ungeocoded = projectWith("the-oasis", "The OASIS", {
      city: "Tp. HCM",
      coordinates: { lat: null, lng: null },
    });

    const pins = buildProjectPins([geocoded, ungeocoded]);

    expect(pins).toHaveLength(1);
    expect(pins[0].slug).toBe("hong-hac");
  });
});

describe("citySlug — single canonical implementation (vendor/library)", () => {
  it("produces the same slug for 'Tp. HCM' and 'TP.HCM'", () => {
    expect(citySlug("Tp. HCM")).toBe(citySlug("TP.HCM"));
    expect(citySlug("Tp. HCM")).toBe("tp-hcm");
  });

  it("strips diacritics for 'Đồng Nai'", () => {
    expect(citySlug("Đồng Nai")).toBe("dong-nai");
  });

  it("produces a stable slug for the Bình Dương cluster string", () => {
    const a = citySlug("Tp. HCM (Bình Dương cũ)");
    const b = citySlug("Tp. HCM (Bình Dương cũ)");
    expect(a).toBe(b);
    expect(a).not.toBe(citySlug("Tp. HCM")); // must NOT collide with plain HCM
    expect(a).toMatch(/^[a-z0-9-]+$/);
  });

  it("keeps 'Bắc Ninh' stable (backward-compatible with existing e2e expectations)", () => {
    expect(citySlug("Bắc Ninh")).toBe("bac-ninh");
  });
});

describe("buildRegionGroups", () => {
  it("merges spelling variants of the same city into one group via the canonical slug", () => {
    const a = projectWith("a", "A", { city: "Tp. HCM" });
    const b = projectWith("b", "B", { city: "TP.HCM" }); // different raw string, same real city
    const c = projectWith("c", "C", { city: "Bắc Ninh" });

    const groups = buildRegionGroups([a, b, c]);
    const hcm = groups.find((g) => g.slug === "tp-hcm");
    const bn = groups.find((g) => g.slug === "bac-ninh");

    expect(hcm?.count).toBe(2);
    expect(hcm?.soloSlug).toBeNull(); // >=2 projects -> filter link, not a direct project link
    expect(bn?.count).toBe(1);
    expect(bn?.soloSlug).toBe("c"); // exactly 1 project -> direct link
  });

  it("falls back to trimmed region when city is empty, and skips groups with neither", () => {
    const withRegionOnly = projectWith("d", "D", { city: "", region: "Miền Bắc" });
    const withNeither = projectWith("e", "E", { city: "", region: "" });

    const groups = buildRegionGroups([withRegionOnly, withNeither]);

    expect(groups).toHaveLength(1);
    expect(groups[0].region).toBe("Miền Bắc");
  });

  it("resolves the Tp. HCM group to 9 members for the real current catalog shape", () => {
    // Mirrors A1's verified dump: 9 projects share the "Tp. HCM" city string.
    const hcmSlugs = [
      "aristo",
      "casa-luna",
      "culture-center",
      "regency",
      "sculptura",
      "the-maverick",
      "the-monarch",
      "the-oasis",
      "triton-crown",
    ];
    const projects = hcmSlugs.map((slug) => projectWith(slug, slug, { city: "Tp. HCM" }));
    const groups = buildRegionGroups(projects);

    expect(groups).toHaveLength(1);
    expect(groups[0].slug).toBe("tp-hcm");
    expect(groups[0].count).toBe(9);
    expect(groups[0].soloSlug).toBeNull();
  });
});
