import path from "node:path";
import { describe, expect, it } from "vitest";

import { createEmptyProject } from "@/lib/cms/empty-project";
import { LEGAL_TABLE_ROW_ORDER } from "@/lib/legal-documents";
import {
  buildProjectViewSnapshot,
  buildViewSnapshotIndex,
  runBackupViews,
} from "@/lib/view-snapshot";
import { loadFullProjectsForV0 } from "../vendor/library/library/seed-adapter";

function fixtureProject() {
  const project = createEmptyProject("demo-alpha", "Demo Alpha");
  project.address = "Lô Z9, Phường Demo";
  project.plotCode = "Z9";
  project.totalUnits = 12;
  project.totalUnitsStatus = "da-co-du-lieu";
  project.legalDossier = {
    investmentApproval: "QĐ 1/QĐ-UBND (01/01/2026)",
    landAllocation: null,
    detailedPlanning: null,
    constructionPermits: "99/GPXD (02/02/2026)",
    salesEligibility: null,
    mainContractor: null,
    disputes: null,
  };
  return project;
}

describe("buildProjectViewSnapshot", () => {
  const vendorProjects = loadFullProjectsForV0();

  it("treats wiped vendor seed as an empty catalog", () => {
    expect(vendorProjects).toEqual([]);
  });

  it("uses the same 8 legal groups as /phap-ly on a generic fixture", () => {
    const snap = buildProjectViewSnapshot(fixtureProject());
    expect(snap.legal.groups.map((g) => g.id)).toEqual([...LEGAL_TABLE_ROW_ORDER]);
    const texts = snap.legal.groups.flatMap((g) => g.lines.map((l) => l.text)).join("\n");
    expect(texts).toContain("1/QĐ-UBND");
    expect(texts).toContain("99/GPXD");
  });

  it("captures compare lo-dat from plotCode then address", () => {
    const withCode = buildProjectViewSnapshot(fixtureProject());
    expect(withCode.compare.fields.find((f) => f.id === "lo-dat")).toMatchObject({
      display: "Z9",
      status: "da-co-du-lieu",
    });
    const fromAddress = createEmptyProject("demo-beta", "Demo Beta");
    fromAddress.address = "Thửa đất số 1307, xã Demo";
    const lo = buildProjectViewSnapshot(fromAddress).compare.fields.find((f) => f.id === "lo-dat");
    expect(lo?.display).toMatch(/Thửa đất số 1307/i);
  });

  it("counts compare cells as field rows × projects", () => {
    const snaps = [fixtureProject()].map(buildProjectViewSnapshot);
    const index = buildViewSnapshotIndex(snaps, "2026-08-27T00:00:00.000Z");
    expect(index.compareCellCount).toBe(snaps[0].compare.fields.length * snaps.length);
    expect(index.legalLineCount).toBeGreaterThan(0);
  });

  it("writes backup:views artifacts when BACKUP_VIEWS=1", () => {
    if (process.env.BACKUP_VIEWS !== "1") return;
    const snapshots = vendorProjects.map(buildProjectViewSnapshot);
    const result = runBackupViews(path.resolve(__dirname, ".."), snapshots);
    expect(result.index.projectCount).toBe(vendorProjects.length);
    console.log(
      `backup:views — ${result.index.projectCount} projects, ${result.index.legalLineCount} legal lines, ${result.index.compareCellCount} compare cells → backups/${result.id}/`,
    );
  });
});
