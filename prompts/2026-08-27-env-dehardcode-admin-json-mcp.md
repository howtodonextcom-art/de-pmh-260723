# CLAUDE CODE — ENV CONTRACT + DEHARDCODE ROADMAP
# DED-PMH v0 — Phase 0: standardize env, secret hygiene, seed backup, project-input path
# Evidence: reports/2026-08-19-technical-dd-valuation-productization.md §9
#            lib/library-bridge.ts, lib/home-content.ts, lib/config/site-nav.ts
#            vendor/data/13_PROJECT_DATA_SCHEMA.json, 08_IMAGE_ASSET_MANIFEST.csv
# Workspace: C:\Code\2026\de-pmh-260723
# Mode: IMPLEMENT (Phase 0 only) → REPORT. No commit/push unless asked.
# Frozen: Teal/Fraunces · COMPARE_COLUMN_CAP=4 · MapLibre · NO Firestore/Auth this wave
# Backend lock (human 2026-08-27): env + local JSON form; Firebase DEFERRED

---

## 0. Facts (do not invent)

- App is SSG catalog; data via library-bridge → vendor JSON/CSV (fail-closed in prod).
- Hardcode lock-in ~55–65%: nav taxonomy, home copy, REGION_LNG_LAT, i18n names, image domains.
- `.env.local` currently holds a Firebase JS snippet (invalid dotenv). Convert to KEY=value.
- `service.json` is a Firebase Admin private key. NEVER commit. Add to .gitignore.
- `.gitignore` already has `.env*` but NOT `service.json`.
- Only app env in use today: NODE_ENV, optional NEXT_PUBLIC_PDF_FUNCTION_URL.

---

## 1. This wave (Phase 0) — MUST ship

1. Secret hygiene: gitignore `service.json`, `credentials/*.json`; confirm untracked.
2. Env contract: `.env.example` (no secrets) + rewrite `.env.local` as KEY=value.
3. Typed loader `lib/config/env.ts` — server-only for secrets; NEXT_PUBLIC_* only if needed.
4. Seed backup: `scripts/backup-seed.mjs` → `backups/seed-<date>/` copy JSON+CSV+mirror map
   + document how to restore / re-import later.
5. Roadmap report: `reports/2026-08-27-env-dehardcode-roadmap.md` (phases 0–4 below).
6. Prompt file: `prompts/2026-08-27-env-dehardcode-admin-json-mcp.md`

---

## 2. Env schema (Phase 0)

Public/site (safe in .env.example with placeholders):
- NEXT_PUBLIC_SITE_NAME
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_BRAND_SHORT
- NEXT_PUBLIC_PDF_FUNCTION_URL (existing, optional)

Server-only (empty until Firebase wave):
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (or GOOGLE_APPLICATION_CREDENTIALS=./service.json local only)
- NEXT_PUBLIC_FIREBASE_API_KEY / AUTH_DOMAIN / STORAGE_BUCKET / APP_ID / MESSAGING_SENDER_ID
  (documented, unused this wave)

Ops:
- AUDIT_BASE_URL, PROD_BASE_URL, LUXURY_MIN_INDEX, PW_CHANNEL (already used by scripts)

Do not put private_key in NEXT_PUBLIC_*. Do not echo secrets in reports.

---

## 3. Roadmap (document only this wave)

| Phase | Goal | Persistence |
|-------|------|-------------|
| 0 (now) | Env contract, gitignore, backup seed | files |
| 1 | Admin `/lab/projects` form: CRUD 1 project JSON matching schema; images as URL/path list | `data/runtime/projects.json` gitignored + export zip |
| 2 | Replace home-content + site-nav hardcode with typed SiteContent/Nav from same JSON | still files |
| 3 | library-bridge reads runtime JSON first, vendor seed fallback | files |
| 4 | Firebase/Storage using service.json — only after Phase 1–3 stable | Firestore |

---

## 4. Out of scope this wave

Firebase SDK, Auth, Firestore writes, public admin without auth, rewriting all 4 projects' UI, committing service.json.

---

## 5. DoD

- [ ] service.json ignored; .env.example committed; .env.local KEY=value locally
- [ ] backup script dry-run produces a folder with schema JSON + CSV + mirror map
- [ ] roadmap report lists modules to dehardcode with file paths
- [ ] typecheck clean; no secrets in markdown
