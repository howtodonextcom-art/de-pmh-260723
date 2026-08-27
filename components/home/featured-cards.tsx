import { Reveal } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/project/project-card";
import { t } from "@/lib/i18n/t";
import type { V0ImageAsset } from "@/lib/library-bridge";
import type { Project as FullProject } from "@library/types/project";

export function FeaturedCards({
  projects,
  heroAssetsBySlug,
}: {
  projects: FullProject[];
  heroAssetsBySlug: Record<string, V0ImageAsset | null>;
}) {
  if (projects.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-4 font-display text-2xl font-semibold">{t("home.featuredHeading")}</h2>
        <p className="text-sm text-muted-foreground">{t("home.emptyCatalog")}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 font-display text-2xl font-semibold">{t("home.featuredHeading")}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} blur delay={i * 0.1}>
            <ProjectCard
              project={p}
              heroAsset={heroAssetsBySlug[p.slug]}
              layout="featured"
              /* First card sits directly under Hero and repeats the same photo —
                 Next's LCP heuristic picks it over Hero's animated (opacity-delayed)
                 image unless it's marked priority too. */
              priority={i === 0}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
