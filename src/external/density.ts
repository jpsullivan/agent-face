// Boundary: shared-frame `$i`, `EY`, `NY`. UI density setting and icon size scale.
export type Density = "comfortable" | "compact";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export const ICON_SIZES: Record<IconSize, { px: number }> = {
  xs: { px: 12 },
  sm: { px: 16 },
  md: { px: 20 },
  lg: { px: 24 },
  xl: { px: 32 },
};

export function useDensity(): Density {
  throw new Error("external: shared-frame $i");
}

/** Root font size in px (16 by default); icon sizes scale with it. */
export function useRootFontSize(): number {
  throw new Error("external: shared-frame EY");
}
