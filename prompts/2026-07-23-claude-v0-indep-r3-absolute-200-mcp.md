# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — ROUND 3 INDEPENDENT SCORE GATE (Absolute /200, MCP-first)
# Claims under review:
#   - smoke: reports/2026-07-23-v0-score-lift-clean-smoke.md (97/100)
#   - indep R1+R2: reports/2026-07-23-v0-score-lift-independent-review.md (§1–§10; Track A 91–93, Abs ~119–121)
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: VERIFY-ONLY — BROWSER-FIRST (MCP) — NO PRODUCT CODE — NO COMMIT/PUSH
# Parents (form): prompts/2026-07-23-claude-v0-score-lift-independent-review-200-mcp.md
# Sub-agents: **5** · Max repair loops: 0 (1 only if evidence capture script fails)
# Target: One definitive Absolute **N/200** + Track A **M/100** + full checklists; reconcile R1/R2

---

## 0. How to use

1. Adversarial to BOTH smoke 97 AND prior indep numbers — re-prove on live surfaces.
2. **MCP Playwright FIRST** (`project-0-v0-playwright`): navigate, evaluate, screenshot, console.
   - If MCP fails (chrome-for-testing missing): install/fix channel OR fall back to
     `scripts/indep-scorelift-verify.mjs` + document **MCP=CONDITIONAL**.
3. Local: `http://localhost:3000` (prefer clean warm server; if port busy use existing, note PID).
4. Prod: `https://de-division-pmh.vercel.app` via MCP + optional Vercel MCP fetch.
5. Then codebase/orphan/gate. **Do not** trust §10 without re-check.
6. Append **§11 Round 3** to the existing independent-review.md (do not overwrite §1–§10).
7. No product edits. No commit/push/deploy.

Scope lock:
```text
WRITE: reports/2026-07-23-v0-score-lift-independent-review.md (§11 append only)
       reports/assets/indep-r3-*.png (+ optional findings.json)
       optional: scripts/indep-r3-verify.mjs if needed
READ:  smoke + indep report §1–§10; app/; components/; lib/i18n/; e2e/
NO:    redesign, score-lift code changes, commit/push, inventing scores
```

---

## 1. Dual scoreboard (mandatory)

### Track A /100 (same pillars)
A/30 · B/25 · C/15 · D/30 with D = round(avg(01–08)×3) — **forbid “all ≥8 ⇒ D=30”**.

**Chốt một số** Track A (không khoảng). Rule e2e:
- Chạy full suite **2 lần** nếu scrollZoom fail lần 1 (warm server).
- Fail cả 2 → trừ B; pass ≥1 warm run → không trừ B (flake), ghi CONDITIONAL.

### Absolute /200 = TrackA + Stretch
Stretch S1–S6 (/20,/20,/15,/15,/15,/15) — same rubric as Round 1 prompt.
**Không** Absolute = TrackA×2.
Executive must state: **“Với trần 200, hiện tại thực tế = N/200.”**

---

## 2. Full checklists (all required)

### 2.1 Design 01–08 (0–10 each, live evidence)
01 POV · 02 Typography · 03 Color · 04 Hierarchy · 05 Imagery · 06 Motion · 07 Mobile · 08 Invisible

### 2.2 Hypotheses H1–H10 (PASS/FAIL/CONDITIONAL)
H1 Fraunces H1 (note /lab Inter) · H2 footer · H3 /phap-ly hierarchy · H4 no minh-bach local ·
H5 sitemap+robots local · H6 lab noindex/banner · H7 orphan i18n=0 · H8 no input-group ·
H9 map canvas+HH UTM · H10 smoke 97 unjustified (expect ADJUST)

### 2.3 Gate checklist
- [ ] tsc --noEmit = 0
- [ ] next build green (note route count)
- [ ] playwright full suite (record pass count; scrollZoom protocol above)
- [ ] orphan i18n rescan = 0; vi/en key parity
- [ ] MCP or script evidence for 6 routes + prod home + robots/sitemap local + prod robots status

### 2.4 Qualitative (short)
Cân đối/thô · màu · sang trọng · bo tròn (confirm prior radius fix still holds)

---

## 3. Sub-agents (5)

**A — MCP browser (first):** `/` `/du-an` `/du-an/hong-hac-city` `/so-sanh` `/phap-ly` `/lab`; evaluate H1 fontFamily, footer, minh-bach; map markers+CTA; lab banner+robots meta; screenshots `indep-r3-*`. Prod home: font, footer, Transparency. Local+prod `/robots.txt` status.

**B — Code/orphan:** rescan i18n; input-group absent; fonts/footer/sitemap/robots/lab files exist.

**C — Track A re-score:** pillars + 01–08; chốt M/100; AGREE/ADJUST vs 93 claim in §10.5.

**D — Stretch + Absolute:** S1–S6; chốt N/200; ROI deploy estimate if S1 still ~0–3.

**E — Gate + §11 merge:** run tsc/build/e2e; append §11 Round 3 with formula, checklists, AC table; do not delete §10.

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | MCP attempted first; tool path documented |
| AC2 | Live evidence 6 local routes + prod home |
| AC3 | Full 01–08 + H1–H10 + gate checklist completed |
| AC4 | Track A single integer M/100 with pillar math |
| AC5 | Absolute single integer N/200 = TrackA+Stretch |
| AC6 | §11 appended; §1–§10 preserved |
| AC7 | No product code changes; no commit/push |
| AC8 | Explicit sentence: hiện tại thực tế = N/200 |

Scorecard PASS iff AC1–AC8.

---

## 5. Done when

PM opens §11 and sees one trusted **N/200** (and M/100), full checklists, and whether deploy remains the #1 ROI — without another exploratory pass.
