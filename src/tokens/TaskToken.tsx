// A task's token: a glyph tile (flat, or the clay tile on surfaces that load
// it) or a tiny mascot face, chosen by what the task's look wears.
import { useRef, type RefObject } from "react";
import { cn } from "@/external/class-names";
import { AgentFace } from "@/face/AgentFace";
import { toFaceLookProps, type AiboLook, type AiboTint } from "@/look/aibo-look";
import { TaskGlyphTile } from "@/tiles/TaskGlyphTile";
import { useClayTile, useIsClayTileSurface } from "./clay-tile-loader";
import type { TaskLook, TileGlyph } from "./task-look";

const DEFAULT_SIZE = 28;
/** Mascots overflow the token box a little so the face, not the body, fills it. */
const MASCOT_SCALE = 1.45;

export type TaskTokenState = string;

export interface TaskTokenGlyphProps {
  rootRef: RefObject<HTMLSpanElement | null>;
  glyph: TileGlyph;
  tint: AiboTint;
  size: number;
  state?: TaskTokenState;
  isMatte: boolean;
  isNeutral: boolean;
  taskId?: string;
}

function TaskTokenGlyph(props: TaskTokenGlyphProps) {
  const isClaySurface = useIsClayTileSurface();
  const ClayTile = useClayTile();
  if (ClayTile !== null) return <ClayTile {...props} />;
  return (
    <TaskGlyphTile
      glyph={props.glyph}
      tint={props.tint}
      size={props.size}
      isNeutral={props.isNeutral}
      isClayChosen={isClaySurface}
    />
  );
}

function TaskTokenMascot({ look, tint, size }: { look: AiboLook; tint: AiboTint; size: number }) {
  return (
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <AgentFace
        state="idle"
        agentName=""
        {...toFaceLookProps({ ...look, tint })}
        size={Math.round(size * MASCOT_SCALE)}
        showMark={false}
        animate={false}
        closer
        decorative
      />
    </span>
  );
}

export interface TaskTokenProps {
  look: TaskLook;
  size?: number;
  state?: TaskTokenState;
  /** Dimmed, static token (e.g. archived tasks). */
  isMatte?: boolean;
  isNeutral?: boolean;
  taskId?: string;
}

export function TaskToken({
  look,
  size = DEFAULT_SIZE,
  state,
  isMatte = false,
  isNeutral = false,
  taskId,
}: TaskTokenProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const { wear, tint } = look;

  return (
    <span
      ref={rootRef}
      data-part="token"
      data-wear={wear.kind}
      data-state={wear.kind === "glyph" && !isMatte ? state : undefined}
      data-matte={isMatte || undefined}
      aria-hidden="true"
      className={cn("relative flex shrink-0 items-center justify-center", isMatte && "opacity-70")}
      style={{ width: size, height: size }}
    >
      {wear.kind === "mascot" ? (
        <TaskTokenMascot look={wear.look} tint={tint} size={size} />
      ) : (
        <TaskTokenGlyph
          rootRef={rootRef}
          glyph={wear.glyph}
          tint={tint}
          size={size}
          state={state}
          isMatte={isMatte}
          isNeutral={isNeutral}
          taskId={taskId}
        />
      )}
    </span>
  );
}
