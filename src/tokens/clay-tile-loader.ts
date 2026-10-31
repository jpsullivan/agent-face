// The clay tile (a rendered, animated task tile) is code-split. Surfaces that
// opt in subscribe to its load and re-render with it once it arrives; until
// then, and everywhere else, the flat TaskGlyphTile is shown.
import { createContext, use, useSyncExternalStore, type ComponentType } from "react";
import { preloadModule } from "@/external/preload";
import { createLazyRendererModule, loadFaceRenderer } from "@/face/renderer-loader";
import type { TaskTokenGlyphProps } from "./TaskToken";

export type ClayTileComponent = ComponentType<TaskTokenGlyphProps>;

const clayTile = createLazyRendererModule<ClayTileComponent>(
  () =>
    preloadModule(
      () => import("@/tiles/clay-tile").then((module) => module.AiboTaskTokenClayTile),
      [],
      import.meta.url,
    ),
  "messages_task_tile",
);

/** True inside surfaces that show clay tiles instead of flat glyph tiles. */
export const ClayTileSurfaceContext = createContext(false);

export function useIsClayTileSurface(): boolean {
  return use(ClayTileSurfaceContext);
}

function getClayTile(): ClayTileComponent | null {
  return clayTile.now() ?? null;
}

function subscribeToClayTile(onLoaded: () => void): () => void {
  let unsubscribed = false;
  // The tile draws with the face renderer; start fetching it alongside.
  void loadFaceRenderer();
  void clayTile.ask(false).then(() => {
    if (!unsubscribed) onLoaded();
  });
  return () => {
    unsubscribed = true;
  };
}

function subscribeToNothing(): () => void {
  return () => undefined;
}

/** The loaded clay tile on clay surfaces, otherwise null. */
export function useClayTile(): ClayTileComponent | null {
  const isSurface = useIsClayTileSurface();
  const ClayTile = useSyncExternalStore(
    isSurface ? subscribeToClayTile : subscribeToNothing,
    getClayTile,
  );
  return isSurface ? ClayTile : null;
}
