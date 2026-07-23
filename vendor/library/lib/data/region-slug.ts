/** Canonical city→slug map used by the /du-an "Khu vực" filter and the H6 map. */
const CITY_SLUG: Record<string, string> = {
  "Bắc Ninh": "bac-ninh",
  "TP.HCM": "tp-hcm",
};

export function citySlug(city: string): string {
  return CITY_SLUG[city] ?? city.toLowerCase().replace(/\s+/g, "-");
}
