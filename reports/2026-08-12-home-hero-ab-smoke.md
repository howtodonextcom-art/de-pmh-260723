# Home hero A/B — whitespace upgrade

**Date:** 2026-08-12  
**Scope:** `components/home/hero.tsx` only (winner ship)  
**Live problem:** `max-w-7xl` inset grid + rounded media card → ~312px gutters; conflicts with full-bleed hero rule.

---

## Variants

| | Whitespace theory | Risk | Effort |
|---|-------------------|------|--------|
| **A — Full-bleed cinematic** | Image = edge-to-edge plane; copy in safe column + scrim; kill inset card | Contrast on busy photos | M |
| **B — Editorial asymmetric** | Keep 2-col; bleed image right / widen media col; keep some max-w | Still partly “card beside copy”; weaker vs full-bleed rule | S–M |

## Rubric

| Criterion | W | A | B |
|-----------|---|---|---|
| Brand-first + one composition | 30 | 9 | 7 |
| Whitespace / anti-dashboard | 25 | 9 | 7 |
| Align full-bleed / no-hero-card | 20 | 10 | 5 |
| Regression (i18n, LCP, reduced-motion) | 15 | 8 | 9 |
| Implement cost | 10 | 7 | 8 |
| **Weighted** | | **8.75** | **7.05** |

**Winner: A** (tie-break rule also favors full-bleed alignment).

---

## Shipped

- Full-bleed `ImageWithFallback` `sizes="100vw"` + Ken Burns (honors `useReducedMotion`)
- Left→right + mobile bottom scrims (`from-background/…`, teal tokens only)
- Fold: kicker + H1 words + brand statement + one CTA — no badges/stats
- Removed `md:grid-cols-12` inset card / halo blur frame

## Smoke (`http://localhost:3000`)

| Check | Result |
|-------|--------|
| No `rounded-2xl` hero media card markup | PASS |
| Full-bleed / scrim markers present | PASS |
| CTA “Khám phá 4 dự án” | PASS |
| “Dự án nổi bật” still below fold | PASS |
| Commit/push | Not done |

## Residual

- Long `brandStatementVi` still dense — copy trim is content ops, not this wave
- Dark theme: spot-check contrast on very bright hero photos if assets change
