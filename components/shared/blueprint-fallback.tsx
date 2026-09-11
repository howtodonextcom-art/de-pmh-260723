import { cn } from "@/lib/utils";

/**
 * Fallback visual for image slots when no photo exists yet — a subtle
 * architectural/masterplan grid motif instead of a content-free gradient
 * wash, grounded in the real-estate/siting-drawing subject matter this data
 * is sourced from. Shared so every "no photo yet" surface (hero, location
 * map, ...) reads as one deliberate treatment instead of drifting apart.
 */
export function BlueprintFallback({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/8 to-background", className)}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.62 0.072 165) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.072 165) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
