# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v0 — COMMERCIAL AUDIT → IMPLEMENT 50% (Quick Wins + Phase-1)
# Source audit: v0/reports/2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md
# Style parent (form ONLY): v0/prompts/2026-07-23-claude-v0-score-lift-independent-review-200-mcp.md
# Prior closures (do NOT redo unless FAIL on re-verify):
#   - IA `/so-sanh` sole compare: reports/2026-07-24-v0-ia-so-sanh-du-an-dedupe.md
#   - Indep eval (prod parity / LuxuryIndex): reports/2026-07-24-v0-indep-eval-browser-first.md
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: IMPLEMENT — BROWSER-FIRST VERIFY → CODE → GATE → SMOKE
# Sub-agents: **6** (all must run; Orchestrator merges)
# Max repair loops: 2 (tsc / e2e / visual only)
# Target: Close **≥50%** of audit §V actionable work by IMPACT weight (not line-count)

---

## 0. How to use

You are the **Commercial Audit Closure Lead** for Track A (UI shell — no Firebase/backend).

1. **Read the audit once** (`2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md`) — treat §V roadmap as backlog; treat §II “false positives” and “do not touch” as sacred.
2. **Browser / live FIRST** on `http://localhost:3000` (`pnpm`/`npm` `dev` webpack). Spot-check prod `https://de-division-pmh.vercel.app` only for deploy-parity notes (S1).
3. Evidence stack (document which worked):
   - **A.** Cursor Playwright MCP — navigate, screenshot, console
   - **B.** Fallback script under `scripts/commercial-50-*.mjs` if MCP fails → mark **MCP=CONDITIONAL**
4. Inventory what is **already fixed** since audit date (IA dedupe, card hover, map shimmer, Fraunces/footer local+prod). Credit them toward the 50% weight — do not re-implement.
5. Implement only **IN-SCOPE** items below. Stop when AC + 50% weight met.
6. No commit/push unless human asks in a later message.

**Scope lock:**
```text
WRITE: app/not-found.tsx, app/error.tsx (required if missing)
       components/shared/mobile-nav.tsx, site-header (nav i18n)
       components/project/project-card.tsx (hover residual ONLY if FAIL)
       next.config.* / image remotePatterns + minimal next/image|onError fallback (Phase-1 ONLY)
       lib/i18n/*.json (keys for 404/error/nav)
       e2e/* for new surfaces
       scripts/commercial-50-*.mjs (optional evidence)
       reports/2026-07-24-v0-commercial-audit-50pct-smoke.md
       reports/assets/commercial-50-*.png
READ:  audit thương mại, IA dedupe report, indep-eval browser-first, WHAT_YOU_BUY, I18N_EN.md
NO:    full image download/self-host pipeline (Wave-2)
       gallery virtualization / page-route Framer transitions
       Firebase/RBAC/Algolia/AI
       redesign home/map; touching StatusBadge / library-bridge honesty
       inventing “100% audit done”; commit/push
```

---

## 1. Orchestrator — 50% weight model (NON-NEGOTIABLE)

Score closure by **impact weight** from audit §I + §V (total 100). This wave must reach **≥50**.

| ID | Work item | Weight | Status rule |
|----|-----------|--------|-------------|
| W1 | Prod deploy parity (Fraunces + footer; no stale Transparency) | 15 | VERIFY only — document PASS/FAIL; deploy is **human-gated** (do not force push) |
| W2 | Brand `not-found.tsx` + `error.tsx` (SiteHeader + CTA home) | 15 | IMPLEMENT if missing |
| W3 | Mobile drawer + desktop “Dự án” dropdown locale-reactive EN | 10 | IMPLEMENT if FAIL |
| W4 | Project card hover lift + shadow | 8 | VERIFY; implement only if live FAIL |
| W5 | IA `/so-sanh` vs `/du-an?xem=bang` single source | 10 | VERIFY via IA report + live; no redo if PASS |
| W6 | Map/list loading shimmer (not plain static text only) | 7 | VERIFY; tiny fix only if FAIL |
| W7 | Image Phase-1 risk cut: `images.remotePatterns` + prefer `next/image` **or** honest `onError` placeholder on hotlinked gallery/detail (NO bulk download) | 20 | IMPLEMENT minimal Phase-1 |
| W8 | Smoke report + e2e/tsc gate + PNGs | 15 | REQUIRED |
| — | **OUT this wave:** full self-host image pipeline, route transitions, gallery virtualize, strategy packaging | (50 remaining) | Explicitly list as Wave-2 |

**Done formula:** `sum(weights of PASS items) ≥ 50` AND all ACs PASS.

Expected path if W1/W4/W5/W6 already PASS: implement **W2 + W3 + W7 + W8** → typically **15+10+20+15 = 60** plus verified credits.

---

## 2. Non-negotiables

1. Do **not** break: StatusBadge 5-label system, CMDK, lightbox, compare accordion @375, library-bridge mock fallback, ADR-001 honesty.
2. Browser evidence before marking any W* PASS.
3. If MCP fails: script fallback; still finish wave.
4. Image Phase-1 must **not** claim “self-hosted” — report must say residual hotlink risk remains until Wave-2.
5. Vietnamese smoke body for PM; keep W-table bilingual or VI.
6. Preserve design language (Fraunces display, `--radius`, existing tokens) — no purple/AI-slop redesign.

---

## 3. Sub-agents (6)

### Agent A — Inventory + browser gap map (MUST START)
- Re-read audit §II/§V; open local 6 routes + `/du-an/khong-ton-tai-123` (expect default 404 today).
- EN switch: mobile ☰ + desktop “Dự án” dropdown — FAIL/PASS.
- Card hover, `/so-sanh` canonical, map loading, prod home spot-check.
- Output: W1–W6 preliminary PASS/FAIL table + PNG `commercial-50-inventory-*`.
- **Do not implement yet** — handoff list only.

### Agent B — Brand error boundaries (W2)
- Add `app/not-found.tsx` and `app/error.tsx` reusing `SiteHeader` (or minimal branded chrome if header needs catalog props — then use shared shell pattern already in repo).
- CTA “Về trang chủ” → `/`; VI (+ EN keys if reactive surface).
- Verify HTTP 404 on bad slug still branded (not Next white default).

### Agent C — Nav i18n EN (W3)
- Fix mobile drawer labels + desktop “Dự án” to follow locale switcher (same path as Compare/Legal).
- Update `I18N_EN.md` honesty if claim changes.
- MCP/script: switch EN → screenshot drawer + dropdown.

### Agent D — Residual polish verify/fix (W4–W6)
- Confirm card `motion-safe:hover:-translate-y` + shadow; patch only if missing.
- Confirm IA dedupe still true (no `CompareTable` on `/du-an`).
- Confirm map shimmer still present; no drive-by luxury redesign.

### Agent E — Image Phase-1 (W7)
- Inventory hotlink hosts (e.g. `honghacphumyhung.vn`).
- Configure Next image allowlist / `remotePatterns` as needed.
- Migrate **highest-visibility** surfaces (detail hero + gallery thumbs OR project cards) to `next/image` **or** add `onError` → local placeholder — pick one coherent approach; document residual % still hotlinked.
- **Forbidden:** multi-hour download-all-to-`/public` pipeline (Wave-2).

### Agent F — Gate + smoke merge (W8)
- `pnpm exec tsc --noEmit`; e2e via `pnpm test:e2e` or `playwright test -c e2e/playwright.config.ts` (full or critical+new 404/i18n specs).
- Write `reports/2026-07-24-v0-commercial-audit-50pct-smoke.md` with weight math, CLAIM vs LIVE, Wave-2 backlog.
- PNGs `commercial-50-*-after.png`.

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | Agent A inventory table exists before product edits |
| AC2 | Weight sum of PASS ≥ **50**/100 with transparent math |
| AC3 | Branded `/du-an/…` unknown slug — SiteHeader + home CTA (not stock Next 404) |
| AC4 | EN: mobile drawer + “Dự án” dropdown translate (or documented CONDITIONAL with fix attempt) |
| AC5 | Image Phase-1 landed + report states residual hotlink risk honestly |
| AC6 | tsc 0; e2e green for touched surfaces; no regress compare@375 / home compare CTA |
| AC7 | Sacred “do not touch” list intact (StatusBadge, CMDK, lightbox, bridge) |
| AC8 | Smoke path exact: `reports/2026-07-24-v0-commercial-audit-50pct-smoke.md` |
| AC9 | No commit/push; no Wave-2 scope creep |
| AC10 | Executive line: “Đóng **N**/100 trọng số audit §V trong wave này (mục tiêu ≥50)” |

**Scorecard:** PASS if AC1–AC10 met.

---

## 5. Deliverables

```text
app/not-found.tsx
app/error.tsx
(nav / i18n / image Phase-1 diffs as needed)
reports/2026-07-24-v0-commercial-audit-50pct-smoke.md
reports/assets/commercial-50-*.png
optional: scripts/commercial-50-capture.mjs
```

Smoke outline:
1. Executive (N/100 weight + what deferred)
2. Method + MCP path
3. W1–W8 table PASS/FAIL + evidence
4. CLAIM audit vs LIVE (stale deploy claims called out)
5. Diff summary (files)
6. Wave-2 backlog (full image self-host, transitions, gallery virtualize)
7. AC table

---

## 6. Done when

PM can demo without stock Next 404 or broken EN nav; image risk is **mitigated Phase-1** (not eliminated); weight ≥50; Wave-2 list is explicit.

---

## 7. Anti-patterns

- Re-doing IA dedupe / full luxury redesign “while here”
- Claiming image problem “fixed” after only remotePatterns with 0 UI change
- Deploying/pushing without human ask
- Treating audit’s live Inter/no-footer as still true without re-check (likely stale)
- Building RBAC/Firebase “to raise commercial score”
- Absolute /200 scoring theater — this wave is **commercial §V closure**, not score-lift review
