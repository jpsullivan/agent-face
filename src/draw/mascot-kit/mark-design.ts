// What a mark is made of: a filled ring (the shape) and an optional line drawn
// over it, both functions of the mark's state time, plus timing and defaults.
import type { Point } from "@/draw/path-data";
import { TAU } from "./math";

export const RING_SAMPLES = 72;

/** A closed outline; a split ring is drawn as two halves. */
export interface Ring {
  points: Point[];
  isSplit: boolean;
  radius: number;
}

export function sampleRing(radius: number, at: (t: number) => Point): Ring {
  return {
    points: Array.from({ length: RING_SAMPLES }, (_, i) => at((i + 0.5) / RING_SAMPLES)),
    isSplit: false,
    radius,
  };
}

/** A circle sampled from the bottom, clockwise. */
export function circleRing(center: Point, radius: number): Ring {
  return sampleRing(radius, (t) => {
    const angle = Math.PI / 2 + TAU * t;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
}

export interface MarkLine {
  /** The drawn part of the line, as [from, to] along it (0–1). */
  stretch: [number, number];
  /** Size of the dot at the line's midpoint; 0 draws none. */
  bead: number;
  /** The bead shrinks away with the line rather than fading by size. */
  beadComesWithTheLine: boolean;
  /** Parts where `isBehind` holds are painted under the shape. */
  goesBehindTheShape: boolean;
  /** How much hand-drawn wobble the line keeps (0–1). */
  handShare: number;
  isBehind: (t: number) => boolean;
  point: (t: number) => Point;
}

export function markLine(point: (t: number) => Point, options: Partial<Omit<MarkLine, "point">> = {}): MarkLine {
  return {
    stretch: [0, 1],
    bead: 0,
    beadComesWithTheLine: false,
    goesBehindTheShape: false,
    handShare: 1,
    isBehind: () => false,
    ...options,
    point,
  };
}

export interface MarkTiming {
  /** Seconds of change progress spent arriving at this mark. */
  arrives: number;
  /** Seconds of change progress spent leaving this mark. */
  leaves: number;
  /** State-time seconds per clock second. */
  speed: number;
}

export type MarkRays =
  | { kind: "burst" }
  /** Rays fanning up from behind a horizon, around a sun of `radius`. */
  | { kind: "sun"; horizon: number; radius: number };

export interface MarkDesign {
  /** State time of the mark's still picture. */
  stillSecond: number;
  /** Line samples at full size. */
  samples: number;
  rays: MarkRays | null;
  /** State time between poses the mark can come to rest on; null never rests. */
  restsEvery: number | null;
  /** Scales the line width. */
  weightShare: number;
  shape: (time: number, smallness: number, calm: number) => Ring;
  line: (time: number, smallness: number, calm?: number) => MarkLine | null;
  timing: MarkTiming;
}

export type MarkDesignInput = Pick<MarkDesign, "stillSecond" | "shape"> &
  Partial<Omit<MarkDesign, "stillSecond" | "shape" | "timing">> & { timing?: Partial<MarkTiming> };

export function markDesign(input: MarkDesignInput): MarkDesign {
  return {
    samples: 600,
    rays: null,
    restsEvery: null,
    weightShare: 1,
    line: () => null,
    ...input,
    timing: { arrives: 1, leaves: 0.475, speed: 1, ...input.timing },
  };
}
