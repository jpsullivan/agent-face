// Size tables (value by pixel size, linearly interpolated) and the small-size drawing plan built from them.
import { LINE_DRAWING } from "@/look/aibo-look";
import type { SmallSizes } from "./types";

export interface SizeTable {
  /** Strictly rising pixel sizes. */
  sizes: number[];
  values: number[];
}

export interface SizeTableBounds {
  lower: number;
  upper: number;
}

/** How fully a small drawing is drawn: as the line set's thresholds say, or with every detail. */
export type SmallDrawingMode = "asTheSetSays" | "inFull";

export interface SmallDrawingPlan {
  lineWeight: number;
  eyeLineWeight: number;
  spotSlipX: number;
  spotSlipY: number;
  eyeScale: number;
  usesRibbon: boolean;
  eyesAreByHand: boolean;
  drawsMarks: boolean;
  marksAreEnlarged: boolean;
  drawsInnerLine: boolean;
  usesLedge: boolean;
}

/** Builds a table from `[size, value]` pairs; null unless every pair is finite and sizes rise. */
export function toSizeTable(pairs: readonly (readonly number[])[]): SizeTable | null {
  const isFinitePair = (pair: readonly number[]) =>
    pair.length === 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1]);
  if (pairs.length === 0 || !pairs.every(isFinitePair)) return null;

  const sizes = pairs.map((pair) => pair[0]!);
  const rises = sizes.slice(1).every((size, index) => sizes[index]! < size);
  return rises ? { sizes, values: pairs.map((pair) => pair[1]!) } : null;
}

export function sizeTableBounds(table: SizeTable): SizeTableBounds {
  const [first] = table.values;
  if (first === undefined) return { lower: 0, upper: 0 };
  let lower = first;
  let upper = first;
  for (const value of table.values) {
    if (value < lower) lower = value;
    if (value > upper) upper = value;
  }
  return { lower, upper };
}

/** Value at `size`, clamped to the table's ends and linear between rows. */
export function valueAtSize(table: SizeTable, size: number): number {
  const { sizes, values } = table;
  const above = sizes.findIndex((rowSize) => size <= rowSize);
  if (above === -1) return values[values.length - 1]!;
  if (!(above > 0)) return values[0]!;
  const share = (size - sizes[above - 1]!) / (sizes[above]! - sizes[above - 1]!);
  return values[above - 1]! + (values[above]! - values[above - 1]!) * share;
}

export function planSmallDrawing(
  sizePx: number,
  smallSizes: SmallSizes,
  mode: SmallDrawingMode,
): SmallDrawingPlan {
  const above = {
    ribbon: sizePx > smallSizes.wobbleAbovePx,
    marks: sizePx > smallSizes.marksAbovePx,
  };
  const inFull = mode === "inFull";
  return {
    lineWeight: valueAtSize(smallSizes.lineWeight, sizePx),
    eyeLineWeight: valueAtSize(smallSizes.eyeLineWeight, sizePx),
    spotSlipX: valueAtSize(smallSizes.spotSlipX, sizePx),
    spotSlipY: valueAtSize(smallSizes.spotSlipY, sizePx),
    eyeScale: valueAtSize(smallSizes.eyeScale, sizePx),
    usesRibbon: above.ribbon || (inFull && sizePx >= LINE_DRAWING.byHandFrom),
    eyesAreByHand: above.ribbon,
    drawsMarks: above.marks || inFull,
    marksAreEnlarged: inFull && !above.marks,
    drawsInnerLine: sizePx > smallSizes.innerLineAbovePx,
    usesLedge: sizePx >= smallSizes.ledgeFromPx,
  };
}
