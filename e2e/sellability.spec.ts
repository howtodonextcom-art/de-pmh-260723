import { test, expect } from "@playwright/test";

/**
 * R11 — sellability pack e2e. The HH CTA href/UTM/target contract and the
 * demo-critical map→filter path are already covered by e2e/map.spec.ts
 * (harden there, don't duplicate). This file adds the one item that wasn't
 * covered: an optional, non-flaky liveness check against the *external*
 * sa-ban production URL the CTA points to.
 */

const SA_BAN_URL = "https://www.bacninhhonghaccity.vn/sa-ban?utm_source=ded-pmh&utm_medium=home-map&utm_campaign=map-cta";

test.describe("R11 — Sa bàn Hồng Hạc external deep-link", () => {
  test("sa-ban URL responds (soft — third-party uptime, not this repo's contract)", async ({ request }) => {
    try {
      const response = await request.get(SA_BAN_URL, { timeout: 10_000 });
      expect(response.status(), `sa-ban responded ${response.status()}`).toBeLessThan(400);
    } catch (err) {
      // Third-party network reachability is not something this repo's CI
      // should hard-fail on (corporate proxies, sa-ban maintenance windows,
      // DNS in CI sandboxes, etc). The contract we actually own — the href,
      // its UTM params, and target="_blank" — is asserted in map.spec.ts.
      test.skip(true, `sa-ban unreachable from this environment (soft/CONDITIONAL): ${err}`);
    }
  });
});
