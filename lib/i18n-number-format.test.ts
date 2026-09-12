import { describe, expect, it } from "vitest";

import { createEmptyProject } from "@/lib/cms/empty-project";
import { buildFactGrid } from "../vendor/library/lib/data/fact-grid";
import { COMPARE_FIELDS, getCompareFields } from "../vendor/library/lib/data/compare-fields";

/**
 * No project in the current catalog has `totalUnits` populated (a data gap,
 * same shape as the address gap found in Round 4), so the "căn"/"units"
 * word can't be observed live via MCP against real data. This fixture
 * exercises the exact same code path (buildFactGrid / COMPARE_FIELDS)
 * with a stand-in totalUnits value so the locale branch is verified for
 * real rather than assumed from reading the source.
 */
function fixtureProject() {
  const project = createEmptyProject("demo-locale", "Demo Locale");
  project.totalUnits = 1234;
  project.totalUnitsStatus = "da-co-du-lieu";
  project.siteArea = 1977615.71;
  project.siteAreaStatus = "da-co-du-lieu";
  return project;
}

describe("locale-aware number formatting", () => {
  it("formats fact-grid Số căn / Diện tích đất per locale", () => {
    const vi = buildFactGrid(fixtureProject(), "vi");
    const en = buildFactGrid(fixtureProject(), "en");

    expect(vi.find((c) => c.id === "units")?.value).toBe("1.234 căn");
    expect(en.find((c) => c.id === "units")?.value).toBe("1,234 units");
    expect(en.find((c) => c.id === "units")?.label).toBe("Units");

    expect(vi.find((c) => c.id === "siteArea")?.value).toBe("1.977.615,71 m²");
    expect(en.find((c) => c.id === "siteArea")?.value).toBe("1,977,615.71 m²");
    expect(en.find((c) => c.id === "siteArea")?.label).toBe("Site area");
  });

  it("formats compare-table Số căn / Diện tích đất per locale", () => {
    const soCan = COMPARE_FIELDS.find((f) => f.id === "so-can")!;
    const quyMoDat = COMPARE_FIELDS.find((f) => f.id === "quy-mo-dat")!;
    const project = fixtureProject();

    expect(soCan.cell(project, "vi").display).toBe("1.234 căn");
    expect(soCan.cell(project, "en").display).toBe("1,234 units");

    expect(quyMoDat.cell(project, "vi").display).toBe("197,76 ha");
    expect(quyMoDat.cell(project, "en").display).toBe("197.76 ha");
  });

  it("translates compare row labels per locale", () => {
    expect(getCompareFields("en").find((f) => f.id === "so-can")?.label).toBe("Units");
    expect(getCompareFields("vi").find((f) => f.id === "so-can")?.label).toBe("Số căn");
  });
});
