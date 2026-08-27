import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { Reveal } from "@/components/shared/reveal";
import { t } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import type { V0ImageAsset } from "@/lib/library-bridge";
import type { Project as FullProject } from "@library/types/project";

export function ExplorerPreview({
  projects,
  heroAssetsBySlug,
}: {
  projects: FullProject[];
  heroAssetsBySlug: Record<string, V0ImageAsset | null>;
}) {
  if (projects.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{t("home.explorerHeading")}</h2>
          <Link href="/du-an" className={cn(buttonVariants({ variant: "ghost" }))}>
            {t("home.explorerCta")} <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">{t("home.emptyCatalog")}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold">{t("home.explorerHeading")}</h2>
        <Link href="/du-an" className={cn(buttonVariants({ variant: "ghost" }))}>
          {t("home.explorerCta")} <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <Reveal className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {projects.map((p, i) => (
          <div key={p.slug} className="w-[85vw] shrink-0 snap-start sm:w-auto">
            {/* Same photo often repeats from Hero/FeaturedCards above — Next's
                dev LCP heuristic keys a shared map by image URL, so a later
                lazy duplicate of the same src can overwrite the eager entry
                and false-fire the warning. Mark the first card priority too. */}
            <ProjectCard project={p} heroAsset={heroAssetsBySlug[p.slug]} priority={i === 0} />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
