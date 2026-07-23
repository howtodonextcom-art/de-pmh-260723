# DED-PMH v0 Track A — REMAINING 100% CLOSURE smoke report

Ngày: 2026-07-21
Prompt nguồn: `v0/prompts/2026-07-21-claude-v0-remaining-100-closure-mcp.md`

## Tóm tắt

Đóng R05, R06, R07, R08, R10 (không đụng bản đồ), R12 theo DoD trong §2 của prompt. Không rework 7 hạng mục frozen DONE (R01–R04, R09, R10-map, R11). Không commit/push (AC9).

## Scorecard AC1–AC9

| AC | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| AC1 | `packages/map-shell` (hoặc tương đương) tồn tại; home map dùng nó; map e2e PASS | **PASS** | `v0/lib/map-shell/{types,create-map,region-pins,index}.ts` + `README.md`; `region-map-canvas.tsx` refactor để import `createMap`/`addRegionMarkers`/`addRegionEmphasisLayers`; `e2e/map.spec.ts` 5/5 xanh (chạy lại nhiều lần trong wave, luôn xanh trên server ấm) |
| AC2 | R06 DATA_CONTRACT doc + schema/validator + sample | **PASS** | `v0/docs/DATA_CONTRACT_GEOJSON.md`; `v0/lib/geo/{geojson-contract,load-geojson}.ts` (hand-rolled, không thêm dependency `zod`); `portfolio-regions.geojson` xác nhận valid qua validator (kiểm chứng bằng script tạm, xóa sau khi dùng) |
| AC3 | EN locale usable via switcher; e2e asserts EN copy | **PASS có điều kiện (CONDITIONAL, đúng như cho phép)** | Switcher thật (`LocaleSwitcher`, client Context, `localStorage`-backed) hoạt động trên header + Hero + StatStrip + Transparency heading; `e2e/locale-switch.spec.ts` 3/3 xanh, assert nhiều chuỗi EN trên `/`; **phạm vi phủ EN không phải toàn site** — ghi rõ trong `v0/docs/I18N_EN.md` (mục "CHƯA locale-reactive"), đúng điều kiện AC3 cho phép ("missing keys throw/fall back visibly documented") |
| AC4 | PDF: unset env → print+toast; docs explain Local Function | **PASS** | `pdf-export-trigger.tsx`: `NEXT_PUBLIC_PDF_FUNCTION_URL` unset → in trình duyệt (không đổi hành vi cũ); set → fetch thật với toast lỗi rõ ràng khi fail, không bao giờ báo thành công giả; `v0/docs/PDF_EXPORT.md`; `e2e/pdf-function-honesty.spec.ts` 2/2 xanh xác nhận không có network request nào tới PDF function khi env unset |
| AC5 | R10 checklist filed; ≤8 fixes; no map regression | **PASS** | `v0/reports/2026-07-21-v0-r10-uiux-audit.md` — audit 8 hạng mục, **2/8 fix** áp dụng (Hero CTA phụ dùng `variant: "link"`; `MotionConfig reducedMotion="user"` toàn site); `e2e/map.spec.ts` vẫn 5/5 xanh sau các thay đổi này |
| AC6 | R12 ADR Defer filed; WHAT_YOU_BUY updated | **PASS** | `v0/docs/ADR-001-enterprise-rbac-ai-algolia.md` (Decide = Defer + điều kiện tái mở cụ thể cho từng hạng mục); `v0/docs/WHAT_YOU_BUY.md` §5 viết lại thành bảng trạng thái, trích dẫn ADR |
| AC7 | Full `pnpm test:e2e` green; lint/tsc/build green | **PASS** | 29/29 e2e specs xanh (1 flake cold-compile lần chạy đầu trên server vừa khởi động, xanh lại ngay khi rerun trên server ấm — pattern đã biết, không phải regression); `npx eslint .` 0 error (1 warning cũ, không liên quan wave này, trong `scripts/indep-sell70-review.mjs`); `npx tsc --noEmit` 0 error; `npx next build` (Turbopack) thành công, 12/12 route |
| AC8 | Final smoke report + MCP evidence index; remaining debt only if CONDITIONAL and listed | **PASS** | Báo cáo này + `v0/reports/assets/remaining-100-*.png` (xem §Evidence); debt duy nhất là AC3's CONDITIONAL, đã liệt kê rõ ở `v0/docs/I18N_EN.md` |
| AC9 | No commit/push unless asked | **PASS** | Không có `git add`/`git commit`/`git push` nào được chạy trong wave này |

**Kết luận scorecard: PASS toàn bộ AC1–AC9** (AC3 ở dạng CONDITIONAL được chính scorecard cho phép).

## Chi tiết theo từng hạng mục roadmap

### R05 — L2 map-shell extract (MVP)
- Package mới: `v0/lib/map-shell/` — `createMap()`, `computeBounds()`, `addRegionMarkers()`, `addRegionEmphasisLayers()`, types (`RegionPin`, `RegionEmphasisOptions`, `CreateMapOptions`)
- `region-map-canvas.tsx` refactor để dùng package — hành vi giữ nguyên 100% (đã xác nhận qua `git diff` logic + e2e)
- README trong package viết rõ "L2 story": sa bàn có thể phụ thuộc package này sau này (publish riêng, import qua peer dep `maplibre-gl`) mà **không merge repo**, không copy `SaBanInteractiveMap`/tile-gatekeeper/397-lot GeoJSON/Marzipano
- KHÔNG dùng: `packages/` workspace mới (dùng `v0/lib/map-shell/` thay vì `v0/packages/map-shell/` — cả hai đều được prompt chấp nhận qua "(or `v0/lib/map-shell/`)"); không cần cập nhật pnpm lockfile vì không thêm workspace package mới, không thêm dependency ngoài

### R06 — Data contract
- `v0/docs/DATA_CONTRACT_GEOJSON.md`: 2 tầng dữ liệu (`region-aoi` hiện có, `project-site` cho tương lai), checklist "thiếu dữ liệu ⇒ không claim gói C/Δ giá", `portfolio-regions.geojson` annotate là mẫu tuân thủ tầng `region-aoi`
- `v0/lib/geo/geojson-contract.ts` (validator hand-rolled, không thêm zod) + `v0/lib/geo/load-geojson.ts` (loader fail-soft, dev-only warn) — chưa có call site nào dùng (đúng dự kiến, vì chưa có file `project-site` nào tồn tại)

### R07 — F8 `/en` + switcher
- Chiến lược: client-side dual dictionary (KHÔNG dùng `app/[lang]/...`) — lý do đầy đủ trong `v0/docs/I18N_EN.md`
- `lib/i18n/en.json` dịch đầy đủ mọi key hiện có trong `vi.json` (kể cả các key mới thêm cho StatStrip/PDF toast)
- `LocaleProvider`/`useLocale()` (`lib/i18n/locale-context.tsx`) — pattern hydration-safe theo mô hình `next-themes`, `localStorage`-backed, fallback về `vi` khi thiếu key EN (không throw, không crash)
- `LocaleSwitcher` trong header; wired: Hero, StatStrip, Transparency heading, toàn bộ header (wordmark/nav/search/switcher)
- Mặc định vẫn `vi` (`<html lang="vi">` không đổi)
- **Debt CONDITIONAL** (đã ghi rõ, không giấu): nội dung dữ liệu dự án, Transparency card definitions, toàn bộ route `/du-an*`/`/so-sanh`/`/phap-ly`/`/lab`, và nhãn bản đồ vẫn dùng `t()` tĩnh (vi-only)

### R08 — PDF Function bridge
- `docs/PDF_EXPORT.md`: giải thích hành vi mặc định (in trình duyệt) + hợp đồng cầu nối tùy chọn + vì sao không gọi thẳng Firebase `onCall`
- `exportFactSheetPdf(slug?)` giờ nhận `slug` (truyền từ `sources.tsx` và `PdfExportTrigger`), env unset → in như cũ; env set → fetch thật, thành công mở link tải, thất bại → toast lỗi rõ ràng, không bao giờ fallback im lặng hay báo thành công giả
- Không deploy Firebase Function nào; đường dẫn env-set không có e2e thật (không có Function để trỏ tới trong CI) — ghi rõ là debt không che giấu trong docs

### R10 — Remainder UI/UX (non-map)
- Audit đầy đủ 8 hạng mục qua `v0/reports/2026-07-21-v0-r10-uiux-audit.md`, MCP-browser-verified (desktop 1440, mobile 375, dark mode)
- 2 fix áp dụng (dưới trần 8): Hero CTA phụ đổi `ghost` → `link` variant; `MotionConfig reducedMotion="user"` toàn site trong `app/layout.tsx`
- Bản đồ: không đụng, `e2e/map.spec.ts` vẫn xanh sau mọi thay đổi khác trong wave

### R12 — Enterprise multipliers (ADR-only)
- `docs/ADR-001-enterprise-rbac-ai-algolia.md`: Decide = Defer cho cả RBAC/OAuth, AI, Algolia — kèm điều kiện tái mở cụ thể từng mục, không phải "chưa làm" mơ hồ
- `WHAT_YOU_BUY.md` §5 viết lại thành bảng trạng thái, trích dẫn ADR này

## Evidence (MCP Playwright — ảnh chụp trình duyệt thật)

Tất cả trong `v0/reports/assets/`:

| File | Nội dung |
|---|---|
| `remaining-100-r10-home-desktop-1440.png` | Home full-page, desktop 1440 |
| `remaining-100-r10-home-mobile-375.png` | Home viewport, mobile 375 |
| `remaining-100-r10-home-dark-desktop.png` | Home dark mode, desktop |
| `remaining-100-r10-duan-desktop.png` | `/du-an` catalog, desktop |
| `remaining-100-r10-detail-desktop.png` | `/du-an/hong-hac-city` detail, desktop |
| `remaining-100-r10-sosanh-mobile.png` | `/so-sanh` mobile — accordion, không tràn ngang |
| `remaining-100-r10-hero-link-fix.png` | Hero sau fix #1 (CTA phụ có màu primary) |
| `remaining-100-r10-featured-scrolled-confirms-no-bug.png` | Xác nhận "section trống" trên full-page screenshot là artifact công cụ, không phải bug |
| `remaining-100-r07-en-active-desktop.png` | Home với EN switcher đã bật — header + Hero + CTA đều tiếng Anh thật |

## Test suite

```
29/29 e2e specs PASS (rerun trên server ấm; 1 flake cold-compile lần chạy đầu — pattern đã biết)
eslint . — 0 error
tsc --noEmit — 0 error
next build (Turbopack) — 12/12 route thành công
```

## Roadmap closure claim

Tất cả roadmap ID còn lại (R05, R06, R07, R08, R10-non-map, R12) đạt **terminal state** theo DoD §2 của prompt: DONE cho R05/R06/R08/R10, DONE-CONDITIONAL (đã cho phép, đã ghi rõ debt) cho R07, ADR-DEFER cho R12. Kết hợp với 7 hạng mục frozen DONE trước đó (R01–R04, R09, R10-map, R11), **v0 Track A đạt 100% closure theo định nghĩa của prompt này** ("close 100% roadmap IDs" — không phải "sản phẩm Enterprise vô hạn").

## Không thuộc phạm vi (theo đúng scope lock)

- Không build production RBAC/OAuth/AI/Algolia
- Không rewrite sellability docs từ đầu (chỉ update bảng trạng thái)
- Không vendor 397-lot sa bàn inventory vào v0
- Không deploy Firebase Function nào
- Không commit/push (chờ yêu cầu tường minh từ người dùng)
