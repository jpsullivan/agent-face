// The six symbols the kit imported from the main app chunk (eb869a9c…-DP0kYrJ7.js),
// inlined: mark names, which mark each face state and held prop shows, the
// stir delay for a standing mascot, and the "nothing is holding it still" check.
import type { FaceState, PropName } from "@/face/face-codes";

/** `mRe`: every mark the kit can draw. */
export const MARK_NAMES = [
  "idle",
  "calm",
  "tilde",
  "thinking",
  "think1",
  "orbit",
  "reading",
  "working",
  "connecting",
  "signal",
  "writing",
  "waiting",
  "done",
  "error",
  "saw",
  "spiral",
  "notification",
  "loops",
] as const;
export type MarkName = (typeof MARK_NAMES)[number];

/** `LL`: the mark shown when nothing else applies. */
export const DEFAULT_MARK: MarkName = "tilde";

/** `hRe`: face state → mark; null keeps whatever mark is already showing. */
export const MARK_FOR_FACE_STATE: Readonly<Record<FaceState, MarkName | null>> = {
  idle: DEFAULT_MARK,
  listening: "connecting",
  thinking: "thinking",
  speaking: "signal",
  happy: "done",
  confused: "spiral",
  sleeping: "calm",
  error: "error",
  surprised: null,
};

/** `gRe`: held prop → mark. */
export const MARK_FOR_PROP: Readonly<Record<PropName, MarkName>> = {
  pencil: "writing",
  hammer: "working",
  keyboard: "working",
  book: "reading",
  magnifier: "orbit",
  pot: "working",
  blocks: "working",
};

/** `SRe`: a mascot standing at rest stirs again after a random delay in this range. */
export const STIR_DELAY_RANGE_MS: readonly [number, number] = [2e4, 4e4];

// `CRe` / `wRe` / `TRe`: a counter of open holds. In the app, other code opens
// holds; the kit only asks whether any are open.
let openHolds = 0;

/** `wRe`: opens a hold that keeps live mascots from coming to rest; the returned release is idempotent. */
export function openHold(): () => void {
  openHolds += 1;
  let open = true;
  return () => {
    if (open) {
      open = false;
      openHolds -= 1;
    }
  };
}

/** `TRe`: true when no hold is open. */
export function isNothingHeld(): boolean {
  return openHolds === 0;
}
