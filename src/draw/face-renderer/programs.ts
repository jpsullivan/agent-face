// Fragment program specs and a cache that compiles them lazily, without
// blocking: with KHR_parallel_shader_compile it polls completion and caps how
// many compiles are in flight; without it, it starts at most one per task.
import { lineFragmentSource } from "./shaders/line-fragment";
import { TOKEN_BLOCK_NAME, tokenFragmentSource } from "./shaders/token-fragment";

export interface ProgramSpec {
  /** Cache key. */
  key: string;
  source: () => string;
  /** Uniform block bound to binding point 0. */
  block: string;
}

export interface GlResources {
  parallelCompile: KHR_parallel_shader_compile | null;
  vertexShader: WebGLShader | null;
}

/** Uniform buffer binding point every program's block is attached to. */
export const UNIFORM_BINDING = 0;

/** With parallel compile, stop starting new compiles while this many are still running. */
const MAX_PENDING_COMPILES = 3;

export function tokenProgram(glyph: number): ProgramSpec {
  return { key: `t:${glyph}`, source: () => tokenFragmentSource(glyph), block: TOKEN_BLOCK_NAME };
}

export const LINE_PROGRAM: ProgramSpec = {
  key: "t:line",
  source: lineFragmentSource,
  block: TOKEN_BLOCK_NAME,
};

interface ProgramEntry {
  program: WebGLProgram;
  pending: boolean;
  failed: boolean;
}

export interface ProgramCache {
  /** The linked program, "failed" if it never will link, or undefined while it compiles. */
  get(spec: ProgramSpec): WebGLProgram | "failed" | undefined;
  /** Forgets every program (after the context is restored they are all invalid). */
  reset(): void;
}

export function createProgramCache(
  gl: WebGL2RenderingContext,
  resources: () => GlResources,
): ProgramCache {
  let programs = new Map<string, ProgramEntry>();
  let yielding = false;

  const isStillCompiling = (
    ext: KHR_parallel_shader_compile,
    program: WebGLProgram,
  ): boolean => gl.getProgramParameter(program, ext.COMPLETION_STATUS_KHR) !== true;

  const startCompile = (spec: ProgramSpec): ProgramEntry | undefined => {
    const { parallelCompile, vertexShader } = resources();
    if (parallelCompile === null) {
      // Compiling blocks the thread, so allow one per task.
      if (yielding) return;
      yielding = true;
      setTimeout(() => {
        yielding = false;
      }, 0);
    } else {
      let inFlight = 0;
      for (const entry of programs.values()) {
        if (entry.pending && isStillCompiling(parallelCompile, entry.program)) inFlight++;
      }
      if (inFlight >= MAX_PENDING_COMPILES) return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (vertexShader === null || fragmentShader === null || program === null) {
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      return;
    }
    gl.shaderSource(fragmentShader, spec.source());
    gl.compileShader(fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // Flagged for deletion; it lives on while attached to the program.
    gl.deleteShader(fragmentShader);
    const entry: ProgramEntry = { program, pending: true, failed: false };
    programs.set(spec.key, entry);
    return entry;
  };

  return {
    get(spec) {
      const entry = programs.get(spec.key) ?? startCompile(spec);
      if (entry === undefined) return undefined;
      if (entry.failed) return "failed";
      if (entry.pending) {
        const { parallelCompile } = resources();
        if (parallelCompile !== null && isStillCompiling(parallelCompile, entry.program)) {
          return undefined;
        }
        const linked: unknown = gl.getProgramParameter(entry.program, gl.LINK_STATUS);
        // A lost context reports every link as failed; wait for restore instead.
        if (linked !== true && gl.isContextLost()) return undefined;
        entry.failed = linked !== true;
        entry.pending = false;
        if (entry.failed) return "failed";
        gl.uniformBlockBinding(
          entry.program,
          gl.getUniformBlockIndex(entry.program, spec.block),
          UNIFORM_BINDING,
        );
      }
      return entry.program;
    },
    reset() {
      programs = new Map();
    },
  };
}
