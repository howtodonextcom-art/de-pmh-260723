/**
 * ROUND 3 independent score gate evidence capture.
 * MCP Playwright unavailable in this env (chrome-for-testing installer is a no-op)
 * -> this is the documented fallback path. Captures 6 local routes + prod home,
 * local+prod robots/sitemap status, and every datapoint behind H1-H10 / 01-08.
 * Usage: node scripts/indep-r3-verify.mjs   (requires dev server on :3000)
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const LOCAL = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const PROD = process.env.PROD_BASE_URL || "https://de-division-pmh.vercel.app";
const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });

const F = { capturedAt: new Date().toISOString(), toolPath: "script (MCP=CONDITIONAL)", local: {}, prod: {}, seo: {}, checks: [] };
const check = (id, result, detail) => { F.checks.push({ id, result, detail }); console.log(JSON.stringify({ id, result, detail })); };

const browser = await chromium.launch({ headless: true });

async function probe(base, route, name, viewport = { width: 1440, height: 900 }, opts = {}) {
  const ctx = await browser.newContext({ viewport, colorScheme: opts.dark ? "dark" : "light" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
  let status = null;
  try {
    const res = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    status = res?.status() ?? null;
  } catch (e) {
    await ctx.close();
    return { name, route, status: null, error: String(e).slice(0, 200), consoleErrors: errs };
  }
  await page.waitForTimeout(opts.waitMs ?? 1400);
  if (opts.scrollMap) {
    const h = page.getByRole("heading", { name: /Bản đồ phân bố/i });
    if (await h.count()) { await h.scrollIntoViewIfNeeded(); await page.waitForTimeout(2600); }
  }
  await page.screenshot({ path: path.join(outDir, `indep-r3-${name}.png`), fullPage: !!opts.fullPage });
  const body = (await page.locator("body").innerText().catch(() => "")) || "";
  const entry = {
    name, route, base, status,
    screenshot: `indep-r3-${name}.png`,
    h1Text: await page.getByRole("heading", { level: 1 }).first().innerText().catch(() => null),
    h1Font: await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily).catch(() => null),
    bodyFont: await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily).catch(() => null),
    hasFooter: (await page.locator("footer").count()) > 0,
    footerSample: await page.locator("footer").first().innerText().catch(() => null),
    hasMinhBach: (await page.locator("#minh-bach").count()) > 0 || body.includes("Nguyên tắc minh bạch dữ liệu"),
    hasOldCta: body.includes("Cách chúng tôi xác minh dữ liệu"),
    robotsMeta: await page.locator('meta[name="robots"]').getAttribute("content").catch(() => null),
    radiusSample: await page.locator("body").evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--radius").trim()).catch(() => null),
    docScrollW: await page.evaluate(() => document.documentElement.scrollWidth).catch(() => null),
    docClientW: await page.evaluate(() => document.documentElement.clientWidth).catch(() => null),
    consoleErrors: errs,
  };
  if (route.includes("phap-ly")) {
    entry.jumpNavCount = await page.locator('nav a[href^="#"]').count();
    entry.cardCount = await page.locator("main section[id]").count();
    entry.hasIntro = (await page.getByText(/7 nhóm hồ sơ pháp lý cho từng dự án/).count()) > 0;
    entry.sectionH2Font = await page.locator("main section h2").first().evaluate((el) => getComputedStyle(el).fontFamily).catch(() => null);
  }
  if (opts.scrollMap) {
    entry.mapCanvas = await page.getByTestId("region-map-canvas").isVisible().catch(() => false);
    entry.mapMarkers = await page.locator(".maplibregl-marker").count();
    entry.mapStageH = (await page.getByTestId("region-map-stage").boundingBox().catch(() => null))?.height ?? null;
    entry.hhCta = await page.getByTestId("sa-ban-hh-cta").getAttribute("href").catch(() => null);
  }
  if (route === "/lab") entry.hasLabBanner = body.includes("Khu vực thử nghiệm nội bộ");
  await ctx.close();
  return entry;
}

// --- LOCAL: 6 routes ---
F.local.home = await probe(LOCAL, "/", "local-home-1440", { width: 1440, height: 900 }, { waitMs: 1600, scrollMap: true });
F.local.duAn = await probe(LOCAL, "/du-an", "local-du-an-1440");
F.local.detail = await probe(LOCAL, "/du-an/hong-hac-city", "local-detail-1440", { width: 1440, height: 900 }, { waitMs: 1800 });
F.local.soSanh = await probe(LOCAL, "/so-sanh", "local-so-sanh-1440");
F.local.phapLy = await probe(LOCAL, "/phap-ly", "local-phap-ly-1440");
F.local.lab = await probe(LOCAL, "/lab", "local-lab-1440");
F.local.homeMobile = await probe(LOCAL, "/", "local-home-375", { width: 375, height: 812 });
F.local.phapLyMobile = await probe(LOCAL, "/phap-ly", "local-phap-ly-375", { width: 375, height: 812 });
F.local.homeDark = await probe(LOCAL, "/", "local-home-dark-1440", { width: 1440, height: 900 }, { dark: true });

// --- SEO local + prod ---
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const lsm = await page.request.get(`${LOCAL}/sitemap.xml`);
  const lrb = await page.request.get(`${LOCAL}/robots.txt`);
  const lrbText = await lrb.text();
  F.seo.local = { sitemapStatus: lsm.status(), robotsStatus: lrb.status(), robotsDisallowLab: /Disallow:\s*\/lab/i.test(lrbText), robotsText: lrbText.slice(0, 300), sitemapHasDetail: /du-an\/hong-hac-city/.test(await lsm.text()) };
  try {
    const psm = await page.request.get(`${PROD}/sitemap.xml`, { timeout: 30000 });
    const prb = await page.request.get(`${PROD}/robots.txt`, { timeout: 30000 });
    F.seo.prod = { sitemapStatus: psm.status(), robotsStatus: prb.status() };
  } catch (e) { F.seo.prod = { error: String(e).slice(0, 150) }; }
  await ctx.close();
}

// --- PROD home ---
F.prod.home = await probe(PROD, "/", "prod-home-1440", { width: 1440, height: 900 }, { waitMs: 2200 });

// --- CHECKS ---
const publicRoutes = [F.local.home, F.local.duAn, F.local.detail, F.local.soSanh, F.local.phapLy];
check("H1-FRAUNCES-PUBLIC", publicRoutes.every((r) => /Fraunces/i.test(r.h1Font || "")) ? "PASS" : "FAIL",
  Object.fromEntries([...publicRoutes, F.local.lab].map((r) => [r.name, r.h1Font])));
check("H1b-LAB-EXCEPTION", /Fraunces/i.test(F.local.lab.h1Font || "") ? "PASS" : "CONDITIONAL(lab=Inter)", { labH1Font: F.local.lab.h1Font });
check("H2-FOOTER", [...publicRoutes, F.local.lab].every((r) => r.hasFooter) ? "PASS" : "FAIL",
  Object.fromEntries([...publicRoutes, F.local.lab].map((r) => [r.name, r.hasFooter])));
check("H3-PHAPLY", F.local.phapLy.hasIntro && F.local.phapLy.jumpNavCount >= 4 && F.local.phapLy.cardCount >= 4 ? "PASS" : "FAIL",
  { intro: F.local.phapLy.hasIntro, jump: F.local.phapLy.jumpNavCount, cards: F.local.phapLy.cardCount, h2Font: F.local.phapLy.sectionH2Font });
check("H3b-PHAPLY-MOBILE", (F.local.phapLyMobile.docScrollW ?? 0) <= (F.local.phapLyMobile.docClientW ?? 0) + 2 ? "PASS" : "FAIL",
  { scrollW: F.local.phapLyMobile.docScrollW, clientW: F.local.phapLyMobile.docClientW });
check("H4-NO-MINHBACH-LOCAL", !F.local.home.hasMinhBach && !F.local.home.hasOldCta ? "PASS" : "FAIL",
  { minhBach: F.local.home.hasMinhBach, oldCta: F.local.home.hasOldCta });
check("H5-SEO-LOCAL", F.seo.local.sitemapStatus === 200 && F.seo.local.robotsStatus === 200 && F.seo.local.robotsDisallowLab ? "PASS" : "FAIL", F.seo.local);
check("H6-LAB", F.local.lab.hasLabBanner && /noindex/i.test(F.local.lab.robotsMeta || "") ? "PASS" : "FAIL",
  { banner: F.local.lab.hasLabBanner, robotsMeta: F.local.lab.robotsMeta });
check("H9-MAP", F.local.home.mapCanvas && (F.local.home.mapMarkers ?? 0) >= 2 && /utm_source=ded-pmh/.test(F.local.home.hhCta || "") ? "PASS" : "FAIL",
  { canvas: F.local.home.mapCanvas, markers: F.local.home.mapMarkers, stageH: F.local.home.mapStageH, cta: F.local.home.hhCta });
check("RADIUS-FIX-HOLDS", F.local.home.radiusSample === "0.5rem" ? "PASS" : "CHECK", { radius: F.local.home.radiusSample });
check("S1-PROD-PARITY",
  /Fraunces/i.test(F.prod.home.h1Font || "") && F.prod.home.hasFooter && !F.prod.home.hasMinhBach ? "PASS" : "FAIL",
  { prodStatus: F.prod.home.status, prodH1Font: F.prod.home.h1Font, prodFooter: F.prod.home.hasFooter,
    prodMinhBach: F.prod.home.hasMinhBach, prodOldCta: F.prod.home.hasOldCta, prodRobots: F.seo.prod });

fs.writeFileSync(path.join(outDir, "indep-r3-findings.json"), JSON.stringify(F, null, 2));
console.log("\nWrote reports/assets/indep-r3-findings.json");
await browser.close();
process.exit(0);
