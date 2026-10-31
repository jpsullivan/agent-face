// Path builders shared by the marks (from helper chunk 038ed117…): a smooth
// closed outline through sampled points, a Bézier circle, and a point offset.
import { BEZIER_CIRCLE_KAPPA } from "@/look/aibo-look";
import { midpoint, quadraticToCubic, type PathPart, type Point } from "@/draw/path-data";

/** A closed curve through the midpoints of `points`, using each point as a quadratic control. */
export function smoothClosedParts(points: readonly Point[]): PathPart[] {
  if (!(points.length > 2)) return [];
  const start = midpoint(points[points.length - 1]!, points[0]!);
  const parts: PathPart[] = [{ kind: "move", to: start }];
  let previous = start;
  points.forEach((point, i) => {
    const next = midpoint(point, points[(i + 1) % points.length]!);
    parts.push(quadraticToCubic(previous, point, next));
    previous = next;
  });
  parts.push({ kind: "close" });
  return parts;
}

/** A circle as four cubic quarter arcs. */
export function circleParts(center: Point, radius: number): PathPart[] {
  const handle = BEZIER_CIRCLE_KAPPA * radius;
  const right = { x: center.x + radius, y: center.y };
  const bottom = { x: center.x, y: center.y + radius };
  const left = { x: center.x - radius, y: center.y };
  const top = { x: center.x, y: center.y - radius };
  return [
    { kind: "move", to: right },
    {
      kind: "curve",
      to: bottom,
      control1: { x: right.x, y: right.y + handle },
      control2: { x: bottom.x + handle, y: bottom.y },
    },
    {
      kind: "curve",
      to: left,
      control1: { x: bottom.x - handle, y: bottom.y },
      control2: { x: left.x, y: left.y + handle },
    },
    {
      kind: "curve",
      to: top,
      control1: { x: left.x, y: left.y - handle },
      control2: { x: top.x - handle, y: top.y },
    },
    {
      kind: "curve",
      to: right,
      control1: { x: top.x + handle, y: top.y },
      control2: { x: right.x, y: right.y - handle },
    },
    { kind: "close" },
  ];
}

export function offsetPoint(point: Point, direction: Point, distance: number): Point {
  return { x: point.x + direction.x * distance, y: point.y + direction.y * distance };
}
