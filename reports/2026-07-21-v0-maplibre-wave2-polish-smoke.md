# Wave-2 polish smoke — MapLibre home map (height · region emphasis · HH CTA)

Date: 2026-07-21
Prompt: `v0/prompts/2026-07-21-claude-v0-maplibre-wave2-qa-height-choropleth-mcp.md`
QA first: `v0/reports/2026-07-21-v0-maplibre-wave2-independent-qa.md` (Wave-1 **ACCEPTED**; second-pass findings below, fixed in this session)

**Note on provenance:** height/overlay/CTA code and an earlier draft of this smoke report already existed when this session picked up the prompt (drafted outside this session). The draft's AC table self-reported all-PASS, including "AC8: PASS assumed" — the prompt explicitly says *"Re-run MCP after implement. Do not mark PASS on self-report alone."* This report replaces that draft with independently MCP-verified results, including two real bugs and one incompletely-realized feature (AC3) that the self-report missed.

## What the independent QA pass (second pass) found and this session fixed

1. **`voidMicrotask` ReferenceError** (`region-map-canvas.tsx`) — not a real global; would throw a second, uncaught error if `new maplibregl.Map()` itself fails (e.g. no WebGL). Fixed → `queueMicrotask` (matches Wave-1's original pattern).
2. **`attributionControl: true` type error** — invalid value for MapLibre's `AttributionControlOptions` type. Attribution is on by default when the option is omitted; removed the line entirely (still satisfies non-negotiable §5.4 "Attribution remains").
3. **Province/region overlay was rendering but practically invisible at the default view.** Live-debugged via a temporary `window.__debugMap` handle + `queryRenderedFeatures`/`querySourceFeatures`: the GeoJSON source, fill layer, and outline layer were all loading and painting correctly — `queryRenderedFeatures` found a feature exactly at the Bắc Ninh pin. The problem was scale: the AOI polygons are real ~30×33km boxes, and at the whole-country `fitBounds` zoom (~5.7) needed to show both Bắc Ninh and TP.HCM at once, that's a few screen pixels — imperceptible. The **halo** circle layer (radius defined in screen pixels, not geography) is what was supposed to carry visibility at that zoom, but its original tuning (`circle-opacity: 0.28`, `circle-blur: 0.55`, max radius 52px) was too soft to read as "this region is highlighted" rather than "marker drop-shadow." Increased to `circle-opacity: 0.42`, `circle-blur: 0.4`, radius `34→46→58` across zoom 4→8→11. Confirmed via screenshot: both pins now show a clearly visible teal halo at the default view (`reports/assets/v0-wave2-polish-desktop-final.png`, `reports/assets/v0-wave2-polish-mobile-final.png`), and the true GeoJSON AOI fill is confirmed correct when zoomed in directly on either pin (`reports/assets/v0-wave2-overlay-zoomed-confirmed.png`).
4. **scrollZoom passthrough was untested (only code-inspected).** Added a real e2e spec using `page.mouse.wheel()` (proper browser hit-testing, unlike a raw synthetic `dispatchEvent` which produced an unrelated artifact during manual QA) — confirms wheeling over the map scrolls the *page*, not the map.

None of these were "regressions I introduced" — they were gaps in the pre-existing draft that this session's independent QA pass (as instructed by §2 of the prompt) was specifically designed to catch before signing off.

## Orchestrator summary

| Decision | Choice |
|----------|--------|
| Height | Map stage `min-h-[70vh] md:min-h-[100dvh]` (`region-map-stage` testid) |
| scrollZoom | **false** — page scroll not trapped; zoom via NavControl buttons / pinch |
| Province color | Circle **halos** (tuned for visibility at national zoom) + AOI **GeoJSON fill/line** (`public/geo/portfolio-regions.geojson`, visible on zoom-in) — not a full 63-province choropleth; demotiles remains country-colored underneath by design |
| Geo source | Hand-simplified rectangular metro AOI — see `public/geo/ATTRIBUTION.md` (explicitly non-cadastral, non-sa-ban) |
| HH CTA | Bắc Ninh card → `bacninhhonghaccity.vn/sa-ban?utm_source=ded-pmh&utm_medium=home-map&utm_campaign=map-cta`, `target="_blank"`, `rel="noopener noreferrer"` |
| Resize | `ResizeObserver` + `map.resize()` on load via `requestAnimationFrame` |

## Roadmap sync

| ID | Status |
|----|--------|
| R09 MapLibre pins | **DONE** (Wave-1) |
| R03 CTA Sa bàn HH | **DONE** (this wave) |
| R04 UTM L1 | **DONE** (via R03 URL) |
| R10 map slice | **DONE** (height/hierarchy/region color); full-site 01–08 still later |

## AC table (MCP re-verified after fixes)

| ID | Criterion | Result | Evidence |
|----|-----------|--------|----------|
| AC0 | Agent Q report; Q1–Q4 PASS | **PASS** | `independent-qa.md`, both QA passes |
| AC1 | Map stage ~70vh mobile / ~100dvh desktop | **PASS** | Measured live: desktop 900px on 900px viewport (exact), mobile 568px on 812px (exact 70vh) |
| AC2 | scrollZoom no trap | **PASS** | `scrollZoom: false`; e2e `page.mouse.wheel()` confirms page scrolls, map doesn't zoom |
| AC3 | BN + HCM distinct from country fill | **PASS** (was borderline before halo tuning) | `reports/assets/v0-wave2-polish-desktop-final.png` / `-mobile-final.png` — both pins show a clearly visible teal halo at default zoom; `reports/assets/v0-wave2-overlay-zoomed-confirmed.png` — true AOI fill visible on zoom-in |
| AC4 | HH CTA + UTM | **PASS** | e2e `sa-ban-hh-cta`: href matches `bacninhhonghaccity.vn/sa-ban`, `utm_source=ded-pmh`, `target="_blank"` |
| AC5 | Pin + list nav | **PASS** | e2e + live MCP click-through, both paths |
| AC6 | e2e green | **PASS** | `map.spec.ts` **5/5** (added scrollZoom spec); full suite **23/23** |
| AC7 | Smoke + roadmap note | **PASS** | this file |
| AC8 | No map console errors | **PASS — actually MCP-verified, not assumed** | 0 errors across every check this session; only pre-existing unrelated `favicon.ico` 404 and an unrelated LCP/preload advisory on the hero image (not touched by this prompt) |

**Scorecard: AC0–AC8 all PASS — no CONDITIONAL needed.**

## Commands run

```
pnpm lint                                          → 0 errors, 0 warnings
npx tsc --noEmit -p tsconfig.json                  → 0 errors (was 2 before fixes)
pnpm build                                          → green, 11 routes
pnpm dev                                            → MCP verification (webpack, stable)
npx playwright test -c e2e/playwright.config.ts    → 23/23 passed
```

Note: an initial fully-parallel e2e run showed transient timeouts on the two heaviest map assertions (canvas-visible, list-nav) — 8 workers simultaneously initializing WebGL + fetching the demotiles style + our GeoJSON overlay contend for CPU/network. All passed serially in isolation (proving no logic bug); fixed by raising those two assertions' timeouts to 15s. Second full-parallel run: 23/23 clean.

## Files changed this session

- `components/home/region-map-canvas.tsx` — fixed `voidMicrotask`→`queueMicrotask`, removed invalid `attributionControl: true`, retuned halo layer opacity/blur/radius for default-zoom visibility
- `e2e/map.spec.ts` — added `scrollZoom` passthrough spec, raised timeouts on 2 network/GPU-heavy assertions
- `reports/2026-07-21-v0-maplibre-wave2-independent-qa.md` — appended second-pass findings
- `reports/2026-07-21-v0-maplibre-wave2-polish-smoke.md` — this file, replacing the self-reported draft

Pre-existing (from before this session, verified not re-broken): `components/home/vn-map.tsx`, `lib/i18n/vi.json` (mapListIntro/mapSaBanCta keys), `public/geo/portfolio-regions.geojson`, `public/geo/ATTRIBUTION.md`.

## DEBT

- Province emphasis is halo + small real AOI fill, not a true administrative choropleth — matches the prompt's own approved scope (§3.2 explicitly excludes full 63-province choropleth and sa-ban lot parcels).
- The pre-existing, unrelated LCP/preload advisory on the hero image (`cong-chao.webp`) was observed during this session's console checks but is out of this prompt's scope (home hero, not the map) — not fixed here, noted for a future pass.

## VERDICT

```
VERDICT: V0_MAPLIBRE_WAVE2_MET
AC0: PASS  AC1: PASS  AC2: PASS  AC3: PASS  AC4: PASS
AC5: PASS  AC6: PASS  AC7: PASS  AC8: PASS
BUGS_FOUND_AND_FIXED: voidMicrotask ReferenceError, attributionControl type error,
  province-overlay-too-subtle-at-default-zoom (halo retuned)
MCP_EVIDENCE_INDEX:
  - v0/reports/assets/v0-wave2-qa-desktop-1440.png (QA pass, before halo fix)
  - v0/reports/assets/v0-wave2-qa-mobile-375.png (QA pass, before halo fix)
  - v0/reports/assets/v0-wave2-qa-zoomed-no-overlay.png (QA pass — misleading zoom location, see report body)
  - v0/reports/assets/v0-wave2-overlay-zoomed-confirmed.png (overlay confirmed correct on zoom-in)
  - v0/reports/assets/v0-wave2-polish-desktop-final.png (after halo fix — both pins clearly visible)
  - v0/reports/assets/v0-wave2-polish-mobile-final.png (after halo fix, mobile)
E2E_COMMAND: pnpm --dir v0 test:e2e   (23/23 passed, map.spec.ts 5/5)
FILES_CHANGED: see "Files changed this session" above
DEBT: see "DEBT" above — no blocking debt
```

`v0 home map Wave-2 — height + province emphasis + HH CTA — MCP verified.`
