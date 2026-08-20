// White-label config: PMH-specific nav taxonomy data.
// Types live in `lib/project-nav-taxonomy.ts` (ProjectNavZone et al.) —
// this file only holds the raw, deployment-specific values.

import type { ProjectNavZone } from "@/lib/project-nav-taxonomy";

/**
 * Desktop nav IA — Phía Bắc | Phía Nam → (Site A | Outsite).
 * Mapped to live catalog where data exists; remaining leaves are placeholders.
 */
// White-label: replace this object per deployment
export const PROJECT_NAV_ZONES: ProjectNavZone[] = [
  {
    id: "bac",
    label: "Phía Bắc",
    projects: [
      {
        id: "hong-hac-city",
        label: "Khu đô thị Hồng Hạc City",
        location: "Bắc Ninh",
        slug: "hong-hac-city",
      },
      {
        id: "phu-tho-eco",
        label: "Khu đô thị sinh thái Phú Thọ",
        location: "Phú Thọ",
      },
    ],
  },
  {
    id: "nam",
    label: "Phía Nam",
    groups: [
      {
        id: "site-a",
        label: "Site A",
        projects: [
          { id: "cr9", label: "CR9", location: "TP.HCM" },
          {
            id: "h14-3",
            label: "H14-3",
            location: "TP.HCM",
            slug: "the-sculptura",
          },
          { id: "c10", label: "C10", location: "TP.HCM" },
          {
            id: "cr5-1b",
            label: "CR5-1B",
            location: "TP.HCM",
            slug: "the-regency",
          },
        ],
      },
      {
        id: "outsite",
        label: "Outsite",
        projects: [
          {
            id: "binh-duong",
            label: "Bình Dương",
            location: "Bình Dương",
            slug: "harmonie",
          },
          { id: "sen-viet", label: "Sen Việt", location: "Outsite" },
          { id: "ho-tram", label: "Hồ Tràm", location: "Bà Rịa – Vũng Tàu" },
          { id: "gia-viet", label: "Gia Việt", location: "Outsite" },
        ],
      },
    ],
  },
];
