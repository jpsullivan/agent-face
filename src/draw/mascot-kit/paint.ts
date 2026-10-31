// Paints a drawing (a box plus fill/stroke/erase steps in box units) into a
// square 2D canvas, fitted and centred (from helper chunk 9631d644…).
import { isHexColour, type PathPart, type Point } from "@/draw/path-data";
import { resolveLinePaint, type LinePaint, type PaintColours } from "@/draw/line-paint";

/** Used when a paint resolves to something that is not `#rrggbb`. */
const FALLBACK_INK = "#141413";

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DrawStep =
  | { kind: "fill"; parts: PathPart[]; ink: LinePaint; opacity: number }
  | { kind: "stroke"; parts: PathPart[]; width: number; ink: LinePaint; opacity: number }
  | { kind: "erase"; parts: PathPart[] }
  /** Fills `parts` clipped to `region`. */
  | { kind: "fillInside"; region: PathPart[]; parts: PathPart[]; ink: LinePaint; opacity: number };

export interface MascotDrawing {
  box: Box;
  steps: DrawStep[];
}

export interface BoxFit {
  scale: number;
  originX: number;
  originY: number;
}

/** Scales `box` to fit `width`×`height` and centres it; scale is 0 when nothing fits. */
export function fitBox(box: Box, width: number, height: number): BoxFit {
  const raw =
    box.width > 0 && box.height > 0 && width > 0 && height > 0
      ? Math.min(width / box.width, height / box.height)
      : 0;
  const scale = Number.isFinite(raw) ? raw : 0;
  return {
    scale,
    originX: (width - box.width * scale) / 2 - box.x * scale,
    originY: (height - box.height * scale) / 2 - box.y * scale,
  };
}

function isFinitePoint(point: Point): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function isFinitePart(part: PathPart): boolean {
  switch (part.kind) {
    case "move":
    case "line":
      return isFinitePoint(part.to);
    case "curve":
      return isFinitePoint(part.to) && isFinitePoint(part.control1) && isFinitePoint(part.control2);
    case "close":
      return true;
  }
}

/** Starts a new path and traces `parts`; false when nothing was traced. */
export function tracePath(context: CanvasRenderingContext2D, fit: BoxFit, parts: readonly PathPart[]): boolean {
  context.beginPath();
  if (!(fit.scale > 0 && Number.isFinite(fit.originX) && Number.isFinite(fit.originY)) || !parts.every(isFinitePart)) {
    return false;
  }
  const toX = (point: Point) => fit.originX + point.x * fit.scale;
  const toY = (point: Point) => fit.originY + point.y * fit.scale;
  // Curves and closes need a current point; a leading line acts as a move.
  let penUp = true;
  for (const part of parts) {
    switch (part.kind) {
      case "move":
        context.moveTo(toX(part.to), toY(part.to));
        penUp = false;
        break;
      case "line":
        if (penUp) context.moveTo(toX(part.to), toY(part.to));
        else context.lineTo(toX(part.to), toY(part.to));
        penUp = false;
        break;
      case "curve":
        if (penUp) continue;
        context.bezierCurveTo(
          toX(part.control1),
          toY(part.control1),
          toX(part.control2),
          toY(part.control2),
          toX(part.to),
          toY(part.to),
        );
        break;
      case "close":
        if (!penUp) context.closePath();
    }
  }
  return !penUp;
}

function inkColour(ink: LinePaint, colours: PaintColours, inverted: boolean): string {
  const colour = resolveLinePaint(ink, colours, inverted);
  return isHexColour(colour) ? colour : FALLBACK_INK;
}

function clampOpacity(opacity: number): number {
  return Number.isFinite(opacity) ? Math.min(Math.max(opacity, 0), 1) : 1;
}

/** Clears a `side`×`side` canvas and paints `drawing`; false when it could not be fitted. */
export function paintDrawing(
  context: CanvasRenderingContext2D,
  drawing: MascotDrawing,
  colours: PaintColours,
  inverted: boolean,
  side: number,
): boolean {
  if (!(side > 0)) return false;
  context.clearRect(0, 0, side, side);
  const fit = fitBox(drawing.box, side, side);
  if (!(fit.scale > 0)) return false;
  context.save();
  context.globalCompositeOperation = "source-over";
  context.lineCap = "round";
  context.lineJoin = "round";
  for (const step of drawing.steps) paintStep(step, context, fit, colours, inverted);
  context.restore();
  return true;
}

function paintStep(
  step: DrawStep,
  context: CanvasRenderingContext2D,
  fit: BoxFit,
  colours: PaintColours,
  inverted: boolean,
): void {
  context.save();
  switch (step.kind) {
    case "fill":
      useInk(step.ink, step.opacity, context, colours, inverted);
      tracePath(context, fit, step.parts);
      context.fill("nonzero");
      break;
    case "stroke": {
      useInk(step.ink, step.opacity, context, colours, inverted);
      const width = Number.isFinite(step.width) ? Math.max(0, step.width) * fit.scale : 0;
      if (!(width > 0)) break;
      context.lineWidth = width;
      tracePath(context, fit, step.parts);
      context.stroke();
      break;
    }
    case "erase":
      context.globalCompositeOperation = "destination-out";
      context.globalAlpha = 1;
      context.fillStyle = "#000000";
      tracePath(context, fit, step.parts);
      context.fill("nonzero");
      break;
    case "fillInside":
      if (!tracePath(context, fit, step.region)) break;
      context.clip("nonzero");
      useInk(step.ink, step.opacity, context, colours, inverted);
      tracePath(context, fit, step.parts);
      context.fill("nonzero");
  }
  context.restore();
}

function useInk(
  ink: LinePaint,
  opacity: number,
  context: CanvasRenderingContext2D,
  colours: PaintColours,
  inverted: boolean,
): void {
  const colour = inkColour(ink, colours, inverted);
  context.globalAlpha = clampOpacity(opacity);
  context.fillStyle = colour;
  context.strokeStyle = colour;
}
