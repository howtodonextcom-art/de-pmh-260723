export function CompareTableSkeleton() {
  return (
    <div className="space-y-3 py-8" aria-hidden="true">
      <div className="animate-skeleton h-8 w-full rounded-lg" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-skeleton h-14 w-full rounded-lg"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}
