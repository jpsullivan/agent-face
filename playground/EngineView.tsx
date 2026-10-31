// Playground-only debug view, NOT from the original bundle. It paints the
// shared FaceEngine's raw output as plain shapes, so everything the shipped
// mascot kit ignores (character, tint, squash, tilt, bounce, spin, gaze, blinks,
// hats, sunglasses) is visible: body = rounded block, eyes, numbered hat blocks,
// props as labeled discs.
import { useEffect, useRef } from "react";
import type { FaceFrame } from "@/face/engine";
import { PROP_CODES, SUNGLASSES_CODE, type WearableFrame } from "@/face/face-codes";
import { useSharedFaceEngine } from "@/face/FaceEngineProvider";
import type { AiboCharacter, AiboTint } from "@/look/aibo-look";
import { tileFillHex, tileInkHex } from "@/tiles/tints";
import { useColorScheme } from "./shims/theme";

const PROP_NAMES = new Map<number, string>(Object.entries(PROP_CODES).map(([name, code]) => [code, name]));

interface EngineLook {
  character: AiboCharacter;
  tint: AiboTint;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function bodyPath(ctx: CanvasRenderingContext2D, character: AiboCharacter, w: number, h: number, unit: number) {
  switch (character) {
    case "tofu":
      roundedRect(ctx, -w / 2, -h / 2, w, h, unit * 0.22);
      return;
    case "pebble":
      ctx.beginPath();
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
      return;
    case "block":
      roundedRect(ctx, -w / 2, -h / 2, w, h, unit * 0.05);
      return;
    case "flower": {
      // Five overlapping petals around a centre.
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * w * 0.26;
        const y = Math.sin(angle) * h * 0.26;
        ctx.moveTo(x + w * 0.26, y);
        ctx.ellipse(x, y, w * 0.26, h * 0.26, 0, 0, Math.PI * 2);
      }
      ctx.moveTo(w * 0.3, 0);
      ctx.ellipse(0, 0, w * 0.3, h * 0.3, 0, 0, Math.PI * 2);
      return;
    }
  }
}

function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, frame: FaceFrame, ink: string) {
  const open = frame.eyeOpen * (1 - frame.blink);
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.lineWidth = r * 0.45;
  ctx.lineCap = "round";
  if (frame.happy > 0.5) {
    ctx.beginPath();
    ctx.arc(x, y + r * 0.4, r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else if (open < 0.15) {
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.8 * frame.eyeWide, r * open * frame.eyeWide, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function codeColor(code: number): string {
  return `hsl(${(code * 47) % 360} 55% 45%)`;
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  ctx.fillStyle = "white";
  ctx.font = `600 ${size}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

/** Hats drop from above as progress goes 0 → 1, then fly off along `fling`. */
function drawHat(ctx: CanvasRenderingContext2D, hat: WearableFrame, w: number, h: number, unit: number) {
  if (hat.kind === 0) return;
  const [flingX, flingY, angle] = hat.fling;
  ctx.save();
  ctx.translate(flingX * unit, -h / 2 - (1 - hat.progress) * unit * 0.9 + flingY * unit);
  ctx.rotate(angle);
  ctx.fillStyle = codeColor(hat.kind);
  roundedRect(ctx, -w * 0.42, -unit * 0.03, w * 0.84, unit * 0.06, unit * 0.03);
  ctx.fill();
  roundedRect(ctx, -w * 0.26, -unit * 0.2, w * 0.52, unit * 0.19, unit * 0.04);
  ctx.fill();
  label(ctx, String(hat.kind), 0, -unit * 0.11, unit * 0.09);
  ctx.restore();
}

function drawFaceWearable(ctx: CanvasRenderingContext2D, wearable: WearableFrame, eyeY: number, w: number, unit: number) {
  if (wearable.kind === 0) return;
  const [flingX, flingY, angle, setDown] = wearable.fling;
  ctx.save();
  ctx.globalAlpha = 1 - setDown;
  ctx.translate(flingX * unit, flingY * unit);
  ctx.rotate(angle);
  if (wearable.kind === SUNGLASSES_CODE) {
    ctx.fillStyle = "#1f1f1f";
    roundedRect(ctx, -w * 0.36, eyeY - unit * 0.06, w * 0.72, unit * 0.12, unit * 0.04);
    ctx.fill();
  } else {
    ctx.fillStyle = codeColor(wearable.kind);
    ctx.beginPath();
    ctx.arc(w * 0.5, unit * 0.12, unit * 0.1, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, (PROP_NAMES.get(wearable.kind) ?? "?").slice(0, 3), w * 0.5, unit * 0.12, unit * 0.06);
  }
  ctx.restore();
}

function paintEngineFrame(ctx: CanvasRenderingContext2D, frame: FaceFrame, look: EngineLook, px: number, isDark: boolean) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, px, px);

  const unit = px * 0.5;
  const w = unit * 1.15 * frame.squash[0];
  const h = unit * 0.95 * frame.squash[1];
  const ink = isDark ? "#1a1a1a" : "#2b2b2b";

  ctx.translate(px / 2, px * 0.6 - frame.bounce * unit * 0.25);
  ctx.rotate(frame.tilt * 0.6 + frame.spin);

  ctx.fillStyle = tileFillHex(look.tint);
  bodyPath(ctx, look.character, w, h, unit);
  ctx.fill();
  ctx.strokeStyle = tileInkHex(look.tint, isDark);
  ctx.lineWidth = Math.max(1, unit * 0.03);
  ctx.stroke();

  const eyeY = -h * 0.08 + frame.gaze[1] * unit * 0.12;
  const eyeX = frame.gaze[0] * unit * 0.14;
  const eyeR = unit * 0.075;
  drawEye(ctx, -w * 0.2 + eyeX, eyeY, eyeR, frame, ink);
  drawEye(ctx, w * 0.2 + eyeX, eyeY, eyeR, frame, ink);

  drawFaceWearable(ctx, frame.face, eyeY, w, unit);
  drawHat(ctx, frame.head, w, h, unit);
}

/**
 * Steps the provider's shared engine every animation frame and paints it.
 * Stepping is time-based, so sharing the engine with the real faces is safe.
 */
export function EngineView({ size, character, tint }: { size: number } & EngineLook) {
  const engine = useSharedFaceEngine();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (engine === null || !canvas || !ctx) return;
    const px = Math.round(size * Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = px;
    canvas.height = px;
    let frameId = 0;
    const tick = () => {
      paintEngineFrame(ctx, engine.step(), { character, tint }, px, isDark);
      frameId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frameId);
  }, [engine, size, character, tint, isDark]);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ width: size, height: size }} />;
}
