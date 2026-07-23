import maplibregl from "maplibre-gl";

import type { CreateMapOptions, RegionPin } from "./types";

export const DEFAULT_STYLE_URL = "https://demotiles.maplibre.org/style.json";

/** Bounds that cover every pin — throws if `regions` is empty (caller's responsibility to guard). */
export function computeBounds(regions: RegionPin[]): maplibregl.LngLatBounds {
  if (regions.length === 0) {
    throw new Error("map-shell: computeBounds requires at least one region");
  }
  return regions.reduce(
    (bounds, r) => bounds.extend([r.lng, r.lat]),
    new maplibregl.LngLatBounds([regions[0].lng, regions[0].lat], [regions[0].lng, regions[0].lat]),
  );
}

/**
 * Thin MapLibre wrapper — style URL, fitBounds, scrollZoom policy, and the
 * standard nav control, in one call. Callers own the container element's
 * sizing/lifecycle (mount/unmount) and any marker/layer decoration.
 *
 * Throws synchronously if the browser can't construct a WebGL context —
 * callers should wrap in try/catch (see `region-map-canvas.tsx`).
 */
export function createMap(options: CreateMapOptions): maplibregl.Map {
  const { container, styleUrl = DEFAULT_STYLE_URL, regions, fitPadding = 64, maxZoom = 8, scrollZoom = false } = options;

  const map = new maplibregl.Map({
    container,
    style: styleUrl,
    ...(regions.length > 0
      ? { bounds: computeBounds(regions), fitBoundsOptions: { padding: fitPadding, maxZoom } }
      : {}),
    scrollZoom,
    // Attribution is on by default when omitted from MapOptions.
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  return map;
}
