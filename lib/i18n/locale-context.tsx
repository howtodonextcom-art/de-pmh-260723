"use client";

import * as React from "react";

import en from "./en.json";
import vi from "./vi.json";
import type { Messages } from "./t";

export type Locale = "vi" | "en";

const MESSAGES: Record<Locale, Messages> = { vi, en };
const STORAGE_KEY = "ded-pmh-locale";
const DEFAULT_LOCALE: Locale = "vi";

function getByPath(messages: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in node) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
}

function interpolate(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Dot-path lookup against the active locale's messages, falling back to `vi` if missing in `en`. */
  t: (path: string, vars?: Record<string, string | number>) => string;
  messages: Messages;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

/**
 * Client-only locale switch, modeled on `next-themes`: renders `vi` (the
 * default, matching SSR output) on first paint, then syncs from
 * `localStorage` in an effect — no hydration mismatch, no cookie/route
 * plumbing. Only components that opt in via `useLocale()` are reactive; the
 * rest of the app still reads the static `vi.json` via `t()` in
 * `lib/i18n/t.ts` and stays Vietnamese-only. See `docs/I18N_EN.md` for which
 * sections are covered.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== "vi" && stored !== "en") return;
    // Defer past the synchronous effect body — mirrors the pattern used for
    // the map's WebGL-failure fallback in region-map-canvas.tsx.
    queueMicrotask(() => setLocaleState(stored));
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const messages = MESSAGES[locale];

  const t = React.useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const value = getByPath(messages, path) ?? getByPath(MESSAGES.vi, path);
      if (typeof value !== "string") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`useLocale().t: missing or non-string key "${path}"`);
        }
        return path;
      }
      return interpolate(value, vars);
    },
    [messages],
  );

  const value = React.useMemo(() => ({ locale, setLocale, t, messages }), [locale, setLocale, t, messages]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
