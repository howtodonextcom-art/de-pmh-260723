import { PROJECT_STATUS_LABELS, projectStatusLabel, type CopyLocale } from "../../lib/i18n-copy";

/** VI-only map kept for CMS / snapshots that have not been locale-threaded. */
export const PROJECT_STATUS_LABEL: Record<string, string> = PROJECT_STATUS_LABELS.vi;

export { PROJECT_STATUS_LABELS, projectStatusLabel };
export type { CopyLocale };
