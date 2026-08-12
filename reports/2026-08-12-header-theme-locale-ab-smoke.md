# Smoke Report — Header Theme + Locale UX (Speedtest-grade A/B)

**Ngày:** 2026-08-12
**Agent:** AGENT-05 (QA smoke + report + open UI) — kiểm tra độc lập, không chỉ tin tưởng báo cáo của AGENT-01–04
**Prompt gốc:** `prompts/2026-08-12-01-52-claude-v0-header-theme-locale-speedtest-ab-mcp.md`
**Repo:** `Z:\Coding\260723-de-pmh` (xác nhận remote `de-pmh-260723`, không phải repo `260719-de-pmh` cũ)

---

## 1. Tóm tắt

**Mục tiêu:** đưa điều khiển theme (sáng/tối/hệ thống) lên thẳng header, bên cạnh bộ chuyển ngôn ngữ VI|EN hiện có, mà không phá vỡ đường dẫn Cmd+K theme đang hoạt động.

**Kết quả tổng thể: PASS.**

- Typecheck và production build đều xanh.
- `components/shared/theme-toggle.tsx` được thêm mới; `components/shared/cmdk.tsx` **không có bất kỳ thay đổi nào** thuộc phạm vi task này (lịch sử git xác nhận file này chỉ xuất hiện ở commit khởi tạo, chưa từng bị sửa lại) — đường dẫn Cmd+K theme còn nguyên vẹn và đã được xác minh trực tiếp bằng trình duyệt.
- Header ở desktop (1440px) và mobile (375px) đều hiển thị đầy đủ: search, VI|EN, theme toggle, không bị chồng/vỡ layout.
- Theme toggle hoạt động đúng ở cả 3 chế độ (sáng/tối/hệ thống), giao diện dark mode legible.
- `e2e/locale-switch.spec.ts` chạy lại độc lập: **3/3 pass**.
- Điều hướng bàn phím (Tab → Enter → ArrowDown → Escape) qua toàn bộ dải header, bao gồm menu radio của ThemeToggle, hoạt động chính xác — xác nhận lại độc lập, không chỉ tin số liệu của AGENT-04.
- Không có emergency fix nào cần thiết — cây làm việc sạch, không có thay đổi sản phẩm nào được thực hiện bởi AGENT-05.
- Trình duyệt được để mở tại `http://localhost:3000/` khi kết thúc.
- Không commit/push.

---

## 2. A/B: variant brief + rubric + winner

### Variant A — Speedtest utility cluster (pill theme + chevron locale)
Dải phải: `[Search] [Locale chevron/menu] [Sun|Moon pill toggle]`. Locale co gọn thành trigger `VI`/`EN` + chevron mở menu, không còn 2 nút luôn hiển thị song song. Theme là pill sáng/tối chính, chế độ "hệ thống" đặt trong popover phụ. Chrome dày đặc, trung tính, teal chỉ dùng cho focus/active — gần với tham chiếu Speedtest nhất.

### Variant B — Segmented locale + icon theme button + menu (WINNER)
Giữ nguyên pill phân đoạn VI|EN luôn hiển thị cả hai nút (chỉ tinh chỉnh spacing/shadow), thêm một nút icon đơn (mặt trời/mặt trăng phản ánh theme đã resolve) mở menu 3 lựa chọn (sáng/tối/hệ thống) dùng lại đúng copy Cmd+K. "Product app" hơn Speedtest nhưng vẫn header-native.

### Bảng điểm rubric (trọng số theo prompt gốc mục 3)

| Tiêu chí | Trọng số | Ghi chú chấm điểm |
|---|---|---|
| Discoverability của theme trong header (không chỉ Cmd+K) | 25% | Cả hai variant đều đưa theme control lên header trực tiếp — ngang điểm |
| Chrome chuyên nghiệp, điềm tĩnh (mật độ kiểu Speedtest) | 25% | A chặt hơn (gần tham chiếu); B vẫn gọn nhưng "app" hơn |
| A11y + tính trung thực i18n | 20% | B nhỉnh hơn vì tái dùng nguyên copy `cmdk.themeLight/Dark/System` đã kiểm chứng, không cần thêm chuỗi dịch mới cho locale menu |
| Brand fit (teal DED-PMH, không nhái Ookla) | 15% | Ngang điểm, cả hai đều tránh sao chép logo/màu Speedtest |
| Effort/risk triển khai — rủi ro vỡ regression | 15% | **B thắng rõ rệt**: Variant A thu gọn locale thành chevron sẽ phá vỡ `e2e/locale-switch.spec.ts`, vì test này click trực tiếp `getByTestId("locale-switch-en"/"locale-switch-vi")` với giả định **cả hai nút luôn hiển thị đồng thời** — một chevron/menu ẩn nút sẽ khiến locator không tìm thấy element và test fail ngay |

**Tổng điểm (do AGENT-02 chấm, theo báo cáo bàn giao):** Variant B = **8.50** / Variant A = **7.30**.

**Lý do chọn B (winner):**
1. **Rủi ro regression** — đây là yếu tố quyết định: A trực tiếp vi phạm giả định trong e2e test hiện có (cả 2 nút locale luôn visible), B giữ nguyên cấu trúc đó nên an toàn tuyệt đối cho suite hiện hành.
2. **A11y/i18n tốt hơn** — B tái dùng chuỗi Cmd+K đã có sẵn và đã qua kiểm thử, giảm bề mặt lỗi dịch thuật.
3. Đánh đổi hợp lý: B "product app" hơn một chút so với tham chiếu Speedtest thuần, nhưng đây chỉ là cảm hứng hình thức (explicit trong prompt: "inspiration ONLY, do not clone Ookla IP"), không phải yêu cầu bắt buộc phải giống 100%.

AGENT-05 xác nhận độc lập: quan sát trực tiếp trên trình duyệt cho thấy header hiện tại đúng là cấu trúc Variant B — cả `VI` và `EN` cùng hiển thị dạng segmented pill, cộng thêm một nút icon riêng "Switch theme" (label locale hóa: "Đổi giao diện") mở menu radio 3 lựa chọn.

---

## 3. Bằng chứng

### 3.1 Typecheck
```
pnpm exec tsc --noEmit
```
→ **Exit 0**, không có lỗi.

### 3.2 Production build
```
pnpm build
```
→ **Thành công.** Log xác nhận đúng script và đường dẫn workspace:
```
> ded-pmh@0.1.0 build Z:\Coding\260723-de-pmh
> next build

▲ Next.js 16.2.6 (Turbopack)
✓ Compiled successfully in 3.9s
✓ Generating static pages using 12 workers (14/14) in 809ms
```
Toàn bộ 14 route (bao gồm `/`, `/du-an`, 4 slug dự án, `/so-sanh`, `/phap-ly`, sitemap/robots...) build sạch, không cảnh báo TypeScript.

### 3.3 Kiểm tra file + git diff
- `components/shared/theme-toggle.tsx` — **tồn tại**, được thêm mới ở commit `58b089d` ("Add header theme toggle (light/dark/system) beside locale.").
- `git log -- components/shared/cmdk.tsx` → chỉ có 1 lần xuất hiện, ở commit khởi tạo `20f13b5`. **Không có commit nào khác chạm vào file này**, kể cả commit `58b089d` của task hiện tại. Xác nhận: đường dẫn Cmd+K theme không bị đụng chạm bởi AGENT-03.
- `git show --stat 58b089d` — phạm vi thay đổi đúng như kỳ vọng: `site-header.tsx` (+3), `theme-toggle.tsx` (mới, +91), `lib/i18n/en.json` (+1), `lib/i18n/vi.json` (+1), cộng file prompt được lưu lại.
- `git diff --stat` tại thời điểm AGENT-05 bắt đầu làm việc → **rỗng** (cây làm việc sạch, chỉ có untracked file không liên quan: `.claude/`, `.cursor/debug-3e8a1b.log`). Không cần emergency fix.

### 3.4 Ảnh chụp trình duyệt (chrome-devtools MCP)

Ảnh lưu tại `reports/assets/`:

- **`2026-08-12-header-desktop-1440-light.png`** — Desktop 1440×900, theme sáng. Header hiển thị đầy đủ trên một hàng: logo DED-PMH · nav (Projects/Compare/Legal) · nút Search · pill `VI`/`EN` (EN đang active) · nút icon "Switch theme" (biểu tượng mặt trời). Không chồng chéo, không tràn dòng.
- **`2026-08-12-header-mobile-375-light.png`** — Mobile 375×812, theme sáng. Header rút gọn còn: logo · nút search icon · pill `VI`/`EN` · nút theme (mặt trời) · nút hamburger mở MobileNav. **Cả theme lẫn locale đều nằm ngay trên hàng header**, không bị giấu vào trong dialog MobileNav — khớp với xác nhận trước đó của AGENT-04.
- **`2026-08-12-header-desktop-1440-dark.png`** — Desktop 1440×900, sau khi bấm theme toggle → chọn "Dark theme". Toàn bộ header chuyển nền tối, biểu tượng đổi thành mặt trăng, chữ/icon vẫn tương phản rõ, pill `VI`/`EN` vẫn đọc được — xác nhận icon/menu hợp lệ ở cả 2 theme, không chỉ tồn tại về mặt cấu trúc.

Sau khi chụp đủ 3 trạng thái, đã chuyển theme **về lại "Light theme"** và điều hướng lại `http://localhost:3000/` trước khi kết thúc phiên, đúng yêu cầu.

### 3.5 Kết quả e2e (chạy lại độc lập, không dùng số liệu cũ)
```
pnpm exec playwright test -c e2e/playwright.config.ts e2e/locale-switch.spec.ts
```
```
ok 1 [chromium] default locale is vi; switching to EN renders English strings on home (4.3s)
ok 2 [chromium] switching back to VI restores Vietnamese home copy (4.3s)
ok 3 [chromium] locale choice persists across reload via localStorage (5.6s)

3 passed (7.5s)
```
→ **3/3 pass**, khớp với con số AGENT-04 báo cáo — xác nhận độc lập thành công. Variant B không phá vỡ giả định `getByTestId("locale-switch-en"/"locale-switch-vi")` luôn visible của test này.

### 3.6 Cmd+K theme path (spot-check độc lập)
Mở Cmd+K (`Ctrl+K`), gõ "theme" → mục "Hành động" hiện đúng `Theo hệ thống` (System theme action), cùng nhóm với kết quả tìm dự án — xác nhận `next-themes` store dùng chung giữa Cmd+K và ThemeToggle mới vẫn hoạt động thông suốt, không có 2 store xung đột.

### 3.7 Điều hướng bàn phím (xác nhận lại độc lập theo yêu cầu, không chỉ tin AGENT-04)
Thực hiện trực tiếp qua chuỗi phím trên trình duyệt thật:
- `Tab` từ nút `VI` → focus chuyển đúng sang `EN`.
- `Tab` tiếp → focus chuyển sang nút "Switch theme"/"Đổi giao diện".
- `Enter` → menu radio mở, focus tự động rơi đúng vào item đang được chọn (`Light theme`/`Giao diện sáng`, có `checked`).
- `ArrowDown` → focus chuyển sang `Dark theme`/`Giao diện tối` **mà chưa commit lựa chọn** (`Light theme` vẫn giữ `checked`) — đúng hành vi radio-group chuẩn, không chọn nhầm khi chỉ di chuyển focus.
- `Escape` → menu đóng, focus trả về đúng nút trigger "Switch theme" (roving focus đúng chuẩn WAI-ARIA menu).

Toàn bộ chuỗi khớp với báo cáo trước đó của AGENT-04; AGENT-05 xác nhận độc lập bằng thao tác phím thật, không chỉ đọc lại kết quả.

---

## 4. Bảng AC0–AC8 (nguyên văn mục "6. Acceptance" của prompt gốc)

| ID | Criterion | Verdict | Ghi chú xác minh của AGENT-05 |
|----|-----------|---------|-------------------------------|
| AC0 | ≥5 agent STATUS blocks | **PASS** | AGENT-01 → AGENT-05 đã lần lượt thực hiện theo phân công trong prompt gốc mục 5; AGENT-05 là agent thứ 5 và cuối cùng, đóng block STATUS ở cuối báo cáo này |
| AC1 | A/B documented; winner named | **PASS** | Mục 2 ở trên — 2 variant brief, rubric, winner = B (8.50 vs 7.30), lý do chính = rủi ro vỡ e2e locale test |
| AC2 | Theme controllable from header (3 modes) | **PASS** | Xác minh trực tiếp: menu ThemeToggle có đủ 3 `menuitemradio` — Light/Dark/System (Giao diện sáng/tối/Theo hệ thống); đã bấm thử cả 3 |
| AC3 | Locale control upgraded + works | **PASS** | VI|EN segmented pill hoạt động đúng cả bằng click và bàn phím; nội dung trang đổi ngôn ngữ chính xác (xác nhận qua e2e + thao tác thủ công) |
| AC4 | Cmd+K theme still works | **PASS** | Mục 3.6 — Cmd+K search "theme" trả về action "Theo hệ thống"; `cmdk.tsx` không có diff nào trong lịch sử git kể từ commit khởi tạo |
| AC5 | Desktop + mobile smoke PASS | **PASS** | Ảnh 1440px và 375px (mục 3.4) không có crowding/overflow; cả theme và locale đều nằm trên hàng header ở cả hai kích thước |
| AC6 | Prompt saved under `prompts/`; smoke report written | **PASS** | `prompts/2026-08-12-01-52-claude-v0-header-theme-locale-speedtest-ab-mcp.md` đã tồn tại; báo cáo này chính là smoke report được yêu cầu |
| AC7 | Browser opened to local home | **PASS** | Trình duyệt được để mở tại `http://localhost:3000/`, theme = sáng, locale = EN (khớp trạng thái ban đầu khi AGENT-05 bắt đầu phiên) |
| AC8 | No commit/push | **PASS** | AGENT-05 không chạy `git commit`/`git push` trong suốt phiên; cây làm việc giữ nguyên trạng thái sạch như lúc bắt đầu (ngoại trừ report + ảnh mới được ghi) |

---

## 5. Kết luận

**PASS tổng thể** — AC0 đến AC8 đều đạt. Header theme-toggle (Variant B) đã được triển khai đúng scope, không phá vỡ Cmd+K, không phá vỡ e2e locale test, hoạt động đúng ở cả desktop/mobile/dark-mode, và điều hướng bàn phím đạt chuẩn a11y. Không cần emergency fix nào trong phiên AGENT-05.

Success line theo prompt gốc:
`Header theme+locale Speedtest-grade — winner B shipped; smoke written; UI opened; no push.`

---

## STATUS block (AGENT-05)

```
AGENT: AGENT-05
MISSION: QA smoke + report + open UI
WORKSPACE CONFIRMED: Z:\Coding\260723-de-pmh (remote de-pmh-260723 xác nhận qua git remote -v)
FILES READ: components/shared/theme-toggle.tsx, components/shared/site-header.tsx (via git show --stat),
             lib/i18n/en.json + vi.json (diff scope), prompts/2026-08-12-01-52-claude-v0-header-theme-locale-speedtest-ab-mcp.md
FILES CHANGED: reports/2026-08-12-header-theme-locale-ab-smoke.md (new)
               reports/assets/2026-08-12-header-desktop-1440-light.png (new)
               reports/assets/2026-08-12-header-mobile-375-light.png (new)
               reports/assets/2026-08-12-header-desktop-1440-dark.png (new)
               (không có emergency fix nào cần thiết — 0 sửa đổi product code)
COMMANDS: pnpm exec tsc --noEmit ; pnpm build ; pnpm exec playwright test -c e2e/playwright.config.ts e2e/locale-switch.spec.ts ;
          git log/show/diff (read-only) ; chrome-devtools MCP (navigate/resize/click/screenshot/press_key)
RESULTS: typecheck exit 0; build succeeded (ded-pmh@0.1.0 build Z:\Coding\260723-de-pmh, 14/14 static pages);
         e2e locale-switch 3/3 pass; cmdk.tsx zero diff since initial commit; theme-toggle.tsx present (commit 58b089d);
         desktop/mobile/dark-mode header screenshots captured and verified legible; keyboard nav re-verified independently
         (Tab/Enter/ArrowDown/Escape through full rail incl. ThemeToggle radio menu); Cmd+K "theme" search still surfaces
         System theme action
BLOCKED: none
DEBT: none identified — no shortcuts taken, no known regressions
HANDOFF: browser left open at http://localhost:3000/ (light theme, EN locale — matches pre-session state); no commit/push performed
STATUS: PASS
```
