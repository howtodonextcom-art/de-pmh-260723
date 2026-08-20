/**
 * F04 — beforeInteractive theme flash prevention.
 *
 * Mirrors next-themes' own resolution logic (see `ThemeProvider` in
 * `app/layout.tsx`: `attribute="class"`, no custom `storageKey` → default
 * localStorage key is `"theme"`) so the `.dark` class is applied before
 * first paint, before React/next-themes hydrates.
 *
 * Verified against node_modules/next-themes/dist/index.js:
 * - storage key: `"theme"` (default; no `storageKey` prop is set)
 * - system-preference query: `(prefers-color-scheme: dark)` — next-themes
 *   checks `dark`, not `light`, so we match that direction here to avoid
 *   inverting the resolved theme on `no-preference`/unsupported browsers.
 */
export const themeInitScript = `(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch(e) {}
})();`;
