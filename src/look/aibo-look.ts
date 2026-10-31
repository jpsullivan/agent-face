// Aibo looks: the agent mascot's face, tint and hat, plus the newer "line" look
// (hand-drawn shape + tint + accessory). Tokens encode a look as a string so it
// can be stored as a project/task icon.

export const AIBO_FACES = [
  "tofu",
  "pebble",
  "tofu-rendered",
  "pebble-rendered",
  "tofu-flat",
  "pebble-flat",
  "block",
  "spark",
] as const;
export type AiboFace = (typeof AIBO_FACES)[number];

export const AIBO_TINTS = [
  "clay",
  "cactus",
  "heather",
  "mineral",
  "plum",
  "ochre",
  "cornflower",
  "rose",
  "clover",
  "jade",
] as const;
export type AiboTint = (typeof AIBO_TINTS)[number];

export const AIBO_HATS = [
  "bowler",
  "partyHat",
  "nightcap",
  "beanie",
  "topHat",
  "gradCap",
  "headphones",
  "cowboy",
  "antenna",
  "halo",
  "bow",
  "cap",
  "crown",
  "chefHat",
  "propeller",
  "wizard",
  "sprout",
  "hardHat",
  "flower",
] as const;
export type AiboHat = (typeof AIBO_HATS)[number];

export const LINE_SHAPES = ["tofu", "flower5", "drop", "bean", "acorn", "leaf", "stone"] as const;
export type LineShape = (typeof LINE_SHAPES)[number];

export const LINE_TINTS = [
  "fig",
  "coral",
  "peach",
  "clay",
  "pencil",
  "matcha",
  "mineral",
  "cloud",
  "sky",
  "heather",
] as const;
export type LineTint = (typeof LINE_TINTS)[number];

export const LINE_ACCESSORIES = [
  "partyHat",
  "bowler",
  "crown",
  "headphones",
  "sunglasses",
  "sprout",
  "halo",
  "nightcap",
  "cap",
  "beanie",
  "topHat",
  "gradCap",
  "chefHat",
  "propeller",
  "wizard",
  "hardHat",
  "flower",
  "cowboy",
  "antenna",
  "bow",
] as const;
export type LineAccessory = (typeof LINE_ACCESSORIES)[number];

export const LINE_STATES = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "delighted",
  "confused",
  "sleeping",
  "error",
  "surprised",
  "curious",
  "proud",
  "peeking",
  "wink",
  "sorry",
  "onIt",
  "waiting",
  "celebrating",
  "coding",
  "working",
  "writing",
  "reading",
  "building",
  "connecting",
] as const;
export type LineState = (typeof LINE_STATES)[number];

export interface LineLook {
  shape: LineShape;
  tint: LineTint;
  accessory: LineAccessory | null;
}

export const DEFAULT_LINE_LOOK: LineLook = { shape: "tofu", tint: "clay", accessory: null };

/** Control-point distance for approximating a quarter circle with a cubic Bézier. */
export const BEZIER_CIRCLE_KAPPA = 0.5522847498;

export const LINE_DRAWING = {
  /** Seats at or above this size are drawn by hand rather than from the small sprite. */
  byHandFrom: 36,
  smallMarksGrow: 1.5,
  smallMarksLineShare: 0.45,
};

export type AiboCharacter = "tofu" | "pebble" | "block" | "flower";

export interface AiboLook {
  face: AiboFace;
  tint: AiboTint;
  hat: AiboHat | null;
  line?: LineLook;
}

export interface FaceLookProps {
  character: AiboCharacter;
  tint: AiboTint;
  hat: AiboHat | null;
  line?: LineLook;
}

export const DEFAULT_AIBO_LOOK: AiboLook = { face: "tofu", tint: "clay", hat: null };
const FALLBACK_AIBO_LOOK: AiboLook = { face: "tofu", tint: "clay", hat: null };

const AIBO1_PREFIX = "Aibo1";
const AIBO3_PREFIX = "Aibo3";
const TOKEN_SEPARATOR = "_";
const LINE_SEPARATOR = "-";

function includes<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** Maps a full hat name to the accessory the line look can draw, if any. */
export function lineAccessoryForHat(
  hat: AiboHat | "sunglasses" | "pencil" | "hammer" | "keyboard" | "book" | "magnifier" | "pot" | "blocks" | null,
): LineAccessory | null {
  if (hat === null) return null;
  switch (hat) {
    case "pencil":
    case "hammer":
    case "keyboard":
    case "book":
    case "magnifier":
    case "pot":
    case "blocks":
      return null;
    default:
      return hat;
  }
}

export function baseLineTintForAiboTint(tint: AiboTint): LineTint {
  switch (tint) {
    case "clay":
      return "clay";
    case "heather":
      return "heather";
    case "mineral":
      return "mineral";
    case "cornflower":
      return "sky";
    case "cactus":
      return "matcha";
    case "ochre":
      return "pencil";
    case "rose":
      return "fig";
    case "jade":
      return "mineral";
    case "plum":
      return "sky";
    case "clover":
      return "mineral";
  }
}

const LIGHTER_LINE_TINT: Partial<Record<AiboTint, LineTint>> = {
  clover: "coral",
  jade: "peach",
  plum: "cloud",
};

export function lineTintForAiboTint(tint: AiboTint): LineTint {
  return LIGHTER_LINE_TINT[tint] ?? baseLineTintForAiboTint(tint);
}

export function aiboTintForLineTint(tint: LineTint): AiboTint {
  switch (tint) {
    case "clay":
    case "peach":
      return "clay";
    case "fig":
    case "coral":
      return "rose";
    case "pencil":
      return "ochre";
    case "matcha":
      return "cactus";
    case "mineral":
      return "mineral";
    case "sky":
    case "cloud":
      return "cornflower";
    case "heather":
      return "heather";
  }
}

export function serializeLineLook({ shape, tint, accessory }: LineLook): string {
  return [shape, tint, ...(accessory ? [accessory] : [])].join(LINE_SEPARATOR);
}

function parseLineLook(value: string): LineLook | undefined {
  const parts = value.split(LINE_SEPARATOR);
  const [shape, tint, accessory] = parts;
  if (parts.length > 3 || shape === undefined || tint === undefined) return undefined;
  if (!includes(LINE_SHAPES, shape) || !includes(LINE_TINTS, tint)) return undefined;
  if (accessory === undefined) return { shape, tint, accessory: null };
  return includes(LINE_ACCESSORIES, accessory) ? { shape, tint, accessory } : undefined;
}

/** `Aibo1_<face>_<tint>[_<hat>[_<line>]]`; unknown face/tint/hat fall back to defaults. */
export function parseAibo1Token(token: string): AiboLook | undefined {
  const [prefix, face, tint, hat, line] = token.split(TOKEN_SEPARATOR);
  if (prefix !== AIBO1_PREFIX || face === undefined || tint === undefined) return undefined;
  const lineLook = line === undefined ? undefined : parseLineLook(line);
  return {
    face: includes(AIBO_FACES, face) ? face : FALLBACK_AIBO_LOOK.face,
    tint: includes(AIBO_TINTS, tint) ? tint : FALLBACK_AIBO_LOOK.tint,
    hat: hat !== undefined && includes(AIBO_HATS, hat) ? hat : null,
    ...(lineLook !== undefined && { line: lineLook }),
  };
}

/** `Aibo3_<shape>_<tint>[_<accessory>]`; an unknown alphanumeric accessory is dropped. */
export function parseAibo3Token(token?: string): LineLook | undefined {
  const parts = token?.split(TOKEN_SEPARATOR) ?? [];
  const [prefix, shape, tint, accessory] = parts;
  if (parts.length !== 3 && parts.length !== 4) return undefined;
  if (prefix !== AIBO3_PREFIX || shape === undefined || tint === undefined) return undefined;
  if (!includes(LINE_SHAPES, shape) || !includes(LINE_TINTS, tint)) return undefined;
  if (accessory !== undefined && !/^[A-Za-z0-9]+$/.test(accessory)) return undefined;
  return {
    shape,
    tint,
    accessory: accessory !== undefined && includes(LINE_ACCESSORIES, accessory) ? accessory : null,
  };
}

/** Drops the line look, keeping only face/tint/hat. */
export function toAiboLook({ face, tint, hat }: AiboLook): AiboLook {
  return { face, tint, hat };
}

export function isAibo1Token(token: string): boolean {
  return token === AIBO1_PREFIX || token.startsWith(`${AIBO1_PREFIX}_`);
}

export function characterForFace(look: Pick<AiboLook, "face">): AiboCharacter {
  switch (look.face) {
    case "tofu":
    case "tofu-rendered":
    case "tofu-flat":
      return "tofu";
    case "pebble":
    case "pebble-rendered":
    case "pebble-flat":
      return "pebble";
    case "block":
      return "block";
    case "spark":
      return "flower";
  }
}

const TINT_BG_CLASS: Record<AiboTint, string> = {
  clay: "bg-clay",
  cactus: "bg-cactus",
  heather: "bg-heather",
  mineral: "bg-mineral",
  plum: "bg-plum",
  ochre: "bg-yellow-300",
  cornflower: "bg-blue-300",
  rose: "bg-magenta-300",
  clover: "bg-green-250",
  jade: "bg-aqua-350",
};

export function aiboTintBgClass(tint: AiboTint): string {
  return TINT_BG_CLASS[tint];
}

const TINT_TEXT_CLASS: Record<AiboTint, string> = {
  clay: "text-clay-emphasized dark:text-clay",
  cactus: "text-mineral dark:text-cactus",
  heather: "text-plum dark:text-heather",
  mineral: "text-mineral",
  plum: "text-plum",
  ochre: "text-tint-yellow",
  cornflower: "text-tint-blue",
  rose: "text-tint-magenta",
  clover: "text-tint-green",
  jade: "text-tint-aqua",
};

export function aiboTintTextClass(tint: AiboTint): string {
  return TINT_TEXT_CLASS[tint];
}

/** The tint a look is shown in: the line tint wins when there is a line look. */
export function effectiveAiboTint(look: AiboLook): AiboTint {
  return look.line === undefined ? look.tint : aiboTintForLineTint(look.line.tint);
}

export function toFaceLookProps(look: AiboLook): FaceLookProps {
  return {
    character: characterForFace(look),
    tint: look.tint,
    hat: look.hat,
    ...(look.line !== undefined && { line: look.line }),
  };
}
