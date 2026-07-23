import maplibregl from "maplibre-gl";

import type { RegionEmphasisOptions, RegionPin } from "./types";

const DEFAULT_COLOR = "#0F4C3A";

export interface AddRegionMarkersOptions {
  onSelect: (query: string) => void;
  /** Rendered after the count in the marker's aria-label / popup, e.g. "dự án". */
  unitLabel: string;
  color?: string;
}

/**
 * Adds one keyboard-accessible MapLibre Marker per region, with a click +
 * Enter/Space handler calling `onSelect(region.query)`. Returns the created
 * markers so the caller can remove them on unmount.
 */
export function addRegionMarkers(map: maplibregl.Map, regions: RegionPin[], options: AddRegionMarkersOptions): maplibregl.Marker[] {
  const { onSelect, unitLabel, color = DEFAULT_COLOR } = options;

  return regions.map((r) => {
    const marker = new maplibregl.Marker({ color })
      .setLngLat([r.lng, r.lat])
      .setPopup(
        new maplibregl.Popup({ offset: 24, closeButton: false }).setHTML(`<strong>${r.region}</strong><br/>${r.count} ${unitLabel}`),
      )
      .addTo(map);

    const el = marker.getElement();
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `${r.region} — ${r.count} ${unitLabel}`);
    el.style.cursor = "pointer";
    const select = () => onSelect(r.query);
    el.addEventListener("click", select);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    });
    return marker;
  });
}

/**
 * Adds a soft circular "halo" per pin plus an optional GeoJSON AOI fill/line
 * overlay (see `RegionEmphasisOptions.geoJsonUrl`). This is portfolio-level
 * visual emphasis — a handful of pins/polygons — **not** the sa-ban
 * per-lot inventory schema; see `README.md` in this package for the L2 story.
 *
 * The halo is deliberately sized in screen pixels (not geography): at the
 * whole-country zoom needed to fit two distant regions, a geographically
 * accurate AOI polygon shrinks to a few pixels and is not readable — the
 * halo is what actually carries "this region is distinct" at that zoom.
 */
export function addRegionEmphasisLayers(map: maplibregl.Map, regions: RegionPin[], options: RegionEmphasisOptions = {}) {
  const { geoJsonUrl, color = DEFAULT_COLOR } = options;

  map.addSource("portfolio-pins", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: regions.map((r) => ({
        type: "Feature" as const,
        properties: { name: r.region, count: r.count },
        geometry: { type: "Point" as const, coordinates: [r.lng, r.lat] },
      })),
    },
  });

  map.addLayer({
    id: "portfolio-pin-halo",
    type: "circle",
    source: "portfolio-pins",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 34, 8, 46, 11, 58],
      "circle-color": color,
      "circle-opacity": 0.42,
      "circle-blur": 0.4,
    },
  });

  if (!geoJsonUrl) return;

  map.addSource("portfolio-regions", { type: "geojson", data: geoJsonUrl });

  map.addLayer({
    id: "portfolio-region-fill",
    type: "fill",
    source: "portfolio-regions",
    paint: {
      "fill-color": color,
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.15, 8, 0.32, 11, 0.4],
    },
  });

  map.addLayer({
    id: "portfolio-region-outline",
    type: "line",
    source: "portfolio-regions",
    paint: {
      "line-color": color,
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 10, 2.5],
      "line-opacity": 0.85,
    },
  });
}
