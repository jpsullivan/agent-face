import { Co as e, Do as t, ho as n, io as r } from "./vendor-frame-DOohJIoJ.js";
import { J1, J4, J9, K1, K2, K4, zo as i } from "./shared-frame-BjFq5krv.js";
import { Gx as a } from "./shared-l-p-m-w-1-G7HedE-G.js";
import {
  A$ as l,
  T2 as c,
  Wn as ne,
  gj as te,
  go as ee,
  iS as s,
  jB as o,
} from "./shared-l-p-m-w-0-DhHHirVc.js";
import { im as re } from "./shared-l-p-m-w-3-C9QwVXzU.js";
import { B6 as ie } from "./shared-1-CEfj1Fiq.js";
import { xh as ae } from "./shared-m-2-kHzMdEhE.js";
import { JE as oe } from "./shared-l-p-m-w-2-DjrpivvG.js";
import { BA as ce, hh as u, oh as se } from "./shared-l-m-0-B7ozLsjp.js";
import {
  i as le,
  n as ue,
} from "./6062917c900c84fd6d39911fdf3234b7795834c63b9c3802-7bdT3sUA.js";
console.assert("__eap_only__");
function de(e) {
  let t = ne(() => (e instanceof Error ? e.name : void 0));
  return typeof t == "string" && c.test(t) ? t : typeof e;
}
console.assert("__eap_only__");
var fe = [
    "tofu",
    "pebble",
    "tofu-rendered",
    "pebble-rendered",
    "tofu-flat",
    "pebble-flat",
    "block",
    "spark",
  ],
  d = [
    "clay",
    "cactus",
    "heather",
    "mineral",
    "plum",
    "ochre",
    "cornflower",
    "rose",
    "clover",
    "jade",
  ],
  pe = [
    "bowler",
    "partyHat",
    "nightcap",
    "beanie",
    "topHat",
    "gradCap",
    "headphones",
    "cowboy",
    "antenna",
    "halo",
    "bow",
    "cap",
    "crown",
    "chefHat",
    "propeller",
    "wizard",
    "sprout",
    "hardHat",
    "flower",
  ];
console.assert("__eap_only__");
function me(e) {
  if (e === null) return null;
  switch (e) {
    case "bowler":
      return "bowler";
    case "partyHat":
      return "partyHat";
    case "nightcap":
      return "nightcap";
    case "beanie":
      return "beanie";
    case "topHat":
      return "topHat";
    case "gradCap":
      return "gradCap";
    case "headphones":
      return "headphones";
    case "cowboy":
      return "cowboy";
    case "antenna":
      return "antenna";
    case "halo":
      return "halo";
    case "bow":
      return "bow";
    case "cap":
      return "cap";
    case "crown":
      return "crown";
    case "chefHat":
      return "chefHat";
    case "propeller":
      return "propeller";
    case "wizard":
      return "wizard";
    case "sprout":
      return "sprout";
    case "hardHat":
      return "hardHat";
    case "flower":
      return "flower";
    case "sunglasses":
      return "sunglasses";
    case "pencil":
    case "hammer":
    case "keyboard":
    case "book":
    case "magnifier":
    case "pot":
    case "blocks":
      return null;
  }
}
function he(e) {
  switch (e) {
    case "clay":
      return "clay";
    case "heather":
      return "heather";
    case "mineral":
      return "mineral";
    case "cornflower":
      return "sky";
    case "cactus":
      return "matcha";
    case "ochre":
      return "pencil";
    case "rose":
      return "fig";
    case "jade":
      return "mineral";
    case "plum":
      return "sky";
    case "clover":
      return "mineral";
  }
}
var ge = { clover: "coral", jade: "peach", plum: "cloud" };
function _e(e) {
  return ge[e] ?? he(e);
}
function ve(e) {
  switch (e) {
    case "clay":
    case "peach":
      return "clay";
    case "fig":
    case "coral":
      return "rose";
    case "pencil":
      return "ochre";
    case "matcha":
      return "cactus";
    case "mineral":
      return "mineral";
    case "sky":
    case "cloud":
      return "cornflower";
    case "heather":
      return "heather";
  }
}
console.assert("__eap_only__");
var f = ["tofu", "flower5", "drop", "bean", "acorn", "leaf", "stone"],
  p = [
    "fig",
    "coral",
    "peach",
    "clay",
    "pencil",
    "matcha",
    "mineral",
    "cloud",
    "sky",
    "heather",
  ],
  m = [
    "partyHat",
    "bowler",
    "crown",
    "headphones",
    "sunglasses",
    "sprout",
    "halo",
    "nightcap",
    "cap",
    "beanie",
    "topHat",
    "gradCap",
    "chefHat",
    "propeller",
    "wizard",
    "hardHat",
    "flower",
    "cowboy",
    "antenna",
    "bow",
  ],
  ye = [
    "idle",
    "listening",
    "thinking",
    "speaking",
    "delighted",
    "confused",
    "sleeping",
    "error",
    "surprised",
    "curious",
    "proud",
    "peeking",
    "wink",
    "sorry",
    "onIt",
    "waiting",
    "celebrating",
    "coding",
    "working",
    "writing",
    "reading",
    "building",
    "connecting",
  ],
  be = { shape: "tofu", tint: "clay", accessory: null },
  xe = 0.5522847498,
  Se = { byHandFrom: 36, smallMarksGrow: 1.5, smallMarksLineShare: 0.45 };
console.assert("__eap_only__");
var h = { face: "tofu", tint: "clay", hat: null },
  g = { face: "tofu", tint: "clay", hat: null },
  _ = "Aibo1",
  v = "_",
  y = "-";
function b(e, t) {
  return e.includes(t);
}
function x({ shape: e, tint: t, accessory: n }) {
  return [e, t, ...(n ? [n] : [])].join(y);
}
function Ce(e) {
  let t = e.split(y),
    [n, r, i] = t;
  if (!(t.length > 3 || n === void 0 || r === void 0 || !b(f, n) || !b(p, r)))
    return i === void 0
      ? { shape: n, tint: r, accessory: null }
      : b(m, i)
        ? { shape: n, tint: r, accessory: i }
        : void 0;
}
function we(e) {
  let [t, n, r, i, a] = e.split(v);
  if (t !== _ || n === void 0 || r === void 0) return;
  let o = a === void 0 ? void 0 : Ce(a);
  return {
    face: b(fe, n) ? n : g.face,
    tint: b(d, r) ? r : g.tint,
    hat: i !== void 0 && b(pe, i) ? i : null,
    ...(o !== void 0 && { line: o }),
  };
}
function Te(e) {
  let t = e?.split(v) ?? [],
    [n, r, i, a] = t;
  if (
    !(
      (t.length !== 3 && t.length !== 4) ||
      n !== "Aibo3" ||
      r === void 0 ||
      i === void 0 ||
      !b(f, r) ||
      !b(p, i) ||
      (a !== void 0 && !/^[A-Za-z0-9]+$/.test(a))
    )
  )
    return { shape: r, tint: i, accessory: a !== void 0 && b(m, a) ? a : null };
}
function Ee({ face: e, tint: t, hat: n }) {
  return { face: e, tint: t, hat: n };
}
function De(e) {
  return e === _ || e.startsWith("Aibo1_");
}
function S(e) {
  switch (e.face) {
    case "tofu":
    case "tofu-rendered":
    case "tofu-flat":
      return "tofu";
    case "pebble":
    case "pebble-rendered":
    case "pebble-flat":
      return "pebble";
    case "block":
      return "block";
    case "spark":
      return "flower";
  }
}
function C(e) {
  return e.tint;
}
var Oe = {
  clay: "bg-clay",
  cactus: "bg-cactus",
  heather: "bg-heather",
  mineral: "bg-mineral",
  plum: "bg-plum",
  ochre: "bg-yellow-300",
  cornflower: "bg-blue-300",
  rose: "bg-magenta-300",
  clover: "bg-green-250",
  jade: "bg-aqua-350",
};
function ke(e) {
  return Oe[e];
}
var Ae = {
  clay: "text-clay-emphasized dark:text-clay",
  cactus: "text-mineral dark:text-cactus",
  heather: "text-plum dark:text-heather",
  mineral: "text-mineral",
  plum: "text-plum",
  ochre: "text-tint-yellow",
  cornflower: "text-tint-blue",
  rose: "text-tint-magenta",
  clover: "text-tint-green",
  jade: "text-tint-aqua",
};
function je(e) {
  return Ae[e];
}
var Me = {
  clay: "orange",
  cactus: "aqua",
  heather: "violet",
  mineral: "aqua",
  plum: "violet",
  ochre: "yellow",
  cornflower: "blue",
  rose: "magenta",
  clover: "green",
  jade: "aqua",
};
function Ne(e) {
  return Me[e];
}
var Pe = {
  clay: "bg-fill-brand",
  cactus: "bg-mineral",
  heather: "bg-plum",
  mineral: "bg-mineral",
  plum: "bg-plum",
  ochre: "bg-yellow-400",
  cornflower: "bg-blue-400",
  rose: "bg-magenta-400",
  clover: "bg-green-400",
  jade: "bg-aqua-400",
};
function Fe(e) {
  return Pe[e];
}
function Ie(e) {
  return e.line === void 0 ? e.tint : ve(e.line.tint);
}
function Le(e) {
  return {
    character: S(e),
    tint: C(e),
    hat: e.hat,
    ...(e.line !== void 0 && { line: e.line }),
  };
}
function Re(e, t) {
  return t === e.hat
    ? e
    : e.line === void 0
      ? { ...e, hat: t }
      : { ...e, hat: t, line: { ...e.line, accessory: me(t) } };
}
function w(e, t) {
  return (
    e?.shape === t?.shape &&
    e?.tint === t?.tint &&
    e?.accessory === t?.accessory
  );
}
function ze(e, t) {
  return (
    e.face === t.face &&
    e.tint === t.tint &&
    e.hat === t.hat &&
    w(e.line, t.line)
  );
}
function Be(e) {
  return e.line === void 0
    ? [S(e), C(e), e.hat ?? ""].join(":")
    : `line:${x(e.line)}`;
}
console.assert("__eap_only__");
var Ve = "aibo_room",
  He = "aibo_shared_room";
function T(e) {
  return e.template === "aibo_room" || e.template === "aibo_shared_room";
}
function E(e) {
  return T(e) && ie(e.visibility);
}
function Ue(e) {
  let t = e.caller_relations;
  return E(e) && t !== void 0 && t.length > 0 && !t.includes("owner");
}
function D(e, t) {
  if (!(!E(e) || e.members === void 0 || e.members_truncated === !0))
    return e.members.filter((e) => e.account_id !== t).length;
}
function We(e, t) {
  return (
    E(e) && (e.members_truncated === !0 || (D(e, t) ?? 0) > +(t === void 0))
  );
}
function O(e, t, n) {
  let r = e.members ?? [];
  return (
    (e.visibility === "private" || (t && e.visibility === void 0)) &&
    e.template !== "aibo_shared_room" &&
    e.members_truncated !== !0 &&
    (r.length === 0
      ? t
      : r.length === 1 && n !== void 0 && r[0]?.account_id === n)
  );
}
function Ge(e, t) {
  return !A(e) && O(e, !1, t);
}
function k(e) {
  return typeof e == "string" && e !== "";
}
function A(e) {
  return T(e) && k(e.archived_at);
}
function Ke(e) {
  return T(e) && k(e.disabled_at);
}
function j(e) {
  let t = Date.parse(e.created_at ?? "");
  return Number.isNaN(t) ? 2 ** 53 - 1 : t;
}
function qe(e, { archived: t = !1 } = {}) {
  return e
    .filter((e) => T(e) && !k(e.disabled_at) && k(e.archived_at) === t)
    .sort((e, t) => j(e) - j(t) || (e.id < t.id ? -1 : +(e.id > t.id)));
}
function Je(e, t, n) {
  let r;
  for (let n of t)
    n !== void 0 &&
      ae(e, n) &&
      (r === void 0 || n.length > r.length) &&
      (r = n);
  return r === n ? void 0 : r;
}
var Ye = new Set([...ue, "Everything"].map((e) => e.toLowerCase())),
  Xe = /[\p{L}\p{N}\p{Extended_Pictographic}\p{Regional_Indicator}]/u;
function M(e) {
  return typeof Intl.Segmenter == "function"
    ? Array.from(
        new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(e),
        (e) => e.segment,
      )
    : Array.from(e);
}
var N = "\u200C",
  P = "\u200D",
  F = /\p{M}/u,
  I = /\p{L}/u,
  Ze = /\p{Extended_Pictographic}/u,
  Qe = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\ufe0f]/u;
function $e(e) {
  let t = Array.from(e);
  return t
    .filter((e, n) => {
      if (e !== N && e !== P) return !0;
      let r = t[n - 1] ?? "",
        i = t[n + 1] ?? "";
      if (se(r)) return e === P || I.test(i) || F.test(i);
      if (e === P && Qe.test(r) && Ze.test(i)) return !0;
      let a = n - 1;
      for (; a >= 0 && F.test(t[a] ?? ""); ) a--;
      return u(t[a] ?? "") && (u(i) || F.test(i));
    })
    .join("");
}
function L(e) {
  return $e(
    ce(e.replace(/[\p{Cc}\u2028\u2029]/gu, " ")).text.replace(
      /[\u200b\u200e\u200f\u061c\u{13430}-\u{1343f}]/gu,
      "",
    ),
  );
}
var et = /\p{N}/u;
function tt(e) {
  return e.replace(/[\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]/gu, (e) =>
    String.fromCodePoint((e.codePointAt(0) ?? 0) - 65248),
  );
}
function nt(e) {
  return Array.from(e.replace(/\u0130/gu, "i"), (e) => e.toLowerCase()).join(
    "",
  );
}
var rt =
    /[\p{Script=Arabic}\p{Script=Syriac}\p{Script=Devanagari}\p{Script=Bengali}\p{Script=Gurmukhi}\p{Script=Gujarati}\p{Script=Oriya}\p{Script=Tamil}\p{Script=Telugu}\p{Script=Kannada}\p{Script=Malayalam}\p{Script=Sinhala}\p{Script=Khmer}\p{Script=Myanmar}\p{Script=Mongolian}\p{Script=Tibetan}]/u,
  R = /[\p{Cf}\p{Variation_Selector}\p{Default_Ignorable_Code_Point}]/u,
  it = 8;
function at(e) {
  let t = Array.from(e),
    n = (e) => I.test(e) || F.test(e),
    r = [],
    i = 0;
  return (
    t.forEach((e, a) => {
      let o = r.at(-1) ?? "";
      if (!(e !== P && e !== N && R.test(e))) {
        if (I.test(e) || et.test(e) || e === "_") r.push(e), (i = 0);
        else if (e === "-") r.length > 0 && o !== "-" && (r.push(e), (i = 0));
        else if (F.test(e)) {
          let t = o === P || o === N ? (r.at(-2) ?? "") : o;
          n(t) && i < it && (r.push(e), (i += 1));
        } else if (e === P || e === N) {
          let i = r.findLast((e) => !F.test(e)) ?? "",
            s = a === t.length - 1;
          n(o) &&
            (s || n(t[a + 1] ?? "")) &&
            I.test(i) &&
            rt.test(i) &&
            r.push(e);
        }
      }
    }),
    r
      .filter(
        (e, t) =>
          (e !== P && e !== N) || t === r.length - 1 || n(r[t + 1] ?? ""),
      )
      .join("")
  );
}
function z(e) {
  return at(
    nt(
      tt(
        e
          .normalize("NFC")
          .replace(/[\p{Cc}\u2028\u2029\u202a-\u202e\u2066-\u2069]/gu, " "),
      ),
    ).replace(/\p{White_Space}/gu, "-"),
  ).normalize("NFC");
}
function ot(e) {
  let t = (e) =>
    Array.from(e).filter((e) => !/[\p{White_Space}\-#]/u.test(e) && !R.test(e))
      .length;
  return (
    t(
      Array.from(
        e
          .normalize("NFC")
          .replace(/[\p{Cc}\u2028\u2029\u202a-\u202e\u2066-\u2069]/gu, " "),
      )
        .filter((e) => !R.test(e))
        .join("")
        .normalize("NFC"),
    ) > t(z(e))
  );
}
function B(e) {
  return z(e).replace(/[-\u200c\u200d]+$/u, "");
}
function st(e) {
  return L(e.normalize("NFC").replace(/[#\uFE5F\uFF03]/gu, ""))
    .normalize("NFC")
    .replace(/\s+/gu, "-")
    .replace(/-{2,}/gu, "-")
    .replace(/^-/u, "")
    .toLowerCase();
}
function V(e) {
  let t = M(z(e)).slice(0, 32);
  for (; Array.from(t.join("")).length > 40; ) t.pop();
  return t.join("");
}
function ct(e) {
  let t = M(z(e)),
    n = t.slice(0, 32);
  return Array.from(n.join("")).length > 40
    ? "size"
    : t.length > 32
      ? "characters"
      : void 0;
}
function lt(e) {
  return V(e).replace(/[-\u200c\u200d]+$/u, "");
}
function ut(e) {
  return L(st(e).replace(/-+$/u, "")) || L(e).trim();
}
function dt(e) {
  return e.replace(/[\u200c\u200d]/gu, "").normalize("NFC");
}
function ft(e) {
  return new Set(Array.from(e, (e) => dt(B(e))));
}
function pt(e, t) {
  return Xe.test(e)
    ? Ye.has(e.replace(/[\p{M}\p{Cf}]/gu, ""))
      ? "reserved"
      : t?.has(dt(e)) === !0
        ? "taken"
        : void 0
    : "empty";
}
console.assert("__eap_only__");
var mt = { origin: "namedAtCreation", isConfigured: !0 },
  H = "aibo_helper";
function ht(e) {
  return e.template === H;
}
function gt(e) {
  return (
    e.visibility === "private" && e.caller_relations?.includes("owner") === !0
  );
}
function U(e, t) {
  return (
    e.visibility === "private" &&
    e.caller_relations?.includes("owner") === !0 &&
    e.members_truncated !== !0 &&
    e.members?.length === 1 &&
    e.members[0]?.account_id === t
  );
}
function _t(e, t) {
  return T(e) && (e.members === void 0 || U(e, t) || xt(e, t));
}
function vt(e, t) {
  return _t(e, t) && (!E(e) || e.caller_relations?.includes("owner") === !0);
}
function yt(e, t) {
  return (
    vt(e, t) && e.visibility === "private" && e.template !== "aibo_shared_room"
  );
}
function bt(e, t) {
  return yt(e, t) && U(e, t);
}
function xt(e, t) {
  return (
    E(e) &&
    (e.caller_relations === void 0
      ? e.members?.some((e) => e.account_id === t) === !0
      : e.caller_relations.length > 0)
  );
}
function St(e, t, n) {
  return {
    id: e.id,
    name: le(e.name, t),
    purpose: e.topic ?? "",
    look: h,
    isLead: t,
    ...n,
    channel: e,
  };
}
console.assert("__eap_only__");
var W = ["main_list", "more"],
  Ct = {
    "notify.app_watch.started": { channels: { most: 10 } },
    "notify.app_watch.banner": {
      shown: "boolean",
      why_not: [
        "shown",
        "same_reply",
        "levels",
        "old",
        "other_window",
        "no_bridge",
      ],
      about: ["channel"],
    },
    "notify.app_watch.refused": {
      answer: ["bad_request", "forbidden", "other_4xx", "no_stream"],
      outcome: ["recovered", "failed", "recovered_late"],
      tries: { most: 20 },
      about: ["channel"],
    },
    "sidebar.row.shown": { place: W, marked: "boolean" },
    "sidebar.row.pressed": { place: W, marked: "boolean" },
    "sidebar.row.started_inline": { trigger: ["unread", "recent"] },
    "sidebar.unread_dot.shown": { about: ["channel"] },
    "sidebar.unread_dot.cleared": {
      cleared_by: ["read_elsewhere", "sent"],
      about: ["channel"],
    },
    "home_page.peek.shown": { marked: "boolean", sidebar_row_place: W },
    "home_page.peek.pressed": { marked: "boolean", sidebar_row_place: W },
    "home_page.peek.hidden": {},
    "home_page.sidebar_link.added": {},
  };
console.assert("__eap_only__");
var wt = "claudeai.cheeky_fountain",
  Tt = "other",
  Et = {
    engine: ["hub", "channel", "unknown"],
    shell: ["browser", "desktop_app"],
    chat: [
      "main_chat",
      "task_page",
      "thread_page",
      "task_page_in_pane",
      "thread_page_in_pane",
    ],
    in_room: "boolean",
    layout: ["phone", "wide"],
    touch: "boolean",
  };
function Dt(e, t) {
  let n = {};
  for (let [r, i] of Object.entries(e)) {
    let e = t[r];
    if (i === "boolean") typeof e == "boolean" && (n[r] = e);
    else if ("most" in i) {
      if (typeof e == "number" && Number.isFinite(e)) {
        let t = Math.min(Math.max(e, 0), i.most);
        n[r] = i.decimals === 1 ? Math.round(t * 10) / 10 : Math.floor(t);
      }
    } else
      e !== void 0 && (n[r] = typeof e == "string" && i.includes(e) ? e : Tt);
  }
  return n;
}
function Ot(e, t, n = {}) {
  return { ...Dt(Et, t), ...Dt(e, n) };
}
console.assert("__eap_only__");
function kt() {
  return re(te()?.getFeatures()) ? "channel" : "unknown";
}
console.assert("__eap_only__");
var At = r(void 0),
  jt = At.Provider;
function Mt() {
  return n(At);
}
var G, K, q, J;
function Nt(t) {
  let $ = J9(3),
    n,
    r;
  J1($, 0, t)
    ? ((n = () => {
        let e = { inRoom: t };
        return (
          (G = e),
          () => {
            G === e && (G = void 0);
          }
        );
      }),
      (r = [t]),
      K2($, 0, t, n, r))
    : ((n = $[1]), (r = $[2])),
    e(n, r);
}
function Pt() {
  return G?.inRoom;
}
function Ft(t) {
  let $ = J9(3),
    n,
    r;
  J1($, 0, t)
    ? ((n = () => {
        let e = { layout: t };
        return (
          (K = e),
          () => {
            K === e && (K = void 0);
          }
        );
      }),
      (r = [t]),
      K2($, 0, t, n, r))
    : ((n = $[1]), (r = $[2])),
    e(n, r);
}
function It() {
  return K?.layout;
}
function Lt(t) {
  let $ = J9(3),
    n,
    r;
  J1($, 0, t)
    ? ((n = () => {
        let e = { touch: t };
        return (
          (q = e),
          () => {
            q === e && (q = void 0);
          }
        );
      }),
      (r = [t]),
      K2($, 0, t, n, r))
    : ((n = $[1]), (r = $[2])),
    e(n, r);
}
function Rt() {
  return q?.touch;
}
function zt(t) {
  let $ = J9(3),
    n,
    r;
  J1($, 0, t)
    ? ((n = () => {
        let e = { underPage: t };
        return (
          (J = e),
          () => {
            J === e && (J = void 0);
          }
        );
      }),
      (r = [t]),
      K2($, 0, t, n, r))
    : ((n = $[1]), (r = $[2])),
    e(n, r);
}
function Bt() {
  return J?.underPage ?? !1;
}
console.assert("__eap_only__");
function Vt(e, t) {
  return {
    engine: kt(),
    shell: e ? "desktop_app" : "browser",
    chat: t,
    in_room: Pt(),
    layout: It(),
    touch: Rt(),
  };
}
function Ht(e) {
  return Et.chat.find((t) => t === e);
}
var Ut = 0;
function Wt() {
  return Ut;
}
function Gt(e) {
  let $ = J9(7),
    n = oe(),
    r = a(),
    i = Mt(),
    o = J4($, 0, n, i, r, e)
      ? K4($, 0, n, i, r, e, (t, a, o) => {
          t === "message.send.pressed" && (Ut += 1);
          try {
            let s = Object.hasOwn(e, t) ? e[t] : void 0;
            s !== void 0 &&
              n.track({
                event_key: `${wt}.${t}`,
                ...Ot(s, Vt(r, i ?? Ht(o?.chat)), a),
              });
          } catch {}
        })
      : $[4],
    c = s(o),
    l = J1($, 5, c)
      ? K1($, 5, c, () => (e, t, n) => {
          c(e, t, n);
        })
      : $[6],
    [ee] = t(l);
  return ee;
}
console.assert("__eap_only__");
function Kt(e) {
  return e instanceof o;
}
console.assert("__eap_only__");
var Y = 8e3,
  qt = 9e4,
  Jt = 18e5,
  X = Y;
function Z() {
  return document.visibilityState === "hidden" && !i();
}
function Q(e) {
  return e.keys.length > 0 && l();
}
var Yt = class {
    constructor({ takesBackOnLeave: e = !1, endsAtAccountMove: t = !1 } = {}) {
      (this.held = []),
        (this.snapshot = { undos: [], underWay: new Set() }),
        (this.listeners = new Set()),
        (this.nextId = 1),
        (this.watching = !1),
        (this.subscribe = (e) => (
          this.listeners.add(e),
          () => {
            this.listeners.delete(e);
          }
        )),
        (this.getSnapshot = () => this.snapshot),
        (this.onLeaving = (e) => {
          e.type === "pagehide" &&
            this.takesBackOnLeave &&
            !l() &&
            i() &&
            this.takeBackUnkeyed(),
            (e.type === "pagehide" || Z()) &&
              this.flush("leaving", e.type !== "pagehide"),
            this.retime();
        }),
        (this.takesBackOnLeave = e),
        t &&
          (this.accountMoved = (e) => {
            let t = this.underUndo(e);
            t !== void 0 && (t.keys.length > 0 ? this.undo(e) : this.end(e));
          });
    }
    start(e, t) {
      let n = typeof e == "string" ? [e] : e;
      if (n.some((e) => this.snapshot.underWay.has(e))) return;
      let r = {
        id: this.nextId++,
        keys: n,
        onEnd: t,
        pressedAt: Date.now(),
        out: !1,
        holds: 0,
        timer: void 0,
        atMost: void 0,
        movesAtPress: ee(),
      };
      return (
        n.length === 0 &&
          (r.atMost = setTimeout(() => {
            this.handBack(r, "timer");
          }, Jt)),
        (this.held = [...this.held, r]),
        this.commit(),
        r.id
      );
    }
    undo(e) {
      let t = this.underUndo(e);
      t !== void 0 &&
        (this.drop(t),
        t.onEnd({ how: "undone", afterMs: Date.now() - t.pressedAt }));
    }
    takeBackUnkeyed() {
      for (let e of this.held)
        !e.out &&
          e.keys.length === 0 &&
          (this.drop(e),
          e.onEnd({
            how: "undone",
            afterMs: Date.now() - e.pressedAt,
            unasked: !0,
          }));
    }
    holdUndo(e) {
      let t = this.underUndo(e);
      if (t === void 0) return () => void 0;
      (t.holds += 1), this.retime();
      let n = !1;
      return () => {
        n || ((n = !0), --t.holds, this.retime());
      };
    }
    flush(e = "leaving", t = !1) {
      for (let n of this.held)
        !n.out && !(t && n.keys.length === 0) && !Q(n) && this.handBack(n, e);
    }
    sendNow(e) {
      let t = this.underUndo(e);
      t !== void 0 && !Q(t) && this.handBack(t, "overtaken");
    }
    toastClosed(e) {
      let t = this.underUndo(e);
      t !== void 0 && !Q(t) && this.handBack(t, "overtaken", !0);
    }
    end(e) {
      let t = this.underUndo(e);
      t !== void 0 && t.keys.length === 0 && this.handBack(t, "leaving");
    }
    movesAtPress(e) {
      return this.underUndo(e)?.movesAtPress;
    }
    settled(e) {
      let t = this.held.find((t) => t.out && t.keys.includes(e));
      t !== void 0 &&
        ((t.keys = t.keys.filter((t) => t !== e)), this.leaveOrCommit(t));
    }
    underUndo(e) {
      return this.held.find((t) => t.id === e && !t.out);
    }
    retime() {
      for (let e of this.held)
        e.out ||
          (e.holds > 0 || (e.keys.length === 0 && Z())
            ? (clearTimeout(e.timer), (e.timer = void 0))
            : e.timer === void 0 &&
              (e.timer = setTimeout(() => {
                (e.timer = void 0),
                  Q(e) ? this.retime() : this.handBack(e, "timer");
              }, X)));
    }
    handBack(e, t, n = !1) {
      clearTimeout(e.timer),
        (e.timer = void 0),
        (e.out = !0),
        this.leaveOrCommit(e),
        e.onEnd(t === "overtaken" && n ? { how: t, closed: n } : { how: t });
    }
    leaveOrCommit(e) {
      e.keys.length === 0 ? this.drop(e) : this.commit();
    }
    drop(e) {
      clearTimeout(e.timer),
        clearTimeout(e.atMost),
        (e.out = !0),
        (this.held = this.held.filter((t) => t !== e)),
        this.commit();
    }
    commit() {
      let e = this.held.filter((e) => !e.out);
      this.snapshot = {
        undos: e.map((e) => ({ id: e.id, offersUndo: !0 })),
        underWay: new Set(this.held.flatMap((e) => e.keys)),
      };
      let t = e.length > 0;
      t !== this.watching &&
        ((this.watching = t),
        t
          ? (window.addEventListener("pagehide", this.onLeaving, {
              capture: !0,
            }),
            document.addEventListener("visibilitychange", this.onLeaving))
          : (window.removeEventListener("pagehide", this.onLeaving, {
              capture: !0,
            }),
            document.removeEventListener("visibilitychange", this.onLeaving))),
        this.retime();
      for (let e of this.listeners) e();
    }
  },
  Xt = {
    AIBO_UNDO_AT_MOST_MS: Jt,
    setUndoMs: (e = Y) => {
      X = e;
    },
    endAll: (e) => {
      let { undos: t, underWay: n } = e.getSnapshot();
      t.forEach(({ id: t }) => {
        e.undo(t);
      }),
        n.forEach((t) => {
          e.settled(t);
        });
    },
  };
export {
  g as $,
  Ve as A,
  pt as B,
  vt as C,
  _e as Ct,
  yt as D,
  bt as E,
  de as Et,
  We as F,
  qe as G,
  ft as H,
  ct as I,
  A as J,
  O as K,
  lt as L,
  Ge as M,
  Je as N,
  xt as O,
  j as P,
  h as Q,
  B as R,
  ht as S,
  ve as St,
  _t as T,
  d as Tt,
  D as U,
  V,
  ut as W,
  Ue as X,
  Ke as Y,
  E as Z,
  kt as _,
  be as _t,
  Z as a,
  Re as at,
  mt as b,
  p as bt,
  Gt as c,
  Ne as ct,
  Pt as d,
  we as dt,
  Ee as et,
  zt as f,
  Te as ft,
  Lt as g,
  ye as gt,
  Nt as h,
  m as ht,
  Xt as i,
  Ie as it,
  He as j,
  U as k,
  jt as l,
  je as lt,
  Ft as m,
  w as mt,
  qt as n,
  Le as nt,
  Kt as o,
  Fe as ot,
  Mt as p,
  ze as pt,
  T as q,
  Yt as r,
  x as rt,
  Wt as s,
  ke as st,
  Y as t,
  Be as tt,
  Bt as u,
  De as ut,
  Ct as v,
  f as vt,
  gt as w,
  he as wt,
  St as x,
  xe as xt,
  H as y,
  Se as yt,
  ot as z,
};
