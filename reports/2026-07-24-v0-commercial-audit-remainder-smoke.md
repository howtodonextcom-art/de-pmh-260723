# DED-PMH v0 — Commercial Audit Remainder (Wave-2) — Close All Open Items

Ngày: 2026-07-24
Prompt: `prompts/2026-07-24-claude-v0-commercial-audit-remainder-wave2-mcp.md`
Source audit: `reports/2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md`
Prior wave (credited, không redo): `reports/2026-07-24-v0-commercial-audit-50pct-smoke.md`

## 1. Executive

**So với audit 2026-07-23, hạng mục còn mở sau Wave-2 = 0** — trừ 1 residual đã có lý do rõ ràng: 1/68 URL ảnh trong manifest (`ded-pmh-unclassified-001`) trỏ về root domain của chính site này (`https://dedivisionpmh.vercel.app/`, không phải file ảnh thật, HTTP 404 khi fetch) — không phải lỗi của pipeline mirror, là dữ liệu manifest sai từ nguồn.

Tất cả R1–R6 đạt PASS. Trọng số wave này: **100/100**.

## 2. Independent note — 50% wave "100/100" vs true remainder

Reviewer độc lập của wave trước đánh giá đúng: "100/100 trọng số §V" của wave 50% là đúng **theo weight model của wave đó** (W1–W8), không phải "audit đã đóng hoàn toàn" — smoke §6 của wave đó tự liệt kê 5 hạng mục Wave-2 còn mở. Wave này đóng chính xác 5 hạng mục đó (R1–R5) + docs (R6).

## 3. R1–R6 evidence

| ID | Việc | Trọng số | Kết quả | Bằng chứng |
|----|------|----------|---------|------------|
| R1 | Image durable ownership | 35 | **PASS** (67/68, 1 residual có lý do) | `scripts/mirror-project-images.mjs` tải 67/68 URL trong `08_IMAGE_ASSET_MANIFEST.csv` về `public/vendor-images/` (31 MB), ghi `vendor/data/image-mirror-map.json`. `seed-adapter.ts::loadImagesForV0` đọc map này, ưu tiên path cục bộ hơn URL sống. Live verify: `/du-an/hong-hac-city` — **46/46 ảnh** (100%) resolve từ `/vendor-images/...`, 0 remote. Trang chủ: 0/7 ảnh remote. Thất bại duy nhất: `ded-pmh-unclassified-001` → `https://dedivisionpmh.vercel.app/` (root URL, không phải file ảnh — lỗi dữ liệu manifest, không phải lỗi mirror). Report đầy đủ: `reports/assets/commercial-rem-mirror-report.json`. PNG: `commercial-rem-image-mirror-after.png`. |
| R2 | `ImageWithFallback` trên toàn bộ surface còn lại | 15 | **PASS** | Thay `next/image` → `ImageWithFallback` tại: `project-card.tsx`, `featured-cards.tsx`, `amenities.tsx`, `location.tsx`, `masterplan.tsx`, `home/hero.tsx`, `demo-shell.tsx` (`/lab`), `mobile-nav.tsx` + `project-nav-dropdown.tsx` (thumbnail nav). Grep xác nhận: 0 `next/image` import còn lại ngoài chính `image-with-fallback.tsx`. |
| R3 | Gallery "Tất cả" — không mount toàn bộ 25+ ảnh ngay | 15 | **PASS** (chunk-load, không virtualize) | CSS-columns masonry không hợp với virtualizer chuẩn (item height biến thiên) → chọn chunk-load: 12 ảnh/lần + nút "Xem thêm". Đo trên Hồng Hạc City "Tất cả" (32 ảnh): **12 DOM node ban đầu** (trước: 32 eager) → click "Xem thêm" → 24. Lightbox vẫn điều hướng full set `visible` (không phụ thuộc số tile đã mount). Không bleed ngang @375 (verify lại). |
| R4 | Route transition | 10 | **PASS** | `app/template.tsx` (mới) — fade opacity-only 0.22s khi đổi route, `useReducedMotion()` → duration 0. **Chỉ dùng opacity, không dùng transform** — tránh containing-block bug (transform trên ancestor phá `position: fixed/sticky` của header, lightbox, dialog). Verify: sticky header giữ nguyên sau scroll 2000px; lightbox `fixed inset-0` vẫn phủ đúng full viewport sau khi thêm template. |
| R5 | i18n leftover — status label trên EN nav chrome | 10 | **PASS** | Phát hiện: `HeaderProject.status` đã bị pre-localize sang VI ngay tại `seed-adapter.ts` trước khi tới component — dict `STATUS_LABEL` gốc trong `mobile-nav.tsx`/`project-nav-dropdown.tsx` **chưa từng khớp** (luôn fallback `?? p.status`, hiển thị đúng nhưng chỉ vì input đã là VI sẵn — dead code, không phải bug hiển thị). Fix: map ngược VI-label → key cục bộ tại 2 file này (không đổi contract dữ liệu dùng chung, tránh phá `/lab` DemoShell). EN live: "Đang triển khai" → **"In development"**, 0 console warning (trước: 184 warning `missing key`). |
| R6 | Docs + gate | 15 | **PASS** | `docs/WHAT_YOU_BUY.md`: sửa URL repo (`de-pmh-260723`), thêm §2b "Track A vs. Local" (bảng so sánh), §2c "Tài sản hình ảnh — mirror cục bộ, quyền dùng vẫn cần xác nhận" (honesty caveat bắt buộc theo non-negotiable #2/#3). `docs/I18N_EN.md`: cập nhật honesty cho R5 + làm rõ 2 "STATUS_LABEL" khác nhau (nav status vs. sacred FieldStatus 5-nhãn). Gate: xem §6. |

## 4. CLAIM audit vs LIVE — final

| Claim audit gốc (2026-07-23) | LIVE 2026-07-24 sau Wave-2 | Verdict |
|---|---|---|
| 100% ảnh hotlink `honghacphumyhung.vn`, ngoài kiểm soát | 67/68 (98.5%) mirror cục bộ `public/vendor-images/`; trang bị nêu tên trong audit (Hồng Hạc City detail) đạt 100% local | **FIXED (98.5%, 1 residual có lý do)** |
| Trang chi tiết dài ~9.250px, gallery 25+ ảnh load hết cùng lúc | Chunk-load 12 ảnh/lần, "Xem thêm" theo yêu cầu | **FIXED** |
| Chưa tận dụng Framer Motion cho page-transition | `app/template.tsx` — fade route transition, reduced-motion safe | **FIXED** |
| EN nav dropdown/drawer dịch (wave trước) nhưng nhãn trạng thái dự án vẫn VI | Nhãn trạng thái nay theo `t()`, xác nhận EN "In development" | **FIXED** |
| "100/100" của wave 50% = audit đã đóng hoàn toàn | Sai — đó là weight-model của wave đó; audit thực còn 5 mục orange/green, nay đóng ở Wave-2 | **AGREE (đã làm rõ ở §2)** |

## 5. Prod deploy — vẫn human-gated

Không deploy/push trong wave này (đúng scope lock). Toàn bộ R1–R5 (mirror ảnh, `ImageWithFallback` mở rộng, gallery chunk-load, route transition, i18n status) hiện **chỉ có ở local** — cần con người deploy để prod (`de-division-pmh.vercel.app`) phản ánh đúng. Lưu ý: `public/vendor-images/` (31 MB) sẽ tăng dung lượng repo/deploy đáng kể nếu commit — người dùng nên biết trước khi quyết định commit/push.

## 6. Gate

- `tsc --noEmit` — **0 lỗi**.
- `playwright test --workers=1` (server ấm) — **31/31 PASS**, gồm 3 test mới (`e2e/commercial-50.spec.ts`) + toàn bộ regression cũ (compare@375, IA redirect, map, PDF, i18n). 1 lần chạy đầu có 1 test (`home H1 CTA`) timeout ngắn — xác nhận qua chạy lại cô lập (pass 2.2s) + chạy lại toàn bộ (31/31) là artefact cold-cache dev-server, không phải regression từ `app/template.tsx` (đã verify riêng: sticky header + lightbox `fixed inset-0` không bị ảnh hưởng bởi wrapper opacity-only).
- Không regress: compare@375 accordion, `/so-sanh` redirect, map canvas/CTA/scrollZoom, lightbox, CMDK, PDF honesty.

## 7. AC table

| ID | Kết quả |
|----|---------|
| AC1 Agent A inventory trước khi sửa | **PASS** — kiểm code + browser (68 unique URL, 3 host, 0 file `image-verify-report.json` trước wave) trước khi viết pipeline |
| AC2 R1–R6 PASS hoặc R1 CONDITIONAL có lý do | **PASS** — R1 gần như hoàn toàn PASS (67/68), 1 residual ghi rõ lý do (không phải ảnh thật) |
| AC3 Ảnh demo-critical resolve first-party | **PASS** — trang audit nêu tên (Hồng Hạc City) 46/46 local |
| AC4 Không còn surface ảnh customer-facing thiếu fallback/local src | **PASS** — grep xác nhận 0 `next/image` trực tiếp còn lại |
| AC5 Gallery không mount hết eager | **PASS** — 12/32 ban đầu, số đo cụ thể ở §3 R3 |
| AC6 Route transition + reduced-motion safe, không regress map/compare | **PASS** — opacity-only, verify sticky+lightbox+e2e |
| AC7 EN nav STATUS/hardcode leftover fixed | **PASS** — §3 R5, 0 console warning |
| AC8 Docs Track A vs Local packaging | **PASS** — `WHAT_YOU_BUY.md` §2b/§2c |
| AC9 tsc 0; e2e green (workers=1 chấp nhận có ghi chú) | **PASS** — §6 |
| AC10 Smoke path đúng; không commit/push | **PASS** — `reports/2026-07-24-v0-commercial-audit-remainder-smoke.md`; chưa commit |
| AC11 Câu "hạng mục còn mở = 0 (hoặc liệt kê residual có lý do)" | **PASS** — §1 |

**Scorecard: PASS (AC1–AC11 đều đạt).**
