// Boundary: shared-frame `XZ`. clsx + tailwind-merge style class joiner.
type ClassValue = string | false | null | undefined | ClassValue[];

export function cn(...values: ClassValue[]): string {
  return values
    .flat(Infinity as 1)
    .filter((value): value is string => typeof value === "string" && value !== "")
    .join(" ");
}
