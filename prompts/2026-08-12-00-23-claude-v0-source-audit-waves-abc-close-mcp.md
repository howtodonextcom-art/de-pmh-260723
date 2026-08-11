# CLAUDE CODE MULTI-AGENT MASTER PROMPT
# DED-PMH — SOURCE-FIRST AUDIT WAVES A→B→C CLOSE (P0–P2)
# Status: MASTER — implements remaining work from source-first audit §7
# Evidence parents (MUST follow; do not invent extra scope):
#   120826-0009-audit/source-first-audit.md
#   Effort WBS (chat 2026-08-12): Wave A P0 · B P1 · C P2
# Style parents (form ONLY):
#   prompts/2026-07-23-claude-v0-luxury-sellability-MASTER-4h-mcp.md
#   prompts/2026-07-24-claude-v0-commercial-audit-remainder-wave2-mcp.md
#   prompts/2026-07-20-02-55-claude-v0-final-remainder-99-mcp.md
# Primary workspace: Z:\Coding\260723-de-pmh
# Mode: IMPLEMENT → GATE → SMOKE (Vietnamese executive)
# Wall-clock budget: ~13–28h eng (execute fully; do not stop after Wave A)
# Sub-agents: **6** mandatory (hard floor **≥5** — Orchestrator MUST spawn all listed agents; no collapsing into 1–2 agents)
# Max repair loops / wave: 3
# Human pre-authorization (THIS WAVE):
#   Do NOT pause for mid-run aesthetic OK.
#   Do NOT commit/push unless human explicitly asks in a later message.
#   Git identity rules in CLAUDE.md apply only if human later asks to push.
# Defaults for prior blocking questions (locked unless human edits this prompt):
#   Q1 P2-img: DEFER enabling Next image optimization — document CONDITIONAL; do not flip
#              images.unoptimized to false without CDN proof.
#   Q2 CI: Add local package.json typecheck script; GitHub Actions OPTIONAL only if trivial
#          (repo currently has no .github/workflows — prefer script-first).
#   Q3 P0-3: Production fail-closed — NO silent mock catalog when vendor load fails;
#            show honest error UI (or throw into error boundary); mock allowed in development only.
# Frozen:
#   Teal tokens · Fraunces/Inter · COMPARE_COLUMN_CAP=4 · legal single-project ·
#   PDF honesty (print fallback) · MapLibre Wave-2 behavior · NO purple/cream/glow rebrand ·
#   NO Firebase/Algolia/Enterprise · NO force-push · NO --global git config

---

## 0. Coverage map (read first)

| Wave | ID | Work | Feature ID | Primary owner agent |
|------|----|------|------------|---------------------|
| A P0 | P0-1 | Delete agent debug ingest `127.0.0.1:7465` | F1 | AGENT-02 |
| A P0 | P0-2 | `ignoreBuildErrors: false` + typecheck script (tsc already 0 at audit time) | F2 | AGENT-02 |
| A P0 | P0-3 | Prod fail-closed on library load; mock only in development | F3 | AGENT-02 |
| A | Verify | build + smoke `/` `/du-an` `/so-sanh` `/phap-ly` | F4 | AGENT-03 |
| B P1 | Brand hygiene | Drop `generator: "v0.app"`; rename package `my-project` | F6 | AGENT-04 |
| B P1 | `/lab` leakage | Confirm unlinked from public nav; keep noindex | F7 | AGENT-04 |
| B P1 | Mobile zone/group IA | Port taxonomy into MobileNav | F5 | AGENT-04 |
| C P2 | Dark contrast | Legal dialog + map chrome | F9 | AGENT-05 |
| C P2 | Home first-viewport budget | One composition / one job — trim or reorder sections | F10 | AGENT-05 |
| C P2 | Image optimization | DEFER flip; write residual note only | F8-CONDITIONAL | AGENT-05 + AGENT-06 |

Prior audits/prompts already shipped compare/legal IA — **do not rebuild** `/so-sanh` matrix or `/phap-ly` single-project unless regression found.

---

## 1. How to use

You are the **DED-PMH Source-Audit Waves A→B→C Orchestrator** (Claude Code / Cursor Agent with Task/sub-agent support).

1. Execute Phase 0→5 in order; features **F1→F10** sequential within wave; waves A then B then C.
2. **HARD REQUIREMENT — multi-agent:** Spawn **all 6** agents below (floor **≥5**). Do **not** solo-implement everything in one thread and “pretend” agents ran. If the runtime only allows sequential Task calls, still launch each agent as a distinct Task with exclusive OWN files and collect each STATUS block.
3. No conflicting parallel writes on the same file (AGENT-02 ∥ AGENT-04 only when file sets disjoint; prefer sequential waves).
4. Dev: `pnpm dev` (webpack) on `http://localhost:3000` (`allowedDevOrigins` preserved).
5. Verify UI with MCP browser preferred; else Playwright / manual smoke — document which.
6. No mid-run human questions; use Defaults above.
7. Stop at smoke report — **no commit/push**.

Scope lock:
```text
WRITE: app/page.tsx, app/layout.tsx, instrumentation.ts,
       components/home/region-map-canvas.tsx,
       components/home/* (only if F10 requires),
       components/shared/mobile-nav.tsx,
       components/project/legal-dossier-table.tsx (F9 contrast only),
       components/home/vn-map.tsx (F9 only if needed),
       lib/library-bridge.ts,
       next.config.mjs (ignoreBuildErrors; DO NOT enable image opt),
       package.json (name + typecheck script only),
       lib/i18n/** (keys for mobile IA / error UI if needed),
       e2e/** (mobile nav / regression if needed),
       reports/2026-08-12-v0-audit-waves-abc-smoke.md
READ:  120826-0009-audit/source-first-audit.md,
       lib/project-nav-taxonomy.ts, project-nav-dropdown.tsx (pattern for F5),
       CLAUDE.md (identity — push only if later asked)
NO:    silent mock in production, redesign compare/legal, Firebase/RBAC,
       flipping images.unoptimized without CDN, commit/push, force-push,
       rewriting MapLibre init, inventing P3 enterprise features,
       collapsing sub-agents into a single implementer
```

---

## 2. Pipeline

```text
Phase 0 IDEATE   — AGENT-01 only: grep 7465; confirm tsc; inventory mobile vs dropdown
Phase 1 WAVE A   — AGENT-02: F1 → F2 → F3
Phase 2 WAVE A   — AGENT-03: F4 gate (≤3 repair handoffs back to AGENT-02)
Phase 3 WAVE B   — AGENT-04: F6 → F7 → F5
Phase 4 WAVE C   — AGENT-05: F9 → F10 → F8 residual note
Phase 5 CLOSE    — AGENT-06: AC merge + reports/2026-08-12-v0-audit-waves-abc-smoke.md
```

Orchestrator merges STATUS blocks; final reply must include **all 6** agent STATUS lines (or ≥5 if one agent is N/A with written reason — prefer never N/A).

---

## 3. Feature DoD (NON-NEGOTIABLE)

### F1 — Strip agent debug (P0-1)
**Files:** `app/page.tsx`, `instrumentation.ts`, `components/home/region-map-canvas.tsx`  
**DoD:**
- [ ] Zero matches for `127.0.0.1:7465` and `#region agent log` under app/ components/ instrumentation
- [ ] `instrumentation.ts` either empty/no-op register or prod-safe only — no localhost ingest timer
- [ ] Evidence: grep output in smoke

### F2 — Typecheck gate (P0-2)
**Files:** `next.config.mjs`, `package.json`  
**DoD:**
- [ ] `typescript.ignoreBuildErrors` removed or `false`
- [ ] Script e.g. `"typecheck": "tsc --noEmit"`
- [ ] `pnpm typecheck` exits 0
- [ ] GitHub Actions: skip unless adding a minimal workflow is trivial; document choice

### F3 — Prod fail-closed library (P0-3)
**Files:** `lib/library-bridge.ts` (+ minimal error UI on consumers if needed)  
**DoD:**
- [ ] `NODE_ENV === "production"`: on library load failure → **do not** return mock silently
- [ ] Development: mock fallback may remain
- [ ] User-visible honest error (banner and/or `error.tsx` path) — no fake “4 projects” from mock in prod
- [ ] Evidence: code citation + note how tested (dev mock still works)

### F4 — Wave A verify
**DoD:**
- [ ] `pnpm build` green
- [ ] Smoke routes `/` `/du-an` `/so-sanh` `/phap-ly` load (MCP or Playwright)
- [ ] No console product errors from removed ingest (failed fetch to 7465 gone)

### F5 — Mobile taxonomy IA (P1)
**Files:** `components/shared/mobile-nav.tsx`, `lib/project-nav-taxonomy.ts` (read), i18n  
**DoD:**
- [ ] Mobile menu exposes Phía Bắc / Phía Nam → (Nam) Site A | Outsite
- [ ] Live leaves link to `/du-an/{slug}`; coming-soon non-navigable + label
- [ ] Dialog a11y preserved (`DialogTitle`, focus)
- [ ] Evidence: screenshot @375 mobile nav open

### F6 — Brand hygiene (P1)
**DoD:**
- [ ] `app/layout.tsx` metadata: no `generator: "v0.app"`
- [ ] `package.json` `"name"` reflects de-pmh / ded-pmh (not `my-project`)

### F7 — `/lab` not in public nav (P1)
**DoD:**
- [ ] Grep: no customer nav link to `/lab` in `site-header` / `mobile-nav` / footer
- [ ] `app/lab/page.tsx` keeps `robots: { index: false, follow: false }`
- [ ] If already true: document PASS with evidence — no drive-by rewrite of DemoShell

### F8 — Image optimization (P2) — CONDITIONAL BY DEFAULT
**DoD:**
- [ ] **Do not** set `images.unoptimized: false` in this wave
- [ ] Smoke lists residual: “CDN/policy not proven — deferred”
- [ ] Optional: list call sites that would benefit later (read-only note)

### F9 — Dark contrast (P2)
**Files:** legal dialog + map chrome (+ tokens if needed)  
**DoD:**
- [ ] Dark theme: legal dialog text/chrome readable; map loading/chrome not washed out
- [ ] Evidence: dark screenshots `/phap-ly` (dialog open if possible) + home map section

### F10 — Home first-viewport budget (P2)
**Files:** `app/page.tsx`, `components/home/*` as needed  
**DoD:**
- [ ] First viewport reads as **one composition**: brand + one headline + one support + one CTA group + one dominant visual — not a section stack competing in fold
- [ ] Do **not** reintroduce StatStrip vanity metrics
- [ ] Preserve MotionConfig reduced-motion
- [ ] Evidence: desktop + mobile home above-the-fold screenshots + short rationale of what moved below fold

---

## 4. Sub-agents (**6** mandatory · floor **≥5**)

Orchestrator MUST create distinct agent runs (Claude Code Task / subagent_type as available). Each agent returns the STATUS block below. **Skipping agents to “save time” = FAIL this prompt.**

### AGENT-01 — Librarian / Phase 0 (MUST START · read-only)
**MISSION:** Grep all `7465` / `#region agent log` sites; confirm `pnpm exec tsc --noEmit`; inventory `mobile-nav.tsx` vs `project-nav-dropdown.tsx` + taxonomy leaves; note `/lab` link presence.  
**OWN:** read-only → handoff inventory markdown in reply.  
**MUST NOT EDIT** product code.  
**DONE-WHEN:** Inventory table handed to Orchestrator + AGENT-02.

### AGENT-02 — Wave A implementer (P0)
**MISSION:** Implement F1, F2, F3 exclusively.  
**OWN:** `app/page.tsx` (agent-log only), `instrumentation.ts`, `components/home/region-map-canvas.tsx` (agent-log only), `next.config.mjs`, `package.json` (typecheck script; leave `name` for AGENT-04), `lib/library-bridge.ts`, minimal prod error UI if required.  
**MUST NOT EDIT:** `mobile-nav.tsx`, home section composition (F10), legal dialog styling (F9).  
**DONE-WHEN:** F1–F3 DoD checkboxes met; handoff to AGENT-03.

### AGENT-03 — Wave A gate / QA
**MISSION:** F4 — `pnpm typecheck`, `pnpm build`, smoke 4 routes; grep proves F1 clean; ≤3 repair loops requesting AGENT-02 fixes.  
**OWN:** commands + smoke notes; may add/adjust e2e only if P0 regression needs a lock.  
**MUST NOT EDIT:** feature code except tiny test fixtures.  
**DONE-WHEN:** F4 PASS → unlock Wave B.

### AGENT-04 — Wave B (P1 brand + lab + mobile IA)
**MISSION:** F6 → F7 → F5 (mobile last; largest). Reuse `lib/project-nav-taxonomy.ts` + patterns from `project-nav-dropdown.tsx`.  
**OWN:** `app/layout.tsx` (metadata generator), `package.json` (`name` only), `components/shared/mobile-nav.tsx`, `lib/i18n/**` keys for mobile IA, optional e2e for mobile hierarchy.  
**MUST NOT EDIT:** `library-bridge.ts`, `instrumentation.ts`, home fold (F10).  
**DONE-WHEN:** F5–F7 PASS with @375 evidence note.

### AGENT-05 — Wave C (P2 polish)
**MISSION:** F9 dark contrast → F10 home first-viewport → F8 CONDITIONAL residual note (no image-opt flip).  
**OWN:** `components/project/legal-dossier-table.tsx` (contrast), `components/home/vn-map.tsx` / map chrome as needed, `app/page.tsx` (section order/fold only — do not reintroduce agent logs), `components/home/*` for fold budget, `app/globals.css` only if contrast tokens needed.  
**MUST NOT EDIT:** `next.config.mjs` images block to enable optimization; `library-bridge.ts`.  
**DONE-WHEN:** F9–F10 PASS; F8 documented CONDITIONAL.

### AGENT-06 — Final gate + smoke report
**MISSION:** Merge all agent STATUS; verify AC1–AC12; write smoke report; list residuals.  
**OWN:** `reports/2026-08-12-v0-audit-waves-abc-smoke.md` (+ optional `reports/assets/audit-abc-*.png`).  
**MUST NOT EDIT** product code unless ≤3 emergency repair loops for AC FAIL (then re-run affected agent).  
**DONE-WHEN:** Smoke file exists; verdict line ready.

### Sub-agent return format (required from each)

```text
AGENT: AGENT-0N
MISSION: ...
FILES READ: ...
FILES CHANGED: ...
COMMANDS: ...
RESULTS: ...
BLOCKED: ...
DEBT: ...
HANDOFF: ...
STATUS: PASS | CONDITIONAL | FAIL
```

### Anti-collapse rule

If the model attempts to “do everything myself”:
1. Stop product edits.
2. Spawn AGENT-01…AGENT-06 (or at least AGENT-01…AGENT-05 + Orchestrator acting as AGENT-06).
3. Resume only after ≥5 STATUS blocks exist.

---

## 5. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC0 | ≥5 distinct sub-agent STATUS blocks present in final reply (prefer 6) |
| AC1 | F1: zero `7465` / agent-log regions in listed files |
| AC2 | F2: ignoreBuildErrors off; `pnpm typecheck` = 0 |
| AC3 | F3: prod path cannot silently serve mock |
| AC4 | F4: build green; 4 routes smoke PASS |
| AC5 | F5: mobile hierarchy IA live @375 |
| AC6 | F6: no v0 generator; package renamed |
| AC7 | F7: `/lab` not in public nav; noindex intact |
| AC8 | F8: CONDITIONAL deferred note present (no silent enable) |
| AC9 | F9: dark contrast evidence |
| AC10 | F10: home fold matches one-composition DoD |
| AC11 | No compare/legal/PDF honesty regression |
| AC12 | Smoke report written; **no commit/push** |

**PASS** iff AC0 + AC1–AC7 + AC9–AC12 PASS and AC8 CONDITIONAL-or-PASS.  
**FAIL** if any P0 (F1–F3) incomplete OR fewer than 5 agent STATUS blocks.

---

## 6. Deliverables

```text
Code for F1–F7, F9–F10 (+ F8 note in smoke only)
reports/2026-08-12-v0-audit-waves-abc-smoke.md
optional: reports/assets/audit-abc-*.png
e2e updates if F5 needs regression lock
Final reply: AGENT-01 … AGENT-06 STATUS blocks
```

Smoke outline (VI):
1. Executive: Waves A/B/C closed?
2. Multi-agent rollup (who did what)
3. Grep evidence F1
4. typecheck + build
5. F3 prod behavior note
6. Mobile IA + home fold + dark screenshots
7. AC table (including AC0)
8. Residuals (F8 CDN, etc.)

---

## 7. Done when

PM can ship knowing: no debug ingest, typecheck gated, prod won’t fake catalog from mock, mobile IA matches desktop taxonomy, brand crumbs cleaned, `/lab` contained, dark legal/map usable, home fold is one composition — with image-opt explicitly deferred — and the run was executed by **≥5 sub-agents** with STATUS evidence.

---

## 8. Anti-patterns

- Collapsing to a single agent / “I’ll just implement all waves”
- Leaving one `7465` fetch “for later debugging”
- Keeping `ignoreBuildErrors: true` because “tsc is already clean”
- Prod still falling through to mock “so the demo never blanks”
- Rebuilding compare/legal “while we’re here”
- Enabling Next image optimization without CDN proof
- Re-adding StatStrip / vanity counters on home
- Commit/push without explicit human ask
- Asking human mid-run for choices already Defaulted in header

---

## 9. Start command

Begin Phase 0: spawn **AGENT-01**. Then AGENT-02 → AGENT-03 → AGENT-04 → AGENT-05 → AGENT-06.  
Success line only if AC PASS:  
`Source-audit Waves A→B→C CLOSED — ≥5 agents · P0 gated · P1 mobile+brand · P2 polish · F8 deferred · no push.`
