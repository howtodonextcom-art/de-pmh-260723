import { describe, expect, it } from "vitest";

import { isFirebaseAdminReady, resolveFirebaseAdminProjectId } from "@/lib/config/admin-project-id";
import { hasPdfFunctionUrl, publicEnv } from "@/lib/config/env";

describe("resolveFirebaseAdminProjectId", () => {
  it("prefers explicit Admin project id", () => {
    expect(resolveFirebaseAdminProjectId("admin-id", "public-id")).toBe("admin-id");
  });

  it("falls back to NEXT_PUBLIC project id on Vercel", () => {
    expect(resolveFirebaseAdminProjectId("", "public-id")).toBe("public-id");
    expect(resolveFirebaseAdminProjectId("  ", "public-id")).toBe("public-id");
  });
});

describe("isFirebaseAdminReady", () => {
  it("is false without project id even if a key file path exists", () => {
    expect(
      isFirebaseAdminReady({
        projectId: "",
        clientEmail: "",
        privateKey: "",
        credentialsPath: "./service.json",
      }),
    ).toBe(false);
  });

  it("is true with project id + PEM pair (Vercel)", () => {
    expect(
      isFirebaseAdminReady({
        projectId: "de-division",
        clientEmail: "sa@example.com",
        privateKey: "-----BEGIN PRIVATE KEY-----",
        credentialsPath: "",
      }),
    ).toBe(true);
  });

  it("is true with project id + local credentials path", () => {
    expect(
      isFirebaseAdminReady({
        projectId: "de-division",
        clientEmail: "",
        privateKey: "",
        credentialsPath: "./service.json",
      }),
    ).toBe(true);
  });

  it("is false with only public-style project id and no secrets", () => {
    expect(
      isFirebaseAdminReady({
        projectId: "de-division",
        clientEmail: "",
        privateKey: "",
        credentialsPath: "",
      }),
    ).toBe(false);
  });
});

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
