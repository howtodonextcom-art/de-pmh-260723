import { describe, expect, it } from "vitest";

import { splitLegalContent } from "@/lib/legal-documents";

describe("splitLegalContent", () => {
  it("returns an empty array for null/undefined/blank input", () => {
    expect(splitLegalContent(null)).toEqual([]);
    expect(splitLegalContent(undefined)).toEqual([]);
    expect(splitLegalContent("   ")).toEqual([]);
  });

  it("parses a single line, extracting date and doc code", () => {
    const result = splitLegalContent(
      "Quyết định số 158/QĐ-UBND ngày 12/3/2020 về việc giao đất"
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "doc-0",
      text: "Quyết định số 158/QĐ-UBND ngày 12/3/2020 về việc giao đất",
      date: "12/3/2020",
      code: "158/QĐ-UBND",
      scanAssetId: null,
    });
  });

  it("splits multiple lines on semicolons, trimming whitespace", () => {
    const result = splitLegalContent(
      "Văn bản A ngày 01/01/2021; Văn bản B ngày 15/6/2022"
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("doc-0");
    expect(result[0].text).toBe("Văn bản A ngày 01/01/2021");
    expect(result[1].id).toBe("doc-1");
    expect(result[1].text).toBe("Văn bản B ngày 15/6/2022");
  });

  it("leaves date/code undefined when the line has neither", () => {
    const result = splitLegalContent("Ghi chú không có mã số hay ngày tháng");
    expect(result).toHaveLength(1);
    expect(result[0].date).toBeUndefined();
    expect(result[0].code).toBeUndefined();
    expect(result[0].scanAssetId).toBeNull();
  });
});
