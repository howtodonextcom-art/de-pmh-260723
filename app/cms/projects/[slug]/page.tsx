import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/cms/project-form";
import { getCmsProject } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CmsEditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getCmsProject(slug);
  if (!project) notFound();
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Sửa {project.displayNameVi}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
