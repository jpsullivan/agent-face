import type { WindowTimers } from "../../src/external/dom-window";
export type { WindowTimers };

export function timersFor(element: Element | null): WindowTimers {
  const win = element?.ownerDocument.defaultView ?? window;
  return {
    setTimeout: (callback, ms) => win.setTimeout(callback, ms),
    clearTimeout: (id) => win.clearTimeout(id),
  };
}

export function ownerWindowOf(element: Element | null): Window | null {
  return element?.ownerDocument.defaultView ?? null;
}

export function runWhenIdle(callback: () => void, options: { timeout: number; fallbackDelay: number }) {
  if (typeof requestIdleCallback === "function") requestIdleCallback(callback, { timeout: options.timeout });
  else setTimeout(callback, options.fallbackDelay);
}
