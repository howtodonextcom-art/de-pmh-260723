import { validateGeoJsonContract, type GeoJsonContractKind } from "./geojson-contract";

/**
 * Fetches + validates a GeoJSON file against the data contract (see
 * DATA_CONTRACT_GEOJSON.md). Fails soft: never throws on invalid/missing
 * data — returns `null` so callers can render a "no data" state instead of
 * crashing. In development, validation errors are logged via `console.warn`
 * to surface authoring mistakes early; production stays silent to end users.
 *
 * Not called anywhere in the app today — `region-map-canvas.tsx` still lets
 * MapLibre fetch its GeoJSON source directly (unchanged Wave-2 behavior).
 * This is a ready-to-use stub for the `project-site` tier once that data
 * exists.
 */
export async function loadGeoJson<T = unknown>(url: string, kind: GeoJsonContractKind): Promise<T | null> {
  let data: unknown;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`loadGeoJson: ${url} responded ${res.status}`);
      }
      return null;
    }
    data = await res.json();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`loadGeoJson: failed to fetch/parse ${url}`, err);
    }
    return null;
  }

  const result = validateGeoJsonContract(data, kind);
  if (!result.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`loadGeoJson: ${url} failed the "${kind}" data contract`, result.errors);
    }
    return null;
  }

  return data as T;
}
