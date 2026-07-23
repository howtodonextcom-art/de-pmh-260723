# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Sellability Pack (~70% of remaining roadmap Do-items)
# Packages: What-you-buy one-pager · Demo script · R04 formalize · R11 e2e HH deep-link · R10 bounded UI polish · MCP gate
# Primary workspace: Z:\Coding\260719-DE\v0
# Surface: **v0/ ONLY** (docs may live under v0/reports/ + v0/docs/ if created)
# Mode: IMPLEMENT + MCP-BROWSER-VERIFIED (for UI polish) + FILE deliverables for R01/R02
# Structural parents (form ONLY):
#   ../prompts/CLAUDE_CODE_MULTI_AGENT_ORCHESTRATOR_MASTER_PROMPT.md
# Prior waves (MET — do not rebuild):
#   v0/prompts/2026-07-21-claude-v0-maplibre-home-map-e-mcp.md
#   v0/prompts/2026-07-21-claude-v0-maplibre-wave2-qa-height-choropleth-mcp.md
#   reports: maplibre wave1/wave2 smoke + independent browser review
# Max repair loops / wave: 3
# Sub-agents: **6** (all must run)
# Target: Close ~70% of remaining *Do* roadmap without starting L2 extract / Enterprise /en / PDF Function

---

## 0. How to use

You are Claude Code / Cursor Agent. You MUST:

1. Treat §1 DONE baseline as frozen.
2. Spawn **all 6** agents with exclusive ownership; Orchestrator merges.
3. UI polish needs MCP evidence on `http://localhost:3000` (webpack `pnpm dev` if Turbopack hangs).
4. Do not commit/push unless human asks.
5. Stop at §8 AC table + scorecard + smoke path.

**Scope lock:**
```text
WRITE: v0/docs/**, v0/reports/**, v0/e2e/**, v0/lib/i18n/vi.json (only if polish needs copy),
       v0/components/home/** and v0/components/project/** ONLY for bounded R10 polish listed below
NO:    src/ Local app, Firebase Functions deploy, /en routes, Algolia, RBAC/AI,
       extracting sa-ban MapCanvas package (R05), full GeoJSON-per-project schema work (R06),
       rebuilding MapLibre map (R09/R03 already shipped)
```

---

## 1. Orchestrator identity + roadmap math

You are the **DED-PMH v0 Sellability 70% Orchestrator**.

```text
ALREADY DONE (exclude from work; reference only):
  R03  HH CTA on map Bắc Ninh row + UTM
  R04  deep-link URL live (needs docs mention only)
  R09  MapLibre pins Option E
  R10  map-section slice (100dvh / halo / scrollZoom)

THIS WAVE = ~70% of REMAINING Do weight:
  R01  What you buy one-pager          ~15%
  R02  Demo script 15'                 ~15%
  R04  Formalize L1 in that one-pager  ~5%
  R11  e2e HH CTA + optional external URL contract  ~15%
  R10  Bounded polish outside map      ~20%
  Gate/report                          ~10%
                                       ----
                                       ~80% of remaining Do (cap deliverables so wall-clock stays one wave)

EXPLICITLY OUT (remaining ~30%+ for later waves):
  R05  L2 extract shared map shell (30–60d)
  R06  Multi-project lot GeoJSON data contract
  R07  F8 /en
  R08  PDF Cloud Function
  R12  RBAC / AI / Algolia
```

URLs to cite (canonical):
```text
v0 Track A repo:     https://github.com/howtodonextcom-art/260719-de-pmh
v0 production:       https://de-division-pmh.vercel.app   (confirm if live; if unsure say “Vercel project linked to repo”)
Sa-ban HH repo:      https://github.com/howtodonextcom-art/260530-bdskimquyen
Sa-ban production:   https://www.bacninhhonghaccity.vn/sa-ban
HH CTA (already in UI):
  https://www.bacninhhonghaccity.vn/sa-ban?utm_source=ded-pmh&utm_medium=home-map&utm_campaign=map-cta
```

---

## 2. Non-negotiables

1. Do not regress map Wave-2 ACs (canvas, height, CTA, scrollZoom, khu-vuc nav).
2. R01/R02 are **buyer-facing docs in Vietnamese + English headings optional**; keep concrete (repos, URLs, env, demo steps) — no hype.
3. R10 polish is **bounded** — see Agent D list only. No glassmorphism redesign, no purple theme, no new sections on home.
4. R11 must use Playwright; do not flake on sa-ban third-party uptime — assert **href/UTM/target** in v0; optional `request` HEAD/GET to sa-ban may be soft/CONDITIONAL.
5. No Mapbox token; no sa-ban lot inventory inside v0.

---

## 3. Sub-agents (6)

### Agent A — R01 What you buy
Create `v0/docs/WHAT_YOU_BUY.md` (and short pointer in `v0/reports/2026-07-21-v0-sellability-70-smoke.md`):
- What is included: v0 Track A (6 routes, MapLibre home map, compare, legal, gallery…)
- What is **separate IP**: sa-ban HH (lot inventory) — L1 deep-link, not embedded
- Repo URLs + prod URLs
- Env: none required for public demo seed; note Local/Firebase out of package #1
- Packaging ask reminder: point to prior valuation packaging #1 vs #3 (one paragraph, no new invented prices unless copying from existing reports)
- Explicit “not included”: R05 extract, /en, PDF Function, RBAC

### Agent B — R02 Demo script
Create `v0/docs/DEMO_SCRIPT_15MIN.md`:
Timed steps (≈15 min):
1. Home hero → brand
2. Scroll map → pins/halo → click list BN → /du-an filter
3. Open HH CTA (new tab) → sa-ban live
4. Back → project detail (one HCM + HH if useful)
5. /so-sanh hide-identical
6. /phap-ly or print honesty note
7. CMDK ⌘K theme / navigate
Include **talk track** one-liners (Vietnamese) per step. No video recording required.

### Agent C — R04 formalize + R01 cross-links
- Ensure WHAT_YOU_BUY documents L1 pattern: same-stack story, UTM contract, “powered by first-party sa-ban IP”
- Add `v0/docs/README.md` index linking WHAT_YOU_BUY + DEMO_SCRIPT + map wave reports

### Agent D — R10 bounded UI polish (only these)
Pick **3–5** high-ROI, low-risk fixes visible in MCP (do not boil ocean):
Allowed examples:
- Map section: ensure list intro + CTA spacing/hierarchy still clear after 100dvh
- Home: reduce any obvious leftover placeholder copy; ensure Featured/Explorer CTAs consistent `t()` keys
- Detail Sources: PDF toast copy still honest
- Mobile 375: map section + CTA not clipped; header not broken
Forbidden: new fonts redesign whole site, new animation catalogue, partner marquee revive, MapLibre style swap to Mapbox

### Agent E — R11 e2e
Extend `v0/e2e/` (prefer `map.spec.ts` or new `sellability.spec.ts`):
1. HH CTA visible + href UTM + target=_blank (may already exist — harden, don’t duplicate flaky)
2. Demo-critical path smoke: `/` → map heading visible → click TP.HCM or BN list → `/du-an?khu-vuc=`
3. Optional soft check: `request.get(sa-ban URL)` expect <400 — mark CONDITIONAL if network blocked
Keep full suite green; raise timeouts only where WebGL/parallelism needs it (pattern already in map.spec).

### Agent F — MCP + smoke report
- Drive localhost: walk demo script steps 1–3 at minimum; screenshots under `v0/reports/assets/sellability-70-*.png`
- Write `v0/reports/2026-07-21-v0-sellability-70-smoke.md` with AC table + roadmap % claim
- Update roadmap status table: R01/R02/R04/R11/R10-slice → DONE; list OUT items remaining

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | `docs/WHAT_YOU_BUY.md` exists, cites both repos + both prod URLs, separates v0 vs sa-ban |
| AC2 | `docs/DEMO_SCRIPT_15MIN.md` exists with timed steps including HH CTA |
| AC3 | docs/README index links the two docs |
| AC4 | R11 e2e covers HH CTA UTM + at least one map→filter path; suite green |
| AC5 | MCP screenshots for home map + CTA visible |
| AC6 | No regression: map canvas, 70vh/100dvh stage, scrollZoom page scroll, khu-vuc nav |
| AC7 | Smoke report states remaining OUT: R05 R06 R07 R08 R12 |
| AC8 | No commit/push unless asked |

**Scorecard:** PASS if AC1–AC8 pass (AC4 soft external HEAD may be CONDITIONAL).

---

## 5. Deliverables

```text
v0/docs/WHAT_YOU_BUY.md
v0/docs/DEMO_SCRIPT_15MIN.md
v0/docs/README.md
v0/e2e/* (updated)
v0/reports/2026-07-21-v0-sellability-70-smoke.md
v0/reports/assets/sellability-70-*.png
Optional tiny R10 component/copy tweaks
```

---

## 6. Done when

Buyer can read what they buy, run a 15' demo script, e2e guards HH deep-link, map Wave-2 still green — ~70% of remaining Do closed; L2/Enterprise deferred explicitly.
