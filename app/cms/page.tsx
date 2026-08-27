import Link from "next/link";

import { loadCatalog } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CmsDashboardPage() {
  const { projects, source } = await loadCatalog();

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Dự án</h1>
          <p className="text-sm text-muted-foreground">
            Nguồn: {source} · {projects.length} dự án
          </p>
        </div>
        <Link href="/cms/projects/new" className={cn(buttonVariants())}>
          Tạo dự án
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
          Chưa có dự án. Tạo mới để nhập thông tin và ảnh khớp trang chi tiết.
        </p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/cms/projects/${project.slug}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/40"
              >
                <span>
                  <span className="font-medium">{project.displayNameVi}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{project.slug}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {project.navZone ?? "—"} {project.namGroup ? `/ ${project.namGroup}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
