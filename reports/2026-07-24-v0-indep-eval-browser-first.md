# DED-PMH v0 — Independent Completeness Eval (Browser → Test → Code → MD)

Ngày: 2026-07-24  
Prompt: `prompts/2026-07-24-claude-v0-indep-eval-browser-first-mcp.md`  
**Thứ tự evidence bắt buộc:** (1) Browser UI → (2) Test thật → (3) Codebase → (4) Markdown claims cuối.

## 1. Executive verdict

**Với trần 200, hiện tại thực tế = 144/200.**  
**Track A = 95/100.**

```text
Track A 95 = A30 + B24 + C15 + D26
Stretch 49 = S1:18 + S2:5 + S3:0 + S4:4 + S5:11 + S6:11
Absolute 144 = 95 + 49
```

So với R3 (~119–122): **+~22–25 Absolute** chủ yếu vì **production đã parity** (Fraunces + footer + hết Transparency + robots 200) và luxury craft local (LuxuryIndex re-run **85**).

## 2. Phương pháp (đúng thứ tự)

| Bước | Tool | Kết quả |
|------|------|---------|
| 1 Browser | MCP `project-0-v0-playwright` + `scripts/indep-bf-capture.mjs` | PNGs `indep-bf-*.png` + `indep-bf-findings.json` |
| 2 Test | `playwright` full | **27/27 PASS**; `tsc` 0; `next build` 14 route |
| 3 Code | Chỉ file liên quan phát hiện | Confirm hover/shimmer/lab font/LCP |
| 4 Markdown | indep §10–§11, luxury roadmap, valuation | CLAIM vs LIVE (§7) |

**Không** lấy điểm từ báo cáo cũ làm sự thật trước khi xong bước 1–2.

## 3. Hypotheses H-* (từ LIVE trước code)

| ID | Kết quả | Evidence |
|----|---------|----------|
| H-Hero Fraunces | **PASS** | MCP + capture: `Fraunces` mọi public route |
| H-Hero LCP clean | **FAIL** | Console vẫn LCP warn — ảnh Regency card (`70638-726.webp`), không phải hero HH (hero đã `priority`) |
| H-Map canvas/pins/UTM | **PASS** (e2e) / **CONDITIONAL** (capture ngắn) | e2e map 5/5 xanh; capture 1.1–2.5s đôi khi `markers:0` + `mapCanvas:false` khi WebGL chậm; HH CTA UTM luôn có |
| H-Map loading luxury | **PASS** (code+DOM) | Loading = pulse dots + `sr-only` text (`vn-map` / `region-map-canvas`); không còn chỉ khung xám + text nhìn thấy |
| H-Cards hover | **CONDITIONAL** | Shadow đổi khi hover (**PASS**); `transform` đo được `none` dù class có `motion-safe:hover:-translate-y-1` — môi trường headless có thể không apply motion-safe; e2e không cover hover |
| H-PhapLy | **PASS** | 4 jump anchors `#…` |
| H-Footer | **PASS** | Footer mọi route local + **prod** |
| H-Lab | **PASS** | Banner nội bộ + `noindex,nofollow`; H1 **Fraunces** (đã có `font-display`) |
| H-NoMinhBach | **PASS** | Local + **prod** không Transparency/`#minh-bach` |
| H-SEO | **PASS** | Local sitemap/robots 200 + disallow `/lab`; **prod robots 200** |
| H-ProdLag | **PASS** (đảo so với R3) | Prod: Fraunces + footer + minh=false |

## 4. Checklist 01–08 (sau browser)

| # | Item | /10 | Ghi chú live |
|---|------|-----|--------------|
| 01 | POV | 9 | Internal hub + footer |
| 02 | Typography | 9 | Fraunces kể cả `/lab` |
| 03 | Color | 8 | Teal; radius 0.5rem |
| 04 | Hierarchy | 9 | `/phap-ly` jump+cards |
| 05 | Imagery | 8 | Ảnh thật; **LCP còn trên card** |
| 06 | Motion | 9 | Ken Burns, shimmer map, card shadow; reduced-motion classes |
| 07 | Mobile | 9 | 375 captures + e2e mobile |
| 08 | Invisible | 9 | SEO local+prod, lab noindex, footer |

Avg = 8.75 → ×3 = 26.25 → **D = 26/30**.

## 5. Qualitative

1. **Cân đối** (local + prod đã khớp hơn).  
2. **Màu ổn**.  
3. **Sang trọng hơn R3** (LuxuryIndex 85).  
4. **Bo tròn:** `--radius: 0.5rem` — không lạm dụng.  
5. **Hiệu ứng:** đủ hơn; LCP card + map cold-load vẫn là điểm trừ nhỏ.

## 6. Gate checklist

- [x] tsc --noEmit = 0  
- [x] next build — 14 routes  
- [x] playwright **27/27** (warm, gồm scrollZoom)  
- [x] orphan i18n 0 (100/100)  
- [x] Screenshots 6 routes + mobile + dark + prod  
- [x] `pnpm luxury:score` → **LuxuryIndex 85** (re-run, không copy số cũ)

## 7. CLAIM vs LIVE (markdown đọc **cuối**)

| Claim (markdown cũ) | LIVE 2026-07-24 | Verdict |
|---------------------|-----------------|---------|
| Absolute ~119–122; S1≈2; prod Inter + Transparency + robots 404 (§10–§11) | Prod Fraunces + footer + no minh + robots 200 | **REJECT (stale)** — deploy đã xảy ra |
| `/lab` H1 Inter (H1 CONDITIONAL) | Lab H1 Fraunces + `font-display` in code | **REJECT (fixed)** |
| Map loading chỉ text thô | Pulse shimmer + sr-only | **REJECT (fixed)** |
| Card hover chỉ text | Shadow hover có; translate class có | **ADJUST** — shadow PASS, transform đo headless CONDITIONAL |
| LuxuryIndex 71 | Re-run **85** | **REJECT (stale)** — đã nâng |
| Smoke claim Track A 97 / D=30 | D vẫn 26 theo công thức | **AGREE** không nhận D=30 |
| e2e 27/27 | 27/27 | **AGREE** |

## 8. Pillars & Stretch

| Pillar | Điểm | Lý do ngắn |
|--------|------|------------|
| A Feature /30 | **30** | 6 route + map e2e + SEO + lab hygiene + prod parity |
| B Frontend /25 | **24** | e2e/orphan/build xanh; −1 console React state-update + LCP card |
| C Ops /15 | **15** | Seed honesty + SEO local/prod |
| D UI /30 | **26** | avg×3 |
| **Track A** | **95** | |
| S1 Prod | **18**/20 | Parity gần đủ; −2 residual (không audit toàn bộ prod routes) |
| S2 EN | **5**/20 | Home switcher only |
| S3 Unit | **0**/15 | |
| S4 PDF live | **4**/15 | Honesty only |
| S5 Design | **11**/15 | LuxuryIndex 85 |
| S6 ADR | **11**/15 | |
| **Stretch** | **49** | |
| **Absolute** | **144/200** | |

## 9. AC table

| ID | Kết quả |
|----|---------|
| AC1 Evidence order + screenshots before scores | **PASS** |
| AC2 Không lấy điểm cũ làm sự thật | **PASS** — re-verify; đánh stale claims |
| AC3 Full 01–08 + H-* + gate | **PASS** |
| AC4 Track A **95** + Absolute **144** | **PASS** |
| AC5 CLAIM vs LIVE ≥5 | **PASS** — §7 |
| AC6 Prod trong Stretch | **PASS** — S1=18 |
| AC7 No product edits / no commit | **PASS** |
| AC8 Câu N/200 | **PASS** — **144/200** |

**Scorecard: PASS.**

## 10. Việc còn lại (không làm trong wave này)

1. Đóng LCP trên ảnh card above-fold (`priority` trên featured đầu tiên nếu đó là LCP).  
2. Xác minh card `translate-y` trên headed browser.  
3. Stretch: full EN / unit tests / live PDF nếu muốn gần 200.
