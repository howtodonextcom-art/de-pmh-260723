import { test, expect } from "@playwright/test";

test.describe("PDF export — env-unset honesty", () => {
  test("no fetch to a PDF function is attempted when a project exists", async ({ page }) => {
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

    expect(pdfFunctionRequests).toHaveLength(0);
  });
});
