/**
 * Re-score evidence for the 2026-07-23 score-lift wave.
 * Usage: node scripts/indep-scorelift-capture.mjs  (requires pnpm dev on :3000)
 * Captures the surfaces changed this wave: display font (home/detail hero),
 * /phap-ly hierarchy redesign, footer, dark mode.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });

const findings = { base: BASE, capturedAt: new Date().toISOString(), routes: {}, consoleErrors: [] };
const browser = await chromium.launch({ headless: true });

async function visit(route, viewport, name, opts = {}) {
  const context = await browser.newContext({ viewport, colorScheme: opts.dark ? "dark" : "light" });
  const page = await context.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(opts.waitMs ?? 1200);
  if (opts.scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), opts.scrollTo);
    await page.waitForTimeout(600);
  }
  const file = path.join(outDir, `score-lift-${name}.png`);
  await page.screenshot({ path: file, fullPage: !!opts.fullPage });
  findings.routes[name] = {
    route,
    viewport,
    dark: !!opts.dark,
    status: res?.status() ?? null,
    screenshot: path.basename(file),
    hasFooter: (await page.locator("footer").count()) > 0,
    h1FontFamily: await page
      .locator("h1")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily)
      .catch(() => null),
    consoleErrors: errs,
  };
  findings.consoleErrors.push(...errs.map((t) => ({ name, t })));
  await context.close();
}

await visit("/", { width: 1440, height: 900 }, "home-desktop-1440", { waitMs: 1500 });
await visit("/", { width: 1440, height: 900 }, "home-footer", { waitMs: 1500, fullPage: true });
await visit("/", { width: 1440, height: 900 }, "home-dark-1440", { dark: true, waitMs: 1500 });
await visit("/", { width: 375, height: 812 }, "home-mobile-375", { waitMs: 1500 });
await visit("/phap-ly", { width: 1440, height: 900 }, "phap-ly-desktop-1440", { waitMs: 1200 });
await visit("/phap-ly", { width: 375, height: 812 }, "phap-ly-mobile-375", { waitMs: 1200 });
await visit("/du-an/hong-hac-city", { width: 1440, height: 900 }, "detail-hh-desktop-1440", { waitMs: 1800 });

const jsonPath = path.join(outDir, "score-lift-findings.json");
fs.writeFileSync(jsonPath, JSON.stringify(findings, null, 2));
console.log("Wrote", jsonPath);
console.log("Console errors:", JSON.stringify(findings.consoleErrors));
console.log("H1 font families:", Object.fromEntries(Object.entries(findings.routes).map(([k, v]) => [k, v.h1FontFamily])));
console.log("Footer present:", Object.fromEntries(Object.entries(findings.routes).map(([k, v]) => [k, v.hasFooter])));

await browser.close();
