import { describe, expect, it } from "vitest";

import { CMS_ID_TOKEN_COOKIE_PREFIX } from "@/lib/cms/constants";

function isIdTokenSessionCookie(value: string): boolean {
  return value.startsWith(CMS_ID_TOKEN_COOKIE_PREFIX);
}

describe("id-token session cookie prefix", () => {
  it("detects the fallback prefix and ignores Admin session cookies", () => {
    expect(isIdTokenSessionCookie(`${CMS_ID_TOKEN_COOKIE_PREFIX}abc`)).toBe(true);
    expect(isIdTokenSessionCookie("session-cookie-from-admin")).toBe(false);
  });
});
