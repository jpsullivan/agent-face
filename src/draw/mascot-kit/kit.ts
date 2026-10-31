// The mascot kit: picks a mark for a face frame, builds still or live drawings
// of it, and paints drawings into 2D canvases (skipping repeats per context).
import type { FaceFrame } from "@/face/engine";
import { FACE_GLYPHS, PROP_CODES, type FaceState, type PropName } from "@/face/face-codes";
import {
  DEFAULT_MARK,
  isNothingHeld,
  MARK_FOR_FACE_STATE,
  MARK_FOR_PROP,
  MARK_NAMES,
  STIR_DELAY_RANGE_MS,
  type MarkName,
} from "./app-symbols";
import { drawMoment, stillMoment, zoomDrawing, type MarkMoment } from "./draw-moment";
import { MarkClock } from "./mark-clock";
import { MARKS } from "./marks";
import { paintDrawing, type MascotDrawing } from "./paint";
import { MASCOT_PALETTE, SPOT_HEX } from "./palette";
import { CLOSER_ZOOM } from "./tuning";

/** The parts of a face frame the kit reads. */
export type MascotFrame = Pick<FaceFrame, "glyph" | "face">;

export interface MascotDrawOptions {
  /** Forces this mark instead of deriving one from the frame. */
  mascot?: MarkName | null;
  /** CSS px the face occupies. */
  seat: number;
  /** Only `true` lets a still default to the tilde; otherwise it shows calm. */
  moves?: boolean;
  /** Zooms resting shape-only marks (idle, calm) in by 1.5×. */
  closer?: boolean;
}

export interface LiveMascot {
  /** The drawing for `nowMs`; returns the same object while nothing visible changed. */
  drawing(frame: MascotFrame, options: MascotDrawOptions, nowMs: number, lastInputMs?: number): MascotDrawing;
  /** Forgets all animation state; the next drawing starts fresh. */
  rest(): void;
  /** When the drawing next changes, on the same clock as `nowMs`; 0 before the first drawing. */
  nextChangeAtMs(): number;
  /** Standing still on a rest pose (a good moment to react to input). */
  stands(): boolean;
  /** Showing idle, calm or tilde with no change in progress. */
  isAtRest(): boolean;
}

export interface MascotKit {
  still(frame: MascotFrame, options: MascotDrawOptions): MascotDrawing;
  /** A still of `options.mascot` (default idle), always framed closer; ignores the frame. */
  picture(frame: MascotFrame, options: MascotDrawOptions): MascotDrawing;
  live(): LiveMascot;
  /** Paints into a `side`×`side` canvas; false when nothing could be drawn. */
  paint(context: CanvasRenderingContext2D, drawing: MascotDrawing, side: number, isDark: boolean): boolean;
  /** The paper colour drawings are designed against. */
  groundHex(): string;
}

/** Engine glyphs and wearable codes only ever arrive as numbers. */
const STATE_BY_GLYPH = invert<FaceState>(FACE_GLYPHS);
const PROP_BY_CODE = invert<PropName>(PROP_CODES);

/** After this long without input or a change, a live mascot may come to rest. */
const REST_AFTER_IDLE_MS = 8e3;
const LINE_FRAMES_PER_SECOND = 12;

function invert<K extends string>(record: Readonly<Record<K, number>>): Map<number, K> {
  return new Map((Object.keys(record) as K[]).map((key) => [record[key], key]));
}

function markFor(frame: MascotFrame, options: MascotDrawOptions): MarkName | null {
  if (options.mascot) return options.mascot;
  // A prop being set down no longer counts.
  const prop = frame.face.fling[3] > 0 ? undefined : PROP_BY_CODE.get(frame.face.kind);
  if (prop !== undefined) return MARK_FOR_PROP[prop];
  const state = STATE_BY_GLYPH.get(frame.glyph);
  return state === undefined ? null : MARK_FOR_FACE_STATE[state];
}

/** Marks with no line: their steady pictures depend only on shape time. */
const SHAPE_ONLY_MARKS = new Set(MARK_NAMES.filter((mark) => MARKS[mark].line(0, 0) === null));

/** True when two moments would draw the same picture. */
function drawsSame(a: MarkMoment, b: MarkMoment): boolean {
  const aPhase = a.phase;
  const bPhase = b.phase;
  if (
    a.state !== b.state ||
    a.points !== b.points ||
    a.shapeClock !== b.shapeClock ||
    a.shapeStateTime !== b.shapeStateTime ||
    a.calm !== b.calm ||
    aPhase.kind !== bPhase.kind
  ) {
    return false;
  }
  if (aPhase.kind === "steady" && SHAPE_ONLY_MARKS.has(a.state)) return true;
  return (
    a.clock === b.clock &&
    a.stateTime === b.stateTime &&
    (aPhase.kind === "steady"
      ? bPhase.kind === "steady" && aPhase.sinceReached === bPhase.sinceReached
      : bPhase.kind === "changing" &&
        aPhase.change.from === bPhase.change.from &&
        aPhase.change.progress === bPhase.change.progress &&
        aPhase.change.shapeProgress === bPhase.change.shapeProgress)
  );
}

function isRestingMark(mark: MarkName): boolean {
  return mark === "idle" || mark === "calm" || mark === "tilde";
}

function zoomFor(mark: MarkName, closer: boolean): number {
  return closer && SHAPE_ONLY_MARKS.has(mark) && isRestingMark(mark) ? CLOSER_ZOOM : 1;
}

function stillDrawing(mark: MarkName, seat: number, closer: boolean): MascotDrawing {
  const zoom = zoomFor(mark, closer);
  return zoomDrawing(drawMoment(stillMoment(mark, seat * zoom), SPOT_HEX), zoom);
}

interface PaintedState {
  drawing: MascotDrawing;
  side: number;
  dark: boolean;
}

export function createAiboMascotKit(): MascotKit {
  const painted = new WeakMap<CanvasRenderingContext2D, PaintedState>();
  return {
    still(frame, options) {
      const mark = markFor(frame, options) ?? "tilde";
      return stillDrawing(
        mark === "tilde" && !options.mascot && options.moves !== true ? "calm" : mark,
        options.seat,
        options.closer === true,
      );
    },
    picture: (_frame, options) => stillDrawing(options.mascot ?? "idle", options.seat, true),
    live() {
      let clock: MarkClock | undefined;
      let lastMs: number | undefined;
      let showing: MarkName = DEFAULT_MARK;
      let shown: { moment: MarkMoment; drawing: MascotDrawing } | undefined;
      let activeAtMs: number | undefined;
      let stirAtMs: number | undefined;
      return {
        drawing(frame, options, nowMs, lastInputMs) {
          showing = markFor(frame, options) ?? showing;
          const elapsed = lastMs === undefined || clock?.stands === true ? 0 : (nowMs - lastMs) / 1e3;
          lastMs = nowMs;
          clock ??= new MarkClock(showing, MARKS[showing].stillSecond, LINE_FRAMES_PER_SECOND);
          activeAtMs = Math.max(activeAtMs ?? nowMs, lastInputMs ?? 0);
          clock.comesToRest = lastInputMs !== undefined && nowMs - activeAtMs >= REST_AFTER_IDLE_MS && isNothingHeld();
          if (stirAtMs !== undefined && nowMs >= stirAtMs) {
            stirAtMs = undefined;
            clock.stir();
          }
          const zoom = zoomFor(showing, options.closer === true);
          const moment = clock.moment(elapsed, showing, options.seat * zoom);
          if (moment.phase.kind === "changing") activeAtMs = nowMs;
          if (!clock.stands) {
            stirAtMs = undefined;
          } else if (stirAtMs === undefined) {
            const [soonest, latest] = STIR_DELAY_RANGE_MS;
            stirAtMs = nowMs + soonest + Math.random() * (latest - soonest);
          }
          if (shown === undefined || !drawsSame(shown.moment, moment)) {
            shown = { moment, drawing: zoomDrawing(drawMoment(moment, SPOT_HEX), zoom) };
          }
          return shown.drawing;
        },
        rest() {
          clock = undefined;
          lastMs = undefined;
          shown = undefined;
          activeAtMs = undefined;
          stirAtMs = undefined;
          showing = DEFAULT_MARK;
        },
        nextChangeAtMs() {
          if (clock === undefined || lastMs === undefined) return 0;
          return clock.stands ? (stirAtMs ?? Infinity) : lastMs + clock.untilNextStep * 1e3;
        },
        stands: () => clock?.stands === true,
        isAtRest: () => shown !== undefined && shown.moment.phase.kind === "steady" && isRestingMark(shown.moment.state),
      };
    },
    paint(context, drawing, side, isDark) {
      const last = painted.get(context);
      if (last?.drawing === drawing && last.side === side && last.dark === isDark) return true;
      const ok = paintDrawing(context, drawing, MASCOT_PALETTE, isDark, side);
      if (ok) painted.set(context, { drawing, side, dark: isDark });
      else painted.delete(context);
      return ok;
    },
    groundHex: () => MASCOT_PALETTE.paper,
  };
}
