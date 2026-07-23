import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { t } from "@/lib/i18n/t";
import type { LegalDossierKey, Project as FullProject } from "@library/types/project";

const DOSSIER_KEYS: LegalDossierKey[] = [
  "investmentApproval",
  "landAllocation",
  "detailedPlanning",
  "constructionPermits",
  "salesEligibility",
  "mainContractor",
  "disputes",
];

export function LegalTeaser({ projects }: { projects: FullProject[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold">{t("home.legalHeading")}</h2>
        <Link href="/phap-ly" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {t("nav.phapLy")} <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <Reveal className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {projects.map((p) => {
          const published = DOSSIER_KEYS.filter((k) => p.legalDossier[k]).length;
          const noDispute = !p.legalDossier.disputes || /không/i.test(p.legalDossier.disputes);
          return (
            <Link key={p.slug} href={`/du-an/${p.slug}#phap-ly`}>
              <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 motion-reduce:hover:translate-y-0">
                <p className="text-sm font-semibold">{p.displayNameVi}</p>
                <p className="text-xs text-muted-foreground">
                  7 nhóm hồ sơ · {published} văn bản đã công bố
                </p>
                {noDispute && (
                  <span className="mt-2 inline-block w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Không ghi nhận tranh chấp
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </Reveal>
    </section>
  );
}
