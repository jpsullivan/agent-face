import { describe, expect, it } from "vitest";
import { FaceEngine } from "./engine";
import { FACE_GLYPHS, HAT_CODES, NO_WEARABLE, PROP_CODES } from "./face-codes";

const FPS = 60;

/** Steps the engine on a fake clock; `random` fixed so saccades are deterministic. */
function run(engine: FaceEngine, from: number, seconds: number) {
  const frames = [];
  for (let i = 1; i <= Math.round(seconds * FPS); i++) frames.push({ t: from + i / FPS, frame: engine.step(from + i / FPS) });
  return frames;
}

function newEngine() {
  return new FaceEngine(() => 0, () => 0.5);
}

describe("FaceEngine", () => {
  it("opens idle with the side glance, then blinks about 1.2s in", () => {
    const engine = newEngine();
    const first = engine.step(0);
    expect(first.glyph).toBe(FACE_GLYPHS.idle);
    expect(first.glance).toEqual([0.55, -0.55]);

    const frames = run(engine, 0, 2);
    const firstBlink = frames.find(({ frame }) => frame.blink === 1);
    expect(firstBlink?.t).toBeGreaterThanOrEqual(1.2);
    expect(firstBlink?.t).toBeLessThan(1.25);
  });

  it("holds the current expression for its dwell before switching", () => {
    const engine = newEngine();
    engine.step(0);
    engine.show(FACE_GLYPHS.happy);
    const frames = run(engine, 0, 1.5);
    const switchedAt = frames.find(({ frame }) => frame.glyph === FACE_GLYPHS.happy)?.t;
    // Idle's dwell is 1.2s from when it was first shown.
    expect(switchedAt).toBeGreaterThanOrEqual(1.2);
    expect(switchedAt).toBeLessThan(1.25);

    // Reactions (happy) hold longer: 1.5s before going back.
    engine.show(FACE_GLYPHS.idle);
    const back = run(engine, 1.5, 2).find(({ frame }) => frame.glyph === FACE_GLYPHS.idle)?.t;
    expect(back! - switchedAt!).toBeGreaterThanOrEqual(1.5);
  });

  it("drops an animated hat on in about 0.3s and flings it off when removed", () => {
    const engine = newEngine();
    engine.step(0);
    engine.wear(HAT_CODES.crown);
    const on = run(engine, 0, 1);
    const landedAt = on.find(({ frame }) => frame.head.progress === 1)?.t;
    expect(landedAt).toBeGreaterThan(0.25);
    expect(landedAt).toBeLessThan(0.4);
    expect(engine.staying("head")).toBe(HAT_CODES.crown);

    engine.setBaseHat(HAT_CODES.crown);
    engine.setBaseHat(NO_WEARABLE);
    expect(engine.staying("head")).toBe(NO_WEARABLE);
    const off = run(engine, 1, 2);
    const flung = off.find(({ frame }) => frame.head.fling[1] !== 0);
    expect(flung?.frame.head.kind).toBe(HAT_CODES.crown);
    expect(off.at(-1)?.frame.head.kind).toBe(NO_WEARABLE);
  });

  it("wears props in the face slot, replacing sunglasses", () => {
    const engine = newEngine();
    engine.step(0);
    engine.wear(2, false);
    engine.wear(PROP_CODES.book, false);
    expect(engine.staying("face")).toBe(PROP_CODES.book);
    expect(engine.staying("head")).toBe(NO_WEARABLE);
  });

  it("settles between events so the draw loop can sleep, and a gesture wakes it", () => {
    const engine = newEngine();
    const control = newEngine();
    engine.show(FACE_GLYPHS.confused);
    control.show(FACE_GLYPHS.confused);
    run(engine, 0, 3);
    run(control, 0, 3);
    expect(engine.isSettled).toBe(true);
    // The next thing that would change is the second blink (5.5s after the first at 1.2s).
    expect(engine.nextEventAt).toBeCloseTo(1.2 + 1 / FPS + 5.5, 1);

    engine.hop();
    expect(engine.isSettled).toBe(false);
    // Same clock and randomness, so any bounce difference is the hop.
    const hopped = run(engine, 3, 0.3);
    const still = run(control, 3, 0.3);
    const lift = Math.max(...hopped.map(({ frame }, i) => frame.bounce - still[i]!.frame.bounce));
    expect(lift).toBeGreaterThan(0.02);
  });

  it("never settles while speaking, so the mouth keeps moving", () => {
    const engine = newEngine();
    engine.show(FACE_GLYPHS.speaking);
    run(engine, 0, 4);
    expect(engine.isSettled).toBe(false);
  });
});
