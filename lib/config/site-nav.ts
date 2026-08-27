import type { ProjectNavZone } from "@/lib/project-nav-taxonomy";

/**
 * Zone/group shells only. Live leaves come from CMS `navZone` / `namGroup`.
 */
export const PROJECT_NAV_ZONES: ProjectNavZone[] = [
  {
    id: "bac",
    label: "Phía Bắc",
    projects: [],
  },
  {
    id: "nam",
    label: "Phía Nam",
    groups: [
      { id: "site-a", label: "Site A", projects: [] },
      { id: "outsite", label: "Outsite", projects: [] },
    ],
  },
];
