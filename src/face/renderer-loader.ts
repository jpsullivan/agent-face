// Lazy loaders for the two canvas renderers. Both wait until the page marks
// itself interactive (or 10s pass) and the main thread is idle, unless a caller
// asks urgently, so face drawing never competes with first paint.
import { runBackgroundTask } from "@/external/background-task";
import { runWhenIdle } from "@/external/dom-window";
import type { FaceRenderer } from "@/draw/face-renderer";
import type { MascotKit } from "@/draw/mascot-kit";
import { preloadModule } from "@/external/preload";

const INTERACTIVE_MARK = "page.messages_interactive";
const INTERACTIVE_WAIT_MS = 10_000;
const IDLE_TIMEOUT_MS = 1_000;
export const IDLE_CALLBACK_FALLBACK_MS = 1_000;
const FACE_RENDERER_TAG = "messages_face_renderer";

function isVitest(): boolean {
  const process = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process;
  return process !== undefined && !!process.env?.VITEST;
}

let interactive: Promise<void> | undefined;
let resolveInteractive: (() => void) | undefined;
let markedInteractive = false;

function waitForInteractive(): Promise<void> {
  if (markedInteractive) return Promise.resolve();

  interactive ??= new Promise<void>((resolve) => {
    const hasMark = (entries: Performance | PerformanceObserverEntryList) =>
      entries.getEntriesByName(INTERACTIVE_MARK, "mark").length > 0;
    let observer: PerformanceObserver | undefined;
    const timeout = setTimeout(() => resolveInteractive?.(), INTERACTIVE_WAIT_MS);

    resolveInteractive = () => {
      resolveInteractive = undefined;
      observer?.disconnect();
      clearTimeout(timeout);
      resolve();
    };

    if (hasMark(performance)) {
      resolveInteractive();
      return;
    }
    try {
      observer = new PerformanceObserver((list) => {
        if (hasMark(list)) resolveInteractive?.();
      });
      observer.observe({ type: "mark" });
    } catch {
      // PerformanceObserver unsupported: the timeout still resolves.
    }
  });
  return interactive;
}

function waitForIdle(): Promise<void> {
  return new Promise((resolve) => {
    runWhenIdle(() => resolve(), { timeout: IDLE_TIMEOUT_MS, fallbackDelay: 0 });
  });
}

export interface LazyRendererModule<T> {
  /** Starts (or joins) the load. `urgent` skips waiting for the page to be interactive. */
  ask(urgent: boolean): Promise<T | null>;
  /** The loaded value, null if loading failed, undefined if not loaded yet. */
  now(): T | null | undefined;
  reset(): void;
}

export function createLazyRendererModule<T>(
  load: () => Promise<T | null>,
  tag: string,
): LazyRendererModule<T> {
  let pending: Promise<T | null> | undefined;
  let result: T | null | undefined;
  let skipInteractiveWait: (() => void) | undefined;

  const start = async (urgent: boolean) => {
    if (!urgent) {
      await Promise.race([
        waitForInteractive(),
        new Promise<void>((resolve) => {
          skipInteractiveWait = resolve;
        }),
      ]);
    }
    await waitForIdle();
    try {
      result = (await runBackgroundTask({ origin: "background", tag }, load)) ?? null;
    } catch {
      result = null;
    }
    return result;
  };

  return {
    ask(urgent) {
      if (isVitest()) {
        result = null;
        return Promise.resolve(null);
      }
      pending ??= start(urgent);
      if (urgent) skipInteractiveWait?.();
      return pending;
    },
    now: () => result,
    reset() {
      pending = undefined;
      result = undefined;
      skipInteractiveWait = undefined;
    },
  };
}

// Original: ./55bf623e…-CrKlyJpQ.js (WebGL face renderer). Resolves null without WebGL2.
const faceRenderer = createLazyRendererModule<FaceRenderer>(
  () =>
    preloadModule(
      () =>
        import("@/draw/face-renderer").then((module) =>
          module.createRenderer(),
        ),
      [],
      import.meta.url,
    ),
  FACE_RENDERER_TAG,
);

// Original: ./8f49cd0b…-D96hR7E2.js (2D mascot kit). The original also preloaded
// four app stylesheets here; the kit itself needs no CSS.
const mascotKit = createLazyRendererModule<MascotKit>(
  () =>
    preloadModule(
      () =>
        import("@/draw/mascot-kit").then((module) =>
          module.createAiboMascotKit(),
        ),
      [],
      import.meta.url,
    ),
  FACE_RENDERER_TAG,
);

export function loadFaceRenderer(): Promise<FaceRenderer | null> {
  return faceRenderer.ask(false);
}

export function faceRendererNow(): FaceRenderer | null | undefined {
  return faceRenderer.now();
}

/** Called once the page is interactive so pending loads stop waiting. */
export function markPageInteractive(): void {
  markedInteractive = true;
  resolveInteractive?.();
}

export function loadMascotKit(urgent = false): Promise<MascotKit | null> {
  return mascotKit.ask(urgent);
}

export function mascotKitNow(): MascotKit | null | undefined {
  return mascotKit.now();
}
