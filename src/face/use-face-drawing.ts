// Drives a face canvas: loads the mascot kit once the canvas is near the
// viewport, then either paints one still frame or runs a timer-based loop that
// sleeps whenever the engine and renderer have nothing left to animate.
import { useEffect, useEffectEvent, useRef, type RefObject } from "react";
import { focusManager } from "@tanstack/react-query";
import { ownerWindowOf, timersFor } from "@/external/dom-window";
import type {
  LiveMascot,
  MarkName,
  MascotDrawOptions,
  MascotDrawing,
  MascotKit,
} from "@/draw/mascot-kit";
import type { AiboCharacter, AiboHat, AiboTint, LineLook } from "@/look/aibo-look";
import { isPageVisible, subscribeToVisibilityChange } from "@/external/page-visibility";
import { stillFaceFrame, type FaceEngine, type FaceFrame } from "./engine";
import type { FaceGlyph, WearableCode } from "./face-codes";
import { inputActivity } from "./input-activity";
import { loadMascotKit, mascotKitNow } from "./renderer-loader";

const VIEWPORT_MARGIN = "128px";

/**
 * What the face hands the kit. The original passes the whole look; the mark
 * kit only reads `mascot`, `seat`, `moves` and `closer`, so the rest is inert
 * (other kits in the app may read it).
 */
export interface FaceDrawOptions extends MascotDrawOptions {
  look: { character: AiboCharacter; tint: AiboTint; hat: AiboHat | null; line?: LineLook };
  showsMarks: boolean;
  drawsSmallInFull: boolean;
  mascot: MarkName | null;
  moves: boolean;
  closer: boolean;
}

export interface FaceDrawingInput {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  engine: FaceEngine;
  /** Whether this face starts out inside a shared engine (already on screen). */
  startsNearViewport: boolean;
  /** Animate with the engine; false paints a single still frame. */
  moves: boolean;
  /** Load the renderer without waiting for the page to settle. */
  eager: boolean;
  isDark: boolean;
  px: number;
  glyph: FaceGlyph;
  amplitude: number;
  head: WearableCode;
  face: WearableCode;
  options: FaceDrawOptions;
  /** Changing this restarts the loop so a sleeping face wakes to play a gesture. */
  wakeKey: unknown;
  onStill?: (canvas: HTMLCanvasElement) => void;
}

function isIntersecting(entry: IntersectionObserverEntry): boolean {
  return entry.isIntersecting;
}

export function useFaceDrawing({
  canvasRef,
  engine,
  startsNearViewport,
  moves,
  eager,
  isDark,
  px,
  glyph,
  amplitude,
  head,
  face,
  options,
  wakeKey,
  onStill,
}: FaceDrawingInput): void {
  const liveRef = useRef<LiveMascot | null>(null);
  const nearViewportRef = useRef(startsNearViewport);
  const visibleRef = useRef(true);
  const reportStill = useEffectEvent((canvas: HTMLCanvasElement) => onStill?.(canvas));

  const { look, seat, showsMarks, drawsSmallInFull, mascot, closer } = options;
  const { character, tint, hat, line } = look;

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawOptions: FaceDrawOptions = {
      look: { character, tint, hat, line },
      seat,
      showsMarks,
      drawsSmallInFull,
      mascot,
      moves: options.moves,
      closer,
    };

    let disposed = false;
    let timer: number | undefined;
    let observer: IntersectionObserver | undefined;
    let wake: (() => void) | undefined;
    let frame: FaceFrame | undefined;
    let sleeping = false;
    let detachContextRestore: (() => void) | undefined;

    const timers = timersFor(canvas);
    const ownerWindow = moves ? ownerWindowOf(canvas) : null;
    const activity = ownerWindow === null ? null : inputActivity(ownerWindow);
    let wokeAt = 0;

    const nudge = () => {
      wokeAt = performance.now();
      wake?.();
    };
    const cancelTimer = () => timers.clearTimeout(timer);

    const start = (kit: MascotKit) => {
      const context = canvas?.getContext("2d") ?? null;
      if (context === null) return;

      let lastDrawing: MascotDrawing | undefined;
      const paint = (makeDrawing: () => MascotDrawing): boolean => {
        if (context.canvas.width !== px) {
          context.canvas.width = px;
          context.canvas.height = px;
        }
        let painted = false;
        try {
          lastDrawing = makeDrawing();
          painted = kit.paint(context, lastDrawing, px, isDark);
        } catch {
          // A failed paint leaves the host marked "never" so CSS can show a fallback.
        }
        const host = context.canvas.parentElement;
        const drawn = painted ? "whole" : "never";
        if (host !== null && host.dataset.drawn !== drawn) host.dataset.drawn = drawn;
        return painted;
      };

      // A lost-then-restored context comes back blank; repaint the last frame.
      const repaint = () => {
        if (lastDrawing === undefined) return;
        const drawing = { ...lastDrawing };
        paint(() => drawing);
      };
      detachContextRestore?.();
      context.canvas.addEventListener("contextrestored", repaint);
      detachContextRestore = () => context.canvas.removeEventListener("contextrestored", repaint);

      const drawStill = () => {
        liveRef.current?.rest?.();
        if (paint(() => kit.still(stillFaceFrame(glyph, head, face, amplitude), drawOptions))) {
          reportStill(context.canvas);
        }
      };

      const tick = () => {
        if (disposed) return;
        cancelTimer();
        sleeping = false;
        if (!visibleRef.current || !isPageVisible()) return;

        const live = liveRef.current ?? kit.live();
        liveRef.current = live;
        const nowMs = performance.now();
        if (frame === undefined || !engine.isSettled || nowMs / 1000 >= engine.nextEventAt) {
          frame = engine.step();
        }
        const current = frame;
        const lastInputMs = activity === null ? undefined : Math.max(activity.lastMs(), wokeAt);
        if (!paint(() => live.drawing(current, drawOptions, nowMs, lastInputMs))) return;

        const nextShowMs = engine.nextShowAt * 1000;
        if (live.isAtRest?.() === true && nextShowMs === Infinity && !focusManager.isFocused()) {
          sleeping = true;
          return;
        }
        const delay = Math.ceil(Math.min(live.nextChangeAtMs(), nextShowMs) - nowMs);
        if (delay < Infinity) timer = timers.setTimeout(tick, Math.max(1, delay));
      };

      if (moves) {
        wake = tick;
        tick();
      } else {
        drawStill();
      }
    };

    const load = () => {
      if (disposed) return;
      const kit = mascotKitNow();
      if (kit === undefined) {
        void loadMascotKit(eager).then((loaded) => {
          if (loaded !== null && !disposed) start(loaded);
        });
      } else if (kit !== null) {
        start(kit);
      }
    };

    const stands = () => liveRef.current?.stands?.() === true;
    const unsubscribeVisibility = moves
      ? subscribeToVisibilityChange(() => {
          if (isPageVisible()) nudge();
        })
      : undefined;
    const unsubscribeFocus = moves
      ? focusManager.subscribe((focused) => {
          if (focused && (sleeping || stands())) nudge();
        })
      : undefined;
    const removeActivity = activity?.add(() => {
      if (stands()) wake?.();
    });

    const canObserve = typeof IntersectionObserver === "function";
    if (nearViewportRef.current || !canObserve) load();

    if (canvas !== null && canObserve && (moves || !nearViewportRef.current)) {
      observer = new IntersectionObserver(
        (entries) => {
          const wasVisible = visibleRef.current;
          visibleRef.current = entries.at(-1)?.isIntersecting === true;
          if (nearViewportRef.current) {
            if (visibleRef.current && !wasVisible) nudge();
          } else {
            if (!entries.some(isIntersecting)) return;
            nearViewportRef.current = true;
            load();
          }
          // Still faces only needed the first sighting.
          if (!moves) observer?.disconnect();
        },
        { rootMargin: VIEWPORT_MARGIN },
      );
      observer.observe(canvas);
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      unsubscribeVisibility?.();
      unsubscribeFocus?.();
      removeActivity?.();
      detachContextRestore?.();
      cancelTimer();
    };
  }, [
    canvasRef,
    engine,
    moves,
    px,
    character,
    tint,
    hat,
    line,
    isDark,
    showsMarks,
    seat,
    glyph,
    head,
    face,
    amplitude,
    drawsSmallInFull,
    mascot,
    options.moves,
    closer,
    wakeKey,
    eager,
  ]);
}
