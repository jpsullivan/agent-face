// Numeric codes shared between the face engine and the renderers: expression
// glyphs and wearables (hats on the head slot; sunglasses and props on the face slot).
import type { AiboHat } from "@/look/aibo-look";

export const FACE_GLYPHS = {
  idle: 0,
  listening: 1,
  thinking: 2,
  speaking: 3,
  happy: 4,
  confused: 5,
  sleeping: 6,
  error: 7,
  surprised: 8,
} as const;
export type FaceState = keyof typeof FACE_GLYPHS;
export type FaceGlyph = (typeof FACE_GLYPHS)[FaceState];

export const HAT_CODES: Record<AiboHat, number> = {
  bowler: 1,
  partyHat: 3,
  nightcap: 4,
  cap: 12,
  beanie: 13,
  crown: 14,
  headphones: 15,
  topHat: 16,
  gradCap: 17,
  chefHat: 18,
  propeller: 19,
  wizard: 20,
  sprout: 21,
  hardHat: 22,
  flower: 23,
  cowboy: 24,
  antenna: 25,
  halo: 26,
  bow: 27,
};

export const SUNGLASSES_CODE = 2;
export const NO_WEARABLE = 0;

export const PROP_CODES = {
  pencil: 5,
  hammer: 6,
  keyboard: 7,
  book: 8,
  magnifier: 9,
  pot: 10,
  blocks: 11,
} as const;
export type PropName = keyof typeof PROP_CODES;

/** Any wearable code; 0 means nothing is worn. */
export type WearableCode = number;
export type WearableSlot = "head" | "face";

export function isPropCode(code: WearableCode): boolean {
  return code >= PROP_CODES.pencil && code <= PROP_CODES.blocks;
}

export function slotForWearable(code: WearableCode): WearableSlot {
  return code === SUNGLASSES_CODE || isPropCode(code) ? "face" : "head";
}

/** A held prop replaces sunglasses on the face slot. */
export function wearablesFor(
  hat: AiboHat | null,
  prop: PropName | null = null,
  sunglasses = false,
): { head: WearableCode; face: WearableCode } {
  const head = hat === null ? NO_WEARABLE : HAT_CODES[hat];
  if (prop === null) return { head, face: sunglasses ? SUNGLASSES_CODE : NO_WEARABLE };
  return { head, face: PROP_CODES[prop] };
}

/** Hats with their own idle animation keep the engine awake this long after landing. */
export function minimumWearSeconds(code: WearableCode): number {
  if (code === HAT_CODES.propeller) return 3.2;
  if (code === HAT_CODES.partyHat) return 2.2;
  return 0;
}

export interface WearableFrame {
  kind: WearableCode;
  /** 0 → in the air, 1 → seated. */
  progress: number;
  /** Seconds since it was put on. */
  age: number;
  /** [offsetX, offsetY, angle, setDownProgress] while being thrown or set down. */
  fling: [number, number, number, number];
}

export const EMPTY_WEARABLE_FRAME: WearableFrame = {
  kind: NO_WEARABLE,
  progress: 0,
  age: 0,
  fling: [0, 0, 0, 0],
};

export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
