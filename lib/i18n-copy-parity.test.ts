import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  COMPARE_FIELD_LABELS,
  FACT_GRID_LABELS,
  FIELD_STATUS_LABELS,
  LEGAL_GROUP_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
} from "../vendor/library/lib/i18n-copy";
import { localizedDisplayName, localizedShortDescription } from "./i18n/project-copy";

const root = path.dirname(fileURLToPath(import.meta.url));
const vi = JSON.parse(readFileSync(path.join(root, "i18n", "vi.json"), "utf8")) as Record<
  string,
  Record<string, string>
>;
const en = JSON.parse(readFileSync(path.join(root, "i18n", "en.json"), "utf8")) as Record<
  string,
  Record<string, string>
>;

function expectMapMatches(
  namespace: string,
  maps: { vi: Record<string, string>; en: Record<string, string> },
) {
  expect(maps.vi, `${namespace} vi`).toEqual(vi[namespace]);
  expect(maps.en, `${namespace} en`).toEqual(en[namespace]);
}

describe("vendor i18n-copy stays in lockstep with lib/i18n JSON", () => {
  it("projectStatus", () => expectMapMatches("projectStatus", PROJECT_STATUS_LABELS));
  it("fieldStatus", () => expectMapMatches("fieldStatus", FIELD_STATUS_LABELS));
  it("projectType", () => expectMapMatches("projectType", PROJECT_TYPE_LABELS));
  it("factGrid", () => expectMapMatches("factGrid", FACT_GRID_LABELS));
  it("compareFields", () => expectMapMatches("compareFields", COMPARE_FIELD_LABELS));
  it("legalGroup", () => expectMapMatches("legalGroup", LEGAL_GROUP_LABELS));
});

describe("localized project copy", () => {
  const project = {
    displayNameVi: "Hồng Hạc",
    displayNameEn: "Hong Hac",
    shortDescriptionVi: "Mô tả tiếng Việt.",
    shortDescriptionEn: "English description.",
  };

  it("uses EN name and description when locale is en and fields exist", () => {
    expect(localizedDisplayName(project, "en")).toBe("Hong Hac");
    expect(localizedShortDescription(project, "en")).toBe("English description.");
  });

  it("falls back to VI when EN is empty", () => {
    expect(localizedDisplayName({ displayNameVi: "Hồng Hạc", displayNameEn: null }, "en")).toBe("Hồng Hạc");
    expect(
      localizedShortDescription({ shortDescriptionVi: "Mô tả tiếng Việt.", shortDescriptionEn: "  " }, "en"),
    ).toBe("Mô tả tiếng Việt.");
  });
});
