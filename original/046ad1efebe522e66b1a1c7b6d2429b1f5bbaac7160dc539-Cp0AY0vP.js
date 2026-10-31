import {
  Tt as e,
  dt as t,
  et as n,
  ut as r,
} from "./fcee03b8edc27b24f59134f0f99027292a19362584c3ea5f-BYoS-YJP.js";
console.assert("__eap_only__");
var i = [
    "checklist",
    "calendar",
    "email",
    "dollarSign",
    "chart",
    "globe",
    "mapPin",
    "home",
    "box",
    "slides",
    "folder",
    "edit",
    "search",
  ],
  a = [...i, "clawd", "code"],
  o = {
    wear: { kind: "glyph", glyph: "checklist" },
    tint: "clay",
    setBy: "agent",
  };
function s(e) {
  return (e ?? o).tint;
}
var c = "_";
function l(t) {
  return e.find((e) => e === t);
}
function u(e, i, o) {
  if (e === void 0 || e === "") return;
  let s = l(i),
    u = o === "user" ? "user" : "agent",
    d = t(e);
  if (d !== void 0) {
    let t = s ?? d.tint;
    return {
      wear: { kind: "mascot", look: { ...n(d), tint: t } },
      tint: t,
      setBy: u,
      token: e,
    };
  }
  let f = e.indexOf(c);
  if (f <= 0 || r(e)) return;
  let p = e.slice(f + 1),
    m = a.find((e) => e === p);
  return {
    wear:
      m === void 0
        ? { kind: "glyph", glyph: "checklist" }
        : { kind: "glyph", glyph: m, prefix: e.slice(0, f) },
    tint: s ?? "clay",
    setBy: u,
    token: e,
  };
}
function d(e, t) {
  return `${e}${c}${t}`;
}
export { u as a, s as i, o as n, d as r, i as t };
