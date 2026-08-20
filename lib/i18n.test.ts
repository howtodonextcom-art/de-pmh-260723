import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

import { describe, expect, it } from "vitest";

/**
 * F21 — i18n parity test. Reads the raw locale JSON files directly (not `lib/i18n/t.ts`)
 * so this test stays independent of any in-flight changes to the `t()` helper.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viPath = path.join(__dirname, "i18n", "vi.json");
const enPath = path.join(__dirname, "i18n", "en.json");

const vi = JSON.parse(fs.readFileSync(viPath, "utf8"));
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Recursively collect dot-joined leaf key paths from a nested JSON object. */
function collectKeys(obj: JsonValue, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return [prefix];
  }
  return Object.keys(obj).flatMap((key) =>
    collectKeys(obj[key], prefix ? `${prefix}.${key}` : key)
  );
}

/** Collect [keyPath, value] pairs for every leaf (non-object) value. */
function collectLeaves(obj: JsonValue, prefix = ""): Array<[string, JsonValue]> {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return [[prefix, obj]];
  }
  return Object.keys(obj).flatMap((key) =>
    collectLeaves(obj[key], prefix ? `${prefix}.${key}` : key)
  );
}

describe("i18n locale parity (vi.json <-> en.json)", () => {
  it("both locale files parse as non-empty objects", () => {
    expect(typeof vi).toBe("object");
    expect(typeof en).toBe("object");
    expect(Object.keys(vi).length).toBeGreaterThan(0);
    expect(Object.keys(en).length).toBeGreaterThan(0);
  });

  it("vi.json and en.json have the exact same set of (nested) keys", () => {
    const viKeys = collectKeys(vi).sort();
    const enKeys = collectKeys(en).sort();

    const missingInEn = viKeys.filter((k) => !enKeys.includes(k));
    const missingInVi = enKeys.filter((k) => !viKeys.includes(k));

    expect(missingInEn, `keys present in vi.json but missing in en.json: ${missingInEn.join(", ")}`).toEqual([]);
    expect(missingInVi, `keys present in en.json but missing in vi.json: ${missingInVi.join(", ")}`).toEqual([]);
    expect(viKeys).toEqual(enKeys);
  });

  it("no leaf value is an empty string in vi.json", () => {
    const empties = collectLeaves(vi)
      .filter(([, value]) => typeof value === "string" && value.trim() === "")
      .map(([key]) => key);
    expect(empties, `empty string values in vi.json: ${empties.join(", ")}`).toEqual([]);
  });

  it("no leaf value is an empty string in en.json", () => {
    const empties = collectLeaves(en)
      .filter(([, value]) => typeof value === "string" && value.trim() === "")
      .map(([key]) => key);
    expect(empties, `empty string values in en.json: ${empties.join(", ")}`).toEqual([]);
  });
});
