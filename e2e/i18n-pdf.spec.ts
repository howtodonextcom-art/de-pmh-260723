import { test, expect } from "@playwright/test";

/**
 * Final-remainder hardening (R5): asserts i18n-migrated strings render as
 * real text (not raw dot.key leakage) on high-traffic surfaces, and that the
 * PDF export path — CMDK + detail button + `?export=pdf` query — always
 * triggers the honest print fallback (never a silent no-op).
 */

test.describe("i18n — no raw key leakage", () => {
  test("/du-an toolbar + heading render translated strings", async ({ page }) => {
    await page.goto("/du-an");
    await expect(page.getByRole("heading", { name: "Danh mục dự án" })).toBeVisible();
    await expect(page.getByPlaceholder("Tìm dự án…")).toBeVisible();
    await expect(page.getByText(/^\d+ dự án$/)).toBeVisible();
    await expect(page.getByText(/\bduAn\.|\bhome\.|\bcmdk\./)).toHaveCount(0);
  });

  test("detail page section titles + CMDK groups are translated", async ({ page }) => {
    await page.goto("/du-an/hong-hac-city");
    for (const heading of ["Vị trí & kết nối", "Tiện ích", "Dòng sản phẩm", "Kiến trúc & đối tác"]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Tìm kiếm" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Dự án", { exact: true })).toBeVisible();
    await expect(dialog.getByText("Trang", { exact: true })).toBeVisible();
    await expect(dialog.getByText("Hành động", { exact: true })).toBeVisible();
  });
});

test.describe("PDF export path — never a silent no-op", () => {
  test("detail 'Xuất PDF' button triggers print", async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error test-only global
      window.__printCalled = false;
      window.print = () => {
        // @ts-expect-error test-only global
        window.__printCalled = true;
      };
    });
    await page.goto("/du-an/hong-hac-city");
    // The "sources" accordion is open by default (defaultValue={["sources"]}) —
    // do not click the trigger, that would toggle it closed.
    const pdfButton = page.getByRole("button", { name: "Xuất PDF" });
    await pdfButton.scrollIntoViewIfNeeded();
    await pdfButton.click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __printCalled: boolean }).__printCalled))
      .toBe(true);
  });

  test("?export=pdf query param auto-triggers print on load", async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error test-only global
      window.__printCalled = false;
      window.print = () => {
        // @ts-expect-error test-only global
        window.__printCalled = true;
      };
    });
    await page.goto("/du-an/hong-hac-city?export=pdf");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __printCalled: boolean }).__printCalled))
      .toBe(true);
  });

  test("CMDK 'Xuất PDF' item navigates with export=pdf and triggers print", async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error test-only global
      window.__printCalled = false;
      window.print = () => {
        // @ts-expect-error test-only global
        window.__printCalled = true;
      };
    });
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const exportItem = page
      .getByRole("option")
      .filter({ hasText: "Xuất PDF" })
      .filter({ hasText: "Hồng Hạc City" });
    await expect(exportItem).toBeVisible();
    await exportItem.click();
    await expect(page).toHaveURL(/\/du-an\/hong-hac-city\?export=pdf/);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __printCalled: boolean }).__printCalled))
      .toBe(true);
  });
});
