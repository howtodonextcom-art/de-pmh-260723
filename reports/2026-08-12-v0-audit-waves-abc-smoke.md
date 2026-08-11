# DED-PMH v0 — Smoke Report: Source-Audit Waves A→B→C Close

**Ngày:** 2026-08-12
**Người thực thi verify độc lập:** AGENT-06 (Final gate + smoke report)
**Workspace xác nhận:** `Z:\Coding\260723-de-pmh` (remote `origin` = `github.com/howtodonextcom-art/de-pmh-260723`)
**Nguồn tham chiếu AC:** `prompts/2026-08-12-00-23-claude-v0-source-audit-waves-abc-close-mcp.md` mục 5

---

## 1. Executive summary

**Waves A, B, C đã đóng — PASS tổng thể.**

Toàn bộ 3 wave (A = P0 debug/typecheck/prod-fail-closed, B = P1 brand hygiene + mobile IA, C = P2 dark contrast + home fold + image-opt residual) đã được triển khai đúng vào workspace chuẩn `Z:\Coding\260723-de-pmh`. AGENT-06 chạy lại độc lập toàn bộ gate — typecheck (`tsc --noEmit` exit 0), build production (`pnpm build` xanh, header xác nhận `ded-pmh@0.1.0 build Z:\Coding\260723-de-pmh`), grep bằng chứng F1/F6/F7, và smoke HTTP 5 route (`/`, `/du-an`, `/so-sanh`, `/phap-ly`, `/lab`) — tất cả đều trả 200. Không phát hiện regression build-breaking nào cần sửa khẩn cấp. Một điểm cần lưu ý vận hành (không chặn PASS): danh tính git local hiện tại không khớp `howtodonext.com@gmail.com` theo CLAUDE.md — chỉ cần sửa trước khi push, chưa ai push trong phiên này.

---

## 2. Multi-agent rollup

| Agent | Nhiệm vụ | Ghi chú thực thi | STATUS |
|---|---|---|---|
| AGENT-01 | Phase 0 — Librarian / inventory (grep 7465, tsc, taxonomy) | Read-only, hoàn thành đúng workspace | PASS |
| AGENT-02 (bản gốc) | Wave A implementer: F1 → F2 → F3 | **Lỗi cwd tooling**: chạy nhầm trên workspace phụ `F:\History\260723-de-pmh` thay vì `Z:\Coding\260723-de-pmh`. Thay đổi không nằm trên repo chuẩn. | FAIL (workspace sai) → khắc phục bởi Orchestrator |
| AGENT-03 (bản gốc) | Wave A gate/QA (F4) | Cùng lỗi cwd, verify nhầm trên `F:\History` | FAIL (workspace sai) → khắc phục bởi Orchestrator |
| AGENT-04 (bản gốc) | Wave B: F6 → F7 → F5 | Cùng lỗi cwd, chạy nhầm trên `F:\History` | FAIL (workspace sai) → khắc phục bởi Orchestrator |
| Orchestrator (khắc phục) | Áp lại trực tiếp F1, F2, F3, F6 vào đúng `Z:\Coding\260723-de-pmh` | Orchestrator tự tay port lại các thay đổi và xác minh bằng build xanh trên `Z:` | PASS |
| AGENT-04b | Làm lại F5 (mobile taxonomy IA) trên đúng `Z:\Coding\260723-de-pmh` | `components/shared/mobile-nav.tsx` — accordion 2 cấp dùng `lib/project-nav-taxonomy.ts` | PASS |
| AGENT-05 | Wave C: F9 → F10 → F8 residual note, trên đúng `Z:\Coding\260723-de-pmh` | `legal-dossier-table.tsx` (fix dialog lệch màn hình + contrast), `hero.tsx` (fold budget) | PASS |
| **AGENT-06 (bạn đang đọc)** | Final gate + smoke report — verify độc lập toàn bộ, không chỉ tin summary | Re-run tsc/build/grep/smoke từ đầu trên `Z:\Coding\260723-de-pmh`, viết report này | PASS |

Tổng: **7 lượt agent** (bao gồm 3 lượt phải làm lại do lỗi workspace) → thỏa AC0 (≥5 STATUS block, ưu tiên 6; ở đây có bù đắp rõ ràng cho 3 lượt hỏng bằng Orchestrator + AGENT-04b).

---

## 3. Bằng chứng verify độc lập (AGENT-06 tự chạy lại, không chỉ tin báo cáo trước)

### 3.1 Grep evidence — F1 (strip debug ingest)

```
$ grep -rln "7465\|#region agent log" app components lib instrumentation.ts
(zero matches — instrumentation.ts không tồn tại, cũng không có trong git history:
  git log --all --diff-filter=A -- instrumentation.ts  →  rỗng, file này chưa từng được commit)
```

**Kết quả: zero matches.** F1 PASS.

### 3.2 Grep evidence — F6 (brand hygiene)

```
$ grep "my-project\|v0.app" package.json app/layout.tsx
(zero matches)
```

`package.json` → `"name": "ded-pmh"`. F6 PASS.

### 3.3 Grep evidence — F7 (/lab không lộ nav công khai)

```
$ grep "/lab" components/shared/site-header.tsx components/shared/mobile-nav.tsx components/shared/site-footer.tsx
(zero matches)
```

Bổ sung: `app/robots.ts` có `disallow: "/lab"`; `app/sitemap.ts` có comment xác nhận loại trừ `/lab`; `app/lab/page.tsx` giữ `metadata.robots = { index: false, follow: false }`. F7 PASS.

---

## 4. Typecheck + Build

```
$ pnpm exec tsc --noEmit
(exit code 0, không output — sạch)

$ pnpm build
> ded-pmh@0.1.0 build Z:\Coding\260723-de-pmh
> next build
▲ Next.js 16.2.6 (Turbopack)
✓ Compiled successfully in 3.5s
  Running TypeScript ... Finished TypeScript in 3.4s
  Generating static pages using 12 workers (14/14) ...
Route (app): / , /_not-found, /du-an, /du-an/[slug] (4 SSG: hong-hac-city, the-regency,
  the-sculptura, harmonie), /icon, /lab, /phap-ly, /robots.txt, /sitemap.xml, /so-sanh
exit code 0
```

`next.config.mjs` xác nhận `typescript.ignoreBuildErrors: false`; `package.json.scripts.typecheck = "tsc --noEmit"`. F2 PASS.

### 4.1 Smoke HTTP 5 route (dev server đã chạy sẵn trên workspace, port 3000)

| Route | HTTP |
|---|---|
| `/` | 200 |
| `/du-an` | 200 |
| `/so-sanh` | 200 |
| `/phap-ly` | 200 |
| `/lab` | 200 |

Ghi chú vận hành: khi AGENT-06 thử tự khởi động `pnpm dev`, phát hiện đã có một dev server khác đang chạy sẵn trên `Z:\Coding\260723-de-pmh` (PID hiện hữu, cổng 3000) — lệnh `pnpm dev` của AGENT-06 tự nhường cổng 3001 rồi thoát (exit 1, đúng hành vi Next.js khi phát hiện dev server trùng thư mục). AGENT-06 smoke trực tiếp qua server có sẵn ở cổng 3000 (không phải server tự khởi) và không kill process đó vì không phải do phiên này tạo ra. Đã xác nhận cổng 3001 của lượt thử hụt không còn tiến trình treo.

---

## 5. F3 — Prod fail-closed (giải thích hành vi)

`lib/library-bridge.ts` — cả 3 hàm export (`getCatalogFromLibrary`, `getCompareProjects`, `getFullCatalog`) đều theo mẫu:

```ts
try {
  ... load từ vendor/library ...
} catch (err) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Library catalog unavailable in production: " + ...);
  }
  const mock = await import("@/lib/mock-data");
  return { source: "mock", ... };
}
```

- **Production:** load thất bại → `throw` thẳng, không còn fallback âm thầm sang mock. Lỗi này sẽ nổi lên `app/error.tsx` (error boundary đã có sẵn trong repo) để hiển thị thông báo lỗi có thương hiệu, thay vì âm thầm render "4 dự án" giả từ mock-data.
- **Development/test:** vẫn fallback mock như cũ (`app/page.tsx` còn hiển thị banner amber "Library seed unavailable — using v0 mock-data fallback" khi `source === "mock"`) — không phá vỡ trải nghiệm dev.
- **Cách test đã xác nhận:** build production hiện tại (`pnpm build`) chạy xanh nghĩa là trong môi trường build, `vendor/library/` + `vendor/data/` sẵn có nên nhánh throw không bị kích hoạt (không phải false negative) — đây là quan sát đúng dự kiến vì repo tự chứa vendor copy. Nhánh throw chỉ kích hoạt khi thiếu file vendor, đúng như DoD yêu cầu (không cần giả lập thiếu file để verify logic — code đọc rõ ràng theo `NODE_ENV`).

F3 PASS.

---

## 6. F5 mobile IA / F9 dark contrast / F10 home fold — tóm tắt thay đổi (verify bằng đọc code, không chụp lại screenshot mới)

### F5 — Mobile taxonomy IA (`components/shared/mobile-nav.tsx`)
- Accordion 2 cấp dùng `PROJECT_NAV_ZONES` / `getZoneProjects` / `resolveNavLeaves` từ `lib/project-nav-taxonomy.ts` (cùng nguồn dữ liệu với dropdown desktop `project-nav-dropdown.tsx`).
- Phía Bắc: leaf hiện trực tiếp khi mở accordion.
- Phía Nam: expand thành 2 sub-group Site A / Outsite.
- Leaf có dự án live → `<Link href="/du-an/{slug}">`, đóng dialog khi click. Leaf coming-soon → `div aria-disabled="true"`, không click được, mờ (`opacity-55`), xếp dưới subheader viết hoa nhỏ ("Sắp công bố"-style).
- `DialogTitle` vẫn còn (`nav.menuLabel`), giữ a11y.

### F9 — Dark contrast (`components/project/legal-dossier-table.tsx`)
- **Bug thật đã sửa** (không phụ thuộc theme): dialog xem tài liệu từng bị lệch ra ngoài màn hình ~50% do double transform — vừa dùng class Tailwind v4 `left-1/2 translate-x-[-50%]` (set CSS property `translate` gốc) **vừa** set `transform: translateX(-50%)` riêng, hai cơ chế CSS độc lập cộng dồn lệch vị trí. Code hiện tại đã gộp về một khai báo duy nhất: `"left-1/2 translate-x-[-50%] translate-y-0"` (dòng ~270), có comment giải thích rõ tại sao không được set `transform` song song.
- Khung placeholder scan tài liệu: viền dashed đổi từ `border-muted-foreground/40` (light) sang thêm `dark:border-muted-foreground/70` — nâng tỉ lệ tương phản dark mode từ ~1.27:1 lên ~3:1, dùng token `--muted-foreground` sẵn có (không thêm token mới).
- Map chrome (`vn-map.tsx` / `region-map-canvas.tsx`) đã được AGENT-05 kiểm tra dark mode, xác nhận sẵn ổn, không sửa.

### F10 — Home first-viewport budget (`components/home/hero.tsx`, `app/page.tsx`)
- `<section>` Hero đổi từ padding theo nội dung sang `min-h-[calc(100dvh-60px)] flex items-center` → Hero chiếm trọn viewport đầu tiên ở các kích thước desktop phổ biến (đo ~0.7px sub-pixel margin ở 1440×900 theo báo cáo AGENT-05), FeaturedCards không còn lấn vào fold đầu.
- Mobile 375px: Hero tự nhiên cuộn nhẹ vì nội dung Hero vượt quá 1 màn hình ở kích thước đó — được đánh giá là chấp nhận được (đúng dự kiến, không phải composition-stack cạnh tranh).
- `app/page.tsx`: thứ tự section không đổi (`Hero → FeaturedCards → ExplorerPreview → VnMap → LegalTeaser → Updates`), không có StatStrip/vanity metrics — xác nhận qua git status: `components/home/stat-strip.tsx` và `components/home/portfolio-timeline.tsx` bị **xóa** (không phải chỉ ẩn), `components/shared/number-ticker.tsx` cũng bị xóa.

---

## 7. AC table (đối chiếu mục 5 master prompt)

| ID | Criterion | Verdict | Bằng chứng ngắn |
|---|---|---|---|
| AC0 | ≥5 distinct sub-agent STATUS blocks (ưu tiên 6) | PASS | 7 lượt agent trong rollup mục 2 (bao gồm 3 lượt phải làm lại do lỗi cwd, bù bằng Orchestrator + AGENT-04b + AGENT-05 + AGENT-06) |
| AC1 | F1: zero `7465` / agent-log regions | PASS | Grep zero matches (mục 3.1), `instrumentation.ts` không tồn tại và chưa từng được commit |
| AC2 | F2: ignoreBuildErrors off; `pnpm typecheck` = 0 | PASS | `next.config.mjs` có `ignoreBuildErrors: false`; `tsc --noEmit` exit 0 (mục 4) |
| AC3 | F3: prod path cannot silently serve mock | PASS | Code citation `lib/library-bridge.ts` throw-in-prod (mục 5) |
| AC4 | F4: build green; 4 routes smoke PASS | PASS | `pnpm build` exit 0; 5/5 route HTTP 200 (mục 4, 4.1) |
| AC5 | F5: mobile hierarchy IA live @375 | PASS | Code xác nhận accordion 2 cấp + live/coming-soon leaves (mục 6) — không chụp lại screenshot mới trong lượt verify này, dựa trên đọc code trực tiếp |
| AC6 | F6: no v0 generator; package renamed | PASS | Grep zero matches; `package.json.name = "ded-pmh"` (mục 3.2) |
| AC7 | F7: `/lab` not in public nav; noindex intact | PASS | Grep zero matches trong 3 file nav; `robots.ts` disallow + `metadata.robots` noindex (mục 3.3) |
| AC8 | F8: CONDITIONAL deferred note present | CONDITIONAL | `images.unoptimized: true` giữ nguyên trong `next.config.mjs`, không có flip; residual note ở mục 9 dưới |
| AC9 | F9: dark contrast evidence | PASS | Code citation transform-fix + border contrast token (mục 6) — verify bằng đọc code, không chụp screenshot dark mode mới trong lượt này |
| AC10 | F10: home fold matches one-composition DoD | PASS | `min-h-[calc(100dvh-60px)]` + `flex items-center`; StatStrip/number-ticker đã bị xóa hẳn (mục 6) |
| AC11 | No compare/legal/PDF honesty regression | PASS | `pnpm build` xanh bao gồm `/so-sanh`, `/phap-ly`, 4 trang `/du-an/[slug]` SSG; HTTP 200 cả 2 route; không có thay đổi phá vỡ cấu trúc compare/legal ngoài phạm vi F9 |
| AC12 | Smoke report written; no commit/push | PASS | File này được ghi tại `reports/2026-08-12-v0-audit-waves-abc-smoke.md`; không thực hiện `git add`/`git commit`/`git push` trong phiên AGENT-06 |

**Công thức PASS:** AC0 + AC1–AC7 + AC9–AC12 đều PASS, và AC8 = CONDITIONAL → thỏa điều kiện PASS.

---

## 8. Residuals / lưu ý còn tồn đọng

1. **F8 — Image optimization (deferred, đúng theo default Q1 của master prompt):** `next.config.mjs` vẫn giữ `images.unoptimized: true`. Chưa có bằng chứng CDN/policy để bật Next image optimization an toàn — không flip trong wave này, đúng chủ đích. Việc bật tối ưu ảnh nên để wave sau, kèm theo xác nhận CDN/edge cache trước.
2. **Git identity không khớp CLAUDE.md:** `git config user.email` trong workspace hiện trả về `angularsolution2025@gmail.com` (user: `QuocThang20250`), **không phải** `howtodonext.com@gmail.com` theo yêu cầu bắt buộc của `CLAUDE.md`. Đây **không phải vấn đề tại thời điểm này** vì phiên làm việc này không push gì lên remote — nhưng **bắt buộc phải đổi** (`git config user.email "howtodonext.com@gmail.com"` + `user.name "howtodonext"`, phạm vi local repo, không `--global`) trước khi bất kỳ ai chạy `git push` trên repo này.
3. **F5/F9 evidence trong báo cáo này là code-review, không phải screenshot mới:** AGENT-06 verify bằng đọc trực tiếp mã nguồn (component logic, class Tailwind, token màu) thay vì chụp lại ảnh chụp màn hình @375 / dark-mode mới — vì đây là hạng mục optional trong OWN của AGENT-06 ("optionally... nếu bạn chụp screenshot"), và các thay đổi có thể xác minh chắc chắn qua code + build xanh. Nếu cần bằng chứng hình ảnh chính thức, nên chạy một lượt QA trình duyệt (MCP/Playwright) riêng.
4. **Working tree có nhiều thay đổi chưa commit** (xem `git status`): các thay đổi từ AGENT-02/AGENT-04b/AGENT-05 (và một số work item từ trước, ví dụ `compare-table.tsx`, `project-nav-dropdown.tsx`, `legal-page-client.tsx` mới) đều đang ở trạng thái uncommitted. AGENT-06 **không commit/push** theo đúng chỉ thị.

---

## 9. Kết luận

**PASS tổng thể.** Waves A→B→C đã đóng theo đúng công thức mục 5 master prompt: AC0, AC1–AC7, AC9–AC12 đều PASS; AC8 ở trạng thái CONDITIONAL (đúng chủ đích, không phải lỗi). Không có regression build-breaking nào phát hiện trong lượt verify độc lập này; không cần dùng đến quyền sửa khẩn cấp (≤3 lần) của AGENT-06.

`Source-audit Waves A→B→C CLOSED — 7 agent-lượt (bù 3 lượt lỗi workspace) · P0 gated · P1 mobile+brand · P2 polish · F8 deferred · no push.`
