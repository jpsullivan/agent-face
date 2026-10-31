export { ICON_SIZES, type Density, type IconSize } from "../../src/external/density";
import type { Density } from "../../src/external/density";

export function useDensity(): Density {
  return "comfortable";
}

export function useRootFontSize(): number {
  return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}
