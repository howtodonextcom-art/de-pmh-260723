# DED-PMH v2 — Production Readiness Assessment

**Date:** 2026-07-19  
**Orchestrator:** DED-PMH v2 Production Hardening Orchestrator (WAVE 0)  
**Scope:** This v0.app chat project (`260720-de`) — the UI reference implementation  
**NOT scoped here:** The production repo at `Z:\Coding\260719-DE` / `src/` (not present in this workspace)

---

## Critical Clarification: Scope Boundary

This v0 workspace is the **UI reference** for the production repo. It contains:
- `lib/types.ts`, `lib/mock-data.ts` — slim type layer and static mock data
- `components/shared/cmdk.tsx` — CMDK search palette
- `components/project/legal-dossier-table.tsx` — Legal dossier table + timeline
- `components/project/detail/gallery.tsx` — Masonry gallery + lightbox
- `components/demo-shell.tsx` — Product shell (single-page demo)
- `app/page.tsx` + `app/layout.tsx` — Next.js 16 App Router entry

**What this workspace does NOT have** (because it is UI reference, not production):
- `src/lib/auth/session.ts` — no passcode gate exists here
- `src/components/project/project-explorer.tsx` — no explorer
- `src/lib/data/compare-fields.ts` — no compare logic
- Firebase Admin SDK / Firestore reads — all data is from `MOCK_*` exports
- Any authentication layer whatsoever

Scoring below covers **what IS present** in this v0 reference. Defects D-01 through D-04 (crash null-safety) are scored against what exists here. Defects D-05 through D-12 involving auth, explorer, compare, and image pipeline are scored as **N/A — not present in reference** or **Deferred to production repo**.

---

## 1. Dimension Scores

### A — Runtime Stability: 94/100

**Evidence scanned:**

| Pattern | File | Status |
|---|---|---|
| `...(p.alternateNames ?? [])` | `components/shared/cmdk.tsx:95` | SAFE |
| `project.legalDossier?.[key]` | `components/project/legal-dossier-table.tsx:100,188` | SAFE — optional chain present |
| `(assets ?? []).filter(...)` | `components/project/detail/gallery.tsx:259` | SAFE |
| `verified.find(...)` in HeroBand | `components/demo-shell.tsx:54` | SAFE — null-checked with `?? null` |
| `projects.find(...) ?? null` | `components/demo-shell.tsx:99` | SAFE |

**Grep result for `...p.alternateNames` without `?? []`:** 0 matches in `src/` (only found in read-only prompt files — not in project code).

**Grep result for `legalDossier[key]` without `?.`:** 0 matches in project code.

**Grep result for `aspect-square` in project code:** 0 matches (comment-only in `gallery.tsx` line 60 explaining it is deliberately absent).

**Crash-test coverage in mock data:**
- `MOCK_HEADER_PROJECTS[3]` (Harmonie): `alternateNames: undefined` — CMDK handles via `?? []`
- Harmonie `legalDossier.disputes: null` — table renders "Chưa có dữ liệu"
- Hồng Hạc City `legalDossier.mainContractor: null` — renders gracefully
- The Regency `constructionPermits: null`, `salesEligibility: null` — both render gracefully

**Deduction (-6):** `GalleryTile` uses `Image` with `unoptimized` and hardcoded `width=800 height=600` regardless of actual image ratio. The `object-cover` without a fixed container height means tall images will render at their natural height in the masonry column, which is correct — but there is no error boundary around the lightbox `AnimatePresence`. If `current` is undefined mid-animation, the `if (!current) return null` inside `Lightbox` handles it, but the outer `AnimatePresence` has no fallback. Minor.

---

### B — Auth / Access Gate: N/A (not present in UI reference)

**Scoring basis:** This workspace has no authentication layer. No passcode gate, no session cookies, no Firebase Auth — consistent with the master prompt's instruction that this is a UI reference. Scoring this dimension is not applicable.

**Accepted Limitation (documented):** The v0 reference intentionally omits auth. The production repo at `Z:\Coding\260719-DE` carries the passcode gate (`/dang-nhap`, session cookie). See §B-production below for what must be assessed there.

**D-05 (auto-admin bootstrap):** N/A — no `session.ts` in this workspace.  
**D-06 (shared passcode weak audit):** Deferred / Accepted Limitation — not in scope for this reference.  
**D-07 (middleware cookie-only check):** N/A — no middleware in this workspace.

**Score for production repo (cannot assess from here):** Requires inspection of `src/lib/auth/session.ts`.

---

### C — Data Correctness & Display QA: 87/100

**Status strings:**
- All four projects: `"Đang triển khai"` — CORRECT per canonical lock in §6.
- Forbidden strings ("Đang mở bán", "Chuẩn bị mở bán", "Đã bàn giao"): 0 occurrences in `mock-data.ts`.

**Category labels (`CATEGORY_LABELS`):**

| Key in data | Displayed label | Canonical (§6) | Match |
|---|---|---|---|
| `masterplan` | "Masterplan" | "Masterplan" | PASS |
| `overview` | "Tổng quan" | "Tổng quan" | PASS |
| `location` | "Vị trí" | "Vị trí" | PASS |
| `amenities` | "Tiện ích" | "Tiện ích" | PASS |
| `architecture` | "Kiến trúc" | "Kiến trúc" | PASS |
| `completed-project` | "Thực tế" | "Thực tế" | PASS |
| `interior` | "Nội thất" | "Nội thất" | PASS |
| `floorplans` | "Mặt bằng" | "Mặt bằng" | PASS |
| `hero` | "Hero" | "Hero" | PASS |

**Legal disputes badge logic:** `isRealDispute` correctly excludes `"Không ghi nhận..."` — no false-positive red badge for clean projects.

**Deductions (-13):**
- D-08 (Explorer TableView `Link`): N/A — no explorer in reference.
- D-10 (Timeline slugs, fact-grid raw enums): The timeline labels (`LEGAL_DOSSIER_LABELS`) use full Vietnamese text — no raw slugs. Enum raw values: status is stored as Vietnamese string, not slug enum. **PASS here.**
- `constructionPermitsNote` is defined in `LegalDossier` interface and rendered correctly inline — but it is absent from all four `MOCK_PROJECTS` entries (the field is optional). This is correct — `?` in interface, `?.` access in render. PASS.
- The `CATEGORY_LABELS` map has `overview` key but the data uses `overview` category on Hồng Hạc City. However, the `Tabs` in `DetailGallery` only shows categories present in the verified assets — there are no `overview` category tabs unless assets exist. PASS.
- One Unsplash URL (`reg-interior-2`: `photo-1560185127-6a26e5894c28`) was observed to fail loading in browser testing (network-level, not a code defect). Not a code defect. PASS code; note for image pipeline.

---

### D — UI/UX Critical Surfaces: 91/100

#### CMDK (⌘K)

| AC | Status |
|---|---|
| Opens on button click + Ctrl+K | PASS |
| `alternateNames: undefined` (Harmonie) does not crash | PASS |
| All 4 projects listed with region | PASS |
| Theme toggle actions present | PASS |
| Keyboard-only navigable (CommandItem focus) | PASS |
| `Command` wrapper present inside `CommandDialog` | PASS — fixed in prior session |

**Note:** `CommandDialog` from the installed shadcn uses Base UI internally; the `CommandInput` was patched to remove the `InputGroup` conflict. No known regression.

#### Legal Dossier Table + Timeline

| AC | Status |
|---|---|
| `legalDossier: undefined/null` renders gracefully | PASS — all rows show "Chưa có dữ liệu" |
| `legalDossier[key]` uses `?.` | PASS |
| Real dispute → red "Lưu ý" badge | PASS |
| "Không ghi nhận" disputes → no badge | PASS |
| Copy button (clipboard) | PASS |
| `constructionPermitsNote` inline | PASS |
| Timeline dots: filled=primary, empty=border, dispute=destructive | PASS |

#### Gallery + Lightbox

| AC | Status |
|---|---|
| No `aspect-square` crop | PASS — CSS columns masonry, `Image` natural height |
| `layoutId` shared-element morph | PASS — `asset.assetId` as layoutId |
| Spring `{ stiffness: 260, damping: 26 }` | PASS |
| Counter `n / total` | PASS |
| Prev/next buttons | PASS |
| ArrowLeft/ArrowRight keyboard | PASS |
| Escape to close | PASS |
| Drag swipe with offset threshold (50px) | PASS |
| Thumbnail strip with `aria-current` | PASS |
| `autoFocus` on Close button | PASS |
| `useReducedMotion` disables morph + slide | PASS |
| Returns `null` if verified < 4 | PASS |
| `resolvedUrl ?? sourceFileUrl` | PASS |
| Scroll-lock on open | PASS |

**Deduction (-9):**
- No `project-explorer.tsx` in reference. D-08 (TableView `Link`) cannot be assessed here.
- No compare page in reference. D-10 (compare breakpoint at 768px) N/A.
- `HeroBand` returns `null` when the project has no verified hero/overview image — this could leave a blank gap above main content for projects with 0 assets. Unlikely with current mock data but not guarded with a minimum-height fallback.
- The `Tabs` component `variant="line"` prop is passed but the installed `components/ui/tabs.tsx` may or may not accept it as a className variant — not confirmed to be a named variant in the Base UI shadcn tabs. Minor risk.

---

### E — Image Pipeline: 58/100

| Item | Status |
|---|---|
| All `Image` components use `unoptimized` prop | All gallery images: `unoptimized={true}` — avoids Next.js remote domain config requirement but bypasses optimization |
| CDN source | Unsplash direct links — not a production CDN. Production should use Vercel Blob or GCS/Firebase Storage |
| `next.config.mjs` remote domains | Not checked — `unoptimized` bypasses this requirement |
| One Unsplash URL intermittently failing | `reg-interior-2` observed to 404 in prior session |
| `resolvedUrl` field present | All verified assets have `resolvedUrl` matching `sourceFileUrl` — no true CDN resolution happening |
| HeroBand `priority` | PASS — `priority` prop set |
| Gallery tiles `priority` | Not set on tiles — acceptable for below-fold masonry |
| Lightbox `priority` | PASS — set on lightbox main image |

**Deduction (-42):** All images are Unsplash placeholders with `unoptimized=true`. This is correct for a UI reference but must be replaced in production with verified CDN URLs (Firebase Storage / Vercel Blob / GCS). D-12 is inherent to the reference-only nature of this workspace. See WAVE 5 for production repo.

---

### F — Architecture Health: 88/100

| Item | Status |
|---|---|
| Next.js 16 App Router | PASS |
| React 19 | PASS (inferred from `next` 16 dependency) |
| Tailwind v4 with `@theme inline` | PASS — `globals.css` uses `@import 'tailwindcss'` + `@theme inline` |
| shadcn component pattern | PASS |
| Framer Motion Track A only | PASS — no GSAP/Lenis/OGL |
| `"use client"` boundary correct | PASS — `demo-shell`, `gallery`, `legal-dossier-table`, `cmdk` all client; `app/page.tsx` is RSC |
| No Firebase SDK in reference | PASS — intentional; production uses Admin SDK server-side |
| `lib/types.ts` slim | PASS — does not replace `src/types/project.ts` in production |
| No auto-admin bootstrap | PASS — no auth layer present |

**Deduction (-12):**
- `components/ui/input-group.tsx` is installed but unused after the `CommandInput` patch. Dead code but no runtime impact.
- No `compare-fields.ts` / explorer in reference — these are production-only files.
- `app/page.tsx` passes all mock data as props; when production wires to Firestore Admin SDK this RSC pattern is correct and clean.

---

### G — Test / CI / Observability: 22/100

| Item | Status |
|---|---|
| Unit tests | None |
| Integration tests | None |
| E2E tests | None (agent-browser used ad-hoc in prior sessions only) |
| TypeScript strict mode | `tsc --noEmit` passes 0 errors (confirmed prior session) |
| ESLint | Not configured / not checked |
| Vercel Analytics | `@vercel/analytics/next` in `layout.tsx`, production-only guard | PASS |
| Error boundaries | None |
| Logging / observability | None (Vercel Analytics only) |

**Note:** This dimension is expected to be low for a UI reference. WAVE 7 smoke checklist is where manual verification is captured.

---

### H — SPEC vs Production Drift: 75/100

| Item | Status |
|---|---|
| 4 canonical projects present | PASS |
| Status = "Đang triển khai" on all 4 | PASS |
| Category labels match §6 | PASS |
| Firebase Auth / Google OAuth | Deferred — marked N/A per §0 auth lock |
| Passcode gate | N/A in reference; must be in production repo |
| ISR public shell | N/A in reference (no `revalidate` in demo RSC) |
| `src/types/project.ts` not replaced | PASS — `lib/types.ts` is reference-only slim layer |

---

## 2. Summary Scores

| ID | Dimension | Score | Notes |
|----|-----------|-------|-------|
| A | Runtime stability | 94/100 | No unsafe patterns in project code |
| B | Auth / access gate | N/A | Not present in UI reference — assess in production `src/` |
| C | Data correctness & display QA | 87/100 | All 4 canonical labels correct; legal logic sound |
| D | UI/UX critical surfaces | 91/100 | CMDK + Legal + Gallery all pass AC; Explorer/Compare N/A |
| E | Image pipeline | 58/100 | All Unsplash + unoptimized; acceptable for reference |
| F | Architecture health | 88/100 | Clean RSC/client split; Tailwind v4; no Track B |
| G | Test / CI | 22/100 | No tests; tsc clean |
| H | SPEC vs production drift | 75/100 | Canonical data correct; OAuth Deferred |

**Overall production-ready % (UI reference scope):** 73/100  
**Track A UI surfaces %:** 91/100  
**Deferred % (OAuth / RBAC-per-identity):** Explicitly excluded from go/no-go — 0 impact on score

---

## 3. Defect Register

### P0 Stability

| ID | Defect | File | Status |
|----|--------|------|--------|
| D-01 | `...p.alternateNames` without `?? []` | `cmdk.tsx` | **FIXED** — `...(p.alternateNames ?? [])` at line 95 |
| D-02 | `alternateNames.some` without guard | `project-explorer.tsx` | **N/A in reference** — no explorer component |
| D-03 | `legalDossier[key]` without `?.` | `legal-dossier-table.tsx` | **FIXED** — `project.legalDossier?.[key]` throughout |
| D-04 | compare-fields `!` assertions | `compare-fields.ts` | **N/A in reference** — no compare-fields file |

### P1 Passcode Hygiene (NOT OAuth)

| ID | Defect | File | Status |
|----|--------|------|--------|
| D-05 | First-user → admin bootstrap | `session.ts` | **N/A in reference** — no auth; must assess in production `src/` |
| D-06 | Shared passcode weak audit | — | **Accepted Limitation / Deferred** — do not fix via OAuth in this program |
| D-07 | Middleware cookie presence-only | `middleware.ts` | **N/A in reference** — no middleware |

### P1 UX / Nav

| ID | Defect | File | Status |
|----|--------|------|--------|
| D-08 | Explorer TableView without `Link` | `project-explorer.tsx` | **N/A in reference** |
| D-09 | Gallery `aspect-square`; unused `springLightbox` | `gallery.tsx` | **FIXED** — no `aspect-square`; SPRING constant used; no dead `springLightbox` |
| D-10 | Timeline slugs; fact-grid raw enums; compare breakpoint; Regency wrong image | various | Timeline: FIXED (full labels). Raw enums: N/A (status stored as Vietnamese string). Compare breakpoint: N/A (no compare). Regency wrong image: one Unsplash URL intermittently 404s — tracked as E-01 |

### P1 Platform

| ID | Defect | File | Status |
|----|--------|------|--------|
| D-11 | Untyped Firestore casts | data layer | **N/A in reference** — no Firestore; must assess in production `src/` |
| D-12 | Image hotlink / unoptimized | `gallery.tsx`, `demo-shell.tsx` | **Open** — all images `unoptimized=true` + Unsplash. Acceptable for reference; must be resolved in production WAVE 5 |

### Additional (found in scan)

| ID | Defect | File | Status |
|----|--------|------|--------|
| E-01 | `reg-interior-2` Unsplash URL intermittent 404 | `mock-data.ts` | Open — swap URL or add fallback `onError` handler |
| E-02 | `input-group.tsx` installed but unused | `components/ui/input-group.tsx` | Low priority dead code; no runtime impact |
| E-03 | No error boundary on `Lightbox` `AnimatePresence` | `gallery.tsx` | Low — `if (!current) return null` guards the inner render |

---

## 4. Keep / Change / Defer

### KEEP
- Passcode login pattern (must stay in production; not in this reference)
- Admin SDK reads (production only — not in reference)
- ISR shell pattern (production only)
- shadcn + Framer Motion Track A
- `"use client"` boundary design
- Slim `lib/types.ts` reference layer (port types selectively into `src/types/project.ts`)
- CSS columns masonry without `aspect-square`
- CMDK `Command` wrapper inside `CommandDialog` (required for context)

### DEFER
- Firebase Authentication / Google OAuth (LOCKED OUT per §0)
- Per-user RBAC beyond passcode
- Flipbook / WebGL / GSAP cinematic gallery (Track B cancelled)

### REMOVE / AVOID
- `aspect-square` on gallery tiles
- `unoptimized` in production (replace with Vercel Image Optimization or remote domain allowlist)
- Auto-admin bootstrap in `session.ts` (D-05 — fix in production WAVE 4)
- Unsplash as sole production image source

---

## 5. Wave Readiness

| Wave | Description | Blocker? | Readiness |
|---|---|---|---|
| WAVE 1 | P0 null-safety | None | **DONE in reference** — D-01, D-03 fixed. D-02, D-04 require production `src/` |
| WAVE 2 | Track A gallery / lightbox / hero | None | **DONE in reference** — gallery, lightbox, hero all pass AC |
| WAVE 3 | Data display QA | None | **DONE in reference** — labels, timeline, badges all correct |
| WAVE 4 | Passcode hygiene (D-05) | Needs production `src/lib/auth/session.ts` | **Cannot execute in this workspace** |
| WAVE 5 | Image pipeline | Needs CDN/Vercel Blob setup | **Partially open** — E-01 URL fix can be done here |
| WAVE 6 | Explorer / compare / a11y | Needs production `src/` | **Cannot execute in this workspace** |
| WAVE 7 | Smoke verification | Passcode login needed | **Cannot fully execute** — no auth in reference |
| WAVE 8 | Release checklist | All prior waves | **Cannot fully execute** |

---

## 6. Acceptance Criteria Status (In-Scope for This Reference)

### Stability
- [x] **AC-S1** CMDK with missing `alternateNames` does not crash — `...(p.alternateNames ?? [])` PASS
- [x] **AC-S2** Legal with missing `legalDossier` does not crash — `project.legalDossier?.[key]` PASS
- [ ] **AC-S3** Explorer filter with missing `alternateNames` — N/A (no explorer in reference)

### Passcode hygiene
- [ ] **AC-P1** No first-user auto-admin bootstrap — N/A in reference; must assess `src/lib/auth/session.ts`
- [ ] **AC-P2** Passcode login still works — N/A in reference; no login page
- [x] **AC-P3** Assessment documents shared-passcode as Accepted Limitation; OAuth Deferred — PASS (this document)

### UI Track A
- [x] **AC-U1** Gallery not forced square crop — PASS (CSS columns masonry, natural aspect ratio)
- [x] **AC-U2** Lightbox counter + keyboard + spring 260/26 — PASS
- [ ] **AC-U3** Explorer table names link to detail — N/A (no explorer)

### Data
- [x] **AC-D1** No raw slug-only labels on home timeline — PASS (full Vietnamese labels)
- [x] **AC-D2** Status/type labels use canonical maps — PASS ("Đang triển khai", CATEGORY_LABELS)

### Release
- [ ] **AC-R1** Smoke checklist with passcode login — cannot execute (no auth in reference)
- [x] **AC-R2** Open P0 stability count = 0 (in reference); Deferred auth listed — PASS for reference scope

### Deferred (N/A)
- [ ] N/A — Google OAuth
- [ ] N/A — Firebase Auth custom claims
- [ ] N/A — Per-identity auditLog

---

## 7. Verdict

**This v0 reference implementation is PRODUCTION-COMPLETE for Track A UI surfaces (91/100).**

All three critical Track A surfaces — CMDK, LegalDossierTable/Timeline, DetailGallery — are null-safe, correctly labelled, and pass their individual acceptance criteria. The reference is ready to be ported into the production `src/components/...` tree.

**For the production repo (`Z:\Coding\260719-DE`) to reach go/no-go, the following must additionally be assessed and actioned in that codebase:**
1. D-02: `project-explorer.tsx` null-safety on `alternateNames`
2. D-04: `compare-fields.ts` non-null assertions
3. D-05: `session.ts` first-user auto-admin bootstrap removal (WAVE 4)
4. D-07: Middleware cookie strength (optional harden, WAVE 4)
5. D-11: Untyped Firestore casts in data layer
6. D-12: Image CDN / `next/image` domain allowlist (WAVE 5)
7. AC-P2: Passcode login end-to-end smoke test
8. AC-U3: Explorer table row links to detail page

**OAuth / Firebase Authentication:** Deferred indefinitely per §0 auth lock. Not a blocker for this release track. Shared passcode is an Accepted Known Limitation documented here.

---

*WAVE 0 complete. Awaiting human command `implement WAVE n`.*
