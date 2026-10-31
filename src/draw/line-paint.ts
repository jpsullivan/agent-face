// Which colour a line-set paint resolves to. `inverted` swaps ink and paper
// for marks drawn light-on-dark.
import { isHexColour } from "./path-data";

export interface PaintColours {
  ink: string;
  paper: string;
  marksFill: string | null;
}

export type LinePaint =
  | { kind: "line" }
  | { kind: "eyes" }
  | { kind: "filledMark" }
  | { kind: "spot"; hex: string }
  | { kind: "fixed"; hex: string };

export function resolveLinePaint(paint: LinePaint, colours: PaintColours, inverted: boolean): string {
  switch (paint.kind) {
    case "line":
      return inverted ? colours.paper : colours.ink;
    case "eyes":
      return colours.ink;
    case "filledMark":
      return inverted ? colours.ink : (colours.marksFill ?? colours.paper);
    case "spot":
    case "fixed":
      // A bad hex in the line set falls back to ink rather than failing the draw.
      return isHexColour(paint.hex) ? paint.hex : colours.ink;
  }
}
