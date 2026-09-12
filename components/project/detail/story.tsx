import { getLocale } from "next-intl/server";

import { localizedLongDescription } from "@/lib/i18n/project-copy";
import type { Project as FullProject } from "@library/types/project";

/** D3 — hidden when no localized (or fallback) long description exists. */
export async function DetailStory({ project }: { project: FullProject }) {
  const locale = await getLocale();
  const body = localizedLongDescription(project, locale);
  if (!body) return null;

  const paragraphs = body.split("\n\n");
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
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
