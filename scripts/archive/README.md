# scripts/archive

Historical, one-off evidence-capture scripts. Each was written to reproduce the
browser evidence for a **specific** past report and is kept for provenance — it
is **not** part of any current CI or workflow.

| Script | Paired report |
|---|---|
| `indep-map-review.mjs` | `reports/2026-07-21-v0-maplibre-*` |
| `indep-sell70-review.mjs` | `reports/2026-07-21-v0-sellability-70-*` |
| `indep-r100-review.mjs` | `reports/2026-07-21-v0-remaining-100-*` |
| `indep-r3-verify.mjs` | R3 gallery chunk-load verification |
| `indep-bf-capture.mjs` | Before/after card hover evidence |
| `indep-scorelift-capture.mjs` | Home score-lift capture |
| `indep-scorelift-verify.mjs` | Home score-lift verify |
| `indep-i18n-orphan-scan.mjs` | i18n orphan string scan |
| `ia-dedupe-capture.mjs` | IA dedupe capture |

The current, still-usable evidence script lives one level up at
`scripts/indep-maturity-audit.mjs` (run against `pnpm dev` on
`http://localhost:3000`). Do not wire these archived scripts into CI.
