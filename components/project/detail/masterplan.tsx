import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/** D5 — Hồng Hạc City only, gated on subdivisions.length > 0 (SPEC §3.4 D5). */
export function DetailMasterplan({
  project,
  masterplanAsset,
}: {
  project: FullProject;
  masterplanAsset?: V0ImageAsset | null;
}) {
  if (!project.subdivisions || project.subdivisions.length === 0) return null;

  const detailed = project.subdivisions.find((s) => s.startsWith("Hồng Phát"));
  const imageUrl = masterplanAsset ? (masterplanAsset.resolvedUrl ?? masterplanAsset.sourceFileUrl) : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.masterplan")}</h2>
      <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-muted">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={masterplanAsset?.alt ?? "Masterplan"}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
        )}
      </div>
      <Tabs defaultValue={project.subdivisions[0]}>
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList>
            {project.subdivisions.map((s) => (
              <TabsTrigger key={s} value={s} className="max-w-48 shrink-0 truncate">
                {s.split(" (")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {project.subdivisions.map((s) => (
          <TabsContent key={s} value={s} className="pt-4">
            {s === detailed ? (
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <Stat label="Sản phẩm" value="397" />
                <Stat label="Shophouse" value="78" />
                <Stat label="Nhà phố liền kề" value="169" />
                <Stat label="Song lập / đơn lập" value="110 / 40" />
              </div>
            ) : (
              <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Chưa công bố chi tiết
              </span>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3 text-center">
      <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
