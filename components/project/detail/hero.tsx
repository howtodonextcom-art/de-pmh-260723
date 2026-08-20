import { Hero } from "@/components/home/hero";

import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/** D1 — full-bleed hero; falls back to a brand gradient when no hero image exists.
 *  Delegates to the shared `Hero` (aka `HeroBlock`, DD audit F12) with variant="detail". */
export function DetailHero({
  project,
  heroAsset,
}: {
  project: FullProject;
  heroAsset?: V0ImageAsset | null;
}) {
  return <Hero variant="detail" project={project} heroAsset={heroAsset} />;
}
