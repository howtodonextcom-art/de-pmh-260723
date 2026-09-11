import { Reveal } from "@/components/shared/reveal";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";

/**
 * D11 — always has data across all 4 projects; highest-trust block of the page.
 * The one deliberate scroll-reveal moment on the detail page (see reveal.tsx) —
 * everything else stays static so this block reads as the page's single point
 * of emphasis instead of motion being scattered across every section.
 */
export function DetailSalesStatus({ project }: { project: FullProject }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-accent/40 p-6 sm:p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("detail.salesStatus")}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đủ điều kiện bán</p>
              <p className="mt-1 text-sm text-foreground">
                {project.legalDossier?.salesEligibility ?? "Chưa có"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tình trạng thi công</p>
              <p className="mt-1 text-sm text-foreground">{project.statusNote ?? "Chưa có"}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
