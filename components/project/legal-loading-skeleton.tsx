export function LegalLoadingSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <div className="animate-skeleton h-7 w-16 rounded-full" />
        <div className="animate-skeleton h-7 w-20 rounded-full" style={{ opacity: 0.85 }} />
        <div className="animate-skeleton h-7 w-20 rounded-full" style={{ opacity: 0.7 }} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
        <div className="animate-skeleton h-7 w-24 rounded-full" />
        <div className="animate-skeleton h-7 w-28 rounded-full" style={{ opacity: 0.85 }} />
        <div className="animate-skeleton h-7 w-24 rounded-full" style={{ opacity: 0.7 }} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-4 border-b border-border pb-4">
          <div className="animate-skeleton mb-2 h-5 w-40 rounded-md" />
          <div className="animate-skeleton h-3.5 w-24 rounded-md" style={{ opacity: 0.7 }} />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4" style={{ opacity: 1 - i * 0.15 }}>
              <div className="animate-skeleton h-10 w-[28%] shrink-0 rounded-lg" />
              <div className="animate-skeleton h-10 flex-1 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
