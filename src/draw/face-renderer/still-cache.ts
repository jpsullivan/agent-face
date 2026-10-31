// LRU cache of finished stills, keyed by the exact parameter bytes and size,
// bounded by total pixel count.

/** Pixel budget across all cached stills (about 32 MB of RGBA). */
const STILL_CACHE_BUDGET_PIXELS = 8e6;

interface CachedStill {
  image: HTMLCanvasElement;
  /** Pixel count. */
  cost: number;
}

export function stillKey(params: ArrayBuffer, side: number): string {
  // One char per byte: the key is the parameter block itself.
  return `${side}:${String.fromCharCode(...new Uint8Array(params))}`;
}

export interface StillCache {
  has(key: string): boolean;
  /** The cached image, marked most recently used. */
  take(key: string): HTMLCanvasElement | undefined;
  /** Adds an image, then evicts least recently used entries until within budget. */
  put(key: string, image: HTMLCanvasElement): void;
}

export function createStillCache(): StillCache {
  // Map iteration order is insertion order, so re-inserting marks an entry fresh.
  const stills = new Map<string, CachedStill>();
  let totalCost = 0;

  return {
    has: (key) => stills.has(key),
    take(key) {
      const still = stills.get(key);
      if (still === undefined) return undefined;
      stills.delete(key);
      stills.set(key, still);
      return still.image;
    },
    put(key, image) {
      const cost = image.width * image.height;
      stills.set(key, { image, cost });
      totalCost += cost;
      for (const [oldKey, old] of stills) {
        if (totalCost <= STILL_CACHE_BUDGET_PIXELS) break;
        stills.delete(oldKey);
        totalCost -= old.cost;
      }
    },
  };
}
