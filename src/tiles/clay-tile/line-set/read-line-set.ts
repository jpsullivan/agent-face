// Reads line-set JSON into a typed LineSet, refusing anything malformed, then runs the set's checks.
import { LINE_STATES } from "@/look/aibo-look";
import { parsePathData } from "@/draw/path-data";
import { checkCounts, checkMembers, checkRanges } from "./check-line-set";
import {
  asCounted,
  readBoolean,
  readList,
  readNullable,
  readNumber,
  readNumberField,
  readNumbers,
  readObject,
  readOptional,
  readRecord,
  readRequired,
  readText,
  readWholeNumber,
  readWord,
  unreadable,
  type Reader,
} from "./read-helpers";
import { toSizeTable, type SizeTable } from "./size-table";
import {
  EYE_KINDS,
  MARKS_MOTION_MODES,
  type AccessoryDrawing,
  type Accessories,
  type AccessorySpot,
  type BodyDrawing,
  type BodyPose,
  type Box,
  type BrowDrawing,
  type EarBuild,
  type EyeDrawing,
  type EyeKindDrawing,
  type EyeKinds,
  type FaceDrawing,
  type FrameMotion,
  type Headphones,
  type KeyedPath,
  type LineColours,
  type LineSet,
  type LineSetMaster,
  type LineSettings,
  type LineWave,
  type MarksFilled,
  type MarksMotion,
  type MarksMotionSettings,
  type MarksPlacement,
  type PathShape,
  type Point,
  type SmallSizes,
  type Sunglasses,
} from "./types";

const PATH_DATA_ECHO_LENGTH = 80;

/** Parses JSON text and reads it as a line set. */
export function readLineSetText(text: string): LineSet {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return unreadable("the text is not JSON");
  }
  return readLineSet(value);
}

export function readLineSet(value: unknown): LineSet {
  const where = "the set";
  const object = readObject(value, where);
  const lineSet: LineSet = {
    master: readMaster(readRequired(object, "master", where), "master"),
    bodies: readBodies(readRequired(object, "bodies", where), "bodies"),
    faces: readFaces(readRequired(object, "faces", where), "faces"),
    marksPlacement: readMarksPlacement(
      readRequired(object, "marksPlacement", where),
      "marksPlacement",
    ),
    accessories: readAccessories(readRequired(object, "accessories", where), "accessories"),
    smallSizes: readSmallSizes(readRequired(object, "smallSizes", where), "smallSizes"),
    colours: readColours(readRequired(object, "colours", where), "colours"),
    frame: readFrame(readRequired(object, "frame", where), "frame"),
    eyeKinds: readEyeKinds(readRequired(object, "eyeKinds", where), "eyeKinds"),
    marksMotion: readMarksMotionSettings(
      readRequired(object, "marksMotion", where),
      "marksMotion",
    ),
    line: readLineSettings(readRequired(object, "line", where), "line"),
  };
  checkMembers(lineSet);
  checkCounts(lineSet);
  checkRanges(lineSet);
  return lineSet;
}

function readPoint(value: unknown, where: string): Point {
  return Array.isArray(value)
    ? { x: readNumber(value[0], `${where}[0]`), y: readNumber(value[1], `${where}[1]`) }
    : unreadable(`${where} is not a point`);
}

function readBox(value: unknown, where: string): Box {
  return Array.isArray(value)
    ? {
        x: readNumber(value[0], `${where}[0]`),
        y: readNumber(value[1], `${where}[1]`),
        width: readNumber(value[2], `${where}[2]`),
        height: readNumber(value[3], `${where}[3]`),
      }
    : unreadable(`${where} is not a box`);
}

const readPoints: Reader<Point[]> = (value, where) => readList(value, where, readPoint);

function readPath(value: unknown, where: string): PathShape {
  const data = readText(value, where);
  const parts = parsePathData(data);
  return parts === null
    ? unreadable(
        `${where} is path data the reader cannot read: ${data.slice(0, PATH_DATA_ECHO_LENGTH)}`,
      )
    : { parts };
}

const readPaths: Reader<PathShape[]> = (value, where) => readList(value, where, readPath);

function readSizeTable(value: unknown, where: string): SizeTable {
  return (
    toSizeTable(readList(value, where, readNumbers)) ??
    unreadable(`${where}: a size table needs pairs of numbers whose sizes rise`)
  );
}

function readMaster(value: unknown, where: string): LineSetMaster {
  const object = readObject(value, where);
  return {
    size: readNumber(readRequired(object, "size", where), `${where}.size`),
    middleX: readNumber(readRequired(object, "middleX", where), `${where}.middleX`),
    groundY: readNumber(readRequired(object, "groundY", where), `${where}.groundY`),
    swatchBox: readBox(readRequired(object, "swatchBox", where), `${where}.swatchBox`),
    swatchBoxWithHat: readBox(
      readRequired(object, "swatchBoxWithHat", where),
      `${where}.swatchBoxWithHat`,
    ),
    standsOn: readPoint(readRequired(object, "standsOn", where), `${where}.standsOn`),
  };
}

function readBodies(value: unknown, where: string): LineSet["bodies"] {
  return {
    items: readRecord(readRequired(readObject(value, where), "items", where), `${where}.items`, readBody),
  };
}

function readBody(value: unknown, where: string): BodyDrawing {
  const object = readObject(value, where);
  return {
    outline: readPath(readRequired(object, "outline", where), `${where}.outline`),
    innerLine: readNullable(readOptional(object, "innerLine"), `${where}.innerLine`, readPath),
    eyeLineY: readNumber(readRequired(object, "eyeLineY", where), `${where}.eyeLineY`),
    eyeHalfSpacing: readNumber(
      readRequired(object, "eyeHalfSpacing", where),
      `${where}.eyeHalfSpacing`,
    ),
    headTop: readPoint(readRequired(object, "headTop", where), `${where}.headTop`),
    headphones: readHeadphones(readRequired(object, "headphones", where), `${where}.headphones`),
    sunglasses: readSunglasses(readRequired(object, "sunglasses", where), `${where}.sunglasses`),
  };
}

function readHeadphones(value: unknown, where: string): Headphones {
  const object = readObject(value, where);
  return {
    band: readPath(readRequired(object, "band", where), `${where}.band`),
    cupLeft: readPath(readRequired(object, "cupLeft", where), `${where}.cupLeft`),
    cupRight: readPath(readRequired(object, "cupRight", where), `${where}.cupRight`),
  };
}

function readSunglasses(value: unknown, where: string): Sunglasses {
  const object = readObject(value, where);
  return {
    lensesFilled: readPath(readRequired(object, "lensesFilled", where), `${where}.lensesFilled`),
    lensesBridgeAndArms: readPath(
      readRequired(object, "lensesBridgeAndArms", where),
      `${where}.lensesBridgeAndArms`,
    ),
  };
}

/** Only faces for known line states are kept; unknown keys are ignored. */
function readFaces(value: unknown, where: string): LineSet["faces"] {
  const object = readObject(readRequired(readObject(value, where), "items", where), `${where}.items`);
  const items: LineSet["faces"]["items"] = Object.create(null);
  for (const state of LINE_STATES) {
    const face = readNullable(readOptional(object, state), `${where}.items.${state}`, readFace);
    if (face !== null) items[state] = face;
  }
  return { items };
}

const readBrows: Reader<BrowDrawing[]> = (value, where) => readList(value, where, readBrow);

function readFace(value: unknown, where: string): FaceDrawing {
  const object = readObject(value, where);
  return {
    bodyPose: readBodyPose(readRequired(object, "bodyPose", where), `${where}.bodyPose`),
    behindLedge: readBoolean(readRequired(object, "behindLedge", where), `${where}.behindLedge`),
    eyes: asCounted(readList(readRequired(object, "eyes", where), `${where}.eyes`, readEye)),
    brows: readNullable(readOptional(object, "brows"), `${where}.brows`, (brows, at) =>
      asCounted<readonly [BrowDrawing, BrowDrawing]>(readBrows(brows, at)),
    ),
    marks: readPaths(readRequired(object, "marks", where), `${where}.marks`),
    markMiddles: readNullable(readOptional(object, "markMiddles"), `${where}.markMiddles`, readPoints),
    marksMotion: readNullable(
      readOptional(object, "marksMotion"),
      `${where}.marksMotion`,
      readMarksMotion,
    ),
    marksWithHat: readNullable(
      readOptional(object, "marksWithHat"),
      `${where}.marksWithHat`,
      readPaths,
    ),
    glanceShare: readNullable(readOptional(object, "glanceShare"), `${where}.glanceShare`, readNumber),
    eyesPath: readNullable(readOptional(object, "eyesPath"), `${where}.eyesPath`, readKeyedPath),
    bodyRound: readNullable(readOptional(object, "bodyRound"), `${where}.bodyRound`, readKeyedPath),
    marksOverBody: readNullable(
      readOptional(object, "marksOverBody"),
      `${where}.marksOverBody`,
      readBoolean,
    ),
    marksFilled: readNullable(
      readOptional(object, "marksFilled"),
      `${where}.marksFilled`,
      readMarksFilled,
    ),
    marksCarried: readNullable(
      readOptional(object, "marksCarried"),
      `${where}.marksCarried`,
      readBoolean,
    ),
  };
}

function readKeyedPath(value: unknown, where: string): KeyedPath {
  const object = readObject(value, where);
  return {
    periodSeconds: readNumber(
      readRequired(object, "periodSeconds", where),
      `${where}.periodSeconds`,
    ),
    keys: readList(readRequired(object, "keys", where), `${where}.keys`, readNumbers),
  };
}

function readBodyPose(value: unknown, where: string): BodyPose {
  const object = readObject(value, where);
  return {
    shiftX: readNumber(readRequired(object, "shiftX", where), `${where}.shiftX`),
    shiftY: readNumber(readRequired(object, "shiftY", where), `${where}.shiftY`),
    leanDegrees: readNumber(readRequired(object, "leanDegrees", where), `${where}.leanDegrees`),
  };
}

function readEye(value: unknown, where: string): EyeDrawing {
  const object = readObject(value, where);
  return {
    kind: readWord(readRequired(object, "kind", where), `${where}.kind`, EYE_KINDS),
    offsetX: readNumber(readRequired(object, "offsetX", where), `${where}.offsetX`),
    offsetY: readNumber(readRequired(object, "offsetY", where), `${where}.offsetY`),
    blinks: readBoolean(readRequired(object, "blinks", where), `${where}.blinks`),
    halfWidth: readNullable(readOptional(object, "halfWidth"), `${where}.halfWidth`, readNumber),
    halfHeight: readNullable(readOptional(object, "halfHeight"), `${where}.halfHeight`, readNumber),
    rise: readNullable(readOptional(object, "rise"), `${where}.rise`, readNumber),
  };
}

function readBrow(value: unknown, where: string): BrowDrawing {
  return {
    points: asCounted(readPoints(readRequired(readObject(value, where), "points", where), `${where}.points`)),
  };
}

function readMarksMotion(value: unknown, where: string): MarksMotion {
  const object = readObject(value, where);
  return {
    mode: readWord(readRequired(object, "mode", where), `${where}.mode`, MARKS_MOTION_MODES),
    period: readNullable(readOptional(object, "period"), `${where}.period`, readNumber),
    delay: readNullable(readOptional(object, "delay"), `${where}.delay`, readNumber),
    group: readNullable(readOptional(object, "group"), `${where}.group`, readNumber),
    drawingsPerSecond: readNullable(
      readOptional(object, "drawingsPerSecond"),
      `${where}.drawingsPerSecond`,
      readNumber,
    ),
    drawingsPerRound: readNullable(
      readOptional(object, "drawingsPerRound"),
      `${where}.drawingsPerRound`,
      readWholeNumber,
    ),
    shiftXByDrawing: readNullable(
      readOptional(object, "shiftXByDrawing"),
      `${where}.shiftXByDrawing`,
      readNumbers,
    ),
    shiftYByDrawing: readNullable(
      readOptional(object, "shiftYByDrawing"),
      `${where}.shiftYByDrawing`,
      readNumbers,
    ),
    shownIn: readNullable(readOptional(object, "shownIn"), `${where}.shownIn`, (shownIn, at) =>
      readList(shownIn, at, (drawings, drawingsAt) =>
        drawings === null ? null : readList(drawings, drawingsAt, readWholeNumber),
      ),
    ),
    turnDegreesByDrawing: readNullable(
      readOptional(object, "turnDegreesByDrawing"),
      `${where}.turnDegreesByDrawing`,
      readNumbers,
    ),
    turnsAbout: readNullable(readOptional(object, "turnsAbout"), `${where}.turnsAbout`, readPoint),
  };
}

/** Either "all" or a list of mark places. */
function readMarksFilled(value: unknown, where: string): MarksFilled {
  if (Array.isArray(value)) return { kind: "places", places: readList(value, where, readWholeNumber) };
  return readText(value, where) === "all"
    ? { kind: "all" }
    : unreadable(`${where} is neither "all" nor a list of places`);
}

function readMarksPlacement(value: unknown, where: string): MarksPlacement {
  const object = readObject(value, where);
  return {
    byBody: readRecord(readRequired(object, "byBody", where), `${where}.byBody`, (byFace, at) =>
      readRecord(byFace, at, readPoints),
    ),
    surprisedWithHatByBody: readRecord(
      readRequired(object, "surprisedWithHatByBody", where),
      `${where}.surprisedWithHatByBody`,
      readPoints,
    ),
  };
}

function readAccessories(value: unknown, where: string): Accessories {
  const object = readObject(value, where);
  return {
    drawnForHeadTopAt: readPoint(
      readRequired(object, "drawnForHeadTopAt", where),
      `${where}.drawnForHeadTopAt`,
    ),
    turnsAbout: readPoint(readRequired(object, "turnsAbout", where), `${where}.turnsAbout`),
    spotSlipShare: asCounted(
      readNumbers(readRequired(object, "spotSlipShare", where), `${where}.spotSlipShare`),
    ),
    items: readRecord(readRequired(object, "items", where), `${where}.items`, readAccessory),
  };
}

function readAccessory(value: unknown, where: string): AccessoryDrawing {
  const object = readObject(value, where);
  return {
    tiltDegrees: readNumber(readRequired(object, "tiltDegrees", where), `${where}.tiltDegrees`),
    lift: readNumber(readRequired(object, "lift", where), `${where}.lift`),
    floats: readBoolean(readRequired(object, "floats", where), `${where}.floats`),
    onFace: readBoolean(readRequired(object, "onFace", where), `${where}.onFace`),
    fromEars: readBoolean(readRequired(object, "fromEars", where), `${where}.fromEars`),
    silhouette: readNullable(readOptional(object, "silhouette"), `${where}.silhouette`, readPaths),
    spots: readList(readRequired(object, "spots", where), `${where}.spots`, readSpot),
    lines: readPaths(readRequired(object, "lines", where), `${where}.lines`),
    builtFromEars: readNullable(
      readOptional(object, "builtFromEars"),
      `${where}.builtFromEars`,
      readEarBuild,
    ),
  };
}

function readEarBuild(value: unknown, where: string): EarBuild {
  const object = readObject(value, where);
  return {
    spots: readList(readRequired(object, "spots", where), `${where}.spots`, (spot, at) => {
      const spotObject = readObject(spot, at);
      return {
        part: readText(readRequired(spotObject, "part", at), `${at}.part`),
        colour: readText(readRequired(spotObject, "colour", at), `${at}.colour`),
      };
    }),
    lines: readList(readRequired(object, "lines", where), `${where}.lines`, readText),
  };
}

function readSpot(value: unknown, where: string): AccessorySpot {
  const object = readObject(value, where);
  return {
    path: readPath(readRequired(object, "path", where), `${where}.path`),
    colour: readText(readRequired(object, "colour", where), `${where}.colour`),
  };
}

function readSmallSizes(value: unknown, where: string): SmallSizes {
  const object = readObject(value, where);
  const table = (key: string) => readSizeTable(readRequired(object, key, where), `${where}.${key}`);
  const number = (key: string) => readNumber(readRequired(object, key, where), `${where}.${key}`);
  return {
    lineWeight: table("lineWeight"),
    eyeLineWeight: table("eyeLineWeight"),
    spotSlipX: table("spotSlipX"),
    spotSlipY: table("spotSlipY"),
    eyeScale: table("eyeScale"),
    wobbleAbovePx: number("wobbleAbovePx"),
    marksAbovePx: number("marksAbovePx"),
    innerLineAbovePx: number("innerLineAbovePx"),
    ledgeFromPx: number("ledgeFromPx"),
    eyeSpacingGrowth: number("eyeSpacingGrowth"),
    eyeLineDropPerScale: number("eyeLineDropPerScale"),
    ledgeBelowEyeLine: number("ledgeBelowEyeLine"),
    ledgeDropPerScale: number("ledgeDropPerScale"),
  };
}

function readColours(value: unknown, where: string): LineColours {
  const object = readObject(value, where);
  return {
    ink: readText(readRequired(object, "ink", where), `${where}.ink`),
    paper: readText(readRequired(object, "paper", where), `${where}.paper`),
    offered: readList(readRequired(object, "offered", where), `${where}.offered`, (offered, at) => {
      const offeredObject = readObject(offered, at);
      return {
        key: readText(readRequired(offeredObject, "key", at), `${at}.key`),
        hex: readText(readRequired(offeredObject, "hex", at), `${at}.hex`),
      };
    }),
    accessorySpots: readRecord(
      readRequired(object, "accessorySpots", where),
      `${where}.accessorySpots`,
      readText,
    ),
    marksFill: readNullable(readOptional(object, "marksFill"), `${where}.marksFill`, readText),
  };
}

function readFrame(value: unknown, where: string): FrameMotion {
  const object = readObject(value, where);
  const holdSettlesInSeconds = readNumberField(object, "holdSettlesInSeconds", where);
  const holdSettleSink = readNumberField(object, "holdSettleSink", where);

  const breathWhere = `${where}.breath`;
  const breathObject = readObject(readRequired(object, "breath", where), breathWhere);
  const breath = {
    swell: readNumberField(breathObject, "swell", breathWhere),
    periodSeconds: readNumberField(breathObject, "periodSeconds", breathWhere),
  };

  const settleRange = readNumbers(readRequired(object, "settleRange", where), `${where}.settleRange`);

  const spinWhere = `${where}.spin`;
  const spinObject = readObject(readRequired(object, "spin", where), spinWhere);
  const spin = {
    widthSideOn: readNumberField(spinObject, "widthSideOn", spinWhere),
    faceSlide: readNumberField(spinObject, "faceSlide", spinWhere),
    faceNarrowestShare: readNumberField(spinObject, "faceNarrowestShare", spinWhere),
    faceFadeStart: readNumberField(spinObject, "faceFadeStart", spinWhere),
    faceFadeOver: readNumberField(spinObject, "faceFadeOver", spinWhere),
    hatSlide: readNumberField(spinObject, "hatSlide", spinWhere),
    hatNarrowestShare: readNumberField(spinObject, "hatNarrowestShare", spinWhere),
  };

  const jumpShareWithHat = readNumberField(object, "jumpShareWithHat", where);

  const eyesWhere = `${where}.eyes`;
  const eyesObject = readObject(readRequired(object, "eyes", where), eyesWhere);
  const eyes = {
    gazeLimit: readNumberField(eyesObject, "gazeLimit", eyesWhere),
    gazeToUnitsX: readNumberField(eyesObject, "gazeToUnitsX", eyesWhere),
    gazeToUnitsY: readNumberField(eyesObject, "gazeToUnitsY", eyesWhere),
    drawnEyesFollowShare: readNumberField(eyesObject, "drawnEyesFollowShare", eyesWhere),
    browsFollowShare: readNumberField(eyesObject, "browsFollowShare", eyesWhere),
    openLimit: readNumberField(eyesObject, "openLimit", eyesWhere),
    drawnAsLineBelowOpen: readNumberField(eyesObject, "drawnAsLineBelowOpen", eyesWhere),
    shutOnFaceChangeSeconds: readNumberField(eyesObject, "shutOnFaceChangeSeconds", eyesWhere),
  };

  const hatWhere = `${where}.hat`;
  const hatObject = readObject(readRequired(object, "hat", where), hatWhere);
  const hat = {
    sinkToUnits: readNumberField(hatObject, "sinkToUnits", hatWhere),
    dropToUnits: readNumberField(hatObject, "dropToUnits", hatWhere),
    floatsAboveBy: readNumberField(hatObject, "floatsAboveBy", hatWhere),
    floatBob: readNumberField(hatObject, "floatBob", hatWhere),
    floatBobRadiansPerSecond: readNumberField(hatObject, "floatBobRadiansPerSecond", hatWhere),
  };

  return {
    holdSettlesInSeconds,
    holdSettleSink,
    breath,
    settleRange: asCounted(settleRange),
    spin,
    jumpShareWithHat,
    eyes,
    hat,
  };
}

function readEyeKinds(value: unknown, where: string): EyeKinds {
  const object = readObject(value, where);
  const readKind = (kind: "oval" | "lid"): EyeKindDrawing => {
    const kindWhere = `${where}.${kind}`;
    const shut = readObject(
      readRequired(readObject(readRequired(object, kind, where), kindWhere), "shutDrawnAs", kindWhere),
      `${kindWhere}.shutDrawnAs`,
    );
    return {
      shutDrawnAs: {
        overhangEachSide: readNumber(
          readRequired(shut, "overhangEachSide", kindWhere),
          `${kindWhere}.shutDrawnAs.overhangEachSide`,
        ),
        lower: readNumber(readRequired(shut, "lower", kindWhere), `${kindWhere}.shutDrawnAs.lower`),
      },
    };
  };
  return { oval: readKind("oval"), lid: readKind("lid") };
}

function readMarksMotionSettings(value: unknown, where: string): MarksMotionSettings {
  const object = readObject(value, where);

  const drawOnWhere = `${where}.drawOn`;
  const drawOnObject = readObject(readRequired(object, "drawOn", where), drawOnWhere);
  const drawOn = {
    drawnBy: readNumberField(drawOnObject, "drawnBy", drawOnWhere),
    heldUntil: readNumberField(drawOnObject, "heldUntil", drawOnWhere),
    takenBackOver: readNumberField(drawOnObject, "takenBackOver", drawOnWhere),
  };

  const fadeInSeconds = readNumberField(object, "fadeInSeconds", where);

  const modesWhere = `${where}.modes`;
  const modes = readObject(readRequired(object, "modes", where), modesWhere);
  const mode = (name: string) => {
    const modeWhere = `${modesWhere}.${name}`;
    return [readObject(readRequired(modes, name, modesWhere), modeWhere), modeWhere] as const;
  };

  const [float, floatWhere] = mode("float");
  const floatSettings = {
    rise: readNumberField(float, "rise", floatWhere),
    scaleFrom: readNumberField(float, "scaleFrom", floatWhere),
    scaleGain: readNumberField(float, "scaleGain", floatWhere),
    scaleReachedAt: readNumberField(float, "scaleReachedAt", floatWhere),
  };

  const [twinkle, twinkleWhere] = mode("twinkle");
  const twinkleSettings = {
    power: readNumberField(twinkle, "power", twinkleWhere),
    flutter: readNumberField(twinkle, "flutter", twinkleWhere),
    flutterTurns: readNumberField(twinkle, "flutterTurns", twinkleWhere),
    smallest: readNumberField(twinkle, "smallest", twinkleWhere),
    hiddenBelow: readNumberField(twinkle, "hiddenBelow", twinkleWhere),
  };

  const [ellipsis, ellipsisWhere] = mode("ellipsis");
  const ellipsisSettings = {
    firstAt: readNumberField(ellipsis, "firstAt", ellipsisWhere),
    nextAfter: readNumberField(ellipsis, "nextAfter", ellipsisWhere),
    allOffAt: readNumberField(ellipsis, "allOffAt", ellipsisWhere),
  };

  const [cursor, cursorWhere] = mode("cursor");
  const cursorSettings = {
    steadyMarks: readWholeNumber(
      readRequired(cursor, "steadyMarks", cursorWhere),
      `${cursorWhere}.steadyMarks`,
    ),
    onShare: readNumberField(cursor, "onShare", cursorWhere),
  };

  const [firework, fireworkWhere] = mode("firework");

  return {
    drawOn,
    fadeInSeconds,
    modes: {
      float: floatSettings,
      twinkle: twinkleSettings,
      ellipsis: ellipsisSettings,
      cursor: cursorSettings,
      firework: {
        raysPerBurst: readWholeNumber(
          readRequired(firework, "raysPerBurst", fireworkWhere),
          `${fireworkWhere}.raysPerBurst`,
        ),
        secondBurstTurnedRadians: readNumberField(firework, "secondBurstTurnedRadians", fireworkWhere),
        drawnBy: readNumberField(firework, "drawnBy", fireworkWhere),
        takenBackFrom: readNumberField(firework, "takenBackFrom", fireworkWhere),
        takenBackOver: readNumberField(firework, "takenBackOver", fireworkWhere),
        fly: readNumberField(firework, "fly", fireworkWhere),
      },
    },
  };
}

function readLineSettings(value: unknown, where: string): LineSettings {
  const object = readObject(value, where);

  const defaultsWhere = `${where}.defaults`;
  const defaultsObject = readObject(readRequired(object, "defaults", where), defaultsWhere);
  const defaults = {
    redrawsPerSecond: readNumberField(defaultsObject, "redrawsPerSecond", defaultsWhere),
    handWobble: readNumberField(defaultsObject, "handWobble", defaultsWhere),
    shapeDrift: readNumberField(defaultsObject, "shapeDrift", defaultsWhere),
    widthWanderPercent: readNumberField(defaultsObject, "widthWanderPercent", defaultsWhere),
  };

  const phases = readList(readRequired(object, "phases", where), `${where}.phases`, readNumbers);
  const spotNudgeByPhase = readList(
    readRequired(object, "spotNudgeByPhase", where),
    `${where}.spotNudgeByPhase`,
    readNumbers,
  );
  const samplePathEvery = readNumberField(object, "samplePathEvery", where);
  const samplesAtMost = readWholeNumber(
    readRequired(object, "samplesAtMost", where),
    `${where}.samplesAtMost`,
  );
  const closedSamplesAtLeast = readWholeNumber(
    readRequired(object, "closedSamplesAtLeast", where),
    `${where}.closedSamplesAtLeast`,
  );
  const wander = readWave(readRequired(object, "wander", where), `${where}.wander`);

  const driftWhere = `${where}.drift`;
  const driftObject = readObject(readRequired(object, "drift", where), driftWhere);
  const drift = {
    shareOfShapeDrift: readNumberField(driftObject, "shareOfShapeDrift", driftWhere),
    waveEvery: readNumberField(driftObject, "waveEvery", driftWhere),
    wavesAtLeast: readNumberField(driftObject, "wavesAtLeast", driftWhere),
    radiansPerSecond: readNumberField(driftObject, "radiansPerSecond", driftWhere),
  };

  const width = readWave(readRequired(object, "width", where), `${where}.width`);
  const shortLinesDampedBelowLength = readNumberField(object, "shortLinesDampedBelowLength", where);

  const taperWhere = `${where}.taperAtOpenEnds`;
  const taperObject = readObject(readRequired(object, "taperAtOpenEnds", where), taperWhere);
  const taperAtOpenEnds = {
    floor: readNumberField(taperObject, "floor", taperWhere),
    gain: readNumberField(taperObject, "gain", taperWhere),
    over: readNumberField(taperObject, "over", taperWhere),
  };

  const solidShapesWanderShare = readNumberField(object, "solidShapesWanderShare", where);
  const dotBelowLength = readNumberField(object, "dotBelowLength", where);

  const seedsWhere = `${where}.seeds`;
  const seedsObject = readObject(readRequired(object, "seeds", where), seedsWhere);
  const seedMix = (key: string) =>
    readNumbers(readRequired(seedsObject, key, seedsWhere), `${seedsWhere}.${key}`);
  const seeds = {
    outline: readNumberField(seedsObject, "outline", seedsWhere),
    innerLine: readNumberField(seedsObject, "innerLine", seedsWhere),
    accessoryLinesFrom: readNumberField(seedsObject, "accessoryLinesFrom", seedsWhere),
    eyesFilled: readNumberField(seedsObject, "eyesFilled", seedsWhere),
    eyesStroked: readNumberField(seedsObject, "eyesStroked", seedsWhere),
    marksFrom: readNumberField(seedsObject, "marksFrom", seedsWhere),
    ledge: readNumberField(seedsObject, "ledge", seedsWhere),
    subPathStep: readNumberField(seedsObject, "subPathStep", seedsWhere),
    seedScale: readNumberField(seedsObject, "seedScale", seedsWhere),
    phaseMix: asCounted<LineSettings["seeds"]["phaseMix"]>(seedMix("phaseMix")),
    wanderMix: asCounted<LineSettings["seeds"]["wanderMix"]>(seedMix("wanderMix")),
    driftMix: readNumberField(seedsObject, "driftMix", seedsWhere),
    widthMix: asCounted<LineSettings["seeds"]["widthMix"]>(seedMix("widthMix")),
  };

  return {
    defaults,
    phases: asCounted(phases),
    spotNudgeByPhase: asCounted(spotNudgeByPhase),
    samplePathEvery,
    samplesAtMost,
    closedSamplesAtLeast,
    wander,
    drift,
    width,
    shortLinesDampedBelowLength,
    taperAtOpenEnds,
    solidShapesWanderShare,
    dotBelowLength,
    seeds,
  };
}

function readWave(value: unknown, where: string): LineWave {
  const object = readObject(value, where);
  const pair = (key: string) =>
    asCounted<LineWave["weights"]>(readNumbers(readRequired(object, key, where), `${where}.${key}`));
  return {
    shareOfHandWobble: readNullable(
      readOptional(object, "shareOfHandWobble"),
      `${where}.shareOfHandWobble`,
      readNumber,
    ),
    narrowest: readNullable(readOptional(object, "narrowest"), `${where}.narrowest`, readNumber),
    wavesEvery: pair("wavesEvery"),
    wavesAtLeast: pair("wavesAtLeast"),
    weights: pair("weights"),
  };
}
