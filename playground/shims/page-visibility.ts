export function subscribeToVisibilityChange(listener: () => void): () => void {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

export function isPageVisible(): boolean {
  return document.visibilityState === "visible";
}
