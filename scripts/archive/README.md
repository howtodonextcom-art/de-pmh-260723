# scripts/archive

Historical, one-off evidence-capture scripts. Each was written to reproduce the
browser evidence for a **specific** past report and is kept for provenance — it
is **not** part of any current CI or workflow.

| Script | Paired report |
|---|---|
| `indep-map-review.mjs` | `reports/2026-07-21-v0-maplibre-*` |
| `indep-sell70-review.mjs` | `reports/2026-07-21-v0-sellability-70-*` |
| `indep-r100-review.mjs` | `reports/2026-07-21-v0-remaining-100-*` |

The current, still-usable evidence script lives one level up at
`scripts/indep-maturity-audit.mjs` (run against `pnpm dev` on
`http://localhost:3000`). Do not wire these archived scripts into CI.
