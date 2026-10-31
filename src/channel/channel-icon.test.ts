import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { TASK_GLYPHS } from "@/tokens/task-look";
import { CHANNEL_TINTS, channelIconFor, glyphForName } from "./channel-icon";

describe("glyphForName", () => {
  it.each([
    ["Weekly budget", "dollarSign"],
    ["Unpaid invoices", "dollarSign"],
    ["Inboxes", "email"],
    ["Q3 metrics dashboard", "chart"],
    ["Draft posts", "edit"],
    ["Random", undefined],
    // Whole words only: "documentary" isn't "document".
    ["Documentary night", undefined],
  ])("%s → %s", (name, glyph) => {
    expect(glyphForName(name)).toBe(glyph);
  });
});

describe("channelIconFor", () => {
  // Independent sha256 (node:crypto) so the expectation doesn't come from the code under test.
  const hashBytes = (id: string) => createHash("sha256").update(id, "utf8").digest();

  it("derives tint and fallback glyph from the first two bytes of sha256(id)", () => {
    for (const id of ["channel-1", "c_42", "ünïcode-ïd"]) {
      const [tintByte, glyphByte] = hashBytes(id);
      expect(channelIconFor({ id, name: "Random" })).toEqual({
        glyph: TASK_GLYPHS[glyphByte! % TASK_GLYPHS.length],
        tint: CHANNEL_TINTS[tintByte! % CHANNEL_TINTS.length],
      });
    }
  });

  it("prefers a name keyword and a valid color", () => {
    expect(channelIconFor({ id: "x", name: "Trip ideas", color: "plum" })).toEqual({ glyph: "globe", tint: "plum" });
    expect(channelIconFor({ id: "x", name: "Trip ideas", color: "neon" }).tint).toBe("clay");
  });

  it("keeps the derived glyph for an Aibo3 line token but takes its tint", () => {
    expect(channelIconFor({ id: "x", name: "Grocery list", icon: "Aibo3_bean_matcha" })).toEqual({
      glyph: "box",
      tint: "cactus",
    });
  });

  it("keeps channel-only glyphs from a saved token", () => {
    expect(channelIconFor({ id: "x", name: "n", icon: "proj_music", color: "rose" })).toEqual({
      glyph: "music",
      tint: "rose",
    });
  });

  it("shows mascot tokens as a folder", () => {
    expect(channelIconFor({ id: "x", name: "n", icon: "Aibo1_tofu_plum_crown" })).toEqual({
      glyph: "folder",
      tint: "plum",
    });
  });

  it("falls back to a clay checklist for a malformed Aibo3 token", () => {
    expect(channelIconFor({ id: "x", name: "Budget", icon: "Aibo3_cube_clay" })).toEqual({
      glyph: "checklist",
      tint: "clay",
    });
  });
});
