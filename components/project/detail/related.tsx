import { ProjectCard } from "@/components/project/project-card";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/** D12 — 3 related-project cards, same-region prioritized by the caller. */
export function DetailRelated({
  projects,
  heroAssetsBySlug,
}: {
  projects: FullProject[];
  heroAssetsBySlug: Record<string, V0ImageAsset | null>;
}) {
  if (projects.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.related")}</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} heroAsset={heroAssetsBySlug[p.slug]} />
        ))}
      </div>
    </section>
  );
}
