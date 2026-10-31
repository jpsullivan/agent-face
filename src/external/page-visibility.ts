// Boundary: shared-l-p-m-w-2 `DW`, `fO`.
export function subscribeToVisibilityChange(_listener: () => void): () => void {
  throw new Error("external: shared-l-p-m-w-2 DW");
}

export function isPageVisible(): boolean {
  throw new Error("external: shared-l-p-m-w-2 fO");
}
