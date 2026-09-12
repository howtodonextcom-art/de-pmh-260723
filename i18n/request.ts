import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import en from "@/lib/i18n/en.json";
import vi from "@/lib/i18n/vi.json";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

type MessageTree = { [key: string]: string | string[] | MessageTree };

function isPlainObject(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Recursively overlays `override` onto `base`, keeping `base` for any key
 *  missing in `override`. Used so a translation missing from en.json falls
 *  back to its Vietnamese string instead of next-intl's default (render the
 *  raw key path) — matching the previous useLocale().t() behaviour. Arrays
 *  are treated as atomic values, not merged element-by-element —
 *  `{...anArray}` would silently turn one into a `{0: ..., 1: ...}` object
 *  and break any `t.raw()` caller expecting `.map()`. */
function deepMerge(base: MessageTree, override: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = base[key];
    result[key] =
      isPlainObject(overrideValue) && isPlainObject(baseValue)
        ? deepMerge(baseValue, overrideValue)
        : overrideValue;
  }
  return result;
}

const MESSAGES: Record<Locale, MessageTree> = {
  vi,
  en: deepMerge(vi, en),
};

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale: Locale = store.get(LOCALE_COOKIE)?.value === "en" ? "en" : "vi";
  return {
    locale,
    messages: MESSAGES[locale],
  };
});
