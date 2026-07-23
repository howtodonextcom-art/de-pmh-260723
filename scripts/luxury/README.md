# v0 luxury QA scripts (vault-pattern inspired)

Tham chiếu `personal-data-cloud-vault` scripts:

- `luxury:capture` → `capture.mjs`
- `luxury:diff` → `diff.mjs` (stub cho tới khi có `reports/assets/luxury-golden/`)
- `luxury:score` → `score.mjs` → `reports/assets/luxury-checklist-score.json`

**Không** port Firebase/Algolia. Tools gốc `../tools/260528-codex` không có trên disk — schema score được tái dựng trong prompt UI/UX roadmap.

```bash
pnpm dev   # :3000
pnpm luxury:qa
```
