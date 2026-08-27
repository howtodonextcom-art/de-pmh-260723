import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { COMPARE_FIELDS } from "../vendor/library/lib/data/compare-fields";
import type { FieldStatus, Project } from "../vendor/library/types/project";

import {
  LEGAL_TABLE_ROW_LABELS,
  LEGAL_TABLE_ROW_ORDER,
  resolveLegalGroupLines,
  type LegalDocLine,
} from "./legal-documents";

export type ViewSnapshotLegalGroup = {
  id: string;
  label: string;
  lines: LegalDocLine[];
};

export type ViewSnapshotCompareField = {
  id: string;
  label: string;
  display: string;
  status: FieldStatus;
  tooltip?: string;
};

/** One project as `/phap-ly` + `/so-sanh` actually render it. */
export type ProjectViewSnapshot = {
  slug: string;
  displayName: string;
  region: string;
  lastVerifiedAt: string | null;
  legal: { groups: ViewSnapshotLegalGroup[] };
  compare: { fields: ViewSnapshotCompareField[] };
};

export type ViewSnapshotIndex = {
  createdAt: string;
  source: "library";
  projectCount: number;
  legalLineCount: number;
  compareCellCount: number;
  slugs: string[];
};

export function buildProjectViewSnapshot(project: Project): ProjectViewSnapshot {
  const groups = LEGAL_TABLE_ROW_ORDER.map((rowId) => ({
    id: rowId,
    label: LEGAL_TABLE_ROW_LABELS[rowId],
    lines: resolveLegalGroupLines(project, rowId),
  }));

  const fields = COMPARE_FIELDS.map((field) => {
    const cell = field.cell(project);
    const row: ViewSnapshotCompareField = {
      id: field.id,
      label: field.label,
      display: cell.display,
      status: cell.status,
    };
    if (cell.tooltip) row.tooltip = cell.tooltip;
    return row;
  });

  return {
    slug: project.slug,
    displayName: project.displayNameVi,
    region: project.region,
    lastVerifiedAt: project.lastVerifiedAt ?? null,
    legal: { groups },
    compare: { fields },
  };
}

export function buildViewSnapshotIndex(
  snapshots: ProjectViewSnapshot[],
  createdAt = new Date().toISOString(),
): ViewSnapshotIndex {
  return {
    createdAt,
    source: "library",
    projectCount: snapshots.length,
    legalLineCount: snapshots.reduce(
      (n, s) => n + s.legal.groups.reduce((g, group) => g + group.lines.length, 0),
      0,
    ),
    compareCellCount: snapshots.reduce((n, s) => n + s.compare.fields.length, 0),
    slugs: snapshots.map((s) => s.slug),
  };
}

export function writeViewSnapshotTree(
  destDir: string,
  snapshots: ProjectViewSnapshot[],
  createdAt = new Date().toISOString(),
): ViewSnapshotIndex {
  const projectsDir = path.join(destDir, "projects");
  mkdirSync(projectsDir, { recursive: true });
  for (const snapshot of snapshots) {
    writeFileSync(
      path.join(projectsDir, `${snapshot.slug}.json`),
      JSON.stringify(snapshot, null, 2) + "\n",
      "utf8",
    );
  }
  const index = buildViewSnapshotIndex(snapshots, createdAt);
  writeFileSync(path.join(destDir, "index.json"), JSON.stringify(index, null, 2) + "\n", "utf8");
  return index;
}

function stamp(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/** Write gitignored backup + latest `data/runtime/snapshots` copy. */
export function runBackupViews(root: string, snapshots: ProjectViewSnapshot[], now = new Date()) {
  const createdAt = now.toISOString();
  const id = `view-snapshot-${stamp(now)}`;
  const backupDir = path.join(root, "backups", id);
  const runtimeDir = path.join(root, "data", "runtime", "snapshots");
  const index = writeViewSnapshotTree(backupDir, snapshots, createdAt);

  mkdirSync(runtimeDir, { recursive: true });
  cpSync(path.join(backupDir, "projects"), path.join(runtimeDir, "projects"), { recursive: true });
  writeFileSync(path.join(runtimeDir, "index.json"), JSON.stringify(index, null, 2) + "\n", "utf8");

  const restore = [
    "Restore / re-import (Phase 1 admin form):",
    `  Source: backups/${id}/projects/<slug>.json`,
    "  Each file is the legal table + compare matrix as rendered, keyed by slug.",
    "  Copy into data/runtime/snapshots/ to keep a working latest copy (gitignored).",
  ].join("\n");
  writeFileSync(path.join(backupDir, "RESTORE.txt"), restore + "\n", "utf8");

  return { id, backupDir, runtimeDir, index };
}
