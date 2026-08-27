import { describe, expect, it } from "vitest";

import { hasPdfFunctionUrl, publicEnv } from "@/lib/config/env";

describe("publicEnv", () => {
  it("always exposes site identity fallbacks", () => {
    expect(publicEnv.siteName.length).toBeGreaterThan(0);
    expect(publicEnv.siteUrl.length).toBeGreaterThan(0);
    expect(publicEnv.brandShort.length).toBeGreaterThan(0);
  });

  it("treats empty PDF function URL as unset", () => {
    expect(typeof publicEnv.pdfFunctionUrl).toBe("string");
    if (!publicEnv.pdfFunctionUrl) expect(hasPdfFunctionUrl()).toBe(false);
  });
});
