"use client";

import { ExternalLinkIcon, FileDownIcon } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { exportFactSheetPdf } from "@/components/project/detail/pdf-export-trigger";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";

/** D13 — thin "sources" accordion, can stay collapsed by default. */
export function DetailSources({ project }: { project: FullProject }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Accordion defaultValue={["sources"]}>
        <AccordionItem value="sources">
          <AccordionTrigger className="text-lg font-semibold">
            {t("sources.heading")}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3 text-sm">
              {(project.sources ?? []).map((s) => (
                <li key={s.sourceId} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{s.sourceDomain}</span>
                  <span className="text-muted-foreground">
                    — {t("sources.appliesTo")}: {s.field}
                  </span>
                  <span className="text-muted-foreground">
                    · {t("sources.accessedAt")} {s.accessedAt}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("sources.lastVerified")}: <span className="tabular-nums">{project.lastVerifiedAt}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Real navigation links styled as buttons — not routed through Base UI's
                  interactive Button primitive, which assumes a native <button> tag. */}
              <Link href={`/phap-ly#${project.slug}`} className={cn(buttonVariants({ variant: "outline" }))}>
                {t("sources.viewFullLegal")}
              </Link>
              {project.officialUrl && (
                <a
                  href={project.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  {t("sources.viewOfficialSite")} <ExternalLinkIcon className="size-4" />
                </a>
              )}
              <Button variant="outline" className="print:hidden" onClick={() => exportFactSheetPdf(project.slug)}>
                {t("sources.exportPdf")} <FileDownIcon className="size-4" />
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
