# CLAUDE CODE PROMPT — Surgical removal: Hero transparency CTA + `#minh-bach` section
# Surface: v0/ ONLY
# Mode: IMPLEMENT + clean orphan sweep + e2e green
# Do not commit/push unless human asks

## Mission
Remove the two founder-marked UI regions from the home page, cleanly:

1. Hero secondary CTA link text **"Cách chúng tôi xác minh dữ liệu"** (`href="#minh-bach"`, `t("home.ctaTransparency")`) in `components/home/hero.tsx`
2. Entire home section **`#minh-bach`** — component `Transparency` / “Nguyên tắc minh bạch dữ liệu” (`components/home/transparency.tsx`, composed in `app/page.tsx`)

After removal: no orphan imports, unused i18n keys (if only used here), dead props, or e2e assertions targeting `#minh-bach` / transparency CTA.

## Scope lock
```text
WRITE: v0/components/home/hero.tsx
       v0/components/home/transparency.tsx  (DELETE file if unused)
       v0/app/page.tsx
       v0/lib/home-content.ts (drop transparencyIntro if only for this section)
       v0/lib/i18n/vi.json + en.json (remove orphan keys only used by removed UI)
       v0/e2e/*.spec.ts (home, locale-switch — update/remove tests that depend on removed UI)
       v0/app/layout.tsx comment only if it still names Transparency
READ/UPDATE lightly: docs that mention Transparency as current feature (WHAT_YOU_BUY / I18N_EN / DEMO_SCRIPT) — update one line if they claim the section still exists; do not rewrite history reports
NO:    deleting StatusBadge / status labels used elsewhere (explorer, compare, detail)
NO:    removing “minh bạch” narrative from other pages unless exclusively tied to #minh-bach
NO:    src/ Local app
```

## Steps
1. Confirm all references via ripgrep: `minh-bach`, `Transparency`, `ctaTransparency`, `transparencyHeading`, `transparencyIntro`.
2. Remove secondary CTA from `Hero` — keep primary CTA “Khám phá 4 dự án” → `/du-an`.
3. Remove `<Transparency …>` from `app/page.tsx`; delete `transparency.tsx` if no other importers.
4. Remove `transparencyIntro` from `buildSiteSettings` / page props if unused.
5. Remove i18n keys only consumed by deleted UI (`ctaTransparency`, `transparencyHeading`, `transparencyIntro`, and any EN equivalents). Keep keys still used elsewhere.
6. Fix e2e:
   - `e2e/home.spec.ts`: remove/replace “transparency CTA scrolls to #minh-bach” and any `#minh-bach` goto.
   - `e2e/locale-switch.spec.ts`: stop asserting “Data transparency principles” / related EN heading; assert other EN strings still valid (Explore CTA, Projects, etc.).
7. Grep again — zero hits for deleted symbols except historical `reports/` / old `prompts/` (leave archives) OR update live docs only.
8. Run affected e2e green.
9. Brief smoke note: files deleted/edited; primary hero CTA remains.

## Acceptance
- [ ] No `#minh-bach` in runtime app code (components/app)
- [ ] No Hero secondary transparency link
- [ ] `transparency.tsx` deleted or proven unused
- [ ] No unused imports / TS errors on touched files
- [ ] Orphan i18n keys removed (only if unused)
- [ ] e2e updated and green for affected specs
- [ ] Status badge system elsewhere untouched
