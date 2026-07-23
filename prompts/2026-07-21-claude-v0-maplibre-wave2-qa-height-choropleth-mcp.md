# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Home Map Wave-2: Independent QA + Full-height + Province choropleth polish
# Packages: MCP browser audit · section height (100dvh) · highlight BN/HCM · CTA sa-ban HH · e2e · smoke
# Primary workspace: Z:\Coding\260719-DE\v0
# Surface: **v0/ ONLY**
# Mode: INDEPENDENT REVIEW FIRST → IMPLEMENT polish → MCP RE-VERIFY
# Structural parents (form ONLY):
#   ../prompts/CLAUDE_CODE_MULTI_AGENT_ORCHESTRATOR_MASTER_PROMPT.md
# Baseline (Wave-1 DONE — do not rebuild Option E core):
#   v0/prompts/2026-07-21-claude-v0-maplibre-home-map-e-mcp.md
#   v0/reports/2026-07-21-v0-maplibre-home-map-smoke.md
#   components/home/region-map-canvas.tsx · vn-map.tsx (dynamic ssr:false)
#   style: https://demotiles.maplibre.org/style.json · maplibre-gl ^5.24.0
# Founder asks:
#   1) Independent review / open browser / real test of current map
#   2) Can section height ≈ viewport (h-screen / 100dvh)?
#   3) Can we color by province (not only country fills on demotiles)?
#   4) Complete remaining map packaging items (R03 CTA HH, R10 map UX) via this prompt
# Max repair loops / wave: 3
# Sub-agents: **7** (all must run; Agent Q runs BEFORE implement merge)
# Target gate: Honest QA scorecard + polished map section (height + province emphasis + HH CTA) without sa-ban lot inventory

---

## 0. How to use

You are Claude Code / Cursor Agent. You MUST:

1. **Agent Q first** — independent browser QA of CURRENT production of Wave-1 (no code changes yet). Write findings.
2. Only then spawn implement agents for approved polish (height, province highlight, CTA).
3. Re-run MCP after implement. Do not mark PASS on self-report alone.
4. Scope lock:
```text
WRITE: v0/components/home/*, v0/lib/home-content.ts, v0/lib/i18n/vi.json,
       v0/public/geo/* (if adding province GeoJSON), v0/e2e/*, v0/reports/*
NO:    src/ Local, sa-ban lot GeoJSON/tile-gatekeeper copy, Mapbox paid token hard-req,
       Algolia, /en, PDF Cloud Function, changing filter slug contract
```
5. Do not commit/push unless human asks.
6. Dev: `pnpm dev` / webpack if needed (Turbopack hang risk on Windows).

Runtime: `http://localhost:3000` — scroll to “Bản đồ phân bố”.

---

## 1. Orchestrator identity

You are the **DED-PMH v0 Map Wave-2 Orchestrator**.

```text
WAVE-1 STATUS (treat as shipped unless Agent Q REJECTS):
  SVG squiggle gone
  MapLibre + demotiles + 2 pins + fitBounds
  List buttons + khu-vuc navigation
  Lazy dynamic import
  e2e map specs exist (verify count/green)

WAVE-2 MISSION:
  Q  Independent review (browser + code) — score Wave-1 claims
  P1 Section height: make map stage feel premium (target ~100dvh map stage on md+,
     NOT necessarily trapping entire page scroll forever)
  P2 Province visual differentiation: emphasize Bắc Ninh + TP.HCM on the map
     (choropleth / highlight fill), not “whole Vietnam one blue country blob only”
  P3 R03: CTA “Sa bàn Hồng Hạc” for Bắc Ninh row (deep-link L1 to
     https://www.bacninhhonghaccity.vn/sa-ban?utm_source=ded-pmh&utm_medium=home-map)
  P4 R10 slice: hierarchy/imagery/motion/mobile polish for this section only
  P5 e2e + smoke report Wave-2
```

**Roadmap sync (update in smoke report):**
- R09 MapLibre pins → **DONE** (Wave-1)
- R03 CTA HH → **THIS WAVE**
- R04 UTM L1 → covered by P3
- R10 map portion → **THIS WAVE** (full site 01–08 still later)

---

## 2. Agent Q — Independent QA (MUST RUN FIRST, no implement)

Own: read-only code + MCP browser. Forbidden: feature edits.

Checklist:
| ID | Check | Method |
|----|-------|--------|
| Q1 | MapLibre canvas present; not SVG path | MCP screenshot |
| Q2 | 2 pins BN + HCM visible after fitBounds | MCP |
| Q3 | List click → `/du-an?khu-vuc=bac-ninh` / `tp-hcm` | MCP |
| Q4 | Marker click navigates or opens popup then navigate | MCP |
| Q5 | Mobile 375: map height usable | MCP |
| Q6 | Console: no maplibre errors | MCP |
| Q7 | demotiles = country-colored toy style — **document limitation** (no VN province fills) | visual |
| Q8 | Section height vs viewport — measure; note “feels small / placeholder” | visual |
| Q9 | Wave-1 smoke claims vs reality — CONFIRM / PARTIAL / REJECT | report |
| Q10 | playwright map specs still listed; note if suite not re-run | code |

Write: `v0/reports/2026-07-21-v0-maplibre-wave2-independent-qa.md`
If Q1–Q4 fail → STOP implement; repair Wave-1 first.

---

## 3. Technical decisions (locked for implement)

### 3.1 Full viewport height — YES with constraints
**Do:**
- Map **stage** (`RegionMapCanvas` container) uses `min-h-[70vh] md:min-h-[100dvh]` OR section `min-h-[100dvh]` with internal grid so map dominates.
- Prefer **`100dvh`** over `h-screen` (mobile browser chrome).
- Keep page scrollable: do **not** set `overflow:hidden` on `body`. Map can capture wheel only when focused/hovered if using cooperative gestures (`dragPan` ok; document `scrollZoom` — recommend **scrollZoom: false** on homepage to avoid scroll trap, pinch/buttons zoom ok).

**Don’t:**
- Force entire homepage to single screen.
- Break Timeline below-the-fold discovery badly without sticky CTA escape.

### 3.2 Province / region coloring — YES, limited to portfolio regions
demotiles **cannot** recolor VN provinces. Implement **overlay GeoJSON**:

```text
Option chosen (default):
  Add lightweight GeoJSON for administrative boundaries of:
    - Bắc Ninh (or project AOI polygon if smaller)
    - TP.HCM (or PMH AOI)
  Source: use a small hand-simplified polygon OR fetch from a permissive open dataset
  and vendor under v0/public/geo/ with LICENSE/ATTRIBUTION note in smoke report.
  Add fill + line layers ABOVE basemap; brand teal fill at ~0.25–0.4 opacity
  for regions that have projects; other provinces = no fill.

NOT in scope:
  Full 63-province choropleth of Vietnam
  Sa-ban lot parcels / yellow inventory map
```

If GeoJSON acquisition blocks >2h: CONDITIONAL fallback = **larger branded circle/halo layers** around pins + side-list color chips matching pin color (still document “true province fill deferred”).

### 3.3 CTA Sa bàn HH (R03)
- On Bắc Ninh list row: secondary button/link “Sa bàn Hồng Hạc” → external URL + UTM
- `rel="noopener noreferrer"` `target="_blank"`
- Do not claim other cities have sa-ban

---

## 4. Sub-agents (7)

| Agent | Own |
|-------|-----|
| **Q** | Independent QA report (first) |
| **A** | Height / layout: `vn-map.tsx` grid → map-first, min-h 100dvh stage, mobile stack |
| **B** | Geo overlay layers in `region-map-canvas.tsx` + `public/geo/*` |
| **C** | List UX + HH CTA + color chips; i18n keys |
| **D** | Map gestures: scrollZoom policy, resize on height change (`map.resize()`), reduced-motion |
| **E** | e2e updates (height testid, CTA href, overlay presence optional) |
| **F** | MCP re-verify + `v0/reports/2026-07-21-v0-maplibre-wave2-polish-smoke.md` |

Orchestrator merges; ensures `map.resize()` after layout height change.

---

## 5. Non-negotiables

1. Keep Wave-1 contracts: `REGION_LNG_LAT`, `khu-vuc` slugs, lazy `dynamic(ssr:false)`.
2. No Mapbox token required.
3. No sa-ban lot layer.
4. Attribution remains.
5. Typecheck/lint clean on touched files.
6. Agent Q report must exist before claiming Wave-2 done.

---

## 6. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC0 | Agent Q report filed; Q1–Q4 PASS |
| AC1 | Map stage ≥ ~70vh mobile / ~100dvh desktop (measure in MCP) |
| AC2 | scrollZoom does not trap page scroll (or documented cooperative behavior) |
| AC3 | Bắc Ninh + TP.HCM visually distinct from generic country fill (overlay OR approved halo fallback) |
| AC4 | HH CTA on BN row → sa-ban URL with UTM |
| AC5 | Pin + list navigation still works |
| AC6 | e2e green for updated specs |
| AC7 | Wave-2 smoke report + roadmap note R09 DONE / R03 DONE |
| AC8 | No console map errors |

Scorecard: PASS if AC0–AC8 pass; AC3 may be CONDITIONAL with halo fallback + explicit note.

---

## 7. Deliverables

```text
v0/reports/2026-07-21-v0-maplibre-wave2-independent-qa.md
v0/reports/2026-07-21-v0-maplibre-wave2-polish-smoke.md
code: vn-map / region-map-canvas / i18n / public/geo (if any) / e2e
orchestrator summary: height strategy, geo source, scrollZoom choice
```

---

## 8. Done when

Independent QA confirms Wave-1; map section feels full-viewport premium; BN/HCM readable by color/overlay; HH sa-ban CTA live; reports filed.
