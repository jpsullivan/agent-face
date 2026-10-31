// Scalar easing, interpolation and noise helpers (from helper chunk 038ed117…).
import type { Point } from "@/draw/path-data";

export const TAU = 2 * Math.PI;

/** Clamps into [0, 1]; NaN becomes 0. */
export function clamp01(value: number): number {
  return Number.isNaN(value) ? 0 : Math.min(Math.max(value, 0), 1);
}

export function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function easeInOutCubic(value: number): number {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function lerpPoint(from: Point, to: Point, t: number): Point {
  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
}

export function fract(value: number): number {
  return value - Math.floor(value);
}

const PULSE_PEAK_AT = 0.05;

/** A sharp attack-and-decay bump, t·e^(1−t) scaled so it peaks at 1 when `t` = 0.05. */
export function pulse(t: number): number {
  return t < 0 ? 0 : (t / PULSE_PEAK_AT) * Math.exp(1 - t / PULSE_PEAK_AT);
}

/** The GLSL fract(sin(dot) · 43758.5453) hash: repeatable pseudo-noise in [0, 1). */
export function hashNoise(x: number, y: number, seeds: readonly [number, number]): number {
  return fract(Math.sin(x * seeds[0] + y * seeds[1]) * 43758.5453);
}

/**
 * Smoothstep blended with an ease-out cubic. Not in the helper chunk: the kit's
 * signal mark and its line crossfade each wrote this inline.
 */
export function easeOutBlend(t: number): number {
  return lerp(smoothstep(t), 1 - (1 - t) ** 3, 0.55);
}
