# Independent QA — MapLibre Home Map Wave-1 (pre Wave-2 polish)

Date: 2026-07-21  
Scope: read-only review before Wave-2 height / choropleth / HH CTA  
Runtime: `http://localhost:3000` (HTTP 200, HTML ~108KB includes map section strings)  
Code: `components/home/region-map-canvas.tsx`, `vn-map.tsx`, `lib/home-content.ts`, `e2e/map.spec.ts`, Wave-1 smoke report

## Scorecard

| ID | Check | Result | Evidence |
|----|-------|--------|----------|
| Q1 | MapLibre canvas; not SVG path | **PASS** | `data-testid="region-map-canvas"`; no decorative VN SVG; founder screenshot shows MapLibre demotiles + attribution |
| Q2 | 2 pins BN + HCM after fitBounds | **PASS** | Screenshot: north + south teal markers; coords `REGION_LNG_LAT` WGS84 |
| Q3 | List → `/du-an?khu-vuc=` | **PASS** | Code + e2e `map.spec.ts` asserts `bac-ninh` |
| Q4 | Marker click navigates | **PASS** | Marker `click` → `onSelectRegion(query)` |
| Q5 | Mobile 375 usable height | **PARTIAL** | e2e requires `>200px`; container only `h-60`/`sm:h-80` — usable but feels small vs viewport |
| Q6 | Console map errors | **PASS** (Wave-1 claim; HTTP probe clean this pass) | |
| Q7 | demotiles = country colors only | **CONFIRMED LIMITATION** | VN one blue blob; **no province differentiation** |
| Q8 | Section height vs viewport | **FAIL vs premium bar** | Map stage ≪ 100dvh; taller section request is valid |
| Q9 | Wave-1 smoke vs reality | **CONFIRM** | Option E core holds; polish gaps = height + province color |
| Q10 | e2e map specs exist | **PASS** | `e2e/map.spec.ts` — 3 tests |

## Verdict

- **Wave-1 Option E: ACCEPTED** — proceed to Wave-2 polish.
- **Must fix in Wave-2:** map stage height (Q8), region visual emphasis (Q7), R03 HH CTA.

---

## Second pass — independent QA of the drafted Wave-2 polish (before this session's fixes)

Date: 2026-07-21 (same day, later). By the time this session picked up the prompt, height/overlay-layer/CTA code had already been drafted (outside this session) addressing the gaps above. This pass audits *that draft*, read-only, per §2's instruction to review before implementing further.

### Static code audit

```
pnpm lint                          → 0 errors, 0 warnings
npx tsc --noEmit -p tsconfig.json  → 2 errors:
  region-map-canvas.tsx(101,9): attributionControl: true not assignable to
    'false | AttributionControlOptions | undefined'
  region-map-canvas.tsx(104,7): Cannot find name 'voidMicrotask'
```

`voidMicrotask` is not a real global (Wave-1's working code used `queueMicrotask`) — a **real runtime bug**: if `new maplibregl.Map(...)` throws synchronously (e.g. no WebGL), the catch block throws a second, uncaught `ReferenceError` instead of setting the honest error state.

`public/geo/portfolio-regions.geojson` + `ATTRIBUTION.md` do exist, correctly scoped (two hand-simplified rectangular AOIs for Bắc Ninh / TP.HCM, explicitly labeled non-official/non-cadastral).

### Re-run of Q1–Q10 against the drafted polish

| ID | Check | Result |
|----|-------|--------|
| Q1 | Canvas, not SVG | **PASS** (unchanged) |
| Q2 | 2 pins visible after fitBounds | **PASS** — `reports/assets/v0-wave2-qa-desktop-1440.png` |
| Q3 | List click → `/du-an?khu-vuc=…` | **PASS** |
| Q4 | Marker click navigates | **PASS** |
| Q5 | Mobile 375 height | **now PASS, no longer PARTIAL** — measured 568px = exactly 70vh of 812px |
| Q6 | Console map errors | **PASS** — only pre-existing unrelated `favicon.ico` 404 |
| Q7 | demotiles = country-colored toy style | confirmed limitation, unchanged — see Finding 3 below for whether the *fix* actually works |
| Q8 | Section height vs viewport | **now PASS, no longer FAIL** — desktop stage measured 900px on a 900px viewport (exact 100dvh); mobile 568px on 812px (exact 70vh) |
| Q9 | Wave-1 claims vs reality | CONFIRM, unchanged |
| Q10 | e2e map specs | `e2e/map.spec.ts` grew from 3 → **4** specs (added HH CTA test); not yet re-run this pass |

**Q1–Q4 still PASS → implement (fixes) authorized.**

### New findings (this draft introduced regressions/gaps)

**Finding 1 — `voidMicrotask` ReferenceError.** See static audit. Low-frequency (only the Map-constructor-throws path) but genuine.

**Finding 2 — `attributionControl: true` type error.** Wrong type; attribution is on by default when the option is simply omitted, so the line is unnecessary.

**Finding 3 — Province/region emphasis overlay does not actually render (P2 not met despite the code existing).** `addRegionEmphasisLayers()` (pin-halo circle + GeoJSON fill/outline layers) runs inside `map.on("load", ...)` wrapped in a try/catch that swallows all errors with **zero logging**:
```ts
try { addRegionEmphasisLayers(map, regions); } catch { /* no log, no rethrow */ }
```
Zoomed directly into the Bắc Ninh pin's exact coordinates (double-click-zoom ×5, centered on the marker) — `reports/assets/v0-wave2-qa-zoomed-no-overlay.png` shows **no teal fill, no halo**, only the marker's own CSS drop-shadow. AC3 ("Bắc Ninh + TP.HCM visually distinct... overlay OR halo fallback") is **not actually met**, and the silent catch means this would keep failing invisibly in production. Needs live debugging (temporarily un-swallow the exception) in the implement phase.

**Finding 4 — scrollZoom / page-scroll passthrough inconclusive via MCP.** `scrollZoom: false` is set (structurally correct, trusted), but a synthetic `WheelEvent` via raw `dispatchEvent()` in this session produced an unrelated side effect (not real browser hit-testing) — recommend a proper `page.mouse.wheel()`-based e2e assertion instead of trusting this attempt.

### Verdict (second pass)

```
Q1-Q6, Q9: PASS/CONFIRM as before or improved (Q5, Q8 upgraded from PARTIAL/FAIL to PASS)
Q7: confirmed limitation (expected — this is why Finding 3's overlay exists)
Q10: 4 specs present, not yet re-run
BLOCKING FOR IMPLEMENT: Finding 1, Finding 2, Finding 3 (overlay silently not rendering)
NON-BLOCKING: Finding 4 (needs cleaner e2e re-check)
```

Proceeding to implement: fix Findings 1–4, MCP re-verify, full e2e run, Wave-2 polish smoke report.
