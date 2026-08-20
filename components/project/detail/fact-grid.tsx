import { StatusBadge } from "@/components/shared/status-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buildFactGrid } from "@library/lib/data/fact-grid";
import type { Project as FullProject } from "@library/types/project";

/** D2 — 8-cell fact grid, GFA intentionally excluded (SPEC §3.4 D2). */
export function DetailFactGrid({ project }: { project: FullProject }) {
  const cells = buildFactGrid(project);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{cell.label}</p>
            <Tooltip>
              <TooltipTrigger render={<p className="mt-1 cursor-help text-sm font-medium text-foreground" />}>
                {cell.value}
              </TooltipTrigger>
              <TooltipContent>{cell.tooltip ?? `Cập nhật ${project.lastVerifiedAt}`}</TooltipContent>
            </Tooltip>
            <div className="mt-2">
              <StatusBadge status={cell.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
