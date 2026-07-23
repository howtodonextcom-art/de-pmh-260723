import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });
const findings = [];
const log = (id, result, detail) => {
  findings.push({ id, result, detail });
  console.log(JSON.stringify({ id, result, detail }));
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push("PAGEERROR: " + err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.getByRole("heading", { name: "Bản đồ phân bố" }).scrollIntoViewIfNeeded();
await page.waitForTimeout(3000);

const canvas = page.getByTestId("region-map-canvas");
const stage = page.getByTestId("region-map-stage");
await canvas.waitFor({ state: "visible", timeout: 20000 });

const svgCount = await page.locator('svg[aria-label="Bản đồ Việt Nam (cách điệu)"]').count();
log("Q1", svgCount === 0 && (await canvas.isVisible()) ? "PASS" : "FAIL", {
  svgCount,
  canvasVisible: await canvas.isVisible(),
});

const markerCount = await page.locator(".maplibregl-marker").count();
log("Q2", markerCount >= 2 ? "PASS" : "FAIL", { markerCount });

const desktopStage = await stage.boundingBox();
log("AC1-desktop", (desktopStage?.height ?? 0) >= 850 ? "PASS" : "FAIL", desktopStage);

await page.screenshot({ path: path.join(outDir, "v0-wave2-indep-review-desktop.png"), fullPage: false });
await stage.screenshot({ path: path.join(outDir, "v0-wave2-indep-review-map-only.png") });

const layerProbe = await page.evaluate(() => ({
  hasMaplibreCanvas: !!document.querySelector(".maplibregl-canvas"),
  hasCtrl: !!document.querySelector(".maplibregl-ctrl-zoom-in"),
  attribution: document.querySelector(".maplibregl-ctrl-attrib")?.textContent ?? null,
}));
log("MAP-CHROME", layerProbe.hasMaplibreCanvas && layerProbe.hasCtrl ? "PASS" : "FAIL", layerProbe);

const geo = await page.evaluate(async () => {
  const r = await fetch("/geo/portfolio-regions.geojson");
  const j = await r.json();
  return { ok: r.ok, features: j.features?.length, ids: j.features?.map((f) => f.properties?.id) };
});
log("GEOJSON", geo.ok && geo.features === 2 ? "PASS" : "FAIL", geo);

const cta = page.getByTestId("sa-ban-hh-cta");
const href = await cta.getAttribute("href");
log(
  "AC4",
  href?.includes("utm_source=ded-pmh") && href.includes("sa-ban") ? "PASS" : "FAIL",
  { href },
);

await page.getByRole("button", { name: "Bắc Ninh 1 dự án" }).click();
await page.waitForURL(/khu-vuc=bac-ninh/, { timeout: 15000 });
log("Q3", page.url().includes("khu-vuc=bac-ninh") ? "PASS" : "FAIL", { url: page.url() });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await stage.waitFor({ state: "visible", timeout: 20000 });
await page.waitForTimeout(2500);
const before = await page.evaluate(() => window.scrollY);
const box = await stage.boundingBox();
if (!box) throw new Error("no stage box");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(300);
const after = await page.evaluate(() => window.scrollY);
log("AC2-scrollZoom", after > before ? "PASS" : "FAIL", { before, after });

const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
await mobile.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await mobile.getByTestId("region-map-stage").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(2500);
const mBox = await mobile.getByTestId("region-map-stage").boundingBox();
log("AC1-mobile", (mBox?.height ?? 0) >= 500 ? "PASS" : "FAIL", mBox);
await mobile.screenshot({ path: path.join(outDir, "v0-wave2-indep-review-mobile.png") });
await mobile.close();

const mapErrors = consoleErrors.filter((e) =>
  /maplibre|WebGL|voidMicrotask|queueMicrotask|ReferenceError/i.test(e),
);
log("AC8-console", mapErrors.length === 0 ? "PASS" : "FAIL", {
  mapErrors,
  allErrors: consoleErrors.slice(0, 12),
});

fs.writeFileSync(path.join(outDir, "v0-wave2-indep-review-findings.json"), JSON.stringify(findings, null, 2));
await browser.close();
console.log("DONE");
