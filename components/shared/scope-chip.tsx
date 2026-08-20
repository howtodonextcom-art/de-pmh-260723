"use client";

import { cn } from "@/lib/utils";

/**
 * Shared zone/group scope pill used by the compare table and legal page
 * scope filters (F11 — extracted from duplicated inline markup).
 */
export function ScopeChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
