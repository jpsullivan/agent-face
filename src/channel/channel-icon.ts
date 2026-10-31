// Picks a channel's icon: an explicit icon token if it has one, otherwise a
// glyph guessed from the channel name and a tint derived from its id.
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import {
  AIBO_TINTS,
  LINE_SHAPES,
  LINE_TINTS,
  aiboTintForLineTint,
  parseAibo3Token,
  type AiboTint,
} from "@/look/aibo-look";
import { DEFAULT_TASK_LOOK, TASK_GLYPHS, parseTaskLook, type TaskGlyph } from "@/tokens/task-look";
import { isExtraChannelGlyph, type ChannelGlyph } from "./channel-glyphs";

/** Tints handed out to channels without a color. */
export const CHANNEL_TINTS: readonly AiboTint[] = ["clay", "heather", "mineral", "ochre", "cornflower", "rose"];

const GLYPH_KEYWORDS: readonly [TaskGlyph, readonly string[]][] = [
  ["calendar", ["calendar", "date", "schedule", "agenda", "week"]],
  ["email", ["mail", "email", "inbox", "newsletter"]],
  ["dollarSign", ["money", "budget", "expense", "invoice", "bill", "cost"]],
  ["chart", ["chart", "graph", "metric", "dashboard", "stats"]],
  ["globe", ["travel", "trip", "flight", "hotel", "itinerary"]],
  ["mapPin", ["map", "route", "directions"]],
  ["home", ["home", "house", "chore"]],
  ["box", ["shop", "shopping", "grocery", "order"]],
  ["slides", ["deck", "slides", "presentation"]],
  ["folder", ["file", "document", "folder"]],
  ["edit", ["write", "draft", "doc", "post"]],
  ["search", ["find", "research", "look", "compare"]],
];

const PLURAL_SUFFIXES = ["", "s", "es"];

/** Lower-cased words of a name (one code point per character, so "İ" stays one letter). */
function wordsOf(name: string): Set<string> {
  const lowered = Array.from(name, (char) => Array.from(char.toLowerCase())[0] ?? char).join("");
  return new Set(lowered.split(/[^\p{L}\p{Nd}]+/u).filter(Boolean));
}

export function glyphForName(name: string): TaskGlyph | undefined {
  const words = wordsOf(name);
  return GLYPH_KEYWORDS.find(([, keywords]) =>
    keywords.some((keyword) => PLURAL_SUFFIXES.some((suffix) => words.has(keyword + suffix))),
  )?.[0];
}

export interface ChannelIcon {
  glyph: ChannelGlyph;
  tint: AiboTint;
}

export interface ChannelIconSource {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
}

function defaultChannelIcon({ id, name, color }: ChannelIconSource): ChannelIcon {
  // Stable per channel: the first two bytes of sha256(id) pick tint and fallback glyph.
  const [tintByte = 0, glyphByte = 0] = sha256(utf8ToBytes(id));
  return {
    glyph: glyphForName(name) ?? TASK_GLYPHS[glyphByte % TASK_GLYPHS.length]!,
    tint:
      (color ?? "") === ""
        ? CHANNEL_TINTS[tintByte % CHANNEL_TINTS.length]!
        : (AIBO_TINTS.find((tint) => tint === color) ?? "clay"),
  };
}

/** True for tokens whose prefix is the Aibo3 line-look prefix, even if malformed. */
function hasLineLookPrefix(icon: string): boolean {
  const [prefix, ...rest] = icon.split("_");
  return rest.length > 0 && parseAibo3Token(`${prefix}_${LINE_SHAPES[0]}_${LINE_TINTS[0]}`) !== undefined;
}

export function channelIconFor(channel: ChannelIconSource): ChannelIcon {
  const icon = channel.icon ?? "";
  const lineLook = parseAibo3Token(icon);
  if (lineLook !== undefined) {
    return { ...defaultChannelIcon(channel), tint: aiboTintForLineTint(lineLook.tint) };
  }
  if (icon === "") return defaultChannelIcon(channel);

  const parsed = hasLineLookPrefix(icon) ? undefined : parseTaskLook(icon, channel.color ?? undefined, undefined);
  const { wear, tint } = parsed ?? DEFAULT_TASK_LOOK;
  if (wear.kind !== "glyph") return { glyph: "folder", tint };

  // Task looks only know task glyphs; keep a channel-only glyph from the raw token.
  const suffix = icon.slice(icon.indexOf("_") + 1);
  return { glyph: parsed !== undefined && isExtraChannelGlyph(suffix) ? suffix : wear.glyph, tint };
}
