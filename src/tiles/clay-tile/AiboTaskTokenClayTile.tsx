// The clay task token: the flat glyph tile, overlaid by a rendered clay canvas that fades in once drawn.
import { use, useRef, type CSSProperties, type RefObject } from "react";
import type { AiboTint } from "@/look/aibo-look";
import { TaskGlyphTile } from "@/tiles/TaskGlyphTile";
import { TileStyleContext } from "@/tiles/tile-contexts";
import type { TileGlyph } from "@/tokens/task-look";
import { claySeedFor, type ClayState } from "./clay-glaze";
import { usePrefersReducedMotion } from "@/external/motion";
import { useColorScheme } from "@/external/theme";
import { clayCanvasSide } from "./clay-params";
import { useClayCanvas } from "./useClayCanvas";

export interface AiboTaskTokenClayTileProps {
  /** The token's root element; observed for visibility and tagged with `data-drawn`. */
  rootRef: RefObject<HTMLElement | null>;
  glyph: TileGlyph;
  tint: AiboTint;
  size: number;
  state?: ClayState;
  /** Matte tiles are drawn dry, ignoring `state`. */
  isMatte: boolean;
  isNeutral: boolean;
  /** Seeds the clay's variation; without it every tile uses seed 0. */
  taskId?: string;
}

const FADE_IN_TRANSITION = "opacity 150ms";
const MAX_DEVICE_PIXEL_RATIO = 2;
const DEFAULT_CLAY_STATE: ClayState = "resting";
const MATTE_CLAY_STATE: ClayState = "dry";

function drawingPixelRatio(): number {
  return typeof devicePixelRatio === "number"
    ? Math.min(devicePixelRatio, MAX_DEVICE_PIXEL_RATIO)
    : 1;
}

export function AiboTaskTokenClayTile({
  rootRef,
  glyph,
  tint,
  size,
  state,
  isMatte,
  isNeutral,
  taskId,
}: AiboTaskTokenClayTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileStyle = use(TileStyleContext);
  const dark = useColorScheme() === "dark";
  const prefersReducedMotion = usePrefersReducedMotion();

  const { mounts, drawn, fades } = useClayCanvas({
    rootRef,
    canvasRef,
    glyph,
    state: isMatte ? MATTE_CLAY_STATE : (state ?? DEFAULT_CLAY_STATE),
    seed: taskId === undefined ? 0 : claySeedFor(taskId, glyph),
    tint,
    fill: tileStyle,
    neutral: isNeutral,
    dark,
    size,
    ratio: drawingPixelRatio(),
  });

  const transition = fades && !prefersReducedMotion ? FADE_IN_TRANSITION : undefined;

  return (
    <>
      <TaskGlyphTile
        glyph={glyph}
        tint={tint}
        size={size}
        isNeutral={isNeutral || tileStyle === "grey"}
        isClayChosen={tileStyle === "tinted"}
        style={drawn ? { opacity: 0, transition } : undefined}
      />
      {mounts && (
        <ClayCanvas
          ref={canvasRef}
          side={clayCanvasSide(size)}
          style={{ opacity: drawn ? 1 : 0, transition }}
        />
      )}
    </>
  );
}

interface ClayCanvasProps {
  ref: RefObject<HTMLCanvasElement | null>;
  /** CSS side in px; the canvas is centred over the tile and may overflow it. */
  side: number;
  style: Pick<CSSProperties, "opacity" | "transition">;
}

function ClayCanvas({ ref, side, style }: ClayCanvasProps) {
  return (
    <canvas
      ref={ref}
      data-part="clay"
      data-look="line"
      className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
      style={{ width: side, height: side, ...style }}
    />
  );
}
