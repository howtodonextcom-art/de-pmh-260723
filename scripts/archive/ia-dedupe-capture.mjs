import { chromium } from "@playwright/test";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

await p.goto("http://localhost:3000/du-an", { waitUntil: "networkidle" });
await p.getByRole("link", { name: "So sánh dự án" }).waitFor();
await p.screenshot({ path: "reports/assets/ia-dedupe-du-an-after.png" });
const href = await p.getByRole("link", { name: "So sánh dự án" }).getAttribute("href");

await p.goto("http://localhost:3000/so-sanh", { waitUntil: "networkidle" });
await p.screenshot({ path: "reports/assets/ia-dedupe-so-sanh-after.png" });

await p.goto("http://localhost:3000/du-an?xem=bang", { waitUntil: "networkidle" });
const redirected = new URL(p.url()).pathname === "/so-sanh";
await p.screenshot({ path: "reports/assets/ia-dedupe-redirect-after.png" });

await p.setViewportSize({ width: 375, height: 812 });
await p.goto("http://localhost:3000/so-sanh", { waitUntil: "networkidle" });
await p.screenshot({ path: "reports/assets/ia-dedupe-so-sanh-375.png" });

console.log(JSON.stringify({ href, redirected, finalUrl: p.url() }, null, 2));
await b.close();
if (!redirected || href !== "/so-sanh") process.exit(1);
