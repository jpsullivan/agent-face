// Shape of a checked line set: the hand-drawn line look's bodies, faces, accessories, colours and motion.
import type { LineState } from "@/look/aibo-look";
import type { PathPart } from "@/draw/path-data";
import type { SizeTable } from "./size-table";

export type Pair = readonly [number, number];
export type Quad = readonly [number, number, number, number];

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PathShape {
  parts: PathPart[];
}

export interface LineSetMaster {
  size: number;
  middleX: number;
  groundY: number;
  swatchBox: Box;
  swatchBoxWithHat: Box;
  standsOn: Point;
}

export interface Headphones {
  band: PathShape;
  cupLeft: PathShape;
  cupRight: PathShape;
}

export interface Sunglasses {
  lensesFilled: PathShape;
  lensesBridgeAndArms: PathShape;
}

export interface BodyDrawing {
  outline: PathShape;
  innerLine: PathShape | null;
  eyeLineY: number;
  eyeHalfSpacing: number;
  headTop: Point;
  headphones: Headphones;
  sunglasses: Sunglasses;
}

export interface BodyPose {
  shiftX: number;
  shiftY: number;
  leanDegrees: number;
}

export const EYE_KINDS = ["oval", "lid", "arc", "shut", "dash", "cross"] as const;
export type EyeKind = (typeof EYE_KINDS)[number];

export interface EyeDrawing {
  kind: EyeKind;
  offsetX: number;
  offsetY: number;
  blinks: boolean;
  halfWidth: number | null;
  halfHeight: number | null;
  rise: number | null;
}

export interface BrowDrawing {
  points: readonly [Point, Point, Point];
}

export const MARKS_MOTION_MODES = [
  "hold",
  "trim",
  "stagger",
  "float",
  "twinkle",
  "ellipsis",
  "cursor",
  "firework",
  "frames",
] as const;
export type MarksMotionMode = (typeof MARKS_MOTION_MODES)[number];

export interface MarksMotion {
  mode: MarksMotionMode;
  period: number | null;
  delay: number | null;
  group: number | null;
  drawingsPerSecond: number | null;
  drawingsPerRound: number | null;
  shiftXByDrawing: number[] | null;
  shiftYByDrawing: number[] | null;
  /** Per mark, the drawings it shows in (null: every drawing). */
  shownIn: (number[] | null)[] | null;
  turnDegreesByDrawing: number[] | null;
  turnsAbout: Point | null;
}

export type MarksFilled = { kind: "places"; places: number[] } | { kind: "all" };

/** A looping keyframe path: each key is `[time 0..1, ...values]`. */
export interface KeyedPath {
  periodSeconds: number;
  keys: number[][];
}

export interface FaceDrawing {
  bodyPose: BodyPose;
  behindLedge: boolean;
  eyes: readonly [EyeDrawing, EyeDrawing];
  brows: readonly [BrowDrawing, BrowDrawing] | null;
  marks: PathShape[];
  markMiddles: Point[] | null;
  marksMotion: MarksMotion | null;
  marksWithHat: PathShape[] | null;
  glanceShare: number | null;
  eyesPath: KeyedPath | null;
  bodyRound: KeyedPath | null;
  marksOverBody: boolean | null;
  marksFilled: MarksFilled | null;
  marksCarried: boolean | null;
}

export interface MarksPlacement {
  byBody: Record<string, Record<string, Point[]>>;
  surprisedWithHatByBody: Record<string, Point[]>;
}

export interface AccessorySpot {
  path: PathShape;
  colour: string;
}

export interface EarBuild {
  spots: { part: string; colour: string }[];
  lines: string[];
}

export interface AccessoryDrawing {
  tiltDegrees: number;
  lift: number;
  floats: boolean;
  onFace: boolean;
  fromEars: boolean;
  silhouette: PathShape[] | null;
  spots: AccessorySpot[];
  lines: PathShape[];
  builtFromEars: EarBuild | null;
}

export interface Accessories {
  drawnForHeadTopAt: Point;
  turnsAbout: Point;
  spotSlipShare: Pair;
  items: Record<string, AccessoryDrawing>;
}

export interface SmallSizes {
  lineWeight: SizeTable;
  eyeLineWeight: SizeTable;
  spotSlipX: SizeTable;
  spotSlipY: SizeTable;
  eyeScale: SizeTable;
  wobbleAbovePx: number;
  marksAbovePx: number;
  innerLineAbovePx: number;
  ledgeFromPx: number;
  eyeSpacingGrowth: number;
  eyeLineDropPerScale: number;
  ledgeBelowEyeLine: number;
  ledgeDropPerScale: number;
}

export interface OfferedColour {
  key: string;
  hex: string;
}

export interface LineColours {
  ink: string;
  paper: string;
  offered: OfferedColour[];
  accessorySpots: Record<string, string>;
  marksFill: string | null;
}

export interface FrameMotion {
  holdSettlesInSeconds: number;
  holdSettleSink: number;
  breath: { swell: number; periodSeconds: number };
  settleRange: Pair;
  spin: {
    widthSideOn: number;
    faceSlide: number;
    faceNarrowestShare: number;
    faceFadeStart: number;
    faceFadeOver: number;
    hatSlide: number;
    hatNarrowestShare: number;
  };
  jumpShareWithHat: number;
  eyes: {
    gazeLimit: number;
    gazeToUnitsX: number;
    gazeToUnitsY: number;
    drawnEyesFollowShare: number;
    browsFollowShare: number;
    openLimit: number;
    drawnAsLineBelowOpen: number;
    shutOnFaceChangeSeconds: number;
  };
  hat: {
    sinkToUnits: number;
    dropToUnits: number;
    floatsAboveBy: number;
    floatBob: number;
    floatBobRadiansPerSecond: number;
  };
}

export interface EyeKindDrawing {
  shutDrawnAs: { overhangEachSide: number; lower: number };
}

export interface EyeKinds {
  oval: EyeKindDrawing;
  lid: EyeKindDrawing;
}

export interface MarksMotionSettings {
  drawOn: { drawnBy: number; heldUntil: number; takenBackOver: number };
  fadeInSeconds: number;
  modes: {
    float: { rise: number; scaleFrom: number; scaleGain: number; scaleReachedAt: number };
    twinkle: {
      power: number;
      flutter: number;
      flutterTurns: number;
      smallest: number;
      hiddenBelow: number;
    };
    ellipsis: { firstAt: number; nextAfter: number; allOffAt: number };
    cursor: { steadyMarks: number; onShare: number };
    firework: {
      raysPerBurst: number;
      secondBurstTurnedRadians: number;
      drawnBy: number;
      takenBackFrom: number;
      takenBackOver: number;
      fly: number;
    };
  };
}

export interface LineWave {
  shareOfHandWobble: number | null;
  narrowest: number | null;
  wavesEvery: Pair;
  wavesAtLeast: Pair;
  weights: Pair;
}

export interface LineSettings {
  defaults: {
    redrawsPerSecond: number;
    handWobble: number;
    shapeDrift: number;
    widthWanderPercent: number;
  };
  phases: readonly [Quad, Quad, Quad, Quad];
  spotNudgeByPhase: readonly [Pair, Pair, Pair, Pair];
  samplePathEvery: number;
  samplesAtMost: number;
  closedSamplesAtLeast: number;
  wander: LineWave;
  drift: {
    shareOfShapeDrift: number;
    waveEvery: number;
    wavesAtLeast: number;
    radiansPerSecond: number;
  };
  width: LineWave;
  shortLinesDampedBelowLength: number;
  taperAtOpenEnds: { floor: number; gain: number; over: number };
  solidShapesWanderShare: number;
  dotBelowLength: number;
  seeds: {
    outline: number;
    innerLine: number;
    accessoryLinesFrom: number;
    eyesFilled: number;
    eyesStroked: number;
    marksFrom: number;
    ledge: number;
    subPathStep: number;
    seedScale: number;
    phaseMix: Quad;
    wanderMix: Pair;
    driftMix: number;
    widthMix: Pair;
  };
}

export interface LineSet {
  master: LineSetMaster;
  bodies: { items: Record<string, BodyDrawing> };
  faces: { items: Partial<Record<LineState, FaceDrawing>> };
  marksPlacement: MarksPlacement;
  accessories: Accessories;
  smallSizes: SmallSizes;
  colours: LineColours;
  frame: FrameMotion;
  eyeKinds: EyeKinds;
  marksMotion: MarksMotionSettings;
  line: LineSettings;
}
