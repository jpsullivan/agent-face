// A rounded tile with a glyph icon: the fallback task token while the clay tile
// renderer is unavailable, and the bare icon when an icon size is in context.
import { use, type CSSProperties } from "react";
import { cn } from "@/external/class-names";
import { Icon } from "@/external/icon";
import { useColorScheme } from "@/external/theme";
import { aiboTintBgClass, aiboTintTextClass, type AiboTint } from "@/look/aibo-look";
import type { TileGlyph } from "@/tokens/task-look";
import { TileIconSizeContext, TileStyleContext } from "./tile-contexts";
import { tileFillHex, tileInkHex } from "./tints";

const ICON_NAME: Record<TileGlyph, string> = {
  checklist: "Checklist",
  calendar: "Calendar",
  email: "Email",
  dollarSign: "DollarSign",
  chart: "Chart",
  globe: "Globe",
  mapPin: "MapPin",
  home: "Home",
  box: "Box",
  slides: "Slides",
  folder: "Folder",
  edit: "Edit",
  search: "Search",
  clawd: "Code",
  code: "Code",
};

const ICON_SHARE = 0.56;
const CORNER_SHARE = 0.28;

export interface TaskGlyphTileProps {
  glyph: TileGlyph;
  tint: AiboTint;
  size: number;
  isNeutral?: boolean;
  /** The user picked clay explicitly, so a clawd glyph keeps its color even when neutral. */
  isClayChosen?: boolean;
  style?: CSSProperties;
}

export function TaskGlyphTile({
  glyph,
  tint,
  size,
  isNeutral = false,
  isClayChosen = false,
  style,
}: TaskGlyphTileProps) {
  const isTinted = use(TileStyleContext) === "tinted";
  const isDark = useColorScheme() === "dark";
  const iconSize = use(TileIconSizeContext);

  const shownTint = glyph === "clawd" ? "clay" : tint;
  const neutral = isNeutral && !(isClayChosen && glyph === "clawd");
  const usesHex = isTinted && !neutral;

  const iconClassName = cn(
    "relative",
    neutral ? "text-secondary" : !usesHex && aiboTintTextClass(shownTint),
  );
  const iconStyle = { color: usesHex ? tileInkHex(shownTint, isDark) : undefined, ...style };

  if (iconSize !== undefined) {
    return <Icon name={ICON_NAME[glyph]} size={iconSize} className={iconClassName} style={iconStyle} />;
  }

  return (
    <>
      <span
        className={cn(
          "absolute inset-0",
          neutral ? "bg-alpha-1" : ["opacity-[0.16]", !usesHex && aiboTintBgClass(shownTint)],
        )}
        style={{
          borderRadius: size * CORNER_SHARE,
          backgroundColor: usesHex ? tileFillHex(shownTint) : undefined,
          ...style,
        }}
      />
      <Icon
        name={ICON_NAME[glyph]}
        customSize={Math.round(size * ICON_SHARE)}
        className={iconClassName}
        style={iconStyle}
      />
    </>
  );
}
