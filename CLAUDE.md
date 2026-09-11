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
