// The kit's fixed colours: Claude clay for the shape, near-black ink and
// off-white paper for lines (swapped in dark mode by the line paint).
import type { PaintColours } from "@/draw/line-paint";

/** The shape's fill. */
export const SPOT_HEX = "#D97757";

/** Line-set colours. `offered` and `accessorySpots` are unused by the kit; their element types are a guess. */
export interface MascotPalette extends PaintColours {
  offered: readonly string[];
  accessorySpots: Readonly<Record<string, string>>;
}

export const MASCOT_PALETTE: MascotPalette = {
  ink: "#141413",
  paper: "#FAF9F5",
  offered: [],
  accessorySpots: {},
  marksFill: null,
};
