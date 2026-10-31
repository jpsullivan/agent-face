// Boundary: preload-helper `Qr` / `ph`. Vite's __vitePreload: loads CSS deps, then the module.
export function preloadModule<T>(
  load: () => Promise<T>,
  _deps?: string[],
  _base?: string,
): Promise<T> {
  return load();
}
