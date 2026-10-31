// Boundary: shared-frame `BO`. Design-system icon by name.
import type { CSSProperties, ReactNode } from "react";
import type { IconSize } from "./density";

export interface IconProps {
  name: string;
  size?: IconSize;
  /** Exact px, overriding `size`. */
  customSize?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon(_props: IconProps): ReactNode {
  throw new Error("external: shared-frame BO");
}
