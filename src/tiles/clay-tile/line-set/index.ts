// The built-in line set, read lazily once, plus small lookups on a line set.
import { BUILT_IN_LINE_SET_JSON } from "./built-in-line-set";
import { readLineSetText } from "./read-line-set";
import type { LineSet } from "./types";

export type { LineSet, LineColours } from "./types";
export { LineSetRefusal } from "./read-helpers";
export { planSmallDrawing, type SmallDrawingPlan } from "./size-table";

/** undefined: not read yet; null: the built-in set was refused. */
let builtIn: LineSet | null | undefined;

export function builtInLineSet(): LineSet | null {
  if (builtIn === undefined) {
    try {
      builtIn = readLineSetText(BUILT_IN_LINE_SET_JSON);
    } catch {
      builtIn = null;
    }
  }
  return builtIn;
}

/** Hex of an offered colour by key, falling back to the set's ink. */
export function offeredHex(lineSet: LineSet, key: string): string {
  return lineSet.colours.offered.find((offered) => offered.key === key)?.hex ?? lineSet.colours.ink;
}
