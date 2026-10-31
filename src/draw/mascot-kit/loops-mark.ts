// The "loops" mark: a hand-traced looping line that slides along its path over
// a slightly uneven ring.
import type { Point } from "@/draw/path-data";
import { markDesign, markLine, sampleRing, type MarkDesign, type MarkLine } from "./mark-design";
import { clamp01, lerpPoint, smoothstep, TAU } from "./math";

/** Ring radius per sample, traced by hand. */
const LOOPS_RADII = [
  20.03, 19.96, 19.89, 19.83, 19.69, 19.63, 19.56, 19.56, 19.56, 19.63, 19.69,
  19.76, 19.83, 19.83, 19.83, 19.89, 19.83, 19.83, 19.89, 19.89, 20.03, 20.22,
  20.36, 20.62, 20.82, 20.95, 21.02, 21.09, 21.09, 20.95, 20.76, 20.49, 20.09,
  19.83, 19.63, 19.36, 19.23, 19.1, 19.03, 19.1, 19.1, 19.16, 19.23, 19.36,
  19.36, 19.5, 19.5, 19.63, 19.76, 19.89, 20.16, 20.36, 20.56, 20.76, 20.89,
  20.95, 21.02, 20.95, 20.82, 20.62, 20.42, 20.16, 20.03, 19.76, 19.69, 19.69,
  19.69, 19.76, 19.89, 19.96, 19.96, 20.03,
];

/** The loops line as flat x, y pairs. */
const LOOPS_PATH_COORDS = [
  -20.32, 8.53, -19.61, 9.08, -18.8, 9.46, -17.94, 9.71, -17.06, 9.86, -16.16,
  9.89, -15.26, 9.81, -14.37, 9.72, -13.48, 9.58, -12.62, 9.34, -11.77, 9.03,
  -10.96, 8.65, -10.17, 8.23, -9.42, 7.74, -8.66, 7.25, -7.91, 6.76, -7.29,
  6.12, -6.7, 5.44, -6, 4.87, -5.35, 4.26, -4.81, 3.54, -4.32, 2.79, -3.87,
  2.01, -3.48, 1.2, -3.18, 0.36, -2.96, -0.52, -2.8, -1.4, -2.79, -2.29,
  -2.98, -3.17, -3.54, -3.85, -4.39, -4.15, -5.28, -4.24, -6.16, -4.07, -6.9,
  -3.58, -7.49, -2.9, -7.98, -2.15, -8.36, -1.33, -8.61, -0.47, -8.74, 0.42,
  -8.8, 1.31, -8.78, 2.21, -8.66, 3.1, -8.44, 3.97, -8.09, 4.8, -7.61, 5.56,
  -7.07, 6.27, -6.48, 6.95, -5.85, 7.59, -5.14, 8.14, -4.37, 8.61, -3.58,
  9.03, -2.75, 9.38, -1.91, 9.69, -1.05, 9.94, -0.16, 10.09, 0.74, 10.15,
  1.63, 10.13, 2.53, 10.05, 3.42, 9.91, 4.27, 9.63, 4.98, 9.09, 5.76, 8.67,
  6.65, 8.55, 7.47, 8.22, 8.09, 7.57, 8.7, 6.91, 9.3, 6.24, 9.85, 5.53, 10.38,
  4.8, 10.88, 4.06, 11.38, 3.31, 11.81, 2.52, 12.06, 1.66, 12.2, 0.77, 12.28,
  -0.12, 12.28, -1.02, 12.16, -1.91, 11.86, -2.76, 11.37, -3.51, 10.7, -4.11,
  9.92, -4.55, 9.06, -4.8, 8.17, -4.86, 7.28, -4.7, 6.46, -4.35, 5.71, -3.85,
  5.04, -3.26, 4.53, -2.52, 4.13, -1.72, 3.76, -0.89, 3.46, -0.05, 3.25, 0.82,
  3.12, 1.71, 3.05, 2.61, 3.07, 3.51, 3.18, 4.4, 3.44, 5.25, 3.82, 6.07, 4.29,
  6.84, 4.75, 7.61, 5.3, 8.31, 6.15, 8.57, 7.02, 8.76, 7.64, 9.39, 8.29,
  10.01, 9.12, 10.33, 9.99, 10.56, 10.87, 10.76, 11.75, 10.9, 12.65, 11.01,
  13.54, 11.07, 14.44, 11.07, 15.34, 11.03, 16.23, 10.95, 17.12, 10.82, 17.99,
  10.6, 18.85, 10.32, 19.67, 9.97, 20.44, 9.51, 21.18, 9, 21.92, 8.48, 22.64,
  7.95, 23.35, 7.39, 24.04, 6.82, 24.7, 6.21, 25.33, 5.57, 25.93, 4.9, 26.52,
  4.22,
];

const LOOPS_PATH: Point[] = Array.from({ length: LOOPS_PATH_COORDS.length / 2 }, (_, i) => ({
  x: LOOPS_PATH_COORDS[2 * i]!,
  y: LOOPS_PATH_COORDS[2 * i + 1]!,
}));

const LOOPS_RING = sampleRing(
  LOOPS_RADII.reduce((sum, radius) => sum + radius, 0) / LOOPS_RADII.length,
  (t) => {
    const radius = LOOPS_RADII[Math.min(LOOPS_RADII.length - 1, Math.floor(t * LOOPS_RADII.length))]!;
    const angle = Math.PI / 2 + TAU * t;
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  },
);

/** State time before the loops start sliding. */
const SLIDE_DELAY = 0.3;
const SLIDE_RATE = 0.22;
/** Eases the slide in over this much path behind the tail… */
const TAIL_EASE = 0.06;
/** …and this much ahead of the end. */
const HEAD_EASE = 0.15;

/** The straight chord from the path's first point to its last. */
function chordPoint(t: number): Point {
  return lerpPoint(LOOPS_PATH[0]!, LOOPS_PATH[LOOPS_PATH.length - 1]!, t);
}

function pathPoint(t: number): Point {
  const at = t * (LOOPS_PATH.length - 1);
  const index = Math.min(LOOPS_PATH.length - 2, Math.floor(at));
  return lerpPoint(LOOPS_PATH[index]!, LOOPS_PATH[index + 1]!, at - index);
}

function loopsLine(time: number): MarkLine {
  const sliding = Math.max(0, time - SLIDE_DELAY);
  // How far the loops have slid back along the chord: starts slow, then about linear.
  const slid = (SLIDE_RATE * sliding * sliding) / (sliding + 0.4);
  return markLine(
    (at) => {
      const t = clamp01(at);
      if (!(slid > 0)) return pathPoint(t);
      const chord = chordPoint(t);
      const source = t - slid;
      if (!(source > 0)) return chord;
      const weight =
        1 - (1 - smoothstep(source / TAIL_EASE) * smoothstep((1 - t) / HEAD_EASE)) * Math.min(1, slid / 0.1);
      const loop = pathPoint(source);
      const loopChord = chordPoint(source);
      // The chord plus the loops' detour from their own chord, shifted along.
      return { x: chord.x + (loop.x - loopChord.x) * weight, y: chord.y + (loop.y - loopChord.y) * weight };
    },
    { handShare: 0.5 },
  );
}

export const LOOPS_MARK: MarkDesign = markDesign({
  stillSecond: 0,
  samples: 220,
  timing: { leaves: 0.7 },
  weightShare: 0.8,
  shape: () => LOOPS_RING,
  line: loopsLine,
});
