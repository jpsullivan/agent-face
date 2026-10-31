// Creates the renderer's private WebGL2 canvas and puts the context into the
// one fixed state every draw relies on (shared vertex shader, uniform buffer,
// premultiplied blending, scissoring). Re-run after a context restore.
import type { GlResources } from "./programs";
import { UNIFORM_BINDING } from "./programs";
import { FULLSCREEN_TRIANGLE_VERTEX } from "./shaders/fullscreen-vertex";

const INITIAL_CANVAS_SIDE = 256;

/** Room for the 240-byte line block, rounded up. */
const UNIFORM_BUFFER_BYTES = 272;

const CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  powerPreference: "low-power",
  failIfMajorPerformanceCaveat: true,
};

export interface GlCanvas {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
}

/** Null when WebGL2 is unsupported or only available through a slow fallback. */
export function createGlCanvas(): GlCanvas | null {
  if (typeof WebGL2RenderingContext === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = INITIAL_CANVAS_SIDE;
  canvas.height = INITIAL_CANVAS_SIDE;
  const gl = canvas.getContext("webgl2", CONTEXT_ATTRIBUTES);
  if (gl === null) return null;
  return { canvas, gl };
}

export function setUpContext(gl: WebGL2RenderingContext): GlResources {
  const parallelCompile = gl.getExtension("KHR_parallel_shader_compile");
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (vertexShader !== null) {
    gl.shaderSource(vertexShader, FULLSCREEN_TRIANGLE_VERTEX);
    gl.compileShader(vertexShader);
  }
  const uniforms = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, uniforms);
  gl.bufferData(gl.UNIFORM_BUFFER, UNIFORM_BUFFER_BYTES, gl.DYNAMIC_DRAW);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, UNIFORM_BINDING, uniforms);
  // WebGL2 needs a bound VAO to draw; the vertex shader reads no attributes.
  gl.bindVertexArray(gl.createVertexArray());
  gl.enable(gl.BLEND);
  gl.enable(gl.SCISSOR_TEST);
  // The fragment shaders output premultiplied colour.
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  return { parallelCompile, vertexShader };
}
