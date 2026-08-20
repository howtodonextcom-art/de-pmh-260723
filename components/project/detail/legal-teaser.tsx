import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { LegalDossierTable } from "@/components/project/legal-dossier-table";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";

/**
 * D10 — legal dossier teaser (reuses the full LegalDossierTable) + link to
 * /phap-ly#slug. F22: the full dossier table is heavy (one row per legal
 * document group), so it now sits inside an accordion that is collapsed by
 * default — the reader sees the chapter heading + CTA first, and opts into
 * the dense table instead of it dumping into the initial scroll.
 */
export function DetailLegalTeaser({ project }: { project: FullProject }) {
  return (
    <section id="phap-ly" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">{t("detail.legalDossier")}</h2>
        {/* Real navigation link styled as a button — not routed through Base UI's
            interactive Button primitive, which assumes a native <button> tag. */}
        <Link
          href={`/phap-ly#${project.slug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Xem đầy đủ
        </Link>
      </div>
      <Accordion>
        <AccordionItem value="legal-dossier">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            {t("detail.legalDossier")} — xem hồ sơ pháp lý chi tiết
          </AccordionTrigger>
          <AccordionContent>
            <LegalDossierTable project={project} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
