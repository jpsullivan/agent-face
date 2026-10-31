// Icon tokens are persisted on projects and tasks, so their string format is a storage contract.
import { describe, expect, it } from "vitest";
import { isAibo1Token, parseAibo1Token, parseAibo3Token, serializeLineLook } from "./aibo-look";

describe("parseAibo1Token", () => {
  it.each([
    ["Aibo1_pebble_rose", { face: "pebble", tint: "rose", hat: null }],
    ["Aibo1_block_jade_crown", { face: "block", tint: "jade", hat: "crown" }],
    // Unknown parts fall back instead of rejecting the whole token.
    ["Aibo1_wobble_neon_fedora", { face: "tofu", tint: "clay", hat: null }],
    [
      "Aibo1_tofu_clay_halo_drop-sky-wizard",
      { face: "tofu", tint: "clay", hat: "halo", line: { shape: "drop", tint: "sky", accessory: "wizard" } },
    ],
    // A malformed line suffix is dropped, the rest still parses.
    ["Aibo1_tofu_clay_halo_drop-neon", { face: "tofu", tint: "clay", hat: "halo" }],
  ])("%s", (token, expected) => {
    expect(parseAibo1Token(token)).toEqual(expected);
  });

  it.each(["Aibo2_tofu_clay", "Aibo1_tofu", "Aibo1"])("rejects %s", (token) => {
    expect(parseAibo1Token(token)).toBeUndefined();
  });

  it("recognizes the bare prefix as an Aibo1 token even though it does not parse", () => {
    expect(isAibo1Token("Aibo1")).toBe(true);
    expect(isAibo1Token("Aibo10_tofu")).toBe(false);
  });
});

describe("parseAibo3Token", () => {
  it.each([
    ["Aibo3_bean_matcha", { shape: "bean", tint: "matcha", accessory: null }],
    ["Aibo3_leaf_fig_crown", { shape: "leaf", tint: "fig", accessory: "crown" }],
    // Unknown but well-formed accessories are ignored, not rejected.
    ["Aibo3_leaf_fig_monocle", { shape: "leaf", tint: "fig", accessory: null }],
  ])("%s", (token, expected) => {
    expect(parseAibo3Token(token)).toEqual(expected);
  });

  it.each(["Aibo3_bean", "Aibo3_bean_clay_crown_extra", "Aibo3_cube_clay", "Aibo3_bean_clay_cr-own", undefined])(
    "rejects %s",
    (token) => {
      expect(parseAibo3Token(token)).toBeUndefined();
    },
  );
});

describe("serializeLineLook", () => {
  it("writes the dash-joined form that parseAibo1Token reads back", () => {
    const line = { shape: "acorn", tint: "cloud", accessory: "bow" } as const;
    expect(serializeLineLook(line)).toBe("acorn-cloud-bow");
    expect(parseAibo1Token(`Aibo1_tofu_clay_bow_${serializeLineLook(line)}`)?.line).toEqual(line);
    expect(serializeLineLook({ ...line, accessory: null })).toBe("acorn-cloud");
  });
});
