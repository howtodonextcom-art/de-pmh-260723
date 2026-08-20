import { defineConfig, devices } from "@playwright/test";

/**
 * v0 (Track A) home + regression suite — self-contained, no auth/backend
 * required (falls back to committed seed JSON via getCatalogFromLibrary()).
 * Distinct from the repo-root `e2e/` suite: this one lives inside v0/ per
 * this prompt's scope lock and focuses on the H1-H10 home rebuild plus a
 * quick regression pass over the surfaces the rebuild could have disturbed.
 */
export default defineConfig({
  testDir: ".",
  testMatch: ["*.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // channel: "chrome" — the bundled headless_shell binary reliably fails to
  // download on this machine's network (see reports/2026-08-19-luxury-full-audit.md
  // Appendix "Tooling note"); reuse the same installed-Chrome workaround
  // scripts/luxury/capture.mjs already relies on via PW_CHANNEL.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL || "chrome" },
    },
  ],
  webServer: {
    // --webpack: Turbopack's dev-mode worker crash-restart loop is unusable
    // on this machine (spawns 1000+ node.exe processes within seconds and
    // hangs the system) — see v0/package.json's "dev" script for the same fix.
    command: "next dev --webpack -p 3000",
    cwd: "..",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
