import { NewProjectForm } from "@/components/cms/new-project-form";

export const dynamic = "force-dynamic";

export default function CmsNewProjectPage() {
  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-2xl">Tạo dự án</h1>
      <NewProjectForm />
    </div>
  );
}
