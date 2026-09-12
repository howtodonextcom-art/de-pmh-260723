# CLAUDE.md

Hướng dẫn vận hành cho Claude Code khi làm việc trong repo này (**DED-PMH v0 Track A**).

## ⚠️ Repo độc lập — không còn chung git với thư mục cha

Kể từ **2026-07-23**, `v0/` là **git repo độc lập hoàn toàn**, tách khỏi monorepo `260719-DE` (thư mục cha, repo `260709-ded`). Không dùng chung lịch sử, remote, hay identity với thư mục cha nữa. CLAUDE.md ở `Z:\Coding\260719-DE\CLAUDE.md` (thư mục cha) áp dụng cho repo khác — không áp dụng cho `v0/`.

Lịch sử git cũ của `v0/` (khi còn là subfolder của `260719-de-pmh`) đã bị xóa cục bộ và khởi tạo lại sạch (1 commit gốc). Repo `260719-de-pmh` cũ đang được người dùng xóa — **chỉ còn duy nhất repo này** để làm việc.

## Luật bắt buộc: Git / GitHub / Vercel

**Tài khoản GitHub duy nhất được phép dùng để push repo này: `howtodonext.com@gmail.com`.**

**Repo GitHub duy nhất:** `https://github.com/howtodonextcom-art/de-pmh-260723` (private).

### Lý do

Repo này deploy tự động lên Vercel theo pipeline GitHub → Vercel. Nếu commit được push lên từ nhiều tài khoản GitHub khác nhau (hoặc từ tài khoản không phải `howtodonext.com@gmail.com`), Vercel sẽ yêu cầu **nâng cấp tài khoản Vercel lên gói trả phí** để tiếp tục nhận diện/liên kết đúng người đóng góp và deploy. Để tránh phát sinh chi phí ngoài ý muốn, mọi push vào remote GitHub của repo này chỉ được thực hiện dưới danh tính `howtodonext.com@gmail.com`.

**Bài học thực tế (2026-07-23):** repo cũ từng dính nhánh rác do bot `v0.app` (identity `it+v0agent@vercel.com`) tự tạo khi công cụ AI-builder "v0" của Vercel được kết nối vào repo — khiến Vercel phát hiện nhiều contributor và đòi nâng cấp. Vì vậy: **không kết nối repo này với v0.app / bất kỳ tool AI-builder nào tự động push code**, chỉ Claude Code (identity `howtodonext.com@gmail.com`) được ghi vào repo.

### Quy tắc thực thi

1. **Trước khi push lần đầu trong phiên làm việc**, kiểm tra danh tính git đang cấu hình cho repo:
   ```bash
   git config user.email
   ```
   - Nếu khác `howtodonext.com@gmail.com` (hoặc chưa được set ở local repo), **phải set lại ở phạm vi local repo** (không sửa `--global`) trước khi commit/push:
     ```bash
     git config user.email "howtodonext.com@gmail.com"
     git config user.name "howtodonext"
     ```
2. **Không bao giờ** chạy `git push` nếu chưa xác nhận `git config user.email` trả về đúng `howtodonext.com@gmail.com`.
3. Nếu máy đang đăng nhập GitHub CLI (`gh auth status`) hoặc credential helper bằng tài khoản khác — **dừng lại và hỏi người dùng** trước khi push, không tự ý đổi đăng nhập hệ thống hoặc thử push bằng tài khoản khác để "thử cho được việc".
4. Nếu cần tạo remote mới (`git remote add origin ...`), xác nhận URL trỏ đúng `github.com/howtodonextcom-art/de-pmh-260723` trước khi thêm — **không** trỏ về repo cũ `260719-de-pmh` (đang bị xóa).
5. Không dùng `git push --force` lên nhánh chính trừ khi người dùng yêu cầu tường minh trong phiên làm việc đó.
6. Nếu người dùng yêu cầu push nhưng identity hiện tại không khớp, báo rõ tình trạng và đề xuất lệnh sửa (mục 1) thay vì tự ý bỏ qua luật này.
7. **Định kỳ kiểm tra** `gh api repos/howtodonextcom-art/de-pmh-260723/branches` — nếu thấy nhánh lạ không phải do phiên làm việc này tạo (đặc biệt author không phải `howtodonext.com@gmail.com`), báo ngay cho người dùng trước khi xóa hay bỏ qua.

### Không áp dụng cho

- Các thao tác git cục bộ không push (commit, branch, diff, log, status) — không cần kiểm tra identity trước.
- Đọc/kiểm tra repo (`git log`, `git show`, v.v.).

## Vercel

- Production hiện tại: `https://de-division-pmh.vercel.app` (kế thừa từ repo cũ — **cần xác nhận lại/kết nối lại** Vercel Project với repo mới `de-pmh-260723` nếu chưa tự động cập nhật, vì Vercel Project gắn theo tùy chỉnh riêng, không tự đổi theo remote GitHub).
- Nếu deploy báo lỗi liên quan "team upgrade"/"nhiều contributor" — **không phải do repo này** (đã xác nhận repo chỉ có 1 identity duy nhất trong toàn bộ lịch sử tính đến 2026-07-23) — kiểm tra xem Vercel Project đang trỏ có bị tái sử dụng từ project cũ hay không trước khi kết luận.
- Vercel MCP cần OAuth tương tác (`claude mcp` hoặc `/mcp` trong phiên tương tác) — không tự làm được trong phiên non-interactive.

## Ghi chú vận hành khác

- Dev server Windows: dùng `next dev --webpack` (không dùng Turbopack cho `dev`, `next build` vẫn dùng Turbopack bình thường) — Turbopack dev-mode từng gây crash-loop hàng nghìn `node.exe` trên máy này.
- `pnpm luxury:qa:auto` — pipeline chấm điểm UI/UX (`capture → pixelmatch diff → score`), gate ở `LuxuryIndex ≥ 85` (`scripts/luxury/score.mjs`, biến `LUXURY_MIN_INDEX`). **Lưu ý:** file điểm này tự chấm thủ công (không phải audit tự động thực sự) — từng báo 87/100 trong khi audit độc lập (2026-09-11) chấm 65/100 trên cùng trang. Không tin tưởng con số này khi đánh giá thực trạng UI, chỉ dùng làm lịch sử.
- Skill `frontend-design` (từ github.com/anthropics/skills) đã cài tại `.claude/skills/frontend-design/` — nếu gọi qua Skill tool báo "Unknown skill" dù file đã tồn tại đúng chỗ, đó là do harness chỉ quét danh sách skill lúc bắt đầu phiên; cần mở phiên Claude Code mới để `/frontend-design` khả dụng, không phải lỗi cài đặt.
- Không commit/push nếu người dùng chưa yêu cầu tường minh trong phiên làm việc đó.

## Known Design Debt (từ đợt nâng cấp UI/UX 2026-09-11)

Audit độc lập trên `/du-an/[slug]` (kiến trúc dùng chung `components/project/detail/*.tsx` cho cả 12 dự án) chấm 65/100 trên checklist 8 tiêu chí [Point of view, Typography, Restrained color, Hierarchy, Imagery, Motion, Mobile, Invisible stuff]. Đã sửa và verify bằng MCP browser (3/12 dự án: hong-hac, sen-viet, aristo — light/dark, desktop 1440/mobile 375, typecheck sạch):
- Dark theme depth (app/globals.css: nới L-gap giữa background/card/secondary/accent, sửa `--shadow-card` từ đen-trên-đen vô hình thành shadow nhìn thấy được)
- `bg-card` cho các info-box từng trong suốt (fact-grid, masterplan Stat, architecture-partners, product-line)
- Radius nhất quán: architecture-partners.tsx đổi `rounded-2xl`→`rounded-xl` cho khớp quy tắc "info-box = xl, media frame = 2xl"
- Spacing rhythm: phá `py-16` đồng nhất thành 3 tầng (py-12 sources/legal-teaser, py-14 story/location/masterplan/architecture-partners/product-line, py-16 fact-grid/gallery/sales-status/related)
- 1 khoảnh khắc motion có chủ đích (Sales Status dùng `Reveal`) thay vì rải fade-slide-up mọi section — theo đúng cảnh báo AI-tell của skill `frontend-design`
- Loading skeleton cho `ImageWithFallback` (tái dùng `.animate-skeleton` có sẵn)
- Empty-state hero (dự án chưa có ảnh, vd Sen Việt): thay gradient trống bằng hoạ tiết lưới bản vẽ kỹ thuật bám chủ đề bất động sản/masterplan

**Round 2 (2026-09-11, cùng ngày) — đã giải quyết:**
1. **Typography/Hierarchy**: Sales Status H2 nâng lên `text-2xl sm:text-3xl` (tier "major"), Legal Teaser H2 giảm xuống `text-xl font-semibold` (tier "minor") — tạo tương phản rõ giữa section quan trọng nhất và section phụ, thay vì mọi H2 đồng loạt `text-2xl font-bold`.
2. **Invisible stuff (AI-tell copy)**: bỏ ALL-CAPS (`uppercase tracking-wide`) ở 2 label trong sales-status.tsx; bỏ '→' baked trong text ở 6 chuỗi i18n (`viewAllZoneBac/SiteA/Outsite`, `viewAllFilters`, `browseCatalogShort`, `mapSaBanCta`) — nút CTA thay bằng `ArrowRightIcon` (lucide-react) riêng biệt, link text bỏ hẳn (đã có underline làm affordance); sửa luôn pattern "WORD — fragment lặp" ở legal-teaser.tsx accordion trigger.
3. **Mobile regression đầy đủ 12/12 dự án**: verify MCP tại 375px cho toàn bộ aristo, casa-luna, culture-center, harmonie, hong-hac, regency, sculptura, sen-viet, the-maverick, the-monarch, the-oasis, triton-crown — không overflow (`scrollWidth === clientWidth` mọi trang), 0 console error (chỉ còn 1 warning LCP có từ trước, không liên quan). Desktop 1440 spot-check thêm triton-crown, home page — nhất quán.
4. `tsc --noEmit` sạch sau toàn bộ thay đổi Round 1 + Round 2.

**Round 3 (2026-09-11, cùng ngày) — học kỹ thuật từ dự án tham chiếu:**
Đọc `C:\Code\2026\260812-lanphuong-namecard\src\app\globals.css` (theme "Archive Atelier", palette charcoal+gold khác brand) để trích kỹ thuật, KHÔNG đổi teal hue 165/radius mềm hiện tại (đã chốt với người dùng). Kiểm chứng cho thấy 2/4 kỹ thuật định mượn **đã tồn tại dưới hình thức tương đương** trong DED-PMH:
- "accent-solid/accent-on-solid pair" ≈ `--primary`/`--primary-foreground` đã có sẵn, đã đúng
- "shadow+ring khi hover" ≈ `hover:shadow-xl hover:shadow-primary/10` trên ProjectCard đã có sẵn, đã đúng

2 kỹ thuật thực sự mới đã thêm:
- **Noise/grain texture** (`.dark body`, feTurbulence SVG data-URI, tinh chỉnh màu teal thay vì tone ấm gốc, alpha 0.045 — nhẹ hơn bản gốc 0.07 vì đây là internal tool, không phải brand archive/editorial) — verify bằng computed style (`backgroundImage` chứa data-URI ở dark, `none` ở light — đúng scope).
- **`--border-accent` ("foil")** — token mới, áp dụng `dark:ring-1 dark:ring-border-accent dark:ring-inset` cho khung hero image (bề mặt "quý giá" nhất nhưng trước đó chưa có viền nào) — verify computed `boxShadow` chứa `oklch(0.62 0.072 165 / 0.3) ... inset` đúng giá trị token.

Test: hong-hac (có ảnh) + sen-viet (empty-state, không ảnh) ở dark, không xung đột với blueprint-grid đã làm ở Round 1; light mode xác nhận không bị ảnh hưởng; mobile 375 không overflow; `tsc --noEmit` sạch.

**Vẫn còn nợ (chưa trong phạm vi, cần prompt riêng nếu muốn làm):**
1. Nhãn ALL-CAPS mang tính cấu trúc điều hướng (label "PROJECTS"/"REGION"/"Coming soon" trong project-nav-dropdown.tsx, mobile-nav.tsx) — cố tình giữ nguyên vì đây là taxonomy label chức năng cho wayfinding, không phải decorative chrome như case sales-status đã sửa; cần đánh giá riêng nếu muốn đổi.
2. Desktop 1440 mới spot-check 6/12 dự án bằng screenshot trực quan (mobile đã đủ 12/12 qua overflow-check, nhưng chưa "nhìn bằng mắt" desktop cho 6 dự án còn lại).
3. **i18n VN↔EN** ở trang chi tiết dự án: đã xác nhận là nợ kiến trúc riêng (`docs/I18N_EN.md`), cố tình không đụng tới.
4. Chỉ áp `--border-accent` cho hero image; chưa mở rộng "foil" style sang Gallery tile hay ảnh masterplan/location — có thể làm nếu muốn nhất quán hơn.

## Round 4 (2026-09-11, cùng ngày) — Fix component "Vị trí & kết nối" luôn render trống

**Nguyên nhân gốc:** `components/project/detail/location.tsx` là component DUY NHẤT trong nhóm D1-D13 (xem comment ở app/du-an/[slug]/page.tsx: "Each block hides itself when its data is empty") thiếu guard `return null` — nên nó luôn hiện ra dù `project.address`/`highlights`/`saBanUrl`/`locationAsset` đều rỗng, tạo ra 1 label trơ trọi + khối gradient trống chiếm nửa màn hình (phát hiện qua Sculptura, user báo cáo).

**Đã sửa:**
- Thêm guard: `if (!address && !locationFacts.length && !saBanUrl && !imageUrl) return null;`
- Address rỗng nhưng có field khác → hiện "Chưa công bố" thay vì để trống im lặng
- Tách `BlueprintFallback` thành shared component (`components/shared/blueprint-fallback.tsx`) dùng chung cho `hero.tsx` VÀ `location.tsx` — trước đó pattern này chỉ tồn tại inline trong hero.tsx (Round 1), giờ location.tsx dùng lại đúng nghĩa thay vì gradient trơn cũ.

**PHÁT HIỆN QUAN TRỌNG (ngoài phạm vi sửa UI):** Sau khi thêm guard và test cả 12/12 dự án, section "Vị trí & kết nối" **biến mất hoàn toàn ở tất cả 12 dự án** — nghĩa là `project.address` (và facts/saBanUrl/locationAsset liên quan) **chưa được nhập cho bất kỳ dự án nào trong catalog**, không riêng Sculptura. Đây là lỗ hổng dữ liệu (data completeness), không phải lỗi UI — trước đây bị che giấu vì component luôn hiện ra dù rỗng, khiến vấn đề trông như "1 section xấu" thay vì "dữ liệu địa chỉ toàn site chưa nhập". Cần đội nội dung bổ sung `address` (và lý tưởng là `highlights` chứa từ khóa vị trí, `saBanUrl`, ảnh location) cho ít nhất 1 dự án để verify nhánh "có dữ liệu" của component còn hoạt động đúng (nhánh này type-check sạch nhưng CHƯA được test bằng dữ liệu thật, vì không có project nào hiện đủ điều kiện).

**Test:** 12/12 dự án — mobile 375 không overflow, 0 console error, `tsc --noEmit` sạch, xác nhận hero.tsx refactor (dùng BlueprintFallback) không đổi visual output.

## Round 5 (2026-09-11, cùng ngày) — Tính năng Passcode gate toàn site

**Kiến trúc:**
- `SITE_PASSCODE` (env var, server-only, KHÔNG prefix `NEXT_PUBLIC_`) — **cần set thủ công** tại Vercel → Project `de-division-pmh` → Settings → Environment Variables (không set được qua Vercel MCP trong phiên non-interactive, xem mục Vercel MCP ở trên). Không set = gate tắt (mặc định an toàn cho dev local).
- Chặn ở `proxy.ts` (Next.js 16 đổi tên `middleware.ts` → `proxy.ts` — **đã xoá `middleware.ts`** vì 2 file cùng tồn tại làm crash dev server: "Both middleware file and proxy file are detected"). Gate chạy TRƯỚC gate `/cms` hiện có — vào `/cms` cũng cần passcode trước.
- Cookie `site_access` (httpOnly, ký HMAC-SHA256 từ chính `SITE_PASSCODE` qua Web Crypto `crypto.subtle` — không cần thêm env var thứ 2, không forge được qua DevTools Storage editor), 30 ngày.
- Cookie `site_attempts` (httpOnly, đếm số lần sai, hết hạn 24h) + `site_locked` (httpOnly, set khi ≥5 lần sai, hết hạn 24h — khóa tự mở sau 24h theo quyết định của người dùng, không phải vĩnh viễn).
- Route `/passcode` (form nhập mã + màn hình khóa) và `/api/passcode` (xử lý verify + đếm lần sai).

**Test đã chạy (MCP thật, không đoán mò):** chưa cookie → redirect `/passcode`; sai 4 lần → "Còn N lần thử" giảm đúng; sai lần 5 → khóa, form biến mất; khóa persist qua `/`, `/du-an/hong-hac`, `/cms`; cookie giả mạo qua DevTools (`site_access=forged-value`) bị từ chối đúng thiết kế; đúng mã → unlock, redirect về trang đích, persist qua reload; `/passcode` tự redirect đi khi đã unlock; `tsc --noEmit` sạch.

**Giới hạn đã nêu rõ (không giấu):** đây là chặn theo cookie per-browser, KHÔNG phải chống brute-force cấp server — mở cửa sổ ẩn danh mới sẽ reset được số lần thử. Đủ để "ngăn người không có mã xem nhầm", KHÔNG đủ để chống người cố tình dò mã có chủ đích (muốn vậy cần rate-limit theo IP ở tầng server + KV store, ngoài phạm vi hiện tại).

**Khôi phục khi bị khóa (nhập sai 5 lần)** — khóa là cookie httpOnly per-browser, không phải khóa tài khoản:
1. Nhanh nhất, không cần đợi: mở cửa sổ ẩn danh/riêng tư (Incognito/Private) — không bị ảnh hưởng
2. Xóa cookie của riêng domain này qua trình duyệt: click ổ khóa 🔒 cạnh thanh địa chỉ → Cookie và dữ liệu trang web → Xóa (Chrome/Edge/Firefox đều có)
3. Chính xác qua DevTools (F12 → Application/Storage → Cookies): xóa đúng `site_locked`, `site_attempts`, `site_access`
4. Không làm gì: khóa tự hết hạn sau 24h
5. Dùng trình duyệt/thiết bị khác — không bị ảnh hưởng vì khóa chỉ theo trình duyệt đó

## Round 6 (2026-09-11, cùng ngày) — Xử lý mục 1-4 trong audit hoàn thiện dự án

Theo báo cáo audit "Mức độ hoàn thiện dự án" (điểm tổng 60/100), đã xử lý 4/5 mục "Phải làm trước khi launch thật":

1. **Sửa hardcode badge sai trong `fact-grid.ts`** — thực tế là **3 field** (Vị trí, Loại hình, Quy mô), không phải 2 như liệt kê ban đầu trong audit (Quy mô có cùng lỗi, bằng chứng: Sen Việt trước đó hiện "Quy mô | Chưa có | Đã có dữ liệu"). Đã đổi `status` từ hardcode `"da-co-du-lieu"` sang tính theo giá trị thật (`p.address`, `p.projectType[0]`, kết quả `scaleDescriptor()`). "Trạng thái"/"Cập nhật" giữ hardcode vì field nguồn (`status`, `lastVerifiedAt`) không-nullable theo type — không phải bug.
2. **Sửa hiển thị "Trạng thái"** — dùng `projectStatusLabel()` (helper có sẵn ở `project-status-label.ts`, tự fallback về raw string nếu không map được) thay vì in thẳng `p.status` — hết hiện slug thô `dang-trien-khai`.
3. **Dọn 11 chỗ debug code** (`127.0.0.1:7413`, session id `87c57b`) ở 7 file: `app/api/auth/{bootstrap,session}/route.ts`, `app/api/cms/{assets,projects,upload}/route.ts`, `app/login/login-form.tsx`, `components/cms/project-form.tsx`. Xoá cả biến/helper chỉ tồn tại để phục vụ debug (`agentAdminSnapshot()`, `debugLog()`, `debugMedia()`, biến `uploaded`/`sourceGone`/`branch`(assets)/`bootstrapPayload`) — không chỉ xoá lời gọi fetch mà để sót dead code xung quanh.
4. **Xoá 2 script probe** (`scripts/prod-cms-*-probe.mjs`, ghi thẳng Firestore production) + `.cursor/debug-87c57b.log` liên quan cùng phiên debug đó.

**Verify:** `tsc --noEmit` sạch, `npm run lint` không phát sinh lỗi mới (vẫn 6 lỗi cũ `react-hooks/set-state-in-effect`, không liên quan phạm vi này), `vitest run` 57/57 pass, `npm run build` production thành công. Test MCP trực tiếp trên Aristo (trước: "Vị trí | Đã có dữ liệu" dù rỗng → sau: "Vị trí | Chưa có | Chưa có dữ liệu") và Sen Việt (cả Vị trí/Loại hình/Quy mô đều đổi đúng badge), `/login` render sạch sau khi dọn debug code.

## Round 7 (2026-09-11, cùng ngày) — Migrate i18n tự viết sang next-intl (đảo ngược khuyến nghị ADR-002)

Người dùng chọn **Phương án C** (đổi thư viện chuẩn) thay vì khuyến nghị D→A ban đầu của ADR-002. Kiểm chứng khi triển khai xác nhận lựa chọn này đúng đắn hơn dự tính: next-intl giải quyết ĐÚNG root cause bằng `getTranslations()` (đọc locale qua request/cookie ở tầng server, không cần React Context) — sạch hơn hẳn phương án "thread props thủ công" ban đầu đề xuất.

**Kiến trúc mới:**
- `i18n/request.ts` — `getRequestConfig()` đọc cookie `NEXT_LOCALE` (dùng lại đúng cookie `proxy.ts` đã quản lý từ Round 5/trước — không đổi hành vi ghi cookie), merge sâu `en` lên trên `vi` làm fallback (thiếu key EN → tự động hiện tiếng Việt, giữ đúng hành vi cũ, không throw/hiện key thô)
- `lib/i18n/locale.ts` — tách `LOCALE_COOKIE`/`type Locale` ra file trung lập riêng, vì `i18n/request.ts` import `next/headers` (server-only) — gộp chung sẽ crash khi Client Component (`locale-switcher.tsx`) import
- `next.config.mjs` wrap bằng `createNextIntlPlugin()`
- `app/layout.tsx` dùng `NextIntlClientProvider` (từ `getLocale()`/`getMessages()`) thay `LocaleProvider` tự viết
- **Đã xoá hoàn toàn** `lib/i18n/t.ts` (static, luôn đọc vi.json — đây là nguyên nhân gốc bug) và `lib/i18n/locale-context.tsx` (Context tự viết)
- Cú pháp interpolation đổi `{{var}}` → `{var}` (ICU MessageFormat, 4 key × 2 file)
- `pdf-export-trigger.tsx`: `exportFactSheetPdf()` là hàm async thuần (không phải component) nhưng cần string đã dịch — đổi sang nhận `messages` qua tham số thay vì gọi hook trực tiếp (hook không gọi được ngoài component)

**Quy mô migrate:** 28 file dùng `t()` tĩnh + 12 file dùng `useLocale()` = 40 điểm gọi, tất cả đã chuyển sang `getTranslations()` (Server Component, 15 file) / `useTranslations()` (Client Component, 25 file).

**2 bug tự phát hiện và tự sửa trong lúc migrate (không có trong kế hoạch gốc):**
1. `deepMerge()` ban đầu dùng `{...array}` để merge — làm mất tính mảng của `home.titleWords` (biến thành `{0: ..., 1: ...}`), vỡ `.map()` ở hero.tsx. Sửa: coi mảng là giá trị atomic, không đệ quy vào bên trong.
2. `i18n/request.ts` (import `next/headers`) bị import trực tiếp bởi `locale-switcher.tsx` (Client Component) → Next.js từ chối build ("You're importing next/headers... in the Pages Router" — thực ra do gộp chung server+client code trong 1 module). Sửa: tách hằng số client-safe ra `lib/i18n/locale.ts`.

**Ngoài phạm vi (cố tình không đụng, đã giải thích rõ):** sửa 3 chỗ hardcode `toLocaleString("vi-VN")` (fact-grid.ts×2, compare-fields.ts×1) — vì các nhãn xung quanh ("căn", "phân khu", "m²") cũng đang hardcode tiếng Việt hoàn toàn ngoài hệ i18n; sửa riêng phần số mà không dịch cụm từ sẽ tạo kết quả nửa vời. Đây thuộc Phase 1 (UI chrome) đã defer riêng trong ADR-002, không phải phạm vi "đổi thư viện".

**Test MCP (bằng chứng thành công cốt lõi):** so sánh trực tiếp `/du-an/hong-hac` ở chế độ EN trước/sau — TRƯỚC: toàn bộ trang 100% tiếng Việt trừ header/footer (bug gốc đã ghi nhận từ đầu conversation). SAU: "Masterplan & zoning", "Architecture & partners", "Legal dossier", "Sales progress & conditions", "Related projects", "Data sources for this page", "Last verified", "View full legal dossier" — toàn bộ heading Server Component đã dịch đúng. Chuyển VI↔EN 2 chiều xác nhận hoạt động, mobile 375 không overflow, 0 console error, `tsc --noEmit` sạch, `vitest run` 57/57 pass, `npm run build` production thành công.

**Còn tiếng Việt sau migrate (đúng như dự đoán, KHÔNG phải bug của lần này):** field label trong fact-grid ("Vị trí", "Loại hình"...), `STATUS_LABEL`/`PROJECT_STATUS_LABEL`/`CATEGORY_LABELS` (map hardcode riêng, chưa từng qua hệ i18n), text hardcode trong JSX (`"Xem đầy đủ"`, `"Ảnh thực tế"`, `"Đơn vị thiết kế kiến trúc"`...) — tất cả thuộc Phase 1 UI chrome đã biết từ trước, không phải phạm vi migrate thư viện lần này.

**Mục 5 (điền địa chỉ cho các dự án) — KHÔNG nằm trong yêu cầu lần này, cần nhập liệu qua CMS, ngoài khả năng tự làm.**

## Round 8 (2026-09-11/12, cùng đợt) — Đóng dứt điểm 2 nợ còn lại từ Round 7 (pnpm lockfile + locale-format hardcode)

Sau Round 7, có 2 rủi ro đã nêu rõ nhưng chưa xử lý: (A) `pnpm-lock.yaml` chưa sync với `next-intl` mới thêm → rủi ro Vercel build fail vì CI dùng `--frozen-lockfile`; (B) 4 chỗ hardcode `toLocaleString("vi-VN")` (không phải 3 như Round 7 ghi nhận — xem bên dưới). Người dùng yêu cầu xử lý triệt để cả hai, đảm bảo Vercel build được sau khi push.

**Phần A — Sync pnpm lockfile, verify bằng `--frozen-lockfile` thật (không đoán mò):**
- `npx pnpm@latest install` để regenerate `pnpm-lock.yaml` với `next-intl` + deps liên quan.
- Phát hiện thêm 1 lớp chặn sâu hơn: pnpm 10's `ERR_PNPM_IGNORED_BUILDS` — chặn postinstall script của native deps (`@parcel/watcher`, `@swc/core`, `sharp`, `msw`, `protobufjs`, `unrs-resolver`, `@firebase/util`) trừ khi approve tường minh. Xử lý bằng `npx pnpm@latest approve-builds --all` — lệnh này ghi kết quả vào `pnpm-workspace.yaml` (field `allowBuilds`), **không phải** cache cục bộ hay `package.json` — nghĩa là commit được và Vercel CI sẽ đọc đúng cấu hình đã approve, không bị treo hỏi tương tác.
- **Verify thật** (không suy đoán): `rm -rf node_modules && npx pnpm@latest install --frozen-lockfile` chạy sạch trong 24.6s, 0 prompt — đây là chính xác lệnh Vercel/CI chạy khi build, nên coi là bằng chứng đủ mạnh thay vì chỉ "lockfile trông hợp lệ".
- `corepack enable` không dùng được trên máy này (EPERM ghi vào `C:\Program Files\nodejs\pnpx`, không có quyền admin) — dùng `npx pnpm@latest <cmd>` thay thế xuyên suốt, không cần cài global.

**Phần B — Sửa hardcode locale-number-format triệt để (không nửa vời):**
- Round 7 ghi nhận nhầm "3 chỗ" — grep ban đầu `toLocaleString\("vi-VN"\)` (có ngoặc đóng ngay sau) bỏ sót 1 chỗ ở `compare-fields.ts:108` có tham số thứ 2 (`{ maximumFractionDigits: 2 }`). Grep đúng `toLocaleString\("vi-VN"` (bỏ ngoặc đóng) tìm ra đủ **4 chỗ**: `fact-grid.ts` ×2 (Số căn, Diện tích đất), `compare-fields.ts` ×2 (Số căn, Diện tích đất/ha).
- Phân biệt rõ 2 loại để tránh dịch nửa vời: 2 chỗ "Diện tích đất" (m²/ha) chỉ cần đổi format số (dấu phẩy/chấm) — ký hiệu m²/ha là quốc tế, không cần dịch từ. 2 chỗ "Số căn" cần dịch cả từ đơn vị ("căn" → "units"), không chỉ số.
- Tạo `vendor/library/lib/i18n-format.ts` (helper `formatNumber()`/`unitsWord()`) — đặt **bên trong** `vendor/library`, không phải ở `lib/i18n/` cấp app, vì đã grep toàn bộ `vendor/library` xác nhận thư mục này **chưa từng** import ngược từ `/lib` cấp app (ranh giới vendoring tự phát hiện, tự sửa trước khi commit — ban đầu định đặt ở `lib/i18n/format.ts` rồi import ngược 4 cấp, đã revert).
- Threading locale: `buildFactGrid(p, locale)`/`CompareField.cell(p, locale)` nhận thêm tham số `NumberLocale` ("vi" | "en", mặc định "vi" cho caller không-UI như `lib/view-snapshot.ts` — cố tình giữ nguyên, không đổi).
- 2 call site UI thực tế: `components/project/detail/fact-grid.tsx` (Server Component, `await getLocale()` từ `next-intl/server`) và `components/project/compare-table.tsx` (Client Component, `useLocale()` từ `next-intl`, thread vào `useMemo` deps).

**Test đã chạy (MCP thật + unit test, không đoán mò):**
- MCP `/du-an/hong-hac`: VI hiện `"1.977.615,71 m²"`, chuyển EN hiện `"1,977,615.71 m²"` — đúng định dạng theo locale.
- MCP `/so-sanh` (chọn Hồng Hạc): field "Diện tích đất" VI `"197,76 ha"` ↔ EN `"197.76 ha"` — đúng.
- **Giới hạn nêu rõ:** không có dự án nào trong catalog hiện có `totalUnits` (cùng dạng lỗ hổng dữ liệu với `address` ở Round 4) nên nhánh "Số căn"/`unitsWord()` ("căn"→"units") **không quan sát được qua MCP với dữ liệu thật**. Đã bù bằng test tự động thật (`lib/i18n-number-format.test.ts`, project giả `totalUnits=1234`) verify đúng: VI `"1.234 căn"`, EN `"1,234 units"` — chạy pass thật (`vitest run`), không phải suy luận từ đọc code.
- `tsc --noEmit` sạch, `npm run lint` không phát sinh lỗi mới (vẫn 6 lỗi cũ `react-hooks/set-state-in-effect`), `vitest run` 59/59 pass (57 cũ + 2 mới), `npm run build` production thành công, route list không đổi.

**Chưa commit/push** — chờ yêu cầu tường minh của người dùng theo đúng quy tắc ở trên.

## Round 9 (2026-09-12) — Launch Completeness Program (chrome i18n + honesty + passcode locale)

Đóng nợ Phase 0 + Phase 1 UI chrome sau audit 66/100. Không bịa `address` / `totalUnits`. Không thêm KV/rate-limit IP (TRACK_P=residual).

**Đã làm:**
- Một hệ `projectStatus` (đủ 6 slug) + một hệ `fieldStatus` qua next-intl; `library-bridge` / `seed-adapter` thôi pre-localize status sang tiếng Việt.
- Nhãn fact-grid / compare / legal group / project type / empty state theo locale (`vendor/library/lib/i18n-copy.ts`, test lockstep với JSON).
- ADR-002 Phase 0: CMS nhập `*En`; hero / story / card / metadata / CMDK / compare / legal tabs đọc `displayNameEn` + mô tả, fallback VI.
- `/passcode` có LocaleSwitcher + copy i18n; API thêm `Retry-After` khi khóa.
- `generateMetadata()` theo locale cho Home, catalog, compare, legal, passcode, 404, layout; `<html lang>` đã đúng từ Round 7.
- Foil `dark:ring-border-accent` mở sang gallery / masterplan / location.
- Tests: 68 vitest; `e2e/locale-switch.spec.ts` + `commercial-50` chuyển sang cookie `NEXT_LOCALE`; `verify-i18n-keys` hiểu namespace next-intl.

**Trần còn lại (không tự chấm 100):**
- Data completeness: `address` 0/12, `totalUnits` 0/12, chưa có bản EN nội dung — cần content pack / CMS.
- Security: không chống brute-force cấp IP (không có Upstash/KV).
- CMS/login/lab cố ý giữ tiếng Việt. ALL-CAPS taxonomy nav giữ (wayfinding).

## Round 10 (2026-09-12) — Ẩn section Home “Tra cứu nhanh”

Home không còn render `<Updates />` (`app/page.tsx`). Component, CMS site-form, `buildUpdates`, i18n keys giữ nguyên — chỉ ẩn surface công khai. Featured / map / explorer / footer không đụng.

## Round 11 (2026-09-12) — Fix map Home: pin theo tọa độ CMS thật, không còn city-cluster fallback sai

**Bối cảnh:** Người dùng báo “The Harmonie” hiện ngoài lãnh thổ VN trên bản đồ Home; bấm pin/thẻ vùng không dẫn tới được dự án. Thực thi qua prompt orchestration 4-agent (`prompts/26-09-12-10-35-cms-lat-lng-project-pins.md`: A1 Evidence Scout → A2 Implementation Engineer → A3 Browser QA → A4 Adversarial Reviewer, mỗi bước gate độc lập) — rút kinh nghiệm từ 1 lần thử trước đó chỉ mở rộng bảng tra cứu tên-thành-phố mà bỏ qua field tọa độ đã có sẵn trong CMS.

**Nguyên nhân gốc (A1 xác nhận bằng dữ liệu Firestore thật, không suy đoán):**
1. Home chưa từng đọc field `project.coordinates.{lat,lng}` — field này ĐÃ có sẵn trong CMS (`project-form.tsx` “Lat”/”Lng”, persist qua `saveCmsProject` → Firestore, round-trip lossless đã có test). Home tự tính vị trí theo `REGION_LNG_LAT` (bảng tra cứu tên thành phố, chỉ 2 key khớp chính xác: `”TP.HCM”`, `”Bắc Ninh”`) — dữ liệu thật là `”Tp. HCM”`, `”Tp. HCM (Bình Dương cũ)”`, `”Đồng Nai”` đều lệch case/hậu tố → rơi vào fallback cứng `{lng:106.0, lat:16.0}` (ngoài khơi, không phải vị trí thật của bất kỳ dự án nào) — ảnh hưởng **3/4 cụm vùng, không riêng Harmonie**.
2. Tồn tại 2 hàm `citySlug()` độc lập, không đồng bộ (`lib/home-content.ts` vs `vendor/library/lib/data/region-slug.ts`) — khớp nhau đúng 1 trường hợp duy nhất (“Bắc Ninh”), khiến bấm pin/thẻ vùng ở Home tạo query `khu-vuc=...` mà bộ lọc `/du-an` tính slug khác đi → **11/12 dự án bấm vào ra 0 kết quả**.

**Đã sửa (A2, xác nhận qua diff bởi A4):**
- 1 hàm `citySlug()` duy nhất, chuẩn hoá dấu + ký tự đặc biệt, đặt trong `vendor/library/lib/data/region-slug.ts` (đúng ranh giới vendoring — không import ngược `/lib` app); `lib/home-content.ts` re-export, không giữ bản riêng.
- `buildProjectPins()` — pin theo TỪNG dự án có `coordinates.lat`+`lng` hữu hạn, không fallback đoán mò; dự án chưa có tọa độ thì không có pin (không bịa số).
- Bấm pin → thẳng `/du-an/{slug}`. Bấm thẻ vùng: nhóm chỉ 1 dự án → thẳng trang chi tiết; nhóm ≥2 → `/du-an?khu-vuc=<slug thống nhất>` (đã verify ra kết quả thật, không rỗng).
- `project-explorer.tsx` dùng chung `citySlug`/`cityOrRegion`; dropdown lọc vùng build từ dữ liệu catalog thật thay vì list cứng thiếu “Đồng Nai”/”Bình Dương”.
- CMS: đổi nhãn “Lat”/”Lng” → “Vĩ độ (Latitude)”/”Kinh độ (Longitude)” (ngoại lệ duy nhất cho phép trong phạm vi CMS-giữ-tiếng-Việt).
- Test mới: `lib/home-content.test.ts`, 1 case round-trip tọa độ thật trong `firestore-codec.test.ts`, 2 case `e2e/map.spec.ts` (solo-region → thẳng dự án; multi-region → catalog không rỗng).

**Verify (A3 + A4 độc lập, MCP thật, không đoán mò):** 12/12 marker hiện đúng tọa độ (khớp tuyệt đối với giá trị CMS/Firestore, delta 0, đọc qua React fiber props — không suy luận từ vị trí màn hình); không còn pin nào rơi vào điểm fallback cũ; bấm cả 3 dự án mẫu + cả 4 thẻ vùng (gồm đúng thẻ “Tp. HCM (Bình Dương cũ)” — trường hợp Harmonie bị báo lỗi ban đầu) đều dẫn đúng nơi; vùng “Tp. HCM” (9 dự án) lọc ra đúng 9 kết quả thay vì rỗng; mobile 375 không overflow; `tsc --noEmit` sạch; `vitest run` 80/80; lint không phát sinh lỗi mới (vẫn đúng baseline 6 lỗi cũ).

**Phát hiện phụ (không phải lỗi của round này):** dữ liệu phục vụ live tại thời điểm test đến từ `data/runtime/catalog.json` (mirror cục bộ sau mỗi lần lưu CMS thành công), không phải bản Firestore A1 đọc trực tiếp — 4 dự án A1 thấy tọa độ null hoá ra đã được nhập thật qua CMS ngay trong lúc agent đang chạy (A4 truy vết timestamp `updatedBy`/`updatedAt` xác nhận đây là người dùng thật đang nhập liệu song song, không phải dữ liệu bịa).

**Còn nợ (ngoài phạm vi round này):** dự án chưa từng có tọa độ vẫn không có pin cho tới khi nhập qua CMS (đúng thiết kế, không phải bug); marker 9 dự án cụm “Tp. HCM” chồng lên nhau ở zoom toàn quốc (hạn chế UX ở mức zoom, không phải lỗi routing — mỗi marker vẫn dẫn đúng dự án khi bấm được).

Không commit/push — chờ yêu cầu tường minh.

## Round 12 (2026-09-12) — Home Hero Premium (copy + design + i18n VI/EN)

Nâng cấp **chỉ Home Hero** (`variant` mặc định, không đụng `variant=”detail”`) theo `.claude/skills/frontend-design/SKILL.md` — sửa 5 AI-tell/bug đã chẩn đoán đúng bằng cách đọc code trước khi viết prompt (không đoán mò):

1. `home.titleWords` (mảng từ rời, `flex flex-wrap` mỗi từ 1 `motion.span`) → 1 chuỗi `home.headline` duy nhất, không còn nguy cơ vỡ dòng giữa từ (“Dự”/”án” tách nhau).
2. Kicker `uppercase tracking-wide` + middle-dot (“DED · Phú Mỹ Hưng”) → **cắt bỏ hoàn toàn** — trùng lặp thông tin đã có trong H1, đúng loại “nhãn không cần thiết phía trên nội dung” mà skill cảnh báo.
3. Lede dùng thẳng prop `brandStatementVi` (cứng tiếng Việt, EN Home hiện sai ngôn ngữ) → đọc qua `t(“home.lede”)`, đúng locale 2 chiều. Prop `brandStatementVi` bỏ khỏi `HomeHeroProps`/lời gọi `<Hero>` (vẫn giữ nguyên cho JSON-LD description ở `app/page.tsx` — không đụng).
4. 4 cascade Framer rời rạc (kicker/từng từ H1/lede/CTA) → 1 `motion.div` bọc cả khối copy, dùng preset `revealUp` có sẵn — đúng “một khoảnh khắc”, Ken Burns nền giữ nguyên (không xung đột vì khác lớp: ambient nền vs. một entrance duy nhất cho nội dung).
5. Ảnh hero khi không có `heroAsset` trước đây chỉ là `bg-muted` trống — thêm `BlueprintFallback` (component dùng chung đã có ở detail hero/location.tsx) cho nhất quán.

**Copy mới (VI ‖ EN, cả hai đọc qua `home.headline`/`home.lede`/`home.ctaExplore`):**
- Headline: “Trung tâm dữ liệu dự án DED-PMH” ‖ “DED-PMH project data hub”
- Lede: “Tra cứu pháp lý, tiến độ và quy mô dự án — dữ liệu đã xác minh, một nguồn duy nhất.” ‖ “Look up legal status, progress, and scale for every project — verified, from one source.”
- CTA: “Xem danh mục dự án” ‖ “View project catalog” (đổi từ “Khám phá dự án”/”Explore projects” — echo đúng heading trang đích `/du-an` thay vì động từ mang tính bán hàng)

Cập nhật theo: `e2e/home.spec.ts`, `e2e/locale-switch.spec.ts` (6 chỗ assert CTA text cũ), comment `i18n/request.ts` (hết ví dụ `home.titleWords` vì key đã xoá).

**Test:** `verify-i18n-keys.mjs` sạch (214 key dùng, khớp cả 2 file 277 key), `tsc --noEmit` sạch, `vitest run` 80/80. MCP thật 6 trạng thái (không Pass bằng đọc code): VI-light-1440, EN-light-1440, VI-dark-1440, VI-light-375, EN-light-375 — H1/lede/CTA đúng locale, không overflow, 0 console error; CTA bấm ra đúng `/du-an`; spot-check `/du-an/hong-hac` xác nhận hero `variant=”detail”` không đổi visual.

**Không tự chấm 100/100:** đây là fix trong khuôn khổ hệ thống thiết kế hiện có (không đổi font/palette/layout tổng thể theo đúng phạm vi được giao) — đã hết AI-tell cụ thể đã chẩn đoán, chưa phải “nhận diện thị giác độc nhất” ở mức tham vọng nhất của skill.

Không commit/push — chờ yêu cầu tường minh.

## Round 13 (2026-09-12) — Fix hover-zoom ảnh “chớp/nháy” (mất transition do tailwind-merge)

Người dùng báo hiệu ứng zoom-khi-rê-chuột trên ảnh project card bị “chớp nháy” thay vì mượt, so với 1 dự án khác dùng đúng công thức `overflow-hidden` + `transition-transform duration-700 ease-out group-hover:scale-105`. Code của ta trông giống hệt công thức đó — nhưng verify bằng computed style thật (không đoán) phát hiện `transition-transform` bị **âm thầm biến mất**.

**Nguyên nhân gốc:** `components/shared/image-with-fallback.tsx` (component dùng chung, bọc mọi `<Image>` để có fade-in-on-load) ghép class bằng `cn(className, “transition-opacity duration-300”, ...)` — class cố định của component đứng SAU class do caller truyền vào. `tailwind-merge` coi `transition-opacity`/`transition-transform` là cùng 1 nhóm xung đột (`transition-property`) và chỉ giữ class đứng sau — nghĩa là `transition-opacity duration-300` của component LUÔN thắng, xoá mất `transition-transform` mà `project-card.tsx` truyền vào. Kết quả: scale áp dụng tức thời, không transition — đúng cảm giác “chớp nháy”.

**Phát hiện phụ trong lúc verify:** Tailwind v4 dùng CSS property `scale` riêng (không phải `transform`) cho utility `scale-*`/`group-hover:scale-*` (CSS Transforms Level 2) — xác nhận qua `getComputedStyle().scale` khác `getComputedStyle().transform`. Lần sửa đầu chỉ khai `transition-[opacity,transform]` vẫn thiếu — phải là `transition-[opacity,scale]`.

**Đã sửa (1 chỗ gốc, không patch từng nơi gọi):**
- `image-with-fallback.tsx`: đổi thứ tự `cn()` — default của component đứng TRƯỚC, `className` của caller đứng SAU — để caller ghi đè đúng ý thay vì luôn thua; đổi property list thành `transition-[opacity,scale]` cho khớp Tailwind v4 thật.
- `project-card.tsx` (2 chỗ, catalog + featured layout): bỏ `transition-transform` (không cần nữa, base đã khai), đổi `duration-300/400` → `duration-700 ease-out` theo đúng “chậm, nhẹ nhàng” người dùng yêu cầu.

**Tác dụng phụ tốt tự phát hiện:** cùng lỗi merge-order này khiến `gallery.tsx`'s hover-dim (`transition-opacity duration-200 group-hover:opacity-95`) trước đó cũng bị ép về `duration-300` của component thay vì `duration-200` caller khai — nay tự động đúng lại sau khi sửa thứ tự merge, không cần sửa riêng.

**Verify (MCP thật, không Pass bằng đọc code):** `getComputedStyle(img).transitionProperty` = `”opacity, scale”`, `transitionDuration` = `”0.7s”`, `transitionTimingFunction` = `ease-out` — xác nhận trên toàn bộ 12/12 card catalog + card featured trên Home. Gallery thumbnail xác nhận đúng lại `duration-200`. `tsc --noEmit` sạch, `vitest run` 80/80, lint đúng baseline 6 lỗi cũ, 0 console error mới.

Không commit/push — chờ yêu cầu tường minh.

