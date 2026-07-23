import type { FieldStatus } from "@library/types/project";

/** See v0/docs/DATA_CONTRACT_GEOJSON.md §1 — the two data tiers. */
export type GeoJsonContractKind = "region-aoi" | "project-site";

const FIELD_STATUS_VALUES: FieldStatus[] = ["da-co-du-lieu", "chua-xac-thuc", "mau-thuan", "chua-co-du-lieu", "bao-mat"];

export interface ContractValidationResult {
  valid: boolean;
  errors: string[];
}

function isFeatureCollection(data: unknown): data is { type: "FeatureCollection"; features: unknown[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type === "FeatureCollection" &&
    Array.isArray((data as { features?: unknown }).features)
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validates against the `region-aoi` tier: each feature needs `id` + `name` string properties. */
export function validateRegionAoiCollection(data: unknown): ContractValidationResult {
  const errors: string[] = [];
  if (!isFeatureCollection(data)) {
    return { valid: false, errors: ["not a GeoJSON FeatureCollection"] };
  }

  data.features.forEach((feature, i) => {
    if (!isPlainObject(feature) || !isPlainObject(feature.properties)) {
      errors.push(`feature[${i}]: missing properties object`);
      return;
    }
    const props = feature.properties;
    if (typeof props.id !== "string" || props.id.length === 0) {
      errors.push(`feature[${i}]: properties.id must be a non-empty string`);
    }
    if (typeof props.name !== "string" || props.name.length === 0) {
      errors.push(`feature[${i}]: properties.name must be a non-empty string`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates against the `project-site` tier: each feature needs `id`,
 * `projectSlug`, `name`, and a `status` drawn from `FieldStatus`. No file in
 * the repo uses this tier yet — this exists ahead of need per the data
 * contract's future-facing spec (§1 of DATA_CONTRACT_GEOJSON.md). Does NOT
 * check `projectSlug` against the live project list — that requires the data
 * layer, out of scope for a pure-geometry validator.
 */
export function validateProjectSiteCollection(data: unknown): ContractValidationResult {
  const errors: string[] = [];
  if (!isFeatureCollection(data)) {
    return { valid: false, errors: ["not a GeoJSON FeatureCollection"] };
  }

  data.features.forEach((feature, i) => {
    if (!isPlainObject(feature) || !isPlainObject(feature.properties)) {
      errors.push(`feature[${i}]: missing properties object`);
      return;
    }
    const props = feature.properties;
    if (typeof props.id !== "string" || props.id.length === 0) {
      errors.push(`feature[${i}]: properties.id must be a non-empty string`);
    }
    if (typeof props.projectSlug !== "string" || props.projectSlug.length === 0) {
      errors.push(`feature[${i}]: properties.projectSlug must be a non-empty string`);
    }
    if (typeof props.name !== "string" || props.name.length === 0) {
      errors.push(`feature[${i}]: properties.name must be a non-empty string`);
    }
    if (typeof props.status !== "string" || !FIELD_STATUS_VALUES.includes(props.status as FieldStatus)) {
      errors.push(`feature[${i}]: properties.status must be one of ${FIELD_STATUS_VALUES.join(", ")}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateGeoJsonContract(data: unknown, kind: GeoJsonContractKind): ContractValidationResult {
  return kind === "region-aoi" ? validateRegionAoiCollection(data) : validateProjectSiteCollection(data);
}
