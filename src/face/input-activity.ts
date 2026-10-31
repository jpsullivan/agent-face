// Tracks the last user input on a window. Faces use it to look toward the
// user; one set of capture listeners is shared by every subscriber.
const INPUT_EVENTS = ["pointerdown", "keydown", "wheel", "input"] as const;
const LISTENER_OPTIONS: AddEventListenerOptions = { capture: true, passive: true };

interface ActivityState {
  lastMs: number;
  wakes: Set<() => void>;
  happened: () => void;
}

const activityByTarget = new WeakMap<EventTarget, ActivityState>();

function stateFor(target: EventTarget): ActivityState {
  const existing = activityByTarget.get(target);
  if (existing !== undefined) return existing;
  const state: ActivityState = {
    lastMs: 0,
    wakes: new Set(),
    happened: () => {
      state.lastMs = performance.now();
      for (const wake of state.wakes) wake();
    },
  };
  activityByTarget.set(target, state);
  return state;
}

export interface InputActivity {
  /** performance.now() of the last input, 0 if none yet. */
  lastMs(): number;
  /** Calls `wake` on each input; returns an unsubscribe. */
  add(wake: () => void): () => void;
}

export function inputActivity(target: EventTarget): InputActivity {
  const state = stateFor(target);
  return {
    lastMs: () => state.lastMs,
    add(wake) {
      if (state.wakes.size === 0) {
        for (const type of INPUT_EVENTS) target.addEventListener(type, state.happened, LISTENER_OPTIONS);
      }
      state.wakes.add(wake);
      return () => {
        if (!state.wakes.delete(wake) || state.wakes.size > 0) return;
        for (const type of INPUT_EVENTS) target.removeEventListener(type, state.happened, LISTENER_OPTIONS);
      };
    },
  };
}
