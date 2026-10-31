// Channel pictograms: hand-drawn line art over a soft tinted fill.
import type { ReactNode } from "react";
import { useColorScheme } from "@/external/theme";
import { baseLineTintForAiboTint, lineTintForAiboTint, type AiboTint } from "@/look/aibo-look";
import { tileFillHex, tileInkHex } from "@/tiles/tints";
import type { PictogramGlyph } from "./channel-glyphs";
import {
  ALL_CHANNELS_FILL,
  ALL_CHANNELS_LINE,
  GLYPH_FILLS,
  GLYPH_LINES,
  type PictogramLine,
} from "./pictograms";

const OPEN_STROKE = 26;
const FILLED_STROKE = 16;

interface PictogramFrameProps {
  line: PictogramLine;
  ink: string;
  size: number;
  /** Share of the box the art fills; the rest is even padding. */
  share: number;
  /** The fill layer, painted under the line art. */
  children: ReactNode;
}

function PictogramFrame({ line, ink, size, share, children }: PictogramFrameProps) {
  const box = line.side / share;
  const pad = (box - line.side) / 2;
  return (
    <svg
      data-part="channel-pictogram"
      aria-hidden="true"
      viewBox={`${-pad} ${-pad} ${box} ${box}`}
      className="block max-w-full shrink-0"
      style={{ width: size, height: size }}
    >
      {children}
      <g
        fill={line.filled ? ink : "none"}
        stroke={ink}
        strokeWidth={line.filled ? FILLED_STROKE : OPEN_STROKE}
        strokeLinecap={line.filled ? undefined : "round"}
        strokeLinejoin="round"
      >
        {line.d.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Tints with a lighter line variant need a stronger fill to read in light mode. */
function fillOpacity(tint: AiboTint, isDark: boolean): number {
  if (lineTintForAiboTint(tint) === baseLineTintForAiboTint(tint)) return 0.28;
  return isDark ? 0.3 : 0.85;
}

export interface GlyphPictogramProps {
  glyph: PictogramGlyph;
  tint: AiboTint;
  size: number;
  share: number;
}

export function GlyphPictogram({ glyph, tint, size, share }: GlyphPictogramProps) {
  const isDark = useColorScheme() === "dark";
  return (
    <PictogramFrame line={GLYPH_LINES[glyph]} ink={tileInkHex(tint, isDark)} size={size} share={share}>
      <g fill={tileFillHex(tint)} opacity={fillOpacity(tint, isDark)}>
        {GLYPH_FILLS[glyph].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </PictogramFrame>
  );
}

export function AllChannelsPictogram({ size, share }: { size: number; share: number }) {
  const isDark = useColorScheme() === "dark";
  return (
    <PictogramFrame line={ALL_CHANNELS_LINE} ink={tileInkHex("clay", isDark)} size={size} share={share}>
      <path d={ALL_CHANNELS_FILL} fill={tileFillHex("clay")} opacity={0.28} />
    </PictogramFrame>
  );
}
