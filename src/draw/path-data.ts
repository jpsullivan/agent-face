// A strict SVG path-data reader that turns `d` strings into absolute
// move/line/cubic/close parts (quadratics and arcs become cubics), plus the
// small point helpers the renderers share. Malformed input returns null.

export interface Point {
  x: number;
  y: number;
}

export type PathPart =
  | { kind: "move"; to: Point }
  | { kind: "line"; to: Point }
  | { kind: "curve"; to: Point; control1: Point; control2: Point }
  | { kind: "close" };

/** Coordinates beyond this are treated as garbage, not geometry. */
const MAX_COORDINATE = 1e6;

/** Truncates `value` into [min, max]; NaN and infinities fall back to `min`. */
export function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  const clamped = Math.trunc(Math.min(Math.max(value, min), max));
  // `+ 0` turns -0 into 0.
  return Number.isFinite(clamped) ? clamped + 0 : min;
}

/** Exactly `#rrggbb`. */
export function isHexColour(value: string): boolean {
  const chars = Array.from(value);
  const digits = chars.slice(1);
  return chars[0] === "#" && digits.length === 6 && digits.every((c) => "0123456789abcdefABCDEF".includes(c));
}

function isSanePoint(point: Point): boolean {
  return Math.abs(point.x) <= MAX_COORDINATE && Math.abs(point.y) <= MAX_COORDINATE;
}

function isSanePart(part: PathPart): boolean {
  switch (part.kind) {
    case "move":
    case "line":
      return isSanePoint(part.to);
    case "curve":
      return isSanePoint(part.to) && isSanePoint(part.control1) && isSanePoint(part.control2);
    case "close":
      return true;
  }
}

/** Rounds half away from zero (Math.round rounds -2.5 to -2). */
export function roundHalfAwayFromZero(value: number): number {
  const whole = Math.trunc(value);
  return Math.abs(value - whole) >= 0.5 ? whole + Math.sign(value) : whole;
}

export function moveTo(to: Point): PathPart {
  return { kind: "move", to };
}

export function lineTo(to: Point): PathPart {
  return { kind: "line", to };
}

export function curveTo(to: Point, control1: Point, control2: Point): PathPart {
  return { kind: "curve", to, control1, control2 };
}

export const CLOSE: PathPart = { kind: "close" };

/** The cubic equal to the quadratic from `from` via `control` to `to`. */
export function quadraticToCubic(from: Point, control: Point, to: Point): PathPart {
  return curveTo(
    to,
    { x: from.x + ((control.x - from.x) * 2) / 3, y: from.y + ((control.y - from.y) * 2) / 3 },
    { x: to.x + ((control.x - to.x) * 2) / 3, y: to.y + ((control.y - to.y) * 2) / 3 },
  );
}

const CHAR = {
  space: 32,
  comma: 44,
  tab: 9,
  lineFeed: 10,
  carriageReturn: 13,
  minus: 45,
  plus: 43,
  dot: 46,
  zero: 48,
  one: 49,
  nine: 57,
  upperE: 69,
  lowerE: 101,
  upperZ: 90,
  lowerZ: 122,
  upperA: 65,
  lowerA: 97,
} as const;

export function parsePathData(data: string): PathPart[] | null {
  const codes: number[] = [];
  for (let i = 0; i < data.length; i += 1) codes.push(data.charCodeAt(i));

  let index = 0;
  const parts: PathPart[] = [];
  let current: Point = { x: 0, y: 0 };
  let subpathStart: Point = { x: 0, y: 0 };
  let lastCubicControl: Point | null = null;
  let lastQuadraticControl: Point | null = null;
  // After a moveto, further coordinate pairs are implicit linetos.
  let afterMove = false;

  function isCommand(code: number): boolean {
    if (code === CHAR.lowerE || code === CHAR.upperE) return false;
    return (code >= CHAR.lowerA && code <= CHAR.lowerZ) || (code >= CHAR.upperA && code <= CHAR.upperZ);
  }

  function skipSeparators(): void {
    while (index < codes.length) {
      const code = codes[index];
      if (
        code === CHAR.space ||
        code === CHAR.comma ||
        code === CHAR.tab ||
        code === CHAR.lineFeed ||
        code === CHAR.carriageReturn
      ) {
        index += 1;
      } else {
        return;
      }
    }
  }

  function readNumber(): number | null {
    skipSeparators();
    const start = index;
    let end = index;
    const at = (i: number) => (i < codes.length ? codes[i]! : null);
    const isDigit = (code: number | null) => code !== null && code >= CHAR.zero && code <= CHAR.nine;

    if (at(end) === CHAR.minus || at(end) === CHAR.plus) end += 1;
    const digitsStart = end;
    while (isDigit(at(end))) end += 1;
    if (at(end) === CHAR.dot) {
      end += 1;
      while (isDigit(at(end))) end += 1;
    }
    if (!(end > digitsStart) || (end === digitsStart + 1 && at(digitsStart) === CHAR.dot)) return null;
    if (at(end) === CHAR.lowerE || at(end) === CHAR.upperE) {
      let exponent = end + 1;
      if (at(exponent) === CHAR.minus || at(exponent) === CHAR.plus) exponent += 1;
      // A dangling "e" is left unread rather than rejected.
      if (isDigit(at(exponent))) {
        while (isDigit(at(exponent))) exponent += 1;
        end = exponent;
      }
    }
    const value = Number(data.slice(start, end));
    if (Number.isNaN(value) || !(Math.abs(value) <= MAX_COORDINATE)) return null;
    index = end;
    return value;
  }

  function readFlag(): boolean | null {
    skipSeparators();
    if (index >= codes.length) return null;
    if (codes[index] === CHAR.zero) {
      index += 1;
      return false;
    }
    if (codes[index] === CHAR.one) {
      index += 1;
      return true;
    }
    return null;
  }

  function readPoint(relative: boolean): Point | null {
    const x = readNumber();
    if (x === null) return null;
    const y = readNumber();
    if (y === null) return null;
    return relative ? { x: current.x + x, y: current.y + y } : { x, y };
  }

  function closePath(): void {
    parts.push(CLOSE);
    current = subpathStart;
    lastCubicControl = null;
    lastQuadraticControl = null;
  }

  function addLine(to: Point): void {
    parts.push(lineTo(to));
    current = to;
    lastCubicControl = null;
    lastQuadraticControl = null;
  }

  function addCubic(control1: Point, control2: Point, to: Point): void {
    parts.push(curveTo(to, control1, control2));
    current = to;
    lastCubicControl = control2;
    lastQuadraticControl = null;
  }

  function addQuadratic(control: Point, to: Point): void {
    parts.push(quadraticToCubic(current, control, to));
    current = to;
    lastCubicControl = null;
    lastQuadraticControl = control;
  }

  /** The implied first control point of a smooth curve: the last control reflected. */
  function reflect(control: Point | null): Point {
    return control === null ? current : { x: 2 * current.x - control.x, y: 2 * current.y - control.y };
  }

  function readSegment(command: number): boolean {
    const relative = command >= CHAR.lowerA;
    switch (String.fromCharCode(command).toUpperCase()) {
      case "M": {
        const to = readPoint(relative);
        if (to === null) return false;
        if (afterMove) {
          addLine(to);
        } else {
          parts.push(moveTo(to));
          current = to;
          subpathStart = to;
          lastCubicControl = null;
          lastQuadraticControl = null;
          afterMove = true;
        }
        return true;
      }
      case "L": {
        const to = readPoint(relative);
        if (to === null) return false;
        addLine(to);
        break;
      }
      case "H": {
        const x = readNumber();
        if (x === null) return false;
        addLine({ x: relative ? current.x + x : x, y: current.y });
        break;
      }
      case "V": {
        const y = readNumber();
        if (y === null) return false;
        addLine({ x: current.x, y: relative ? current.y + y : y });
        break;
      }
      case "C": {
        const control1 = readPoint(relative);
        if (control1 === null) return false;
        const control2 = readPoint(relative);
        if (control2 === null) return false;
        const to = readPoint(relative);
        if (to === null) return false;
        addCubic(control1, control2, to);
        break;
      }
      case "S": {
        const control1 = reflect(lastCubicControl);
        const control2 = readPoint(relative);
        if (control2 === null) return false;
        const to = readPoint(relative);
        if (to === null) return false;
        addCubic(control1, control2, to);
        break;
      }
      case "Q": {
        const control = readPoint(relative);
        if (control === null) return false;
        const to = readPoint(relative);
        if (to === null) return false;
        addQuadratic(control, to);
        break;
      }
      case "T": {
        const control = reflect(lastQuadraticControl);
        const to = readPoint(relative);
        if (to === null) return false;
        addQuadratic(control, to);
        break;
      }
      case "A": {
        const rx = readNumber();
        if (rx === null) return false;
        const ry = readNumber();
        if (ry === null) return false;
        const rotation = readNumber();
        if (rotation === null) return false;
        const largeArc = readFlag();
        if (largeArc === null) return false;
        const sweep = readFlag();
        if (sweep === null) return false;
        const to = readPoint(relative);
        if (to === null) return false;
        addArc(rx, ry, rotation, largeArc, sweep, to);
        break;
      }
      default:
        return false;
    }
    afterMove = false;
    return true;
  }

  /** SVG endpoint arc → center parameterization, then up to four cubic segments. */
  function addArc(
    radiusX: number,
    radiusY: number,
    rotationDegrees: number,
    largeArc: boolean,
    sweep: boolean,
    to: Point,
  ): void {
    const from = current;
    if (from.x === to.x && from.y === to.y) return;
    let rx = Math.abs(radiusX);
    let ry = Math.abs(radiusY);
    if (!(rx > 0 && ry > 0)) {
      addLine(to);
      return;
    }

    const phi = (rotationDegrees * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const halfDx = (from.x - to.x) / 2;
    const halfDy = (from.y - to.y) / 2;
    const x1 = cosPhi * halfDx + sinPhi * halfDy;
    const y1 = -sinPhi * halfDx + cosPhi * halfDy;

    // Radii too small to reach: scale them up just enough.
    const lambda = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry);
    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }

    const numerator = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1;
    const denominator = rx * rx * y1 * y1 + ry * ry * x1 * x1;
    let coefficient = denominator === 0 ? 0 : Math.sqrt(Math.max(0, numerator / denominator));
    if (largeArc === sweep) coefficient = -coefficient;

    const cx1 = (coefficient * rx * y1) / ry;
    const cy1 = (-coefficient * ry * x1) / rx;
    const centerX = cosPhi * cx1 - sinPhi * cy1 + (from.x + to.x) / 2;
    const centerY = sinPhi * cx1 + cosPhi * cy1 + (from.y + to.y) / 2;

    const startAngle = Math.atan2((y1 - cy1) / ry, (x1 - cx1) / rx);
    let sweepAngle = Math.atan2((-y1 - cy1) / ry, (-x1 - cx1) / rx) - startAngle;
    if (sweep && sweepAngle < 0) sweepAngle += 2 * Math.PI;
    if (!sweep && sweepAngle > 0) sweepAngle -= 2 * Math.PI;

    const segments = clampInt(Math.ceil(Math.abs(sweepAngle) / (Math.PI / 2)), 1, 4);
    const step = sweepAngle / segments;
    const handle = (4 / 3) * Math.tan(step / 4);
    const pointAt = (angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        point: { x: centerX + rx * cos * cosPhi - ry * sin * sinPhi, y: centerY + rx * cos * sinPhi + ry * sin * cosPhi },
        tangent: { x: -rx * sin * cosPhi - ry * cos * sinPhi, y: -rx * sin * sinPhi + ry * cos * cosPhi },
      };
    };

    for (let segment = 0; segment < segments; segment += 1) {
      const start = pointAt(startAngle + step * segment);
      const end = pointAt(startAngle + step * (segment + 1));
      // Land exactly on the requested endpoint.
      const target = segment === segments - 1 ? to : end.point;
      addCubic(
        { x: start.point.x + handle * start.tangent.x, y: start.point.y + handle * start.tangent.y },
        { x: end.point.x - handle * end.tangent.x, y: end.point.y - handle * end.tangent.y },
        target,
      );
    }
    lastCubicControl = null;
  }

  function parse(): PathPart[] | null {
    let command: number | null = null;
    skipSeparators();
    while (index < codes.length) {
      if (isCommand(codes[index]!)) {
        const code = codes[index]!;
        index += 1;
        afterMove = false;
        if (code === CHAR.upperZ || code === CHAR.lowerZ) {
          if (parts.length === 0) return null;
          closePath();
          command = null;
          skipSeparators();
          continue;
        }
        command = code;
      }
      // Numbers with no command (or after Z) are an error; otherwise the command repeats.
      if (command === null || !readSegment(command)) return null;
      skipSeparators();
    }
    if (parts.length === 0 || parts[0]!.kind !== "move" || !parts.every(isSanePart)) return null;
    return parts;
  }

  return parse();
}

export function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
