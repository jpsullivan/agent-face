// Shared tuning numbers for drawing marks (from helper chunk 038ed117…). Marks
// are designed in a 100×100 box centred near the origin.
import type { Point } from "@/draw/path-data";
import type { Box } from "./paint";
import { clamp01 } from "./math";

/** Line width in mark units, before the scale and boost below. */
export const LINE_WIDTH = 7.5;
export const LINE_WIDTH_SCALE = 0.42;
export const LINE_WIDTH_BOOST = 1.25;
/** Small seats draw the line up to this much thicker. */
export const SMALL_LINE_GROWTH = 1.1;

/** Large seats run the mark clock at this rate; small ones at 2. */
export const LARGE_SEAT_CLOCK_RATE = 1.2;

export const SHAPE_WOBBLE_SPEED = 2.55;
export const SHAPE_WOBBLE_AMOUNT = 0.2;

export const CONNECTING_PERIOD_SECONDS = 4.4;

/** The shape sits this far off the box centre. */
export const MARK_OFFSET: Point = { x: 2.6, y: 2.2 };

export const MARK_BOX: Box = { x: -50 + MARK_OFFSET.x, y: -50 + MARK_OFFSET.y, width: 100, height: 100 };

/** Seats of `closer` faces at rest zoom in by this much. */
export const CLOSER_ZOOM = 1.5;

/** 1 for seats up to 48 CSS px, fading to 0 by 58. */
export function smallnessForSeat(seat: number): number {
  return 1 - clamp01((seat - 48) / 10);
}
