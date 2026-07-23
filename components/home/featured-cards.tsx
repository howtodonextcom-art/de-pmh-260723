import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BlurFade } from "@/components/shared/blur-fade";
import { PROJECT_STATUS_LABEL } from "@library/components/layout/project-status-label";
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
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 font-display text-2xl font-semibold">{t("home.featuredHeading")}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const asset = heroAssetsBySlug[p.slug];
          const imageUrl = asset ? (asset.resolvedUrl ?? asset.sourceFileUrl) : null;
          return (
            <BlurFade key={p.slug} delay={i * 0.1}>
              <Link
                href={`/du-an/${p.slug}`}
                className="group focus-visible:ring-ring relative block aspect-3/2 overflow-hidden rounded-2xl bg-gradient-to-br from-muted via-primary/5 to-muted transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15 focus-visible:ring-2 focus-visible:outline-none motion-reduce:hover:translate-y-0 sm:aspect-video"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer-sweep" />
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={asset?.alt ?? p.displayNameVi}
                    fill
                    unoptimized
                    /* First card sits directly under Hero and repeats the same photo —
                       Next's LCP heuristic picks it over Hero's animated (opacity-delayed)
                       image unless it's marked priority too. */
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-3 right-3 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
                  {PROJECT_STATUS_LABEL[p.status] ?? p.status}
                </span>
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <h3 className="text-xl font-semibold">{p.displayNameVi}</h3>
                  {p.highlights?.[0] ? (
                    <p className="mt-1 line-clamp-2 max-w-md text-sm text-white/85">{p.highlights[0]}</p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                    {t("common.xemChiTiet")} <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </BlurFade>
          );
        })}
      </div>
    </section>
  );
}
