import { getTranslations } from "next-intl/server";

import { canShowConceptArchitect } from "@library/lib/data/architect-visibility";
import type { Project as FullProject } from "@library/types/project";

/** D6 — architect card (gated by canShowConceptArchitect) + partner cards. */
export async function DetailArchitecturePartners({ project }: { project: FullProject }) {
  const showArchitect = canShowConceptArchitect(project);
  const partners = project.partners ?? [];
  if (!showArchitect && partners.length === 0) return null;

  const t = await getTranslations();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.architecturePartners")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {showArchitect && project.conceptArchitect?.value && (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{t("detail.architectUnit")}</p>
            <p className="mt-1 font-semibold text-foreground">{project.conceptArchitect.value}</p>
          </div>
        )}
        {partners.map((partner) => (
          <div key={partner} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{t("detail.deliveryPartner")}</p>
            <p className="mt-1 font-semibold text-foreground">{partner}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
