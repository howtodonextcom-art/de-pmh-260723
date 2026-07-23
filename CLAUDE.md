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
- `pnpm luxury:qa:auto` — pipeline chấm điểm UI/UX (`capture → pixelmatch diff → score`), gate ở `LuxuryIndex ≥ 85` (`scripts/luxury/score.mjs`, biến `LUXURY_MIN_INDEX`).
- Không commit/push nếu người dùng chưa yêu cầu tường minh trong phiên làm việc đó.
