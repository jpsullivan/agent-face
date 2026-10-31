// The face renderer: draws clay tokens and their line drawings from a packed
// parameter block on a private WebGL2 canvas, then copies the result into a
// caller's 2D canvas. Stills are cached as 2D canvases.
import { createGlCanvas, setUpContext } from "./gl-context";
import {
  GLYPH_RANGE,
  GLYPH_SLOT,
  LINE_PARAMS_BYTES,
  TOKEN_PARAMS_BYTES,
  ANY_GLYPH,
} from "./params";
import { LINE_PROGRAM, createProgramCache, tokenProgram, type ProgramSpec } from "./programs";
import { createStillCache, stillKey } from "./still-cache";

/**
 * "whole": the picture is complete. "never": these params cannot be drawn
 * (unknown size or glyph, or the shader failed to link). "pending": the
 * program is still compiling or the context is lost; try again shortly.
 */
export type DrawState = "whole" | "never" | "pending";

export interface FaceRenderer {
  /** Renders and, when whole, paints into `context`. Never caches. */
  draw(context: CanvasRenderingContext2D, params: ArrayBuffer, side: number): DrawState;
  /** Whether `params` could be drawn now; starts compiling its program if needed. */
  state(params: ArrayBuffer): DrawState;
  /** True when this renderer's program for `params` is ready to draw it. */
  own(params: ArrayBuffer): boolean;
  /** True when a still for these exact params and side is cached. */
  kept(params: ArrayBuffer, side: number): boolean;
  /** Paints a still into `context`, from the cache or by rendering (and caching) it. */
  still(context: CanvasRenderingContext2D, params: ArrayBuffer, side: number): DrawState;
  /** A PNG data URL of the rendered params, or undefined if not drawable right now. */
  pngUrl(params: ArrayBuffer, side: number): string | undefined;
}

type Resolution =
  | { drawn: "pending" | "never"; program?: undefined; own?: undefined }
  | { drawn: "whole"; program: WebGLProgram; own: true };

/** The vertex shader emits one triangle that covers the viewport. */
const FULLSCREEN_TRIANGLE_VERTICES = 3;

/** Copies the bottom-left `side` square of `source` (GL's origin) over all of `context`. */
function blit(context: CanvasRenderingContext2D, source: HTMLCanvasElement, side: number): void {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.drawImage(source, 0, source.height - side, side, side, 0, 0, width, height);
}

/** Null when WebGL2 is unavailable. */
export function createRenderer(): FaceRenderer | null {
  const created = createGlCanvas();
  if (created === null) return null;
  const { canvas, gl } = created;

  let resources = setUpContext(gl);
  const programs = createProgramCache(gl, () => resources);
  const stills = createStillCache();

  canvas.addEventListener("webglcontextlost", (event) => {
    // Opt in to restoration.
    event.preventDefault();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    programs.reset();
    resources = setUpContext(gl);
  });

  const resolveProgram = (spec: ProgramSpec): Resolution => {
    if (gl.isContextLost()) return { drawn: "pending" };
    const program = programs.get(spec);
    if (program === undefined) return { drawn: "pending" };
    if (program === "failed") return { drawn: "never" };
    return { program, drawn: "whole", own: true };
  };

  const resolve = (params: ArrayBuffer): Resolution => {
    const isLine = params.byteLength === LINE_PARAMS_BYTES;
    if (isLine || params.byteLength === TOKEN_PARAMS_BYTES) {
      const glyph = Math.round(new Float32Array(params)[GLYPH_SLOT] ?? NaN);
      // Written positively so NaN also lands on "never".
      if (!(glyph >= GLYPH_RANGE.first && glyph <= GLYPH_RANGE.last)) return { drawn: "never" };
      if (isLine) return resolveProgram(LINE_PROGRAM);
      // Without parallel compile, one any-glyph program avoids a blocking compile per glyph.
      return resolveProgram(
        tokenProgram(resources.parallelCompile === null ? ANY_GLYPH : glyph),
      );
    }
    return { drawn: "never" };
  };

  /** Renders into the bottom-left `side` square of the GL canvas. */
  const render = (params: ArrayBuffer, side: number): DrawState => {
    const resolution = resolve(params);
    if (resolution.program === undefined) return resolution.drawn;
    // Grow only: shrinking would reallocate for every smaller tile.
    if (canvas.width < side) {
      canvas.width = side;
      canvas.height = side;
    }
    gl.viewport(0, 0, side, side);
    gl.scissor(0, 0, side, side);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(resolution.program);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, params);
    gl.drawArrays(gl.TRIANGLES, 0, FULLSCREEN_TRIANGLE_VERTICES);
    return resolution.drawn;
  };

  /** Copies the last render into a fresh `side` × `side` canvas. */
  const snapshot = (side: number): HTMLCanvasElement | undefined => {
    const image = document.createElement("canvas");
    image.width = side;
    image.height = side;
    const context = image.getContext("2d");
    if (context === null) return undefined;
    blit(context, canvas, side);
    return image;
  };

  return {
    draw(context, params, side) {
      const drawn = render(params, side);
      if (drawn === "whole") blit(context, canvas, side);
      return drawn;
    },
    state: (params) => resolve(params).drawn,
    own: (params) => resolve(params).own === true,
    kept: (params, side) => stills.has(stillKey(params, side)),
    still(context, params, side) {
      const key = stillKey(params, side);
      const cached = stills.take(key);
      if (cached !== undefined) {
        blit(context, cached, side);
        return "whole";
      }
      const drawn = render(params, side);
      const image = drawn === "whole" ? snapshot(side) : undefined;
      if (image === undefined) {
        // No 2D context for a snapshot: paint straight from the GL canvas, uncached.
        if (drawn === "whole") blit(context, canvas, side);
      } else {
        stills.put(key, image);
        blit(context, image, side);
      }
      return drawn;
    },
    pngUrl: (params, side) =>
      resolve(params).own === true && render(params, side) === "whole"
        ? snapshot(side)?.toDataURL("image/png")
        : undefined,
  };
}
