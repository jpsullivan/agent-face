// The mark catalogue: one shape and line design per mark name. Times are state
// seconds; `smallness` is 1 for small seats and 0 for large; `calm` is 1 when
// the mascot has come to rest.
import { clampInt, type Point } from "@/draw/path-data";
import type { MarkName } from "./app-symbols";
import { LOOPS_MARK } from "./loops-mark";
import {
  circleRing,
  markDesign,
  markLine,
  RING_SAMPLES,
  sampleRing,
  type MarkDesign,
  type MarkLine,
  type Ring,
} from "./mark-design";
import {
  clamp01,
  easeInOutCubic,
  easeOutBlend,
  fract,
  hashNoise,
  lerp,
  lerpPoint,
  pulse,
  smoothstep,
  TAU,
} from "./math";
import { CONNECTING_PERIOD_SECONDS } from "./tuning";

function point(x: number, y: number): Point {
  return { x, y };
}

const ORIGIN = point(0, 0);

/** Two detuned sines: a cheap irregular wobble in about [-1, 1]. */
function wobble(t: number, phase: number): number {
  return 0.6 * Math.sin(t) + 0.4 * Math.sin(2.3 * t + phase);
}

function quadraticPoint(t: number, from: Point, control: Point, to: Point): Point {
  const u = 1 - t;
  return point(u * u * from.x + 2 * t * u * control.x + t * t * to.x, u * u * from.y + 2 * t * u * control.y + t * t * to.y);
}

/** A 4.8 s breath: swell, hold, settle, pause. */
function breath(time: number): number {
  const t = fract(time / 4.8);
  return t < 0.4 ? smoothstep(t / 0.4) : t < 0.48 ? 1 : t < 0.92 ? 1 - smoothstep((t - 0.48) / 0.44) : 0;
}

function idleShape(time: number): Ring {
  const radius = 17.2 + 4 * breath(time);
  return sampleRing(radius, (t) => {
    const angle = TAU * t;
    const r =
      radius * (1 + 0.04 * Math.sin(2 * angle + 0.7 + 0.12 * time) + 0.025 * Math.sin(3 * angle + 2.1 - 0.09 * time));
    return point(-r * Math.sin(angle), r * Math.cos(angle));
  });
}

const CALM_RING = sampleRing(20, (t) => {
  const angle = TAU * t;
  const r = 20 + 0.9 * Math.sin(3 * angle);
  return point(-r * Math.sin(angle), r * Math.cos(angle));
});

const TILDE_TIME_SCALE = 0.65;
/** Tilde waves per scaled second. */
const TILDE_WAVE_RATE = 0.26;

function tildeBreath(time: number, calm: number): number {
  return breath(time * TILDE_TIME_SCALE) * (1 - calm);
}

function tildeShape(time: number, _smallness: number, calm = 0): Ring {
  return circleRing(ORIGIN, 18 * (1 + 0.05 * tildeBreath(time, calm)));
}

function tildeLine(time: number, _smallness: number, calm = 0): MarkLine {
  const scaled = time * TILDE_TIME_SCALE;
  const height = 7.5 * (0.85 + 0.2 * tildeBreath(time, calm));
  const phase = TAU * TILDE_WAVE_RATE * scaled;
  return markLine((t) => {
    const envelope = Math.max(0, Math.sin(Math.PI * t)) ** 0.7;
    return point(lerp(-30, 30, t), 2 - height * envelope * Math.sin(TAU * t - phase));
  });
}

/** Two circles that pull apart, bob, and merge again. */
function connectingShape(time: number): Ring {
  const ease = (from: number, to: number, t: number) => easeInOutCubic((t - from) / (to - from));
  const cycle = fract(time / CONNECTING_PERIOD_SECONDS);
  const apart = ease(0.1, 0.36, cycle) - ease(0.74, 0.9, cycle);
  const bob = ease(0.36, 0.5, cycle) - ease(0.62, 0.74, cycle);
  const radius = 20 * (1 - 0.29 * apart);
  const halfGap = radius * apart ** 0.85 + 2.5 * bob;
  const lift = 1.3 * bob * Math.sin(TAU * 0.45 * time);
  const tilt = -0.18;
  // Angle at which the two circles cross; each half runs round its outside from there.
  const meet = Math.atan2(Math.sqrt(Math.max(0, radius * radius - halfGap * halfGap)), halfGap);
  const points = Array.from({ length: RING_SAMPLES }, (_, i) => {
    const t = (i + 0.5) / RING_SAMPLES;
    const isLeft = t < 0.5;
    const along = isLeft ? 2 * t : 2 * t - 1;
    const angle = isLeft ? lerp(meet, TAU - meet, along) : lerp(meet - Math.PI, Math.PI - meet, along);
    const r = radius * (1 + 0.035 * Math.sin(2 * angle + 0.8 * time) + 0.02 * Math.sin(3 * angle - 0.6 * time));
    const x = (isLeft ? -halfGap : halfGap) + r * Math.cos(angle);
    const y = (isLeft ? lift : -lift) + r * Math.sin(angle);
    return point(x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt));
  });
  const isSplit = halfGap >= radius - 1e-6 && bob > 0;
  const halves: Array<[number, number]> = isSplit
    ? [
        [0, 36],
        [36, 72],
      ]
    : [[0, 72]];
  // Three passes of a [1 2 1] smoothing kernel round each closed half.
  for (const [start, end] of halves) {
    for (let pass = 0; pass < 3; pass += 1) {
      const run = points.slice(start, end);
      run.forEach((current, i) => {
        const previous = run[(i + run.length - 1) % run.length]!;
        const next = run[(i + 1) % run.length]!;
        points[start + i] = point((previous.x + 2 * current.x + next.x) / 4, (previous.y + 2 * current.y + next.y) / 4);
      });
    }
  }
  return { points, isSplit, radius: 14 };
}

function thinkingRadius(time: number): number {
  return 15 + 0.8 * Math.sin(TAU * time * 0.2);
}

/** A scribble that re-seeds four times a second. */
function thinkingLine(time: number, smallness: number): MarkLine {
  const radius = thinkingRadius(time);
  const seed = Math.floor(time * 4) * 7.31;
  const span = 5 * (lerp(1, 0.45, smallness) * 0.5);
  return markLine((t) => {
    const s = span * (t - 0.5);
    const angle = TAU * s + TAU * 0.16 * seed;
    const turn = 1.7 * s + 0.12 * seed;
    const squash = 0.64 + 0.32 * wobble(1.7 * s + 0.4 * seed, 0.9);
    const scale = 0.78 + 0.5 * wobble(2.3 * s - 0.3 * seed, 2);
    const cos = Math.cos(angle);
    const sin = squash * Math.sin(angle);
    const x = scale * (cos * Math.cos(turn) - sin * Math.sin(turn)) + 0.26 * wobble(0.8 * s + 0.3 * seed, 0.4);
    const y = scale * (cos * Math.sin(turn) + sin * Math.cos(turn)) + 0.26 * wobble(1.1 * s - 0.2 * seed, 2.2);
    return point(radius * x, radius * y);
  });
}

/** A line with one loop in it. */
function thinkOneLine(time: number): MarkLine {
  const center = 0.5 + 0.07 * Math.sin(TAU * time * 0.11);
  const size = 10 + 3.5 * Math.sin(TAU * time * 0.3);
  return markLine((t) => {
    const angle = TAU * smoothstep((t - center) / 0.46 + 0.5);
    return point(
      -32 + 64 * t + size * Math.sin(angle),
      10 - size * (1 - Math.cos(angle)) + 1.2 * Math.sin(TAU * (t - 0.2 * time)),
    );
  });
}

/** A tilted ellipse round the shape, with its far side behind it. */
function orbitLine(time: number): MarkLine {
  const tilt = -0.42 + 0.16 * Math.sin(TAU * 0.09 * time);
  const radius = 25 + Math.sin(TAU * 0.2 * time);
  const phase = TAU * 0.22 * time;
  return markLine(
    (t) => {
      const angle = TAU * (t - 0.5) + phase;
      const x = radius * Math.cos(angle);
      const y = 9 * Math.sin(angle);
      return point(x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt));
    },
    {
      bead: 1,
      goesBehindTheShape: true,
      isBehind: (t) => Math.sin(TAU * (t - 0.5) + phase) < 0,
    },
  );
}

/** Where along the line the reading loop sits, and how big it is. */
function readingLoop(time: number, smallness: number): { place: number; size: number } {
  const t = clamp01(fract(time / 2.8) / 0.82);
  return {
    place: lerp(0.25, 0.75, easeInOutCubic(t)),
    size: lerp(13, 14, smallness) * Math.max(0, Math.sin(Math.PI * t)) ** 0.5,
  };
}

function workingLine(time: number): MarkLine {
  const amplitude = 6.5 + 0.8 * Math.sin(TAU * time * 0.45);
  return markLine((t) => point(-34 + 68 * t, -amplitude * 0.62 * Math.sin(TAU * 2 * 1.5 * t - TAU * 0.9 * time)));
}

/** A wave that grows out from the middle every 5.4 s, carrying a bead. */
function signalLine(time: number): MarkLine {
  const period = 5.4;
  const since = time - 1.5;
  const at = since < 0 ? 0 : since - Math.floor(since / period) * period;
  const reveal =
    at < 0.5
      ? 0
      : at < 1.9
        ? easeOutBlend((at - 0.5) / 1.4)
        : at < 4.4
          ? 1
          : at < 5.2
            ? 1 - smoothstep((at - 4.4) / 0.8)
            : 0;
  const amplitude = 6.5 * (1 + 0.1 * Math.sin(TAU * time * 0.4));
  return markLine(
    (t) => {
      const fromMiddle = Math.abs(2 * t - 1);
      const envelope = smoothstep(fromMiddle / 0.16) * (1 - 0.6 * smoothstep(fromMiddle));
      return point(34 * (2 * t - 1), -amplitude * envelope * Math.sin(TAU * 1.3 * fromMiddle - TAU * 0.9 * time));
    },
    { stretch: [0.5 - reveal / 2, 0.5 + reveal / 2], bead: 1, beadComesWithTheLine: true },
  );
}

/** Cursive loops that roll along a baseline. */
function writingLine(time: number): MarkLine {
  return markLine((t) => {
    const size = 10.5 * (smoothstep((t - 0.12) / 0.14) * smoothstep((0.88 - t) / 0.18));
    const angle = TAU * 2 * 1.4 * (t - 0.5) - TAU * 0.4 * time;
    return point(-36 + 72 * t + size * Math.sin(angle), 9 - size * (1 - Math.cos(angle)));
  });
}

/** Share of the line on each side spent as flat baseline. */
const HEART_SIDE = 0.2;
/** Angle trimmed off each end of the heart curve. */
const HEART_TRIM = 0.5;
const HEART_BASELINE = 15;
/** [at, half-width] of the joins that are rounded with a quadratic. */
const HEART_JOINS: ReadonlyArray<readonly [number, number]> = [
  [HEART_SIDE, 0.022],
  [0.5, 0.02],
  [0.8, 0.022],
];

/** A baseline with a beating heart drawn into its middle. */
function waitingLine(time: number): MarkLine {
  const beat = fract(time / 1.3);
  const scale = 0.85 * (0.96 + 0.125 * (pulse(beat) + 0.55 * pulse(beat - 0.2)));
  const heartPoint = (t: number): Point => {
    const side = HEART_SIDE;
    if (t <= side || t >= 0.8) {
      const lead = t <= side ? t / side : (1 - t) / side;
      return point(
        (t <= side ? -1 : 1) * lerp(36, 1.76 * scale, lead),
        HEART_BASELINE + 0.9 * (1 - lead) * Math.sin(TAU * (1.2 * t - 0.25 * time)),
      );
    }
    const angle = lerp(-Math.PI + HEART_TRIM, Math.PI - HEART_TRIM, (t - side) / (1 - 2 * side));
    // The heart curve x = 16 sin³θ, y = 13 cosθ − 5 cos2θ − 2 cos3θ − cos4θ, raised to sit on the baseline.
    const rise =
      13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle) + 13.55;
    const sin = Math.sin(angle);
    return point(scale * 16 * sin * sin * sin, HEART_BASELINE - scale * rise);
  };
  return markLine((t) => {
    for (const [at, reach] of HEART_JOINS) {
      if (Math.abs(t - at) < reach) {
        return quadraticPoint(
          (t - (at - reach)) / (2 * reach),
          heartPoint(at - reach),
          heartPoint(at),
          heartPoint(at + reach),
        );
      }
    }
    return heartPoint(t);
  });
}

const CHECK_START = point(-12.5, 1);
const CHECK_CORNER = point(-1.5, 10);
const CHECK_END = point(12.5, -10);
const CHECK_CORNER_AT = 0.37;
const CHECK_ROUNDING = 0.07;

function checkPoint(t: number): Point {
  return t < CHECK_CORNER_AT
    ? lerpPoint(CHECK_START, CHECK_CORNER, t / CHECK_CORNER_AT)
    : lerpPoint(CHECK_CORNER, CHECK_END, (t - CHECK_CORNER_AT) / 0.63);
}

/** A tick that pops every 3.2 s. */
function doneLine(time: number): MarkLine {
  const pop = clamp01(fract(time / 3.2) / 0.22);
  const scale = 1 + 0.07 * Math.sin(Math.PI * pop) * (1 - pop) * 2;
  return markLine((t) => {
    const reach = CHECK_ROUNDING;
    // 0.3 and 0.44 are the corner ± its rounding.
    const p =
      Math.abs(t - CHECK_CORNER_AT) < reach
        ? quadraticPoint((t - 0.3) / (2 * reach), checkPoint(0.3), CHECK_CORNER, checkPoint(0.44))
        : checkPoint(t);
    return point(p.x * scale, p.y * scale);
  });
}

/** A zigzag that shakes every 2.2 s. */
function errorLine(time: number): MarkLine {
  const sinceShake = fract(time / 2.2) * 2.2;
  const shake = 1.8 * Math.sin(TAU * 9 * sinceShake) * Math.exp(-sinceShake * 4);
  return markLine((t) => {
    const zigzag = 4 * Math.abs(fract(2.5 * t + 0.25) - 0.5) - 1;
    return point(lerp(-17, 17, t) + shake, 9 * zigzag * (0.6 + 0.4 * Math.sin(Math.PI * t)));
  });
}

const SAW_SEEDS: readonly [number, number] = [12.9898, 78.233];

function sawNoise(tooth: number, cycle: number): number {
  return hashNoise(tooth, cycle, SAW_SEEDS);
}

/** Alternating tall and short teeth, jittered per cycle. */
function sawPeak(tooth: number, cycle: number): number {
  return (clampInt(tooth + cycle, 0, 1e6) % 2 === 0 ? 1.1 : 0.46) + 0.3 * (sawNoise(tooth, cycle) - 0.5);
}

function sawTrough(tooth: number, cycle: number): number {
  return 0.55 + 0.45 * sawNoise(tooth + 31, cycle);
}

/** Irregular saw teeth that rise and fall every 2.6 s, re-rolled each cycle. */
function sawLine(time: number, smallness: number): MarkLine {
  const teeth = lerp(3.2, 2.5, smallness);
  const period = 2.6;
  const cycle = Math.floor(time / period);
  const at = fract(time / period);
  const envelope = at < 0.14 ? smoothstep(at / 0.14) : at < 0.5 ? 1 : at < 0.84 ? 1 - smoothstep((at - 0.5) / 0.34) : 0;
  const height = lerp(0.26, 1, envelope);
  const toNextCycle = at < 0.84 ? 0 : smoothstep((at - 0.84) / 0.16);
  const jitter =
    0.9 * Math.sin(TAU * 6 * time) * Math.exp(-time * 5) +
    0.18 * envelope * Math.sin(TAU * 3.5 * time + 1.3 * Math.sin(TAU * 0.9 * time));
  const peak = (tooth: number) => lerp(sawPeak(tooth, cycle), sawPeak(tooth, cycle + 1), toNextCycle);
  const trough = (tooth: number) => lerp(sawTrough(tooth, cycle), sawTrough(tooth, cycle + 1), toNextCycle);
  return markLine((t) => {
    const rise = 0.8;
    const along = teeth * t + 0.2;
    const tooth = Math.floor(along);
    const within = along - tooth;
    // 0.19999999999999996 is 1 − 0.8 as the original computed it.
    const level =
      within < rise
        ? lerp(-trough(tooth), peak(tooth), within / rise)
        : lerp(peak(tooth), -trough(tooth + 1), (within - rise) / 0.19999999999999996);
    return point(lerp(-21, 21, t) + jitter, -9.5 * height * level * (0.7 + 0.3 * Math.sin(Math.PI * t)));
  });
}

/** A spiral that turns slowly and kicks every 2.2 s. */
function spiralLine(time: number, smallness: number): MarkLine {
  const turns = lerp(1.7, 1.4, smallness);
  const sinceKick = fract(time / 2.2) * 2.2;
  const start = -0.5 + 0.3 * Math.sin(TAU * 9 * sinceKick) * Math.exp(-sinceKick * 4) - TAU * 0.6 * time;
  return markLine((t) => {
    const angle = TAU * turns * t + start;
    const r = 1.2 + 16 * t ** 0.9;
    return point(r * Math.cos(angle), r * Math.sin(angle));
  });
}

const SUN_HORIZON = 9;
const SUN_RADIUS = 15;

/** A sun bobbing behind a horizon: the ring is clipped flat at y = 6.8. */
function notificationShape(time: number): Ring {
  const horizon = 6.8;
  const height = horizon + 1.6 * Math.sin(TAU * 0.07 * time);
  const cut = Math.asin(Math.max(-0.95, Math.min(0.95, (horizon - height) / SUN_RADIUS)));
  return sampleRing(SUN_RADIUS, (t) => {
    const angle = Math.PI - cut + (Math.PI + 2 * cut) * t;
    return point(SUN_RADIUS * Math.cos(angle), Math.min(horizon, height + SUN_RADIUS * Math.sin(angle)));
  });
}

const RING_15 = circleRing(ORIGIN, 15);
const RING_17 = circleRing(ORIGIN, 17);
const RING_18 = circleRing(ORIGIN, 18);
const RING_19 = circleRing(ORIGIN, 19);

export const MARKS: Readonly<Record<MarkName, MarkDesign>> = {
  idle: markDesign({ stillSecond: 2, shape: idleShape }),
  calm: markDesign({ stillSecond: 1, shape: () => CALM_RING }),
  tilde: markDesign({
    stillSecond: 0,
    restsEvery: 1 / (TILDE_WAVE_RATE * TILDE_TIME_SCALE),
    shape: tildeShape,
    line: tildeLine,
  }),
  thinking: markDesign({
    stillSecond: 1.3,
    shape: (time) => circleRing(ORIGIN, thinkingRadius(time) * 1.08),
    line: thinkingLine,
  }),
  think1: markDesign({ stillSecond: 0.8, shape: () => RING_17, line: thinkOneLine }),
  orbit: markDesign({ stillSecond: 1, shape: () => RING_15, line: orbitLine }),
  reading: markDesign({
    stillSecond: 1.4,
    samples: 220,
    shape: (time, smallness) => {
      const { place, size } = readingLoop(time, smallness);
      return circleRing(point(-36 + 72 * place, 11 - size), size * 1.15);
    },
    line: (time, smallness) => {
      const { place, size } = readingLoop(time, smallness);
      return markLine((t) => {
        const angle = TAU * smoothstep((t - place) / 0.42 + 0.5);
        return point(
          -36 + 72 * t + size * Math.sin(angle),
          11 - size * (1 - Math.cos(angle)) + 1.5 * Math.sin(TAU * (1.5 * t - 0.4 * time)),
        );
      });
    },
  }),
  working: markDesign({ stillSecond: 0.5, samples: 220, shape: () => RING_18, line: workingLine }),
  connecting: markDesign({ stillSecond: 1.98, shape: connectingShape }),
  signal: markDesign({ stillSecond: 4.5, shape: () => RING_18, line: signalLine }),
  writing: markDesign({
    stillSecond: 1,
    samples: 220,
    timing: { leaves: 0.7 },
    shape: () => RING_18,
    line: writingLine,
  }),
  waiting: markDesign({
    stillSecond: 0.07,
    timing: { speed: 0.7 },
    shape: () => RING_19,
    line: waitingLine,
  }),
  done: markDesign({
    stillSecond: 0.45,
    rays: { kind: "burst" },
    timing: { arrives: 0.6 },
    shape: () => RING_17,
    line: doneLine,
  }),
  error: markDesign({ stillSecond: 0.3, shape: () => RING_17, line: errorLine }),
  saw: markDesign({ stillSecond: 0.6, shape: () => RING_17, line: sawLine }),
  spiral: markDesign({ stillSecond: 0.5, shape: () => RING_17, line: spiralLine }),
  notification: markDesign({
    stillSecond: 1.6,
    rays: { kind: "sun", horizon: SUN_HORIZON, radius: SUN_RADIUS },
    shape: notificationShape,
    line: (time) =>
      markLine((t) => point(-33 + 66 * t, SUN_HORIZON + 1.2 * Math.sin(TAU * (1.2 * t - 0.15 * time)))),
  }),
  loops: LOOPS_MARK,
};
