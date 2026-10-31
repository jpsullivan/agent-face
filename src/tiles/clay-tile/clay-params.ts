// Packs the face renderer's parameter block for one clay tile: pressing, glaze, line and spot colours.
import { lineTintForAiboTint, type AiboTint } from "@/look/aibo-look";
import { hexToRgb } from "@/face/face-codes";
import type { TileStyle } from "@/tiles/tile-contexts";
import type { TileGlyph } from "@/tokens/task-look";
import {
  NEUTRAL_CLAY_PIGMENT,
  clayBlankForGlyph,
  clayCanvasSize,
  clayShadeFor,
  packClayPressing,
  type ClayState,
  type Rgb,
} from "./clay-glaze";
import { resolveLinePaint, type LinePaint } from "@/draw/line-paint";
import { offeredHex, planSmallDrawing, type LineSet } from "./line-set";

export interface ClayLook {
  glyph: TileGlyph;
  state: ClayState;
  seed: number;
  tint: AiboTint;
  fill: TileStyle;
  neutral: boolean;
  dark: boolean;
}

export interface ClaySeat {
  /** Tile size in CSS px. */
  seatPoints: number;
  /** Tile size in device px. */
  seat: number;
  /** Canvas side in device px. */
  side: number;
}

/** The canvas is this much larger than the tile so glaze and line can spill past its edge. */
const CANVAS_OVERSCAN = 1.2;
/** Share of the tile the glyph's line drawing occupies. */
const LINE_DRAWING_SHARE = 0.8;
/** Line-set units across the glyph drawing; line weights are divided by this to become tile shares. */
const LINE_UNITS_ACROSS_GLYPH = 192;
const MAX_LINE_WIDTH = 1 / 16;
const SHADE_LINE_WIDTH_SHARE = 0.5;
const WOBBLE_DIVISOR = 1.5;

const PARAMS_BYTES = 240;
const SLOT = { line: 40, shade: 44, eyes: 48, spotSlip: 52, clay: 56 } as const;

/** CSS side of the clay canvas for a tile of `tileSize` px. */
export function clayCanvasSide(tileSize: number): number {
  return clayCanvasSize(tileSize, CANVAS_OVERSCAN);
}

export function packClayParams(look: ClayLook, lineSet: LineSet, seat: ClaySeat): ArrayBuffer {
  const paintRgb = (paint: LinePaint): Rgb =>
    hexToRgb(resolveLinePaint(paint, lineSet.colours, look.dark));
  const spotRgb = (hex: string) => paintRgb({ kind: "spot", hex });

  const clayRgb = spotRgb(offeredHex(lineSet, "clay"));
  const neutralPigment = NEUTRAL_CLAY_PIGMENT[look.dark ? "dark" : "light"];
  let pigment = spotRgb(offeredHex(lineSet, lineTintForAiboTint(look.tint)));
  if (look.fill === "grey") pigment = neutralPigment;
  else if (look.glyph === "clawd") pigment = clayRgb;
  else if (look.neutral) pigment = neutralPigment;

  const buffer = new ArrayBuffer(PARAMS_BYTES);
  const floats = new Float32Array(buffer);
  floats.set(
    new Float32Array(
      packClayPressing(
        { blank: clayBlankForGlyph(look.glyph), state: look.state, seed: look.seed },
        { pigment, dark: look.dark },
        seat.seat,
        seat.side,
      ),
    ),
  );

  const plan = planSmallDrawing(
    LINE_DRAWING_SHARE * seat.seatPoints,
    lineSet.smallSizes,
    "asTheSetSays",
  );
  const unitsToShare = LINE_DRAWING_SHARE / LINE_UNITS_ACROSS_GLYPH;
  const lineWidth = plan.lineWeight * unitsToShare;
  const cappedLineWidth = Math.min(lineWidth, MAX_LINE_WIDTH);
  // Spot slip shrinks in step with any capping of the line width.
  const capShrink = lineWidth > 0 ? cappedLineWidth / lineWidth : 1;
  const wobble =
    (lineSet.line.defaults.handWobble * (lineSet.line.wander.shareOfHandWobble ?? 0) * unitsToShare) /
    WOBBLE_DIVISOR;

  floats.set([...paintRgb({ kind: "line" }), cappedLineWidth], SLOT.line);
  floats.set(
    [...clayShadeFor(pigment, look.state), cappedLineWidth * SHADE_LINE_WIDTH_SHARE],
    SLOT.shade,
  );
  floats.set([...paintRgb({ kind: "eyes" }), wobble], SLOT.eyes);
  floats.set(
    [plan.spotSlipX * unitsToShare * capShrink, plan.spotSlipY * unitsToShare * capShrink],
    SLOT.spotSlip,
  );
  floats.set(clayRgb, SLOT.clay);
  return buffer;
}
