# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Home Map → MapLibre pins (Option E / GIS lite)
# Packages: maplibre-gl · replace SVG lòng vòng · fitBounds BN–HCM · lazy import · i18n · e2e · MCP gate
# Primary workspace: Z:\Coding\260719-DE\v0
# Surface: **v0/ ONLY**
# Mode: IMPLEMENT + MCP-BROWSER-VERIFIED
# Structural parents (form ONLY):
#   ../prompts/CLAUDE_CODE_MULTI_AGENT_ORCHESTRATOR_MASTER_PROMPT.md
#   ../prompts/CLAUDE_CODE_ORCHESTRATOR_MASTER_PROMPT_V31_DD_REMAINDER_CODE_EXECUTION.md
# Decision source: founder chose Option E (MapLibre pins) over A/F/SVG
# Max repair loops / wave: 3
# Sub-agents: **6** (all must run)
# Target gate: Home “Bản đồ phân bố” = real OSM map + ≥2 region markers; SVG path gone; e2e + MCP PASS

---

## 0. How to use

You are Claude Code (or Cursor Agent with equivalent sub-agents). You MUST:

1. Read §1–§5; treat §6 agent ownership as exclusive.
2. Spawn **all 6** agents; Orchestrator merges, resolves conflicts, runs final gate.
3. **Hard requirement:** UI ACs need **MCP browser evidence** on `http://localhost:3000` (also spot-check `127.0.0.1:3000`). Scroll map section into view before asserting markers.
4. Do not regress: home H1–H10 (except H6 map implementation), `/du-an` filters, lightbox, CMDK, compare, phap-ly, lab.
5. Stop at §9 AC table + scorecard + smoke report path.

**Scope lock:**
```text
WRITE: v0/** (components/home, lib/home-content or lib/map, package.json, app/globals or map css import, e2e, lib/i18n, reports)
READ:  parent sa-ban repo ONLY for inspiration — DO NOT copy lot/GeoJSON/tile-gatekeeper
NO:    src/ Local app, Firebase, Mapbox token requirement, sa-ban full inventory,
       Algolia, /en (F8), Cloud Function PDF, Partner Marquee revive
```

Do not return only a plan.
Do not commit/push unless the human explicitly asks.

Dev server note: prefer `pnpm dev` (webpack) if Turbopack hangs on Windows — do not fight known crash loops.

---

## 1. Orchestrator identity

You are the **DED-PMH v0 MapLibre Home Map Orchestrator**.

Mission: Replace the dishonest SVG “lòng vòng” in `components/home/vn-map.tsx` with **MapLibre GL + OSM raster/vector style**, **one marker per region** (Bắc Ninh, TP.HCM), **fitBounds** so both pins visible, click → existing `/du-an?khu-vuc=…` behavior.

```text
DONE (do not rebuild):
  Region counts pipeline in app/page.tsx (cityCounts → regionCounts)
  citySlug / filter URL contract (bac-ninh, tp-hcm)
  List panel UX pattern (region name + count) — may keep beside map
  i18n t() scaffold; home.mapHeading exists

REPLACE (THIS PROMPT):
  H6 visual: SVG path + cx/cy abstract coords → MapLibre map + lng/lat
  REGION_COORDS cx/cy → REGION_LNG_LAT (real WGS84)
  Lazy-load maplibre so non-home routes do not pay full cost up front if feasible
```

**Out of scope (explicit):**
- Plot-level sa-ban (397 lots, yellow parcels) — that is https://www.bacninhhonghaccity.vn/sa-ban product, NOT this section
- Mapbox account/token as hard dependency (prefer **MapLibre + free OSM/DemoTiles style**; Mapbox only if already env-documented and optional)
- Embedding full SaBanInteractiveMap / tile-gatekeeper

---

## 2. Source documents / files

```text
v0/components/home/vn-map.tsx          # REPLACE implementation
v0/app/page.tsx                        # regionCounts wiring — keep contract
v0/lib/home-content.ts                 # REGION_COORDS → lat/lng
v0/lib/i18n/vi.json                    # map strings / a11y
v0/lib/motion/presets.ts               # stop using pulseMarker on fake SVG if removed
v0/package.json                        # add maplibre-gl (+ types if needed)
v0/e2e/home.spec.ts                    # extend or add map.spec
Previous prompts (do not re-open scope):
  v0/prompts/2026-07-20-02-55-claude-v0-final-remainder-99-mcp.md
```

---

## 3. Canonical locks

- Still **4 projects**; region aggregation unchanged (BN=1, HCM=3 typical)
- Heading may stay **“Bản đồ phân bố”** — now honest because basemap is real
- Click marker OR side list → `router.push(/du-an?${query})` with existing `khu-vuc` slugs
- `prefers-reduced-motion`: no infinite pulse spam; map still usable
- Mobile: map min-height usable (~240–320px); list stacks below or tabs — no tiny unusable canvas
- Attribution: show OSM / style attribution (MapLibre default ok)
- SSR: map is client-only; no `window` crash on RSC; dynamic `import()` with `ssr: false` pattern for Next App Router

Suggested coordinates (verify/adjust; must look correct on OSM):
```text
Bắc Ninh (Hồng Hạc area approx): 21.186°N, 106.076°E  (refine to project if known)
TP.HCM (PMH area approx):        10.729°N, 106.721°E  (refine to Phú Mỹ Hưng if known)
```
fitBounds padding ≥ 48px; maxZoom cap so two distant pins don’t overzoom emptily.

Runtime: `http://localhost:3000` · scroll to map section.

---

## 4. Why SVG must die (acceptance narrative)

Current `vn-map.tsx` draws a single cubic path + dots — users read “decorative squiggle”, not Vietnam. Option E fixes POV: real basemap + pins = heading truthful.

---

## 5. Non-negotiables

1. **Zero** remaining “coastline abstraction” path claiming to be VN map.
2. **maplibre-gl** in `package.json` dependencies; CSS imported once (component or layout scoped).
3. **Lazy**: home can load map after idle/intersection OR next/dynamic — document choice in smoke report.
4. Bundle: do not import maplibre from `layout.tsx` globally if avoidable.
5. Keep side region buttons (or equivalent) for a11y users who don’t use map chrome.
6. No sa-ban lot polygons on this home map.
7. pnpm install in `v0/`; lockfile updated.
8. TypeScript clean on touched files; eslint clean on touched files.

---

## 6. Sub-agents (6) — exclusive ownership

### Agent A — Deps & Map shell
- Add `maplibre-gl` (+ `@types/maplibre-gl` if required by TS setup)
- Create client map module e.g. `components/home/region-map-canvas.tsx` (or refactor `vn-map.tsx` split)
- Init MapLibre map, OSM-compatible style (document style URL used)
- fitBounds from region lng/lat list
- Cleanup `map.remove()` on unmount

### Agent B — Data & page contract
- Replace `REGION_COORDS` cx/cy with lng/lat in `lib/home-content.ts`
- Update `app/page.tsx` mapping if props shape changes
- Ensure `query` / `citySlug` unchanged for filters

### Agent C — UX chrome (list + markers + a11y)
- Markers for each region (native MapLibre Marker or layer — pick one, consistent)
- Popup or label: region name + “N dự án”
- Keep/rewrite list buttons; keyboard focusable
- Loading skeleton while map init; error state if WebGL fails (fallback: list-only + honest message)

### Agent D — i18n & motion cleanup
- Strings via `t()`: heading, loading, webgl fallback, marker aria
- Remove dead SVG motion deps from this section (pulse on fake path)
- Update `vi.json` keys as needed

### Agent E — E2E
- Spec: home loads; map section visible; ≥1 `.maplibregl-canvas` OR documented testid; click region control navigates to `/du-an` with `khu-vuc`
- Do not flake on tile network — assert UI chrome + navigation more than tile pixels
- Keep existing home specs green

### Agent F — MCP browser QA + smoke report
- Drive localhost:3000 → scroll to map
- Screenshot before/after mental check: NOT squiggle; IS osm-like basemap + 2 pins
- Write `v0/reports/2026-07-21-v0-maplibre-home-map-smoke.md` with AC table
- Note perf: approximate transfer / lazy behavior

Orchestrator merges A–F; fixes integration (props mismatch, CSS missing, double-init).

---

## 7. Implementation sketch (non-binding, agents may improve)

```text
VnMap (server-friendly wrapper)
  └─ dynamic(() => import RegionMapCanvas), ssr:false
       └─ maplibregl.Map + Marker[] + fitBounds
  └─ RegionList (buttons) always in DOM
```

Style suggestion (no Mapbox token):
- `https://demotiles.maplibre.org/style.json` for first green, OR a documented free OSM raster style that is license-OK
- If using raster OSM, follow tile usage policy; prefer a style already used in founder’s sa-ban stack **only as style URL**, not full sa-ban app copy

---

## 8. Repair loops

Max 3 loops if:
- Map blank / CSS missing
- Markers wrong hemisphere
- Hydration error
- e2e flake on tiles → weaken assertion to canvas/testid + nav

---

## 9. Acceptance criteria (all must PASS)

| ID | Criterion | Evidence |
|----|-----------|----------|
| AC1 | No SVG coastline path in home map section | code + screenshot |
| AC2 | MapLibre canvas visible in section | MCP screenshot |
| AC3 | ≥2 region markers (BN + HCM) | MCP |
| AC4 | fitBounds shows both pins without user zoom | MCP |
| AC5 | Click marker or list → `/du-an?khu-vuc=bac-ninh` or `tp-hcm` | MCP + e2e |
| AC6 | Mobile layout usable (map not 0-height) | MCP 375w |
| AC7 | Reduced-motion / WebGL fallback doesn’t white-screen | code + optional MCP |
| AC8 | `maplibre-gl` in package.json; not unused | package.json |
| AC9 | Lazy/dynamic — maplibre not required on every route bundle if avoidable | note in smoke |
| AC10 | e2e green for new/updated map specs | playwright |
| AC11 | Smoke report written under v0/reports/ | file |
| AC12 | No sa-ban lot layer / GeoJSON inventory on home | code review |

**Scorecard:** PASS if AC1–AC12 pass (AC7 may be CONDITIONAL if fallback is list-only with visible message).

---

## 10. Deliverables

```text
- Code implementing Option E in v0/
- pnpm-lock updated
- e2e updated
- v0/reports/2026-07-21-v0-maplibre-home-map-smoke.md
- Short orchestrator summary: style URL chosen, coords used, lazy strategy
```

---

## 11. Done when

Home map section is recognizably a **real map** with pins; founder no longer sees “hình lòng vòng”; filters still work; report + e2e filed.
```
