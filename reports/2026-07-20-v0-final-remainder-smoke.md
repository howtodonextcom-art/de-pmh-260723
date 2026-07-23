# v0 Track A final remainder — MCP smoke (~95% → ~99%)

Date: 2026-07-20
Scope: `v0/prompts/2026-07-20-02-55-claude-v0-final-remainder-99-mcp.md` — close the last ~5% of Track A: full `vi.json` coverage, ESLint zero-warnings, LCP polish, PDF UX honesty, e2e hardening. `v0/` write scope only.

## R1 — i18n expansion

`v0/lib/i18n/vi.json` grew from 4 namespaces (brand/nav/home/footer/common) to 12, adding `duAn`, `detail`, `compare`, `legal`, `cmdk`, `lab`, `pdf`, `sources`. `t()` wired into every call site that previously hard-coded the same Vietnamese string:

- **`/du-an` list**: page title, live count, search placeholder, all 4 filter dropdown default labels, grid/table view toggle aria-labels, empty-state + "Xóa bộ lọc" (×2), match-count suffix.
- **Detail chrome (D1–D13)**: 8 section titles (Kiến trúc & đối tác, Tiến độ & điều kiện bán, Dự án liên quan, Masterplan & phân khu, Hồ sơ pháp lý teaser, Vị trí & kết nối, Tiện ích ×2, Dòng sản phẩm ×2), gallery lightbox aria-labels (Đóng/Ảnh trước/Ảnh tiếp theo/Xem ảnh lớn/Thư viện ảnh dự án), sources accordion (heading, "áp dụng"/"tra cứu"/"Cập nhật lần cuối", 3 CTA labels).
- **`/so-sanh`**: h1 + subtitle.
- **`/phap-ly`**: h1 + per-project "N nhóm hồ sơ · Cập nhật {date}".
- **`legal-dossier-table.tsx`** (shared by `/phap-ly` and `/lab`): table column headers, "Lưu ý" badge, "Chưa có dữ liệu" (×2), copy-button toasts (Đã sao chép/Không thể sao chép/aria-label).
- **CMDK** (`cmdk.tsx`): dialog title/description, all 3 group headings (Dự án/Trang/Hành động), static page labels, 3 theme items, "Xuất PDF" item label, "Hồ sơ pháp lý" item.
- **`/lab`** (`demo-shell.tsx`): "Chọn dự án", legal heading, Bảng/Timeline tabs, gallery heading, empty-gallery message.
- **PDF toast** (`pdf-export-trigger.tsx`): the print-fallback toast copy.

Remaining hard-coded Vietnamese is exclusively project **data/content** (schema-sourced strings like `project.displayNameVi`, `highlights[]`, `legalDossier` values, milestone/update copy in `v0/lib/home-content.ts`) — explicitly allowed by AC2 ("remaining hard-coded VI only in data/content seeds OK").

## R2 — Lint zero

Fixed the baseline's only warning: removed the unused `idx` parameter from `LEGAL_DOSSIER_TABLE_KEYS.map((key, idx) => ...)` in `legal-dossier-table.tsx` (it was never referenced in the loop body). Also renamed a shadowing local `t` (TYPE_OPTIONS.find callback) in `project-explorer.tsx` to `opt` once the real `t()` i18n import was added to that file, to avoid a confusing scope collision.

**`pnpm --dir v0 lint` → 0 errors, 0 warnings.**

## R3 — LCP polish (real fix, not just an audit)

MCP cold-load of `/du-an` surfaced a genuine Next.js LCP advisory not visible on `/` or the detail pages (both already had `priority` on their hero images from the prior home-rebuild prompt):

```
[WARNING] Image with src ".../cong-chao.webp" was detected as the Largest
Contentful Paint (LCP). Please add the `loading="eager"` property if this
image is above the fold.
```

Root cause: `/du-an`'s `ProjectExplorer` grid renders 4 `ProjectCard`s above the fold, none marked `priority`. Fixed by adding an optional `priority` prop to `ProjectCard` (`v0/components/project/project-card.tsx`) and passing `priority={i === 0}` from the grid map in `project-explorer.tsx` — only the first (LCP-candidate) card gets it, so this doesn't create competing high-priority image requests. Re-verified via MCP: **0 warnings** on `/du-an` cold load after the fix.

## R4 — PDF UX honesty audit

Audited every "Xuất PDF" surface (detail Sources CTA, CMDK export item, `?export=pdf` auto-trigger, the print-fallback toast). All three entry points call the same `exportFactSheetPdf()` (`pdf-export-trigger.tsx`), which is explicit in its own comment and toast copy that this is a **print-CSS fallback**, not a Cloud Function download — no wording anywhere implies a file is being generated/downloaded from a backend. No changes needed beyond i18n-izing the copy (R1); the honesty bar from the prior prompt was already met and remains met.

## Bonus fix found during MCP verification (not in the original remainder list)

MCP cold-load of `/du-an` also surfaced a real hydration-mismatch **console error** (not present on any other route):

```
[ERROR] A tree hydrated but some attributes of the server rendered HTML
didn't match the client properties... style={{caret-color:"transparent"}}
```

Root cause: Base UI's `Input` primitive (`@base-ui/react/input`) sets `caretColor` client-side only (touch-device caret handling) — this can never match SSR output, and is cosmetic-only, not a content/logic bug. Fixed by adding `suppressHydrationWarning` to the one `Input` usage that has this (the `/du-an` search box in `project-explorer.tsx`), with a comment explaining why. Re-verified via MCP: **0 errors** on `/du-an` after the fix. This was a real, previously-undetected defect (present before this prompt, not introduced by it) — caught only because this prompt's MCP matrix visited `/du-an` fresh, which the prior two prompts' matrices hadn't done.

## R5 — E2E harden

New `v0/e2e/i18n-pdf.spec.ts` (5 specs), on top of the existing `home.spec.ts` (8) + `regression.spec.ts` (5):

1. `/du-an` toolbar + heading render real translated text (and assert zero `duAn.`/`home.`/`cmdk.` raw-key leakage anywhere on the page).
2. Detail section titles + CMDK group headings are translated.
3. Detail "Xuất PDF" button triggers `window.print()`.
4. `?export=pdf` query param auto-triggers `window.print()` on load.
5. CMDK "Xuất PDF — {project}" item navigates to `?export=pdf` and triggers print.

**`pnpm --dir v0 test:e2e` → 18/18 passed** (chromium, 8 workers, ~15-17s).

## R6 — MCP final matrix

All via `http://localhost:3000` unless noted; console checked at every hop.

| Route | Console errors | Console warnings | Notes |
|---|---|---|---|
| `/` | 0 | 0 | |
| `/du-an` | 0 (was 1) | 0 (was 1) | Both fixed this session — LCP + hydration |
| `/du-an/hong-hac-city` | 0 | 0 | |
| `/so-sanh` | 0 | 0 | |
| `/phap-ly` | 0 | 0 | |
| `/lab` | 0 | 0 | |
| `127.0.0.1:3000/` | 0 | — | Nav dropdown hydrates (menu count 1) — `allowedDevOrigins` regression guard still intact |

Additional live checks: Sources "Xuất PDF" button → `window.print()` called (verified via spy); CMDK dialog opens with translated group headings (`reports/assets/v0-p2-cmdk-i18n-1440.png`); `/du-an` toolbar fully translated with no LCP warning (`reports/assets/v0-p2-du-an-i18n-1440.png`).

## Commands run

```
pnpm lint                                          # 0 errors, 0 warnings
npx tsc --noEmit -p tsconfig.json                  # 0 errors
pnpm build                                          # green — 11 routes
pnpm dev -p 3000                                    # MCP verification
npx playwright test -c e2e/playwright.config.ts    # 18/18 passed
```

## Files changed

**R1 (i18n)**: `v0/lib/i18n/vi.json`; `v0/components/project/detail/{architecture-partners,sales-status,related,masterplan,legal-teaser,location,amenities,product-line,gallery,sources}.tsx`; `v0/components/project/{project-explorer,legal-dossier-table}.tsx`; `v0/components/shared/cmdk.tsx`; `v0/components/demo-shell.tsx`; `v0/components/project/detail/pdf-export-trigger.tsx`; `v0/app/{du-an,so-sanh,phap-ly}/page.tsx`

**R2 (lint)**: `v0/components/project/legal-dossier-table.tsx` (unused `idx`); `v0/components/project/project-explorer.tsx` (shadowed `t`)

**R3 (LCP)**: `v0/components/project/project-card.tsx` (new `priority` prop); `v0/components/project/project-explorer.tsx` (pass `priority={i === 0}`)

**Bonus fix**: `v0/components/project/project-explorer.tsx` (`suppressHydrationWarning` on the search `Input`)

**R5 (e2e)**: `v0/e2e/i18n-pdf.spec.ts` (new, 5 specs)

No `src/` files were touched; no new `@library` exports were added.

## DEFERRED_1PCT (explicitly out of scope, per prompt §11)

- **F8 `/en`** — no language switcher or English route exists in v0; only a single-locale (`vi`) `t()` scaffold, as specified.
- **Real `exportFactSheetPdf` Cloud Function** — v0 remains an honest print-CSS fallback; the real Function lives in Local (`functions/src/export-fact-sheet-pdf.ts`), out of v0's scope by design.

## VERDICT

```
VERDICT: V0_TRACK_A_99_MET
V0_TRACK_A_PCT_BEFORE: ~95
V0_TRACK_A_PCT_AFTER:  ~99
AC1: PASS   AC2: PASS   AC3: PASS   AC4: PASS   AC5: PASS
AC6: PASS   AC7: PASS   AC8: PASS   AC9: PASS   AC10: PASS
MCP_EVIDENCE_INDEX:
  - v0/reports/assets/v0-p2-du-an-i18n-1440.png
  - v0/reports/assets/v0-p2-cmdk-i18n-1440.png
  - v0/reports/assets/v0-p1-home-full-1440.png (regression re-check, prior prompt)
  - v0/reports/assets/v0-p1-lab-1440.png (regression re-check, prior prompt)
E2E: pnpm --dir v0 test:e2e   (18/18 passed)
DEFERRED_1PCT: F8 /en · Cloud Function PDF (Local/functions, out of v0)
```

`v0 Track A final remainder MET — ≈99%, MCP verified.`
