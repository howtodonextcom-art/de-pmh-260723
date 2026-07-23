# DED-PMH v0 Track A — Full Maturity Audit (2026-07-22)

## 1. Executive verdict

**Điểm: 85/100.** v0 Track A đạt mức "demo package sellable, đúng như quảng cáo trong WHAT_YOU_BUY.md" — 6 route đều sống, bản đồ MapLibre thật, dữ liệu trung thực (không API giả), e2e xanh 27/27. Điểm bị trừ chủ yếu ở phần thiết kế (Inter-only, thiếu chất "sang trọng bất động sản cao cấp") và vài mảnh còn sót (i18n key mồ côi, 1 component UI không dùng, production chưa deploy commit mới nhất). Không có lỗi chức năng nào chặn demo.

## 2. Phương pháp

- **Trình duyệt trước, code sau**: `scripts/indep-maturity-audit.mjs` (Playwright headless, đã có sẵn trong repo) chạy 3 lần trên `localhost:3000` (dev, webpack) + 1 lần trên `https://de-division-pmh.vercel.app` (production) để đối chiếu.
- Playwright MCP browser dùng để xác minh thủ công từng phát hiện bất thường từ script (xem §7.1 — false positive investigation).
- Viewport: 1440×900 desktop (6 route), 375×812 mobile (`/`, `/du-an`, `/so-sanh`, `/du-an/hong-hac-city`), 1 pass dark mode trên `/`.
- Ngày chạy: 2026-07-22. Ảnh: `reports/assets/maturity-audit-*.png` (12 ảnh) + `maturity-audit-findings.json`.
- Sau đó: `tsc --noEmit`, `eslint .`, `next build`, `playwright test` (toàn bộ 27 test) chạy trực tiếp — không suy đoán từ đọc code.

## 3. Pillar scores

| Pillar | Điểm | /Tối đa |
|---|---|---|
| A — Feature completeness | 28 | 30 |
| B — Frontend engineering | 22 | 25 |
| C — Backend/data/ops honesty | 13 | 15 |
| D — UI/UX Design (01–08 avg × 3) | 22 | 30 |
| **Tổng** | **85** | **100** |

Công thức D: trung bình 8 mục §4 = 7.375/10 → ×3 = 22.1 → làm tròn 22.

## 4. Checklist 01–08 (mỗi mục /10)

| # | Item | Điểm | Bằng chứng |
|---|---|---|---|
| 01 | Point of view | 8 | Hero mở đầu bằng "Trung tâm Thông tin Dự án" + kicker "DED · Phú Mỹ Hưng" — đúng chất internal hub, không phải trang marketing. Sau khi bỏ Transparency/#minh-bach, POV vẫn đứng vững nhờ 4 stat tile + status badge (Đã có dữ liệu/Chưa xác thực...) trên card danh mục vẫn mang thông điệp minh bạch. `maturity-audit-home-desktop-1440.png` |
| 02 | Typography | 6 | Toàn site chỉ dùng **Inter** (`app/globals.css:52`, `--font-sans: 'Inter'...`), không có font display/serif nào cho H1/heading — cảm giác "default SaaS", chưa "expressive". Scale/weight hierarchy đúng chuẩn (H1 4xl/5xl, H2 2xl) nhưng không có nhấn nhá riêng biệt. |
| 03 | Color | 8 | Token brand teal nhất quán (`--primary: oklch(0.36 0.072 165)`), light/dark đều có contrast tốt (`maturity-audit-home-dark-1440.png`). Palette 5 nhãn trạng thái (emerald/amber/red/zinc/violet) rõ ngữ nghĩa, dùng lại nhất quán ở card + so sánh + pháp lý. Không "xấu"/"muddy". |
| 04 | Hierarchy | 7 | Hero → Stat → Featured → Catalog → Map → Timeline → Legal → Updates — mỗi section một nhiệm vụ rõ. Riêng `/phap-ly` (`maturity-audit-phap-ly-desktop-1440.png`) dày đặc bảng, thiếu điểm nhấn thị giác — kéo điểm xuống. |
| 05 | Imagery | 8 | Ảnh thật (render kiến trúc Hồng Hạc City, The Regency...) không phải abstract/stock generic; `alt` mô tả thật. Next dev log có cảnh báo LCP "thêm `loading=\"eager\"`" cho hero — ghi nhận, không phải lỗi chặn. |
| 06 | Motion | 8 | `MotionConfig reducedMotion="user"` bọc toàn site (sửa cùng ngày 2026-07-22) — tôn trọng `prefers-reduced-motion` không cần sửa từng component. Map `scrollZoom:false` trung thực (không bẫy scroll trang). Reveal/stagger có chủ đích, không noise. |
| 07 | Mobile | 8 | 375px: header không vỡ (search + switcher + hamburger 1 hàng), `/so-sanh` dùng accordion thay bảng ngang, gallery/card không tràn ngang. Xác nhận qua `maturity-audit-*-mobile-375.png`. |
| 08 | Invisible | 6 | Focus ring nhất quán (`focus-visible:ring-3` trong `buttonVariants`), `StatusDot` có `aria-label`+`title`. **Thiếu**: không có `app/sitemap.ts`/`app/robots.ts`; không có component `Footer` nào trong repo dù `footer.brandStatementFallback`/`footer.disclaimer` vẫn tồn tại trong `vi.json`/`en.json` (key mồ côi — xem §7). PDF honesty đã xác nhận (print fallback thật, không giả). |

**Trung bình:** (8+6+8+7+8+8+8+6)/8 = **7.375/10**

## 5. Xác nhận định tính (bắt buộc)

1. **Cân đối hay thô?** Phần lớn **cân đối** — nhịp section trang chủ rõ ràng, card anatomy lặp lại nhất quán. `/phap-ly` là điểm thô nhất: bảng dày, không có visual break.
2. **Màu sắc ổn/xấu/cần nâng cấp?** **Ổn** — không xấu, không "muddy shadcn mặc định" nhờ token teal riêng + palette trạng thái ngữ nghĩa. Không đến mức "cần nâng cấp gấp", nhưng cũng chưa có điểm nhấn màu nào thực sự ghi dấu ấn (toàn bộ CTA đều cùng 1 tông xanh lá).
3. **Sang trọng hay template/shadcn mặc định?** Gần **"polished internal tool"** hơn là **"sang trọng bất động sản cao cấp"**. Lý do cụ thể: (a) Inter-only, không font display; (b) `/phap-ly` thuần bảng dữ liệu; (c) card layout theo đúng pattern shadcn chuẩn (ảnh 16:9 + badge góc + tiêu đề + mô tả) không có biến tấu riêng.
4. **Có lạm dụng bo tròn không?** **KHÔNG còn** — đã sửa cùng ngày 2026-07-22: `--radius` giảm từ `0.75rem` → `0.5rem` trong `app/globals.css`, cascade tự động qua toàn bộ 79 lần dùng `rounded-*` (`rounded-full`×13, `rounded-2xl`×14, `rounded-xl`×19, `rounded-lg`×22, `rounded-md`×11). Trước đây `rounded-2xl` ≈ 21.6px (lạm dụng); giờ ≈ 9px — verdict: **ĐÃ GIẢI QUYẾT**, không phải gap đang tồn tại.

## 6. Ma trận Feature / FE / Backend

### 6.1 Feature completeness (Pillar A)

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| 6 route sống | **DONE** | `next build` prerender thành công cả 6 + 4 trang `/du-an/[slug]` tĩnh |
| MapLibre Wave-2 (pin/halo/CTA/scrollZoom) | **DONE** | Xác nhận live: 2 marker, stage height 900px, HH CTA có đúng UTM + `target=_blank` |
| Compare/Legal/Gallery/CMDK | **DONE** | Screenshot xác nhận `/so-sanh`, `/phap-ly`; CMDK không audit lại (đã xanh ở e2e `i18n-pdf.spec.ts`) |
| EN switcher | **DONE (CONDITIONAL)** | Đúng như `docs/I18N_EN.md` khai báo — chỉ home (Header/Hero/StatStrip) phản ứng; phần còn lại vẫn vi. Không phải lỗi, là giới hạn phạm vi đã ghi rõ. |
| PDF honesty | **DONE** | `pdf-function-honesty.spec.ts` 2/2 xanh — không fetch khi env unset. |
| R12 ADR | **DONE** | `docs/ADR-001-enterprise-rbac-ai-algolia.md` tồn tại, quyết định Defer. |
| Docs honesty | **DONE, có 1 doc-drift** | Xem §7.2 — `WHAT_YOU_BUY.md` đã cập nhật đúng sau khi bỏ Transparency; **production hiện KÉM 1 commit** so với local (chưa deploy bản bỏ Transparency + giảm bo góc) — buyer xem live site hôm nay vẫn thấy bản cũ. |

**Điểm A: 28/30** (trừ 2 vì production/local lệch nhau, chưa phải "shipped" thật).

### 6.2 Frontend engineering (Pillar B)

- `tsc --noEmit`: **0 lỗi**.
- `eslint .`: **0 lỗi**, 2 warning (biến không dùng trong `scripts/indep-*.mjs`, không phải product code).
- `next build`: **thành công**, 6 route static + 4 SSG detail page.
- `playwright test` (toàn bộ): **27/27 xanh**.
- App Router: Server/Client Component tách hợp lý (`FeaturedCards`/`ExplorerPreview`/`UpdatesTeaser` Server; `Hero`/`StatStrip`/`RegionMapCanvas` Client) — map dùng `dynamic` lazy qua `VnMap`.
- i18n có **2 hệ song song có chủ đích**: `t()` tĩnh (throw khi thiếu key, dùng cho phần chưa đổi) + `useLocale().t()` (fallback êm, dùng cho phần đã locale-reactive) — đã tài liệu hóa rõ trong `I18N_EN.md`, không phải nhầm lẫn, nhưng là nợ kỹ thuật cần dọn nếu mở rộng EN toàn site sau này.
- **Top rủi ro kỹ thuật:**
  1. Dev server (`next dev --webpack`) dưới tải request dồn dập (script mở nhiều context liên tiếp) thỉnh thoảng trả JS chunk lỗi → `PAGEERROR: Invalid or unexpected token` ngẫu nhiên trên các route khác nhau mỗi lần chạy. **Đã điều tra kỹ**: lặp lại 3 lần local (route bị lỗi đổi ngẫu nhiên mỗi lần — không cố định ở 1 file/route cụ thể), nhưng **0 lỗi console trên production** (`vercel.app`, cùng bộ 11 lượt viếng thăm) và **0 lỗi** khi điều hướng thủ công từng route qua MCP. Kết luận: **artifact riêng của dev server Windows dưới tải đồng thời cao, không phải lỗi sản phẩm** — cùng họ với các vấn đề dev-mode đã ghi nhận trước đây (Turbopack crash-loop, EADDRINUSE). Không chặn AC nhưng cần lưu ý khi đọc log audit tool trong tương lai — luôn đối chiếu qua điều hướng đơn lẻ hoặc production trước khi kết luận là bug thật.
  2. Không có lớp unit test (chỉ e2e) — chấp nhận được cho quy mô hiện tại nhưng là giới hạn.
  3. `components/ui/input-group.tsx` không có nơi nào import (xem §7).
  4. 11 i18n key mồ côi (xem §7).
  5. `/lab` route không có link nav nào dẫn tới — chỉ truy cập được qua URL trực tiếp; đúng ý đồ ("khu thử nghiệm", theo `docs/WHAT_YOU_BUY.md`) nhưng không có rào chắn nào (không `noindex`, không banner "internal only") nếu ai đó đoán được URL.

**Điểm B: 22/25.**

### 6.3 Backend / data / ops honesty (Pillar C)

`lib/library-bridge.ts` truy vết rõ ràng: `getCatalogFromLibrary()`/`getCompareProjects()`/`getFullCatalog()` đều đọc từ `@library/library/seed-adapter` (dữ liệu vendor JSON/CSV đã copy vào `v0/vendor/`), có `try/catch` fallback về `lib/mock-data.ts` (32KB, dữ liệu mẫu thật — không phải file rỗng) nếu vendor data thiếu. Đây là pattern trung thực: không gọi API giả, không bịa dữ liệu khi thiếu nguồn — trả `"Chưa có dữ liệu"` (`FieldStatus`).

- Biến môi trường duy nhất trong toàn bộ `app/`+`components/`+`lib/`: `NEXT_PUBLIC_PDF_FUNCTION_URL` (optional, unset by default) — đúng như tài liệu "0 biến môi trường bắt buộc cho bản demo công khai".
- Không có Firebase, không auth, không admin trong v0 — đúng như khai báo.
- **Câu trung thực bắt buộc:** v0 Track A **không phải** một backend/API tùy chỉnh — đây là Next.js App Router đọc file JSON/CSV đã vendor sẵn tại build/request time, có fallback mock nếu thiếu. Không có database, không có auth server, không có real-time. Đây là **quyết định kiến trúc có chủ đích** cho một demo/internal-hub, không phải thiếu sót — hệ thống Local (repo khác) mới là nơi có Firebase + auth thật.

**Điểm C: 13/15** (trừ nhẹ vì deploy story hiện tại lệch — xem AC7/§7.2).

## 7. Orphan & doc-drift inventory

### 7.1 Đã điều tra, KHÔNG phải orphan/bug (loại trừ minh bạch)

| Nghi vấn ban đầu | Kết luận | Bằng chứng |
|---|---|---|
| `lib/geo/load-geojson.ts` không được import ở đâu | **KHÔNG orphan** — là stub có chủ đích cho tầng `project-site` tương lai, đã ghi rõ trong `docs/DATA_CONTRACT_GEOJSON.md` §4: "Không có call site nào dùng loader này hôm nay... tồn tại như tiện ích sẵn sàng cho tương lai" | Đọc code + doc gốc |
| Trang chủ mobile chụp trắng hoàn toàn | **KHÔNG bug** — artifact chụp ảnh khi dev server dưới tải (xem B.1); điều hướng trực tiếp qua MCP cho kết quả đầy đủ, 0 lỗi console | `reports/assets/maturity-audit-verify-home-mobile-clean.png` (chụp lại sạch) |
| `PAGEERROR` ngẫu nhiên trên nhiều route | **KHÔNG bug sản phẩm** — 0 lỗi trên production, 0 lỗi khi điều hướng đơn lẻ | Chạy script 3 lần local (route lỗi đổi mỗi lần) + 1 lần production (0 lỗi) |

### 7.2 Orphan/dead thật (đề xuất, KHÔNG tự xóa trong wave này)

| Path | Loại | Độ tin cậy | Đề xuất |
|---|---|---|---|
| `components/ui/input-group.tsx` | Component UI không được import ở đâu | Cao | Xóa an toàn (N cần xác nhận: chạy lại grep sau khi xóa để chắc build không vỡ) |
| `lib/i18n/vi.json` + `en.json`: `brand.internalBadge` | Key mồ côi | Cao | Xóa hoặc dùng thật (có vẻ dự định cho badge "Internal" chưa bao giờ build) |
| `nav.duAn`, `nav.trangChu` | Key mồ côi | Cao | Xóa — header dùng `ProjectNavDropdown` riêng, không qua các key này |
| `nav.langVi`, `nav.langEn` | Key mồ côi | Cao | `locale-switcher.tsx` hardcode text "VI"/"EN" trực tiếp, không dùng 2 key này — xóa hoặc wire vào switcher |
| `home.statHeading` | Key mồ côi | Cao | Không section nào còn dùng heading này |
| `footer.brandStatementFallback`, `footer.disclaimer` | Key mồ côi — **không có Footer component nào trong repo** | Cao | Quyết định: xây Footer thật (site hiện không có footer) hoặc xóa 2 key |
| `common.xemTatCa`, `common.nguon`, `common.capNhat` | Key mồ côi | Cao | Các nơi dùng biến thể khác (`duAn.unit`, `sources.heading`...) — xóa 3 key trùng lặp |
| `scripts/indep-map-review.mjs`, `indep-sell70-review.mjs`, `indep-r100-review.mjs`, `indep-maturity-audit.mjs` | 4 script audit độc lập, gắn với 1 report cụ thể mỗi cái | Trung bình | Không xóa — là công cụ tái tạo bằng chứng cho từng report; có thể gom vào `scripts/archive/` để rõ đây là công cụ lịch sử, không phải CI hiện hành |
| `reports/2026-07-21-v0-r10-uiux-audit.md` | Đề cập Transparency/#minh-bach đã bị xóa 2026-07-22 | Đã biết trước (ghi trong frozen baseline của chính prompt này) | **Không sửa** — là báo cáo lịch sử tại thời điểm viết, giữ nguyên theo đúng chỉ dẫn "archives" của prompt này |
| `docs/WHAT_YOU_BUY.md` dòng R07 | Đã cập nhật đúng (bỏ "Transparency heading" khỏi mô tả phạm vi EN) | — | Không cần sửa thêm |

**Phương pháp tìm orphan i18n key:** so từng leaf key trong `vi.json` (106 key) với toàn bộ source `.ts`/`.tsx` (loại trừ `node_modules`/`.next`/`vendor`) bằng grep chuỗi chính xác `"key.path"`; 12 kết quả nghi vấn ban đầu, xác minh tay từng cái (loại 1 false-positive: `home.titleWords` dùng qua `messages.home.titleWords`, không qua chuỗi `t()`) → còn lại 11 orphan thật.

**Doc-drift:** không tìm thấy doc "sống" (`docs/`) nào còn nhắc Transparency/#minh-bach — quá trình xóa ngày 2026-07-22 đã cập nhật đủ `WHAT_YOU_BUY.md`, `I18N_EN.md`, `DEMO_SCRIPT_15MIN.md`. Duy nhất còn "lệch" là **deploy**: production chưa có bản mới nhất (§6.1).

## 8. Backlog xếp hạng (P0–P2, tối đa 12, KHÔNG tự triển khai)

### P0 — Nên làm trước demo tiếp theo
1. **Deploy production** — local đã bỏ Transparency + giảm bo góc nhưng chưa push/deploy; buyer xem site live hôm nay vẫn thấy bản cũ. *Fix: deploy.* Effort: **S**.
2. **Dọn 11 i18n key mồ côi** (`brand.internalBadge`, `nav.duAn`, `nav.trangChu`, `nav.langVi`, `nav.langEn`, `home.statHeading`, `footer.brandStatementFallback`, `footer.disclaimer`, `common.xemTatCa`, `common.nguon`, `common.capNhat`). Fix: xóa key. Effort: **S**.
3. **Xóa `components/ui/input-group.tsx`** (không dùng) hoặc xác nhận kế hoạch dùng nó. Fix: code delete. Effort: **S**.

### P1 — Nâng chất lượng có ý nghĩa
4. **Quyết định số phận footer** — hoặc xây Footer thật (dùng 2 key đang mồ côi), hoặc xóa hẳn khỏi i18n. Hiện site không có footer nào — thiếu chỗ đặt disclaimer/copyright chuẩn. Fix: design token + code. Effort: **M**.
5. **Thêm 1 font display/expressive** cho H1 + section heading để thoát cảm giác "Inter mặc định" — đây là điểm kéo điểm 02 Typography và câu hỏi định tính #3 (sang trọng vs template) nhiều nhất. Fix: design token (font). Effort: **M**.
6. **Thiết kế lại `/phap-ly`** bớt "thuần bảng" — thêm điểm nhấn thị giác/phân nhóm trực quan hơn (đang là trang thấp điểm nhất ở Hierarchy §4.04). Fix: design + code. Effort: **M**.
7. **`app/sitemap.ts` + `app/robots.ts`** nếu v0 định public-index; nếu cố tình không index (internal hub) thì ghi rõ quyết định này vào docs thay vì để trống im lặng. Fix: code + docs. Effort: **S**.

### P2 — Có thì tốt, không chặn gì
8. Gom 4 script `indep-*-review.mjs` vào `scripts/archive/` để phân biệt công cụ lịch sử vs CI hiện hành. Effort: **S**.
9. Thêm `loading="eager"` cho ảnh hero above-the-fold theo cảnh báo LCP của Next dev. Effort: **S**.
10. Cân nhắc mở rộng EN sang toàn site (hiện CONDITIONAL — chỉ trang chủ) nếu bán hàng cần "100% EN" thay vì "switcher hoạt động thật, phủ trang chủ". Effort: **L**.
11. Thêm lớp unit test (hiện chỉ có e2e) cho các hàm thuần logic (`lib/geo/geojson-contract.ts`, `lib/map-shell/create-map.ts`). Effort: **M**.
12. Rà lại `/lab`: quyết định giữ nguyên (không link nav, chỉ URL trực tiếp — đã đúng ý đồ) hay thêm rào chắn rõ ràng hơn (banner "nội bộ") nếu lo ngại bị index/chia sẻ nhầm. Effort: **S**.

## 9. AC table

| ID | Criterion | Kết quả |
|----|-----------|---------|
| AC1 | Browser-first evidence 6 route desktop + mobile samples, PNG dưới `reports/assets/maturity-audit-*` | **PASS** — 12 ảnh, `maturity-audit-findings.json` |
| AC2 | Report nêu Pillar A/B/C/D + tổng /100, công thức rõ | **PASS** — §3 |
| AC3 | Bảng 01–08 đủ, mỗi mục 0–10 + evidence ref | **PASS** — §4 |
| AC4 | 4 xác nhận định tính (cân đối/thô · màu · sang trọng · bo tròn) | **PASS** — §5 |
| AC5 | Kiểm kê orphan/stale ≥5 dòng hoặc "none found" + phương pháp | **PASS** — §7, 10 dòng + phương pháp grep chi tiết |
| AC6 | Backlog xếp hạng P0–P2, không tự triển khai | **PASS** — §8, 12 mục, chưa sửa code nào |
| AC7 | Ghi nhận việc xóa Transparency + doc drift (nếu có) | **PASS** — §7.2, phát hiện drift thật: production chưa deploy |
| AC8 | Không đổi code sản phẩm; không commit/push trừ khi được yêu cầu | **PASS** — chỉ ghi report + evidence PNG/JSON; không sửa `app/`/`components/`/`lib/` |

**Scorecard: PASS** (AC1–AC8 đều đạt, không có mục CONDITIONAL cần ẩn giấu).
