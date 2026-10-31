// Boundary: preload-helper `ph`. Tags an error with the text o11y may report verbatim.
export type ErrorTextKind = "literal" | "vouched";

export function tagErrorText<E extends Error>(error: E, text: string, kind: ErrorTextKind): E {
  try {
    Object.defineProperty(error, Symbol.for("ant.o11y.errorText"), {
      value: { text, kind },
      enumerable: false,
      writable: false,
      configurable: true,
    });
  } catch {
    // Frozen errors simply go untagged.
  }
  return error;
}
