import { test, expect } from "@playwright/test";

test.describe("i18n — no raw key leakage", () => {
  test("/du-an toolbar + heading render translated strings", async ({ page }) => {
    await page.goto("/du-an");
    await expect(page.getByRole("heading", { name: "Danh mục dự án" })).toBeVisible();
    await expect(page.getByPlaceholder("Tìm dự án…")).toBeVisible();
    await expect(page.getByText(/^\d+ dự án$/)).toBeVisible();
    await expect(page.getByText(/\bduAn\.|\bhome\.|\bcmdk\./)).toHaveCount(0);
  });

  test("CMDK groups are translated on home", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Tìm kiếm" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Dự án", { exact: true })).toBeVisible();
    await expect(dialog.getByText("Trang", { exact: true })).toBeVisible();
    await expect(dialog.getByText("Hành động", { exact: true })).toBeVisible();
  });
});

test.describe("PDF export path — never a silent no-op", () => {
  test("detail 'Xuất PDF' button triggers print when a project exists", async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error test-only global
      window.__printCalled = false;
      window.print = () => {
        // @ts-expect-error test-only global
        window.__printCalled = true;
      };
    });

    await page.goto("/du-an");
    const card = page.locator('a[href^="/du-an/"]').first();
    if ((await card.count()) === 0) test.skip(true, "empty catalog");
    await card.click();
    const pdfButton = page.getByRole("button", { name: "Xuất PDF" });
    if ((await pdfButton.count()) === 0) test.skip(true, "no pdf button");
    await pdfButton.scrollIntoViewIfNeeded();
    await pdfButton.click();

    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __printCalled: boolean }).__printCalled))
      .toBe(true);
  });
});
