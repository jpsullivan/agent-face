// The agent's face: a canvas mascot that shows the agent's state (idle,
// thinking, speaking…), wears hats and props, and plays one-off gestures.
import { useEffect, useMemo, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useDevicePixelRatio } from "@/external/device-pixel-ratio";
import type { MarkName } from "@/draw/mascot-kit";
import { usePrefersReducedMotion } from "@/external/motion";
import { useColorScheme } from "@/external/theme";
import {
  DEFAULT_AIBO_LOOK,
  serializeLineLook,
  toFaceLookProps,
  type AiboCharacter,
  type AiboHat,
  type AiboTint,
  type LineAccessory,
  type LineLook,
  type LineShape,
  type LineTint,
} from "@/look/aibo-look";
import { canvasPixelSize } from "./canvas-size";
import { FaceEngine } from "./engine";
import { FACE_GLYPHS, NO_WEARABLE, wearablesFor, type FaceState, type PropName } from "./face-codes";
import { useSharedFaceEngine } from "./FaceEngineProvider";
import { useFaceDrawing, type FaceDrawOptions } from "./use-face-drawing";

const DEFAULT_LOOK = toFaceLookProps(DEFAULT_AIBO_LOOK);
/** Below this size the face is drawn without its little marks (blush, sparkles). */
const MARKS_FROM_SIZE = 24;

const messages = defineMessages({
  idle: { defaultMessage: "{agentName} is idle", id: "uFrKz0/iHx" },
  listening: { defaultMessage: "{agentName} is listening", id: "JN1hfsl5a3" },
  thinking: { defaultMessage: "{agentName} is thinking", id: "aftZpnVh0P" },
  speaking: { defaultMessage: "{agentName} is speaking", id: "UEWLrkW3o2" },
  error: { defaultMessage: "{agentName} hit an error", id: "gK8MjJVmd0" },
});

/** Reactions announce as idle: they are flavor, not status. */
const ANNOUNCED_STATE: Record<FaceState, keyof typeof messages> = {
  idle: "idle",
  listening: "listening",
  thinking: "thinking",
  speaking: "speaking",
  happy: "idle",
  confused: "idle",
  sleeping: "idle",
  error: "error",
  surprised: "idle",
};

export type FaceGestureKind = "wave" | "nod" | "hop" | "spin";

export interface FaceGesture {
  /** Each distinct id plays once. */
  id: string | number;
  kind: FaceGestureKind;
}

function playGesture(engine: FaceEngine, gesture: FaceGesture): void {
  switch (gesture.kind) {
    case "wave":
      engine.wave();
      return;
    case "nod":
      engine.nod();
      return;
    case "hop":
      engine.hop();
      return;
    case "spin":
      engine.turn();
      return;
  }
}

export interface AgentFaceLine {
  shape: LineShape;
  tint: LineTint;
  accessory?: LineAccessory | null;
}

export interface AgentFaceProps {
  state: FaceState;
  agentName: string;
  character?: AiboCharacter;
  tint?: AiboTint;
  hat?: AiboHat | null;
  line?: AgentFaceLine;
  sunglasses?: boolean;
  prop?: PropName | null;
  /** Forces a mark instead of deriving it from the state or a held prop. */
  mascot?: MarkName | null;
  /** Frames the face tighter, for small seats like task tokens. */
  closer?: boolean;
  gesture?: FaceGesture | null;
  /** CSS px. */
  size?: number;
  animate?: boolean;
  /** How strongly expressions read, 0–1. */
  amplitude?: number;
  eager?: boolean;
  showMark?: boolean;
  drawsSmallInFull?: boolean;
  /** Hide from assistive tech (the surrounding UI already names the agent). */
  decorative?: boolean;
  title?: string;
  onStill?: (canvas: HTMLCanvasElement) => void;
}

export function AgentFace({
  state,
  agentName,
  character = DEFAULT_LOOK.character,
  tint = DEFAULT_LOOK.tint,
  hat = DEFAULT_LOOK.hat,
  line,
  sunglasses = false,
  prop = null,
  mascot = null,
  closer = false,
  gesture = null,
  size = 32,
  animate = false,
  amplitude = 1,
  eager = false,
  showMark,
  drawsSmallInFull = false,
  decorative = false,
  title,
  onStill,
}: AgentFaceProps) {
  const intl = useIntl();
  const prefersReducedMotion = usePrefersReducedMotion();
  const moves = animate && !prefersReducedMotion;
  const isDark = useColorScheme() === "dark";

  const sharedEngine = useSharedFaceEngine();
  const [ownEngine] = useState(() => sharedEngine ?? new FaceEngine());
  const engine = sharedEngine ?? ownEngine;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const px = canvasPixelSize(size, useDevicePixelRatio());
  const { head, face } = wearablesFor(hat, prop, sunglasses);
  const glyph = FACE_GLYPHS[state];

  const lineShape = line?.shape;
  const lineTint = line?.tint;
  const lineAccessory = line?.accessory ?? null;
  // Keyed by fields so a fresh `line` object each render doesn't restart drawing.
  const lineLook = useMemo<LineLook | undefined>(
    () =>
      lineShape === undefined || lineTint === undefined
        ? undefined
        : { shape: lineShape, tint: lineTint, accessory: lineAccessory },
    [lineAccessory, lineShape, lineTint],
  );

  // Wearables animate on and off only after the first moving render.
  const hasMovedRef = useRef(false);
  useEffect(() => {
    if (!moves) {
      hasMovedRef.current = false;
      return;
    }
    const animateWear = hasMovedRef.current;
    hasMovedRef.current = true;
    engine.show(glyph, amplitude);
    engine.setBaseHat(head, animateWear);
    const worn = engine.staying("face");
    if (face === NO_WEARABLE) {
      if (worn !== NO_WEARABLE) engine.undress("face", animateWear);
    } else if (worn !== face) {
      engine.wear(face, animateWear);
    }
  }, [engine, amplitude, glyph, head, face, moves]);

  const lastGestureRef = useRef(gesture);
  useEffect(() => {
    if (gesture === null || gesture === lastGestureRef.current) return;
    lastGestureRef.current = gesture;
    if (moves) engine.once(gesture.id, () => playGesture(engine, gesture));
  }, [engine, moves, gesture]);

  const drawOptions: FaceDrawOptions = {
    look: { character, tint, hat, line: lineLook },
    seat: size,
    showsMarks: showMark ?? size >= MARKS_FROM_SIZE,
    drawsSmallInFull,
    mascot,
    moves: animate,
    closer,
  };

  useFaceDrawing({
    canvasRef,
    engine,
    startsNearViewport: sharedEngine !== null,
    moves,
    eager,
    isDark,
    px,
    glyph,
    amplitude,
    head,
    face,
    options: drawOptions,
    wakeKey: gesture,
    onStill,
  });

  const a11y = decorative
    ? { "aria-hidden": true }
    : {
        role: "img",
        "aria-label":
          title ?? intl.formatMessage(messages[ANNOUNCED_STATE[state]], { agentName }),
      };

  return (
    <span
      {...a11y}
      data-part="face"
      data-state={state}
      data-character={character}
      data-tint={tint}
      data-hat={hat ?? undefined}
      data-messages-line-look={
        line === undefined ? undefined : serializeLineLook({ ...line, accessory: line.accessory ?? null })
      }
      data-prop={prop ?? undefined}
      data-mascot={mascot ?? undefined}
      data-sunglasses={sunglasses ? "" : undefined}
      data-animate={animate ? "" : undefined}
      className="inline-block shrink-0 align-middle"
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </span>
  );
}
