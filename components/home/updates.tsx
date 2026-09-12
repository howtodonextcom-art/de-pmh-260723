import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { localizedDisplayName } from "@/lib/i18n/project-copy";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import type { UpdateEntry } from "@/lib/home-content";
import type { Project as FullProject } from "@library/types/project";

async function OfficialSitesList({
  projects,
  columns,
}: {
  projects: FullProject[];
  columns: "sidebar" | "band";
}) {
  if (projects.length === 0) return null;
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="w-full min-w-0">
      <p className="mb-3 text-sm text-muted-foreground">{t("home.ctaOfficialSites")}</p>
      <ul
        className={cn(
          "gap-x-6 gap-y-2",
          columns === "band" ? "grid sm:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1",
        )}
      >
        {projects.map((p) => (
          <li key={p.slug} className="min-w-0">
            <a
              href={p.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <span className="truncate">{localizedDisplayName(p, locale)}</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" aria-hidden />
              <span className="sr-only">{t("home.opensInNewTab")}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function LookupPanel({
  projects,
  asPrimary,
  showEmptyNote,
}: {
  projects: FullProject[];
  asPrimary: boolean;
  showEmptyNote: boolean;
}) {
  const HeadingTag = asPrimary ? "h2" : "h3";
  const t = await getTranslations();

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div
        className={cn(
          "flex flex-col gap-4",
          asPrimary && "sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        )}
      >
        <div className="min-w-0 space-y-2">
          <HeadingTag
            className={cn("font-display font-semibold", asPrimary ? "text-2xl" : "text-lg")}
          >
            {t("home.quickLookup")}
          </HeadingTag>
          {showEmptyNote ? (
            <p className="text-sm text-muted-foreground">{t("home.emptyUpdates")}</p>
          ) : null}
        </div>

        <Link
          href="/so-sanh"
          className={cn(
            buttonVariants({ size: asPrimary ? "lg" : "default" }),
            "w-fit shrink-0 gap-2",
          )}
        >
          {t("home.ctaCompare")}
          <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
      </div>

      <OfficialSitesList projects={projects} columns={asPrimary ? "band" : "sidebar"} />
    </div>
  );
}

export async function Updates({ updates, projects }: { updates: UpdateEntry[]; projects: FullProject[] }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const nameBySlug = new Map(projects.map((p) => [p.slug, localizedDisplayName(p, locale)]));
  const officialProjects = projects.filter((p) => Boolean(p.officialUrl?.trim()));
  const hasUpdates = updates.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <Reveal>
        {hasUpdates ? (
          <div className="grid items-start gap-8 md:grid-cols-5 md:gap-10">
            <div className="min-w-0 md:col-span-3">
              <h2 className="mb-6 font-display text-2xl font-semibold">{t("home.updatesHeading")}</h2>
              <ul>
                {updates.map((u) => (
                  <li
                    key={u.id}
                    className="flex flex-col gap-1 border-b border-border py-3 text-sm first:pt-0 last:border-b-0 sm:flex-row sm:gap-4"
                  >
                    <time className="shrink-0 tabular-nums text-muted-foreground">{u.date}</time>
                    <div className="min-w-0 space-y-0.5">
                      <Link
                        href={`/du-an/${u.projectSlug}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {nameBySlug.get(u.projectSlug) ?? u.projectSlug}
                      </Link>
                      <p className="text-muted-foreground">{u.textVi}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 md:col-span-2">
              <LookupPanel projects={officialProjects} asPrimary={false} showEmptyNote={false} />
            </div>
          </div>
        ) : (
          <LookupPanel projects={officialProjects} asPrimary showEmptyNote />
        )}
      </Reveal>
    </section>
  );
}
