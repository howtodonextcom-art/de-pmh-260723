/**
 * F22 — chapter divider between major detail-page sections (hero / stats /
 * masterplan / gallery / legal / related), so the long scroll reads as
 * distinct editorial "chapters" instead of one continuous dense stack.
 * Hidden in print (the print layout already skips most of these sections).
 */
export function SectionDivider() {
  return (
    <div className="print:hidden" role="presentation" aria-hidden="true">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-t border-border" />
      </div>
    </div>
  );
}
