# DED-PMH v0 Track A — What you buy

Ngày cập nhật: 2026-07-21

Tài liệu này mô tả **chính xác** những gì nằm trong repo `v0/` (Track A) — không phải bản demo dựng vội, cũng không thổi phồng những gì chưa có.

## 1. Đang mua gì

**Repo:** https://github.com/howtodonextcom-art/260719-de-pmh (public, nhánh `main`)
**Bản deploy:** https://de-division-pmh.vercel.app (Vercel project liên kết với repo trên; xác nhận lại trạng thái live ngay trước demo)

Một ứng dụng Next.js 16 (App Router, React 19) **độc lập, tự build được** — không phụ thuộc monorepo gốc, không cần token Mapbox trả phí, không cần biến môi trường nào để chạy bản demo công khai (dữ liệu đọc từ file JSON/CSV đã vendor sẵn trong `v0/vendor/data/`).

**6 route đã hoàn thiện:**

| Route | Nội dung |
|---|---|
| `/` | Trang chủ — Hero, thống kê danh mục, nguyên tắc minh bạch dữ liệu (5 nhãn trạng thái), dự án nổi bật, danh mục dự án, **bản đồ phân bố MapLibre** (pin thật + tô nổi bật vùng, không phải SVG trang trí), timeline pháp lý, pháp lý minh bạch, cập nhật gần đây |
| `/du-an` | Danh mục 4 dự án — tìm kiếm, lọc theo khu vực/loại hình/trạng thái dữ liệu, chế độ lưới/bảng |
| `/du-an/[slug]` | Trang chi tiết dự án (D1–D13): hero, fact grid, câu chuyện dự án, vị trí, masterplan, kiến trúc & đối tác, dòng sản phẩm, tiện ích, thư viện ảnh (lightbox), pháp lý, tiến độ bán, dự án liên quan, nguồn dữ liệu |
| `/so-sanh` | Bảng so sánh 4 dự án theo 7 trường cốt lõi + tóm tắt pháp lý |
| `/phap-ly` | Tổng hợp hồ sơ pháp lý — 7 nhóm hồ sơ / dự án, có nút in |
| `/lab` | Khu vực thử nghiệm component (chuyển từ trang chủ cũ sang, không phải trang chính) |

**Hạ tầng đi kèm:**
- i18n scaffold (`t()` + `vi.json`) — phủ toàn bộ nav/home/list/detail/compare/legal/CMDK
- CMDK tìm kiếm nhanh (`⌘K`)
- Bộ e2e Playwright (`v0/e2e/`) — 23+ test, chạy được độc lập không cần backend
- ESLint + TypeScript strict, `pnpm build` xanh
- CI-ready (không cần secret nào để build)

## 2. KHÔNG bao gồm — IP riêng biệt

**Sa bàn Hồng Hạc (397 lô đất, bản đồ tương tác chi tiết từng lô)** là sản phẩm **riêng biệt, IP riêng biệt**, không nằm trong repo này:
- Repo: https://github.com/howtodonextcom-art/260530-bdskimquyen
- Bản production: https://www.bacninhhonghaccity.vn/sa-ban

v0 Track A chỉ có **liên kết sâu (deep-link, L1)** tới sa bàn — một nút CTA "Sa bàn Hồng Hạc →" trên dòng Bắc Ninh của bản đồ trang chủ, mở tab mới, kèm tham số UTM (`utm_source=ded-pmh&utm_medium=home-map&utm_campaign=map-cta`) để đo lường traffic dẫn sang. **Không có** dữ liệu lô đất, không có GeoJSON sa bàn, không có tile-gatekeeper nào được nhúng vào v0 — đây là quyết định kiến trúc có chủ đích (xem `v0/prompts/2026-07-21-claude-v0-maplibre-*-mcp.md`), không phải thiếu sót.

## 3. Môi trường / vận hành

- **Không cần biến môi trường** cho bản demo công khai — dữ liệu đọc từ `v0/vendor/data/13_PROJECT_DATA_SCHEMA.json` (đã vendor, không phụ thuộc Firebase).
- **Không cần Firebase, không cần đăng nhập** — v0 là bản demo/UI shell công khai, không có admin, không có passcode. Hệ thống Local (production đầy đủ, có Firebase + passcode + duyệt thay đổi) là repo **khác**, không nằm trong gói này.
- Deploy: Vercel, build command mặc định Next.js, không cần cấu hình đặc biệt.

## 4. Khung định giá / đóng gói

Có một ghi chú định giá nội bộ tham khảo tại `v0/reports/2026-07-20-valuation-upgrade-report.md` (định giá & lộ trình nâng cấp cho hệ thống Local, không phải v0) — dùng để tham khảo khung tư duy "gói cơ bản vs. gói mở rộng", **không phải mức giá chính thức cho gói v0 này**. Quyết định giá cụ thể cho v0 Track A cần thống nhất riêng trước khi chào bán.

## 5. Trạng thái roadmap (cập nhật sau wave "remaining 100% closure")

| Hạng mục | Trạng thái |
|---|---|
| R05 — L2 map-shell package (MVP) | **DONE** — `v0/lib/map-shell/` (`createMap`, pin/emphasis helpers, types); `region-map-canvas.tsx` đã refactor để dùng package này; xem README trong package cho L2 story (sa bàn có thể phụ thuộc sau này mà không merge repo) |
| R06 — Data contract GeoJSON | **DONE** — `v0/docs/DATA_CONTRACT_GEOJSON.md` + validator (`v0/lib/geo/`), `portfolio-regions.geojson` đã annotate là mẫu tuân thủ |
| R07 — `/en` (tiếng Anh) | **DONE (có điều kiện)** — switcher client-side thật (vi ↔ en), phủ header + Hero + StatStrip trên trang chủ; phần còn lại của site vẫn tiếng Việt — xem `v0/docs/I18N_EN.md` để biết phạm vi chính xác |
| R08 — Cloud Function xuất PDF thật | **DONE (cầu nối)** — mặc định vẫn fallback in trình duyệt trung thực; đã thêm cầu nối tùy chọn qua `NEXT_PUBLIC_PDF_FUNCTION_URL` (không deploy Function trong wave này) — xem `v0/docs/PDF_EXPORT.md` |
| R10 — Polish UI/UX 8 hạng mục còn lại (ngoài bản đồ) | **DONE** — audit + 2 fix cụ thể, xem `v0/reports/2026-07-21-v0-r10-uiux-audit.md` |
| R12 — RBAC / AI / Algolia | **ADR-DEFER** — quyết định hoãn có chủ đích kèm điều kiện tái mở, không phải thiếu sót — xem `v0/docs/ADR-001-enterprise-rbac-ai-algolia.md` |

Xem `v0/docs/README.md` để biết các tài liệu liên quan khác.
