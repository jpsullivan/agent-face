// Turns a polyline into the outline of a hand-drawn stroke: it sways, swells
// and tapers at uncut ends, with rounded caps. Fill the result.
import {
  CLOSE,
  curveTo,
  distance,
  lineTo,
  midpoint,
  moveTo,
  quadraticToCubic,
  type PathPart,
  type Point,
} from "@/draw/path-data";
import { circleParts, offsetPoint } from "./geometry";
import { hashNoise, TAU } from "./math";

/** Which part of a longer line a stroke is. */
export interface StrokeSpan {
  /** Distance along the whole line where this piece starts. */
  startsAt: number;
  /** Length of the whole line; null when this piece is the whole line. */
  wholeLength: number | null;
  /** Cut ends join another piece, so they don't taper. */
  startIsCut: boolean;
  endIsCut: boolean;
}

export const WHOLE_STROKE: StrokeSpan = { startsAt: 0, wholeLength: null, startIsCut: false, endIsCut: false };

/** How the hand moves for this frame. */
export interface StrokeHand {
  /** 0–3: picks one of four sway phase sets. */
  phase: number;
  time: number;
  /** 0 → a clean stroke, 1 → full hand-drawn wobble. */
  share: number;
}

const SWAY_PHASES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 0, 0, 0],
  [1.9, 2.7, 1.3, 3.1],
  [3.8, 5.1, 2.9, 0.7],
  [5.3, 1.1, 4.6, 2.2],
];

/** Mark units per sway wavelength unit. */
const UNIT = 0.5;
/** Strokes shorter than this become a dot. */
const MIN_STROKE_LENGTH = 0.8;
const MIN_HALF_WIDTH = 0.3;
/** Cap handle length per half width; about 4/3 rounds the cap. */
const CAP_HANDLE = 1.333;
const TAPER_SEEDS: readonly [number, number] = [127.1, 311.7];

/** A seeded taper for one end (0 start, 1 end); `width(d)` is the width factor `d` from that end. */
function endTaper(seed: number, end: number, width: number, length: number, share: number) {
  const a = hashNoise(seed, end * 7.31 + 1.7, TAPER_SEEDS);
  const b = hashNoise(seed, end * 3.17 + 5.3, TAPER_SEEDS);
  const tipWidth = 1 - (1 - (0.97 - 0.12 * a)) * share;
  const taperLength = Math.min(width * (0.7 + 0.9 * a) * (0.9 + 0.2 * b), 0.45 * length);
  const exponent = 1.7 + 0.6 * b;
  return {
    width(fromEnd: number): number {
      const t = Math.min(1, fromEnd / taperLength);
      return tipWidth + (1 - tipWidth) * (1 - (1 - t) ** exponent);
    },
  };
}

/** Unit vector from `from` to `to`; coincident points give the raw (zero) difference. */
function direction(from: Point, to: Point): Point {
  const length = distance(from, to);
  const divisor = length === 0 ? 1 : length;
  return { x: (to.x - from.x) / divisor, y: (to.y - from.y) / divisor };
}

/** A smooth open curve from the first point (already current) through midpoints to the last. */
function smoothOpenParts(points: readonly Point[]): PathPart[] {
  const parts: PathPart[] = [];
  let previous = points[0]!;
  for (let i = 1; i < points.length - 1; i++) {
    const next = midpoint(points[i]!, points[i + 1]!);
    parts.push(quadraticToCubic(previous, points[i]!, next));
    previous = next;
  }
  parts.push(lineTo(points[points.length - 1]!));
  return parts;
}

export function dotParts(center: Point, radius: number): PathPart[] {
  return circleParts(center, Math.max(0.4, radius));
}

export function handStrokeParts(
  points: readonly Point[],
  width: number,
  seed: number,
  hand: StrokeHand,
  span: StrokeSpan,
): PathPart[] {
  if (points.length === 0) return [];
  const lengths = [0];
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!));
  const total = lengths[lengths.length - 1]!;
  if (points.length <= 1 || total < MIN_STROKE_LENGTH) return dotParts(points[0]!, width / 2);

  // Short lines wander less.
  const reach = Math.min(1, (span.wholeLength ?? total) / (90 * UNIT));
  const wander = 6 * 0.3 * UNIT * reach * hand.share;
  const drift = 0.35 * UNIT * reach * hand.share;
  const swell = (26 / 100) * hand.share;
  const phases = SWAY_PHASES[((hand.phase % 4) + 4) % 4]!;
  const startTaper = endTaper(seed, 0, width, total, hand.share);
  const finishTaper = endTaper(seed, 1, width, total, hand.share);

  const left: Point[] = [];
  const right: Point[] = [];
  const halfWidths: number[] = [];
  const last = points.length - 1;
  points.forEach((point, i) => {
    const along = direction(points[Math.max(0, i - 1)]!, points[Math.min(last, i + 1)]!);
    const normal = { x: -along.y, y: along.x };
    const taper =
      (span.startIsCut ? 1 : startTaper.width(lengths[i]!)) * (span.endIsCut ? 1 : finishTaper.width(total - lengths[i]!));
    const at = lengths[i]! + span.startsAt;
    const sway =
      0.65 * Math.sin((TAU / (170 * UNIT)) * at + phases[0] + seed) +
      0.35 * Math.sin((TAU / (70 * UNIT)) * at + phases[1] + seed * 1.7);
    const shift = wander * sway + drift * Math.sin((TAU / (300 * UNIT)) * at + 0.5 * hand.time + seed * 2.3);
    const thickness =
      0.6 * Math.sin((TAU / (120 * UNIT)) * at + phases[2] + seed * 0.9) +
      0.4 * Math.sin((TAU / (50 * UNIT)) * at + phases[3] + seed * 1.3);
    const half = Math.max(MIN_HALF_WIDTH, width * (1 + swell * thickness) * taper) / 2;
    left.push(offsetPoint(point, normal, shift + half));
    right.push(offsetPoint(point, normal, shift - half));
    halfWidths.push(half);
  });
  right.reverse();

  const endDirection = direction(points[last - 1]!, points[last]!);
  const startDirection = direction(points[1]!, points[0]!);
  const endCap = halfWidths[last]! * CAP_HANDLE;
  const startCap = halfWidths[0]! * CAP_HANDLE;
  // Down the left side, round the end cap, back up the right side, round the start cap.
  return [
    moveTo(left[0]!),
    ...smoothOpenParts(left),
    curveTo(right[0]!, offsetPoint(left[last]!, endDirection, endCap), offsetPoint(right[0]!, endDirection, endCap)),
    ...smoothOpenParts(right),
    curveTo(left[0]!, offsetPoint(right[last]!, startDirection, startCap), offsetPoint(left[0]!, startDirection, startCap)),
    CLOSE,
  ];
}
