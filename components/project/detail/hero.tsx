import { ImageWithFallback } from "@/components/shared/image-with-fallback";

import { PROJECT_STATUS_LABEL } from "@library/components/layout/project-status-label";
import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/** D1 — full-bleed hero; falls back to a brand gradient when no hero image exists. */
export function DetailHero({
  project,
  heroAsset,
}: {
  project: FullProject;
  heroAsset?: V0ImageAsset | null;
}) {
  const imageUrl = heroAsset ? (heroAsset.resolvedUrl ?? heroAsset.sourceFileUrl) : null;
  const firstSentence = project.shortDescriptionVi?.split(". ")[0]
    ? `${project.shortDescriptionVi.split(". ")[0]}.`
    : null;

  return (
    <section className="relative flex h-[60vh] min-h-96 items-end overflow-hidden">
      {imageUrl ? (
        <ImageWithFallback
          src={imageUrl}
          alt={heroAsset?.alt ?? project.displayNameVi}
          fill
          unoptimized
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 text-white sm:px-6">
        <div className="mb-3 flex gap-2">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {PROJECT_STATUS_LABEL[project.status] ?? project.status}
          </span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {project.region}
          </span>
        </div>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">{project.displayNameVi}</h1>
        {firstSentence && (
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">{firstSentence}</p>
        )}
      </div>
    </section>
  );
}
