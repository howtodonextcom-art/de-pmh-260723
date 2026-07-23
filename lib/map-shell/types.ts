/** A single filterable region/marker on the map — portfolio-level, not a sa-ban lot. */
export interface RegionPin {
  /** Human-readable region name (e.g. "Bắc Ninh"). */
  region: string;
  /** Count of items in this region (e.g. project count) — display only. */
  count: number;
  lng: number;
  lat: number;
  /**
   * Opaque filter payload the host app applies on select — e.g. a URL query
   * string fragment (`"khu-vuc=bac-ninh"`). map-shell does not interpret it;
   * this is intentionally NOT a sa-ban lot-filter schema.
   */
  query: string;
}

export interface RegionEmphasisOptions {
  /** URL to a GeoJSON FeatureCollection of approximate region AOI polygons (optional). */
  geoJsonUrl?: string;
  /** Brand fill/halo color (hex). */
  color?: string;
}

export interface CreateMapOptions {
  container: HTMLElement;
  /** Defaults to MapLibre's free, tokenless demotiles style. */
  styleUrl?: string;
  regions: RegionPin[];
  /** Padding (px) around the fitted bounds. */
  fitPadding?: number;
  /** Cap zoom so two close pins don't over-zoom. */
  maxZoom?: number;
  /**
   * Disable mouse-wheel zoom so the map doesn't trap page scroll — the
   * documented, correct MapLibre option for an inline homepage map.
   */
  scrollZoom?: boolean;
}
