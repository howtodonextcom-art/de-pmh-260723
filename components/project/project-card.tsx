"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { StatusDot, STATUS_LABEL } from "@/components/shared/status-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { computeFieldStatusSummary, orderedStatusEntries } from "@library/lib/data/status-summary";
import { PROJECT_STATUS_LABEL } from "@library/components/layout/project-status-label";
import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

const PROJECT_TYPE_LABEL: Record<string, string> = {
  "do-thi-sinh-thai": "Đô thị sinh thái",
  "can-ho-hang-sang": "Căn hộ hạng sang",
  "can-ho-premium": "Căn hộ premium",
  "can-ho": "Căn hộ",
  "thap-tang": "Thấp tầng",
  "cao-tang": "Cao tầng",
};

export function ProjectCard({
  project,
  heroAsset,
  priority = false,
}: {
  project: FullProject;
  heroAsset?: V0ImageAsset | null;
  /** Set on the first above-the-fold card so Next.js doesn't flag it as an unmarked LCP image. */
  priority?: boolean;
}) {
  const summary = orderedStatusEntries(computeFieldStatusSummary(project));
  const primaryType = (project.projectType ?? []).find((t) => PROJECT_TYPE_LABEL[t]);
  const imageUrl = heroAsset ? (heroAsset.resolvedUrl ?? heroAsset.sourceFileUrl) : null;

  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-muted via-primary/5 to-muted">
        {/* Shimmer sits behind the image; object-cover fully occludes it once
            the (unoptimized, remote) photo paints — no JS load-state needed. */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer-sweep" />
        {imageUrl && (
          <ImageWithFallback
            src={imageUrl}
            alt={heroAsset?.alt ?? project.displayNameVi}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
          {PROJECT_STATUS_LABEL[project.status] ?? project.status}
        </span>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="truncate text-base font-semibold text-foreground">{project.displayNameVi}</h3>
        <p className="text-sm text-muted-foreground">
          📍 {project.region}
          {primaryType && ` · ${PROJECT_TYPE_LABEL[primaryType]}`}
        </p>
        {project.highlights?.[0] && (
          <p className="line-clamp-2 text-sm text-foreground/80">{project.highlights[0]}</p>
        )}

        <div className="flex items-center gap-1 pt-1">
          {summary.map(([status, count]) => (
            <Tooltip key={status}>
              <TooltipTrigger render={<span />}>
                <StatusDot status={status} />
              </TooltipTrigger>
              <TooltipContent>
                {STATUS_LABEL[status]}: {count} trường
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-amber-500/70 dark:bg-amber-400/70" aria-hidden />
            Cập nhật {project.lastVerifiedAt}
          </span>
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
