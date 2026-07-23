# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Track A Final Remainder (~95% → ~99–100%)
# Packages: Full vi.json coverage · Lint zero · LCP/a11y polish · PDF UX honesty · E2E harden · MCP gate
# Primary workspace: Z:\Coding\260719-DE
# Surface: **v0/ ONLY**
# Mode: IMPLEMENT + MCP-BROWSER-VERIFIED
# Structural parents (form ONLY — no FTMO/ChallengeReady product rules):
#   prompts/CLAUDE_CODE_MULTI_AGENT_ORCHESTRATOR_MASTER_PROMPT.md
#   prompts/CLAUDE_CODE_ORCHESTRATOR_MASTER_PROMPT_V31_DD_REMAINDER_CODE_EXECUTION.md
# Siblings (already MET — do not rebuild):
#   prompts/2026-07-20-01-52-claude-v0-lightbox-dropdown-100-mcp.md
#   prompts/2026-07-20-02-14-claude-v0-home-i18n-e2e-mcp.md
# Baseline (independent review 2026-07-20): v0 Track A ~94–95%
# Max repair loops / wave: 3
# Sub-agents: **7** (all must run)
# Target gate: v0 Track A ≥ **99%** with MCP + e2e green; deferred ≤1% = F8 `/en` + real Cloud Function PDF (out of v0)

---

## 0. How to use

You are Claude Code (or Cursor Agent with equivalent sub-agents). You MUST:

1. Read §2; treat §4 remainder list as the only in-scope work.
2. Spawn **all 7** agents with exclusive ownership; Orchestrator merges.
3. **Hard requirement:** UI-facing ACs need **MCP browser evidence** on `http://localhost:3000` (also spot-check `127.0.0.1:3000` still hydrates — `allowedDevOrigins` must stay). Scroll sections into view before asserting `whileInView` content (do not fail on fullPage opacity:0 artifact).
4. Do not regress: home H1–H10, `/lab`, lightbox, dropdown, compare@375, 13 e2e specs.
5. Stop at §9 AC table + scorecard.

**Scope lock:**
```text
WRITE: v0/** (+ reports evidence under v0/reports/ or reports/assets/)
READ:  src/ via @library only
NO:    src/app edits, Local admin, Firebase Functions deploy, OAuth, Track B, /en routes
```

Do not return only a plan.
Do not commit/push unless the human explicitly asks.

---

## 1. Orchestrator identity

You are the **DED-PMH v0 Final Remainder Orchestrator**.

Mission: Close the **last ~5%** of Track A so v0 is honestly **~99%** complete as a public demo/product shell:

```text
DONE (do not rebuild):
  Home H1–H10 + /lab DemoShell
  Lightbox + nav dropdown 96×64
  /du-an · detail D1–D13 · /so-sanh · /phap-ly
  ESLint toolchain exists; e2e 13 specs exist
  i18n scaffold (partial t() on home/nav)

REMAINING (THIS PROMPT):
  R1  Expand vi.json + migrate remaining user-visible copy
      (du-an, detail chrome, so-sanh, phap-ly, cmdk, lab labels, footers)
  R2  ESLint: 0 warnings — fix unused `idx` in legal-dossier-table.tsx (+ any new)
  R3  LCP polish: hero/LCP images `priority` / loading eager where Next warns
  R4  PDF UX: ensure Xuất PDF / ?export=pdf always triggers honest print toast+print;
      CMDK copy matches reality (no fake “download file” promise in v0)
  R5  E2E: add 2–4 specs for i18n-critical strings + PDF trigger smoke + lint in CI already OK
  R6  MCP final matrix + scorecard ≥99%
```

Architecture:
```text
v0/ = ONLY write surface
```

**99% definition:** All ACs PASS or at most **one** CONDITIONAL on R4 (print-only PDF — already honest). No CONDITIONAL on R1–R3/R5/R6.

---

## 2. Source documents

```text
SPEC_DED_PMH_V2.md                 # F1 vi.json · F6 PDF honesty
v0/reports/2026-07-20-v0-home-i18n-e2e-smoke.md
prompts/2026-07-20-02-55-claude-v0-final-remainder-99-mcp.md   # this file

v0/lib/i18n/vi.json
v0/lib/i18n/t.ts
v0/components/project/detail/pdf-export-trigger.tsx
v0/components/shared/cmdk.tsx
v0/components/project/legal-dossier-table.tsx
v0/components/home/hero.tsx
v0/e2e/*.spec.ts
```

---

## 3. Canonical locks

- Four projects; **Đang triển khai**
- Keep print-CSS PDF fallback — **do not** claim Cloud Function works inside v0
- Do not add language switcher / `/en`
- Preserve `allowedDevOrigins`
- Prefer `t("dot.key")` over new hard-coded Vietnamese in touched files

Runtime: `http://localhost:3000`

---

## 4. Baseline remainder (independent review)

| ID | Gap | Severity |
|----|-----|----------|
| G1 | `t()` only on home + header — list/detail/compare/legal/cmdk still hard-coded | P1 |
| G2 | ESLint warning: unused `idx` in `legal-dossier-table.tsx:80` | P2 |
| G3 | Next LCP advisory on hero/cong-chao images | P2 |
| G4 | PDF is print fallback — OK if UX copy honest everywhere | P1 polish |
| G5 | E2E does not assert i18n keys / PDF path | P2 |
| — | F8 `/en`, real `exportFactSheetPdf` Function | **OUT** (the ≤1%) |

---

## 5. Non-negotiables

1. MCP for any user-visible string/CTA change on critical paths.
2. One owner per file set.
3. Max 3 repair loops / wave.
4. `pnpm --dir v0 lint` → **0 errors and 0 warnings**.
5. `pnpm --dir v0 test:e2e` → all green (including new specs).
6. `pnpm --dir v0 build` green.

---

## 6. Precedence

1. This prompt  
2. SPEC F1 / F6 honesty  
3. Prior MET sibling prompts  
4. Existing v0 patterns (`t()`, SiteHeader, PdfExportTrigger)

---

## 7. Multi-agent topology (**7 agents**)

### AGENT-00 Remainder Librarian
**MISSION:** Inventory hard-coded VI strings in `v0/app/**` + `v0/components/{project,shared}/**` (exclude `node_modules`, `.next`); produce key list for `vi.json`.  
**OWN:** read-only → handoff key map.  
**MUST NOT EDIT** code.

### AGENT-01 i18n Expansion
**MISSION:** Grow `vi.json`; wire `t()` into `/du-an`, detail chrome (hero badges, section titles), `/so-sanh`, `/phap-ly`, CMDK group labels, `/lab` chrome if needed.  
**OWN:** `v0/lib/i18n/**`, call sites under listed surfaces.  
**MUST NOT EDIT:** gallery lightbox logic, next.config.

### AGENT-02 Lint Zero
**MISSION:** Eliminate all eslint warnings/errors in v0 (start with unused `idx`).  
**OWN:** files with lint debt only.  
**DONE-WHEN:** `pnpm --dir v0 lint` clean.

### AGENT-03 LCP & Image Polish
**MISSION:** Fix LCP warnings on home hero + detail hero (and gallery first fold if needed): `priority` / appropriate `sizes`.  
**OWN:** `v0/components/home/hero.tsx`, detail `hero.tsx`, possibly first gallery tile.  
**MCP:** home load — confirm no product console **errors** (LCP advisory gone or reduced).

### AGENT-04 PDF UX Honesty
**MISSION:** Audit CMDK + detail “Xuất PDF” copy; ensure `?export=pdf` and buttons call print fallback with clear toast; no wording that implies a file download from a Cloud Function in v0.  
**OWN:** `pdf-export-trigger.tsx`, `cmdk.tsx` export items, detail sources CTA labels via i18n keys.  
**MCP:** trigger PDF from detail → toast or print path observable.

### AGENT-05 E2E Harden
**MISSION:** Add specs: (1) home H1 from i18n visible, (2) PDF query/button does not 404 and triggers client path, (3) one list/detail string from `t()` if stable. Keep regressions.  
**OWN:** `v0/e2e/**` only.  
**DONE-WHEN:** full suite green.

### AGENT-06 MCP Final Gate & Scorecard
**MISSION:** MCP matrix home→du-an→detail→pdf→so-sanh→phap-ly→lab; lint/e2e/build; write smoke; scorecard ≥99%.  
**OWN:** `v0/reports/YYYY-MM-DD-v0-final-remainder-smoke.md` + assets.  
**MUST NOT EDIT** product code unless ≤3 repair loops.

### Sub-agent return format

```text
AGENT
MISSION
FILES READ
FINDINGS
DECISIONS
FILES CHANGED
MCP STEPS / COMMANDS
RESULTS
BLOCKED TRUTHS
DEBT CREATED
HANDOFF
STATUS: PASS | CONDITIONAL | FAIL
```

---

## 8. Build waves

```text
WAVE W0 — AGENT-00 string inventory
WAVE A  — AGENT-01 i18n expansion
WAVE B  — AGENT-02 lint zero          (parallel A OK if different files)
WAVE C  — AGENT-03 LCP polish         (parallel OK)
WAVE D  — AGENT-04 PDF UX             (after A if sharing cmdk strings)
WAVE E  — AGENT-05 e2e harden         (after A–D stable)
WAVE V  — AGENT-06 MCP + scorecard
```

---

## 9. Acceptance criteria

- [ ] AC1 `vi.json` covers nav + home + list + detail section titles + compare + legal + CMDK groups (spot-check MCP: no obvious raw key leakage like `home.title`)
- [ ] AC2 High-traffic surfaces use `t()` for labels migrated in AGENT-01 (grep: remaining hard-coded VI only in data/content seeds OK)
- [ ] AC3 `pnpm --dir v0 lint` → 0 errors, **0 warnings**
- [ ] AC4 LCP/hero images: no recurring Next LCP console advisory on home cold load **or** documented intentional defer with `priority` on true LCP
- [ ] AC5 PDF: detail + CMDK path triggers print/toast; copy does not promise Cloud Function file in v0 — **MCP**
- [ ] AC6 E2E suite all pass including ≥2 new specs
- [ ] AC7 Regressions: lightbox, dropdown, home CTA, `/lab` — **MCP or e2e**
- [ ] AC8 `pnpm --dir v0 build` green
- [ ] AC9 Smoke report + **v0 Track A ≥ 99%** scorecard
- [ ] AC10 Deferred ≤1% explicitly listed: `/en` (F8), real `exportFactSheetPdf` Function (Local/functions)

**Forbidden:** Claiming 100% full SPEC product (Local admin/auth). This gate is **v0 Track A only**.

---

## 10. Evidence protocol

```text
VERDICT: V0_TRACK_A_99_MET | PARTIAL | NOT_MET
V0_TRACK_A_PCT_BEFORE: ~95
V0_TRACK_A_PCT_AFTER:  ...
AC1..AC10: ...
MCP_EVIDENCE_INDEX: ...
E2E: pnpm --dir v0 test:e2e
DEFERRED_1PCT: F8 /en · Cloud Function PDF
```

---

## 11. Out of scope

- `/en` + language switcher  
- Implementing/calling production Cloud Function from v0  
- Local `src/` admin, passcode, Firestore  
- Track B WebGL  
- Rewriting home H1–H10 again  

---

## 12. Start command

Begin WAVE W0. Then A∥B∥C → D → E → V.  
Return all agent STATUS blocks + verdict.

Success line only if AC9 PASS:  
`v0 Track A final remainder MET — ≈99%, MCP verified.`
```
