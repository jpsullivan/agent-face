// Hex palettes for task tiles, keyed by line tint. Fills are the pale tile
// background; inks are the glyph color, darker in light mode for contrast.
import { lineTintForAiboTint, type AiboTint, type LineTint } from "@/look/aibo-look";

const TILE_FILL: Record<LineTint, string> = {
  fig: "#C46686",
  coral: "#EBCCCC",
  peach: "#EBC9B7",
  clay: "#D97757",
  pencil: "#F0AC54",
  matcha: "#CED6BF",
  mineral: "#629987",
  cloud: "#C5D3E0",
  sky: "#6A9BCC",
  heather: "#CBCADB",
};

const TILE_INK_LIGHT: Record<LineTint, string> = {
  fig: "#C46686",
  coral: "#B1797A",
  peach: "#AD7D64",
  clay: "#CE6D4D",
  pencil: "#BB7A14",
  matcha: "#7E8D5E",
  mineral: "#579380",
  cloud: "#6A8BA9",
  sky: "#5B8BBB",
  heather: "#8784AB",
};

const TILE_INK_DARK: Record<LineTint, string> = {
  fig: "#C46686",
  coral: "#F4B0B1",
  peach: "#EFB596",
  clay: "#D97757",
  pencil: "#F0AC54",
  matcha: "#BACD93",
  mineral: "#629987",
  cloud: "#A5C9E9",
  sky: "#6A9BCC",
  heather: "#C2BFE9",
};

/** Tints offered when picking a task color, in picker order. */
export const TASK_TINTS: readonly AiboTint[] = [
  "rose",
  "clover",
  "jade",
  "clay",
  "ochre",
  "cactus",
  "mineral",
  "plum",
  "cornflower",
  "heather",
];

export function tileFillHex(tint: AiboTint): string {
  return TILE_FILL[lineTintForAiboTint(tint)];
}

export function tileInkHex(tint: AiboTint, isDark: boolean): string {
  return (isDark ? TILE_INK_DARK : TILE_INK_LIGHT)[lineTintForAiboTint(tint)];
}
