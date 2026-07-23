import type { Project as FullProject } from "@library/types/project";

/** D3 — hidden when longDescriptionVi is null (all 4 projects at v1, SPEC §3.4 D3). */
export function DetailStory({ project }: { project: FullProject }) {
  if (!project.longDescriptionVi) return null;

  const paragraphs = project.longDescriptionVi.split("\n\n");
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-[65ch] space-y-4 text-foreground">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "first-letter:float-left first-letter:pr-2 first-letter:text-5xl first-letter:font-bold first-letter:text-primary"
                : ""
            }
          >
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
