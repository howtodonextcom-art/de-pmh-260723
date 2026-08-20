"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * F16 — shared "mutate current query string, then `router.replace` back onto `pathname`"
 * pattern duplicated across `/so-sanh`, `/phap-ly` and `/du-an` client components.
 *
 * `mutate` receives a fresh `URLSearchParams` seeded from the current query string;
 * mutate it in place (set/delete keys) and the hook replaces the URL with the result,
 * omitting the `?` entirely when the query string ends up empty. Navigation uses
 * `{ scroll: false }` so filter/scope changes never jump the page back to the top.
 */
export function useReplaceSearchParams(pathname: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  return { searchParams, replaceParams };
}
