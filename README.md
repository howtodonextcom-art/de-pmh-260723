# DED-PMH v0 Track A app

UI shell exported from [howtodonextcom-art/260719-de-pmh](https://github.com/howtodonextcom-art/260719-de-pmh), living inside the production monorepo.

## Architecture

| Path | Role |
|------|------|
| `v0/` (this folder) | Track A UI app — CMDK, Legal, Gallery, HeroBand |
| `../src/` | **Library / platform** — types, seed adapter, Firebase, admin, full App Router |
| `../13_*.json`, `../08_*.csv` | Canonical data consumed via `@library/library/seed-adapter` |

Data flow: `app/page.tsx` → `lib/library-bridge.ts` → `@library/library/seed-adapter` → parent seeds. Falls back to `lib/mock-data.ts` if seeds are missing.

## Develop

From **repo root** (`260719-DE`):

```bash
pnpm --dir v0 install
pnpm dev:v0
```

Or:

```bash
cd v0 && pnpm install && pnpm dev
```

Open http://localhost:3000

## Integrate next

1. Keep polishing UI in `v0/components/*`
2. Add library exports under `../src/library/` for queries/auth when ready (passcode stays in parent app)
3. Port hardened components back into `../src/components/` for production routes when stable

Do **not** replace the parent Next app with this folder as the sole production deploy without an explicit decision.
