import { t as e } from "./046ad1efebe522e66b1a1c7b6d2429b1f5bbaac7160dc539-Cp0AY0vP.js";
import { s as t } from "./7f29883aa074b869545499b0bb58fdfa7fbcdee8c93c26bf-CGiVxYE0.js";
console.assert("__eap_only__");
var n = 62 / 28,
  r = [0.961, 0.91, 0.808],
  i = [0.851, 0.467, 0.341],
  a = [0.851, 0.824, 0.769],
  o = { light: t("#f9f9f7"), dark: t("#0b0b0b") },
  s = { light: a, dark: t("#6d6b67") };
function c(e, t) {
  return Math.max(8, e + 2 * Math.round((e * (t - 1)) / 2));
}
function l(e) {
  return c(e, n);
}
function u(e, t) {
  return t === "dry"
    ? [
        e[0] + (a[0] - e[0]) * 0.38,
        e[1] + (a[1] - e[1]) * 0.38,
        e[2] + (a[2] - e[2]) * 0.38,
      ]
    : e;
}
var d = 15,
  f = 16;
function p(t) {
  return t === "clawd" ? d : t === "code" ? f : e.indexOf(t);
}
function m(e, t) {
  let n = 2166136261;
  for (let r of new TextEncoder().encode(`glyph:${t}:${e}`))
    n = Math.imul(n ^ r, 16777619) >>> 0;
  return (n % 53) / 5;
}
function h(e, t, n, a = l(n)) {
  let s = new ArrayBuffer(160),
    c = new Float32Array(s),
    d = e.state === "dry";
  return (
    (c[0] = a / 2),
    (c[1] = a / 2),
    (c[2] = n),
    (c[3] = e.seed),
    (c[4] = e.state === "resting" ? 0.02 : 0),
    (c[5] = d ? 0.85 : 1),
    (c[6] = e.blank),
    (c[7] = 1),
    (c[10] = +!!d),
    (c[13] = -0.005),
    (c[14] = (((e.seed * 7.31) % 1) - 0.5) * 0.9),
    (c[15] = 0.37),
    (c[16] = +!!d),
    (c[18] = 8),
    (c[19] = +!!t.dark),
    (c[21] = 1),
    (c[22] = 1),
    c.set(u(t.pigment, e.state), 24),
    (c[27] = d ? 0.92 : 0.7),
    c.set(r, 28),
    (c[31] = 2.7),
    c.set(i, 32),
    (c[35] = Math.min(0.7, (0.49 * a) / (1.42 * n))),
    c.set(t.dark ? o.dark : o.light, 36),
    (c[39] = 1),
    s
  );
}
export { m as a, u as i, p as n, c as o, h as r, s as t };
