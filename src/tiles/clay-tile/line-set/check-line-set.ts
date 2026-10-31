// Checks run on a freshly read line set: required members, tuple counts, and value ranges.
import {
  DEFAULT_LINE_LOOK,
  LINE_ACCESSORIES,
  LINE_SHAPES,
  LINE_STATES,
  LINE_TINTS,
} from "@/look/aibo-look";
import { isHexColour as isLineColour } from "@/draw/path-data";
import { countOf, ownValue, refuse } from "./read-helpers";
import { sizeTableBounds, type SizeTable } from "./size-table";
import type { FaceDrawing, KeyedPath, LineSet, LineWave } from "./types";

/** Upper bound on eye half-sizes and rises, in master units. */
const EYE_EXTENT_LIMIT = 160;
const KEYED_PATH_KEYS = { least: 2, most: 256 } as const;
const KEYED_PATH_PERIOD_LIMIT_SECONDS = 3600;
const KEYED_PATH_VALUE_LIMIT = 360;
const MARKS_SHIFT_LIMIT = 1e3;
const MARKS_TURN_LIMIT_DEGREES = 3600;

function faceEntries(lineSet: LineSet): [string, FaceDrawing][] {
  return Object.entries(lineSet.faces.items).filter(
    (entry): entry is [string, FaceDrawing] => entry[1] !== undefined,
  );
}

/** Every shape, state, tint and accessory the look can ask for must be in the set. */
export function checkMembers({ bodies, faces, colours, accessories }: LineSet): void {
  for (const shape of LINE_SHAPES) {
    if (ownValue(bodies.items, shape) === undefined) refuse("missing", `body ${shape}`);
  }
  for (const state of LINE_STATES) {
    if (ownValue(faces.items, state) === undefined) refuse("missing", `face ${state}`);
  }
  for (const tint of LINE_TINTS) {
    if (!colours.offered.some((offered) => offered.key === tint)) {
      refuse("missing", `colour ${tint}`);
    }
  }
  for (const accessory of LINE_ACCESSORIES) {
    if (ownValue(accessories.items, accessory) === undefined) {
      refuse("missing", `accessory ${accessory}`);
    }
  }
  if (
    ownValue(bodies.items, DEFAULT_LINE_LOOK.shape) === undefined ||
    ownValue(faces.items, "idle") === undefined
  ) {
    refuse("missing", "the standard body or the idle face");
  }
}

function hasWavePairs(wave: LineWave): boolean {
  return (
    countOf(wave.wavesEvery) === 2 &&
    countOf(wave.wavesAtLeast) === 2 &&
    countOf(wave.weights) === 2 &&
    wave.wavesEvery.every((every) => every > 0)
  );
}

/** Lists the reader typed as tuples must really have those lengths. */
export function checkCounts(lineSet: LineSet): void {
  for (const [state, face] of faceEntries(lineSet)) {
    if (countOf(face.eyes) !== 2) refuse("wrongCount", `eyes of ${state}`);
    if (
      face.brows !== null &&
      !(countOf(face.brows) === 2 && face.brows.every((brow) => countOf(brow.points) === 3))
    ) {
      refuse("wrongCount", `brows of ${state}`);
    }
    const motion = face.marksMotion;
    if (motion !== null && motion.mode === "frames") {
      const byDrawing = [motion.shiftXByDrawing, motion.shiftYByDrawing, motion.turnDegreesByDrawing];
      if (
        !byDrawing
          .filter((list) => list !== null)
          .every((list) => list.length === motion.drawingsPerRound)
      ) {
        refuse("wrongCount", `marksMotion's shifts or turns by drawing of ${state}`);
      }
      if (motion.shownIn !== null && motion.shownIn.length !== face.marks.length) {
        refuse("wrongCount", `marksMotion.shownIn of ${state}`);
      }
    }
  }

  if (countOf(lineSet.accessories.spotSlipShare) !== 2) {
    refuse("wrongCount", "accessories.spotSlipShare");
  }
  if (countOf(lineSet.frame.settleRange) !== 2) refuse("wrongCount", "frame.settleRange");

  const line = lineSet.line;
  if (
    !(
      countOf(line.phases) === 4 &&
      line.phases.every((phase) => countOf(phase) === 4) &&
      countOf(line.spotNudgeByPhase) === 4 &&
      line.spotNudgeByPhase.every((nudge) => countOf(nudge) === 2)
    )
  ) {
    refuse("wrongCount", "line.phases or line.spotNudgeByPhase");
  }
  if (
    !(
      hasWavePairs(line.wander) &&
      hasWavePairs(line.width) &&
      countOf(line.seeds.phaseMix) === 4 &&
      countOf(line.seeds.wanderMix) === 2 &&
      countOf(line.seeds.widthMix) === 2
    )
  ) {
    refuse("wrongCount", "line.wander, line.width or a mix of line.seeds");
  }
}

function ensure(holds: boolean, what: string): void {
  if (!holds) refuse("outOfRange", what);
}

/** A keyed path: 2–256 keys of `valuesPerKey` values each, times rising from 0 to 1. */
function checkKeyedPath(path: KeyedPath | null, valuesPerKey: number, where: string): void {
  if (path === null) return;
  if (
    !(
      path.keys.length >= KEYED_PATH_KEYS.least &&
      path.keys.length <= KEYED_PATH_KEYS.most &&
      path.keys.every((key) => key.length === valuesPerKey + 1)
    )
  ) {
    refuse("wrongCount", `keys of ${where}`);
  }
  const times = path.keys.map((key) => key[0]!);
  const rises = times.slice(1).every((time, index) => times[index]! < time);
  if (
    !(
      path.periodSeconds > 0 &&
      path.periodSeconds <= KEYED_PATH_PERIOD_LIMIT_SECONDS &&
      times[0] === 0 &&
      times[times.length - 1] === 1 &&
      rises &&
      path.keys.every((key) =>
        key.every((value) => Number.isFinite(value) && Math.abs(value) <= KEYED_PATH_VALUE_LIMIT),
      )
    )
  ) {
    refuse("outOfRange", where);
  }
}

function checkFaceRanges(state: string, face: FaceDrawing, lineSet: LineSet): void {
  const isEyeExtent = (value: number | null) =>
    value !== null && value > 0 && value <= EYE_EXTENT_LIMIT;

  for (const eye of face.eyes) {
    switch (eye.kind) {
      case "oval":
      case "lid":
      case "cross":
        ensure(
          isEyeExtent(eye.halfWidth) && isEyeExtent(eye.halfHeight),
          `halfWidth or halfHeight of an eye of ${state}`,
        );
        break;
      case "arc":
      case "shut":
        ensure(
          isEyeExtent(eye.halfWidth) && eye.rise !== null && Math.abs(eye.rise) <= EYE_EXTENT_LIMIT,
          `halfWidth or rise of an eye of ${state}`,
        );
        break;
      case "dash":
        ensure(isEyeExtent(eye.halfWidth), `halfWidth of an eye of ${state}`);
    }
  }

  ensure(
    face.glanceShare === null || (face.glanceShare >= 0 && face.glanceShare <= 1),
    `glanceShare of ${state}`,
  );
  checkKeyedPath(face.eyesPath, 2, `eyesPath of ${state}`);
  checkKeyedPath(face.bodyRound, 3, `bodyRound of ${state}`);

  const motion = face.marksMotion;
  if (motion !== null && motion.mode === "frames") {
    ensure(
      motion.drawingsPerSecond !== null &&
        motion.drawingsPerSecond > 0 &&
        motion.drawingsPerSecond <= 120,
      `marksMotion.drawingsPerSecond of ${state}`,
    );
    ensure(
      motion.drawingsPerRound !== null &&
        motion.drawingsPerRound >= 1 &&
        motion.drawingsPerRound <= 600,
      `marksMotion.drawingsPerRound of ${state}`,
    );
    ensure(
      [...(motion.shiftXByDrawing ?? []), ...(motion.shiftYByDrawing ?? [])].every(
        (shift) => Math.abs(shift) <= MARKS_SHIFT_LIMIT,
      ),
      `marksMotion's shifts by drawing of ${state}`,
    );
    ensure(
      (motion.turnDegreesByDrawing ?? []).every(
        (turn) => Math.abs(turn) <= MARKS_TURN_LIMIT_DEGREES,
      ),
      `marksMotion.turnDegreesByDrawing of ${state}`,
    );
    ensure(
      motion.turnsAbout === null ||
        (Math.abs(motion.turnsAbout.x) <= MARKS_SHIFT_LIMIT &&
          Math.abs(motion.turnsAbout.y) <= MARKS_SHIFT_LIMIT),
      `marksMotion.turnsAbout of ${state}`,
    );
    const drawings = motion.drawingsPerRound ?? 0;
    ensure(
      (motion.shownIn ?? [])
        .flatMap((shown) => shown ?? [])
        .every((drawing) => drawing >= 0 && drawing < drawings),
      `marksMotion.shownIn of ${state}`,
    );
  }

  const filled = face.marksFilled;
  if (filled !== null) {
    if (filled.kind === "places") {
      ensure(
        filled.places.every((place) => place >= 0 && place < face.marks.length),
        `marksFilled of ${state}`,
      );
    }
    ensure(lineSet.colours.marksFill !== null, `colours.marksFill, which ${state} is filled with`);
  }
  if (motion !== null) {
    ensure(
      motion.group === null || (motion.group >= 1 && motion.group <= 64),
      `marksMotion.group of ${state}`,
    );
    ensure(
      motion.period === null || (motion.period > 0 && motion.period <= 3600),
      `marksMotion.period of ${state}`,
    );
  }
}

export function checkRanges(lineSet: LineSet): void {
  for (const [state, face] of faceEntries(lineSet)) checkFaceRanges(state, face, lineSet);

  const small = lineSet.smallSizes;
  const weights: [SizeTable, string][] = [
    [small.lineWeight, "lineWeight"],
    [small.eyeLineWeight, "eyeLineWeight"],
  ];
  for (const [table, name] of weights) {
    const bounds = sizeTableBounds(table);
    ensure(bounds.lower > 0 && bounds.upper <= 100, `smallSizes.${name}`);
  }
  const slips: [SizeTable, string][] = [
    [small.spotSlipX, "spotSlipX"],
    [small.spotSlipY, "spotSlipY"],
  ];
  for (const [table, name] of slips) {
    const bounds = sizeTableBounds(table);
    ensure(bounds.lower >= -100 && bounds.upper <= 100, `smallSizes.${name}`);
  }
  const eyeScale = sizeTableBounds(small.eyeScale);
  ensure(eyeScale.lower >= 0.1 && eyeScale.upper <= 10, "smallSizes.eyeScale");

  const line = lineSet.line;
  ensure(line.samplePathEvery >= 0.5 && line.samplePathEvery <= 50, "line.samplePathEvery");
  ensure(line.samplesAtMost >= 2 && line.samplesAtMost <= 2e3, "line.samplesAtMost");
  ensure(
    line.closedSamplesAtLeast >= 3 && line.closedSamplesAtLeast <= line.samplesAtMost,
    "line.closedSamplesAtLeast",
  );
  ensure(
    line.defaults.handWobble >= 0 && line.defaults.handWobble <= 100,
    "line.defaults.handWobble",
  );
  ensure(
    line.defaults.shapeDrift >= 0 && line.defaults.shapeDrift <= 100,
    "line.defaults.shapeDrift",
  );
  ensure(
    line.defaults.widthWanderPercent >= 0 && line.defaults.widthWanderPercent <= 100,
    "line.defaults.widthWanderPercent",
  );
  ensure(
    line.defaults.redrawsPerSecond >= 0 && line.defaults.redrawsPerSecond <= 120,
    "line.defaults.redrawsPerSecond",
  );

  const { colours } = lineSet;
  const unusable = [
    colours.ink,
    colours.paper,
    ...colours.offered.map((offered) => offered.hex),
    ...Object.values(colours.accessorySpots),
    ...(colours.marksFill === null ? [] : [colours.marksFill]),
  ].find((colour) => !isLineColour(colour));
  if (unusable !== undefined) refuse("outOfRange", `the colour ${unusable}`);
}
