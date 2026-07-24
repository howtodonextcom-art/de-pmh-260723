# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v0 — INDEPENDENT COMPLETENESS EVAL (BROWSER → TEST → CODE → MD)
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: VERIFY-ONLY — EVIDENCE ORDER MANDATORY — NO PRODUCT CODE CHANGES
# Parents (form ONLY):
#   prompts/2026-07-23-claude-v0-indep-r3-absolute-200-mcp.md
#   prompts/2026-07-23-claude-v0-luxury-sellability-MASTER-4h-mcp.md (§0 findings as HYPOTHESES only)
# Sub-agents: **6** · Max repair loops: 0 (report-only)
# Target: Honest completeness score + full checklists from LIVE evidence first

---

## 0. Evidence order (NON-NEGOTIABLE)

```text
STEP 1 — BROWSER UI (MCP Playwright preferred; script fallback if MCP fails)
STEP 2 — REAL TESTS (full or critical e2e + manual MCP flows)
STEP 3 — CODEBASE (only to explain / confirm what browser+tests found)
STEP 4 — MARKDOWN (reports/docs/prompts) — LAST; treat as CLAIMS to falsify
```

**Forbidden:**
- Reading maturity/luxury/indep markdown BEFORE finishing Steps 1–2
- Scoring from memory or prior chat conclusions
- “Looks fine” without screenshot path + route + viewport
- Implementing fixes in this wave

If MCP fails: document error, use `scripts/luxury/capture.mjs` / Playwright; mark MCP=CONDITIONAL; continue order.

---

## 1. How to use

1. Ensure `pnpm dev` (webpack) on `http://localhost:3000`.
2. Spawn all 6 agents with exclusive ownership; Orchestrator merges — **browser+test wins** over code and over docs.
3. Spot-check prod `https://de-division-pmh.vercel.app` for Stretch S1 only (local = Track A).
4. Append or write fresh report (prefer new file to avoid bias from old scores).
5. No commit/push unless human asks in a later message.

Scope lock:
```text
WRITE: reports/2026-07-24-v0-indep-eval-browser-first.md
       reports/assets/indep-bf-*.png (+ findings.json)
READ:  live UI, e2e, then app/components/lib, THEN reports/docs (last)
NO:    product code changes, redesign, guessing scores
```

---

## 2. Dual scoreboard (after Steps 1–2 only draft; finalize after 3–4)

### Track A /100
A Feature /30 · B Frontend /25 · C Ops honesty /15 · D UI/UX (avg 01–08 × 3) /30  
D formula: `round(avg(01..08)*3)` — forbid “all ≥8 ⇒ 30”.

### Absolute /200 = TrackA + Stretch(S1–S6)
Same Stretch rubric as R3 prompt. Not TrackA×2.

### Optional LuxuryIndex /100
Run `pnpm luxury:score` ONLY AFTER browser capture; do not copy 71 from old JSON without re-run.

Executive MUST state:
**“Với trần 200, hiện tại thực tế = N/200”** and Track A **M/100**.

---

## 3. Checklists (all required — fill from LIVE)

### 3.1 Design 01–08 (0–10 each)
01 POV · 02 Typography · 03 Color · 04 Hierarchy · 05 Imagery · 06 Motion · 07 Mobile · 08 Invisible  
Each item: ≥3 sub-criteria + screenshot evidence.

### 3.2 Section hypotheses (PASS/FAIL/CONDITIONAL) — observe BEFORE code
H-Hero: Fraunces H1, Ken Burns, LCP console clean?  
H-Map: canvas+pins+HH UTM; loading state = shimmer or still plain text?  
H-Cards: hover lift+shadow or text-only?  
H-Stat: NumberTicker / reveal present?  
H-PhapLy: intro + jump + cards?  
H-Footer: present all routes?  
H-Lab: banner + noindex; H1 Fraunces or Inter?  
H-NoMinhBach: local no Transparency section/CTA  
H-SEO: local robots/sitemap; prod robots status  
H-ProdLag: prod vs local parity

### 3.3 Gate checklist
- [ ] tsc --noEmit  
- [ ] next build (route count)  
- [ ] playwright suite (warm rerun once if scrollZoom flakes)  
- [ ] orphan i18n rescan (after code step)  
- [ ] Screenshots 6 routes desktop + mobile samples + prod home  

### 3.4 Qualitative
Cân đối/thô · màu · sang trọng · bo tròn (--radius) · hiệu ứng đủ/thiếu/ồn

---

## 4. Sub-agents (6)

**A — Browser first (MUST START)**  
Navigate `/` `/du-an` `/du-an/hong-hac-city` `/so-sanh` `/phap-ly` `/lab`; evaluate fonts/footer/map/loading/hover if possible; dark `/`; mobile 375 samples; prod home; robots local+prod. PNGs `indep-bf-*`. **Do not open reports/*.md yet.**

**B — Real tests**  
e2e full or critical+map+locale+pdf; note pass/fail; MCP click flows: explore CTA, map region filter, HH CTA href. **Still no markdown reports.**

**C — Codebase confirm**  
Only after A+B: open files implicated by findings (hero, vn-map, region-map-canvas, project-card, demo-shell, layout, globals). Confirm root cause; no drive-by refactors.

**D — Markdown last**  
Read luxury roadmap, indep §11, valuation audit, MASTER prompt claims — table CLAIM vs LIVE (AGREE/ADJUST/REJECT).

**E — Score merge**  
Compute M/100, N/200, optional LuxuryIndex; section H-* table; 01–08.

**F — Report**  
Write `reports/2026-07-24-v0-indep-eval-browser-first.md` with method order explicit; AC table.

---

## 5. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | Report documents evidence order; screenshots exist before any “score” section |
| AC2 | No citation of old report scores as truth without re-verify |
| AC3 | Full 01–08 + H-* + gate checklist |
| AC4 | Track A single M/100 + Absolute single N/200 |
| AC5 | CLAIM vs LIVE table for ≥5 prior markdown claims |
| AC6 | Prod lag scored in Stretch only |
| AC7 | No product code changes; no commit/push |
| AC8 | Sentence: hiện tại thực tế = N/200 |

---

## 6. Done when

PM trusts N/200 because Steps 1–2 were done first; markdown only used to check drift — not to invent the score.
