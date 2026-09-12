import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import type { Project as FullProject } from "@library/types/project";

/** D7 — unitMix table when present, otherwise productTypes chips (SPEC §3.4 D7). */
export async function DetailProductLine({ project }: { project: FullProject }) {
  const t = await getTranslations();
  if (project.unitMix?.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.productLine")}</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-3 text-left font-medium">{t("detail.unitType")}</th>
                <th className="p-3 text-right font-medium">{t("detail.unitCount")}</th>
                <th className="p-3 text-right font-medium">{t("detail.unitArea")}</th>
              </tr>
            </thead>
            <tbody>
              {project.unitMix.map((row) => (
                <tr key={row.type} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-foreground">{row.type}</td>
                  <td className="p-3 text-right tabular-nums text-foreground">{row.count}</td>
                  <td className="p-3 text-right tabular-nums text-foreground">{row.areaRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if ((project.productTypes ?? []).length > 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.productLine")}</h2>
        <div className="flex flex-wrap gap-2">
          {project.productTypes.map((type) => (
            <Badge key={type} variant="outline" className="text-sm">
              {type}
            </Badge>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
