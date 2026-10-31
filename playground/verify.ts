// Draws the same clay tiles with the original minified WebGL renderer and the
// converted one, and compares every pixel.
import { createRenderer as createConverted } from "@/draw/face-renderer";
import { clayCanvasSide, packClayParams } from "@/tiles/clay-tile/clay-params";
import { builtInLineSet } from "@/tiles/clay-tile/line-set";
import { TASK_GLYPHS, type TileGlyph } from "@/tokens/task-look";
// @ts-expect-error untyped original chunk
import { createRenderer as createOriginal } from "../original/55bf623ec46d1c4d1f879a0009f135e4e1bc5e296285a272-CrKlyJpQ.js";

type Still = { still(ctx: CanvasRenderingContext2D, params: ArrayBuffer, side: number): string };

async function drawWhole(renderer: Still, params: ArrayBuffer, side: number): Promise<ImageData | string> {
  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  for (let attempt = 0; attempt < 200; attempt++) {
    const result = renderer.still(ctx, params, side);
    if (result === "whole") return ctx.getImageData(0, 0, side, side);
    if (result === "never") return "never";
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return "timeout";
}

async function main() {
  const out = document.getElementById("out")!;
  const original = createOriginal() as Still | null;
  const converted = createConverted();
  if (original === null || converted === null) {
    out.textContent = "WebGL2 unavailable";
    return;
  }
  const lineSet = builtInLineSet()!;
  const glyphs: TileGlyph[] = [...TASK_GLYPHS, "clawd", "code"];
  let cases = 0;
  let pixels = 0;
  const mismatches: string[] = [];
  for (const glyph of glyphs)
    for (const [tint, fill, neutral] of [["clay", "tinted", false], ["cornflower", "tinted", false], ["rose", "grey", false], ["jade", "tinted", true]] as const)
      for (const state of ["resting", "dry"])
        for (const dark of [false, true])
          for (const seatPoints of [28, 48]) {
            const ratio = 2;
            const side = Math.round(clayCanvasSide(seatPoints) * ratio);
            const params = packClayParams(
              { glyph, state, seed: 3.4, tint, fill, neutral, dark },
              lineSet,
              { seatPoints, seat: seatPoints * ratio, side },
            );
            const [a, b] = await Promise.all([drawWhole(original, params, side), drawWhole(converted, params, side)]);
            cases++;
            const label = `${glyph}/${tint}/${fill}${neutral ? "/neutral" : ""}/${state}/${dark ? "dark" : "light"}/${seatPoints}`;
            if (typeof a === "string" || typeof b === "string") {
              if (a !== b) mismatches.push(`${label}: original=${typeof a === "string" ? a : "whole"} converted=${typeof b === "string" ? b : "whole"}`);
              continue;
            }
            pixels += a.data.length / 4;
            let differing = 0;
            for (let i = 0; i < a.data.length; i++) if (a.data[i] !== b.data[i]) differing++;
            if (differing > 0) mismatches.push(`${label}: ${differing} differing channel values`);
          }
  out.textContent = JSON.stringify({ cases, pixelsCompared: pixels, mismatches: mismatches.slice(0, 20), mismatchCount: mismatches.length }, null, 2);
  document.title = mismatches.length === 0 ? "PASS" : "FAIL";
}

main().catch((error) => {
  document.getElementById("out")!.textContent = String(error?.stack ?? error);
});
