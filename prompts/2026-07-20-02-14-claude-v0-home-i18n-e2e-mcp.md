# CLAUDE CODE MULTI-AGENT MASTER PROMPT
# DED-PMH v2 — v0 Track A Completion Wave
# Packages: Home H1–H10 · vi.json + ESLint · E2E Playwright
# Primary workspace: Z:\Coding\260719-DE
# Surface under work: **v0/ ONLY** (Track A)
# Mode: IMPLEMENT + MCP-BROWSER-VERIFIED (not plan-only)
# Structural parents (form ONLY — do NOT copy FTMO/ChallengeReady product rules):
#   prompts/CLAUDE_CODE_MULTI_AGENT_ORCHESTRATOR_MASTER_PROMPT.md
#   prompts/CLAUDE_CODE_ORCHESTRATOR_MASTER_PROMPT_V31_DD_REMAINDER_CODE_EXECUTION.md
# Siblings:
#   prompts/2026-07-20-01-52-claude-v0-lightbox-dropdown-100-mcp.md
#   prompts/2026-07-20-00-06-claude-final-mile-85-to-99-mcp.md
# Baseline: v0 Track A ~80–82% after lightbox/dropdown 100%; home still DemoShell (~25% of SPEC home)
# Max repair loops per wave: 3
# Sub-agents: **11** (minimum 10 — all must run)
# Target: lift v0 Track A toward ~92–95% on these three packages; MCP-prove home; tooling green

---

## 0. How to use

You are Claude Code (or Cursor Agent with equivalent sub-agents). You MUST:

1. Read §2 sources and SPEC home H1–H10 in full.
2. Spawn **all 11** agents in §7 with exclusive file ownership; Orchestrator merges.
3. **Hard requirement:** every UI wave ends with **MCP browser evidence** on `http://127.0.0.1:3000` **and/or** `http://localhost:3000` (both allowed via `allowedDevOrigins` — prefer **localhost** for audits; verify 127.0.0.1 still hydrates). Screenshots + a11y snapshots. Code-only ≠ PASS for home ACs.
4. If MCP unavailable: repair Playwright MCP, then retry. Still blocked → `BLOCKED_TRUTH` + FAIL — never invent PASS.
5. Stop at §9 AC table + scorecard + evidence index.

**Scope lock (CRITICAL):**
```text
WRITE:  v0/** , v0/reports/** or reports/assets for evidence, root e2e only if under v0/e2e or v0/playwright
READ:   src/ as @library only
FORBIDDEN WRITE: src/app, src/components (Local production), functions/, OAuth, Track B
```

Do not return only a plan.
Do not commit/push unless the human explicitly asks.
Do not reintroduce Track B / Google OAuth / `/en` full i18n (F8).

**Decision lock — Home strategy (do not ask):**
```text
PRIMARY: Replace `/` DemoShell with SPEC §3.2 home sections H1–H10.
PRESERVE LAB: Move DemoShell to `/lab` (or `/demo`) so Track A lab UI remains reachable for QA.
DO NOT only redirect `/` → `/du-an` unless H1–H10 is blocked by missing seed data for >2 sections —
  then CONDITIONAL redirect + document; still ship `/lab`.
```

---

## 1. Orchestrator identity

You are the **DED-PMH v0 Track A Completion Orchestrator**.

Mission: Close the three remaining Track A packages that keep v0 ~80% instead of ~95%:

```text
PACKAGE A — Home H1–H10 (SPEC §3.2)
  Replace DemoShell on `/` with marketing home: H1…H10
  Relocate DemoShell → `/lab`
  Keep SiteHeader (dropdown/CMDK already 100%)

PACKAGE B — i18n scaffold + ESLint
  Minimal `vi.json` (or `messages/vi.json`) + thin t() helper; migrate high-traffic copy off hard-coded JSX on home + header + key CTAs
  Add ESLint toolchain for v0 (`eslint` config + `pnpm --dir v0 lint` green or ≤ documented debt)

PACKAGE C — E2E Playwright against v0
  Playwright specs covering: home H1 CTA → /du-an → detail → lightbox → so-sanh@375 → phap-ly; nav dropdown; /lab still loads
  Script in v0 package.json; optional CI job for v0
```

Architecture:
```text
v0/     = Track A app (ONLY write surface for product UI)
src/    = library via @library (READ)
```

---

## 2. Source documents (read first)

```text
SPEC_DED_PMH_V2.md                    # §3.2 H1–H10 · F1 vi.json · F3 CMDK
prompts/2026-07-20-02-14-claude-v0-home-i18n-e2e-mcp.md   # this file
v0/app/page.tsx                       # currently DemoShell
v0/components/demo-shell.tsx
v0/components/shared/site-header.tsx
v0/lib/library-bridge.ts
src/app/(public)/page.tsx             # READ pattern for Local home if useful
src/components/home/**                # READ — port patterns, do not edit Local
```

Learn agent form from structural parents only.

---

## 3. Canonical locks

- Four projects only; status **Đang triển khai**
- Library data via `getCatalogFromLibrary` / `getFullCatalog` — no mock banner in PASS state
- Home motion: SPEC reveal defaults; honor `prefers-reduced-motion`
- Magic UI NumberTicker / Marquee / BlurFade: use if already in v0 deps; else simplified equivalent — **do not** block on missing Magic UI license
- H6 map: lightweight SVG (2 markers BN / HCM) — no heavy map SDK
- Hide-when-empty for H10 updates / H4 featured fallback per SPEC
- Keep `allowedDevOrigins` intact

Runtime: `http://localhost:3000` (primary) · confirm `127.0.0.1:3000` still interactive.

---

## 4. Baseline (independent audit)

| Item | Status |
|------|--------|
| `/` | DemoShell (Chọn dự án + legal) — **not** SPEC H1–H10 |
| Lightbox + dropdown | **100%** — do not regress |
| `/du-an`, detail, `/so-sanh`, `/phap-ly` | OK |
| `vi.json` | Missing — copy hard-coded |
| ESLint in v0 | Script exists; **no** real eslint config/deps |
| E2E against v0 | Missing |

---

## 5. Non-negotiables

1. MCP proof for home CTAs and section visibility.
2. One owner per file set; Orchestrator merges.
3. Max 3 repair loops per wave.
4. No regression: lightbox, dropdown, compare@375.
5. `pnpm --dir v0 build` green; `pnpm --dir v0 lint` runnable.
6. Prefer reuse Local home components via copy-adapt into `v0/components/home/**` — not importing Local client trees that pull Firebase.

---

## 6. Precedence

1. This prompt  
2. SPEC §3.2 H1–H10 + F1  
3. Existing v0 shell (header, tokens)  
4. Local `src/components/home/**` as reference only  

---

## 7. Multi-agent topology (**11 agents**)

### AGENT-00 Spec & Home IA Librarian
**MISSION:** Extract H1–H10 acceptance bullets + data deps from library seed; list which sections can be fully data-driven vs static copy.  
**OWN:** read-only → deliver AC draft + section/data matrix to Orchestrator.  
**MUST NOT EDIT** code.

### AGENT-01 Home Shell & Routing
**MISSION:** New `v0/app/page.tsx` composition shell (SiteHeader + main landmarks); create `v0/app/lab/page.tsx` hosting DemoShell; remove DemoShell from `/`.  
**OWN:** `v0/app/page.tsx`, `v0/app/lab/**`, thin `v0/components/home/home-page.tsx` shell.  
**MUST NOT EDIT:** gallery, compare-table.

### AGENT-02 Home H1–H3
**MISSION:** Implement H1 Hero, H2 Stat strip, H3 Transparency `#minh-bach`.  
**OWN:** `v0/components/home/{hero,stats,transparency}.tsx` (+ assets helpers).  
**MCP later via AGENT-10.**

### AGENT-03 Home H4–H6
**MISSION:** H4 Featured, H5 Explorer preview (reuse `project-card`), H6 Geo SVG map.  
**OWN:** `v0/components/home/{featured,explorer-preview,geo-map}.tsx`.  
**MUST NOT EDIT:** H1–H3 files after handoff.

### AGENT-04 Home H7–H10 + Footer
**MISSION:** H7 Timeline, H8 Legal teaser cards, H9 Partners marquee/grid, H10 Updates + Footer CTA.  
**OWN:** `v0/components/home/{timeline,legal-teaser,partners,updates-footer}.tsx`.  
**Data:** derive from library projects; static milestones OK if seed lacks `milestones` collection.

### AGENT-05 Home Data Adapter
**MISSION:** Pure helpers to compute stats, featured list, legal counts, partners union from `getFullCatalog()` — no UI.  
**OWN:** `v0/lib/home- derivations.ts` (or `v0/lib/home/*.ts`).  
**MUST NOT EDIT:** components except exporting types.

### AGENT-06 vi.json + t() Helper
**MISSION:** Add minimal dictionary `v0/messages/vi.json` (or `v0/lib/i18n/vi.json`) + `t(key)` helper; migrate home + SiteHeader + primary CTAs off raw Vietnamese literals where practical (≥ home H1/H2/H3 strings + nav labels).  
**OWN:** `v0/messages/**` or `v0/lib/i18n/**`, call sites in home + `site-header.tsx` / `mobile-nav.tsx`.  
**MUST NOT:** build language switcher or `/en`.

### AGENT-07 ESLint Toolchain for v0
**MISSION:** Add eslint flat config + deps so `pnpm --dir v0 lint` runs; fix new errors introduced by this wave; document any waived legacy debt.  
**OWN:** `v0/eslint.config.*`, `v0/package.json` devDeps/scripts, trivial lint fixes in files this wave touches.  
**MUST NOT:** change root eslint to re-lint v0 `.next`.

### AGENT-08 Playwright E2E Specs
**MISSION:** Author Playwright tests under `v0/e2e/` (or `v0/playwright/`) covering Package A+C flows.  
**OWN:** `v0/e2e/**`, `v0/playwright.config.*`.  
**Specs (minimum):**
1. Home loads H1 text + CTA → `/du-an`
2. `#minh-bach` reachable from ghost CTA
3. Nav dropdown 4 projects (regression)
4. Detail gallery lightbox open/Esc (regression)
5. `/so-sanh` @375 accordion
6. `/phap-ly` anchors
7. `/lab` returns 200 with DemoShell chrome

### AGENT-09 E2E Scripts & CI Hook
**MISSION:** `package.json` scripts `test:e2e` / `test:e2e:v0`; document env; optionally extend `.github/workflows/ci.yml` with v0 e2e job (or `v0`-scoped workflow).  
**OWN:** `v0/package.json` scripts, CI yaml under repo for v0 e2e.  
**MUST NOT EDIT:** home section components.

### AGENT-10 MCP QA & Final Scorecard
**MISSION:** MCP browser verify home H1–H10 presence + CTAs; run e2e; write smoke report; scorecard.  
**OWN:** `reports/YYYY-MM-DD-v0-home-i18n-e2e-smoke.md` + `reports/assets/v0-home-*` (or under `v0/reports/`).  
**MUST NOT EDIT** product code unless repair loop ≤3.

### Sub-agent return format (mandatory)

```text
AGENT
MISSION
FILES READ
FINDINGS
DECISIONS
FILES CHANGED
MCP STEPS / TESTS
COMMANDS RUN
RESULTS
BLOCKED TRUTHS
DEBT CREATED
HANDOFF
STATUS: PASS | CONDITIONAL | FAIL
```

---

## 8. Build waves

```text
WAVE W0 — AGENT-00 IA + data matrix (no code)
WAVE A  — AGENT-01 shell + /lab routing
WAVE B  — AGENT-05 data adapter (parallel A OK)
WAVE C  — AGENT-02 H1–H3   (after A+B)
WAVE D  — AGENT-03 H4–H6   (parallel C if different files)
WAVE E  — AGENT-04 H7–H10  (after C/D merge points)
WAVE F  — AGENT-06 vi.json migration (after copy stabilizes on home)
WAVE G  — AGENT-07 ESLint toolchain (parallel F OK)
WAVE H  — AGENT-08 Playwright specs (after home exists)
WAVE I  — AGENT-09 scripts/CI (after H)
WAVE V  — AGENT-10 MCP + e2e + scorecard
```

Every UI wave (A–E, V) ends with MCP evidence. Tooling waves (F–I) end with command output evidence.

---

## 9. Acceptance criteria

### Package A — Home
- [ ] AC1 `GET /` is SPEC home (H1 visible: “Trung tâm Thông tin…” or SPEC-equivalent H1) — **MCP**
- [ ] AC2 CTA “Khám phá 4 dự án” → `/du-an` — **MCP click**
- [ ] AC3 Ghost CTA → `#minh-bach` / H3 visible — **MCP**
- [ ] AC4 H2 stats render 4 tiles (or SPEC-reduced) with real library numbers — **MCP**
- [ ] AC5 H4–H5 show projects; H5 links to `/du-an` — **MCP**
- [ ] AC6 H6 map or region panel present; marker/link filters `/du-an?khu-vuc=` when implemented — **MCP**
- [ ] AC7 H7–H10 present or honestly hidden-empty per SPEC — **MCP scroll screenshots**
- [ ] AC8 `/lab` serves DemoShell (lab preserved) — **MCP**
- [ ] AC9 No regression: dropdown + lightbox still work — **MCP**

### Package B — i18n + ESLint
- [ ] AC10 `vi.json` exists; home H1/H2/H3 + nav labels use `t()` (or documented ≥N keys)
- [ ] AC11 `pnpm --dir v0 lint` exits 0 **or** CONDITIONAL with ≤5 waived legacy issues listed

### Package C — E2E
- [ ] AC12 Playwright config + ≥5 specs under v0; `pnpm --dir v0 test:e2e` (or documented script) passes locally
- [ ] AC13 CI or README documents how e2e runs in automation

### Cross
- [ ] AC14 `pnpm --dir v0 build` green
- [ ] AC15 Smoke report + scorecard: v0 Track A % before/after
- [ ] AC16 No Track B / OAuth / full `/en`

**Forbidden:** Claiming AC1 PASS if `/` still primary DemoShell.  
**Forbidden:** Deleting DemoShell without `/lab` (or equivalent) unless human overrides in-session.

---

## 10. Evidence protocol

Final reply:

```text
VERDICT: V0_HOME_I18N_E2E_MET | PARTIAL | NOT_MET
V0_TRACK_A_PCT_BEFORE: ~81
V0_TRACK_A_PCT_AFTER:  ...
AC1..AC16: PASS|CONDITIONAL|FAIL
MCP_EVIDENCE_INDEX: [...]
E2E_COMMAND: ...
FILES_CHANGED: grouped by Package A/B/C
DEBT: ...
```

---

## 11. Out of scope

- Local `src/app` home replacement
- Admin / passcode / Firebase Auth
- Cloud Function PDF (keep print fallback)
- Full EN locale / language switcher
- Track B WebGL gallery
- Perfect Magic UI parity if deps missing — simplify

---

## 12. Start command

Begin WAVE W0 (AGENT-00). Then A∥B → C∥D → E → F∥G → H → I → V.  
Return all 11 STATUS blocks + final verdict.

Success line only if Package A ACs core (AC1–AC3, AC8–AC9) PASS and B/C not FAIL:  
`v0 home H1–H10 + i18n/eslint + e2e — Track A completion wave MET.`
```
