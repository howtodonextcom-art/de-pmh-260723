import { test } from "@playwright/test";

test.describe("R11 — Sa bàn CTA is catalog-driven", () => {
  test("public home no longer hardcodes an external sa-bàn host", async ({ page }) => {
    await page.goto("/");
    test.expect(await page.getByTestId("sa-ban-hh-cta").count()).toBe(0);
  });
});
