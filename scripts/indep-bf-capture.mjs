/**
 * Lean browser-first capture (2026-07-24). Run BEFORE reading reports/*.md.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const LOCAL = "http://localhost:3000";
const PROD = "https://de-division-pmh.vercel.app";
const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });

const findings = { capturedAt: new Date().toISOString(), routes: {}, seo: {} };
const browser = await chromium.launch({ headless: true });

async function go(url, name, viewport = { width: 1440, height: 900 }, opts = {}) {
  const ctx = await browser.newContext({
    viewport,
    colorScheme: opts.dark ? "dark" : "light",
  });
  const page = await ctx.newPage();
  const cons = [];
  page.on("console", (m) => {
    const t = m.text();
    if (m.type() === "error" || /LCP|eager|priority/i.test(t)) cons.push(t);
  });
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(opts.wait ?? 1100);
  if (opts.map) {
    const h = page.getByRole("heading", { name: /Bản đồ phân bố/i });
    if ((await h.count()) > 0) {
      await h.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
    }
  }
  const file = `indep-bf-${name}.png`;
  await page.screenshot({ path: path.join(outDir, file) });
  const body = await page.locator("body").innerText();

  let cardHover = null;
  const card = page.locator('a[href^="/du-an/"]').filter({ has: page.locator("img") }).first();
  if ((await card.count()) > 0) {
    const before = await card.evaluate((el) => ({
      t: getComputedStyle(el).transform,
      s: getComputedStyle(el).boxShadow,
    }));
    await card.hover();
    await page.waitForTimeout(350);
    const after = await card.evaluate((el) => ({
      t: getComputedStyle(el).transform,
      s: getComputedStyle(el).boxShadow,
    }));
    cardHover = {
      transformChanged: before.t !== after.t,
      shadowChanged: before.s !== after.s,
      before,
      after,
    };
  }

  const row = {
    status: res?.status() ?? null,
    file,
    h1Font: await page
      .locator("h1")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily)
      .catch(() => null),
    footer: (await page.locator("footer").count()) > 0,
    radius: await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--radius").trim(),
    ),
    minh:
      (await page.locator("#minh-bach").count()) > 0 ||
      body.includes("Nguyên tắc minh bạch dữ liệu"),
    ctaTrans: body.includes("Cách chúng tôi xác minh dữ liệu"),
    mapCanvas: opts.map
      ? await page.getByTestId("region-map-canvas").isVisible().catch(() => false)
      : null,
    markers: opts.map ? await page.locator(".maplibregl-marker").count() : null,
    hh: opts.map
      ? await page.getByTestId("sa-ban-hh-cta").getAttribute("href").catch(() => null)
      : null,
    mapLoadingText: body.includes("Đang tải bản đồ"),
    cardHover,
    jump: url.includes("phap-ly") ? await page.locator('a[href^="#"]').count() : null,
    labBanner: url.includes("/lab") ? /nội bộ|thử nghiệm/i.test(body) : null,
    robotsMeta: await page.locator('meta[name="robots"]').getAttribute("content").catch(() => null),
    cons: cons.slice(0, 8),
  };
  findings.routes[name] = row;
  console.log(
    name,
    JSON.stringify({
      status: row.status,
      font: row.h1Font?.split(",")[0],
      footer: row.footer,
      markers: row.markers,
      hoverT: row.cardHover?.transformChanged,
      hoverS: row.cardHover?.shadowChanged,
      minh: row.minh,
    }),
  );
  await ctx.close();
}

await go(`${LOCAL}/`, "home", undefined, { wait: 1400, map: true });
await go(`${LOCAL}/`, "home-dark", undefined, { dark: true });
await go(`${LOCAL}/`, "home-375", { width: 375, height: 812 });
await go(`${LOCAL}/du-an`, "du-an");
await go(`${LOCAL}/du-an/hong-hac-city`, "detail", undefined, { wait: 1500 });
await go(`${LOCAL}/so-sanh`, "so-sanh");
await go(`${LOCAL}/so-sanh`, "so-sanh-375", { width: 375, height: 812 });
await go(`${LOCAL}/phap-ly`, "phap-ly");
await go(`${LOCAL}/phap-ly`, "phap-ly-375", { width: 375, height: 812 });
await go(`${LOCAL}/lab`, "lab");

{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const sm = await p.request.get(`${LOCAL}/sitemap.xml`);
  const rb = await p.request.get(`${LOCAL}/robots.txt`);
  const rbt = await rb.text();
  let prodRobots = null;
  try {
    const pr = await p.request.get(`${PROD}/robots.txt`);
    prodRobots = pr.status();
  } catch (e) {
    prodRobots = String(e);
  }
  findings.seo = {
    sitemap: sm.status(),
    robots: rb.status(),
    disallowLab: /Disallow:\s*\/lab/i.test(rbt),
    prodRobots,
  };
  await ctx.close();
}

await go(`${PROD}/`, "prod-home", undefined, { wait: 1800 });

fs.writeFileSync(path.join(outDir, "indep-bf-findings.json"), JSON.stringify(findings, null, 2));
console.log("SEO", findings.seo);
console.log("Wrote indep-bf-findings.json");
await browser.close();
