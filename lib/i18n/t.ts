import vi from "./vi.json";

type Messages = typeof vi;

/** Minimal i18n scaffold — single locale (vi) today, dot-path lookup for future locale swap. */
export function t(path: string): string {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = vi;
  for (const part of parts) {
    node = node?.[part];
  }
  if (typeof node !== "string") {
    throw new Error(`i18n: missing or non-string key "${path}"`);
  }
  return node;
}

export { vi };
export type { Messages };
