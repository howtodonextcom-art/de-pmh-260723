# CMS Firebase catalog — smoke (2026-08-27)

Branch: `feat/cms-firebase-catalog`  
Backup (all 4 projects): `backups/full-catalog-2026-08-27T153309/`  
Also: `backups/seed-2026-08-27T153303/`, `backups/view-snapshot-2026-08-27T140853/` (and the 153309 full-catalog copy of views).

## What shipped

- Public catalog reads Firestore via Admin SDK, with `data/runtime/catalog.json` fallback. Empty catalog is valid.
- Auth: any Firebase Auth user. Bootstrap from `CMS_BOOTSTRAP_EMAIL` / `CMS_BOOTSTRAP_PASSWORD`, with legacy `.env.local` `email` / `PASS` fallback. Secrets are not printed here.
- Routes: `/login`, `/cms`, `/cms/projects/new`, `/cms/projects/[slug]`, `/cms/site`.
- Unauthenticated `/cms/**` redirects to `/login`.
- Image upload: Storage when available, otherwise `public/cms-uploads/` (gitignored).

## Grep gate (`app` / `components` / `lib` / `vendor/data`)

Hits for `hong-hac-city` / `the-regency` / `the-sculptura` / `harmonie`: **0**.

## Verify (localhost)

- `/cms` unauthenticated → `/login?next=/cms`
- Login with bootstrap operator → `/cms` (source: firestore, 0 projects)
- `/cms/projects/new` form renders
- Public `/` empty catalog shells render without crash

## Tests

- `tsc --noEmit`: pass
- `vitest run`: 6 files, 22 tests pass
- `verify:i18n`: pass

## Restore (optional, not auto-run)

`node scripts/seed-firestore-from-backup.mjs --dir backups/full-catalog-2026-08-27T153309`  
Skipped automatically if Admin credentials are missing. This is backup import, not keeping catalog in git.

## Deploy rules

`firestore.rules` + `storage.rules` (public read, write if `request.auth != null`). Deploy with Firebase CLI when ready. CMS writes use Admin SDK (bypass rules).
