export interface FlipbookAsset {
  id: string;
  src: string;
  label: string;
  fitMode?: "contain" | "cover";
  letterboxColor?: string;
  naturalWidth?: number;
  naturalHeight?: number;
  category?: string;
}
