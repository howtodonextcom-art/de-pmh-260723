import { cn } from "@/lib/utils"
import type { FieldStatus } from "@library/types/project"

/** SPEC §0 — 5 design-token status labels, shared across the site. */
export const STATUS_LABEL: Record<FieldStatus, string> = {
  "da-co-du-lieu": "Đã có dữ liệu",
  "chua-xac-thuc": "Chưa xác thực",
  "mau-thuan": "Mâu thuẫn",
  "chua-co-du-lieu": "Chưa có dữ liệu",
  "bao-mat": "Bảo mật",
}

const STATUS_CLASS: Record<FieldStatus, string> = {
  "da-co-du-lieu": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "chua-xac-thuc": "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "mau-thuan": "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  "chua-co-du-lieu": "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  "bao-mat": "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
}

export function StatusBadge({
  status,
  className,
}: {
  status: FieldStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_CLASS[status],
        className
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

const STATUS_DOT_CLASS: Record<FieldStatus, string> = {
  "da-co-du-lieu": "bg-emerald-500",
  "chua-xac-thuc": "bg-amber-500",
  "mau-thuan": "bg-red-500",
  "chua-co-du-lieu": "bg-zinc-400",
  "bao-mat": "bg-violet-500",
}

/** Compact status indicator for card summaries (SPEC §3.3 card anatomy). */
export function StatusDot({ status }: { status: FieldStatus }) {
  return (
    <span
      aria-label={STATUS_LABEL[status]}
      title={STATUS_LABEL[status]}
      className={cn("inline-block size-2 rounded-full", STATUS_DOT_CLASS[status])}
    />
  )
}
