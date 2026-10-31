// Clay tile pressing and glaze: picks the clay blank for a glyph, a stable
// per-task seed, and packs the first 40 floats of the WebGL renderer's
// parameter block.
import { hexToRgb } from "@/face/face-codes";
import { TASK_GLYPHS, type TileGlyph } from "@/tokens/task-look";

export type Rgb = readonly [number, number, number];

/** "resting" has a faint sheen; "dry" is the matte, chalky look. */
export type ClayState = "resting" | "dry" | (string & {});

/** Index of the pre-shaped clay blank a glyph is pressed into. */
export type ClayBlank = number;

export interface ClayPressing {
  blank: ClayBlank;
  state: ClayState;
  seed: number;
}

export interface ClayGlaze {
  pigment: Rgb;
  dark: boolean;
}

/** The clay canvas spills past a 28px tile to 62px. */
const DEFAULT_OVERSCAN = 62 / 28;
const ROD_TRIM: Rgb = [0.961, 0.91, 0.808];
const WAFER: Rgb = [0.851, 0.467, 0.341];
const DRY_SLIP: Rgb = [0.851, 0.824, 0.769];
const BACKDROP = { light: hexToRgb("#f9f9f7"), dark: hexToRgb("#0b0b0b") };

/** Pigment for neutral (grey) tiles. */
export const NEUTRAL_CLAY_PIGMENT: Record<"light" | "dark", Rgb> = {
  light: DRY_SLIP,
  dark: hexToRgb("#6d6b67"),
};

/** Grows `size` by `overscan`, keeping the growth even so the tile stays centred. Never below 8. */
export function clayCanvasSize(size: number, overscan: number): number {
  return Math.max(8, size + 2 * Math.round((size * (overscan - 1)) / 2));
}

function defaultCanvasSize(seat: number): number {
  return clayCanvasSize(seat, DEFAULT_OVERSCAN);
}

/** Dry clay mixes 38% toward the pale slip colour. */
export function clayShadeFor(pigment: Rgb, state: ClayState): Rgb {
  if (state !== "dry") return pigment;
  const mix = 0.38;
  return [
    pigment[0] + (DRY_SLIP[0] - pigment[0]) * mix,
    pigment[1] + (DRY_SLIP[1] - pigment[1]) * mix,
    pigment[2] + (DRY_SLIP[2] - pigment[2]) * mix,
  ];
}

const CLAWD_BLANK = 15;
const CODE_BLANK = 16;

export function clayBlankForGlyph(glyph: TileGlyph): ClayBlank {
  if (glyph === "clawd") return CLAWD_BLANK;
  if (glyph === "code") return CODE_BLANK;
  return TASK_GLYPHS.indexOf(glyph);
}

/** FNV-1a of "glyph:<glyph>:<taskId>", folded to one of 53 seeds in [0, 10.4]. */
export function claySeedFor(taskId: string, glyph: TileGlyph): number {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(`glyph:${glyph}:${taskId}`)) {
    hash = Math.imul(hash ^ byte, 16777619) >>> 0;
  }
  return (hash % 53) / 5;
}

const PRESSING_BYTES = 160;

/**
 * Packs the pressing/glaze half (floats 0-39) of the face renderer's `Token`
 * uniform block; see `@/draw/face-renderer/params` for the full slot map.
 * Unnamed slots stay zero.
 */
export function packClayPressing(
  pressing: ClayPressing,
  glaze: ClayGlaze,
  seat: number,
  side: number = defaultCanvasSize(seat),
): ArrayBuffer {
  const buffer = new ArrayBuffer(PRESSING_BYTES);
  const floats = new Float32Array(buffer);
  const dry = pressing.state === "dry";

  floats[0] = side / 2; // centre x
  floats[1] = side / 2; // centre y
  floats[2] = seat; // px per unit
  floats[3] = pressing.seed;
  floats[4] = pressing.state === "resting" ? 0.02 : 0; // thumbprint well depth
  floats[5] = dry ? 0.85 : 1; // relief
  floats[6] = pressing.blank; // glyph
  floats[7] = 1; // thickness
  floats[10] = dry ? 1 : 0; // cracks
  floats[13] = -0.005;
  floats[14] = (((pressing.seed * 7.31) % 1) - 0.5) * 0.9; // thumbprint whorl turn
  floats[15] = 0.37;
  floats[16] = dry ? 1 : 0; // matte
  floats[18] = 8;
  floats[19] = glaze.dark ? 1 : 0; // rim-light shadow
  floats[21] = 1;
  floats[22] = 1;
  floats.set(clayShadeFor(glaze.pigment, pressing.state), 24); // body tint
  floats[27] = dry ? 0.92 : 0.7;
  floats.set(ROD_TRIM, 28); // rod trim
  floats[31] = 2.7;
  floats.set(WAFER, 32); // wafer
  floats[35] = Math.min(0.7, (0.49 * side) / (1.42 * seat));
  floats.set(glaze.dark ? BACKDROP.dark : BACKDROP.light, 36); // page backdrop
  floats[39] = 1;
  return buffer;
}
