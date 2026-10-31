// The live mascot's animation state. A continuous clock is sampled into line
// frames (12 fps, hand-drawn feel) and shape frames (8 fps); changes between
// marks run on Hermite-eased progress that can reverse or be re-aimed midway;
// and a mark with rest poses can glide to a stop on one.
import type { MarkName } from "./app-symbols";
import { currentRing, type MarkMoment, type MarkPhase } from "./draw-moment";
import type { MarkTiming, Ring } from "./mark-design";
import { MARKS } from "./marks";
import { clamp01, easeInOutCubic, lerp, smoothstep } from "./math";
import { LARGE_SEAT_CLOCK_RATE } from "./tuning";

/** Longest step one call advances, so a stalled tab doesn't jump. */
const MAX_STEP_SECONDS = 0.25;
/** Line frames spent slowing into a rest pose. */
const REST_SLOWDOWN_FRAMES = 1.5;
const CALM_FADE_SECONDS = 1;
const SHAPE_FRAMES_PER_SECOND = 8;

function timingOf(mark: MarkName): MarkTiming {
  return MARKS[mark].timing;
}

/** Frames elapsed at `rate` over `wholeSeconds + seconds`, counting the two parts separately. */
function frameNumber(rate: number, wholeSeconds: number, seconds: number): number {
  return Math.floor(wholeSeconds * rate) + Math.floor(seconds * rate + 1e-9);
}

/** Change progress needed to finish changing from `from` to `to`. */
function changeLength(from: MarkName, to: MarkName): number {
  return timingOf(from).leaves + timingOf(to).arrives;
}

/** Mark-clock seconds per real second: 2 at small seats, easing to 1.2 by 240 px. */
function clockRate(points: number): number {
  if (!Number.isFinite(points) || points <= 0) return 2;
  const t = clamp01(Math.log(points / 48) / Math.log(5));
  return lerp(2, LARGE_SEAT_CLOCK_RATE, t);
}

/** Cubic Hermite over [0, duration] between `values` with end `slopes`. */
function hermite(
  t: number,
  duration: number,
  values: readonly [number, number],
  slopes: readonly [number, number],
): number {
  const s = t / duration;
  const s2 = s * s;
  const s3 = s2 * s;
  return (
    (2 * s3 - 3 * s2 + 1) * values[0] +
    (s3 - 2 * s2 + s) * duration * slopes[0] +
    (3 * s2 - 2 * s3) * values[1] +
    (s3 - s2) * duration * slopes[1]
  );
}

/** Eased 0–1 progress after `run` seconds of a change; reaches 0.5 as the old mark finishes leaving. */
function changeProgress(run: number, from: MarkName, to: MarkName): number {
  const leaves = timingOf(from).leaves;
  const arrives = timingOf(to).arrives;
  if (!(run > 0)) return 0;
  if (!(run < leaves + arrives)) return 1;
  const slope = 1 / (leaves + arrives);
  return run < leaves
    ? hermite(run, leaves, [0, 0.5], [0.5 / leaves, slope])
    : hermite(run - leaves, arrives, [0.5, 1], [slope, 0.5 / arrives]);
}

/** The run within the leaving half that gives `progress` (bisection). */
function runForProgress(progress: number, from: MarkName, to: MarkName): number {
  let low = 0;
  let high = timingOf(from).leaves;
  for (let i = 0; i < 48; i += 1) {
    const middle = (low + high) / 2;
    if (changeProgress(middle, from, to) < progress) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

interface FrameTrack {
  /** Frame index of the last sample. */
  number: number;
  /** Clock value sampled at that frame. */
  clock: number;
  /** Change run sampled at that frame. */
  changed: number;
}

interface MarkChange {
  from: MarkName;
  /** Clock when the mark being left began. */
  fromBegan: number;
  /** Set when the change is re-aimed: the shape morphs from this frozen ring. */
  ring: Ring | null;
  glidedBefore: number;
  /** Seconds of change progress, scaled by the clock rate. */
  run: number;
  /** Real seconds since the change started. */
  age: number;
  shapeStep: number;
  isReturning: boolean;
}

interface RestPoint {
  /** Clock value of the rest pose. */
  at: number;
  /** Clock distance over which it decelerates. */
  slowsOver: number;
}

export class MarkClock {
  /** A mark asked for while a change is past halfway; it starts next. */
  private waiting: MarkName | null = null;
  private change: MarkChange | null = null;
  private wholeSeconds = 0;
  private seconds = 0;
  private line: FrameTrack = { number: -1, clock: 0, changed: 0 };
  private shape: FrameTrack = { number: -1, clock: 0, changed: 0 };
  private reached: number | null = 0;
  private last: MarkMoment | null = null;
  private askedLast: MarkName | null = null;
  /** Set by the owner when the mascot may settle onto a rest pose. */
  comesToRest = false;
  private rest: RestPoint | null = null;
  private calm = 0;
  private drawnCalm = 0;
  private showing: MarkName;
  private clock: number;
  /** Clock value at which the showing mark's state time was 0; null until the next moment fixes it. */
  private began: number | null;
  private readonly lineFramesPerSecond: number;

  constructor(showing: MarkName, clock: number, lineFramesPerSecond: number) {
    this.showing = showing;
    this.clock = clock;
    this.began = clock - clock / timingOf(showing).speed;
    this.lineFramesPerSecond = lineFramesPerSecond;
  }

  /** Advances by `elapsed` real seconds towards showing `mark` and returns the moment to draw. */
  moment(elapsed: number, mark: MarkName, points: number): MarkMoment {
    const step = Number.isFinite(elapsed) ? Math.min(Math.max(elapsed, 0), MAX_STEP_SECONDS) : 0;
    const rate = clockRate(points);
    this.seconds += step;
    this.wholeSeconds += Math.floor(this.seconds);
    this.seconds -= Math.floor(this.seconds);

    const restsHere = this.comesToRest && this.change === null && mark === this.showing;
    if (!restsHere) this.rest = null;
    const towardRest = restsHere ? this.wayToRest(step, rate) : null;
    this.clock = towardRest?.clock ?? this.clock + step * rate;
    this.calm = Math.max(towardRest?.calm ?? 0, this.calm - step / CALM_FADE_SECONDS);
    if (this.change) {
      const signedStep = this.change.isReturning ? -step : step;
      this.change.age += step;
      this.change.run = Math.max(0, this.change.run + signedStep * rate);
    }

    this.show(mark);
    this.askedLast = mark;
    if (this.step(rate)) this.drawnCalm = this.calm;
    this.end();

    const began = this.began ?? this.line.clock;
    this.began = began;
    const speed = timingOf(this.showing).speed;
    const stateTime = (this.line.clock - began) * speed;
    const moment: MarkMoment = {
      state: this.showing,
      points,
      clock: this.line.clock,
      shapeClock: this.shape.clock,
      stateTime,
      shapeStateTime: (this.shape.clock - began) * speed,
      phase: this.phase(stateTime),
      calm: this.drawnCalm,
    };
    this.last = moment;
    return moment;
  }

  /** At rest on a pose, with every frame caught up and fully calm. */
  get stands(): boolean {
    return (
      this.rest !== null &&
      this.clock === this.rest.at &&
      this.line.clock === this.clock &&
      this.shape.clock === this.clock &&
      this.drawnCalm === 1
    );
  }

  /** Lets a standing mascot move on toward its next rest pose. */
  stir(): void {
    if (this.stands) this.rest = null;
  }

  /** Where the clock should be after `elapsed` seconds when heading for a rest pose. */
  private wayToRest(elapsed: number, rate: number): { clock: number; calm: number } | null {
    const every = MARKS[this.showing].restsEvery;
    if (every === null || this.began === null) return null;
    this.rest ??= this.restAhead(every, this.began, rate);
    const rest = this.rest;
    const left = rest.at - this.clock;
    if (!(left > 0)) return { clock: rest.at, calm: 1 };
    const cruise = Math.max(0, left - rest.slowsOver);
    if (!(elapsed * rate >= cruise)) return { clock: this.clock + elapsed * rate, calm: 0 };
    // Constant deceleration over `slowsOver`: time to stop from full rate, and time still left.
    const stopTime = (2 * rest.slowsOver) / rate;
    const timeLeft = stopTime * Math.sqrt((left - cruise) / rest.slowsOver);
    const remaining = Math.max(0, timeLeft - (elapsed - cruise / rate)) / stopTime;
    return remaining >= 1 / (this.lineFramesPerSecond * REST_SLOWDOWN_FRAMES) + 1e-9
      ? { clock: rest.at - rest.slowsOver * remaining * remaining, calm: smoothstep(1 - remaining) }
      : { clock: rest.at, calm: 1 };
  }

  /** The first rest pose far enough ahead to slow into. */
  private restAhead(every: number, began: number, rate: number): RestPoint {
    const design = MARKS[this.showing];
    const slowsOver = (rate * REST_SLOWDOWN_FRAMES) / 2;
    const poses = Math.ceil(((this.clock - began + slowsOver) * design.timing.speed - design.stillSecond) / every);
    return { at: began + (design.stillSecond + poses * every) / design.timing.speed, slowsOver };
  }

  private phase(stateTime: number): MarkPhase {
    const change = this.change;
    if (!change) {
      const reached = this.reached ?? stateTime;
      this.reached = reached;
      return { kind: "steady", sinceReached: stateTime - reached };
    }
    const speed = timingOf(change.from).speed;
    return {
      kind: "changing",
      change: {
        from: change.from,
        stateTime: (this.line.clock - change.fromBegan) * speed,
        shape: change.ring
          ? { kind: "ring", ring: change.ring }
          : { kind: "state", time: (this.shape.clock - change.fromBegan) * speed },
        progress: changeProgress(this.line.changed, change.from, this.showing),
        shapeProgress: changeProgress(this.shape.changed, change.from, this.showing),
        glidedBefore: change.glidedBefore,
      },
    };
  }

  /** Steers toward `mark`: starts, reverses, queues or re-aims a change. */
  private show(mark: MarkName): void {
    const change = this.change;
    if (!change) {
      if (mark !== this.showing) this.begin(mark);
      return;
    }
    if (mark === (this.waiting ?? (change.isReturning ? change.from : this.showing))) return;
    if (mark === this.showing) {
      this.waiting = null;
      if (change.isReturning) change.run = this.line.changed;
      change.isReturning = false;
      return;
    }
    if (mark === change.from && change.ring === null) {
      change.run = this.line.changed;
      change.isReturning = true;
      this.waiting = null;
      return;
    }
    const progress = changeProgress(change.run, change.from, this.showing);
    if (!(progress < 0.5)) {
      if (!change.isReturning) this.waiting = mark;
      return;
    }
    if (mark !== this.askedLast || this.lineNumber() !== this.line.number) {
      change.isReturning = false;
      this.takeAim(change, mark, progress);
    }
  }

  private begin(mark: MarkName): void {
    this.change = {
      from: this.showing,
      fromBegan: this.began ?? this.clock,
      ring: null,
      glidedBefore: 0,
      run: 0,
      age: 0,
      shapeStep: -1,
      isReturning: false,
    };
    this.showing = mark;
    this.began = null;
    this.reached = null;
    this.line.changed = 0;
    this.shape.changed = 0;
  }

  /** Re-aims a change still in its first half at `mark`, keeping its progress. */
  private takeAim(change: MarkChange, mark: MarkName, progress: number): void {
    const last = this.last;
    if (last?.phase.kind === "changing") {
      change.ring = currentRing(last);
      change.glidedBefore = easeInOutCubic(last.phase.change.shapeProgress);
    }
    change.run = runForProgress(progress, change.from, mark);
    change.shapeStep = frameNumber(SHAPE_FRAMES_PER_SECOND, 0, change.age);
    this.showing = mark;
    this.began = null;
    this.reached = null;
    this.waiting = null;
    this.line.changed = change.run;
    this.shape.changed = change.run;
  }

  /** Finishes a change that has run out, and starts any waiting one. */
  private end(): void {
    const change = this.change;
    if (!change) return;
    if (change.isReturning) {
      if (!(this.line.changed <= 0)) return;
      this.showing = change.from;
      this.began = change.fromBegan;
      this.reached = null;
      this.change = null;
    } else if (this.line.changed >= changeLength(change.from, this.showing)) {
      this.change = null;
      if (this.waiting) {
        const waiting = this.waiting;
        this.waiting = null;
        this.begin(waiting);
      }
    }
  }

  private lineNumber(): number {
    return frameNumber(this.lineFramesPerSecond, this.wholeSeconds, this.seconds);
  }

  /** Real seconds until the next line or shape frame (or whole second). */
  get untilNextStep(): number {
    // Just under the next frame boundary at `rate`, measured from `t`.
    const untilFrame = (rate: number, t: number) => (Math.floor(t * rate + 1e-9) + 1 - 5e-10) / rate - t;
    return Math.min(
      1 - this.seconds,
      untilFrame(this.lineFramesPerSecond, this.seconds),
      untilFrame(SHAPE_FRAMES_PER_SECOND, this.seconds),
      this.change ? untilFrame(SHAPE_FRAMES_PER_SECOND, this.change.age) : Infinity,
    );
  }

  /** Samples the clock into line and shape frames; true when a new line frame began. */
  private step(rate: number): boolean {
    const lineNumber = this.lineNumber();
    const newLine = lineNumber !== this.line.number;
    if (newLine) {
      this.line = { number: lineNumber, clock: this.clock, changed: this.change?.run ?? 0 };
    }
    const shapeNumber = frameNumber(SHAPE_FRAMES_PER_SECOND, this.wholeSeconds, this.seconds);
    if (shapeNumber !== this.shape.number) {
      this.shape.number = shapeNumber;
      this.shape.clock = this.clock;
    }
    const change = this.change;
    if (!change) return newLine;
    const shapeStep = frameNumber(SHAPE_FRAMES_PER_SECOND, 0, change.age);
    if (shapeStep === change.shapeStep) return newLine;
    change.shapeStep = shapeStep;
    // The shape's change progress lags by however far into this shape frame the change is.
    const intoFrame = change.age - shapeStep / SHAPE_FRAMES_PER_SECOND;
    this.shape.changed = change.isReturning
      ? Math.min(this.shape.changed, change.run + intoFrame * rate)
      : Math.max(this.shape.changed, change.run - intoFrame * rate, 0);
    return newLine;
  }
}
