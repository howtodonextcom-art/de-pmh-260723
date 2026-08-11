"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

import { LegalDossierTable } from "@/components/project/legal-dossier-table";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  getBranchSlugs,
  parseNamGroupId,
  parseNavZoneId,
  type ProjectNamGroupId,
  type ProjectNavZoneId,
} from "@/lib/project-nav-taxonomy";
import { LEGAL_TABLE_ROW_ORDER } from "@/lib/legal-documents";
import type { Project as FullProject } from "@library/types/project";

function ScopeChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

/**
 * Variant A — single-project panel: zone/group scope + project tabs.
 * Only one dossier card is mounted at a time (`?slug=`).
 */
function LegalScopedBody({ projects }: { projects: FullProject[] }) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const zone = parseNavZoneId(searchParams.get("zone"));
  const nhom = zone === "nam" ? parseNamGroupId(searchParams.get("nhom")) : null;
  const requestedSlug = searchParams.get("slug");

  const scoped = useMemo(() => {
    if (!zone) return projects;
    const allowed = new Set(getBranchSlugs(zone, nhom));
    return projects.filter((p) => allowed.has(p.slug));
  }, [projects, zone, nhom]);

  const activeSlug =
    requestedSlug && scoped.some((p) => p.slug === requestedSlug)
      ? requestedSlug
      : (scoped[0]?.slug ?? null);

  const activeProject = activeSlug
    ? (scoped.find((p) => p.slug === activeSlug) ?? null)
    : null;

  function replaceParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `/phap-ly?${qs}` : "/phap-ly", { scroll: false });
  }

  // Keep ?slug= coherent when zone/group changes or slug is missing/invalid.
  useEffect(() => {
    if (scoped.length === 0) {
      if (requestedSlug) {
        replaceParams((params) => {
          params.delete("slug");
        });
      }
      return;
    }

    // Support legacy `/phap-ly#slug` deep links from project detail.
    const hash =
      typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    if (hash && scoped.some((p) => p.slug === hash) && requestedSlug !== hash) {
      replaceParams((params) => {
        params.set("slug", hash);
      });
      return;
    }

    if (!requestedSlug || !scoped.some((p) => p.slug === requestedSlug)) {
      const next = scoped[0]!.slug;
      if (requestedSlug !== next) {
        replaceParams((params) => {
          params.set("slug", next);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL from scoped/requested only
  }, [scoped, requestedSlug]);

  function setZoneFilter(next: ProjectNavZoneId | "all") {
    replaceParams((params) => {
      params.delete("slug");
      if (next === "all") {
        params.delete("zone");
        params.delete("nhom");
      } else {
        params.set("zone", next);
        if (next === "nam") {
          if (!parseNamGroupId(params.get("nhom"))) params.set("nhom", "site-a");
        } else {
          params.delete("nhom");
        }
      }
    });
  }

  function setNhomFilter(next: ProjectNamGroupId | "all") {
    replaceParams((params) => {
      params.delete("slug");
      params.set("zone", "nam");
      if (next === "all") params.delete("nhom");
      else params.set("nhom", next);
    });
  }

  function setActiveSlug(slug: string) {
    replaceParams((params) => {
      params.set("slug", slug);
    });
  }

  return (
    <>
      <div
        className="mb-4 flex flex-wrap items-center gap-1.5"
        role="group"
        aria-label={t("legal.zoneLabel")}
      >
        <ScopeChip
          active={zone === null}
          onClick={() => setZoneFilter("all")}
          label={t("legal.allZones")}
        />
        <ScopeChip
          active={zone === "bac"}
          onClick={() => setZoneFilter("bac")}
          label={t("legal.zoneBac")}
        />
        <ScopeChip
          active={zone === "nam"}
          onClick={() => setZoneFilter("nam")}
          label={t("legal.zoneNam")}
        />
        {zone === "nam" ? (
          <>
            <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
            <ScopeChip
              active={nhom === "site-a"}
              onClick={() => setNhomFilter("site-a")}
              label={t("legal.siteA")}
            />
            <ScopeChip
              active={nhom === "outsite"}
              onClick={() => setNhomFilter("outsite")}
              label={t("legal.outsite")}
            />
            <ScopeChip
              active={nhom === null}
              onClick={() => setNhomFilter("all")}
              label={t("legal.allGroups")}
            />
          </>
        ) : null}
      </div>

      {scoped.length === 0 || !activeProject ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">{t("legal.emptyScope")}</p>
        </div>
      ) : (
        <>
          <div
            role="tablist"
            aria-label={t("legal.jumpTo")}
            className="sticky top-14 z-30 mb-6 -mx-4 flex flex-wrap gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6"
          >
            {scoped.map((p) => {
              const selected = p.slug === activeProject.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  data-testid={`legal-project-tab-${p.slug}`}
                  aria-selected={selected}
                  onClick={() => setActiveSlug(p.slug)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {p.displayNameVi}
                </button>
              );
            })}
          </div>

          <section
            id={activeProject.slug}
            data-testid="legal-active-project"
            data-slug={activeProject.slug}
            className="scroll-mt-20 rounded-2xl border border-border bg-card p-5 sm:p-6"
            aria-labelledby={`legal-project-title-${activeProject.slug}`}
          >
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-4">
              <div>
                <h2
                  id={`legal-project-title-${activeProject.slug}`}
                  className="font-display text-xl font-semibold text-foreground"
                >
                  {activeProject.displayNameVi}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{activeProject.region}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {LEGAL_TABLE_ROW_ORDER.length} {t("legal.groupCountUnit")} · {t("legal.updated")}{" "}
                {activeProject.lastVerifiedAt}
              </p>
            </div>
            <LegalDossierTable project={activeProject} />
          </section>
        </>
      )}
    </>
  );
}

export function LegalPageClient({ projects }: { projects: FullProject[] }) {
  const { t } = useLocale();
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">{t("legal.loading")}</p>}>
      <LegalScopedBody projects={projects} />
    </Suspense>
  );
}
