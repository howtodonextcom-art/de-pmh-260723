import { test, expect } from "@playwright/test";

test.describe("legal — single project focus", () => {
  test("legal page stays coherent with empty catalog", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/phap-ly?zone=nam&nhom=site-a");
    await expect(page.getByRole("heading", { name: "Hồ sơ pháp lý" })).toBeVisible();
    const active = page.getByTestId("legal-active-project");
    if ((await active.count()) === 0) {
      await expect(page.getByText(/Chưa có|không có|trống|empty/i).first()).toBeVisible();
      return;
    }
    await expect(active).toHaveCount(1);
  });
});
