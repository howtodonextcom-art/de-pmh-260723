import { test, expect } from "@playwright/test";

/**
 * R08 — PDF Function bridge honesty. With NEXT_PUBLIC_PDF_FUNCTION_URL
 * unset (the default/CI state — no env var is set in playwright.config.ts's
 * webServer), exportFactSheetPdf() must take the print-CSS fallback path
 * only: no network fetch, no silent no-op, no fake "PDF ready" toast. See
 * v0/docs/PDF_EXPORT.md.
 */

test.describe("PDF export — env-unset honesty", () => {
  test("no fetch to a PDF function is attempted; only window.print() fires", async ({ page }) => {
    const pdfFunctionRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("slug=")) pdfFunctionRequests.push(req.url());
    });

    await page.addInitScript(() => {
      // @ts-expect-error test-only global
      window.__printCalled = false;
      window.print = () => {
        // @ts-expect-error test-only global
        window.__printCalled = true;
      };
    });

    await page.goto("/du-an/hong-hac-city");
    const pdfButton = page.getByRole("button", { name: "Xuất PDF" });
    await pdfButton.scrollIntoViewIfNeeded();
    await pdfButton.click();

    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __printCalled: boolean }).__printCalled))
      .toBe(true);

    expect(pdfFunctionRequests).toHaveLength(0);
  });

  test("print-mode toast is the honest print message, not a function-success claim", async ({ page }) => {
    await page.goto("/du-an/hong-hac-city");
    const pdfButton = page.getByRole("button", { name: "Xuất PDF" });
    await pdfButton.scrollIntoViewIfNeeded();

    // window.print not stubbed here — real print() opens a native dialog in
    // some browsers, so only assert the toast text appears before any dialog.
    await page.evaluate(() => {
      window.print = () => {};
    });
    await pdfButton.click();

    await expect(page.getByText(/Đang mở chế độ in/)).toBeVisible();
    await expect(page.getByText(/Đang yêu cầu file PDF/)).toHaveCount(0);
  });
});
