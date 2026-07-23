# MCP — test & soi lỗi trình duyệt (v0)

Cấu hình: `.cursor/mcp.json` trong workspace `v0`.

## Servers

| Server | Mục đích |
|--------|----------|
| **playwright** | Mở Chromium, navigate, click, snapshot a11y, screenshot, đọc console/network (`@playwright/mcp`) |
| **vercel** | Log runtime / lỗi production trên deployment (OAuth) |

## Bật trong Cursor (bắt buộc sau khi thêm file)

1. `Ctrl+Shift+P` → **Reload Window** (hoặc tắt/bật server trong Settings).
2. **Settings → Tools & MCP** — `playwright` phải xanh / Running.
3. Nếu đỏ: xem log MCP; thường thiếu Chromium → chạy:
   ```bash
   pnpm exec playwright install chromium
   ```
4. **vercel**: bấm Needs login → đăng nhập tài khoản deploy `de-division-pmh`.

## Dùng khi audit / soi lỗi

Nhờ agent (ví dụ):

- Mở `http://localhost:3000`, snapshot trang chủ, liệt kê console warning/error.
- Soi `/phap-ly` mobile (đổi viewport / `--device`).
- Screenshot vào `reports/mcp-browser/`.

Dev server: `pnpm dev` (webpack). Production spot-check: `https://de-division-pmh.vercel.app`.

## Ghi chú

- Parent repo `260719-DE/.cursor/mcp.json` cũng có `playwright`, nhưng **workspace hiện tại là `v0/`** nên file này mới được Cursor load ưu tiên.
- Không commit token. GitHub PAT (nếu cần) nằm ở `../.cursor/mcp.env` theo `mcp.env.example` của monorepo.
- Headed browser mặc định (không `--headless`) để xem cửa sổ khi debug; thêm `"--headless"` vào `args` nếu muốn chạy nền.
