# Legal + compare view snapshot

**Date:** 2026-08-27  
**Command:** `npm run backup:views`  
**Why:** Phase 0 `backup:seed` copied vendor JSON/CSV/images. It did **not** store the `/phap-ly` and `/so-sanh` view-model (split legal lines, compare cell display + status, including plot-code hardcodes).

---

## What was exported

Per-project JSON keyed by `slug`:

```
backups/view-snapshot-<stamp>/
  index.json
  RESTORE.txt
  projects/
    hong-hac-city.json
    the-regency.json
    the-sculptura.json
    harmonie.json
```

Latest working copy (gitignored): `data/runtime/snapshots/` (`index.json`: 4 projects, 45 legal lines, 36 compare cells).

Schema:

- `legal.groups[]` — same 8 ids as `LEGAL_TABLE_ROW_ORDER` (`investmentApproval` … `disputes`), each with `lines[{ id, text, code?, date? }]`
- `compare.fields[]` — same ids as `COMPARE_FIELDS` (`lo-dat`, `khu-vuc`, `loai-hinh`, `quy-mo-dat`, `gfa`, `so-can`, `don-vi-thiet-ke`, `tong-thau`, `tinh-trang-ban`) with `display` + `status`

Builder: `lib/view-snapshot.ts` (same functions as the two tabs).

---

## Remaining hardcode now captured in snapshot

`PLOT_CODE_BY_SLUG` in `vendor/library/lib/data/compare-fields.ts` is reflected as:

| slug | compare `lo-dat` |
|------|------------------|
| hong-hac-city | Chưa có / `chua-co-du-lieu` |
| the-regency | CR5-1B |
| the-sculptura | H14-3 |
| harmonie | Thửa đất số 1307 (from address) |

Phase 1 `/lab/projects` should **import these JSON files**, not ask operators to re-type them.

---

## Restore / import

1. Keep `backups/view-snapshot-*/projects/*.json` as the operator archive.
2. Copy into `data/runtime/snapshots/projects/` for the latest editable set.
3. Do not replace `vendor/data/13_PROJECT_DATA_SCHEMA.json` with this snapshot (different shape). Bridge still reads vendor seed until Phase 3.
