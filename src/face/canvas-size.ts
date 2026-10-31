const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_CANVAS_PX = 1024;

/** Backing-store size for a square canvas `size` CSS px wide. */
export function canvasPixelSize(size: number, devicePixelRatio: number): number {
  return Math.min(
    MAX_CANVAS_PX,
    Math.max(1, Math.round(size * Math.min(devicePixelRatio, MAX_DEVICE_PIXEL_RATIO))),
  );
}
