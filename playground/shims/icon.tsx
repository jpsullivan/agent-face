// Placeholder for the design-system icon: a framed initial, sized like the real one.
import { ICON_SIZES } from "../../src/external/density";
import type { IconProps } from "../../src/external/icon";
export type { IconProps };

export function Icon({ name, size, customSize, className, style }: IconProps) {
  const px = customSize ?? (size === undefined ? 16 : ICON_SIZES[size].px);
  return (
    <span
      title={name}
      className={className}
      style={{
        width: px,
        height: px,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1.5px solid currentColor",
        borderRadius: px * 0.25,
        fontSize: px * 0.55,
        fontWeight: 600,
        lineHeight: 1,
        ...style,
      }}
    >
      {name[0]}
    </span>
  );
}
