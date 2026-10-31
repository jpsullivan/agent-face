import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function setReducedMotion(next: boolean) {
  reduced = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => reduced);
}
