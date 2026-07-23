# DED-PMH v0 — UI/UX Luxury Upgrade Roadmap + checklist_score

Ngày: 2026-07-23  
Prompt: `prompts/2026-07-23-claude-v0-uiux-luxury-roadmap-score-mcp.md`  
Tham chiếu pattern: `personal-data-cloud-vault` (`luxury:capture|diff|score|qa`) — **không** merge Firebase/Algolia.  
Tools gốc `../tools/260528-codex`: **không tìm thấy trên disk** → schema score tái dựng (capture → diff → checklist_score).

## 1. Executive verdict

**LuxuryIndex = 71/100** (local, browser-verified).

```text
Design01_08  = 8.38/10   (01–08)
Effects      = 6.33/10   (B1–B6)
ToolingGap   = 5.80/10   (C1–C5 vs vault pattern)
LuxuryIndex  = round((8.38×0.45 + 6.33×0.35 + 5.80×0.20) × 10) = 71
```

v0 đã là **polished internal hub** (Fraunces, teal, footer, `/phap-ly` cards, MapLibre Wave-2). Khoảng cách “luxury” nằm ở: **atmosphere/depth**, **micro-interactions**, **page transitions**, **empty/loading craft**, và **tooling golden-diff** kiểu vault — không phải thiếu font/brand cơ bản.

**Absolute Stretch S5 (ước lượng):** hiện ~**7/15** → nếu làm hết P0–P2 roadmap ~**12/15**. Không đưa Absolute lên 200 chỉ bằng UI.

**Prod lag:** `luxury-baseline-prod-home-1440.png` — vẫn Inter, không footer, còn Transparency. Điểm luxury **local**; ship cần deploy (human-gated).

## 2. Phương pháp

| Layer | Kết quả |
|-------|---------|
| MCP Playwright | PASS — home evaluate (Fraunces, radius 0.5rem, footer) + screenshot |
| `pnpm luxury:capture` | 9 local viewports + prod spot → `luxury-baseline-*.png` |
| Reference recon | `checklist_score.mjs` / `260528-codex` **absent** — reconstructed |
| Motion code audit | framer-motion presets, MotionConfig, hero kenBurns, BlurFade, NumberTicker |

## 3. Qualitative

1. **Cân đối** (local section rhythm rõ).  
2. **Màu ổn** — teal; thiếu accent thứ cấp.  
3. **Sang trọng vừa** — Fraunces giúp thoát template; chưa đạt “vault luxury”.  
4. **Bo tròn:** `--radius: 0.5rem` — **không lạm dụng**.  
5. **Hiệu ứng:** đủ cho hub; **thiếu** route transition + press/spring + atmosphere (không ồn).

## 4. checklist_score — Dimension A (01–08)

| # | Item | /10 | Tiêu chí chính (rút) |
|---|------|-----|----------------------|
| 01 | POV | 9 | Brand-first · internal hub · sau Transparency vẫn đứng |
| 02 | Typography | 9 | Fraunces H1 · Inter body · VN OK · `/lab` Inter trừ điểm nhẹ |
| 03 | Color | 8 | Teal/dark/status OK · thiếu accent variety |
| 04 | Hierarchy | 9 | One-job sections · `/phap-ly` cards · CTA gọn |
| 05 | Imagery | 8 | Ảnh thật · aspect OK · LCP eager warning còn |
| 06 | Motion | 8 | Presets + reduced-motion · chưa luxury presence |
| 07 | Mobile | 8 | 375 home/phap-ly/so-sanh OK |
| 08 | Invisible | 8 | Focus/SEO local · empty states còn utility |

**Avg Design = 8.38/10** · Chi tiết đầy đủ: `reports/assets/luxury-checklist-score.json`

## 5. Dimension B — Effects

| ID | Item | /10 | Gap |
|----|------|-----|-----|
| B1 | Hero presence | 8 | Grid hero — chưa full-bleed atmosphere |
| B2 | Scroll reveal | 7 | Catalogue chưa đồng nhất mọi section |
| B3 | Micro-interactions | 6 | Thiếu press/card lift craft |
| B4 | Page transitions | 4 | Hard cut giữa routes |
| B5 | Map craft | 8 | Wave-2 đạt — không rewrite |
| B6 | Empty/loading | 5 | Chưa skeleton/shimmer luxury |

**Avg Effects = 6.33/10**

## 6. Dimension C — Vault tooling gap

| ID | Item | /10 | Ghi chú |
|----|------|-----|---------|
| C1 | Capture | 7 | `scripts/luxury/capture.mjs` + `pnpm luxury:capture` |
| C2 | Diff | 3 | Stub; cần `luxury-golden/` |
| C3 | Score auto | 7 | `score.mjs` → JSON |
| C4 | Density/whitespace | 7 | Rhythm ổn · nền flat |
| C5 | Depth/atmosphere | 5 | Không purple-glow · thiếu depth có chủ đích |

**Avg Tooling = 5.80/10**

## 7. Lộ trình nâng cấp (P0–P3)

Mỗi mục: problem · evidence · fix · effort · Δ kỳ vọng.

### P0 — Quick wins (S, Δ LuxuryIndex ~+4–6)

1. **Hero LCP** — `loading`/`priority` đã có trên một số chỗ; đóng cảnh báo LCP còn lại trên remote hero. Evidence: next dev LCP warn. Fix: Image. Effort **S**. Δ Imagery +0.5, B1 +0.  
2. **`/lab` H1 `font-display`** — H1 CONDITIONAL. Fix: class trên DemoShell heading. Effort **S**. Δ Typography +0.3.  
3. **Card hover micro** — project cards. Fix: subtle translate/shadow (giữ radius). Effort **S**. Δ B3 +1.  
4. **Lock golden set** — copy approved `luxury-baseline-*.png` → `reports/assets/luxury-golden/`. Effort **S**. Δ C2 +2.

### P1 — Craft (M, Δ ~+8–12)

5. **Atmosphere layer** — soft teal wash / noise / gradient mesh **nhẹ** trên home (không purple). Evidence: bg flat oklch. Effort **M**. Δ C5 +2, B1 +1.  
6. **Unify scroll reveals** — mọi home section dùng `revealUp`/`stagger` từ presets + reduced variants. Effort **M**. Δ B2 +1.5.  
7. **Skeleton/loading craft** — map + catalog. Effort **M**. Δ B6 +2.  
8. **`/phap-ly` residual polish** — typographic table density, sticky jump bar. Effort **M**. Δ Hierarchy +0.5, C4 +0.5.  
9. **Secondary accent** — 1 màu nhấn (amber status đã có) cho link/meta, không đổi primary. Effort **S–M**. Δ Color +0.5.

### P2 — Tooling vault-parity (M, Δ Tooling ~+2–3)

10. **Pixel diff thật** — thêm `pixelmatch` (devDep) vào `diff.mjs`. Effort **M**. Δ C2 +3.  
11. **`luxury:qa:auto`** — script chạy capture→diff→score, fail CI nếu LuxuryIndex < ngưỡng. Effort **M**. Δ C3 +1.  
12. **Viewports mở rộng** — dark `/phap-ly`, detail mobile. Effort **S**. Δ C1 +0.5.

### P3 — Out of scope (không làm trong UI wave)

13. Firebase / Algolia / `motion` package swap từ vault.  
14. Full-site EN / PDF Function / Enterprise (Absolute khác band).  
15. MapLibre style rebuild / Mapbox.

### Constraints (không đụng)

MapLibre Wave-2 ACs · PDF honesty · locale home CONDITIONAL · teal + Fraunces + radius 0.5rem · không commit/push trừ khi human OK.

## 8. Projection

| Milestone | LuxuryIndex | Absolute S5 (/15) |
|-----------|-------------|-------------------|
| Hiện tại (local) | **71** | ~7 |
| Sau P0 | ~76–78 | ~8 |
| Sau P0+P1 | ~84–88 | ~11–12 |
| Sau P0–P2 | ~88–92 | ~12–13 |
| + deploy prod | (ship) | S1 Absolute ↑ riêng |

## 9. AC

| ID | Kết quả |
|----|---------|
| AC1 Baseline PNGs | **PASS** — `luxury-baseline-*.png` + MCP home |
| AC2 checklist JSON | **PASS** — `luxury-checklist-score.json` · Index **71** |
| AC3 Report 01–08/Effects/Tooling/qualitative | **PASS** |
| AC4 Roadmap P0–P3 | **PASS** — §7 |
| AC5 Vault pattern cited; no Firebase/Algolia | **PASS** |
| AC6 Map/PDF/locale constraints | **PASS** — §7 |
| AC7 No large redesign; no commit/push | **PASS** |
| AC8 S5 projection | **PASS** — §8 |

**Scorecard: PASS.**

## 10. Cách chạy lại

```bash
pnpm dev
pnpm luxury:qa   # capture → diff stub → score
```

Artifacts: `reports/assets/luxury-checklist-score.json`, `luxury-baseline-findings.json`, `scripts/luxury/*`.
