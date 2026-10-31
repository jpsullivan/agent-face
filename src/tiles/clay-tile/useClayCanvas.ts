// Draws a clay tile into a canvas once it nears the viewport and the face renderer has loaded.
import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { flushSync } from "react-dom";
import {
  IDLE_CALLBACK_FALLBACK_MS,
  faceRendererNow,
  loadFaceRenderer,
} from "@/face/renderer-loader";
import type { FaceRenderer } from "@/draw/face-renderer";
import { clayBlankForGlyph, type ClayBlank } from "./clay-glaze";
import { clayCanvasSide, packClayParams, type ClayLook } from "./clay-params";
import { builtInLineSet } from "./line-set";

export interface ClayCanvasOptions extends ClayLook {
  rootRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Tile size in CSS px. */
  size: number;
  /** Device pixel ratio to draw at. */
  ratio: number;
}

export interface ClayCanvasStatus {
  /** The renderer is available, so the canvas should be in the tree. */
  mounts: boolean;
  /** The canvas holds a whole drawing for the current blank and size. */
  drawn: boolean;
  /** The drawing arrived after a wait, so it should fade in. */
  fades: boolean;
}

interface DrawnClay {
  blank: ClayBlank;
  size: number;
  waited: boolean;
}

/** Largest canvas side, in device px. */
const MAX_CANVAS_SIDE = 1024;
const VIEWPORT_MARGIN = "128px";
const FIRST_RETRY_DELAY_MS = 60;
const MAX_RETRIES = 20;

function cannotObserveIntersections(): boolean {
  return typeof IntersectionObserver !== "function";
}

function currentRenderer(): FaceRenderer | null {
  return faceRendererNow() ?? null;
}

export function useClayCanvas({
  rootRef,
  canvasRef,
  glyph,
  state,
  seed,
  tint,
  fill,
  neutral,
  dark,
  size,
  ratio,
}: ClayCanvasOptions): ClayCanvasStatus {
  const blank = clayBlankForGlyph(glyph);
  const [seen, setSeen] = useState(cannotObserveIntersections);
  const [renderer, setRenderer] = useState(currentRenderer);
  const [drawn, setDrawn] = useState<DrawnClay | null>(null);

  if (drawn !== null && (drawn.blank !== blank || drawn.size !== size)) setDrawn(null);

  useEffect(() => {
    const root = rootRef.current;
    if (seen || root === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setSeen(true);
        }
      },
      { rootMargin: VIEWPORT_MARGIN },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
    };
  }, [rootRef, seen]);

  useEffect(() => {
    if (!seen) return;
    let cancelled = false;
    void loadFaceRenderer().then((loaded) => {
      if (!cancelled) setRenderer(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [seen]);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;
    return () => {
      delete root.dataset.drawn;
    };
  }, [rootRef]);

  // Stable identity matters: the two draw effects below re-run whenever this changes.
  const draw = useCallback((): (() => void) | undefined => {
    if (renderer === null) return;
    const lineSet = builtInLineSet();
    if (lineSet === null) return;

    const seatPoints = Math.max(1, size);
    const canvasSide = clayCanvasSide(seatPoints);
    const drawRatio = Math.min(ratio, MAX_CANVAS_SIDE / canvasSide);
    const side = Math.round(canvasSide * drawRatio);
    const params = packClayParams(
      { glyph, state, seed, tint, fill, neutral, dark },
      lineSet,
      { seatPoints, seat: seatPoints * drawRatio, side },
    );

    // Before the tile is near the viewport, only draw what the renderer has cached.
    const context =
      seen || renderer.kept(params, side) ? (canvasRef.current?.getContext("2d") ?? null) : null;
    if (context === null) {
      setDrawn(null);
      return;
    }

    const root = rootRef.current;
    let retryTimer: number | undefined;
    let fadeFrame: number | undefined;
    let retryDelay = FIRST_RETRY_DELAY_MS;
    let retriesLeft = MAX_RETRIES;
    let waited = false;

    const markDrawn = () => {
      setDrawn((previous) =>
        previous !== null && previous.blank === blank && previous.size === size
          ? previous
          : { blank, size, waited },
      );
    };

    const paint = () => {
      if (context.canvas.width !== side) {
        context.canvas.width = side;
        context.canvas.height = side;
      }
      const result = renderer.still(context, params, side);
      if (root !== null) root.dataset.drawn = result;

      if (result === "whole") {
        if (waited) {
          fadeFrame = requestAnimationFrame(() => {
            flushSync(markDrawn);
          });
        } else {
          markDrawn();
        }
        return;
      }

      if (!waited) setDrawn(null);
      if (result !== "never" && retriesLeft > 0) {
        retriesLeft -= 1;
        waited = true;
        retryTimer = window.setTimeout(paint, retryDelay);
        retryDelay = Math.min(retryDelay * 2, IDLE_CALLBACK_FALLBACK_MS);
      }
    };

    paint();
    return () => {
      window.clearTimeout(retryTimer);
      if (fadeFrame !== undefined) cancelAnimationFrame(fadeFrame);
    };
  }, [blank, canvasRef, dark, fill, glyph, neutral, ratio, renderer, rootRef, seed, seen, size, state, tint]);

  // Cached drawings paint before the browser does, so off-screen tiles never flash empty.
  useLayoutEffect(() => (seen ? undefined : draw()), [draw, seen]);
  useEffect(() => (seen ? draw() : undefined), [draw, seen]);

  return {
    mounts: renderer !== null,
    drawn: drawn !== null,
    fades: drawn !== null && drawn.waited,
  };
}
