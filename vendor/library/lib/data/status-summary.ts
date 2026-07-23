import type { FieldStatus, Project } from "../../types/project";

const STATUS_ORDER: FieldStatus[] = [
  "da-co-du-lieu",
  "chua-xac-thuc",
  "mau-thuan",
  "chua-co-du-lieu",
  "bao-mat",
];

/** Tally of the 5 data-status labels across a project's key tracked fields (SPEC §3.3 card anatomy). */
export function computeFieldStatusSummary(project: Project): Partial<Record<FieldStatus, number>> {
  const statuses: FieldStatus[] = [
    project.siteAreaStatus,
    project.gfaStatus,
    project.totalUnitsStatus,
    project.conceptArchitect.status,
    project.conceptInterior.status,
    project.conceptLandscape.status,
  ];
  const tally: Partial<Record<FieldStatus, number>> = {};
  for (const s of statuses) {
    tally[s] = (tally[s] ?? 0) + 1;
  }
  return tally;
}

export function orderedStatusEntries(
  tally: Partial<Record<FieldStatus, number>>,
): Array<[FieldStatus, number]> {
  return STATUS_ORDER.filter((s) => tally[s]).map((s) => [s, tally[s]!]);
}
