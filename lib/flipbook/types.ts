export interface FlipbookAsset {
  id: string;
  src: string;
  label: string;
  fitMode?: "contain" | "cover";
  letterboxColor?: string;
}

export const PAGE_ASPECT_RATIO = 923 / 1176;
