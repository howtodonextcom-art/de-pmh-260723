import { test, expect } from "@playwright/test";

test.describe("legal — single project focus", () => {
  test("only one project dossier is visible in a scoped view", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/phap-ly?zone=nam&nhom=site-a");

    await expect(page.getByTestId("legal-active-project")).toHaveCount(1);
    await expect(page.getByTestId("legal-active-project")).toBeVisible({ timeout: 20_000 });

    // Both project tabs exist, but only one dossier panel.
    await expect(page.getByTestId("legal-project-tab-the-regency")).toBeVisible();
    await expect(page.getByTestId("legal-project-tab-the-sculptura")).toBeVisible();
    await expect(page.locator('[data-testid="legal-active-project"]')).toHaveCount(1);
  });
});
