// Boundary: shared-l-p-m-w-1 `Eo`, `_t`, `vo`. Window helpers that respect the element's own window.
export interface WindowTimers {
  setTimeout(callback: () => void, ms: number): number;
  clearTimeout(id: number | undefined): void;
}

/** Timers bound to the window that owns `element` (falls back to globalThis). */
export function timersFor(_element: Element | null): WindowTimers {
  throw new Error("external: shared-l-p-m-w-1 Eo");
}

/** The window that owns `element`, or null when detached. */
export function ownerWindowOf(_element: Element | null): Window | null {
  throw new Error("external: shared-l-p-m-w-1 _t");
}

export function runWhenIdle(
  _callback: () => void,
  _options: { timeout: number; fallbackDelay: number },
): void {
  throw new Error("external: shared-l-p-m-w-1 vo");
}
