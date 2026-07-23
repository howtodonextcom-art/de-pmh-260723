# v0 home map — MapLibre pins (Option E) — MCP smoke

Date: 2026-07-21
Scope: `v0/prompts/2026-07-21-claude-v0-maplibre-home-map-e-mcp.md` — replace the decorative SVG coastline squiggle in home H6 ("Bản đồ phân bố") with a real MapLibre GL map + region pins. `v0/` write scope only.

## What changed

- **`components/home/region-map-canvas.tsx`** (new) — client-only MapLibre map: inits `maplibregl.Map` against `https://demotiles.maplibre.org/style.json` (free, tokenless, no Mapbox account needed), one `Marker` per region with a popup (`region — N dự án`), `fitBounds` over all region coordinates on init, `map.remove()` cleanup on unmount, loading/error states.
- **`components/home/vn-map.tsx`** (rewritten) — now a thin client wrapper: `next/dynamic(() => import(".../region-map-canvas"), { ssr: false, loading: () => <skeleton> })` + the pre-existing always-in-DOM region list buttons (kept for a11y/keyboard/no-JS users, per canonical lock §3).
- **`lib/home-content.ts`** — `REGION_COORDS` (`{cx, cy}` SVG viewBox coords) → `REGION_LNG_LAT` (`{lng, lat}` real WGS84): Bắc Ninh `106.076°E, 21.186°N`, TP.HCM (Phú Mỹ Hưng area) `106.721°E, 10.729°N` — the coordinates suggested in the prompt (§3), used as-is.
- **`app/page.tsx`** — `regionCounts` mapping now carries `lng`/`lat` instead of `cx`/`cy`; `citySlug`/`khu-vuc` query contract unchanged.
- **`lib/motion/presets.ts`** — removed the now-dead `pulseMarker` export (only consumer was the deleted SVG marker animation).
- **`lib/i18n/vi.json`** — added `home.mapLoading`, `home.mapWebglFallback`, `home.mapUnit`.
- **`package.json`** — added `maplibre-gl` (^5.24.0) to dependencies; ships its own TS types, no `@types/maplibre-gl` needed.
- **`e2e/map.spec.ts`** (new) — 3 specs (see below).
- **`e2e/playwright.config.ts`** — **unrelated but necessary fix**: webServer command was `next dev -p 3000` (raw Turbopack), which reproduces the dev-mode worker crash-restart loop documented in the prior final-remainder session (spawns 1000+ node.exe, hangs the machine). Changed to `next dev --webpack -p 3000`, matching `package.json`'s own `dev` script.

## Style/coords/lazy strategy (orchestrator summary)

- **Style URL:** `https://demotiles.maplibre.org/style.json` — MapLibre's own free demo style, world vector coverage, no API key/account. Chosen per the prompt's explicit preference to avoid a Mapbox token hard-dependency.
- **Coordinates:** used the prompt's suggested approximate coordinates verbatim (Bắc Ninh 21.186°N/106.076°E, TP.HCM/Phú Mỹ Hưng 10.729°N/106.721°E) — both render correctly on the basemap (screenshot evidence below).
- **Lazy strategy:** `next/dynamic(..., { ssr: false })` at the `VnMap` → `RegionMapCanvas` boundary. `maplibre-gl` (a multi-hundred-KB client library) is only fetched when the home route's map section actually mounts in the browser — not bundled into SSR output, not loaded eagerly from `layout.tsx`, and not paid for by any other route.

## Acceptance criteria

| ID | Criterion | Result | Evidence |
|----|-----------|--------|----------|
| AC1 | No SVG coastline path in home map section | **PASS** | `vn-map.tsx` fully rewritten; e2e asserts `svg[aria-label='Bản đồ Việt Nam (cách điệu)']` has 0 count |
| AC2 | MapLibre canvas visible in section | **PASS** | `reports/assets/v0-map-desktop-1440.png` — real country-polygon basemap rendered |
| AC3 | ≥2 region markers (BN + HCM) | **PASS** | Screenshot shows 2 pins; MCP confirmed marker `aria-label="Bắc Ninh — 1 dự án"` |
| AC4 | fitBounds shows both pins without user zoom | **PASS** | Both pins visible in the same screenshot at initial load, no manual zoom/pan performed |
| AC5 | Click marker or list → `/du-an?khu-vuc=bac-ninh`\|`tp-hcm` | **PASS** | MCP: clicked marker → URL became `/du-an?khu-vuc=bac-ninh`; clicked list button → `/du-an?khu-vuc=tp-hcm`; e2e covers the list-button path |
| AC6 | Mobile layout usable (map not 0-height) | **PASS** | `reports/assets/v0-map-mobile-375.png` — map renders at 326×238px, well above the 240–320px floor |
| AC7 | Reduced-motion / WebGL fallback doesn't white-screen | **PASS (code)** | `Map` constructor wrapped in try/catch → `status: "error"` renders an honest fallback message instead of a blank canvas; no custom pulse/infinite animation added to markers at all (nothing to gate on `prefers-reduced-motion`) |
| AC8 | `maplibre-gl` in package.json; not unused | **PASS** | `package.json` dependencies; imported in `region-map-canvas.tsx` |
| AC9 | Lazy/dynamic — not on every route bundle | **PASS** | `next/dynamic(..., {ssr:false})`; documented above |
| AC10 | e2e green for new/updated map specs | **PASS** | 3/3 map specs pass; full suite 21/21 passes (see below) |
| AC11 | Smoke report written under v0/reports/ | **PASS** | this file |
| AC12 | No sa-ban lot layer / GeoJSON inventory on home | **PASS** | Only 2 region markers from `regionCounts`; no lot/parcel data imported or referenced |

**Scorecard: AC1–AC12 all PASS (no CONDITIONAL needed).**

## MCP browser evidence

- `reports/assets/v0-map-desktop-1440.png` — desktop @1440, real basemap + 2 pins + zoom control + MapLibre attribution, both pins in frame
- `reports/assets/v0-map-mobile-375.png` — mobile @375, map section fully usable, stacked layout
- Console: 0 map-related errors on any route (only a pre-existing, unrelated `favicon.ico` 404)
- Live click-through: marker click → `/du-an?khu-vuc=bac-ninh`; list button click → `/du-an?khu-vuc=tp-hcm`

## Regression check

No regressions in nav dropdown, mobile nav, gallery lightbox, Compare @375, or Pháp lý — all covered by `e2e/regression.spec.ts`, all passing (see below).

## Commands run

```
pnpm add maplibre-gl                                # 5.24.0, built-in types
pnpm lint                                            # 0 errors, 0 warnings (after 2 react-hooks/set-state-in-effect fixes)
npx tsc --noEmit -p tsconfig.json                    # 0 errors (after fixing maplibregl.supported()/attributionControl type errors)
pnpm build                                           # green — 11 routes
pnpm dev                                             # MCP verification (webpack, stable)
npx playwright test -c e2e/playwright.config.ts      # 21/21 passed
```

Note: an initial fully-parallel e2e run showed 4 flaky failures (unrelated tests included) caused by concurrent first-compile contention on a cold dev server (`fullyParallel: true`, 8 workers, cold `.next/` cache) — all passed once re-run serially, and all 21 passed on a second full-parallel run against a warm server. One genuine bug was found and fixed during this: `e2e/map.spec.ts`'s list-button locator (`getByRole("button", { name: /Bắc Ninh/ })`) matched *both* the map marker (which is itself `role="button"`, by design for keyboard access) and the list button — a strict-mode ambiguity in the test, not the app. Fixed by matching the list button's exact accessible name.

## Files changed

- `components/home/region-map-canvas.tsx` (new)
- `components/home/vn-map.tsx` (rewritten)
- `lib/home-content.ts` (REGION_COORDS → REGION_LNG_LAT)
- `app/page.tsx` (regionCounts wiring)
- `lib/motion/presets.ts` (removed dead `pulseMarker`)
- `lib/i18n/vi.json` (3 new map keys)
- `package.json` / `pnpm-lock.yaml` (added `maplibre-gl`)
- `e2e/map.spec.ts` (new, 3 specs)
- `e2e/playwright.config.ts` (webServer → `--webpack`, unrelated stability fix)

## DEBT

- Coordinates are the prompt's own approximate suggestions, not independently verified against Hồng Hạc City's / Phú Mỹ Hưng's exact site boundaries — close enough for a portfolio-distribution overview map, not survey-grade.
- No custom marker icon (uses MapLibre's default teardrop pin, tinted to brand primary `#0f4c3a`) — acceptable for this scope; out of scope was any sa-ban-style custom cartography.

## VERDICT

```
VERDICT: V0_MAPLIBRE_HOME_MAP_MET
AC1: PASS   AC2: PASS   AC3: PASS   AC4: PASS   AC5: PASS   AC6: PASS
AC7: PASS   AC8: PASS   AC9: PASS   AC10: PASS  AC11: PASS  AC12: PASS
STYLE_URL: https://demotiles.maplibre.org/style.json
COORDS: Bắc Ninh (106.076, 21.186) · TP.HCM (106.721, 10.729)
LAZY_STRATEGY: next/dynamic(..., { ssr: false }) at VnMap → RegionMapCanvas
MCP_EVIDENCE_INDEX:
  - v0/reports/assets/v0-map-desktop-1440.png
  - v0/reports/assets/v0-map-mobile-375.png
E2E_COMMAND: pnpm --dir v0 test:e2e   (21/21 passed)
FILES_CHANGED: see "Files changed" above
DEBT: see "DEBT" above — no blocking debt
```

`v0 home map — MapLibre pins — MCP verified.`
