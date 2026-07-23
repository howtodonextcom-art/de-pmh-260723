import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { t } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import type { UpdateEntry } from "@/lib/home-content";
import type { Project as FullProject } from "@library/types/project";

export function Updates({ updates, projects }: { updates: UpdateEntry[]; projects: FullProject[] }) {
  if (updates.length === 0) return null;
  const nameBySlug = new Map(projects.map((p) => [p.slug, p.displayNameVi]));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-2xl font-semibold">{t("home.updatesHeading")}</h2>
          <ul className="space-y-4">
            {updates.map((u) => (
              <li key={u.id} className="flex gap-4 border-b border-border pb-3 text-sm">
                <span className="shrink-0 tabular-nums text-amber-700/90 dark:text-amber-400/90">{u.date}</span>
                <span>
                  <Link href={`/du-an/${u.projectSlug}`} className="font-medium hover:underline">
                    {nameBySlug.get(u.projectSlug) ?? u.projectSlug}
                  </Link>{" "}
                  — {u.textVi}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start justify-center gap-4 rounded-2xl bg-muted/40 p-8">
          <p className="text-lg font-semibold">{t("home.quickLookup")}</p>
          <Link href="/so-sanh" className={cn(buttonVariants({ size: "lg" }))}>
            {t("home.ctaCompare")}
          </Link>
          <div className="w-full">
            <p className="mb-2 text-sm text-muted-foreground">{t("home.ctaOfficialSites")}</p>
            <ul className="space-y-1.5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {p.displayNameVi} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
