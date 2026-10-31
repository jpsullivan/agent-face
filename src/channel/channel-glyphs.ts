import { TASK_GLYPHS, type TileGlyph } from "@/tokens/task-look";

/** Channel-only glyphs: drawn as pictograms, shown as a checklist tile elsewhere. */
export const EXTRA_CHANNEL_GLYPHS = [
  "heart",
  "people",
  "briefcase",
  "book",
  "plane",
  "car",
  "food",
  "bag",
  "gift",
  "sprout",
  "music",
] as const;
export type ExtraChannelGlyph = (typeof EXTRA_CHANNEL_GLYPHS)[number];

/** Every glyph that has a channel pictogram. */
export const CHANNEL_GLYPHS = [...TASK_GLYPHS, ...EXTRA_CHANNEL_GLYPHS] as const;
export type PictogramGlyph = (typeof CHANNEL_GLYPHS)[number];

/** Anything a channel icon can show; `clawd`/`code` fall back to a task tile. */
export type ChannelGlyph = TileGlyph | ExtraChannelGlyph;

export function isExtraChannelGlyph(glyph: string): glyph is ExtraChannelGlyph {
  return EXTRA_CHANNEL_GLYPHS.some((extra) => extra === glyph);
}

export function toTileGlyph(glyph: ChannelGlyph): TileGlyph {
  return isExtraChannelGlyph(glyph) ? "checklist" : glyph;
}
