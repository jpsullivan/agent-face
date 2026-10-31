import { createContext } from "react";
import type { IconSize } from "@/external/density";

export type TileStyle = "grey" | "tinted";

/** "tinted" paints tiles in their hex palette; "grey" uses theme utility classes. */
export const TileStyleContext = createContext<TileStyle>("grey");

/** When set, tiles render as a bare design-system icon of this size instead of a filled tile. */
export const TileIconSizeContext = createContext<IconSize | undefined>(undefined);
