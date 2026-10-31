// Turns one moment of a mark (which mark, its clocks, and any change in
// progress) into a drawing: line pieces behind the shape, the filled shape,
// rays, line pieces in front, and the bead.
import { clampInt, distance, lineTo, moveTo, type PathPart, type Point } from "@/draw/path-data";
import type { LinePaint } from "@/draw/line-paint";
import type { MarkName } from "./app-symbols";
import { smoothClosedParts } from "./geometry";
import { dotParts, handStrokeParts, WHOLE_STROKE, type StrokeHand, type StrokeSpan } from "./hand-stroke";
import type { MarkLine, Ring } from "./mark-design";
import { MARKS } from "./marks";
import { clamp01, easeInOutCubic, easeOutBlend, fract, lerp, lerpPoint, smoothstep, TAU } from "./math";
import type { DrawStep, MascotDrawing } from "./paint";
import {
  LINE_WIDTH,
  LINE_WIDTH_BOOST,
  LINE_WIDTH_SCALE,
  MARK_BOX,
  MARK_OFFSET,
  SHAPE_WOBBLE_AMOUNT,
  SHAPE_WOBBLE_SPEED,
  SMALL_LINE_GROWTH,
  smallnessForSeat,
} from "./tuning";

export interface MarkChangeMoment {
  from: MarkName;
  /** State time of the mark being left. */
  stateTime: number;
  /** What the shape is morphing from: the old mark's shape, or a ring frozen mid-change. */
  shape: { kind: "ring"; ring: Ring } | { kind: "state"; time: number };
  /** Line change progress, 0–1. */
  progress: number;
  /** Shape change progress, 0–1 (steps at 8 fps). */
  shapeProgress: number;
  /** How far the shape had already glided when the change was re-aimed. */
  glidedBefore: number;
}

export type MarkPhase = { kind: "steady"; sinceReached: number } | { kind: "changing"; change: MarkChangeMoment };

export interface MarkMoment {
  state: MarkName;
  /** Seat size in CSS px, times any zoom. */
  points: number;
  clock: number;
  shapeClock: number;
  stateTime: number;
  shapeStateTime: number;
  phase: MarkPhase;
  calm: number;
}

/** The moment a still picture of `state` shows. */
export function stillMoment(state: MarkName, points: number, time: number = MARKS[state].stillSecond): MarkMoment {
  return {
    state,
    points,
    clock: time,
    shapeClock: time,
    stateTime: time,
    shapeStateTime: time,
    phase: { kind: "steady", sinceReached: time },
    calm: 0,
  };
}

/** Shrinks the drawing's box about its centre so the drawing appears `zoom` times larger. */
export function zoomDrawing(drawing: MascotDrawing, zoom: number): MascotDrawing {
  const { box } = drawing;
  return {
    ...drawing,
    box: {
      x: box.x + (box.width * (1 - 1 / zoom)) / 2,
      y: box.y + (box.height * (1 - 1 / zoom)) / 2,
      width: box.width / zoom,
      height: box.height / zoom,
    },
  };
}

const LINE_INK: LinePaint = { kind: "line" };

function fillStep(parts: PathPart[]): DrawStep {
  return { kind: "fill", parts, ink: LINE_INK, opacity: 1 };
}

function strokeStep(parts: PathPart[], width: number): DrawStep {
  return { kind: "stroke", parts, width, ink: LINE_INK, opacity: 1 };
}

interface ShownLine {
  line: MarkLine;
  stretch: [number, number];
  bead: number;
}

/** During a change the old line retracts over the first half, then the new one draws out. */
function crossfadeLines(from: MarkLine | null, to: MarkLine | null, progress: number): ShownLine | null {
  const keepsBead = (from?.beadComesWithTheLine ?? false) || (to?.beadComesWithTheLine ?? false);
  const bead = lerp(from?.bead ?? 0, to?.bead ?? 0, easeInOutCubic(progress));
  if (to !== null && (from === null || progress >= 0.5)) {
    const drawn = easeOutBlend(clamp01((progress - 0.5) / 0.5));
    if (!(drawn > 0)) return null;
    const end = lerp(to.stretch[0], to.stretch[1], drawn);
    return { line: to, stretch: [to.stretch[0], Math.max(to.stretch[0], end)], bead: keepsBead ? to.bead : bead };
  }
  if (from === null) return null;
  const retracted = smoothstep(clamp01(progress / 0.5));
  if (!(retracted < 1)) return null;
  const start = lerp(from.stretch[0], from.stretch[1], retracted);
  return { line: from, stretch: [Math.min(start, from.stretch[1]), from.stretch[1]], bead: keepsBead ? from.bead : bead };
}

/** Mean point, accumulated as a sum of x/n the way the original did. */
function centroid(points: readonly Point[]): Point {
  let x = 0;
  let y = 0;
  for (const point of points) {
    x += point.x / points.length;
    y += point.y / points.length;
  }
  return { x, y };
}

function shapeGlide(moment: MarkMoment): { share: number; pull: number } | null {
  if (moment.phase.kind !== "changing") return null;
  const { shapeProgress, glidedBefore } = moment.phase.change;
  const eased = easeInOutCubic(shapeProgress);
  const remaining = 1 - glidedBefore;
  return {
    share: remaining > 0 ? clamp01((eased - glidedBefore) / remaining) : 1,
    // Mid-change the shape draws in toward its centre.
    pull: 0.72 * Math.sin(Math.PI * eased),
  };
}

/** The shape ring at this moment, morphing between marks during a change. */
export function currentRing(moment: MarkMoment): Ring {
  const smallness = smallnessForSeat(moment.points);
  const target = MARKS[moment.state].shape(moment.shapeStateTime, smallness, moment.calm);
  const glide = shapeGlide(moment);
  if (moment.phase.kind !== "changing" || glide === null) return target;
  const { change } = moment.phase;
  const source =
    change.shape.kind === "state"
      ? MARKS[change.from].shape(change.shape.time, smallness, moment.calm)
      : change.shape.ring;
  return {
    points: source.points.map((point, i) => lerpPoint(point, target.points[i]!, glide.share)),
    isSplit: glide.share < 0.5 ? source.isSplit : target.isSplit,
    radius: lerp(source.radius, target.radius, glide.share),
  };
}

function shapeParts(moment: MarkMoment): PathPart[] | null {
  const ring = currentRing(moment);
  if (!(ring.radius > 0.6)) return null;
  let points = ring.points;
  const glide = shapeGlide(moment);
  if (glide !== null) {
    const center = centroid(points);
    const scale = 1 - 0.4 * glide.pull;
    points = points.map((p) => ({ x: center.x + (p.x - center.x) * scale, y: center.y + (p.y - center.y) * scale }));
  }
  const center = centroid(points);
  const phase = moment.shapeClock * SHAPE_WOBBLE_SPEED;
  // 0 at a 24 px seat, 1 at 108 px: small seats wobble more.
  const size = Math.log(Math.max(moment.points, 1) / 24) / Math.log(108 / 24);
  const amount = SHAPE_WOBBLE_AMOUNT * lerp(1.9, 1, clamp01(size));
  const wobbled = points.map((p) => {
    const dx = p.x - center.x;
    const dy = p.y - center.y;
    const angle = Math.atan2(dy, dx);
    const scale = 1 + 0.09 * amount * (Math.sin(3 * angle + 1.6 * phase) + 0.6 * Math.sin(5 * angle - 2.3 * phase));
    return { x: center.x + dx * scale + MARK_OFFSET.x, y: center.y + dy * scale + MARK_OFFSET.y };
  });
  if (!ring.isSplit) return smoothClosedParts(wobbled);
  const half = Math.floor(wobbled.length / 2);
  return [...smoothClosedParts(wobbled.slice(0, half)), ...smoothClosedParts(wobbled.slice(half))];
}

/** Draws `moment`, filling the shape with `spotHex`. */
export function drawMoment(moment: MarkMoment, spotHex: string): MascotDrawing {
  const smallness = smallnessForSeat(moment.points);
  const design = MARKS[moment.state];
  const line = design.line(moment.stateTime, smallness, moment.calm);
  let samples = design.samples;
  let weightShare = design.weightShare;
  let shown: ShownLine | null;
  if (moment.phase.kind === "steady") {
    shown = line && { line, stretch: line.stretch, bead: line.bead };
  } else {
    const { change } = moment.phase;
    const from = MARKS[change.from];
    samples = Math.max(samples, from.samples);
    shown = crossfadeLines(from.line(change.stateTime, smallness, moment.calm), line, change.progress);
    weightShare = lerp(from.weightShare, weightShare, easeInOutCubic(change.progress));
  }

  const lineWidth =
    LINE_WIDTH * LINE_WIDTH_SCALE * LINE_WIDTH_BOOST * lerp(1, SMALL_LINE_GROWTH, smallness) * weightShare;
  const hand: StrokeHand = {
    // Six hand poses a second, cycling through four phase sets.
    phase: clampInt(Math.floor(moment.clock * 6) % 4, 0, 3),
    time: moment.clock,
    share: (1 - smallness) * (shown?.line.handShare ?? 1),
  };
  const sampleCount = clampInt(Math.ceil(samples * lerp(1, 0.6, smallness)), 1, samples);
  const stroke = (points: Point[], width: number, seed: number, span: StrokeSpan): DrawStep => {
    if (hand.share > 0) return fillStep(handStrokeParts(points, width, seed, hand, span));
    const parts = points.map((p, i) => (i === 0 ? moveTo(p) : lineTo(p)));
    if (points.length === 1) parts.push(lineTo({ x: points[0]!.x + 0.01, y: points[0]!.y }));
    return strokeStep(parts, width);
  };
  const beadRadius = (bead: number) => lineWidth / 2 + bead * 0.4 * lineWidth;

  const behind: DrawStep[] = [];
  const front: DrawStep[] = [];
  let beadIsBehind = false;
  if (shown !== null) {
    const [from, to] = shown.stretch;
    const length = to - from;
    const at = (t: number) => shown.line.point(clamp01(t));
    if (length < 1e-4) {
      front.push(stroke([at(from)], lineWidth, 0, WHOLE_STROKE));
    } else if (length > 0.02 && shown.line.goesBehindTheShape) {
      // Sample the line, then split it into runs that are all behind or all in front.
      const count = clampInt(Math.ceil(sampleCount * length), 24, Math.max(24, sampleCount));
      const points: Point[] = [];
      const lengths: number[] = [];
      const isBehind: boolean[] = [];
      for (let i = 0; i <= count; i++) {
        const t = from + (length * i) / count;
        const p = at(t);
        lengths.push(i === 0 ? 0 : lengths[i - 1]! + distance(points[i - 1]!, p));
        points.push(p);
        isBehind.push(shown.line.isBehind(t));
      }
      let runStart = 0;
      for (let i = 1; i <= count + 1; i++) {
        if (i <= count && isBehind[i] === isBehind[runStart]) continue;
        // Each run reaches one sample back so neighbouring runs overlap.
        const first = Math.max(0, runStart - 1);
        const lastIndex = Math.min(count, i);
        const piece = stroke(points.slice(first, lastIndex + 1), lineWidth, 0, {
          startsAt: lengths[first]!,
          wholeLength: lengths[count]!,
          startIsCut: first > 0,
          endIsCut: lastIndex < count,
        });
        (isBehind[runStart] ? behind : front).push(piece);
        runStart = i;
      }
      beadIsBehind = shown.bead > 0.001 && from <= 0.5 && 0.5 <= to && shown.line.isBehind(0.5);
      if (beadIsBehind) behind.push(fillStep(dotParts(shown.line.point(0.5), beadRadius(shown.bead))));
    } else {
      const count = clampInt(Math.ceil(length * sampleCount), 1, Math.max(1, sampleCount));
      const points = Array.from({ length: count + 1 }, (_, i) => at(from + (length * i) / count));
      front.push(stroke(points, lineWidth, 0, WHOLE_STROKE));
    }
  }

  const ray = (inner: number, outer: number, angle: number, lift: number, index: number): DrawStep => {
    const points = [0, 1, 2, 3].map((i) => {
      const r = inner + ((outer - inner) * i) / 3;
      return { x: r * Math.cos(angle), y: lift + r * Math.sin(angle) };
    });
    return hand.share > 0
      ? stroke(points, lineWidth * 0.85, 9 + index * 1.7, WHOLE_STROKE)
      : strokeStep([moveTo(points[0]!), lineTo(points[3]!)], lineWidth * 0.85);
  };
  const rays: DrawStep[] = [];
  if (moment.phase.kind === "steady" && design.rays !== null) {
    const since = moment.phase.sinceReached;
    if (design.rays.kind === "burst") {
      // A burst 0.15 s after arriving, then every 3.2 s; each lasts 0.6 s.
      const sinceBurst = since - 0.15;
      const t = (fract(sinceBurst / 3.2) * 3.2) / 0.6;
      if (sinceBurst >= 0 && t < 1) {
        const count = smallness < 0.5 ? 8 : 6;
        const outerGrowth = smoothstep(t / 0.55);
        const innerGrowth = smoothstep((t - 0.3) / 0.7);
        for (let i = 0; i < count; i++) {
          const angle = (TAU * (i + 0.5)) / count - Math.PI / 2 + 0.14 * Math.sin(i * 2.3);
          const reach = 11 * (i % 2 === 0 ? 1 : 0.62);
          const inner = 24 + reach * innerGrowth;
          const outer = 24 + reach * outerGrowth;
          if (outer - inner >= 0.5) rays.push(ray(inner, outer, angle, 0, i));
        }
      }
    } else {
      const { horizon, radius } = design.rays;
      const base = radius + 1.5;
      // Five rays over the top half, the outer ones starting a little later; a 3 s cycle.
      [0.1, 0.05, 0, 0.05, 0.1].forEach((delay, i) => {
        const cycles = (since - 0.1) / 3 - delay;
        if (cycles < 0) return;
        const t = fract(cycles);
        const angle = Math.PI + (Math.PI * (i + 0.5)) / 5;
        const reach = 10 * (i % 2 === 0 ? 1 : 0.72);
        const outer = base + (5 + reach) * easeInOutCubic(t / 0.3);
        const inner = base + 5 * easeInOutCubic((t - 0.06) / 0.3) + reach * easeInOutCubic((t - 0.74) / 0.2);
        if (outer - inner >= 0.6) rays.push(ray(inner, outer, angle, horizon - 2, i));
      });
    }
  }

  const steps = [...behind];
  const shape = shapeParts(moment);
  if (shape !== null) steps.push({ kind: "fill", parts: shape, ink: { kind: "spot", hex: spotHex }, opacity: 1 });
  steps.push(...rays, ...front);
  if (!beadIsBehind && shown !== null && shown.bead > 0.001) {
    const fromMiddle = Math.min(0.5 - shown.stretch[0], shown.stretch[1] - 0.5);
    const grows = shown.line.beadComesWithTheLine ? smoothstep((fromMiddle + 0.06) / 0.06) : 1;
    const radius = beadRadius(shown.bead) * grows;
    if (radius > 0) steps.push(fillStep(dotParts(shown.line.point(0.5), radius)));
  }
  return { box: MARK_BOX, steps };
}
