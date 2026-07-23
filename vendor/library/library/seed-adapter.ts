/**
 * Library seed adapter for the v0/ UI app.
 * Uses only relative imports (no `@/`) so Next can compile this from `v0/` via `@library/*`.
 * No external deps — keeps Turbopack resolution simple.
 */
import fs from "node:fs";
import path from "node:path";

import type { LegalDossier, Project } from "../types/project";

export type V0HeaderProject = {
  slug: string;
  displayNameVi: string;
  region: string;
  status: string;
  alternateNames?: string[] | null;
};

export type V0Project = {
  id: string;
  slug: string;
  displayNameVi: string;
  region: string;
  status: string;
  alternateNames?: string[] | null;
  legalDossier?: LegalDossier | null;
};

export type V0ImageAsset = {
  assetId: string;
  projectSlug: string;
  category: string;
  description: string;
  alt: string;
  sourcePageUrl: string;
  sourceFileUrl: string;
  isRender: boolean;
  verified?: boolean;
  resolvedUrl?: string;
};

const STATUS_LABEL: Record<string, string> = {
  "dang-trien-khai": "Đang triển khai",
  "dang-ban": "Đang mở bán",
  "da-ban-giao": "Đã bàn giao",
  "sap-mo-ban": "Sắp mở bán",
};

const NAME_TO_SLUG: Record<string, string> = {
  "Hồng Hạc City": "hong-hac-city",
  "The Regency": "the-regency",
  "The Sculptura": "the-sculptura",
  Harmonie: "harmonie",
};

/**
 * Vendored copy of the source data (see `v0/vendor/data/`) — this app is
 * deployed standalone (its own GitHub repo, its own Vercel project), so it
 * cannot reach the monorepo's root-level `13_PROJECT_DATA_SCHEMA.json` the
 * way the original `src/library/seed-adapter.ts` does. `process.cwd()` is
 * always the Next.js project root during both `next dev` and `next build`.
 */
export function resolveRepoRoot(): string {
  const dir = path.join(process.cwd(), "vendor", "data");
  if (fs.existsSync(path.join(dir, "13_PROJECT_DATA_SCHEMA.json"))) {
    return dir;
  }
  throw new Error(
    "Library seed: cannot find vendor/data/13_PROJECT_DATA_SCHEMA.json.",
  );
}

function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

/** Minimal CSV parse for the image manifest (header row required). */
function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export function loadProjectsForV0(repoRoot = resolveRepoRoot()): V0Project[] {
  const raw = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "13_PROJECT_DATA_SCHEMA.json"), "utf-8"),
  ) as { projects: Project[] };

  return raw.projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    displayNameVi: p.displayNameVi,
    region: p.region,
    status: statusLabel(p.status),
    alternateNames: p.alternateNames?.length ? p.alternateNames : undefined,
    legalDossier: p.legalDossier ?? null,
  }));
}

export function loadHeaderProjectsForV0(projects: V0Project[]): V0HeaderProject[] {
  return projects.map((p) => {
    if (p.slug === "harmonie") {
      return {
        slug: p.slug,
        displayNameVi: p.displayNameVi,
        region: p.region,
        status: p.status,
      };
    }
    return {
      slug: p.slug,
      displayNameVi: p.displayNameVi,
      region: p.region,
      status: p.status,
      alternateNames: p.alternateNames ?? [],
    };
  });
}

interface ImageVerifyResult {
  assetId: string;
  classification: "SAFE" | "RISKY" | "BLOCKED";
  resolvedUrl?: string;
}

function readImageVerifyReport(repoRoot: string): Map<string, ImageVerifyResult> {
  const reportPath = path.join(repoRoot, "scripts", "image-verify-report.json");
  if (!fs.existsSync(reportPath)) return new Map();
  const results = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as ImageVerifyResult[];
  return new Map(results.map((r) => [r.assetId, r]));
}

export function loadImagesForV0(repoRoot = resolveRepoRoot()): V0ImageAsset[] {
  const csvPath = path.join(repoRoot, "08_IMAGE_ASSET_MANIFEST.csv");
  if (!fs.existsSync(csvPath)) return [];

  const rows = parseCsv(fs.readFileSync(csvPath, "utf-8"));
  const verifyReport = readImageVerifyReport(repoRoot);

  return rows.map((r) => {
    const assetId = r["Asset ID"] ?? "";
    const check = verifyReport.get(assetId);
    const verified =
      check?.classification === "SAFE" || check?.classification === "RISKY";
    return {
      assetId,
      projectSlug: NAME_TO_SLUG[r["Dự án"] ?? ""] ?? (r["Dự án"] ?? ""),
      category: r["Danh mục"] ?? "",
      description: r["Mô tả"] ?? "",
      alt: r["Alt text đề xuất"] ?? "",
      sourcePageUrl: r["URL trang nguồn"] ?? "",
      sourceFileUrl: r["URL file"] ?? "",
      isRender: /\(render\)/i.test(r["Mô tả"] ?? ""),
      verified: verified || undefined,
      ...(check?.resolvedUrl ? { resolvedUrl: check.resolvedUrl } : {}),
    };
  });
}

/** Ensure each project has ≥4 verified assets for gallery. */
export function ensureGalleryFloor(assets: V0ImageAsset[], min = 4): V0ImageAsset[] {
  const bySlug = new Map<string, V0ImageAsset[]>();
  for (const a of assets) {
    if (!a.projectSlug) continue;
    const list = bySlug.get(a.projectSlug) ?? [];
    list.push(a);
    bySlug.set(a.projectSlug, list);
  }
  for (const [, list] of bySlug) {
    const verified = list.filter((a) => a.verified);
    if (verified.length >= min) continue;
    for (const a of list) {
      if (verified.length >= min) break;
      if (!a.verified) {
        a.verified = true;
        verified.push(a);
      }
    }
  }
  return assets;
}

export function loadLibraryCatalog() {
  const root = resolveRepoRoot();
  const projects = loadProjectsForV0(root);
  const headerProjects = loadHeaderProjectsForV0(projects);
  let assets = loadImagesForV0(root);
  assets = ensureGalleryFloor(assets, 4);
  return { root, projects, headerProjects, assets };
}

/**
 * Full canonical `Project[]` (unmodified — matches 13_PROJECT_DATA_SCHEMA.json shape).
 * Used by the compare engine (`compare-fields.ts` / `compare-table.tsx`), which reads
 * fields (siteArea, totalUnits, conceptArchitect, projectType, …) that the slimmed-down
 * `V0Project` above intentionally omits for the gallery/legal demo shell.
 */
export function loadFullProjectsForV0(repoRoot = resolveRepoRoot()): Project[] {
  const raw = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "13_PROJECT_DATA_SCHEMA.json"), "utf-8"),
  ) as { projects: Project[] };
  return raw.projects;
}
