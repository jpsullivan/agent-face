// What a task token wears: a glyph tile or a mini mascot, plus its tint.
// Stored as an icon token: `<prefix>_<glyph>` or an `Aibo1_…` mascot token.
import {
  AIBO_TINTS,
  isAibo1Token,
  parseAibo1Token,
  toAiboLook,
  type AiboLook,
  type AiboTint,
} from "@/look/aibo-look";

export const TASK_GLYPHS = [
  "checklist",
  "calendar",
  "email",
  "dollarSign",
  "chart",
  "globe",
  "mapPin",
  "home",
  "box",
  "slides",
  "folder",
  "edit",
  "search",
] as const;
export type TaskGlyph = (typeof TASK_GLYPHS)[number];

const TILE_GLYPHS = [...TASK_GLYPHS, "clawd", "code"] as const;
export type TileGlyph = (typeof TILE_GLYPHS)[number];

export type TaskWear =
  | { kind: "glyph"; glyph: TileGlyph; prefix?: string }
  | { kind: "mascot"; look: AiboLook };

export type TaskLookSetter = "user" | "agent";

export interface TaskLook {
  wear: TaskWear;
  tint: AiboTint;
  setBy: TaskLookSetter;
  token?: string;
}

export const DEFAULT_TASK_LOOK: TaskLook = {
  wear: { kind: "glyph", glyph: "checklist" },
  tint: "clay",
  setBy: "agent",
};

export function tintOfTaskLook(look: TaskLook | undefined): AiboTint {
  return (look ?? DEFAULT_TASK_LOOK).tint;
}

const GLYPH_SEPARATOR = "_";

function asAiboTint(color: string | undefined): AiboTint | undefined {
  return AIBO_TINTS.find((tint) => tint === color);
}

/**
 * Reads a stored icon token. An explicit `color` overrides the token's tint.
 * Unknown glyphs fall back to the checklist; malformed tokens return undefined.
 */
export function parseTaskLook(
  token: string | undefined,
  color: string | undefined,
  setBy: TaskLookSetter | undefined,
): TaskLook | undefined {
  if (token === undefined || token === "") return undefined;

  const colorTint = asAiboTint(color);
  const setter: TaskLookSetter = setBy === "user" ? "user" : "agent";

  const mascot = parseAibo1Token(token);
  if (mascot !== undefined) {
    const tint = colorTint ?? mascot.tint;
    return {
      wear: { kind: "mascot", look: { ...toAiboLook(mascot), tint } },
      tint,
      setBy: setter,
      token,
    };
  }

  const separator = token.indexOf(GLYPH_SEPARATOR);
  if (separator <= 0 || isAibo1Token(token)) return undefined;

  const glyph = TILE_GLYPHS.find((candidate) => candidate === token.slice(separator + 1));
  return {
    wear:
      glyph === undefined
        ? { kind: "glyph", glyph: "checklist" }
        : { kind: "glyph", glyph, prefix: token.slice(0, separator) },
    tint: colorTint ?? "clay",
    setBy: setter,
    token,
  };
}

export function taskLookToken(prefix: string, glyph: TileGlyph): string {
  return `${prefix}${GLYPH_SEPARATOR}${glyph}`;
}
