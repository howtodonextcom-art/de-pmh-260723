import { describe, expect, it } from "vitest";

import { isValidSlug, slugifyName } from "@/lib/cms/slug";
import { canShowConceptArchitect } from "../../vendor/library/lib/data/architect-visibility";
import { createEmptyProject } from "@/lib/cms/empty-project";

describe("slugifyName", () => {
  it("strips diacritics", () => {
    expect(slugifyName("Đô thị Demo")).toBe("do-thi-demo");
    expect(isValidSlug("do-thi-demo")).toBe(true);
    expect(isValidSlug("A")).toBe(false);
  });
});

describe("canShowConceptArchitect", () => {
  it("hides the name when publicNameApproved is false", () => {
    const project = createEmptyProject("x", "X");
    project.conceptArchitect = { value: "Studio", status: "da-co-du-lieu", publicNameApproved: false };
    expect(canShowConceptArchitect(project)).toBe(false);
    project.conceptArchitect.publicNameApproved = true;
    expect(canShowConceptArchitect(project)).toBe(true);
  });
});
