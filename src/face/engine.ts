// The face engine: a small spring-physics simulation that turns "show this
// expression" plus a few gestures into one FaceFrame per tick. Renderers only
// paint frames; all timing (blinks, saccades, dwell, hats landing) lives here.
import {
  EMPTY_WEARABLE_FRAME,
  FACE_GLYPHS,
  NO_WEARABLE,
  isPropCode,
  minimumWearSeconds,
  slotForWearable,
  type FaceGlyph,
  type WearableCode,
  type WearableFrame,
  type WearableSlot,
} from "./face-codes";

type Vec2 = [number, number];

/**
 * Pose vector layout:
 * [eyeOpen, eyeWide, happy, gazeX, gazeY, tilt, squashX, squashY, breathRate]
 */
type Pose = number[];

const POSES: readonly Pose[] = [
  /* idle      */ [1, 1, 0, 0, 0, 0, 1, 1, 1],
  /* listening */ [1.19, 1.19, 0, 0, 0.55, -0.06, 1.03, 0.97, 1.4],
  /* thinking  */ [1, 1, 0, 0.55, -0.55, 0.1, 0.98, 1.02, 1.8],
  /* speaking  */ [1, 1, 0, 0, 0, 0, 1, 1, 1.6],
  /* happy     */ [1, 1.1, 1, 0, -0.1, 0, 1.05, 0.95, 1.6],
  /* confused  */ [1, 1, 0, 0, 0, 0.08, 1, 1, 1.2],
  /* sleeping  */ [0, 1, 0.15, 0, 0, 0.14, 1.04, 0.96, 0.6],
  /* error     */ [1, 1, 0, 0, 0, 0, 1, 1, 1],
  /* surprised */ [1.4, 1.25, 0, 0, -0.2, 0, 0.92, 1.12, 2.2],
];

const { idle, listening, thinking, speaking, happy, confused, sleeping, error, surprised } =
  FACE_GLYPHS;

const TIMING = {
  /** Minimum seconds an expression stays before the next one shows. */
  dwell: 1.2,
  reactionDwell: 1.5,
  blinkEvery: 5.5,
  blinkJitter: [0.75, 1.25] as Vec2,
  saccadeEvery: 11.5,
  saccadeJitter: [0.7, 1.3] as Vec2,
  /** Keep blinks and saccades at least this far apart so they read as separate events. */
  eventGap: 2,
  impulse: 0.6,
};

/** Idle opens glancing up and to the side. */
const OPENING_GLANCE: Vec2 = [0.55, -0.55];
/** Idle eyes: [eyeOpen, eyeWide, happy]. */
const IDLE_EYES: number[] = [1, 1.2, 0.8];

const MAX_ANIMATION_STEP = 0.25;
/** A gap this long between ticks is a pause (hidden tab), not slow frames. */
const STALL_SECONDS = 0.5;
const THINKING_LOOK_DELAY = 1.2;
const THINKING_LOOK_PERIOD = 4.5;
const SPRING_SLICE = 0.02;
const GLANCE_SPRING = { stiffness: 420, damping: 41, longestStep: 0.05 };
const REST_EPSILON = 0.002;
const HAT_FALL_SECONDS = 0.3;
const GESTURE_SECONDS = { wave: 0.6, nod: 0.5 };

function poseFor(glyph: FaceGlyph): Pose {
  return POSES[glyph] ?? POSES[idle]!;
}

/** The glyph's pose scaled toward idle by `amplitude` (1 = full expression). */
function blendedPose(glyph: FaceGlyph, amplitude: number): Pose {
  const base = poseFor(idle);
  return poseFor(glyph).map((value, i) => base[i]! + (value - base[i]!) * amplitude);
}

function dwellFor(glyph: FaceGlyph): number {
  return glyph === happy || glyph === surprised || glyph === confused || glyph === error
    ? TIMING.reactionDwell
    : TIMING.dwell;
}

/** Damped springs, integrated with semi-implicit Euler in fixed slices for stability. */
function stepSprings(
  position: number[],
  velocity: number[],
  target: readonly number[],
  stiffness: number,
  damping: number,
  dt: number,
): void {
  const slices = Math.max(1, Math.ceil(dt / SPRING_SLICE));
  const slice = dt / slices;
  for (let s = 0; s < slices; s++) {
    for (let i = 0; i < position.length; i++) {
      velocity[i]! += (stiffness * (target[i]! - position[i]!) - damping * velocity[i]!) * slice;
      position[i]! += velocity[i]! * slice;
    }
  }
}

function isAtRest(position: readonly number[], velocity: readonly number[], target: readonly number[]) {
  return position.every(
    (value, i) => Math.abs(value - target[i]!) < REST_EPSILON && Math.abs(velocity[i]!) < REST_EPSILON,
  );
}

function lerpRange([from, to]: Vec2, t: number): number {
  return from + (to - from) * t;
}

export interface FaceFrame {
  glyph: FaceGlyph;
  eyeOpen: number;
  eyeWide: number;
  happy: number;
  gaze: Vec2;
  tilt: number;
  squash: Vec2;
  blink: 0 | 1;
  wink: 0 | 1;
  bounce: number;
  spin: number;
  head: WearableFrame;
  face: WearableFrame;
  /** Body [tilt, bounce] followed by a stiff spring: hats lag slightly behind. */
  lag: Vec2;
  /** Same, on a loose spring: dangling bits swing. */
  swing: Vec2;
  time: number;
  breaths: number;
  amplitude: number;
  glance: Vec2;
}

interface FrameInput {
  pose: Pose;
  glyph: FaceGlyph;
  glance: Vec2;
  amplitude: number;
  blink: number;
  wink: number;
  bounce: number;
  spin: number;
  head: WearableFrame;
  face: WearableFrame;
  lag: Vec2;
  swing: Vec2;
  time: number;
  breaths: number;
  eyes?: number[];
}

function toFaceFrame(input: FrameInput): FaceFrame {
  const target = blendedPose(input.glyph, input.amplitude);
  const eyes = input.eyes ?? target;
  const wink = input.wink >= 0.5 ? 1 : 0;
  return {
    glyph: input.glyph,
    eyeOpen: eyes[0]!,
    eyeWide: eyes[1]!,
    happy: wink === 1 ? 0 : eyes[2]!,
    gaze: [target[3]! + input.glance[0], target[4]! + input.glance[1]],
    tilt: input.pose[5]!,
    squash: [input.pose[6]!, input.pose[7]!],
    blink: input.blink >= 0.5 ? 1 : 0,
    wink,
    bounce: input.bounce,
    spin: input.spin,
    head: input.head,
    face: input.face,
    lag: input.lag,
    swing: input.swing,
    time: input.time,
    breaths: input.breaths,
    amplitude: input.amplitude,
    glance: input.glance,
  };
}

/** Age given to wearables put on without animation, so they look long settled. */
const SETTLED_AGE = 10;
/** Constant acceleration that drops a hat from 0 to 1 in HAT_FALL_SECONDS. */
const FALL_ACCELERATION = 2 / (HAT_FALL_SECONDS * HAT_FALL_SECONDS);
const SEAT_STIFFNESS = 625;
const SEAT_DAMPING = 27.5;
const CROUCH_TARGET = 1.1;
const CROUCH_SECONDS = 0.09;
const THROW_GRAVITY = 16;
const OFFSCREEN = 2.6;
const SET_DOWN_DISTANCE = 0.7;
const SET_DOWN_START_SPEED = 0.6;
const SET_DOWN_GRAVITY = 6;

type WearPhase = "falling" | "seated" | "crouching" | "flying" | "settingDown";
type WearEvent = "landed" | "thrown" | null;

/** One wearable slot: hats fall on and get flung off; props are set down. */
class WearableSlotState {
  kind: WearableCode = NO_WEARABLE;
  private phase: WearPhase = "seated";
  private crouchUntil = 0;
  private progress = [0];
  private velocity = [0];
  private offset: Vec2 = [0, 0];
  private flight: Vec2 = [0, 0];
  private angle = 0;
  private wornAt = 0;

  constructor(
    /** Bounce impulse given to the body when this slot's wearable lands. */
    readonly recoil: number,
    private readonly throwVelocity: Vec2,
    private readonly spin: number,
  ) {}

  wear(kind: WearableCode, animate: boolean, now: number): void {
    if (this.kind === kind && (this.phase === "falling" || this.phase === "seated")) return;
    this.clear();
    this.kind = kind;
    this.wornAt = animate ? now : now - SETTLED_AGE;
    this.phase = animate ? "falling" : "seated";
    this.progress[0] = animate ? 0 : 1;
  }

  /** Returns true when a hat is about to be flung (the body should flinch). */
  undress(animate: boolean, now: number): boolean {
    if (this.kind === NO_WEARABLE) return false;
    if (!animate) {
      this.clear();
      return false;
    }
    if (this.phase !== "falling" && this.phase !== "seated") return false;
    if (isPropCode(this.kind)) {
      this.phase = "settingDown";
      this.progress[0] = 1;
      this.velocity[0] = 0;
      this.flight = [0, SET_DOWN_START_SPEED];
      return false;
    }
    this.phase = "crouching";
    this.crouchUntil = now + CROUCH_SECONDS;
    return true;
  }

  step(dt: number, now: number): WearEvent {
    if (this.kind === NO_WEARABLE) return null;
    switch (this.phase) {
      case "falling":
        this.velocity[0]! += FALL_ACCELERATION * dt;
        this.progress[0]! += this.velocity[0]! * dt;
        if (this.progress[0]! < 1) return null;
        this.progress[0] = 1;
        this.phase = "seated";
        return "landed";
      case "seated":
        this.springTo(1, dt);
        return null;
      case "crouching":
        this.springTo(CROUCH_TARGET, dt);
        if (now < this.crouchUntil) return null;
        this.phase = "flying";
        this.progress[0] = 1;
        this.velocity[0] = 0;
        this.flight = [this.throwVelocity[0], this.throwVelocity[1]];
        return "thrown";
      case "flying":
        this.flight[1] += THROW_GRAVITY * dt;
        this.offset[0] += this.flight[0] * dt;
        this.offset[1] += this.flight[1] * dt;
        this.angle += this.spin * dt;
        if (Math.abs(this.offset[0]) > OFFSCREEN || Math.abs(this.offset[1]) > OFFSCREEN) this.clear();
        return null;
      case "settingDown":
        this.flight[1] += SET_DOWN_GRAVITY * dt;
        this.offset[0] += this.flight[0] * dt;
        this.offset[1] += this.flight[1] * dt;
        if (this.offset[1] >= SET_DOWN_DISTANCE) this.clear();
        return null;
    }
  }

  private springTo(target: number, dt: number): void {
    stepSprings(this.progress, this.velocity, [target], SEAT_STIFFNESS, SEAT_DAMPING, dt);
  }

  private clear(): void {
    this.kind = NO_WEARABLE;
    this.phase = "seated";
    this.progress[0] = 0;
    this.velocity[0] = 0;
    this.offset = [0, 0];
    this.flight = [0, 0];
    this.angle = 0;
  }

  isQuiet(now: number): boolean {
    return (
      this.kind === NO_WEARABLE ||
      (this.phase === "seated" &&
        Math.abs(1 - this.progress[0]!) < REST_EPSILON &&
        Math.abs(this.velocity[0]!) < REST_EPSILON &&
        now - this.wornAt >= minimumWearSeconds(this.kind))
    );
  }

  /** The wearable that is (or is about to be) on, ignoring one on its way off. */
  get staying(): WearableCode {
    return this.phase === "falling" || this.phase === "seated" ? this.kind : NO_WEARABLE;
  }

  frame(now: number): WearableFrame {
    if (this.kind === NO_WEARABLE) return EMPTY_WEARABLE_FRAME;
    const setDown = this.phase === "settingDown" ? Math.min(this.offset[1] / SET_DOWN_DISTANCE, 1) : 0;
    return {
      kind: this.kind,
      progress: this.progress[0]!,
      age: now - this.wornAt,
      fling: [this.offset[0], this.offset[1], this.angle, setDown],
    };
  }
}

class Spring2 {
  readonly x: Vec2 = [0, 0];
  private readonly v: Vec2 = [0, 0];

  constructor(
    private readonly stiffness: number,
    private readonly damping: number,
  ) {}

  step(target: Vec2, dt: number): void {
    stepSprings(this.x, this.v, target, this.stiffness, this.damping, dt);
  }

  snap(target: Vec2): void {
    this.x[0] = target[0];
    this.x[1] = target[1];
    this.v[0] = 0;
    this.v[1] = 0;
  }

  isQuiet(target: Vec2): boolean {
    return isAtRest(this.x, this.v, target);
  }
}

export class FaceEngine {
  /** True when nothing would change if step() ran again now. */
  isSettled = false;

  private amplitude = 1;
  private baseGlyph: FaceGlyph = idle;
  private readonly x: Pose = [...poseFor(idle)];
  private readonly v: number[] = Array.from({ length: 9 }, () => 0);
  private blink = 0;
  private nextBlink = 1.2;
  private lastBlinkAt = -Infinity;
  private readonly bounce = [0];
  private readonly bounceV = [0];
  private readonly tilt = [0];
  private readonly tiltV = [0];
  private readonly glance: Vec2 = [0, 0];
  private readonly glanceV: Vec2 = [0, 0];
  private glanceTarget: Vec2 = [0, 0];
  private glanceUntil = 0;
  private glanceFor: number | null = null;
  private saccade: Vec2 = [0, 0];
  private holdsOpeningGlance = false;
  private nextSaccade = 2.4;
  private readonly wander: Vec2 = [0, 0];
  private readonly wanderV: Vec2 = [0, 0];
  private thinkingSince: number | null = null;
  private gestureUntil = 0;
  private gestureFor: number | null = null;
  private lastGesture: string | number | undefined;
  private readonly spin = [0];
  private readonly spinV = [0];
  private spinTarget = 0;
  private readonly head = new WearableSlotState(2.2, [3.4, -6.2], -9);
  private readonly face = new WearableSlotState(1, [-4.4, -5.4], 8);
  private baseHat: WearableCode = NO_WEARABLE;
  private readonly lag = new Spring2(400, 26);
  private readonly swing = new Spring2(120, 9);
  private shown: FaceGlyph = idle;
  private shownSince = -Infinity;
  private lastTime: number | null = null;
  private animationTime = 0;
  private breaths = 0;

  constructor(
    private readonly clock: () => number = () => performance.now() / 1000,
    private readonly random: () => number = Math.random,
  ) {}

  show(glyph: FaceGlyph, amplitude = 1): void {
    if (glyph === this.baseGlyph && amplitude === this.amplitude) return;
    this.baseGlyph = glyph;
    this.amplitude = amplitude;
    this.isSettled = false;
  }

  wave(): void {
    this.tiltV[0]! += 2.2 * TIMING.impulse;
    this.gestureFor = GESTURE_SECONDS.wave;
    this.isSettled = false;
  }

  nod(): void {
    this.tiltV[0]! -= 1.6 * TIMING.impulse;
    this.gestureFor = GESTURE_SECONDS.nod;
    this.isSettled = false;
  }

  glanceToward(x: number, y: number, seconds: number): void {
    this.glanceTarget = [x, y];
    this.glanceFor = seconds;
    this.isSettled = false;
  }

  hop(): void {
    this.bounceV[0]! += 2.8 * TIMING.impulse;
    this.isSettled = false;
  }

  turn(): void {
    this.spinTarget += 2 * Math.PI;
    this.isSettled = false;
  }

  /** Runs `play` once per gesture id, so re-renders don't replay it. */
  once(id: string | number, play: () => void): void {
    if (id === this.lastGesture) return;
    this.lastGesture = id;
    play();
  }

  undress(slot: WearableSlot, animate = true): void {
    if (this.slot(slot).undress(animate, this.animationTime)) this.tiltV[0]! += 3;
    this.isSettled = false;
  }

  setBaseHat(code: WearableCode, animate = true): void {
    if (code === this.baseHat) return;
    this.baseHat = code;
    if (code === NO_WEARABLE) this.undress("head", animate);
    else this.wear(code, animate);
  }

  wear(code: WearableCode, animate = true): void {
    this.slot(slotForWearable(code)).wear(code, animate, this.animationTime);
    // Look up at the hat as it drops on.
    if (animate) this.glanceToward(0, -0.7, HAT_FALL_SECONDS);
    this.isSettled = false;
  }

  staying(slot: WearableSlot): WearableCode {
    return this.slot(slot).staying;
  }

  private slot(slot: WearableSlot): WearableSlotState {
    return slot === "head" ? this.head : this.face;
  }

  /** Seconds (engine clock) of the next blink or saccade. */
  get nextEventAt(): number {
    const blinkAt = this.shown === surprised ? Infinity : this.nextBlink;
    const saccadeAt = this.looksAbout(this.shown) ? this.nextSaccade : Infinity;
    return Math.min(blinkAt, saccadeAt);
  }

  /** Seconds (engine clock) when the pending expression may replace the shown one. */
  get nextShowAt(): number {
    if (this.baseGlyph === this.shown) return Infinity;
    return (
      (this.lastTime ?? -Infinity) + dwellFor(this.shown) - (this.animationTime - this.shownSince)
    );
  }

  private looksAbout(glyph: FaceGlyph): boolean {
    return glyph === idle || glyph === listening || glyph === speaking;
  }

  step(now: number = this.clock()): FaceFrame {
    if (this.lastTime !== null && now - this.lastTime > STALL_SECONDS) {
      this.shiftDeadlines(now - this.lastTime);
    }
    if (this.glanceFor !== null) {
      this.glanceUntil = now + this.glanceFor;
      this.glanceFor = null;
    }
    if (this.gestureFor !== null) {
      this.gestureUntil = now + this.gestureFor;
      this.gestureFor = null;
    }
    if (this.lastTime === null) {
      this.nextBlink = now + 1.2;
      if (this.baseGlyph === idle) {
        this.saccade = [...OPENING_GLANCE];
        this.holdsOpeningGlance = true;
        this.glance[0] = this.saccade[0];
        this.glance[1] = this.saccade[1];
      }
    }

    const elapsed = Math.max(0, now - (this.lastTime ?? now - 1 / 60));
    const dt = elapsed > STALL_SECONDS ? 1 / 60 : Math.min(GLANCE_SPRING.longestStep, elapsed);
    const animationStep = Math.min(MAX_ANIMATION_STEP, elapsed);
    this.lastTime = now;
    this.animationTime += animationStep;
    this.breaths += animationStep * Math.max(0.3, this.x[8]!);
    // Time skipped beyond the step cap still counts toward the current dwell.
    if (elapsed > MAX_ANIMATION_STEP && this.shownSince > -Infinity) {
      this.shownSince -= elapsed - MAX_ANIMATION_STEP;
    }

    const wanted = this.baseGlyph;
    const switched =
      wanted !== this.shown && this.animationTime - this.shownSince >= dwellFor(this.shown);
    if (switched) {
      this.shown = wanted;
      this.shownSince = this.animationTime;
    } else if (this.shownSince === -Infinity) {
      this.shownSince = this.animationTime;
    }

    const glyph = this.shown;
    const pose = blendedPose(glyph, this.amplitude);
    const glancing = now < this.glanceUntil;
    const free = !glancing && now >= this.gestureUntil;
    const looksAbout = this.looksAbout(glyph) && free;

    if (glyph === thinking) this.thinkingSince ??= this.animationTime;
    else this.thinkingSince = null;

    // Thinking: after a beat, the gaze drifts away and back on a slow loop.
    const pondering = glyph === thinking && free;
    let ponderGaze: Vec2 = [0, 0];
    if (pondering && this.thinkingSince !== null) {
      const phase =
        (Math.max(0, this.animationTime - this.thinkingSince - THINKING_LOOK_DELAY) * 2 * Math.PI) /
        THINKING_LOOK_PERIOD;
      ponderGaze = [-0.5 * (1 - Math.cos(phase)), 0.12 * Math.sin(phase)];
    }

    if (looksAbout) {
      if (this.holdsOpeningGlance && glyph !== idle) {
        this.saccade = [0, 0];
        this.holdsOpeningGlance = false;
      }
      if (now >= this.nextSaccade) {
        if (now - this.lastBlinkAt < TIMING.eventGap) {
          this.nextSaccade = this.lastBlinkAt + TIMING.eventGap;
        } else if (this.nextBlink - now < TIMING.eventGap) {
          this.nextSaccade = Math.max(now, this.nextBlink) + TIMING.eventGap;
        }
      }
      if (now >= this.nextSaccade) {
        let x = lerpRange([-0.7, 0.7], this.random());
        const y = lerpRange([-0.28, 0.2], this.random());
        // Never a tiny look; never land right where we already are.
        if (Math.abs(x) < 0.3) x = x < 0 ? -0.3 - Math.abs(x) : 0.3 + x;
        if (Math.hypot(x - this.saccade[0], y - this.saccade[1]) < 0.3) x = -this.saccade[0];
        this.saccade = [x, y];
        this.holdsOpeningGlance = false;
        this.nextSaccade = now + TIMING.saccadeEvery * lerpRange(TIMING.saccadeJitter, this.random());
      }
    } else {
      this.saccade = [0, 0];
      this.holdsOpeningGlance = false;
      this.nextSaccade = now + TIMING.saccadeEvery * 0.4;
    }

    const gazeTarget = glancing ? this.glanceTarget : pondering ? ponderGaze : this.saccade;
    stepSprings(this.glance, this.glanceV, gazeTarget, GLANCE_SPRING.stiffness, GLANCE_SPRING.damping, dt);
    pose[3]! += this.glance[0];
    pose[4]! += this.glance[1];

    // The whole body leans a little after the eyes.
    const wanderTarget: Vec2 =
      looksAbout || pondering ? [gazeTarget[0] * 0.35, gazeTarget[1] * 0.25] : [0, 0];
    stepSprings(this.wander, this.wanderV, wanderTarget, 36, 12, dt);
    stepSprings(this.x, this.v, pose, 180, 27, dt);

    if (switched && glyph === surprised) {
      this.bounceV[0]! += 3.2 * TIMING.impulse;
    } else if (switched && glyph === happy) {
      this.bounceV[0]! += 2.4 * TIMING.impulse;
      this.blink = 0;
    }
    stepSprings(this.bounce, this.bounceV, [0], 160, 12, dt);
    stepSprings(this.tilt, this.tiltV, [0], 120, 8, dt);

    const isSleeping = glyph === sleeping;
    if (glyph !== surprised && now >= this.nextBlink) {
      this.blink = 1;
      this.lastBlinkAt = now;
      this.nextBlink =
        now + TIMING.blinkEvery * lerpRange(TIMING.blinkJitter, this.random()) * (isSleeping ? 1.6 : 1);
    }
    this.blink = Math.max(0, this.blink - dt / (isSleeping ? 0.28 : 0.13));

    stepSprings(this.spin, this.spinV, [this.spinTarget], 40, 12.6, dt);
    if (
      this.spinTarget > 0 &&
      Math.abs(this.spinTarget - this.spin[0]!) < REST_EPSILON &&
      Math.abs(this.spinV[0]!) < REST_EPSILON
    ) {
      this.spin[0] = 0;
      this.spinV[0] = 0;
      this.spinTarget = 0;
    }

    for (const slot of [this.head, this.face]) {
      const event = slot.step(dt, this.animationTime);
      if (event === "landed") {
        this.bounceV[0]! += slot.recoil;
        this.blink = 1;
        this.lastBlinkAt = now;
      } else if (event === "thrown") {
        this.tiltV[0]! -= 7;
        this.bounceV[0]! += 1.2;
      }
    }

    const shownPose = [...this.x];
    shownPose[5]! += this.tilt[0]! + this.wander[0] * 0.18;
    const breath =
      (isSleeping ? 0.02 : 0.07) *
      (0.7 * Math.sin(this.breaths * 1.7) + 0.3 * Math.sin(this.breaths * 2.9 + 1.1));
    const bounce = this.bounce[0]! + this.wander[1] * 0.12 + breath;
    const body: Vec2 = [shownPose[5]!, this.bounce[0]! + this.wander[1] * 0.12];

    if (this.head.kind !== NO_WEARABLE || this.face.kind !== NO_WEARABLE) {
      this.lag.step(body, dt);
      this.swing.step(body, dt);
    } else {
      this.lag.snap(body);
      this.swing.snap(body);
    }

    this.isSettled =
      now >= this.gestureUntil &&
      !glancing &&
      isAtRest(this.bounce, this.bounceV, [0]) &&
      isAtRest(this.tilt, this.tiltV, [0]) &&
      isAtRest(this.glance, this.glanceV, gazeTarget) &&
      isAtRest(this.wander, this.wanderV, wanderTarget) &&
      isAtRest(this.x, this.v, pose) &&
      this.spinTarget === 0 &&
      isAtRest(this.spin, this.spinV, [0]) &&
      this.head.isQuiet(this.animationTime) &&
      this.face.isQuiet(this.animationTime) &&
      this.lag.isQuiet(body) &&
      this.swing.isQuiet(body) &&
      this.blink === 0 &&
      wanted === this.shown &&
      !pondering &&
      glyph !== speaking;

    return toFaceFrame({
      pose: shownPose,
      glyph,
      glance: [this.glance[0], this.glance[1]],
      amplitude: this.amplitude,
      blink: this.blink,
      wink: 0,
      bounce,
      spin: this.spin[0]!,
      head: this.head.frame(this.animationTime),
      face: this.face.frame(this.animationTime),
      lag: [this.lag.x[0], this.lag.x[1] + breath],
      swing: [this.swing.x[0], this.swing.x[1] + breath],
      time: this.animationTime,
      breaths: this.breaths,
      eyes: glyph === idle ? IDLE_EYES : undefined,
    });
  }

  /** After a pause, push timed glances/gestures forward so they don't end instantly. */
  private shiftDeadlines(by: number): void {
    this.glanceUntil += by;
    this.gestureUntil += by;
  }
}

function seatedFrame(code: WearableCode): WearableFrame {
  return code === NO_WEARABLE
    ? EMPTY_WEARABLE_FRAME
    : { kind: code, progress: 1, age: SETTLED_AGE, fling: [0, 0, 0, 0] };
}

/** A resting frame for non-animated faces: no engine, wearables already seated. */
export function stillFaceFrame(
  glyph: FaceGlyph,
  head: WearableCode,
  face: WearableCode,
  amplitude = 1,
): FaceFrame {
  const pose = blendedPose(glyph, amplitude);
  return toFaceFrame({
    pose,
    glyph,
    glance: glyph === idle ? OPENING_GLANCE : [0, 0],
    amplitude,
    blink: 0,
    wink: 0,
    bounce: 0,
    spin: 0,
    head: seatedFrame(head),
    face: seatedFrame(face),
    lag: [pose[5]!, 0],
    swing: [pose[5]!, 0],
    time: 1.7,
    breaths: 0,
    eyes: glyph === idle ? IDLE_EYES : undefined,
  });
}
