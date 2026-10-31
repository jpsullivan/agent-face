import { xt as e } from "./fcee03b8edc27b24f59134f0f99027292a19362584c3ea5f-BYoS-YJP.js";
import {
  n as t,
  r as n,
} from "./2ca6c54251d6542cb4c1de60673c38c8c09b48cd19fa0b27-DsoJFEEM.js";
console.assert("__eap_only__");
function r(e) {
  if (!(e.length > 2)) return [];
  let r = [{ kind: "move", to: t(e[e.length - 1], e[0]) }],
    i = t(e[e.length - 1], e[0]);
  return (
    e.forEach((a, o) => {
      let s = t(a, e[(o + 1) % e.length]);
      r.push(n(i, a, s)), (i = s);
    }),
    r.push({ kind: "close" }),
    r
  );
}
function i(t, n) {
  let r = e * n,
    i = { x: t.x + n, y: t.y },
    a = { x: t.x, y: t.y + n },
    o = { x: t.x - n, y: t.y },
    s = { x: t.x, y: t.y - n };
  return [
    { kind: "move", to: i },
    {
      kind: "curve",
      to: a,
      control1: { x: i.x, y: i.y + r },
      control2: { x: a.x + r, y: a.y },
    },
    {
      kind: "curve",
      to: o,
      control1: { x: a.x - r, y: a.y },
      control2: { x: o.x, y: o.y + r },
    },
    {
      kind: "curve",
      to: s,
      control1: { x: o.x, y: o.y - r },
      control2: { x: s.x - r, y: s.y },
    },
    {
      kind: "curve",
      to: i,
      control1: { x: s.x + r, y: s.y },
      control2: { x: i.x, y: i.y - r },
    },
    { kind: "close" },
  ];
}
function a(e, t, n) {
  return { x: e.x + t.x * n, y: e.y + t.y * n };
}
console.assert("__eap_only__");
var o = 2 * Math.PI;
function s(e) {
  return Number.isNaN(e) ? 0 : Math.min(Math.max(e, 0), 1);
}
function c(e) {
  let t = s(e);
  return t * t * (3 - 2 * t);
}
function l(e) {
  let t = s(e);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
function u(e, t, n) {
  return e + (t - e) * n;
}
function d(e, t, n) {
  return { x: u(e.x, t.x, n), y: u(e.y, t.y, n) };
}
function f(e) {
  return e - Math.floor(e);
}
function p(e) {
  return e < 0 ? 0 : (e / 0.05) * Math.exp(1 - e / 0.05);
}
function m(e, t, n) {
  return f(Math.sin(e * n[0] + t * n[1]) * 43758.5453);
}
console.assert("__eap_only__");
var h = 7.5,
  g = 0.42,
  _ = 1.25,
  v = 1.1,
  y = 0.2,
  b = 2.55,
  x = { x: 2.6, y: 2.2 },
  S = 4.4;
function C(e) {
  return 1 - s((e - 48) / 10);
}
var w = 1.2,
  T = 1.5,
  E = { x: -50 + x.x, y: -50 + x.y, width: 100, height: 100 };
export {
  a as C,
  i as S,
  m as _,
  T as a,
  c as b,
  b as c,
  g as d,
  C as f,
  f as g,
  l as h,
  v as i,
  w as l,
  s as m,
  S as n,
  y as o,
  o as p,
  h as r,
  x as s,
  E as t,
  _ as u,
  u as v,
  r as w,
  p as x,
  d as y,
};
