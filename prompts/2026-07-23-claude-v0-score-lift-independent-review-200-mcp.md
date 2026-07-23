# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — INDEPENDENT REVIEW: Score-Lift claim 85→97 + Absolute score /200
# Claim under review: v0/reports/2026-07-23-v0-score-lift-clean-smoke.md
# Baseline audit: v0/reports/2026-07-22-v0-full-maturity-audit.md (85/100)
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: INDEPENDENT VERIFY — BROWSER-FIRST — NO PRODUCT CODE CHANGES
# Structural parents (form ONLY):
#   v0/prompts/2026-07-22-claude-v0-full-maturity-audit-8ux-mcp.md
#   v0/prompts/2026-07-23-claude-v0-score-lift-clean-100-mcp.md
#   Pattern: “independent review” waves (sellability/remaining-100 indep reports)
# Max repair loops: 0 (report-only). 1 loop only to fix evidence scripts if capture fails.
# Sub-agents: **6** (all must run; Orchestrator merges — browser evidence beats smoke claim)
# Target: Confirm/adjust Track A /100; publish Absolute /200 with transparent formula

---

## 0. How to use

You are an **independent reviewer** (adversarial to the score-lift author). You MUST:

1. **Not trust** the 97/100 claim, D=30/100, or “orphan=0” without re-proof.
2. **Browser / live surface FIRST** on `http://localhost:3000` (`pnpm dev` webpack).
3. Evidence stack (in order; document which worked):
   - **A.** Cursor Playwright MCP (`playwright` in `.cursor/mcp.json`) — navigate, a11y snapshot, screenshot, console
   - **B.** If MCP channel/browser binary fails (known disk wipe / chrome-for-testing issue):  
     `scripts/indep-scorelift-capture.mjs` and/or new `scripts/indep-scorelift-verify.mjs` — same checks
   - **C.** Vercel MCP: spot-check production `https://de-division-pmh.vercel.app` (expect lag vs local — score Stretch, not Track A alone)
4. Then codebase verify: fonts, footer, phap-ly, sitemap/robots, lab noindex, i18n orphan rescan, archive scripts.
5. Re-run or cite: `tsc`, eslint, build, e2e — **do not invent**; if time-boxed, re-run e2e subset critical + cite prior green only as CONDITIONAL.
6. No commit/push. No product fixes in this wave (findings only).

**Scope lock:**
```text
WRITE: v0/reports/2026-07-23-v0-score-lift-independent-review.md
       v0/reports/assets/indep-lift-*.png (+ optional findings.json)
       v0/scripts/indep-scorelift-verify.mjs (ONLY if needed for reproducible checks)
READ:  score-lift smoke, maturity audit, app/, components/, lib/i18n/, e2e/
NO:    redesign, deleting files, “fix while reviewing”, inventing scores without evidence
```

---

## 1. Orchestrator identity + dual scoreboard

You are the **DED-PMH v0 Score-Lift Independent Reviewer**.

### 1.1 Track A score /100 (same formula as maturity audit)

Re-score pillars independently:

| Pillar | Max | Re-verify focus |
|--------|-----|-----------------|
| A Feature | 30 | 6 routes + map Wave-2 + sitemap/robots + lab hygiene; production lag ≠ Track A fail but note |
| B Frontend | 25 | orphans 0, Fraunces wired, archive scripts, tsc/e2e |
| C Backend/ops honesty | 15 | seed path still honest; SEO files exist; deploy still human-gated |
| D UI/UX 01–08 | 30 | Re-score each 0–10 from **live** UI; D=30 only if no remaining design gap under Track A ceiling |

**Verdict vs claim:** AGREE / ADJUST (new total) / REJECT (material overclaim).

### 1.2 Absolute score /200 (NEW — mandatory)

```text
/200 = Track A band (0–100) + Stretch band (0–100)

Track A band = independently verified Track A /100 (may differ from claimed 97)

Stretch band (0–100) — what “tuyệt đối” beyond Track A demo package means:
  S1 Production parity (local features live on vercel.app)     /20
  S2 Full-site EN (not home-only CONDITIONAL)                 /20
  S3 Unit-test layer for pure lib logic                       /15
  S4 Live PDF Function (or equivalent real export)            /15
  S5 Design excellence beyond Track A (imagery polish,
     residual hierarchy, a11y depth, motion craft)            /15
  S6 Enterprise path quality (ADR + stubs readiness; NOT
     building RBAC — score honesty of defer + interfaces)     /15
                                                      --------
                                                         100
```

**Rules:**
- Do **not** compute Absolute as `TrackA × 2`.
- Items listed OUT in smoke §8 start near 0–partial unless evidence shows more.
- S1: if prod still shows Transparency / no Fraunces / no footer → low S1 even if local is excellent.
- Publish: `Absolute = TrackA_verified + Stretch_total` with sub-table.

### 1.3 Claims to falsify (must PASS/FAIL each)

From smoke report — treat as hypotheses:

| ID | Claim |
|----|-------|
| H1 | Fraunces on every route H1 (`getComputedStyle` / computed fontFamily) |
| H2 | `<footer>` on all visited routes; uses footer i18n keys |
| H3 | `/phap-ly` has intro + jump nav + per-project cards (not pure dense table) |
| H4 | No `#minh-bach` / Transparency section / old CTA on `/` |
| H5 | `/sitemap.xml` + `/robots.txt` reachable; robots disallows `/lab` |
| H6 | `/lab` shows internal banner + noindex meta |
| H7 | Orphan i18n leaf keys = 0 (rescan method documented) |
| H8 | `input-group.tsx` absent; no imports |
| H9 | Map HH CTA UTM + Wave-2 canvas still OK |
| H10 | Claimed pillar math 97 = A29+B24+C14+D30 is justified (or adjust) |

---

## 2. Non-negotiables

1. Browser evidence before agreeing to any design score (esp. D=30 and Typography 9).
2. If MCP Playwright fails: state exact error, fall back to script, mark **MCP=CONDITIONAL** — still complete review.
3. Production check is required for Stretch S1; Track A scored primarily on localhost.
4. Do not “round up” to 100 Track A or 200 Absolute out of politeness.
5. Vietnamese report body for PM; keep hypothesis table bilingual or VI.

---

## 3. Sub-agents (6)

### Agent A — Live browser (MCP preferred)
- Routes: `/`, `/du-an`, `/du-an/hong-hac-city`, `/so-sanh`, `/phap-ly`, `/lab` + fetch `/sitemap.xml`, `/robots.txt`
- Viewports: 1440×900; 375×812 for `/`, `/phap-ly`, `/so-sanh`
- Dark: `/` once
- Capture: H1 fontFamily, footer presence, phap-ly structure, console errors (filter known dev-load flake)
- PNGs: `reports/assets/indep-lift-*.png`
- Try MCP first; on failure run capture script

### Agent B — Claim vs code (H7–H8 + file inventory)
- Rescan i18n orphans (same method as audit)
- Confirm deleted keys / wired footer keys / new legal.* keys
- Confirm `fonts.ts`, `site-footer.tsx`, sitemap/robots, archive README
- Map Wave-2 files untouched in harmful ways

### Agent C — Track A re-score /100
- Pillars A–D + brief 01–08 (only deltas vs smoke allowed if evidence differs)
- Output AGREE/ADJUST/REJECT + final Track A number

### Agent D — Stretch band /100
- Score S1–S6 with evidence (prod MCP or HTTP+screenshot for S1)
- No inventing Enterprise features

### Agent E — Regression gate
- Prefer full e2e; minimum: home, locale-switch, map, pdf-honesty, phap-ly-related if any
- tsc/build smoke if feasible
- Note flake PAGEERROR under parallel load (do not fail product on proven artifact)

### Agent F — Merge report
- Write independent review with Absolute /200
- List overclaims (if any) and remaining gaps to reach 200
- AC table for this review wave

---

## 4. Acceptance criteria (this review)

| ID | Criterion |
|----|-----------|
| AC1 | Browser-first evidence for 6 routes + sitemap/robots; tool path documented (MCP and/or script) |
| AC2 | H1–H10 each PASS/FAIL/CONDITIONAL with evidence |
| AC3 | Independent Track A /100 stated (agree or adjusted) |
| AC4 | Stretch S1–S6 scored; Absolute /200 = TrackA + Stretch with formula |
| AC5 | Explicit answer: “Với trần 200, hiện tại = **N**/200” in executive verdict |
| AC6 | Prod lag called out for S1; no false Track A penalty beyond honesty |
| AC7 | No product code changes; no commit/push |
| AC8 | Report path: `reports/2026-07-23-v0-score-lift-independent-review.md` |

**Scorecard:** PASS if AC1–AC8 met.

---

## 5. Deliverables

```text
v0/reports/2026-07-23-v0-score-lift-independent-review.md
v0/reports/assets/indep-lift-*.png
optional: findings.json / indep-scorelift-verify.mjs
```

Report outline:
1. Executive verdict (Track A /100 + **Absolute /200**)
2. Phương pháp + tool path (MCP vs fallback)
3. Hypothesis H1–H10
4. Track A pillars + 01–08 (brief)
5. Stretch S1–S6
6. Absolute /200 math
7. Gaps to 200 (ranked)
8. AC table

---

## 6. Done when

PM can trust (or correct) the 97 claim and knows the honest **N/200** without another exploratory pass.

---

## 7. Anti-patterns

- Accepting D=30 because smoke said so
- Absolute = TrackA × 2
- Scoring Stretch as if Enterprise were in scope failures of Track A
- Ignoring production lag
- Guessing font from CSS without runtime check
