// A channel's icon in lists and headers. Pictogram glyphs draw as line art;
// anything else (clawd/code) falls back to a tinted task tile.
import { cn } from "@/external/class-names";
import { ICON_SIZES, useDensity, useRootFontSize, type IconSize } from "@/external/density";
import { TileIconSizeContext, TileStyleContext } from "@/tiles/tile-contexts";
import { ClayTileSurfaceContext } from "@/tokens/clay-tile-loader";
import { TaskToken } from "@/tokens/TaskToken";
import { CHANNEL_GLYPHS, toTileGlyph } from "./channel-glyphs";
import type { ChannelIcon } from "./channel-icon";
import { AllChannelsPictogram, GlyphPictogram } from "./ChannelPictogram";

/** Named icon sizes leave room around the art, like the icon set's 22px-in-28px grid. */
const NAMED_SIZE_SHARE = 22 / 28;
const BASE_FONT_SIZE = 16;

export type ChannelTokenSize = IconSize | number | "auto";

export interface ChannelTokenProps {
  icon?: ChannelIcon;
  /** Shows the "all channels" mark instead of `icon`. */
  allChannels?: boolean;
  /** "auto" follows UI density. */
  size: ChannelTokenSize;
  className?: string;
}

function ChannelTokenArt({
  icon,
  allChannels,
  px,
  namedSize,
}: {
  icon: ChannelIcon | undefined;
  allChannels: boolean;
  px: number;
  namedSize: IconSize | undefined;
}) {
  const share = namedSize === undefined ? NAMED_SIZE_SHARE : 1;
  if (allChannels) return <AllChannelsPictogram size={px} share={share} />;
  if (icon === undefined) return null;

  const pictogramGlyph = CHANNEL_GLYPHS.find((glyph) => glyph === icon.glyph);
  if (pictogramGlyph !== undefined) {
    return <GlyphPictogram glyph={pictogramGlyph} tint={icon.tint} size={px} share={share} />;
  }

  return (
    <ClayTileSurfaceContext value={true}>
      <TileStyleContext value="tinted">
        <TileIconSizeContext value={namedSize}>
          <TaskToken
            look={{ wear: { kind: "glyph", glyph: toTileGlyph(icon.glyph) }, tint: icon.tint, setBy: "agent" }}
            size={px}
          />
        </TileIconSizeContext>
      </TileStyleContext>
    </ClayTileSurfaceContext>
  );
}

export function ChannelToken({ icon, allChannels = false, size, className }: ChannelTokenProps) {
  const isComfortable = useDensity() === "comfortable";
  const fontScale = useRootFontSize() / BASE_FONT_SIZE;

  const resolved = size === "auto" ? (isComfortable ? "md" : "sm") : size;
  const namedSize = typeof resolved === "number" ? undefined : resolved;
  const px = typeof resolved === "number" ? resolved : ICON_SIZES[resolved].px * fontScale;

  return (
    <span
      aria-hidden="true"
      data-part="channel-token"
      data-glyph={allChannels ? "allChannels" : icon?.glyph}
      data-tint={icon?.tint}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
    >
      <ChannelTokenArt icon={icon} allChannels={allChannels} px={px} namedSize={namedSize} />
    </span>
  );
}
