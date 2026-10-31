import { describe, expect, it } from "vitest";
import { parseTaskLook } from "./task-look";

describe("parseTaskLook", () => {
  it("reads a glyph token, keeping its prefix", () => {
    expect(parseTaskLook("proj_calendar", undefined, "user")).toEqual({
      wear: { kind: "glyph", glyph: "calendar", prefix: "proj" },
      tint: "clay",
      setBy: "user",
      token: "proj_calendar",
    });
  });

  it("falls back to a checklist for an unknown glyph", () => {
    expect(parseTaskLook("proj_spaceship", "mineral", undefined)).toEqual({
      wear: { kind: "glyph", glyph: "checklist" },
      tint: "mineral",
      setBy: "agent",
      token: "proj_spaceship",
    });
  });

  it("reads a mascot token, with a valid color overriding its tint", () => {
    expect(parseTaskLook("Aibo1_pebble_rose_crown", "jade", "agent")?.wear).toEqual({
      kind: "mascot",
      look: { face: "pebble", tint: "jade", hat: "crown" },
    });
    expect(parseTaskLook("Aibo1_pebble_rose_crown", "neon", "agent")?.tint).toBe("rose");
  });

  it.each(["", "calendar", "_calendar", "Aibo1_x"])("rejects %j", (token) => {
    expect(parseTaskLook(token, undefined, undefined)).toBeUndefined();
  });
});
