const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-frame-C3KzjOHD.css",
      "https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-styles-mAV-wvNm.css",
    ]),
) => i.map((i) => d[i]);
import { Qr as e } from "./preload-helper-Cq29w_VG.js";
import {
  Do as t,
  Eo as n,
  Ja as r,
  Oo as i,
  ao as a,
  ho as o,
  io as s,
  qa as c,
  vo as l,
  yo as u,
} from "./vendor-frame-DOohJIoJ.js";
import {
  $i as d,
  EY as m,
  I1,
  I4,
  I5,
  J0,
  J1,
  J2,
  J3,
  J4,
  J5,
  J9,
  K0,
  K1,
  K2,
  K3,
  K4,
  K5,
  NY as p,
  XZ as h,
  Z1,
  Z2,
  ln as g,
  ub as f,
} from "./shared-frame-BjFq5krv.js";
import { Eo as _, _t as v } from "./shared-l-p-m-w-1-G7HedE-G.js";
import { DW as b, fO as y } from "./shared-l-p-m-w-2-DjrpivvG.js";
import { N as ee } from "./vendor-query-C65RZMb5.js";
import { f as te, p as ne } from "./vendor-intl-0OsOlOJH.js";
import { JR as re } from "./shared-11-B9cfnwcT.js";
import { eH as ie } from "./shared-100-DtXmh0yg.js";
import {
  Ct as ae,
  Q as oe,
  St as se,
  Tt as ce,
  bt as le,
  ft as x,
  nt as ue,
  rt as de,
  vt as fe,
  wt as pe,
} from "./fcee03b8edc27b24f59134f0f99027292a19362584c3ea5f-BYoS-YJP.js";
import {
  a as me,
  n as S,
  t as C,
} from "./046ad1efebe522e66b1a1c7b6d2429b1f5bbaac7160dc539-Cp0AY0vP.js";
import { t as w, u as he } from "./c0ff9653e-Cd7syOsb.js";
import {
  a as T,
  c as E,
  d as ge,
  f as _e,
  n as D,
  o as O,
  p as k,
  r as A,
  t as j,
} from "./89cbbe1909e4ce472510b6c05a7a0ac7c696311dcd3f1bd0-BAz1nNdO.js";
import {
  a as M,
  c as N,
  i as ve,
  n as ye,
  o as be,
  t as xe,
} from "./7f29883aa074b869545499b0bb58fdfa7fbcdee8c93c26bf-CGiVxYE0.js";
console.assert("__eap_only__");
var Se = [
    "heart",
    "people",
    "briefcase",
    "book",
    "plane",
    "car",
    "food",
    "bag",
    "gift",
    "sprout",
    "music",
  ],
  P = [...C, ...Se],
  F = P;
function I(e) {
  return Se.some((t) => t === e);
}
function Ce(e) {
  return I(e) ? "checklist" : e;
}
var we = ["clay", "heather", "mineral", "ochre", "cornflower", "rose"],
  L = [
    ["calendar", ["calendar", "date", "schedule", "agenda", "week"]],
    ["email", ["mail", "email", "inbox", "newsletter"]],
    ["dollarSign", ["money", "budget", "expense", "invoice", "bill", "cost"]],
    ["chart", ["chart", "graph", "metric", "dashboard", "stats"]],
    ["globe", ["travel", "trip", "flight", "hotel", "itinerary"]],
    ["mapPin", ["map", "route", "directions"]],
    ["home", ["home", "house", "chore"]],
    ["box", ["shop", "shopping", "grocery", "order"]],
    ["slides", ["deck", "slides", "presentation"]],
    ["folder", ["file", "document", "folder"]],
    ["edit", ["write", "draft", "doc", "post"]],
    ["search", ["find", "research", "look", "compare"]],
  ];
function Te(e) {
  let t = Array.from(e, (e) => Array.from(e.toLowerCase())[0] ?? e).join("");
  return new Set(t.split(/[^\p{L}\p{Nd}]+/u).filter(Boolean));
}
function Ee(e) {
  let t = Te(e);
  return L.find(([, e]) =>
    e.some((e) => ["", "s", "es"].some((n) => t.has(e + n))),
  )?.[0];
}
function De({ id: e, name: t, color: n }) {
  let [r, i] = w(he(e));
  return {
    glyph: Ee(t) ?? C[i % C.length],
    tint:
      (n ?? "") === ""
        ? we[r % we.length]
        : (ce.find((e) => e === n) ?? "clay"),
  };
}
function Oe(e) {
  let [t, ...n] = e.split("_");
  return n.length > 0 && x(`${t}_${fe[0]}_${le[0]}`) !== void 0;
}
function ke(e) {
  let t = e.icon ?? "",
    n = x(t);
  if (n !== void 0) return { ...De(e), tint: se(n.tint) };
  if (t === "") return De(e);
  let r = Oe(t) ? void 0 : me(t, e.color, void 0),
    { wear: i, tint: a } = r ?? S;
  if (i.kind !== "glyph") return { glyph: "folder", tint: a };
  let o = t.slice(t.indexOf("_") + 1);
  return { glyph: r !== void 0 && I(o) ? o : i.glyph, tint: a };
}
console.assert("__eap_only__");
var R = [
    [1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1.19, 1.19, 0, 0, 0.55, -0.06, 1.03, 0.97, 1.4],
    [1, 1, 0, 0.55, -0.55, 0.1, 0.98, 1.02, 1.8],
    [1, 1, 0, 0, 0, 0, 1, 1, 1.6],
    [1, 1.1, 1, 0, -0.1, 0, 1.05, 0.95, 1.6],
    [1, 1, 0, 0, 0, 0.08, 1, 1, 1.2],
    [0, 1, 0.15, 0, 0, 0.14, 1.04, 0.96, 0.6],
    [1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1.4, 1.25, 0, 0, -0.2, 0, 0.92, 1.12, 2.2],
  ],
  {
    idle: z,
    listening: B,
    thinking: V,
    speaking: H,
    happy: U,
    confused: Ae,
    sleeping: je,
    error: Me,
    surprised: W,
  } = ye,
  G = {
    dwell: 1.2,
    reactionDwell: 1.5,
    blinkEvery: 5.5,
    blinkJitter: [0.75, 1.25],
    saccadeEvery: 11.5,
    saccadeJitter: [0.7, 1.3],
    eventGap: 2,
    impulse: 0.6,
  },
  K = [0.55, -0.55],
  q = [1, 1.2, 0.8],
  Ne = 0.25,
  J = 0.5,
  Pe = 1.2,
  Fe = 4.5,
  Ie = 0.02,
  Le = { stiffness: 420, damping: 41, slice: Ie, longestStep: 0.05 },
  Y = 0.002,
  Re = 0.3,
  ze = { wave: 0.6, nod: 0.5 };
function X(e) {
  return R[e] ?? R[z];
}
function Be(e, t) {
  let n = X(z);
  return X(e).map((e, r) => n[r] + (e - n[r]) * t);
}
function Ve(e) {
  return e === U || e === W || e === Ae || e === Me ? G.reactionDwell : G.dwell;
}
function Z(e, t, n, r, i, a) {
  let o = Math.max(1, Math.ceil(a / Ie)),
    s = a / o;
  for (let a = 0; a < o; a++)
    for (let a = 0; a < e.length; a++)
      (t[a] += (r * (n[a] - e[a]) - i * t[a]) * s), (e[a] += t[a] * s);
}
function Q(e, t, n) {
  return e.every((e, r) => Math.abs(e - n[r]) < Y && Math.abs(t[r]) < Y);
}
function He(e, t) {
  return e[0] + (e[1] - e[0]) * t;
}
function Ue(e) {
  let t = Be(e.glyph, e.amplitude),
    n = e.eyes ?? t,
    r = +(e.wink >= 0.5);
  return {
    glyph: e.glyph,
    eyeOpen: n[0],
    eyeWide: n[1],
    happy: r === 1 ? 0 : n[2],
    gaze: [t[3] + e.glance[0], t[4] + e.glance[1]],
    tilt: e.pose[5],
    squash: [e.pose[6], e.pose[7]],
    blink: +(e.blink >= 0.5),
    wink: r,
    bounce: e.bounce,
    spin: e.spin,
    head: e.head,
    face: e.face,
    lag: e.lag,
    swing: e.swing,
    time: e.time,
    breaths: e.breaths,
    amplitude: e.amplitude,
    glance: e.glance,
  };
}
var We = 10,
  Ge = 2 / (Re * Re),
  Ke = 625,
  qe = 27.5,
  Je = 1.1,
  Ye = 0.09,
  Xe = 16,
  Ze = 2.6,
  Qe = 0.7,
  $e = 0.6,
  et = 6,
  tt = class {
    constructor(e, t, n) {
      (this.kind = 0),
        (this.phase = "seated"),
        (this.crouchUntil = 0),
        (this.progress = [0]),
        (this.velocity = [0]),
        (this.offset = [0, 0]),
        (this.flight = [0, 0]),
        (this.angle = 0),
        (this.wornAt = 0),
        (this.recoil = e),
        (this.throwVelocity = t),
        (this.spin = n);
    }
    wear(e, t, n) {
      (this.kind !== e ||
        (this.phase !== "falling" && this.phase !== "seated")) &&
        (this.clear(),
        (this.kind = e),
        (this.wornAt = t ? n : n - We),
        (this.phase = t ? "falling" : "seated"),
        (this.progress[0] = +!t));
    }
    undress(e, t) {
      return this.kind === 0
        ? !1
        : e
          ? this.phase !== "falling" && this.phase !== "seated"
            ? !1
            : M(this.kind)
              ? ((this.phase = "settingDown"),
                (this.progress[0] = 1),
                (this.velocity[0] = 0),
                (this.flight = [0, $e]),
                !1)
              : ((this.phase = "crouching"), (this.crouchUntil = t + Ye), !0)
          : (this.clear(), !1);
    }
    step(e, t) {
      if (this.kind === 0) return null;
      switch (this.phase) {
        case "falling":
          return (
            (this.velocity[0] += Ge * e),
            (this.progress[0] += this.velocity[0] * e),
            this.progress[0] >= 1
              ? ((this.progress[0] = 1), (this.phase = "seated"), "landed")
              : null
          );
        case "seated":
          return this.spring(1, e), null;
        case "crouching":
          return (
            this.spring(Je, e),
            t >= this.crouchUntil
              ? ((this.phase = "flying"),
                (this.progress[0] = 1),
                (this.velocity[0] = 0),
                (this.flight = [this.throwVelocity[0], this.throwVelocity[1]]),
                "thrown")
              : null
          );
        case "flying":
          return (
            (this.flight[1] += Xe * e),
            (this.offset[0] += this.flight[0] * e),
            (this.offset[1] += this.flight[1] * e),
            (this.angle += this.spin * e),
            (Math.abs(this.offset[0]) > Ze || Math.abs(this.offset[1]) > Ze) &&
              this.clear(),
            null
          );
        case "settingDown":
          return (
            (this.flight[1] += et * e),
            (this.offset[0] += this.flight[0] * e),
            (this.offset[1] += this.flight[1] * e),
            this.offset[1] >= Qe && this.clear(),
            null
          );
      }
    }
    spring(e, t) {
      Z(this.progress, this.velocity, [e], Ke, qe, t);
    }
    clear() {
      (this.kind = 0),
        (this.phase = "seated"),
        (this.progress[0] = 0),
        (this.velocity[0] = 0),
        (this.offset = [0, 0]),
        (this.flight = [0, 0]),
        (this.angle = 0);
    }
    isQuiet(e) {
      return (
        this.kind === 0 ||
        (this.phase === "seated" &&
          Math.abs(1 - this.progress[0]) < Y &&
          Math.abs(this.velocity[0]) < Y &&
          e - this.wornAt >= ve(this.kind))
      );
    }
    get staying() {
      return this.phase === "falling" || this.phase === "seated"
        ? this.kind
        : 0;
    }
    frame(e) {
      if (this.kind === 0) return xe;
      let t =
        this.phase === "settingDown" ? Math.min(this.offset[1] / Qe, 1) : 0;
      return {
        kind: this.kind,
        progress: this.progress[0],
        age: e - this.wornAt,
        fling: [this.offset[0], this.offset[1], this.angle, t],
      };
    }
  },
  nt = class {
    constructor(e, t) {
      (this.x = [0, 0]),
        (this.v = [0, 0]),
        (this.stiffness = e),
        (this.damping = t);
    }
    step(e, t) {
      Z(this.x, this.v, e, this.stiffness, this.damping, t);
    }
    snap(e) {
      (this.x[0] = e[0]), (this.x[1] = e[1]), (this.v[0] = 0), (this.v[1] = 0);
    }
    isQuiet(e) {
      return Q(this.x, this.v, e);
    }
  },
  rt = class {
    constructor(e = () => performance.now() / 1e3, t = Math.random) {
      (this.isSettled = !1),
        (this.amplitude = 1),
        (this.baseGlyph = z),
        (this.x = [...X(z)]),
        (this.v = Array.from({ length: 9 }, () => 0)),
        (this.blink = 0),
        (this.nextBlink = 1.2),
        (this.lastBlinkAt = -1 / 0),
        (this.bounce = [0]),
        (this.bounceV = [0]),
        (this.tilt = [0]),
        (this.tiltV = [0]),
        (this.glance = [0, 0]),
        (this.glanceV = [0, 0]),
        (this.glanceTarget = [0, 0]),
        (this.glanceUntil = 0),
        (this.glanceFor = null),
        (this.saccade = [0, 0]),
        (this.holdsOpeningGlance = !1),
        (this.nextSaccade = 2.4),
        (this.wander = [0, 0]),
        (this.wanderV = [0, 0]),
        (this.thinkingSince = null),
        (this.gestureUntil = 0),
        (this.gestureFor = null),
        (this.spin = [0]),
        (this.spinV = [0]),
        (this.spinTarget = 0),
        (this.head = new tt(2.2, [3.4, -6.2], -9)),
        (this.face = new tt(1, [-4.4, -5.4], 8)),
        (this.baseHat = 0),
        (this.lag = new nt(400, 26)),
        (this.swing = new nt(120, 9)),
        (this.shown = z),
        (this.shownSince = -1 / 0),
        (this.lastTime = null),
        (this.animationTime = 0),
        (this.breaths = 0),
        (this.clock = e),
        (this.random = t);
    }
    show(e, t = 1) {
      (e !== this.baseGlyph || t !== this.amplitude) &&
        ((this.baseGlyph = e), (this.amplitude = t), (this.isSettled = !1));
    }
    wave() {
      (this.tiltV[0] += 2.2 * G.impulse),
        (this.gestureFor = ze.wave),
        (this.isSettled = !1);
    }
    nod() {
      (this.tiltV[0] -= 1.6 * G.impulse),
        (this.gestureFor = ze.nod),
        (this.isSettled = !1);
    }
    glanceToward(e, t, n) {
      (this.glanceTarget = [e, t]), (this.glanceFor = n), (this.isSettled = !1);
    }
    hop() {
      (this.bounceV[0] += 2.8 * G.impulse), (this.isSettled = !1);
    }
    turn() {
      (this.spinTarget += 2 * Math.PI), (this.isSettled = !1);
    }
    once(e, t) {
      e !== this.lastGesture && ((this.lastGesture = e), t());
    }
    undress(e, t = !0) {
      this.slot(e).undress(t, this.animationTime) && (this.tiltV[0] += 3),
        (this.isSettled = !1);
    }
    setBaseHat(e, t = !0) {
      e !== this.baseHat &&
        ((this.baseHat = e),
        e === 0 ? this.undress("head", t) : this.wear(e, t));
    }
    wear(e, t = !0) {
      this.slot(N(e)).wear(e, t, this.animationTime),
        t && this.glanceToward(0, -0.7, Re),
        (this.isSettled = !1);
    }
    staying(e) {
      return this.slot(e).staying;
    }
    slot(e) {
      return e === "head" ? this.head : this.face;
    }
    get nextEventAt() {
      let e = this.shown === W ? 1 / 0 : this.nextBlink,
        t = this.looksAbout(this.shown) ? this.nextSaccade : 1 / 0;
      return Math.min(e, t);
    }
    get nextShowAt() {
      return this.baseGlyph === this.shown
        ? 1 / 0
        : (this.lastTime ?? -1 / 0) +
            Ve(this.shown) -
            (this.animationTime - this.shownSince);
    }
    looksAbout(e) {
      return e === z || e === B || e === H;
    }
    step(e = this.clock()) {
      this.lastTime !== null &&
        e - this.lastTime > J &&
        this.shiftDeadlines(e - this.lastTime),
        this.glanceFor !== null &&
          ((this.glanceUntil = e + this.glanceFor), (this.glanceFor = null)),
        this.gestureFor !== null &&
          ((this.gestureUntil = e + this.gestureFor), (this.gestureFor = null)),
        this.lastTime === null &&
          ((this.nextBlink = e + 1.2),
          this.baseGlyph === z &&
            ((this.saccade = [...K]),
            (this.holdsOpeningGlance = !0),
            (this.glance[0] = this.saccade[0]),
            (this.glance[1] = this.saccade[1])));
      let t = Math.max(0, e - (this.lastTime ?? e - 1 / 60)),
        n = t > J ? 1 / 60 : Math.min(Le.longestStep, t),
        r = Math.min(Ne, t);
      (this.lastTime = e),
        (this.animationTime += r),
        (this.breaths += r * Math.max(0.3, this.x[8])),
        t > Ne && this.shownSince > -1 / 0 && (this.shownSince -= t - Ne);
      let i = this.baseGlyph,
        a =
          i !== this.shown &&
          this.animationTime - this.shownSince >= Ve(this.shown);
      a
        ? ((this.shown = i), (this.shownSince = this.animationTime))
        : this.shownSince === -1 / 0 && (this.shownSince = this.animationTime);
      let o = this.shown,
        s = Be(o, this.amplitude),
        c = e < this.glanceUntil,
        l = !c && e >= this.gestureUntil,
        u = this.looksAbout(o) && l;
      o === V
        ? (this.thinkingSince ??= this.animationTime)
        : (this.thinkingSince = null);
      let d = o === V && l,
        f = [0, 0];
      if (d && this.thinkingSince !== null) {
        let e =
          (Math.max(0, this.animationTime - this.thinkingSince - Pe) *
            2 *
            Math.PI) /
          Fe;
        f = [-0.5 * (1 - Math.cos(e)), 0.12 * Math.sin(e)];
      }
      if (u) {
        if (
          (this.holdsOpeningGlance &&
            o !== z &&
            ((this.saccade = [0, 0]), (this.holdsOpeningGlance = !1)),
          e >= this.nextSaccade &&
            (e - this.lastBlinkAt < G.eventGap
              ? (this.nextSaccade = this.lastBlinkAt + G.eventGap)
              : this.nextBlink - e < G.eventGap &&
                (this.nextSaccade = Math.max(e, this.nextBlink) + G.eventGap)),
          e >= this.nextSaccade)
        ) {
          let t = He([-0.7, 0.7], this.random()),
            n = He([-0.28, 0.2], this.random());
          Math.abs(t) < 0.3 && (t = t < 0 ? -0.3 - Math.abs(t) : 0.3 + t),
            Math.hypot(t - this.saccade[0], n - this.saccade[1]) < 0.3 &&
              (t = -this.saccade[0]),
            (this.saccade = [t, n]),
            (this.holdsOpeningGlance = !1),
            (this.nextSaccade =
              e + G.saccadeEvery * He(G.saccadeJitter, this.random()));
        }
      } else
        (this.saccade = [0, 0]),
          (this.holdsOpeningGlance = !1),
          (this.nextSaccade = e + G.saccadeEvery * 0.4);
      let p = c ? this.glanceTarget : d ? f : this.saccade;
      Z(this.glance, this.glanceV, p, Le.stiffness, Le.damping, n),
        (s[3] += this.glance[0]),
        (s[4] += this.glance[1]);
      let m = u || d ? [p[0] * 0.35, p[1] * 0.25] : [0, 0];
      Z(this.wander, this.wanderV, m, 36, 12, n),
        Z(this.x, this.v, s, 180, 27, n),
        a && o === W
          ? (this.bounceV[0] += 3.2 * G.impulse)
          : a &&
            o === U &&
            ((this.bounceV[0] += 2.4 * G.impulse), (this.blink = 0)),
        Z(this.bounce, this.bounceV, [0], 160, 12, n),
        Z(this.tilt, this.tiltV, [0], 120, 8, n);
      let h = o === je;
      o !== W &&
        e >= this.nextBlink &&
        ((this.blink = 1),
        (this.lastBlinkAt = e),
        (this.nextBlink =
          e + G.blinkEvery * He(G.blinkJitter, this.random()) * (h ? 1.6 : 1))),
        (this.blink = Math.max(0, this.blink - n / (h ? 0.28 : 0.13))),
        Z(this.spin, this.spinV, [this.spinTarget], 40, 12.6, n),
        this.spinTarget > 0 &&
          Math.abs(this.spinTarget - this.spin[0]) < Y &&
          Math.abs(this.spinV[0]) < Y &&
          ((this.spin[0] = 0), (this.spinV[0] = 0), (this.spinTarget = 0));
      for (let t of [this.head, this.face]) {
        let r = t.step(n, this.animationTime);
        r === "landed"
          ? ((this.bounceV[0] += t.recoil),
            (this.blink = 1),
            (this.lastBlinkAt = e))
          : r === "thrown" && ((this.tiltV[0] -= 7), (this.bounceV[0] += 1.2));
      }
      let g = [...this.x];
      g[5] += this.tilt[0] + this.wander[0] * 0.18;
      let _ =
          (h ? 0.02 : 0.07) *
          (0.7 * Math.sin(this.breaths * 1.7) +
            0.3 * Math.sin(this.breaths * 2.9 + 1.1)),
        v = this.bounce[0] + this.wander[1] * 0.12 + _,
        y = [g[5], this.bounce[0] + this.wander[1] * 0.12];
      return (
        this.head.kind !== 0 || this.face.kind !== 0
          ? (this.lag.step(y, n), this.swing.step(y, n))
          : (this.lag.snap(y), this.swing.snap(y)),
        (this.isSettled =
          e >= this.gestureUntil &&
          !c &&
          Q(this.bounce, this.bounceV, [0]) &&
          Q(this.tilt, this.tiltV, [0]) &&
          Q(this.glance, this.glanceV, p) &&
          Q(this.wander, this.wanderV, m) &&
          Q(this.x, this.v, s) &&
          this.spinTarget === 0 &&
          Q(this.spin, this.spinV, [0]) &&
          this.head.isQuiet(this.animationTime) &&
          this.face.isQuiet(this.animationTime) &&
          this.lag.isQuiet(y) &&
          this.swing.isQuiet(y) &&
          this.blink === 0 &&
          i === this.shown &&
          !d &&
          o !== H),
        Ue({
          pose: g,
          glyph: o,
          glance: [this.glance[0], this.glance[1]],
          amplitude: this.amplitude,
          blink: this.blink,
          wink: 0,
          bounce: v,
          spin: this.spin[0],
          head: this.head.frame(this.animationTime),
          face: this.face.frame(this.animationTime),
          lag: [this.lag.x[0], this.lag.x[1] + _],
          swing: [this.swing.x[0], this.swing.x[1] + _],
          time: this.animationTime,
          breaths: this.breaths,
          eyes: o === z ? q : void 0,
        })
      );
    }
    shiftDeadlines(e) {
      (this.glanceUntil += e), (this.gestureUntil += e);
    }
  };
function it(e, t, n, r = 1) {
  let i = Be(e, r),
    a = (e) =>
      e === 0 ? xe : { kind: e, progress: 1, age: We, fling: [0, 0, 0, 0] };
  return Ue({
    pose: i,
    glyph: e,
    glance: e === z ? K : [0, 0],
    amplitude: r,
    blink: 0,
    wink: 0,
    bounce: 0,
    spin: 0,
    head: a(t),
    face: a(n),
    lag: [i[5], 0],
    swing: [i[5], 0],
    time: 1.7,
    breaths: 0,
    eyes: e === z ? q : void 0,
  });
}
console.assert("__eap_only__");
var at = s(null);
function ot(e) {
  let $ = J9(5),
    { faceKey: n, children: r } = e,
    i = J1($, 0, n)
      ? K1($, 0, n, () => ({ faceKey: n, engine: new rt() }))
      : $[1],
    [a, o] = t(i);
  return (
    a.faceKey !== n && o({ faceKey: n, engine: new rt() }),
    J1($, 2, r) || J1($, 3, a.engine)
      ? I1($, 3, Z1($, 2, c(at, { value: a.engine, children: r }), r), a.engine)
      : $[4]
  );
}
function st() {
  return o(at);
}
console.assert("__eap_only__");
var ct = 2,
  lt = 1024;
function ut(e, t) {
  return Math.min(lt, Math.max(1, Math.round(e * Math.min(t, ct))));
}
console.assert("__eap_only__");
var dt = ["pointerdown", "keydown", "wheel", "input"],
  ft = { capture: !0, passive: !0 },
  pt = new WeakMap();
function mt(e) {
  let t = pt.get(e);
  if (t !== void 0) return t;
  let n = {
    lastMs: 0,
    wakes: new Set(),
    happened: () => {
      n.lastMs = performance.now();
      for (let e of n.wakes) e();
    },
  };
  return pt.set(e, n), n;
}
function ht(e) {
  let t = mt(e);
  return {
    lastMs: () => t.lastMs,
    add(n) {
      if (t.wakes.size === 0)
        for (let n of dt) e.addEventListener(n, t.happened, ft);
      return (
        t.wakes.add(n),
        () => {
          if (!(!t.wakes.delete(n) || t.wakes.size > 0))
            for (let n of dt) e.removeEventListener(n, t.happened, ft);
        }
      );
    },
  };
}
console.assert("__eap_only__");
var gt = ue(oe),
  _t = 24,
  vt = te({
    idle: { defaultMessage: "{agentName} is idle", id: "uFrKz0/iHx" },
    listening: { defaultMessage: "{agentName} is listening", id: "JN1hfsl5a3" },
    thinking: { defaultMessage: "{agentName} is thinking", id: "aftZpnVh0P" },
    speaking: { defaultMessage: "{agentName} is speaking", id: "UEWLrkW3o2" },
    error: { defaultMessage: "{agentName} hit an error", id: "gK8MjJVmd0" },
  }),
  yt = {
    idle: "idle",
    listening: "listening",
    thinking: "thinking",
    speaking: "speaking",
    happy: "idle",
    confused: "idle",
    sleeping: "idle",
    error: "error",
    surprised: "idle",
  };
function bt(e, t) {
  switch (t.kind) {
    case "wave":
      e.wave();
      return;
    case "nod":
      e.nod();
      return;
    case "hop":
      e.hop();
      return;
    case "spin":
      e.turn();
  }
}
function xt(e) {
  let $ = J9(93),
    {
      state: r,
      agentName: i,
      character: a,
      tint: o,
      hat: s,
      line: d,
      sunglasses: p,
      prop: m,
      mascot: h,
      closer: te,
      gesture: ae,
      size: oe,
      animate: se,
      amplitude: ce,
      eager: le,
      showMark: x,
      drawsSmallInFull: ue,
      decorative: fe,
      title: pe,
      onStill: me,
    } = e,
    S = a === void 0 ? gt.character : a,
    C = o === void 0 ? gt.tint : o,
    w = s === void 0 ? gt.hat : s,
    he = p !== void 0 && p,
    T = m === void 0 ? null : m,
    E = h === void 0 ? null : h,
    D = te !== void 0 && te,
    O = ae === void 0 ? null : ae,
    k = oe === void 0 ? 32 : oe,
    A = se !== void 0 && se,
    j = ce === void 0 ? 1 : ce,
    M = le !== void 0 && le,
    N = ue !== void 0 && ue,
    ve = fe !== void 0 && fe,
    xe = ne(),
    Se = f(),
    P = A && !Se,
    F = ie() === "dark",
    I = st(),
    Ce = J1($, 0, I) ? K1($, 0, I, () => I ?? new rt()) : $[1],
    [we] = t(Ce),
    L = I ?? we,
    Te = n(null),
    Ee = J1($, 2, me)
      ? K1($, 2, me, (e) => {
          me?.(e);
        })
      : $[3],
    De = u(Ee),
    Oe = n(null),
    ke = n(I !== null),
    R = n(!0),
    z = re(g()),
    B = J2($, 4, k, z) ? K2($, 4, k, z, ut(k, z)) : $[6],
    { head: V, face: H } = J3($, 7, w, T, he)
      ? K3($, 7, w, T, he, be(w, T, he))
      : $[10],
    U = ye[r],
    Ae = d?.shape,
    je = d?.tint,
    Me = d?.accessory ?? null,
    W = J3($, 11, Me, Ae, je)
      ? K3(
          $,
          11,
          Me,
          Ae,
          je,
          Ae === void 0 || je === void 0
            ? void 0
            : { shape: Ae, tint: je, accessory: Me },
        )
      : $[14],
    G = n(!1),
    K,
    q;
  J5($, 15, j, L, H, U, V, P)
    ? ((K = () => {
        if (!P) {
          G.current = !1;
          return;
        }
        let e = G.current;
        (G.current = !0), L.show(U, j), L.setBaseHat(V, e);
        let t = L.staying("face");
        H === 0 ? t !== 0 && L.undress("face", e) : t !== H && L.wear(H, e);
      }),
      (q = [L, j, U, V, H, P]),
      K5($, 15, j, L, H, U, V, P, K, q))
    : ((K = $[21]), (q = $[22])),
    l(K, q);
  let Ne = n(O),
    J,
    Pe;
  J3($, 23, L, O, P)
    ? ((J = () => {
        O !== null &&
          O !== Ne.current &&
          ((Ne.current = O),
          P &&
            L.once(O.id, () => {
              bt(L, O);
            }));
      }),
      (Pe = [L, P, O]),
      K4($, 23, L, O, P, J, Pe))
    : ((J = $[26]), (Pe = $[27])),
    l(J, Pe);
  let Fe = J5(
      $,
      28,
      j,
      A,
      S,
      D,
      F,
      N,
      M,
      L,
      H,
      U,
      w,
      V,
      W,
      P,
      E,
      x,
      B,
      k,
      De,
      C,
    )
      ? K5(
          $,
          28,
          j,
          A,
          S,
          D,
          F,
          N,
          M,
          L,
          H,
          U,
          w,
          V,
          W,
          P,
          E,
          x,
          B,
          k,
          De,
          C,
          () => {
            let e = Te.current,
              t = {
                look: { character: S, tint: C, hat: w, line: W },
                seat: k,
                showsMarks: x ?? k >= _t,
                drawsSmallInFull: N,
                mascot: E,
                moves: A,
                closer: D,
              },
              n,
              r,
              i = !1,
              a,
              o,
              s = !1,
              c,
              l = _(e),
              u = P ? v(e) : null,
              d = u === null ? null : ht(u),
              f = 0,
              p = () => {
                (f = performance.now()), a?.();
              },
              m = () => {
                l.clearTimeout(n);
              },
              h = (r) => {
                let u = e?.getContext("2d") ?? null;
                if (u === null) return;
                let p,
                  h = (e) => {
                    u.canvas.width !== B &&
                      ((u.canvas.width = B), (u.canvas.height = B));
                    let t = !1;
                    try {
                      (p = e()), (t = r.paint(u, p, B, F));
                    } catch {}
                    let n = u.canvas.parentElement,
                      i = t ? "whole" : "never";
                    return (
                      n !== null &&
                        n.dataset.drawn !== i &&
                        (n.dataset.drawn = i),
                      t
                    );
                  },
                  g = () => {
                    if (p !== void 0) {
                      let e = { ...p };
                      h(() => e);
                    }
                  };
                c?.(),
                  u.canvas.addEventListener("contextrestored", g),
                  (c = () => {
                    u.canvas.removeEventListener("contextrestored", g);
                  });
                let _ = () => {
                    Oe.current?.rest?.(),
                      h(() => r.still(it(U, V, H, j), t)) && De(u.canvas);
                  },
                  v = () => {
                    if (i || (m(), (s = !1), !R.current || !y())) return;
                    let e = Oe.current ?? r.live();
                    Oe.current = e;
                    let a = performance.now();
                    (o === void 0 ||
                      !L.isSettled ||
                      a / 1e3 >= L.nextEventAt) &&
                      (o = L.step());
                    let c = o,
                      u = d === null ? void 0 : Math.max(d.lastMs(), f);
                    if (!h(() => e.drawing(c, t, a, u))) return;
                    let p = L.nextShowAt * 1e3;
                    if (
                      e.isAtRest?.() === !0 &&
                      p === 1 / 0 &&
                      !ee.isFocused()
                    ) {
                      s = !0;
                      return;
                    }
                    let g = Math.ceil(Math.min(e.nextChangeAtMs(), p) - a);
                    g < 1 / 0 && (n = l.setTimeout(v, Math.max(1, g)));
                  };
                P ? ((a = v), v()) : _();
              },
              g = () => {
                if (i) return;
                let e = _e();
                e === void 0
                  ? ge(M).then((e) => {
                      e !== null && !i && h(e);
                    })
                  : e !== null && h(e);
              },
              te = P
                ? b(() => {
                    y() && p();
                  })
                : void 0,
              ne = () => Oe.current?.stands?.() === !0,
              re = P
                ? ee.subscribe((e) => {
                    e && (s || ne()) && p();
                  })
                : void 0,
              ie = d?.add(() => {
                ne() && a?.();
              }),
              ae = typeof IntersectionObserver == "function";
            return (
              (ke.current || !ae) && g(),
              e !== null &&
                ae &&
                (P || !ke.current) &&
                ((r = new IntersectionObserver(
                  (e) => {
                    let t = R.current;
                    if (
                      ((R.current = e.at(-1)?.isIntersecting === !0),
                      ke.current)
                    )
                      R.current && !t && p();
                    else {
                      if (!e.some(St)) return;
                      (ke.current = !0), g();
                    }
                    P || r?.disconnect();
                  },
                  { rootMargin: "128px" },
                )),
                r.observe(e)),
              () => {
                (i = !0), r?.disconnect(), te?.(), re?.(), ie?.(), c?.(), m();
              }
            );
          },
        )
      : $[48],
    Ie = J5($, 49, j, A, S, D, F, N, M, L, H, O, U, w, V, W, P, E, x, B, k, C)
      ? K5($, 49, j, A, S, D, F, N, M, L, H, O, U, w, V, W, P, E, x, B, k, C, [
          L,
          P,
          B,
          S,
          C,
          w,
          W,
          F,
          x,
          k,
          U,
          V,
          H,
          j,
          N,
          E,
          A,
          D,
          O,
          M,
        ])
      : $[69];
  l(Fe, Ie);
  let Le = J5($, 70, i, ve, xe, r, pe)
      ? K5(
          $,
          70,
          i,
          ve,
          xe,
          r,
          pe,
          ve
            ? { "aria-hidden": !0 }
            : {
                role: "img",
                "aria-label":
                  pe ?? xe.formatMessage(vt[yt[r]], { agentName: i }),
              },
        )
      : $[75],
    Y = w ?? void 0,
    Re = J1($, 76, d) ? K1($, 76, d, d === void 0 ? void 0 : de(d)) : $[77],
    ze = T ?? void 0,
    X = E ?? void 0,
    Be = he ? "" : void 0,
    Ve = A ? "" : void 0,
    Z = J1($, 78, k) ? K1($, 78, k, { width: k, height: k }) : $[79],
    Q = J0($, 80)
      ? K0(
          $,
          80,
          c("canvas", {
            ref: Te,
            "aria-hidden": "true",
            className: "block size-full",
          }),
        )
      : $[80];
  return J5($, 81, Le, S, r, Y, Re, ze, X, Be, Ve, Z, C)
    ? K5(
        $,
        81,
        Le,
        S,
        r,
        Y,
        Re,
        ze,
        X,
        Be,
        Ve,
        Z,
        C,
        c("span", {
          ...Le,
          "data-part": "face",
          "data-state": r,
          "data-character": S,
          "data-tint": C,
          "data-hat": Y,
          "data-messages-line-look": Re,
          "data-prop": ze,
          "data-mascot": X,
          "data-sunglasses": Be,
          "data-animate": Ve,
          className: "inline-block shrink-0 align-middle",
          style: Z,
          children: Q,
        }),
      )
    : $[92];
}
function St(e) {
  return e.isIntersecting;
}
console.assert("__eap_only__");
var Ct = k(
  () =>
    e(
      () =>
        import(
          "./01d032c8df454ea633ef02d180db7d07e0f5a0022bf3435e-7F--UbdT.js"
        ).then((e) => e.AiboTaskTokenClayTile),
      __vite__mapDeps([0, 1]),
      import.meta.url,
    ),
  "messages_task_tile",
);
function wt() {
  return Ct.ask(!1);
}
function Tt() {
  return Ct.now();
}
console.assert("__eap_only__");
var Et = s(!1);
function Dt() {
  return o(Et);
}
function Ot() {
  return Tt() ?? null;
}
function kt(e) {
  let t = !1;
  return (
    E(),
    wt().then(() => {
      t || e();
    }),
    () => {
      t = !0;
    }
  );
}
function At() {
  return () => void 0;
}
function jt() {
  let $ = J9(3),
    e = Dt(),
    t = i(e ? kt : At, Ot);
  return J2($, 0, t, e)
    ? K2($, 0, t, e, e && t !== null ? (e) => a(t, e) : void 0)
    : $[2];
}
console.assert("__eap_only__");
var Mt = 28,
  Nt = 1.45;
function Pt(e) {
  let $ = J9(4),
    t = Dt(),
    n = jt();
  return J3($, 0, n, t, e)
    ? K3(
        $,
        0,
        n,
        t,
        e,
        n === void 0
          ? c(j, {
              glyph: e.glyph,
              tint: e.tint,
              size: e.size,
              isNeutral: e.isNeutral,
              isClayChosen: t,
            })
          : n(e),
      )
    : $[3];
}
function Ft(e) {
  let $ = J9(21),
    { look: t, size: r, state: i, isMatte: a, isNeutral: o, taskId: s } = e,
    l = r === void 0 ? Mt : r,
    u = a !== void 0 && a,
    d = o !== void 0 && o,
    f = n(null),
    p = t.wear.kind === "glyph" && !u ? i : void 0,
    m = t.wear.kind,
    g = u || void 0,
    _ = u && "opacity-70",
    v = J1($, 0, _)
      ? K1($, 0, _, h("relative flex shrink-0 items-center justify-center", _))
      : $[1],
    y = J1($, 2, l) ? K1($, 2, l, { width: l, height: l }) : $[3],
    b =
      J2($, 4, u, d) ||
      J1($, 6, t.tint) ||
      J1($, 7, t.wear.glyph) ||
      J1($, 8, t.wear.kind) ||
      J4($, 9, t.wear.look, l, i, s)
        ? I4(
            $,
            9,
            Z1(
              $,
              8,
              Z1(
                $,
                7,
                Z1(
                  $,
                  6,
                  Z2(
                    $,
                    4,
                    t.wear.kind === "mascot"
                      ? c("span", {
                          className:
                            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                          children: c(xt, {
                            state: "idle",
                            agentName: "",
                            ...ue({ ...t.wear.look, tint: t.tint }),
                            size: Math.round(l * Nt),
                            showMark: !1,
                            animate: !1,
                            closer: !0,
                            decorative: !0,
                          }),
                        })
                      : c(Pt, {
                          rootRef: f,
                          glyph: t.wear.glyph,
                          tint: t.tint,
                          size: l,
                          state: i,
                          isMatte: u,
                          isNeutral: d,
                          taskId: s,
                        }),
                    u,
                    d,
                  ),
                  t.tint,
                ),
                t.wear.glyph,
              ),
              t.wear.kind,
            ),
            t.wear.look,
            l,
            i,
            s,
          )
        : $[13];
  return J5($, 14, t.wear.kind, p, g, v, y, b)
    ? I5(
        $,
        14,
        c("span", {
          ref: f,
          "data-part": "token",
          "data-wear": m,
          "data-state": p,
          "data-matte": g,
          "aria-hidden": "true",
          className: v,
          style: y,
          children: b,
        }),
        t.wear.kind,
        p,
        g,
        v,
        y,
        b,
      )
    : $[20];
}
console.assert("__eap_only__");
var It = {
  checklist: {
    side: 355,
    filled: !0,
    d: [
      "m278 197 2 50 1 20v18l-4 10-5 4-7 3H70l-29 1h-8l-1-1h-4q-6-3-10-8l-3-6-1-1v-46c0-50 2-50 2-99V77l1-7 5-7 8-5h5l13-1 99-2 100-2h10l5 2 2 1 2 2 6 9v6l1 20v50c1 37-1 42-4 42s-5-5-5-42l-2-50V69h-1l-2-4-4-2h-7l-100 1-100 3H34l-1 1-4 2-3 3-1 4v5l1 9v50l-1 100v30l-1 10v2h1v2l1 3a10 10 0 0 0 8 4h136l70-1h24l4-3 2-2v-18l-1-20-2-50c-2-37 1-35 4-35s6-3 7 34z",
      "m333 98-27 17-28 17-27 18-27 17-28 17-27 17-13 9-3 2h-1l-1 1-3 1a10 10 0 0 1-9-4l-1-1-2-2-21-25-22-24c-8-9-7-11-5-13s5-2 13 7c10 12 11 11 22 23l20 25 3 4h1l1-1 3-1 13-9c14-8 13-9 27-18l28-17 27-17 27-17c14-9 13-10 27-18l27-18c10-6 11-3 13-1s3 5-7 11z",
    ],
  },
  calendar: {
    side: 393,
    filled: !1,
    d: [
      "M24 65h14l15-1h71l14 1h43l15 1h57l14-1h43l14-1h43v43l1 14v43l1 14v86l-1 15v100h-71l-14-1h-85l-14-1H42l-14 1v-29l-1-14v-29l-1-14v-14l-1-14v-14l-1-15v-28l-1-14v-14l1-15z",
      "M27 155h57l14 1h28l15-1 14-1 14-1h14l14 1 15 1 14 1h14l14-1h113M110 14v3l2 14 1 14v15l1 14 2 14 1 14v2m167-84v18l-4 15 2 16-3 16-1 16v3",
    ],
  },
  email: {
    side: 392,
    filled: !1,
    d: [
      "M18 67h360v158l-1 14v29l-1 15v28l-1 15h-14l-15-1h-28l-15-1h-29l-14-1h-29l-14-1h-58l-15 1H29l-14-1-1-14v-71l1-14v-14l1-15v-14l1-14v-14l1-14z",
      "m22 71 11 8 12 8 11 9 11 8 11 9 11 9 11 9 11 9 11 8 11 9 11 8 11 9 11 9 12 8 11 9 11 8 12-9 11-9 12-9 11-10 11-10 12-9 12-9 12-8 12-9 11-9 12-9 11-10 12-9 12-9 11-9",
    ],
  },
  dollarSign: {
    side: 402,
    filled: !1,
    d: [
      "m141 26 21-7 21-4 21-1 22 1 21 4 21 7 20 8 19 12 17 13 15 15 13 17 12 19 9 19 7 20 4 21 2 22v21l-3 21-5 21-7 20-10 19-11 17-14 17-15 15-17 13-18 11-20 9-20 6-21 4-22 2-21-1-21-3-21-6-20-8-19-11-17-12-16-15-14-16-12-18-10-19-8-20-6-20-3-22v-21l2-22 4-21 7-20 9-20 12-18 13-16 15-15 17-14 18-11 20-9 20-6 21-5",
      "m265 150-4-10-7-8-8-7-10-5-12-4-12-1-12-1-12 2-11 3-11 4-9 6-7 8-5 9-3 11-1 1 1 10 5 8 7 6 10 6 11 5 13 5 13 5 13 5 13 5 12 5 10 6 8 8 5 9 2 10-1 1-1 11-5 9-7 8-8 6-11 4-12 3-12 1-13-1-13-2-11-4-11-5-10-7-7-9-6-11",
      "M201 67v31l1 14v14l1 14-1 14-1 14-1 14v28l1 14 1 14 1 14v14l-1 14v14l-1 14v31",
    ],
  },
  chart: {
    side: 454,
    filled: !0,
    d: [
      "M16 266v-42l1-3v-5l1-1v-1h1v-1h1l1-1h3l2-1h33l11 1 13-1 12-1 12 1 2 1h3l1 1h2l1 1h1v1l1 2v2l1 4v25l-1 24-1 24 1 24v12l1 12-1 24v16l-1 1v2h-1v1l-1 1h-1l-1 1h-4l-16 1-12 1H57l-12 1-12-1H23l-1-1h-2v-1l-2-1-1-1v-2l-1-3v-3l-1-7v-25l-1-24v-24l1-12v-12l1-24 1-24c1-10 3-10 6-10s6 1 5 10l-1 24-1 24v84l1 12v12h-2l-1 1h-1v1l1-2 1-2v-1h1l7 1h12l12-1 24-2 12 1h18v3l1 1h-1l-1-1h-3v-15l1-24-1-12v-12l-1-24 2-24c1-12-1-12-1-25l1-7v-16l-1-4h1l1-1h3l1-1v1h-1v1l-1 1v2h-5l-11-1H30l-4 1h-1v-2l-1-1v-1l-1-1q1 0 0 0h1l1 1 2 1h1v10l-1 12-1 24c0 9-2 9-5 9s-5 0-5-9m151-3v-89l1-24 1-1v-2l1-1 1-1h1v-1h7l9-1h33l2 1h41l2 1h4l1 1h1l1 1 1 1v1l1 2v8l-1 6v45l1 30-1 30v29l-1 30c-1 15 1 15 1 30l-2 26-1 3v2h-1v1h-1l-1 1v1h-5l-2 1h-2l-4-1h-6l-15-1h-5l-4 1h-21l-21-1-5-1h-2l-2-1h-1v-1l-2-2h-1v-3h-1v-8l-1-6-1-15-1-30c-1-15 1-15 1-30v-59c0-12 2-12 5-12s6 0 6 11v30l-1 30 1 30 1 30v14l1 10v4h-3v1h-2 1v-1l1-1v-1l1-1h2l9 1 15 1h59l1 1v2l1 1v1-1h-1l-3-1v-11l1-15 1-30-1-29 2-30-1-30v-87h2v-1h4-1v2l-1 1v1h-29l-14-1h-15l-15-1h-19v-4h-1v-1 1h2l1 1h1q1 0 0 0v8l1 15-1 30v29l-1 30c1 12-1 12-5 13s-5-1-5-13m158-60 1-94V68l2-3 3-1h3l5-1h31l8-1h8l43-1h3l1 1h2v1h1l1 1v2h1v96l1 47v56l1 10v105l-1 1v1l-1 1-1 1h-1l-1 1h-2l-8 1h-9l-28-1-19 1h-37l-1-1h-2l-1-1-1-1v-2h-1v-10l1-28v-58l-1-9v-94c1-35 2-40 5-40s6 5 5 40l1 66v75l-1 19v37h-2l-2 1v-1h1v-2l1-1h97l1-1v1h1v1l1 1v1h-1l-1-1h-2v-27l-1-85v-9l-1-48v-94l1-28-1-10v-8h1v-1h2l1-1-1 1v1l-1 1v1h-1l-5-1h-10l-27 1-5 1h-24l-22 2h-2l-1-1v-2h-1v-1q0-1 0 0h4v10l1 28v95c0 35-3 33-6 33s-6 2-6-33",
    ],
  },
  globe: {
    side: 406,
    filled: !1,
    d: [
      "m143 26 21-5 21-3 22-1 22 2 21 4 21 6 20 9 18 11 18 13 15 16 14 17 12 18 10 20 7 21 5 21 2 22-1 22-3 22-5 21-9 21-10 19-13 18-15 16-16 15-18 12-20 10-20 8-21 6-22 3h-22l-22-2-21-4-21-7-20-9-18-12-18-13-15-16-14-17-11-19-10-20-7-21-4-21-2-22 1-22 3-22 6-21 9-21 11-19 12-18 15-16 17-14 18-12 20-10 20-8 22-5 21-3",
      "m203 17 10 1 9 3 10 7 9 8 8 11 8 13 7 15 7 17 5 18 4 20 4 20 2 22 1 22v22l-1 21-3 22-3 20-4 20-6 18-6 17-8 15-8 13-8 11-9 8-10 6-9 4-10 1-10-2-10-4-9-7-9-9-9-11-7-14-7-16-6-17-5-19-5-20-3-20-2-22v-43l1-22 3-21 3-20 5-20 6-18 6-16 7-15 8-13 9-10 9-9 9-6 10-3 10-1 10 2 9 4",
      "M17 203h172l14-1h14l15 1h43l14 1 14-1h86",
    ],
  },
  mapPin: {
    side: 458,
    filled: !0,
    d: [
      "M209 26c-12 1-17 2-23 4l-4 1h-3l-2 1-13 5-12 5-7 5-4 3-4 3-9 9-5 6-4 4-3 4-2 4-11 20-3 7-3 6-2 4-1 5-2 4-1 4-2 6-1 4-1 4v4l-1 3v20l6 40 7 22 11 21 11 21 12 20 13 20 26 39c14 20 15 19 28 39l13 19 6 8 8 11 1 1h1v-1l6-7 14-19 26-39 26-40 27-40 8-11a190 190 0 0 0 24-50l3-9 2-6 2-7v-2l1-2 1-3 1-6v-5l1-4 1-5v-26l-1-6-1-9-1-2v-2l-1-3-1-2-3-13a150 150 0 0 0-16-34l-2-3-3-3-9-8-8-5-8-6-3-1-2-2-7-4-20-12q-6-4-21-7l-23-3h-15l-4 1h-10l-4 1-6-1q-4-1-3-3-1-2 2-5l5-2 5-1h6l4-1h21l24 3 24 8 21 13 6 4 2 1 1 1 2 1 9 5 8 5 12 10 3 4 2 3 13 23 9 28 1 5 1 5 1 10 1 6v23l-1 9-1 5v5l-1 7-1 3-1 5-1 4-1 3-2 6-7 19-6 13-16 30-3 5-5 7-26 39-27 39c-13 20-12 21-26 40l-14 20-7 7-1 1-2 2q-2 3-5 3h-2l-3-1-1-1-2-2-1-1-1-1-9-11-6-8-14-20-27-38-25-40-14-20-13-20-7-13-2-4-2-4-11-22-1-4-2-4a160 160 0 0 1-11-54v-20l1-6 1-4 1-4v-4l1-4 2-6 1-5 1-5 2-4 1-5 3-6 3-8 12-21 2-4 4-4 4-5 5-7 11-10 4-3 4-3 4-2 5-3 13-7 14-4 3-1 2-1 5-1 24-3h17q3 1 3 4 1 4-3 3z",
      "M175 145v-2l1-2 1-3 3-5 2-3 2-2 1-2 1-1 2-2 3-3 11-7a44 44 0 0 1 22-4l14 2 6 2 19 9a44 44 0 0 1 15 16l5 12 1 5v25a50 50 0 0 1-15 27l-9 8-7 4-13 5h-4a66 66 0 0 1-38-8 53 53 0 0 1-22-26l-4-17a72 72 0 0 1 5-33 45 45 0 0 1 13-17l8-5 6-1 4 2q1 2-2 4l-4 3-6 4a31 31 0 0 0-10 14l-2 7a63 63 0 0 0 1 35 45 45 0 0 0 35 28h18l11-4a53 53 0 0 0 21-22l4-10v-21l-1-4a43 43 0 0 0-10-18l-11-9-10-4-7-1-12-2-16 3-9 6-2 2-1 2-1 1-1 1-1 2-2 3-2 4-1 3-1 1v2l-3 7-2 4h-5q-2 1-3-2v-4q-1-4 2-9z",
    ],
  },
  home: {
    side: 415,
    filled: !1,
    d: [
      "m14 203 1-1 11-10 11-9 11-10 10-9 11-10 11-9 10-10 10-10 11-10 10-10 11-9 11-9 11-10 11-9 10-10 11-9 11-10 10-9 11 9 11 10 10 9 11 10 10 10 11 10 10 10 11 9 11 9 11 9 11 10 11 9 11 9 10 10 11 10 10 10 11 9 10 10 2 1",
      "M51 173v71l1 14v85l-1 14v28h15l14-1h15l14-1h44l14-1 1-15 1-15 1-15 1-15 1-14v-15l1-15v-15h15l14 1h15l14-1h14v88l-1 14-1 15h45l15 1 14 1 15 1h30l1-14v-14l1-14v-84l-1-14v-70",
    ],
  },
  box: {
    side: 404,
    filled: !1,
    d: [
      "m207 14 13 7 13 7 13 7 13 7 13 7 14 6 13 7 13 7 13 7 13 6 14 7 13 7 13 6v189l-1 14-13 7-13 7-13 7-14 6-13 7-14 6-13 6-14 7-13 6-14 6-13 7-13 6-14 7-12-6-13-7-12-7-13-6-13-7-12-6-13-6-13-7-13-6-12-6-13-6-13-7-12-6-13-7v-56l1-15v-28l1-14v-85l13-6 13-6 13-6 13-6 12-7 13-6 13-7 12-7 13-6 12-7 13-6 13-6 13-6z",
      "m30 103 14 7 13 7 13 7 13 7 13 6 14 7 13 6 14 7 13 6 13 7 14 7 13 6 13 7 14-7 13-6 13-7 13-7 14-6 13-6 14-7 13-6 13-7 13-8 13-7 14-6 13-7m-173 87v42l1 15-1 14v14l1 14-1 14v85",
    ],
  },
  slides: {
    side: 454,
    filled: !0,
    d: [
      "m367 76-53-2-16-1-6-1-4 1h-80l-53-1-53 1-53-1-22 1h-1v8l-1 39-1 26 1 31-3 1h-1l3-3 1 2 1 1v5l1 43 1 26-1 53-1 24v2h1v1h6l11 1 26 1 10 1h16l54-1 53-1h53l26-1h27l53 1h18l1-1v-1l-1-22 1-53 1-53V96q0-14 2-18 1-3 3-3 3-1 5 3t2 18l-1 54-1 53v138l-3 1-1 1h-1l-2 1h-23l-53-1h-53l-53 1c-27 0-26 2-53 2H95l-9-1h-6l-47-2H23l-6-3-1-3-1-1v-7l1-24v-53l-1-53v-19h4v-1h1l-4 4-1-2v-1l-1-1V93l1-13V70l1-5 5-3 3-1h24l54 1h53l53-1h85l6 1 15 1 53 3 16 2h2l2 1 2 3v2l-2 1h-3v1z",
      "m171 153 24 11 4 2 6 3 17 7 17 8 29 14v1h1l1 1 2 2 2 2v3q1 6-5 9l-1 1-1 1-2 2-7 4-17 9-17 8-7 3-9 5-17 9-16 9-4 2-2 1-1 1h-2l-2 2h-8l-1-1v-1l-2-3v-4l-1-2v-2l-1-13v-19l1-19v-37c0-14 2-16 5-16s4 2 5 16v37l-1 19v18l1 17h1l1-1h1l1-1 5-2 16-10 16-9 10-5 7-3 16-8 23-13 2-1v-1h1l1-1v-1h-1l-10-6-17-8-17-7-17-7-6-3-4-2-7-3-7-3-10-4-9-4v-2l-1-2h1-3l-1-1 1-1 1-2h1v-1h6z",
      "M397 115h16l15 1h7v1h1l1 1h1v1l1 2v10l1 15v30l-1 31 1 30-1 30v31l-1 30v44l1 5v10l-2 1-2 1-1 1h-36l-31-1h-33l-12 1h-15l-31 1h-91l-30 2h-15l-16-1-30-2-15-1h-7l-3-1-3-1-3-3-1-2v-19l2-15 1-9v-1l3-2 2-1 1 1 2 1 2 12-1 15-1 6v8h6l15 1 31 1 16 1h14l30-1h61l30-1 30-1 16 1h15l30-1 31 1h29v-21l1-30v-30l-1-31 1-30 1-30-1-31v-50h-1l-15-1h-15c-12-1-12-3-12-6s0-5 12-4z",
    ],
  },
  folder: {
    side: 392,
    filled: !1,
    d: [
      "M14 130h58l14-1h114l14 1h14l10-15 10-13 10-14h45l15 1h15l15-1h15l15-1v15l-1 14v42l-1 14v57l1 14-1 14v43l-1 14v14l-1 14v14h-57l-15-1h-28l-15-1h-14l-14-1h-29l-14-1h-72l-14 1H59l-14-1H16v-15l-1-15v-15l-1-14v-74l1-15v-59z",
      "m64 128-1-15-1-15V83l1-15V53l-2-15 15 1 15-1 15-1 15-1h15l15 1h75l15-1v31l1 15v30",
    ],
  },
  edit: {
    side: 427,
    filled: !0,
    d: [
      "m78 353 29-10 20-7 19-7 6-2 1-1 1-1 1-1 1-1 12-11 36-37 36-37 70-74 21-22 34-42 7-14 1-7-1-7-5-10-9-12-3-3-15-14-11-6-6-2-8-1q-9 2-14 5l-11 7a162 162 0 0 0-30 28l-9 10-11 12-70 76-35 38-34 38-21 25-1 1v1l-1 2-3 12-15 49-13 39v1h-1v1l-1-1-1-1-1-7q-1-8 8-35l14-49 3-10 1-2v-3l2-2v-2l2-2 20-24 35-38 35-37 70-76 11-12 9-10 31-30 11-8 2-1 2-1 4-1 3-1 2-1 6-1a36 36 0 0 1 19 3l13 8 16 14 3 4 2 2 2 2 7 9q4 5 6 13l2 9-2 11-8 16q-3 7-8 11l-27 32-21 22-71 75-35 37-36 37-14 13-1 1-1 1-1 1h-1l-2 1-6 3-19 7-49 18q-26 8-32 8l-4-2v-3 1-1l1-1v-1l2-1z",
      "m149 331-7-8-7-8-9-7c-3-4-4-3-8-7l-7-8-8-7-9-7-8-7-8-6q-4-4-1-7 3-4 7-1l9 6 8 8 8 7 9 6 4 4 4 4 8 8 7 7 9 8 7 7q3 4-1 7-3 4-7 1ZM260 63l7 9 8 8c4 5 5 4 9 8l9 8 7 9 9 8 9 8c5 3 4 4 9 8l9 7q4 4 0 7-2 3-7 1l-9-7c-5-4-4-5-8-9l-9-8-10-7c-4-4-3-5-8-9l-8-9-9-8-8-8-9-8q-3-5 2-7 3-4 7-1Zm49 303 1-1 1-1v-1h1v-1h1v-1h5l1 1 1 1 1 1v5h-1v1l-1 1-1 1-1 1-1 2-2 1-2 2-1 2-2 2-2 1-1 2-2 1-1 1-1 2-2 1-1 1-1 1-1 1h-1l-1 1-2 1-1 1h-1l-1 1-1 1h-1l-1 1h-1v1h-1l-1 1h-1l-1 1-2 1h-1l-1 1h-1l-1 1h-1l-2 1h-1l-2 1h-1l-2 1h-2l-1 1h-2l-2 1h-5l-2 1h-9l-2-1h-5l-1-1h-3l-1-1h-1l-1-1h-1l-1-1h-1v-1h-1l-1-1h-1v-1l-1-1-1-1v-1h-1v-1l-1-1v-1l-1-1v-1l-1-1v-1l-1-2v-3l-1-2v-18h1v-5h1v-1h-1v1h-1v1l-1 1-1 1v1h-1v1h-1v1h-1v1h-1v1h-1l-1 1v1h-1l-1 1v1l-1 1-1 1h-1l-1 1-1 1v1l-1 1h-1l-1 1-1 1h-1v1h-1v1h-1v1h-1l-1 1h-1l-1 1-1 1h-1l-1 1-1 1-2 1-1 1-2 1-1 1-2 1-2 1-1 1-2 1h-2l-2 1-2 1-1 1h-2l-1 1-2 1h-1l-1 1h-3l-1 1h-1l-1 1h-2l-2 1h-2l-1 1h-3l-1 1h-4l-1 1h-4l-2 1h-8l-2 1h-11l-2-1h-6l-1-1h-2l-1-1h-1l-1-1-1-1v-3h1v-1h1l1-1h24l2-1h6l1-1h4l1-1h4l1-1h3l1-1h2l1-1h2l1-1h2l1-1h1l1-1h2l1-1h1l2-1h1l2-1 1-1 2-1 2-1 1-1h2l2-1 1-1 1-1 2-1 1-1h1l1-1 1-1h1l1-1h1v-1h1l1-1 1-1h1v-1h1v-1h1l1-1 1-1 1-1 1-1h1l1-1v-1l1-1 1-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1l1-1 1-1v-1h1v-1h1v-1h1v-1h1v-1l1-1 1-1v-1h1l1-1v-1h1v-2h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h2v-1h3v-1h1v1h1v1h1v10l-1 1v2h-1v2h-1v3h-1v4h-1v4l-1 1v6h-1v11l1 1v3l1 1v3h1v2h1v1l1 1v1h1l1 1 1 1h1v1h4v1h19l2-1h3l2-1h1l2-1h1l1-1h1l1-1h1l1-1h1l1-1h2l1-1h1l1-1h1l1-1 1-1 1-1h1l1-1h1l1-1 1-1 1-1h1l1-1 1-1 1-1 2-1 1-1 1-2 2-1 1-1 2-2 2-2 1-2 2-1z",
    ],
  },
  search: {
    side: 459,
    filled: !0,
    d: [
      "m55 62-3 4-1 1-1 2-3 5-2 5-2 4-2 4v3l-1 2-1 3-1 6-1 2v4l-1 4v5l-1 4v16l1 9v4l1 4 1 3v3l1 6 5 13 1 1v2l3 5 4 5 2 3 1 2 1 1 3 5 2 3 2 3 2 2 1 2 2 2 3 3 2 2 2 1 3 3 4 2 5 3 2 1 3 1 8 3 8 3 6 2 14 3 5 1h3l6 1h6l4-1h5l14-4 2-1 3-1 4-1 2-1 2-1 5-2 3-1 6-3 5-3 3-2 2-1 2-1 4-3 3-2 2-1 1-1 2-2 10-10 1-2 1-2 3-3 1-2 2-3 1-2 1-3 4-8v-2l1-2 1-2v-2l1-6 1-14v-15l-2-15-2-14q0-4-4-13l-7-14-7-13-8-11-10-11-10-6-2-1-3-1-2-1-4-1-4-2-14-3h-6l-4-1h-25l-9 1-4 1-4 1-3 1-3 1-6 1-3 1-5 2-4 2-4 1-5 3-6 2-3 2-4 3-10 4q-2 0-3-2-2-1-1-4-1-3 8-8l4-2 4-2 6-3 5-3 4-1 5-2 5-2 4-1 6-2 3-1h3l4-1 5-1 10-1 6-1 16-1h5l4 1h6l16 4 5 1 4 2 3 1 3 2 3 1 3 2 15 12 2 3 2 2 10 13 7 14 6 14 1 3 1 2 2 4 2 6 3 16 1 15 1 16v3l-1 2v4l-1 7-1 3-1 3-1 4-1 3-1 2-6 15-1 3-4 7-1 2-2 2q-7 9-12 11l-2 2-1 1-2 1-3 3-5 3-2 1-2 2-3 2-6 3-6 3-3 2-5 2-5 2-4 1-3 1-3 1-25 5h-4l-3-1h-6l-4-1h-5l-16-3-6-2-4-1-5-2-9-4-3-1-2-1-16-11-2-2-3-3-3-2-2-2-4-5-2-4-3-4-3-5-2-3-3-6-3-6-1-1v-2l-2-5-3-9-2-6-2-6-2-10-1-9v-13l1-4v-5l1-6v-4l1-3v-2l1-1 1-6 1-4 1-3 1-2 2-5 2-4 3-6 3-5 1-2 2-2 3-4 3-4 4-3 2-1 4 2v5l-1 1v1l-2 2z",
      "m247 234 10-10 5-5 4-3v-1l2-2 2-1 1-1h1l3-1 4 2 2 1 2 2 1 2 2 2 9 11c5 5 6 4 10 10l9 11c4 6 5 5 10 10l10 10 9 11c4 6 5 5 10 10l10 10 9 11 9 11 10 10 9 11 9 11c5 5 6 4 11 10l9 11 1 1 2 2 2 2v1l1 1 1 4v3l-3 4-2 1v1h-1l-1 1-2 2-6 5-10 10-11 9-10 10-5 5-2 2-6 4-6-1-4-3-2-3-3-3-9-10-9-11-10-11-10-10-9-11-9-11c-5-5-4-6-8-11l-10-11-10-10-9-11-9-11-9-11-9-10-9-11-10-11-7-11 2-5 1-1 5-4 2-2 6-4 5-5 1-1v-1l-4-4-10-10q-5-5-1-8c4-3 4-3 8 0l10 11 13 13-1 1-6 5-2 1-1 1v1l-6 4-5 4-3 2-1 1h-1v1l1 1h1l2 3 9 10 9 12 9 10 9 11 9 11 10 11 9 10 10 11 9 10 9 11 9 11 9 11 10 10 9 11 9 11 4 4v1h1l2-1 1-1 5-5 10-10 10-10 10-10 10-8v-2h-1l-1-2-10-11-10-10-9-10-9-12-10-10-10-10-9-11-10-10-9-11-10-10-10-10-9-11-10-10c-4-5-3-6-8-11l-10-11-1-2-1-1h-1l-3 3-2 2-5 5-11 9q-5 4-7-1-5-2 0-7z",
    ],
  },
};
console.assert("__eap_only__");
var Lt = 26,
  Rt = 16;
function zt(e) {
  let $ = J9(15),
    { line: t, ink: n, size: i, share: a, children: o } = e,
    s = t.side / a,
    l = (s - t.side) / 2,
    u = `${-l} ${-l} ${s} ${s}`,
    d = J1($, 0, i) ? K1($, 0, i, { width: i, height: i }) : $[1],
    f = t.filled ? n : "none",
    p = t.filled ? Rt : Lt,
    m = t.filled ? void 0 : "round",
    h = J1($, 2, t.d) ? I1($, 2, t.d.map(Bt), t.d) : $[3],
    g = J5($, 4, n, f, p, m, h)
      ? K5(
          $,
          4,
          n,
          f,
          p,
          m,
          h,
          c("g", {
            fill: f,
            stroke: n,
            strokeWidth: p,
            strokeLinecap: m,
            strokeLinejoin: "round",
            children: h,
          }),
        )
      : $[9];
  return J4($, 10, o, u, d, g)
    ? K4(
        $,
        10,
        o,
        u,
        d,
        g,
        r("svg", {
          "data-part": "channel-pictogram",
          "aria-hidden": "true",
          viewBox: u,
          className: "block max-w-full shrink-0",
          style: d,
          children: [o, g],
        }),
      )
    : $[14];
}
function Bt(e) {
  return c("path", { d: e }, e);
}
console.assert("__eap_only__");
var Vt = {
  checklist: ["M277 296H20V58h242z"],
  calendar: ["M25 67h344v88H25Z"],
  email: ["M18 67h360L198 209Z"],
  dollarSign: ["M15 202a186 186 0 1 0 372 0 186 186 0 1 0-372 0"],
  chart: ["M430 67h-95v312h95zM113 218H23v167h90zm153-68h-90v235h90z"],
  globe: ["M119 203a84 186 0 1 0 168 0 84 186 0 1 0-168 0"],
  mapPin: [
    "M374 127c-5-21-12-31-22-45q-15-22-35-35c-25-17-46-30-98-26l9-1c-37 1-97 12-128 62q-18 32-20 81-1 32 13 69 21 52 53 100c26 38 74 107 82 107a834 834 0 0 0 142-226c9-28 10-61 4-86m-147 93a52 52 0 1 1 0-105 52 52 0 0 1 0 105",
  ],
  home: ["M51 170 207 32l156 138v212H245V266h-76v116H51Z"],
  box: ["m203 16 175 86-175 88-175-88Z"],
  slides: [
    "m387 338 1-219 46 3v41h1v225H114v-2l-47-4 2-43z",
    "M160 156s-2 5-3 33 1 74 2 80l60-31c17-9 50-30 50-30s-25-17-62-33z",
  ],
  folder: ["M14 130h214l30-42h116v267H14Z"],
  edit: [
    "m61 308 42 41-51 18q-5 0-5-5zM253 64l40 41c16 17 44 39 44 39s42-45 42-63c0-9 0-18-22-39s-27-25-44-21c-32 6-60 43-60 43",
  ],
  search: ["M142 246a113 113 0 1 0 0-226 113 113 0 0 0 0 226"],
  heart: [
    "M182 340C52 248-10 158 22 78 52 6 154 6 182 90 210 6 312 6 342 78c32 80-30 170-160 262",
  ],
  people: ["M14 355c0-122 230-122 230 0z"],
  briefcase: ["M15 214h360v134H15Z"],
  book: [
    "M24 142h27l-1 65-1 133v42s43 1 61-3c40-10 64-4 108 7 52 14 38 13 38 13s38-15 62-20c0 0 41-2 77-1l69 4-2-74c-1-21 1-169 1-169l25 1 1 83-1 150v45H20V223c0-27-2-69-1-76s5-4 5-4",
  ],
  plane: [
    "m21 118 22-31 176 7 1-1 4-4 6-6 8-7 8-9 9-8 10-9 8-7 9-7 6-5 6-3 6-3 6-2 5-1 5-1h5l4 1 4 1 4 2 3 2 3 4 2 4 1 5 1 6-1 6v6l-2 6-3 7-3 6-4 6-6 6-7 8-7 9-9 8-8 9-7 8-7 7-5 5-4 4-1 1 3 21h2v10l1 4 1 5 1 5 1 6 2 7 1 7 2 7 1 8 2 8 1 7 2 8 1 8 1 7 1 7 1 7v6l1 5-1 5v5l-1 3v1l-1 2-1 1v3h-3l1 5-29 28-16-33h-3v-2h-1v-2l-1-1-1-2v-1l-1-1-1-1v-1l-1-2v-1l-1-1v-1l-1-1-1-1v-2h-1v-1l-1-1v-7l-30-62-48 50 2 63-31 14-20-82-82-19h-1v-1l18-29 68-1 7-10h1v-1h1v-1h1v-1l1-1v-1h1v-1h1v-2h1v-1h1v-1l1-1v-1h1v-1h1v-1l1-1h1v-2h1v-1h2v-1h1v-1h1v-1h1v-1h1v-1h1v-1l1-1 1-1 1-1v-1l1-1v-1h1v-1l1-1v-1l1-1 1-1v-1l1-1v-1l1-1v-1h1v-2h1v-2l6-7z",
  ],
  car: ["m16 198 58-20h264l58 20v88H16Z"],
  food: [
    "m76 430-2-4-2-6v-5l1-7 2-7 3-7 4-7 5-6 13-17 18-24 16-20 2-2 131-139 2-3 2-5 1-5-3-15v-11l1-11 3-11 5-14 6-13 8-14 9-11 13-14 14-12 8-5 7-5 8-3 7-3 7-3 7-1 7-1h7l6 1 5 2 5 3 4 2 5 5 3 5 3 5 2 6 1 7 1 7v8l-1 7-2 8-2 8-3 9-4 8-9 16-11 16-10 11-10 9-11 9-13 8-11 5-11 3-9 1h-11l-4 1-5 2-3 3-109 160-1 3-48 61-8 9-6 6-6 5-6 3-5 2h-5l-6-1-6-3-5-4z",
  ],
  bag: [
    "M219 19c40 0 72 22 72 70v91l-33-2-2-84c-1-26-16-41-37-41s-38 16-38 42l-1 85h-36l1-93-1 2c1-47 35-70 75-70",
  ],
  gift: ["M222 118H58v153h164zm166 156H224v154h164z"],
  sprout: [
    "M227 272c3 11 3-125-111-142-129-19-126 98-5 81 59-4 102-6 116 61m3-78c-2 11-3-125 112-142 128-19 125 98 4 81-59-4-102-6-116 61",
  ],
  music: [
    "M121 417a50 50 0 1 0 0-100 50 50 0 0 0 0 100m194-80a50 50 0 1 0 0-100 50 50 0 0 0 0 100",
  ],
};
console.assert("__eap_only__");
var Ht = {
  heart: {
    side: 365,
    filled: !1,
    d: [
      "m183 340-27-20-25-20-22-20-21-19-18-19-16-19-13-19-11-19-8-18-5-18-3-18v-18l3-18 6-17 7-15 10-12 10-10 12-8 13-5 14-3h14l13 2 14 4 13 7 12 9 11 12 9 14 8 17 7-17 9-14 10-12 12-9 13-7 13-4 14-2 14 1 14 3 13 5 12 8 11 10 10 12 8 14 5 17 3 17v18l-4 18-5 18-9 19-10 19-14 19-15 19-18 20-20 19-22 20-25 19z",
    ],
  },
  people: {
    side: 403,
    filled: !1,
    d: [
      "m108 50 7-2 8-2h7l7 1 7 2 7 3 7 3 5 4 6 5 4 5 4 6 4 6 3 6 2 6 2 7 1 7v14l-1 7-2 7-2 6-4 7-4 5-5 6-6 4-6 4-7 3-7 2-7 1-7 1-7-1-7-1-7-3-6-3-6-3-6-4-5-5-5-5-4-6-4-6-3-6-2-7-2-6v-15l1-7 2-7 3-6 3-7 5-5 5-5 5-5 6-4 7-3 7-2 6-1M14 355l4-25 9-21 14-16 19-13 21-9 23-6 24-1 25 2 24 5 22 9 18 13 15 16 9 21 3 24m30-273 5-2 6-1h12l5 1 6 2 5 3 5 3 5 3 4 4 4 5 3 5 2 5 2 5 1 6 1 6-1 5v6l-2 6-2 5-2 5-3 5-4 4-4 4-4 3-5 3-5 3-6 2-5 1-6 1h-6l-5-1-6-1-5-2-6-3-4-3-5-4-4-4-3-5-3-5-2-6-2-5-1-6v-6l1-6 1-6 2-5 3-5 3-5 3-4 4-4 5-4 5-3 5-2 5-2 6-1m0 154 14 1 13 2 12 4 11 6 10 6 9 8 8 9 7 9 7 11 5 11 5 13 3 12 2 14 1 14",
      "M14 355h43l15-1h14l14-1 15 1 14 1h15l14 1h43l14-1h58l14-1h58l14 1h29",
    ],
  },
  briefcase: {
    side: 392,
    filled: !1,
    d: [
      "m14 109 14 1h201l14-1h58l14 1h57l1 15v15l1 15v103l1 15v14l1 15v15l1 15 1 14H262l-14 1H104l-15-1H17v-44l-1-15v-74l-1-15v-74z",
      "M133 110V94l-1-16-1-16 1-16h60l15-1 15-1h31l1 16-1 17 1 17 3 16M17 214h42l15 1 14-1h28l15-1 14 1 14 1h29l14-1 14-1h14l14-1 15 1 14 1 14 1h29l14-1h43",
    ],
  },
  book: {
    side: 509,
    filled: !0,
    d: [
      "m84 374 61-1h24l17 2h5l2 1h2l5 1 3 1 42 14 5 2h1v-1l1-21-1-51-1-50v-30l-1-21 1-34v-67h-1v-1h-1l-12-8-26-12-4-1-2-1h-2l-7-1-34-1-103 3v90l-4 67v85c0 37-2 43-5 43s-5-5-5-43l-1-51v-27l1-7v-17l3-50 1-10V98l1-7v-1l1-1h1l1-1 1-1h6l51-2 94 1h2l3 1 4 1 16 6 12 7 13 8 1 1 1 1 4 3v7l1 17v40l-1 8v84l1 51v79l-1 1v2l-1 1h-1l-2 1h-4l-5-2-46-15h-4l-2-1h-2l-2-1h-2l-4-1-16-1h-34l-51 2c-37 1-35-2-35-5 0-2-3-5 35-7z",
      "m428 386-50-3h-34l-16 2-7 1-5 1-42 13-8 3h-1l-2 1-2 1h-6l-1-1-1-1-1-3v-28l-1-101 1-31v-20l-1-34v-12l-1-5 2-43 1-12 3-3h1l1-1 14-9 27-12 5-1 2-1h3l8-1 34-2a1119 1119 0 0 1 102 2h3l4 1h1l1 1 1 1 1 1v1l1 2v93l2 51 1 17v7l1 6v72c0 37-2 43-5 43-3-1-5-6-5-43v-51l-1-20v-13l-1-17-2-51V96h-2l-51-2-71 1-13 1-7 1h-2l-2 1-4 1a125 125 0 0 0-35 16l-3 3-1 1h-1v8l-1 11-1 31v8l1 8v55l-1 30v124h2l7-3 46-15 3-1 7-1 18-1 7-1h27l51 2c37 2 35 5 35 8 0 2 2 5-36 4z",
      "M468 133h14l2 1h1l7 2v1h1v2h1v7l1 4v41l-1 16v19l-1 118v35l1 24v13l-2 5v1l-1 1-3 1h-9l-35 1-20-1h-39l-59 1a2344 2344 0 0 1-137-1H23l-3-1h-2l-1-1v-1 1l-1-1v-2l-1-1v-95l1-1v-70l-1-58-1-22v-29l1-4 2-2v-1h1l2-1h7l14-1h6v1l1-1v-2l2-13 3-4q2 0 3 5l1 12v5l-1 7H27l-2 1h-1v26l1 23 1 58v70l-1 2v4l-1 42 1 35v9h6l59 1 59-1h335v-34l-1-16v-19l1-118v-36l-1-35v-11h-26v-7l-1-5c-3-43 1-41 4-41s5-3 8 41z",
    ],
  },
  plane: {
    side: 366,
    filled: !0,
    d: [
      "M16 119v-1h-1v-2h1v-2l1-1v-1h1v-2h1v-1h1v-1l1-1v-1h1v-1l1-1v-1h1v-1l1-1 1-1 1-2 1-1 1-1 1-1 1-1v-1l1-1 1-1v-1h1v-1h1v-1l1-1v-1h1v-1h1v-1h1v-1h1v-1h3v-1h11l1 1h15v1h9l1 1h19l1 1h2l1-1h19l2 1h16l5 1h17l3 1h12l2 1h13l3 1h14l5 1h1v-1h1v-1h1v-1h1l1-1v-1h1v-1l1-1h1v-1l1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1h1v-1h1v-1h1l1-1h1v-1h2v-1h1l1-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1l1-1h1v-1l1-1v-1h1v-1h1v-1h1v-1l1-1h1v-1h1v-1l4-3 3-3 3-2 3-2 2-3 3-1 2-2 2-2 2-1 2-2 1-1h1l1-1 1-1h1l2-1 1-1 1-1h1l2-1v-1h2l1-1h1v-1h2l1-1h2l1-1h2l2-1h3l2-1h9l2 1h3l1 1h1l1 1h1l1 1h1l1 1h1l1 1h1v1h1v1h1v1h1v1h1l1 1v1h1v1h1v1h1v2h1v1l1 1 1 2v1l1 2v3l1 1v11h-1v4l-1 1v3l-1 1v1l-1 1v2l-1 2v1l-1 1-1 2-1 2-1 2-1 2-1 2-1 2-1 1h-1v2l-1 1-1 1-1 2-1 1-1 1-1 1-1 1-1 1v1l-1 1-1 1-1 1-1 1v1l-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1v1h-1l-1 1-1 1v1h-1l-1 1-1 1-1 1-1 1-1 1v1h-1l-1 1-1 1-1 1-1 1v1h-1l-1 1-1 1-1 1v1h-1l-1 1-1 1-1 1-1 1-1 1v1h-1v1h-1l-1 1-1 1-1 1-1 1h-1v1h-1v1h-1l-1 1-1 1h-1v1l-1 1-1 1-1 1v1h-1v1h-1v1h-1v4h1v7h1v19l1 4 1 5 1 6 1 6 2 6 1 7 2 8 1 7 2 8 1 8 2 7 1 8 1 7v1l1 6v1l1 6v7l1 5-1 5v6l-1 3v1l-1 2h-1v11h-1v1h-1v1l-1 1v1h-1v1h-1l-1 1v1h-1v1h-1v1h-1l-1 1v1h-1v1l-1 1h-1v1h-1v1l-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1h-1l-1 1-1 1v1h-1l-1 1h-1v1h-1v1h-1l-1 1h-5l-1-1h-1v-1h-1v-1h-1v-1l-1-1v-1h-1v-2h-1v-1l-1-1v-1h-1v-2l-1-1v-1h-1v-2l-1-1v-2h-1v-2l-1-3-1-1v-1l-1-1v-2l-1-1v-1l-1-1v-2h-1v-2l-1-1v-1l-1-1v-1l-1-1v-1l-1-2-1-1v-1l-1-1v-1l-1-1-1-1v-1l-1-2v-1h-1v-2h-1v-2h-1v-2h-1v-2l-1-1v-2l-1-2v-1l-1-2-1-1v-2l-1-2-1-2v-2l-1-1v-1l-1-2-1-1v-1h-1v-1l-1-1v-1l-1-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1l-1-1v-1h-1v-1l-1-2v-1h-1v-1l-1-1v-1l-1-2v-1h-1v-2l-1-1v-2h-1v-2h-3v1h-1v1h-1v1h-1v1h-1v1l-3 2-3 3-2 2-2 2-2 2v1l-2 1-2 2-1 2-2 1-1 2-1 1-1 1-1 1-1 1v1h-1l-1 1v1l-1 1-1 1h-1v1l-1 1v1h-1v1h-1v1h-1v1l-1 1v1h1v22l1 3v37h-1v2h-1v1h-1v1h-1v1h-2v1h-2v1h-2v1h-2v1h-2v1h-1l-1 1h-1l-1 1h-2l-1 1h-1l-1 1h-1l-1 1h-2v1h-2l-1 1h-2l-1 1h-7v-1h-1v-1l-1-1v-1h-1v-3h-1v-2l-1-1v-2l-1-1v-2l-1-1v-1l-1-1v-3l-1-1v-3h-1v-4l-1-1v-5l-1-1v-13l-1-1v-6l-1-1v-3l-1-1v-3l-1-2v-1l-1-1v-4l-1-1v-1l-1-2v-2l-1-1v-2h-1v-2h-3l-2-1h-1l-2-1h-2l-1-1h-2l-2-1-2-1h-3l-2-1h-2l-2-1h-4l-2-1h-3l-2-1h-7l-1-1h-6v-1h-4l-1-1h-4l-2-1h-1l-2-1h-2l-2-1h-1v-1h-3v-1h-3v-1h-2v-1h-1l-1-1v-1h-1v-1h-1v-3l1-1v-2l1-1v-1l1-1v-2h1v-1l1-1v-1l1-1v-1h1v-2l1-1 1-1v-2l1-1 1-1v-2h1v-1l1-1v-1l1-1v-1h1v-2h1v-1h1v-1h1v-1h2v-1h9v-1h19l2 1h29l1 1h5v-1h2v-1h1v-1h1l1-1 1-1 1-1 1-1 1-1 1-1 1-1v-1h1v-1h1v-1h1v-1l1-1v-1h1v-1h1v-1l1-1v-1h1v-1h1v-1l1-1v-1h1v-1h1v-1h1v-1h1l1-1h1v-1l1-1h1v-1l1-1v-1h1v-1h1v-1l1-1 1-1v-1l1-1v-1h1v-1l1-1v-1h1v-2l1-1 1-1v-2h1v-2h1v-3h-1l-1-1h-2l-1-1h-2l-1-1h-3l-1-1-5-1-4-1-3-1-4-1-3-1-3-1-2-1-3-1h-2l-2-1h-1l-2-1h-2l-1-1h-3l-1-1h-1l-2-1h-3l-1-1h-3l-1-1h-3l-1-1h-3l-1-1h-5v-1h-7l-1-1h-4l-2-1h-2l-2-1h-3l-1-1h-3l-1-1h-2l-2-1h-3v-1h-3v-1h-3v-1h-3v-1h-2v-1h-2v-1h-2v-1h-1l-1-1zm15 124h2v1h3l1 1h2l1 1h2l2 1h3l1 1h4v1h7v1h5l2 1h4l2 1h2l2 1h2l2 1h3l2 1h2l2 1 2 1h2l1 1h4l1 1h2l1 1h2v1h1v1h1v1h1v1l1 1v2h1v3h1v1l1 2v2l1 1v1l1 2v1l1 1v3l1 1v3l1 1v3l1 1v4l1 1v8l1 1v12h1v3l1 2v2l1 2v2l1 1v2l1 1v2l1 1v2h4v-1h2l1-1h1l1-1h1l1-1h2l1-1h1l1-1h1l1-1h1v-1h2v-1h1v-1h1v-15l-1-2v-25l-1-5v-16l1-1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1l1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 2-2 1-1 2-2 2-2 2-2 2-2 2-2 2-2 3-2 2-3 1-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1l1-1h1v-1h1v-1h4v-1 1h2v1h1v1h1v1h1v2l1 1v2h1v2h1v2l1 1v1l1 1v1l1 1v1h1v1l1 1v2l1 1 1 1v1l1 1 1 1v1l1 1v1h1v1h1v2h1v1l1 1 1 1v1l1 1v1l1 1 1 1v1l1 1v1l1 2 1 2v1l1 2 1 1v1l1 1v2l1 2 1 1v2l1 2v2h1v3h1v1l1 1v2h1v1l1 1v1l1 1v1l1 1v1l1 1 1 2v1l1 1 1 2v1l1 1v1l1 1v2l1 1v1h1v2l1 1v1l1 1v1l1 2v2h1v3h1v2l1 1v2h1v2h1v2h1v2h1v1h2v-1h1v-1h1l1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1h1v-1l1-1 1-1h1v-1l1-1 1-1 1-1v-1h1l1-1v-1h1v-7h-1v-2h1v-2h1v-1h1v-1h1v-6l1-4v-1l-1-5v-6l-1-6-1-7-1-7-1-8-2-7-1-8-2-7-1-8-2-7-1-7-2-7-1-6-1-6-1-5-1-4v-8l-1-1v-2l1-1v-6l-1-1v-8h-1v-8h1v-2h1v-1h1v-1h1v-1l1-1 1-1 1-1 1-1v-1h1v-1h1v-1h1v-1h1l1-1 1-1 1-1h1l1-1 1-1 1-1h1v-1h1v-1h1v-1h1v-1l1-1 1-1h1v-1l1-1h1v-1l1-1 1-1 1-1h1l1-1v-1l1-1 1-1h1v-1l1-1 1-1h1v-1l1-1h1v-1l1-1 1-1h1v-1h1v-1l1-1 1-1 1-1 1-1 1-1v-1l1-1 1-1 1-1v-1l1-1 1-1 1-1v-1l1-1 1-1 1-1v-1l1-1 1-1 1-1 1-2 1-1v-1l1-2 1-1v-1l1-1 1-2 1-2 1-2 1-1v-1l1-1v-2l1-1v-2l1-1v-3l1-1v-9l-1-1v-2l-1-1v-1l-1-1v-1h-1v-1l-1-1-1-1h-1v-1h-1v-1h-1v-1h-2v-1h-2v-1h-4v-1h-7v1h-4l-1 1h-3v1h-3v1h-2v1h-2l-1 1-1 1h-1l-1 1h-1l-1 1-1 1h-1l-1 1-1 1-2 1-2 1-2 2-2 1-3 2-2 2-3 2-3 2-3 3-3 3h-1v1h-1v1h-1v1h-1v1l-1 1-1 1v1h-1v1l-1 1h-1v1l-1 1-1 1-1 1-1 1v1h-1l-1 1-1 1h-1v1h-1v1h-2v1h-1l-1 1h-1v1h-1l-1 1h-1v1l-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1l-1 1h-12l-2-1h-11l-1-1h-11l-1-1h-10l-3-1h-10l-4-1h-17l-4-1h-24l-1 1H89l-2-1H75l-1-1h-8v-1H46v1h-1v1l-1 1-1 1v1h-1v1l-1 1-1 1v1l-1 1-1 1-1 1v1l-1 1-1 1-1 1v1h-1v1l-1 1v1h-1v3h2v1h3v1h2l1 1h2l1 1h2l1 1h3l1 1h1l2 1h3l1 1h4l1 1h6v1h5l1 1h3l1 1h4l1 1h3l1 1h3l2 1h3l1 1h2l2 1h3l3 1 2 1h2l3 1 3 1h3l3 1 4 1 4 2 5 1h1l1 1h2l1 1h2l2 1h2l1 1h2v1h3v1h2v1h1l1 1v1h1v2h1v2h-1v3h-1v3h-1v2h-1v2h-1v2l-1 1v1h-1v1l-1 1v2h-1v1l-1 1v1l-1 1-1 1v1l-1 1-1 1-1 1-1 1v1l-1 1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1l-1 1v1h-1v1l-1 1-1 1v1h-1v1l-1 1v1h-1v1h-1v1h-1v1h-1v1l-1 1h-1v1h-1v1h-1v1l-1 1h-1v1h-1v1h-2v1h-1v1h-2v1h-2v1H75l-2-1H41l-1 1v1h-1v1l-1 1v1l-1 1v1h-1v2h-1v1l-1 1v1l-1 1v1l-1 1v1l-1 1v1l-1 1v2z",
    ],
  },
  car: {
    side: 414,
    filled: !1,
    d: [
      "M62 286H47l-15 1H16v-15l-1-16v-15l-1-15v-31l15-5 16-5 16-5 15-5 7-13 6-14 7-13 6-13 7-14 6-14 6-13h30l16-1h90l15 1h15l7 12 6 13 7 13 6 13 7 12 8 13 7 12 7 12 17 7 17 6 17 7 2 14 2 14 1 15 1 14v14l1 15-17-1h-33",
      "M150 286h28l14-1 14 1h14l14-1 14 1h14M76 178h44l14 1 15-1 14-1 14-1 15 2 14 2 15-1 14-2 15-1 14 1 15 2h14l14-1h29",
      "m91 245 5-2 6-1 5-1 5 1 6 1 5 1 5 2 5 3 4 3 4 4 3 4 3 5 2 5 2 5 1 5v11l-1 5-1 5-2 5-3 4-3 5-3 4-4 3-4 4-4 2-5 3-5 2-5 1h-11l-5-1-5-1-5-2-5-3-4-3-4-4-4-4-2-4-3-5-1-5-2-5v-11l1-5 1-5 1-5 3-5 2-4 3-4 4-4 4-4 4-3 5-2 5-2 5-1m192 2 6-1 5-1h5l6 1 5 1 5 2 4 2 5 3 4 3 4 4 3 4 3 4 3 5 2 5 1 5 1 5v11l-2 6-2 5-2 5-4 4-3 4-5 4-4 2-5 3-5 1-6 1-5 1h-5l-5-1-5-1-5-2-5-2-4-3-5-3-3-3-4-4-3-5-3-4-2-5-1-6-1-5v-6l1-5 1-6 2-5 3-5 3-4 4-4 5-3 5-3 4-2 6-1 5-1 5-1",
    ],
  },
  food: {
    side: 462,
    filled: !0,
    d: [
      "m71 433-2-5v-1h-1l-1-6v-7l1-6v-1l2-7 1-1 3-7 4-7v-1l5-6v-1l13-16 18-24v-1l16-19v-1l3-2 130-139 2-2 1-3 1-4-3-14v-13l1-11v-1l3-10v-1l5-14 6-13 9-14v-1l9-11v-1l13-14h1l14-12 8-6 7-4h1l7-4h1l7-3 8-3 7-1h1l7-1h7l6 1h1l6 2 1 1 5 2v1l4 2h1v1l5 5 4 5v1l3 5v1l2 6 2 7v16l-1 8-2 8v1l-2 8-3 9-4 8v1l-9 16-1 1-11 15-10 11v1l-11 9-11 9-13 8h-1l-11 5-1 1-11 3-9 1v1h-15l-3 2-2 2-108 159-2 3v1l-48 60-8 9-1 1-6 6-6 5-6 4h-1l-6 2h-8l-5-1h-2l-5-3h-1v-1l-6-4v-1l-4-4zm9-5 3 3 5 4 4 2 5 1h4l4-2 5-3 5-4 6-6 8-9 47-60 2-2v-1l108-160h1v-1l4-2v-1h1l4-2 1-1h1l4-1h12l8-1 10-3 10-5 13-8 10-8 10-9 10-10 11-15 9-16 3-8 3-8 2-8 2-8 1-7v-7l-1-6-1-6-2-6-2-4-3-4-4-5-3-2-5-2-5-1-5-1-6-1-6 1-7 1-6 2-7 3-7 4-8 4-7 5-13 12-13 13-8 11-9 14-5 12-5 14-3 9-1 11v11l3 14v2l-1 5v1l-2 5v1h-1l-2 3-131 139v1l-2 1-16 20-18 24-13 17-4 6-4 7-3 6-2 7-1 5 1 5 1 4z",
      "m224 301 3-4v-1h3v1h1v1l2 1 1 2 1 2 1 1 1 1 1 1 1 1v2l1 1 2 2 1 1 1 2 1 2 1 1 1 1 1 2 1 1 1 1 1 1 1 2 1 2 1 1 1 1 1 2 1 1 1 2 1 1 1 2 1 1 1 2 1 1 2 2 1 2 1 1v1l1 1 1 1v2l1 1 1 2 2 2 1 2 1 1 1 1 1 1v1h1l1 1 1 2 1 1 1 1 2 2 1 2 1 2 1 1 1 2v1l1 1 1 1 1 2 1 1 1 2 1 2 2 2 1 1 1 1v1l1 1 1 1 1 2 1 1 2 2v1l1 1 1 1v1h1v2h1v2h1v1l1 1v1h1v1l1 1 1 1 1 1 1 1v1h1v1l1 1 1 1 1 1 1 1 1 1 1 1 1 1h1l1 1v1h1l1 1h1l1 1h1l1 1h3v1h3l1 1h10v-1h2v-1h1v-1h1l1-1 1-1h1v-1h1v-1l1-1v-1l1-1v-8h-1v-3l-1-1v-2l-1-1v-1l-1-1v-1h-1v-1l-1-1-1-1v-1l-1-1-1-1v-1h-1v-1l-1-1v-1l-1-1-1-1v-1l-1-1h-1v-1l-1-1-1-1v-1l-1-1-1-1v-1l-1-1-1-1v-1l-1-1-1-1-1-2-1-1-1-2-1-1-1-1v-1l-1-2-1-1-1-2-1-2-10-14-2-2-1-1v-1l-1-1v-1l-1-1-1-1-1-2v-1l-1-2-2-2-1-2-1-1-1-1-1-1-1-1-1-1-1-2-1-1-1-1-2-2-10-15-1-2-1-1-1-2-1-1v-1l-1-1-1-1v-1l-1-1-1-2-1-2-2-1-1-2-1-1v-2l-1-1-1-1-1-1-1-1-1-2-1-2-1-2-1-2-1-1-1-1-1-1-1-1v-2l-1-1-1-2-2-2h-3v-3l7-10v-1h3v1h2v2h1v4l-1 1h1l1 2 1 2 1 1 1 1v1l1 1 1 2 1 1 1 2 1 2 1 2h1l1 1v2l1 1 1 1v1l1 1 1 2 1 1 1 2 2 2 1 2 1 1 1 1 2 2v2l1 1 2 2 1 1 1 2 1 2 1 1 1 2 2 2 1 1 1 1 1 2 1 2 1 1 1 2 1 1 1 1 1 2 1 1 1 2 1 1 1 2 1 1 1 2 1 2 1 1 1 1 1 1 1 2v1l1 1 1 2 2 2 1 2 1 1 1 2 1 1 1 1v1l1 1 1 2 1 1 1 2 2 2 1 2 1 1 1 1v2l1 1 1 1 1 1 1 2 1 2 1 1 1 1 1 1 1 1 1 1v1l1 1 1 1 1 1 1 1v1l1 1v1l1 1 1 1v1h1v1h1v2l1 1v1h1v2l1 1v2l1 1v1l1 1 1 1v1l1 1v1l1 1v2h1v1l1 1v2h1v4h1v6l-1 1v3l-1 1v1h-1v2h-1v1l-1 1h-1v1h-1v1h-1v1h-1v1h-1v1h-1l-1 1h-1v1h-1v1h-2v1h-2v1h-2v1h-4v1h-9v-1h-4v-1h-3v-1h-2l-1-1h-1l-1-1h-2v-1h-1l-1-1-1-1h-1l-1-1-1-1-1-1h-1l-1-1v-1h-1v-1l-1-1-1-1-1-1-1-1v-1h-1v-1l-1-1-1-1-1-1v-1h-1v-1l-1-1h-1v-2h-1v-1h-1v-1l-1-1-1-1-1-1v-1h-1v-1l-1-1-1-1-1-2-1-2-1-1-1-1-1-1-1-1-1-1-1-2-1-1-1-2-1-2-2-2v-1l-1-1-1-2-1-1v-1l-1-1-1-2-2-2-1-2-1-2-1-1-1-1v-1l-1-1-1-2-1-1-1-2-1-2-2-2-1-1-1-1-1-1-1-1-1-1-1-1v-1l-1-1-1-1-1-2-2-2-1-2-1-1-1-1v-1l-1-2-1-1-1-1-1-2-1-2-2-2-1-1-1-2v-1l-1-1-1-1-1-1-1-2-1-1-1-2-1-2-1-2-1-1-1-1-1-2-1-1v-1l-1-1-1-2-2-2v-1h-1v-2zM39 44v-1h-1v-1l-1-1v-3h-1v-3l1-1v-3h1v-1l1-1v-1h1v-1h1v-1h1l1-1h2l1-1h4l1-1h9v-1h13v-1h9l1 1h8v1h4l1 1h4v1h3l1 1h3v1h2l1 1h2v1h2v1h2l1 1h1v1h2v1h2v1h1l1 1 1 1h1v1h1v1h1l1 1h1v1h1v1h1l1 1h1l1 1 1 1h1v1h1v1h1l1 1h1v1h1v1h2v1h1v1h1l1 1 1 1h1l1 1 1 1h1l1 1 1 1 1 1 1 1 1 1v1h1l1 1 1 1 1 1 1 1 1 1 1 1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1l1 1v1h1v1l1 1 1 1 1 2 1 1 1 1v1l1 1v1h1v2h1v2h1v2h1v2h1v2h1v2l1 1v1l1 1v2l1 1v2h1v3l1 1v2l1 1v4l1 1v5l1 2v3l1 1v9h1v2h-1v6h-1v3h-1v2h-1 1v1l1 1v1h1v1l1 1v1h1v1l1 1 1 1v1l1 1 1 1 2 3 1 2 1 2 1 2 1 1 1 2 2 1 1 2 1 2 2 3 2 3 1 2 2 2 1 1 1 2 1 2 1 1 1 2 2 2 1 3 2 2 1 2v1l1 1v2h-1l-3 3v1h-3v-1h-1v-1l-1-1-1-1-2-2-2-3-1-2-2-2-1-2-1-1-1-1-1-2-1-2-2-2-2-3-2-2-1-3-2-1-1-2-1-2-1-1-1-2-1-1-2-3-2-2-10-16h-1v-1l1-2v-2l1-1v-3l1-1v-2h1v-6h1v-6l-1-1v-6h-1v-4h-1v-3h-1v-2l-1-1v-2h-1v-2h-1v-2h-1v-2l-1-1v-2h-1v-2h-1v-2h-1v-2h-1v-2l-1-1v-1l-1-1v-1l-1-1v-1l-1-1-1-1-1-1-1-1v-1l-1-1v-1h-1v-1h-1v-1h-1v-1l-1-1-1-1h-1v-1h-1v-1l-1-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1l-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1h-1v-1h-1v-1h-1v-1h-1v-1h-1l-1-1h-1v-1h-1v-1h-1l-1-1-1-1h-1l-1-1-1-1h-1l-1-1h-1v-1h-1v-1h-2v-1h-1v-1h-2v-1h-1l-1-1h-1l-1-1h-1l-1-1h-1l-1-1h-2v-1h-2l-1-1h-3l-1-1h-4l-1-1h-4l-1-1h-5l-1-1h-8v-1h-5v1H60v1h-6l-1 1h-5v3h1v1l1 1v1l1 1v1h1l1 1v1l1 1 1 1 1 2 1 1 2 3 1 2 1 2 2 1 1 2 1 1 1 2 1 2h1l1 2 2 2 2 3 1 2 2 2 1 2 1 1 1 2 1 1 1 2 2 2 2 3 2 3 1 2 1 2 1 1 1 2 1 2 1 1 2 2 1 2 2 3 14 20 1 2 2 3 1 2 1 1 1 2 1 1 1 2 1 2 2 2 2 3 2 2 1 3 2 1 1 2 1 1 1 2 2 1 1 2 2 2 1 3 2 2 1 2 2 2 1 2 1 2 2 2 1 2 1 1 2 2 1 2 2 3 1 2 2 2 1 2 1 1 1 2 1 2 1 2 1 2 2 2 2 3 2 2 1 2 1 2 1 1 1 2 1 1 2 2 1 3 2 2 2 3 1 2 2 2 1 2 1 1 1 2 1 1 1 2 2 2 1 3 1 1v2l-5 5v1h-3v-1h-1l-1-1v-1l-2-2-1-2-1-2-2-2-1-1v-2l-2-2-1-1-1-3-2-2-2-3-2-2-1-2-1-2-1-1-1-2-1-2-1-2-1-2-2-2-2-3-2-2-1-2-1-2-1-1-2-2-1-1-1-2-2-2-2-3-1-2-2-3-1-1-1-2-2-1-1-2-1-2-1-1-2-3-2-2-1-2-1-2-2-2-1-2-1-2-2-2-1-2-1-2-2-2-1-2-2-3-1-2-2-2-1-1-1-2-1-1-1-2-1-2-2-2-2-3-1-2v-1l-2-2-1-2-1-1-2-4-1-1-1-2-2-2-2-3-1-3-2-2-1-2-1-1-2-2-1-1-1-2-1-2-2-2-2-2-1-3-2-2-1-2-2-2-1-1-1-1-1-2-1-2-2-2-2-3-2-2-1-3-1-2-1-1-1-2-1-1-1-2-1-2-2-2-2-3-1-1v-2l-1-1-1-1-1-1v-1h-1l-1-1v-1l-1-1h-1v-2z",
    ],
  },
  bag: {
    side: 447,
    filled: !0,
    d: [
      "M205 15h1l1-1h20v1h8v1h5l1 1h3l1 1h2l1 1h2l1 1h2l1 1 2 1h1l2 1 1 1 2 1h1l2 1 1 1 2 1 1 1 1 1 2 1 1 1 1 2 2 1v1h1l1 1 1 1 1 1v1l1 1 1 1 1 1v1l1 1v1l1 1 1 1v1l1 1v1l1 1v1l1 1v1l1 1v1l1 1v2l1 1v3l1 1v3l1 1v4l1 1v9l1 1v31h55l1 1h8v1h1l1 1v1h1v2h1v3h1v4h1v2l1 2v4l1 2v2l1 1v3l1 2v4l1 2v3l1 2v2l1 3v2l1 3v3l1 3v3l1 2v3l1 2v2l1 3v2l1 2v4l1 2v4l1 2v3l1 2v5l1 2v3l1 1v5l1 1v2l11 63v6l1 5 1 5 1 5 1 4 1 5v4l1 3v4l1 3 1 4v3l1 3v3l1 3v3l1 2v4l1 2v4l1 2v5l1 1v4l1 2v4l1 2v4l1 2v4l1 3v5l1 2v3l1 3v6l1 1v11l-1 1-1 1h-1v1H229l-3-1h-99l-52 1H48v-1H34v-1h-2v-1h-1v-1h-1v-12l1-1v-7l1-1v-8l1-1v-7l1-1v-6l1-2v-7l1-1v-6l1-2v-6l1-3v-6l1-3v-3l1-4v-4l1-3v-4l1-5v-4l1-5 1-5v-6l1-5 1-6 1-6v-5l1-4v-5l1-4 1-4v-4l1-4v-3l1-4v-6l1-3v-3l1-3v-3l1-3v-6l1-3v-4l1-3v-4l1-4 1-4v-4l1-4v-5l1-5 1-6 1-6v-2l1-3v-5l1-3v-2l1-3v-4l1-2v-6l1-2v-5l1-1v-5l1-1v-5l1-1v-3h1v-2h1v-1h2v-1h43l4-1h17V79l1-2v-5l1-1v-4l1-1v-2l1-1v-3l1-1v-1l1-1v-1l1-1v-1l1-1v-1l1-1v-1l1-1v-1h1v-2h1l2-3v-1h1v-1h1v-1l1-1v-1h1l1-1v-1h1l1-1v-1h1l1-1 1-1 1-1 1-1h1v-1h1l1-1h1l1-1v-1h1l1-1h1l1-1h1l1-1h1l1-1h1l1-1h2v-1h2v-1h2l1-1h3l1-1h2l2-1h3l1-1zm-66 123v-13h-17l-4 1H80v5l-1 1v6l-1 2v4l-1 2v4l-1 2v5l-1 2v5l-1 2v6l-1 3-1 5v6l-1 5-1 5v4l-1 4-1 4v4l-1 4v3l-1 4v3l-1 3v3l-1 3v3l-1 3v3l-1 3v3l-1 3v4l-1 3v4l-1 4v4l-1 4v4l-1 5-1 5v6l-1 5-1 6-1 6v5l-1 5-1 4v4l-1 4v4l-1 4v3l-1 4v6l-1 3v3l-1 3-3 26v4l-1 1v7l-1 1v7l-1 1v8h-1v3h64l1-1h150l17 1h136v-3h-1v-6l-1-3v-3l-1-2v-5l-1-3v-4l-1-2v-4l-1-2v-4l-1-2v-5l-1-2v-5l-1-1v-5l-1-1v-5l-1-3v-3l-1-3v-3l-1-3v-4l-1-3-1-4v-3l-1-4-1-5v-4l-1-5-1-5-1-5-1-6-1-6-1-5v-5l-1-5-1-5-1-4-1-4v-4l-1-3-1-4v-3l-1-3v-3l-1-3v-3l-1-3-1-3v-3l-1-3v-3l-1-3-1-4v-3l-1-4-1-4v-4l-1-4-1-4-1-5-1-5-1-5-1-6-1-3v-5l-1-2v-2l-1-2v-2l-1-3v-2l-1-2v-3l-1-2v-2l-1-2v-3h-1v-3l-1-1v-2h-9l-47 1v12l-1 2v41l-1 1v1h-1v1h-1l-1 1h-8l-2-1h-12l-2-1h-9l-1-1h-4v-1h-1v-1h-1v-2h-1v-53l-2 1h-25l-1-1h-37v11l-1 1v44l-1 1v1h-1v1h-1l-1 1h-41v-1h-1v-1h-1v-1l-1-1v-28l1-3zm88-114h-19l-1 1h-6l-1 1h-3l-1 1h-3v1h-3v1h-2l-1 1h-2v1h-2l-1 1h-1v1h-2l-1 1-1 1h-1l-1 1-1 1h-1v1h-1l-1 1-1 1-1 1h-1v1h-1l-1 1v1h-1v1h-1v1l-1 1-1 1-1 1v1h-1v1l-1 1-1 1v1l-1 1v1l-1 1v1h-1v2l-1 1v1l-1 1v2l-1 1v3l-1 1v3l-1 1v5l-1 1v10l1 1v6l1 2v29l-1 4v28l-1 3v12h26v-10l1-1v-8l-1-1v-9h1v-35l1-2V85l1-1v-3l1-1v-3l1-1v-2l1-1v-1l1-1 1-1v-1l1-1v-2l1-1 1-1v-1l1-1h1l1-1 1-1 1-1v-1l1-1 1-1h1l1-1 1-1 1-1h2l1-1h1v-1h2l1-1h2v-1h3l1-1h5l1-1h7l1 1h5l1 1h3l1 1h1l1 1h2l1 1h1l1 1h1v1l1 1h1l2 1v1h1l2 3h1v1h1v1h1v2h1v1h1v2h1l1 2v1l1 1v2h1v2h1v3h1v4h1v5l1 1v23l1 1v58l1 2v1l1 1h10l1 1h10v-7l-1-2v-15l1-3V78l-1-1v-5l-1-1v-3l-1-1v-2l-1-1v-2l-1-1v-2l-1-1v-1l-1-1v-1h-1v-1l-1-1v-1l-1-1v-1l-1-1-1-1v-1l-1-1h-1v-1l-1-1-1-1-1-1-1-1-1-1-1-1-1-1-2-1-1-1-1-1h-1l-1-1-2-1h-1l-1-1-2-1h-1l-1-1-2-1h-2l-1-1h-2l-1-1h-3l-1-1h-4v-1h-7zm0 34h-15l-2 1-3 1h-1l-1 1-1 1h-1l-1 1h-1v1h-1l-1 1h-1v1l-1 1h-1v1l-1 1h-1v1l-1 1v1l-1 1-1 1v1l-1 1v1l-1 1v2h-1v3l-1 1v6h-1v27h15l1-1h50V93l-1-1v-7l-1-1v-3l-1-1v-2h-1v-2l-1-1v-1l-1-1v-1l-1-1v-1h-1v-1h-1l-1-2v-1h-1l-1-1h-1v-1h-1v-1h-1l-1-1-1-1h-1l-1-1h-1l-1-1h-3z",
    ],
  },
  gift: {
    side: 448,
    filled: !0,
    d: [
      "m72 113 22 1h6c14 0 14-1 27-2l28 1h28l28-1 28 1h83l28 1h39l4 3 1 2 1 1v6l-1 3v8l-1 28 1 14 1 14v28c1 14-1 14-1 27l2 28v84l1 13v15l-2 27v12l-1 2-3 3-2 1h-70l-28 1-28-1h-8l-6 1h-41l-28-1-28-1-28-1-28-1-28 1-4-1h-7l-4-4-1-2v-7l1-11v-27l1-28v-28l-1-28-2-27v-15l1-13v-28l1-28 1-14v-42l1-7v-2l3-3h3l1 1v3h1v1l1 1v48l-1 14v28l-2 28v16l1 11 1 28 1 28v28l-1 28-1 27v13l1 1h61l28 1h28l28 1 27 1h28l28 1 28-1h27l28 1 9-1h2v-35l1-9v-3h3-3v-2l-1-14v-28l1-28-1-27-1-28-1-28 1-28v-14l-1-14v-28l1-8v-4h-34l-28-1H211l-28-2h-27l-28 1-28 2h-9l-2-1h-5l-12-1c-11-1-10-3-10-6 0-2 0-5 10-4z",
      "m380 281-35-1-34-1h-69l-34-2h-35l-34 1-34-1-35 1c-12 0-14-2-14-5s2-4 14-4l35-2 34 1h69l34 1 35 1h103c13 1 12 3 12 6s0 6-12 5z",
      "m217 418 1-32 1-32-1-32-1-32 1-32-1-32-1-31v-17l1-16 2-32q1-15 6-13c5 2 4 2 3 14l-1 32-1 9v4l-1 1v17l1 32 2 32-1 32 1 32v96c0 12-3 11-5 11-3 0-6 0-6-11z",
      "M125 48v-7h1v-3h1v-2h1v-2h1v-2h1v-1h1v-1l1-1h1v-1l1-1 1-1h1v-1h1v-1h1v-1h1v-1h1v-1h1l1-1h1v-1h2v-1h2l1-1h2l1-1h13v1h3l1 1h2l1 1h2v1h2v1h2v1h1l1 1h1v1h1l1 1h1v1h1v1h1v1h1v1h1l1 1 1 1 1 1 1 1 1 1 1 1 1 1v1h1v1h1v1h1v1l1 1v1h1v1h1v1l1 1v1h1v1l1 1v1l1 1 1 1v1l1 1v1l1 1v1h1v2h1v2h1v2h1v2h1v1l1 1v2h1v2l1 1v2l1 1v2l1 1v2l1 1v2h1v1l1-1v-3h1v-4l1-1v-3l1-1v-4h1v-5h1v-3l1-1v-2h1v-2l1-1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h1v-1h1v-1l1-1 1-1 1-1 1-1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h2v-1h1l1-1 1-1h1l1-1h2v-1h2v-1h3v-1h4v-1h4l1-1h11v1h3v1h3v1h2l1 1h1v1h2v1h1v1h1l1 1h1v1l1 1 1 1 1 1h1v1l1 1 1 1v1l1 1v1h1v1h1v2h1v2l1 1v3h1v13h-1v3l-1 1v2h-1v2l-1 1v2h-1v2h-1v2h-1v2h-1v1h-1v2h-1v1h-1v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v1h-1v1h-2v1h-1l-1 1h-1v1h-1l-1 1h-1l-1 1-1 1h-1l-1 1h-1v1h-1v1h-1l-1 1h-1v1h-2v1h-1l-1 1h-1l-1 1h-1v1h-2v1h-1l-1 1h-1v1h-1l-1 1h-1v1h-1l-1 1h-1v1h-2v1h-2v1h-2v1h-1l-1 1h-1l-1 1h-1v1h-2v1h-2v1h-2v1h-1l-1 1h-6l-1-1h-1v1h-2v1h-8l-1-1h-3l-2-1h-1l-2-1h-2l-1-1h-2l-1-1h-1l-1-1h-2l-1-1h-3v-1h-2l-1-1h-2v-1h-3v-1h-2l-1-1h-2v-1h-2v-1h-2v-1h-2v-1h-2v-2h-1l-1-1h-1v-1h-2v-1h-2v-1h-2v-1h-1l-1-1h-1v-1h-1v-1h-1l-1-1h-1v-1h-1v-1h-1l-1-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1l-1-1h-1v-1h-1v-1h-1v-1l-1-1v-1h-1v-1h-1v-1h-1v-1l-1-1-1-1v-1h-1v-2h-1v-1l-1-1v-1h-1v-2h-1v-2h-1v-2h-1v-3h-1v-2l-1-1v-3h-1zm105 60v1h2v-1h2v-1h2v-1h2v-1h1l1-1h1l1-1h1l1-1h1l1-1h1v-1h2v-1h1l1-1h1v-1h1l1-1h1v-1h1l1-1h1v-1h2v-1h2v-1h1l1-1h1v-1h2v-1h1l1-1h1v-1h1l1-1h1v-1h2v-1h1v-1h1l1-1h1v-1h1l1-1h1v-1h1v-1h1l1-1 1-1 1-1h1v-1l1-1 1-1 1-1v-1h1v-1l1-1v-1h1v-2h1v-2h1v-2h1v-2h1v-2h1v-3h1V41h-1v-3h-1v-1l-1-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-2v-1h-1v-1h-2v-1h-2v-1h-3v-1h-9l-1 1h-3l-1 1h-3v1h-2l-1 1h-1l-1 1h-1l-1 1h-1v1h-1l-1 1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1l-1 1-1 1-1 1v1h-1v1h-1v1h-1v1l-1 1v1h-1v1h-1v2h-1v2h-1v2l-1 1v3h-1v3l-1 1v4h-1v4l-1 1v4h-1v4h-1v6h-1zm-13 3h1v-2l-1-1v-2h-1v-3h-1v-3h-1v-3h-1v-3h-1v-2l-1-1v-2h-1v-2l-1-1v-2l-1-1v-2h-1v-2l-1-1v-1l-1-1v-1l-1-1v-1l-1-2v-1l-1-1v-1l-1-1v-1l-1-1v-2h-1v-2h-1v-2h-1v-1l-1-1v-1l-1-1v-1h-1v-1l-1-1v-1h-1v-1h-1v-1h-1v-1l-1-1-1-1v-1h-1v-1h-1v-1h-1v-1l-1-1h-1v-1l-1-1h-1v-1l-1-1-1-1-1-1-1-1h-1v-1h-1l-1-1-1-1h-1l-1-1h-2v-1h-2l-1-1h-3v-1h-11v1h-2v1h-2v1h-1v1h-1v1h-1l-1 1h-1v1h-1v1h-1v1h-1v1h-1v1l-1 1v1h-1v2h-1v9l1 1v2l1 1v2h1v2l1 1v2h1v1l1 1v1h1v2h1v1l1 1v1h1v1l1 1v1h1v1l2 2v1h1v1h1v1h1v1h1v1h1v1h1v1h2v1h1v1h2v1h1v1h2v1h1l1 1h1v1h1v1h2v1h1v1h1l1 1h1v1h2v1h1v1h2v1h2v1h3v1h2v1h3v1h2l1 1h2l1 1h1l1 1h3l1 1h1v1h3l1 1h1l1 1h3l1 1h3l1 1z",
    ],
  },
  sprout: {
    side: 457,
    filled: !0,
    d: [
      "M223 272v-4l-1-3-1-2-1-4-3-6-1-3-2-3-2-4-1-2-1-2-1-2-2-1-5-5v-1l-2-1-3-2-6-3-2-1-8-2-2-1-7-2-4-1h-3l-3-1h-46l-8 1-11 1H86l-7-1-3-1h-5l-4-1h-3l-8-1-7-2-3-1-4-2-7-4-7-5-3-3-3-2-5-7-3-8v-9l1-8 1-3v-2l1-3 1-2 2-2 1-3 3-3 1-1 2-2 4-5 1-1 8-7 2-1 3-1 3-1 5-1 7-3h3l4-1 5-1h26l7 1 7 1 15 4 4 1 3 1 3 1 4 1 4 1 3 1 7 3 4 2 3 2 2 2 2 1 2 1 4 3 2 2 3 1 1 2 2 1 4 3 2 3 5 5 5 6 2 2 3 3 3 4 2 2 4 6 7 14 2 4 1 2 3 7c3 7 2 8 4 15l5 21 1 8 2 15v29l1 14-1 15-1 14q0 8-4 7-6 0-6-7l1-14v-15l-1-14 1-15-1-7-1-7v-7l-1-7v-7l-1-7-2-7-2-6-4-14-2-6-1-3-2-4-7-12-8-11-3-3-2-2-5-5-5-5-2-2-3-2-2-2-1-1-3-2-2-1-3-3-2-1-2-1-2-1-2-2-4-2-6-3-3-1-4-2-3-1-3-1h-3l-4-2-7-2-7-1-6-1-7-1-10-1h-2l-2 1-7-1h-3l-4 1-4 1-2 1-6 2-4 2-2 1-3 1-1 1-2 1-5 4-1 1h-1l-1 2-2 1-1 2-1 1-1 2-3 6-1 2-1 1-1 2-1 6v6l2 6 4 5 4 4 2 1 1 1 3 1 6 3 3 2 2 1 5 2 2 1 7 1h2l5 1h35l7-1h22l3-1h19l5 1h3l3 1h4l8 2 3 1 4 2 4 1 3 2 1 1 2 1 4 2 2 2 2 1 1 1 1 1 7 8 2 1 2 3 2 2 2 4 2 4 2 3 1 3 2 4 1 5 1 3 1 7q1 7-4 6-6 2-6-4z",
      "m223 192 1-4 1-3 1-3 1-5 1-4 1-3 1-3 2-4 3-4 2-3 3-2 1-2 2-1 5-6 2-1 1-1 4-2 4-3 3-2 2-1 9-3 3-1 7-1 5-1 3-1h3l4-1 15-1h15l7 1h8l7 1h28l14-2 6-2 4-1h3l2-1 4-2 6-2 6-4 2-2 2-2 2-6 3-5v-6l-1-6-2-6-1-1v-2l-1-2-1-3-1-1-2-2-1-1-1-2h-2l-1-1-5-4-2-1-1-1-3-1-2-2-3-1-7-2-3-1-4-1h-27l-7 1-7 2-14 3-4 1-2 1-3 1-4 2-4 1-2 2-6 3-4 2-2 1-3 1-1 1-2 1-4 2-2 2-2 2-2 1-1 1-4 3-2 1-5 5-5 5-2 2-2 4-4 6-3 6c-4 6-5 5-8 11l-2 4-1 3-1 2-1 4-5 13-2 7-1 7-2 7-1 7-1 7v36l1 14-1 15v14q0 8-5 7-6 0-5-7v-29l-1-14 1-15-1-7v-15l1-7 2-8 1-7 2-7 2-7 5-15 2-4 1-2 1-3 2-4 7-13 9-13 4-6 5-5 5-6 2-2 4-3 2-2 1-1 3-2 2-1 4-3 2-1 2-1 3-2 2-1 4-2 7-3 3-1 4-2 10-3 4-2 15-3 7-1 8-1 7-1h15l2 1h1l5 1 8 1 7 1 5 2 3 1 2 2 2 1 3 1 6 5 1 1 1 1 2 2 2 2 2 2 1 1 2 3 4 8 1 4 1 4v16l-3 8-1 3-2 2-2 3-2 2-3 4-2 1-2 2-3 2-7 3-4 2h-3l-4 1-4 1-7 2h-3l-5 1-4 1h-3l-8 1h-10l-5-1h-14l-7-1-7-1h-7l-8 1-13 1h-5l-2 1h-3l-11 3h-2l-17 6-1 1-2 1-1 1-1 1-2 2-1 1-2 1-1 2-1 1-2 3-1 2-2 3-2 4-1 2-1 3-1 4-1 4-1 2-2 7q-2 6-6 4-6 2-5-6zM88 398l4-7 3-4q2-4 9-10l4-3 2-2 5-3 11-6 4-2 3-1 3-1 2-1 5-2 7-2 8-1 5-1 5-1 7-1 4-1 4-1 5-1 5-1h5l2-1h43l3-1 5 1 12 1 13 2 7 1 5 1 33 9 4 2 7 4 5 3 4 3 3 2 3 3 9 10 1 2 2 3 2 3 2 4 1 2 1 4 1 1v3l1 1v6h-20l-24 1h-75l-25-1-25 1h-74l-25-1c-10 0-10-2-10-5s0-6 10-6h25l25 1h25l24-1h25l25 1h50l24-1 25 1h7l-1-1-1-1-3-6-1-2-1-2-7-9-6-4-4-3-2-1-2-1-6-3-3-2-3-1-5-2-11-3-12-3-5-2-19-2-12-1h-24l-8 1h-17l-7 1h-10l-7 1-7 2-5 1-5 2-13 4-5 1-2 1-2 1-3 1-4 2-10 5-4 2-3 2-3 3-8 7-6 10-4 6-4 1q-2 0-3-2-1-3 2-10z",
    ],
  },
  music: {
    side: 437,
    filled: !0,
    d: [
      "m114 325-20 6-2 1-1 2-3 3-5 7-2 6-2 7v1l-1 1-1 7 1 14v2l1 1 1 3 10 15 2 1 1 1h1l1 1 6 3 8 3 8 2h12a43 43 0 0 0 22-11l9-12 5-11 1-9a37 37 0 0 0-3-18l-3-5a47 47 0 0 0-17-17l-5-3-6-2-9-1h-10l-4-3q-1-2 2-4l4-2 8-1a57 57 0 0 1 35 13 52 52 0 0 1 14 21l3 11v18l-4 12-3 6-1 2-2 3-7 9-6 6a49 49 0 0 1-20 8h-15l-11-2-10-4-6-3-3-2-4-3-7-8-5-10-2-3v-2l-1-2-1-18 1-7 1-2 1-2 2-7 4-11 8-11 2-1 8-5 18-6q10-1 12 2l1 4q1 2-2 4zm212-78h-3l-3-1h-14l-13 3-4 3-4 3-5 4-3 6-4 8-1 6v4l1 6 5 16 2 2 1 3 3 3 6 6 4 2 9 4 9 2h13l15-6 1-1 2-1 4-5 5-7 2-2 4-14v-13l-1-4-1-3-1-3-5-9-3-5-5-4-9-3-10-1h-7l-25 4h-5q-3 0-3-3-2-1 1-4l5-2 8-2 26-3h9l3 1 12 4 7 6 5 7 5 10 1 3 1 3a43 43 0 0 1 2 22l-3 11-3 6-7 12-8 7-1 1-1 1-6 3a54 54 0 0 1-40 2l-10-5-7-4-6-6-3-5-2-2-1-3a61 61 0 0 1-8-32l1-7 1-2 1-2 8-14a46 46 0 0 1 16-13l11-4h2l2-1h4l8-1 5 1h3l4 1 8 2 3 2v4l-2 4h-4z",
      "M358 281v-16l-1-16 1-16-1-17-1-16v-8l1-3v-21l-1-16 1-17V87l1-17-1-16 1-16v-8l1-2v-2h-1l-1 1-1 1-5 2-14 7-14 8-15 7-14 8c-7 4-8 3-15 6l-15 8-14 7-7 4-7 4-14 8-15 7-14 9-14 8-2 2h-1v5l-1 17v32l1 16-1 17v48l-1 17 1 16v65l-1 16q0 8-4 7-6 0-6-7l1-16v-16l-1-17 1-16-2-16 1-16v-49l1-16v-17l-1-16v-16l-1-16 1-16v-11l4-5h2l1-1 2-1 15-8 14-8 14-7 15-8 7-4 7-4 15-7c7-4 6-5 13-8l15-8 14-7 15-8c7-4 7-2 15-6l14-8 6-3 2-1 3-2a10 10 0 0 1 10 3l2 4 1 1v16l-2 16 1 16v49l-1 16v98l1 16v32c0 7-2 6-5 6s-5 1-6-6z",
      "m359 93-20 10-20 10-20 12-19 11c-10 6-11 4-21 9l-19 11-20 11-20 10-20 11q-9 4-10 0c-1-4-2-5 6-9l19-11 20-10 20-10 19-12c9-5 11-4 21-10l20-10 19-11 20-11 19-11c8-4 9-1 10 1s3 5-4 9z",
    ],
  },
};
console.assert("__eap_only__");
var Ut = { ...It, ...Ht };
function Wt(e, t) {
  return ae(e) === pe(e) ? 0.28 : t ? 0.3 : 0.85;
}
function Gt(e) {
  let $ = J9(20),
    { glyph: t, tint: n, size: r, share: i } = e,
    a = ie() === "dark",
    o = Ut[t],
    s = J2($, 0, a, n) ? K2($, 0, a, n, O(n, a)) : $[2],
    l = J1($, 3, n) ? K1($, 3, n, T(n)) : $[4],
    u = J2($, 5, a, n) ? K2($, 5, a, n, Wt(n, a)) : $[7],
    d = Vt[t],
    f = J1($, 8, d) ? K1($, 8, d, d.map(Kt)) : $[9],
    p = J3($, 10, l, u, f)
      ? K3($, 10, l, u, f, c("g", { fill: l, opacity: u, children: f }))
      : $[13];
  return J5($, 14, i, r, o, s, p)
    ? K5(
        $,
        14,
        i,
        r,
        o,
        s,
        p,
        c(zt, { line: o, ink: s, size: r, share: i, children: p }),
      )
    : $[19];
}
function Kt(e) {
  return c("path", { d: e }, e);
}
console.assert("__eap_only__");
var qt = {
    side: 396,
    filled: !1,
    d: [
      "M200 31 L380 121 L196 215 L16 125 Z",
      "M14 199 L198 289 L382 195",
      "M18 275 L200 365 L378 271",
    ],
  },
  Jt = "M200 31 L380 121 L196 215 L16 125 Z";
function Yt(e) {
  let $ = J9(7),
    { size: t, share: n } = e,
    r = ie() === "dark",
    i = J1($, 0, r) ? K1($, 0, r, O("clay", r)) : $[1],
    a = J0($, 2)
      ? K0($, 2, c("path", { d: Jt, fill: T("clay"), opacity: 0.28 }))
      : $[2];
  return J3($, 3, n, t, i)
    ? K3(
        $,
        3,
        n,
        t,
        i,
        c(zt, { line: qt, ink: i, size: t, share: n, children: a }),
      )
    : $[6];
}
console.assert("__eap_only__");
var Xt = 22 / 28;
function Zt(e) {
  let $ = J9(15),
    { icon: t, allChannels: n, size: r, className: i } = e,
    a = n !== void 0 && n,
    o = d() === "comfortable",
    s = m() / 16,
    l = r === "auto" ? (o ? "md" : "sm") : r,
    u = typeof l == "number" ? void 0 : l,
    f = typeof l == "number" ? l : p[l].px * s,
    g = J1($, 0, t?.glyph)
      ? I1(
          $,
          0,
          F.find((e) => e === t?.glyph),
          t?.glyph,
        )
      : $[1],
    _ = a ? "allChannels" : t?.glyph,
    v = t?.tint,
    y = J1($, 2, i)
      ? K1($, 2, i, h("inline-flex shrink-0 items-center justify-center", i))
      : $[3],
    b = J5($, 4, a, t, g, f, u)
      ? K5(
          $,
          4,
          a,
          t,
          g,
          f,
          u,
          a
            ? c(Yt, { size: f, share: u === void 0 ? Xt : 1 })
            : t !== void 0 &&
                (g === void 0
                  ? c(Et, {
                      value: !0,
                      children: c(A, {
                        value: "tinted",
                        children: c(D, {
                          value: u,
                          children: c(Ft, {
                            look: {
                              wear: { kind: "glyph", glyph: Ce(t.glyph) },
                              tint: t.tint,
                              setBy: "agent",
                            },
                            size: f,
                          }),
                        }),
                      }),
                    })
                  : c(Gt, {
                      glyph: g,
                      tint: t.tint,
                      size: f,
                      share: u === void 0 ? Xt : 1,
                    })),
        )
      : $[9];
  return J4($, 10, _, v, y, b)
    ? K4(
        $,
        10,
        _,
        v,
        y,
        b,
        c("span", {
          "aria-hidden": "true",
          "data-part": "channel-token",
          "data-glyph": _,
          "data-tint": v,
          className: y,
          children: b,
        }),
      )
    : $[14];
}
export {
  ot as a,
  we as c,
  xt as i,
  ke as l,
  Ft as n,
  it as o,
  Dt as r,
  P as s,
  Zt as t,
  Ee as u,
};
