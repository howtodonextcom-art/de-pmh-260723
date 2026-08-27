# CLAUDE CODE — PER-PROJECT LEGAL + COMPARE SNAPSHOT
# DED-PMH v0 — Normalize & backup what /phap-ly and /so-sanh actually render
# Workspace: C:\Code\2026\de-pmh-260723
# Mode: IMPLEMENT → GATE. No commit/push unless asked.
# Frozen: Teal/Fraunces · COMPARE_COLUMN_CAP=4 · MapLibre · NO Firebase SDK
# Parent: reports/2026-08-27-env-dehardcode-roadmap.md (Phase 0 done; this fills the gap)

## 0. Why this wave exists

Phase 0 `backup:seed` copied vendor files, NOT the view-model:
- `/phap-ly?slug=*` renders `legalDossier` prose via `splitLegalContent()` → lines with text/code/date
- `/so-sanh` renders `COMPARE_FIELDS` cells (display + FieldStatus), including hardcoded
  `PLOT_CODE_BY_SLUG` and type labels in `vendor/library/lib/data/compare-fields.ts`

Operators must not re-type Hồng Hạc / Regency / Sculptura / Harmonie later.
Export the **displayed** records, keyed by `slug`.

## 1. Scope (MUST ship)

1. Define typed snapshot schema (one file per project + index)
2. Script `npm run backup:views`
3. Report `reports/2026-08-27-legal-compare-snapshot.md`

## 2. Out of scope

- `/lab/projects` UI
- Changing `/phap-ly` or `/so-sanh` rendering
- Firestore
- Rewriting vendor JSON in place (export is additive)

## 3. Verify

- 4 slugs exported
- HHC legal lines include GCNĐT / QĐ 457 / GPXD 158/161/208
- Compare: Regency CR5-1B, Sculptura H14-3, Harmonie thửa 1307, HHC lo-dat Chưa có
