# DED-PMH CMS + Firebase catalog — MASTER (12 workstreams)

**Date:** 2026-08-27  
**Branch:** `feat/cms-firebase-catalog` (create from current `main` BEFORE code)  
**Repo:** `C:\Code\2026\de-pmh-260723`  
**This wave SUPERSEDES** the earlier draft that only deleted Hồng Hạc City and seeded the remaining 3.

## Human lock

1. **FIRST:** backup / seed-export **ALL** current project data (all 4: hong-hac-city, the-regency, the-sculptura, harmonie) — info + images + legal + compare view-models.
2. **THEN:** delete **ALL** projects from the codebase (not only Hồng Hạc). No hardcoded project catalog.
3. **THEN:** implement Firebase CMS so operators enter projects + images matching the current public UI.
4. **Auth:** no RBAC. Any Firebase Auth account can use CMS. Bootstrap from `.env.local` keys `email` and `PASS` — migrate to `CMS_BOOTSTRAP_EMAIL` + `CMS_BOOTSTRAP_PASSWORD`. **NEVER print secrets** in reports or chat.
5. **Data:** GCP/Firebase project `de-division`. Client `NEXT_PUBLIC_FIREBASE_*` already in `.env.local`. Admin `GOOGLE_APPLICATION_CREDENTIALS=./service.json`. Do not commit `.env.local` or `service.json`.
6. **Git:** CREATE BRANCH `feat/cms-firebase-catalog` from current main BEFORE code. Do not push unless asked. Do not commit secrets. CLAUDE.md: if committing later, local email `howtodonext.com@gmail.com`. Creating the branch is required. Implementation MAY be committed on the feature branch (not main) if that keeps work safe; still do **not** push.
7. **Keep public UI shells** (home, `/du-an`, `/du-an/[slug]`, `/so-sanh`, `/phap-ly`, flipbook, MapLibre, teal/Fraunces). Empty catalog is OK. Do not delete the whole app.
8. **Nav:** zone `bac` | `nam`; nam groups `site-a` | `outsite`. CMS fields, not hardcoded PMH plot leaves (drop CR9/C10/coming-soon hardcode).
9. **Dev server:** `npm run dev` (webpack), not turbopack.

## Scope in one sentence

Backup all 4 projects → wipe every hardcoded catalog record from git → public site reads Firestore (empty is fine) → authenticated CMS CRUD + Storage uploads that fill the same detail-page field contract.

## Field contract (UI only — do not keep HHC data in source)

Production layout `https://de-division-pmh.vercel.app/du-an/hong-hac-city` is the **field contract** for CMS forms. Sections to support:

- Hero (name, status, region, hero image)
- Fact grid (address, type, scale, units, site area, concept architect, status note, last verified)
- Story (short/long description, highlights)
- Location (address, coordinates, location image, optional sa-bàn URL)
- Masterplan (subdivisions, masterplan image, optional unit-mix stats)
- Architecture / partners (concept architect / interior / landscape + `publicNameApproved`, partners, awards)
- Product line (product types, unit mix)
- Amenities
- Gallery (category, alt, verified, render flag)
- Legal dossier (8 groups including design unit)
- Sales status
- Sources
- Nav placement: `navZone` bac|nam, `namGroup` site-a|outsite, `navLabel`, `plotCode`

## Existing backups (extend, do not lose)

- `npm run backup:seed` → vendor JSON/CSV/images
- `npm run backup:views` → per-project legal+compare view-models in `backups/view-snapshot-*` and `data/runtime/snapshots/`

**Run BOTH again first** so a fresh full snapshot exists, **plus** copy/export remaining project-specific hardcode (`home-content`, `site-nav`, mock-data) into `backups/full-catalog-<stamp>/` as JSON/source.

Gitignore `backups/full-catalog-*/` like other backup trees. Do not leave catalog data in git.

## 12 workstreams

### A1 — Branch, gitignore, master prompt

- Create `feat/cms-firebase-catalog` from current main before implementation.
- Ignore `backups/full-catalog-*/`. Never commit `.env.local` or `service.json`.

### A2 — Full backup (all 4)

- `npm run backup:seed`
- `npm run backup:views`
- `scripts/backup-full-catalog.mjs` → `backups/full-catalog-<stamp>/` including vendor schema, CSV, image-mirror-map, `public/vendor-images`, `lib/mock-data.ts`, `lib/home-content.ts`, `lib/config/site-nav.ts` as JSON extracts.

### A3 — Wipe vendor seed + mirrored images

Strip hong-hac-city **AND** the-regency, the-sculptura, harmonie from:

- `vendor/data/13_PROJECT_DATA_SCHEMA.json` (empty `projects` array; keep schema metadata)
- CSV / image-mirror-map / `public/vendor-images` project files (brand chrome image may remain if not a project slug)
- `vendor/data/scripts/image-verify-report.json`

### A4 — Wipe app catalog hardcode

- `lib/mock-data.ts` → empty arrays + generic empty-project factory (no named projects)
- `lib/home-content.ts` → generic brand statement; empty updates
- `lib/config/site-nav.ts` → zone/group **shells only** (bac | nam → site-a | outsite), no plot leaves
- Nav built from CMS `navZone` / `namGroup`

### A5 — Strip slug special-cases

- `vendor/library/lib/data/compare-fields.ts` — drop `PLOT_CODE_BY_SLUG`; use `plotCode` field then address regex; units-by-phase when `totalUnits` missing (any slug)
- `vendor/library/lib/data/fact-grid.ts` — same generic rules
- `vendor/library/lib/data/architect-visibility.ts` — `publicNameApproved` for **all** projects
- `lib/legal-documents.ts` — same
- `components/project/detail/masterplan.tsx` — drop Hồng Phát hardcoded stats; use `unitMix` when present
- `vendor/library/library/seed-adapter.ts` — no name→slug map of the four projects
- i18n HHC sa-bàn CTA → generic map CTA; layout description without naming specific projects
- home map: optional per-project `saBanUrl` instead of hardcoded Bắc Ninh Hồng Hạc URL

### A6 — Tests / e2e / luxury routes

- `lib/view-snapshot.test.ts` — empty catalog + generic fixture (not the four slugs)
- e2e: do not assume those slugs exist; empty catalog must not crash
- `scripts/luxury/capture.mjs` — capture public shells, not `/du-an/<hardcoded-slug>`

Grep gate (must be **0** hits): `hong-hac-city` / `the-regency` / `the-sculptura` / `harmonie` in `app` `components` `lib` `vendor/data` (exclude `reports/` `backups/` `prompts/`).

### A7 — Firebase SDK + env

- Add `firebase` + `firebase-admin`
- `lib/firebase/client.ts`, `lib/firebase/admin.ts` using `lib/config/env.ts` + `env.server.ts`
- Migrate bootstrap keys; document in `.env.example`
- Client config: existing `NEXT_PUBLIC_FIREBASE_*`
- Admin: `GOOGLE_APPLICATION_CREDENTIALS=./service.json`

### A8 — Firestore / Storage model + rules

- Firestore `projects/{slug}` (canonical Project + nav + plotCode + saBanUrl + assets array)
- Firestore `site/settings` (brand statement + updates)
- Storage `projects/{slug}/...`
- Rules: **public read**; **write if `request.auth != null`** (no RBAC)

### A9 — Auth + session + `/login`

- Any Firebase Auth user may use CMS
- Bootstrap: if `CMS_BOOTSTRAP_EMAIL` + `CMS_BOOTSTRAP_PASSWORD` set, ensure that user exists (Admin SDK) on first login
- Session cookie via Admin `createSessionCookie`
- Next 16 `proxy.ts`: unauthenticated `/cms/**` → `/login`
- CMS layout verifies session with Admin SDK

### A10 — CMS UI (CRUD + images)

Routes:

- `/login`
- `/cms` dashboard
- `/cms/projects` list + create
- `/cms/projects/[slug]` edit (field contract above)
- `/cms/site` brand + updates

Image upload to Storage; persist download URLs on the project document. Match detail UI categories (hero, masterplan, location, amenities, architecture, interior, gallery, logos, …).

### A11 — Public catalog from Firebase

- `lib/catalog.ts` loads via Admin SDK in Server Components
- `lib/library-bridge.ts` uses Firestore; **empty catalog is valid** (do not throw; do not fall back to hardcoded mocks)
- `dynamic = "force-dynamic"` on catalog pages so CMS writes appear without rebuild
- Empty states on home / `/du-an` / `/so-sanh` / `/phap-ly` / `/lab`

### A12 — Restore script + verify + smoke report

- Optional `scripts/seed-firestore-from-backup.mjs` reading `backups/` — **gated**, not run automatically if it would need network/credentials; try if `service.json` works, otherwise document how
- This is **BACKUP IMPORT**, not leaving data in git
- `npm run typecheck` + `vitest`
- Empty public catalog does not crash
- Write `reports/2026-08-27-cms-firebase-smoke.md` with backup path, branch name, residual grep, test results
- Do **not** print secrets

## Out of scope

- Do not delete the whole app
- Do not edit plan files under `.cursor/plans`
- Do not push unless asked
- Do not connect v0.app / extra GitHub identities
- Windows PowerShell: use `;` not `&&`
- Dev: `npm run dev` (webpack)

## Done when

- Branch exists locally
- Fresh seed + views + full-catalog backups on disk
- Zero hardcoded catalog slugs in `app` / `components` / `lib` / `vendor/data`
- CMS usable with any Firebase Auth account (bootstrap from env)
- Public shells render with empty catalog
- Smoke report written
