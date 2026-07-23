import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";

/** D7 — unitMix table when present, otherwise productTypes chips (SPEC §3.4 D7). */
export function DetailProductLine({ project }: { project: FullProject }) {
  if (project.unitMix?.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.productLine")}</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-3 text-left font-medium">Loại căn</th>
                <th className="p-3 text-right font-medium">Số căn</th>
                <th className="p-3 text-right font-medium">Diện tích</th>
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
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.productLine")}</h2>
        <div className="flex flex-wrap gap-2">
          {project.productTypes.map((t) => (
            <Badge key={t} variant="outline" className="text-sm">
              {t}
            </Badge>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
