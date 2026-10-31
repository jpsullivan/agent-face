// The line set's art is stored as SVG path strings; this reader decides what
// geometry the renderers see and which strings are rejected outright.
import { describe, expect, it } from "vitest";
import { distance, parsePathData, type PathPart } from "./path-data";

const move = (x: number, y: number): PathPart => ({ kind: "move", to: { x, y } });
const line = (x: number, y: number): PathPart => ({ kind: "line", to: { x, y } });
const close: PathPart = { kind: "close" };

describe("parsePathData", () => {
  it.each<[string, PathPart[]]>([
    ["M10 20 L30 40", [move(10, 20), line(30, 40)]],
    // Relative commands, H/V, and close returning to the subpath start.
    ["m10 20 l5 5 h10 v-5 z", [move(10, 20), line(15, 25), line(25, 25), line(25, 20), close]],
    // Extra pairs after a moveto are implicit linetos.
    ["M0 0 10 10 20 0", [move(0, 0), line(10, 10), line(20, 0)]],
    // Commas, exponents, signs without separators.
    ["M1e2,0L-5-5", [move(100, 0), line(-5, -5)]],
    ["M0 0 l10 0 z l0 10", [move(0, 0), line(10, 0), close, line(0, 10)]],
  ])("%s", (d, expected) => {
    expect(parsePathData(d)).toEqual(expected);
  });

  it("converts a quadratic to the equivalent cubic", () => {
    expect(parsePathData("M0 0 Q30 30 60 0")?.[1]).toEqual({
      kind: "curve",
      to: { x: 60, y: 0 },
      control1: { x: 20, y: 20 },
      control2: { x: 40, y: 20 },
    });
  });

  it("reflects the previous control point for S", () => {
    const parts = parsePathData("M0 0 C10 0 20 10 30 10 S50 20 60 10");
    expect(parts?.[2]).toMatchObject({ kind: "curve", control1: { x: 40, y: 10 }, to: { x: 60, y: 10 } });
  });

  it("splits a semicircle arc into two cubics that stay on the circle and end exactly", () => {
    const parts = parsePathData("M0 0 A10 10 0 0 1 20 0")!;
    expect(parts).toHaveLength(3);
    const center = { x: 10, y: 0 };
    for (const part of parts.slice(1)) {
      expect(part.kind).toBe("curve");
      if (part.kind === "curve") expect(distance(center, part.to)).toBeCloseTo(10, 6);
    }
    expect(parts.at(-1)).toMatchObject({ to: { x: 20, y: 0 } });
  });

  it("reads compact arc flags written without separators", () => {
    expect(parsePathData("M0 0 a10 10 0 0120 0")?.at(-1)).toMatchObject({ to: { x: 20, y: 0 } });
  });

  it("treats a zero-radius arc as a line", () => {
    expect(parsePathData("M0 0 A0 10 0 0 1 20 0")).toEqual([move(0, 0), line(20, 0)]);
  });

  it.each([
    ["", "empty"],
    ["L10 10", "doesn't start with a move"],
    ["Z", "close before anything"],
    ["M10", "missing y"],
    ["M0 0 X5 5", "unknown command"],
    ["M0 0 A10 10 0 2 1 5 5", "flag that isn't 0 or 1"],
    ["M2e6 0", "coordinate beyond 1e6"],
    ["M0 0 Z 5 5", "numbers after close with no command"],
  ])("rejects %j (%s)", (d) => {
    expect(parsePathData(d)).toBeNull();
  });
});
