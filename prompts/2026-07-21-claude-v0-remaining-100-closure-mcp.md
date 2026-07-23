# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Track A REMAINING 100% CLOSURE (post sellability-70)
# Packages: R05 L2 map-shell MVP · R06 data contract · R07 /en · R08 PDF honesty bridge · R10 remainder polish · R12 ADR · MCP/e2e gate
# Primary workspace: Z:\Coding\260719-DE\v0
# Related READ (not write unless explicitly needed for R08 docs): parent Local `functions/src/export-fact-sheet-pdf.ts`
# Mode: MULTI-WAVE IMPLEMENT + MCP-BROWSER-VERIFIED + REPORT
# Structural parents (form ONLY):
#   ../prompts/CLAUDE_CODE_MULTI_AGENT_ORCHESTRATOR_MASTER_PROMPT.md
# Frozen baselines (MET — do NOT rebuild):
#   v0/prompts/2026-07-21-claude-v0-maplibre-home-map-e-mcp.md
#   v0/prompts/2026-07-21-claude-v0-maplibre-wave2-qa-height-choropleth-mcp.md
#   v0/prompts/2026-07-21-claude-v0-sellability-70-roadmap-mcp.md
#   docs/WHAT_YOU_BUY.md · DEMO_SCRIPT_15MIN.md · sellability-70 smoke + independent reviews
# Max repair loops / wave: 3
# Sub-agents: **8** (Wave A: 5 · Wave B: 3 — Orchestrator runs both; all must complete or CONDITIONAL with written debt)
# Target: Close **100% of remaining roadmap IDs** for v0 Track A under the DoD below (not “infinite Enterprise product”)

---

## 0. How to use

1. Read §1 frozen DONE list — zero rework.
2. Execute **Wave A then Wave B** (or parallelize only when ownership does not conflict).
3. Spawn agents per §3; Orchestrator merges, runs e2e + MCP, writes final scorecard.
4. Prefer `pnpm dev` / webpack if Turbopack hangs on Windows.
5. Do not commit/push unless human asks.

**Scope lock:**
```text
WRITE: v0/** (packages/, app/, components/, lib/, e2e/, docs/, reports/, public/)
READ:  sa-ban repo patterns for extract inspiration ONLY (260530-bdskimquyen) — do not vendor 397-lot inventory
READ:  Local functions PDF path for R08 documentation / interface typing only
NO:    Full Enterprise RBAC/OAuth/AI production build (R12 = ADR + stubs only)
NO:    Rewriting sellability docs from scratch (update status tables only)
NO:    Breaking MapLibre home map Wave-2 ACs
```

---

## 1. Frozen DONE (exclude)

```text
R01 What you buy          DONE
R02 Demo script 15'       DONE
R03 HH CTA on map         DONE
R04 L1 UTM formalized     DONE
R09 MapLibre pins         DONE
R10 map-section polish    DONE (height/halo/CTA/favicon/sidebar align)
R11 e2e HH + soft sa-ban  DONE
```

---

## 2. Remaining 100% — Definition of Done (CRITICAL)

### R05 — L2 map-shell extract (MVP, not 60-day full port)
**Done when:**
- New internal package e.g. `v0/packages/map-shell/` (or `v0/lib/map-shell/`) exporting:
  - `createMap(options)` / thin MapLibre wrapper
  - region pin + fitBounds helpers
  - optional filter types (region id, count) — **not** sa-ban lot filter rails
- Home `region-map-canvas.tsx` **consumes** the package (refactor, behavior preserved)
- README in package: how sa-ban *could* depend later (L2 story) without actually merging repos
- e2e map specs still green

**Not Done / OUT of this DoD:** copying `SaBanInteractiveMap`, tile-gatekeeper, 397 GeoJSON lots, Marzipano.

### R06 — Data contract
**Done when:**
- `v0/docs/DATA_CONTRACT_GEOJSON.md` (+ optional `v0/public/geo/schema.json` or zod schema in `lib/`)
- Spec: 1 GeoJSON FeatureCollection per `projectSlug` OR per region; required props (`id`, `status`, `name`…); checklist “missing data ⇒ do not claim packaging C Δ price”
- Example: existing `portfolio-regions.geojson` annotated as compliant sample (portfolio AOI, not lots)
- Hook or loader stub that validates and fails soft in dev if invalid

### R07 — F8 `/en` + switcher
**Done when:**
- Locale routing strategy chosen and implemented (prefer Next.js App Router `app/[lang]/...` **or** lightweight `?lang=` / cookie + `t()` dual dict — pick one, document)
- `en.json` covering keys currently in `vi.json` (honest EN; no machine-garbage leave-as-TODO unmarked)
- Language switcher in header (vi ↔ en)
- e2e: switch locale, assert ≥1 EN string on home
- Default remains `vi`

### R08 — PDF Function bridge (honesty preserved)
**Done when:**
- `docs/PDF_EXPORT.md`: v0 = print fallback; Local Function path + how to wire later
- Code: `exportFactSheetPdf()` stays honest; optional `NEXT_PUBLIC_PDF_FUNCTION_URL` — if unset, print path; if set, attempt fetch/download with clear error toast (no fake success)
- No deploy of Firebase from this prompt required; wiring must be testable with unset env

### R10 — Remainder UI/UX 01–08 (non-map)
**Done when:** complete a **checklist report** + implement **only gaps still failing** after audit:
01 POV · 02 Typography · 03 Color · 04 Hierarchy · 05 Imagery · 06 Motion · 07 Mobile · 08 Invisible  
Cap: ≤8 concrete file-level fixes; no full visual rebrand. Map section already met — skip unless regression.

### R12 — Enterprise multipliers
**Done when (ADR-only):**
- `docs/ADR-001-enterprise-rbac-ai-algolia.md`: Decide = **Defer** with reopen criteria; no production RBAC/AI/Algolia in v0 this wave
- Update WHAT_YOU_BUY “not included” to cite ADR

**100% closure claim allowed only if R05–R08+R10 DoD met and R12 ADR filed.**

---

## 3. Sub-agents (8)

### Wave A — Foundation (5 agents, parallel OK)

| Agent | Own |
|-------|-----|
| **A1** | R05 package scaffold + refactor `region-map-canvas` to import it |
| **A2** | R06 schema/docs + validation helper + sample annotation |
| **A3** | R07 i18n architecture decision + `en.json` + `t()` dual-load |
| **A4** | R07 switcher UI in `site-header` / mobile nav + route or cookie wiring |
| **A5** | R08 PDF docs + optional env-gated client path in `pdf-export-trigger.tsx` |

### Wave B — Closure (3 agents)

| Agent | Own |
|-------|-----|
| **B1** | R10 audit 01–08 + ≤8 polish fixes + mobile 375 MCP |
| **B2** | e2e: map still green; add `/en` or locale switch specs; PDF honesty still asserts print when env unset |
| **B3** | R12 ADR + update docs/README + WHAT_YOU_BUY status + final smoke `reports/2026-07-21-v0-remaining-100-smoke.md` + MCP screenshots |

Orchestrator: after Wave A green build, run Wave B; if R07 strategy conflicts with A1 file moves, A3/A4 own `app/` locale layout exclusively.

---

## 4. Non-negotiables

1. Map Wave-2 ACs must remain green (canvas, height, halo, CTA HH, scrollZoom, khu-vuc).
2. Sellability docs stay accurate — update status, don’t invent prices.
3. No Mapbox paid token hard-req; MapLibre stays default.
4. No silent fake PDF download.
5. R12 must not silently become a half-built OAuth.
6. pnpm lockfile updated if new workspace package.

---

## 5. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | `packages/map-shell` (or equiv) exists; home map uses it; map e2e PASS |
| AC2 | R06 DATA_CONTRACT doc + schema/validator + sample |
| AC3 | EN locale usable via switcher; e2e asserts EN copy |
| AC4 | PDF: unset env → print+toast; docs explain Local Function |
| AC5 | R10 checklist filed; ≤8 fixes; no map regression |
| AC6 | R12 ADR Defer filed; WHAT_YOU_BUY updated |
| AC7 | Full `pnpm test:e2e` green; lint/tsc/build green |
| AC8 | Final smoke report + MCP evidence index; remaining debt only if CONDITIONAL and listed |
| AC9 | No commit/push unless asked |

**Scorecard:** PASS = AC1–AC9. CONDITIONAL allowed only on AC3 if EN coverage is partial but switcher works and missing keys throw/fall back visibly documented.

---

## 6. Deliverables

```text
v0/packages/map-shell/** (or lib/map-shell/**)
v0/docs/DATA_CONTRACT_GEOJSON.md
v0/docs/PDF_EXPORT.md
v0/docs/ADR-001-enterprise-rbac-ai-algolia.md
v0/lib/i18n/en.json (+ routing/switcher)
refactored region-map-canvas + pdf-export-trigger
e2e updates
v0/reports/2026-07-21-v0-remaining-100-smoke.md
v0/reports/assets/remaining-100-*.png
updated docs/README.md + WHAT_YOU_BUY status section
```

---

## 7. Done when

All remaining roadmap IDs have a **terminal state** (DONE or ADR-DEFER for R12) under §2 DoD; v0 is sellable as Track A + L1 sa-ban with L2 package story started; `/en` ships; PDF stays honest; map still real.
