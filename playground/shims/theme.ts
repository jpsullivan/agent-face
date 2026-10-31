import { useSyncExternalStore } from "react";

type Scheme = "light" | "dark";
const listeners = new Set<() => void>();
let scheme: Scheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function apply() {
  document.documentElement.classList.toggle("dark", scheme === "dark");
}
apply();

export function setColorScheme(next: Scheme) {
  scheme = next;
  apply();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useColorScheme(): Scheme {
  return useSyncExternalStore(subscribe, () => scheme);
}
