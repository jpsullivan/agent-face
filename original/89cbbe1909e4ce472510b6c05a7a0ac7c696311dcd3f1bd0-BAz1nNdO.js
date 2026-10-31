const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-frame-C3KzjOHD.css",
      "https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-styles-mAV-wvNm.css",
      "https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c19e90103-B_6SxnkW.css",
      "https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/eb869a9cc437763207179eb8beb7ffd7b8ff46b69735db51-CJk-4Kti.css",
    ]),
) => i.map((i) => d[i]);
import { Qr as e } from "./preload-helper-Cq29w_VG.js";
import {
  Ja as t,
  Ka as n,
  ho as r,
  io as i,
  qa as a,
} from "./vendor-frame-DOohJIoJ.js";
import {
  BO as o,
  J1,
  J2,
  J3,
  J4,
  J9,
  K1,
  K2,
  K3,
  K4,
  XZ as s,
} from "./shared-frame-BjFq5krv.js";
import { vo as c } from "./shared-l-p-m-w-1-G7HedE-G.js";
import { Or as l } from "./shared-l-p-m-w-0-DhHHirVc.js";
import { eH as u } from "./shared-100-DtXmh0yg.js";
import {
  Ct as d,
  lt as f,
  st as p,
} from "./fcee03b8edc27b24f59134f0f99027292a19362584c3ea5f-BYoS-YJP.js";
console.assert("__eap_only__");
var m = "page.messages_interactive",
  h = 1e4,
  g = 1e3,
  _ = 1e3;
function v() {
  return typeof process < "u" && !!{}.VITEST;
}
var y,
  b,
  x = !1;
function S() {
  return x
    ? Promise.resolve()
    : ((y ??= new Promise((e) => {
        let t = (e) => e.getEntriesByName(m, "mark").length > 0,
          n,
          r = setTimeout(() => b?.(), h);
        if (
          ((b = () => {
            (b = void 0), n?.disconnect(), clearTimeout(r), e();
          }),
          t(performance))
        ) {
          b();
          return;
        }
        try {
          (n = new PerformanceObserver((e) => {
            t(e) && b?.();
          })),
            n.observe({ type: "mark" });
        } catch {}
      })),
      y);
}
function C() {
  return new Promise((e) => {
    c(() => e(), { timeout: g, fallbackDelay: 0 });
  });
}
var w = "messages_face_renderer";
function T(e, t) {
  let n,
    r,
    i,
    a = async (n) => {
      n ||
        (await Promise.race([
          S(),
          new Promise((e) => {
            i = e;
          }),
        ])),
        await C();
      try {
        r = (await l({ origin: "background", tag: t }, e)) ?? null;
      } catch {
        r = null;
      }
      return r;
    };
  return {
    ask(e) {
      return v()
        ? ((r = null), Promise.resolve(null))
        : ((n ??= a(e)), e && i?.(), n);
    },
    now: () => r,
    reset() {
      (n = void 0), (r = void 0), (i = void 0);
    },
  };
}
var E = T(
    () =>
      e(
        () =>
          import(
            "./55bf623ec46d1c4d1f879a0009f135e4e1bc5e296285a272-CrKlyJpQ.js"
          ).then((e) => e.createRenderer()),
        [],
        import.meta.url,
      ),
    w,
  ),
  D = T(
    () =>
      e(
        () =>
          import(
            "./8f49cd0bc5b60a8cdf25f481a9e79cb6a764d44c39be7ebb-D96hR7E2.js"
          ).then((e) => e.createAiboMascotKit()),
        __vite__mapDeps([0, 1, 2, 3]),
        import.meta.url,
      ),
    w,
  );
function O() {
  return E.ask(!1);
}
function k() {
  (x = !0), b?.();
}
function A() {
  return E.now();
}
function j(e = !1) {
  return D.ask(e);
}
function M() {
  return D.now();
}
console.assert("__eap_only__");
var N = {
    fig: "#C46686",
    coral: "#EBCCCC",
    peach: "#EBC9B7",
    clay: "#D97757",
    pencil: "#F0AC54",
    matcha: "#CED6BF",
    mineral: "#629987",
    cloud: "#C5D3E0",
    sky: "#6A9BCC",
    heather: "#CBCADB",
  },
  P = {
    fig: "#C46686",
    coral: "#B1797A",
    peach: "#AD7D64",
    clay: "#CE6D4D",
    pencil: "#BB7A14",
    matcha: "#7E8D5E",
    mineral: "#579380",
    cloud: "#6A8BA9",
    sky: "#5B8BBB",
    heather: "#8784AB",
  },
  F = {
    fig: "#C46686",
    coral: "#F4B0B1",
    peach: "#EFB596",
    clay: "#D97757",
    pencil: "#F0AC54",
    matcha: "#BACD93",
    mineral: "#629987",
    cloud: "#A5C9E9",
    sky: "#6A9BCC",
    heather: "#C2BFE9",
  },
  I = [
    "rose",
    "clover",
    "jade",
    "clay",
    "ochre",
    "cactus",
    "mineral",
    "plum",
    "cornflower",
    "heather",
  ];
function L(e) {
  return N[d(e)];
}
function R(e, t) {
  let n = d(e);
  return (t ? F : P)[n];
}
console.assert("__eap_only__");
var z = i("grey"),
  B = i(void 0);
console.assert("__eap_only__");
var V = {
  checklist: "Checklist",
  calendar: "Calendar",
  email: "Email",
  dollarSign: "DollarSign",
  chart: "Chart",
  globe: "Globe",
  mapPin: "MapPin",
  home: "Home",
  box: "Box",
  slides: "Slides",
  folder: "Folder",
  edit: "Edit",
  search: "Search",
  clawd: "Code",
  code: "Code",
};
console.assert("__eap_only__");
var H = 0.56,
  U = 0.28;
function W(e) {
  let $ = J9(43),
    { glyph: i, tint: c, size: l, isNeutral: d, isClayChosen: m, style: h } = e,
    g = r(z) === "tinted",
    _ = u() === "dark",
    v = i === "clawd" ? "clay" : c,
    y = d && !(m && i === "clawd"),
    b = g && !y,
    x = J3($, 0, v, b, y)
      ? K3($, 0, v, b, y, s("relative", y ? "text-secondary" : !b && f(v)))
      : $[3],
    S = J3($, 4, _, v, b) ? K3($, 4, _, v, b, b ? R(v, _) : void 0) : $[7],
    C = r(B);
  if (C !== void 0) {
    let e = V[i],
      t = J2($, 8, S, h) ? K2($, 8, S, h, { color: S, ...h }) : $[10];
    return J4($, 11, x, C, e, t)
      ? K4(
          $,
          11,
          x,
          C,
          e,
          t,
          a(o, { name: e, size: C, className: x, style: t }),
        )
      : $[15];
  }
  let w = J3($, 16, v, b, y)
      ? K3(
          $,
          16,
          v,
          b,
          y,
          s(
            "absolute inset-0",
            y ? "bg-alpha-1" : ["opacity-[0.16]", !b && p(v)],
          ),
        )
      : $[19],
    T = l * U,
    E = J2($, 20, v, b) ? K2($, 20, v, b, b ? L(v) : void 0) : $[22],
    D = J3($, 23, h, T, E)
      ? K3($, 23, h, T, E, { borderRadius: T, backgroundColor: E, ...h })
      : $[26],
    O = J2($, 27, w, D)
      ? K2($, 27, w, D, a("span", { className: w, style: D }))
      : $[29],
    k = V[i],
    A = J1($, 30, l) ? K1($, 30, l, Math.round(l * H)) : $[31],
    j = J2($, 32, S, h) ? K2($, 32, S, h, { color: S, ...h }) : $[34],
    M = J4($, 35, x, j, k, A)
      ? K4(
          $,
          35,
          x,
          j,
          k,
          A,
          a(o, { name: k, customSize: A, className: x, style: j }),
        )
      : $[39];
  return J2($, 40, M, O) ? K2($, 40, M, O, t(n, { children: [O, M] })) : $[42];
}
export {
  L as a,
  O as c,
  j as d,
  M as f,
  I as i,
  A as l,
  B as n,
  R as o,
  T as p,
  z as r,
  _ as s,
  W as t,
  k as u,
};
