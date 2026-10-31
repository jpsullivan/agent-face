console.assert("__eap_only__");
function e(e, t, n) {
  if (Number.isNaN(e)) return t;
  let r = Math.trunc(Math.min(Math.max(e, t), n));
  return Number.isFinite(r) ? r + 0 : t;
}
function t(e) {
  let t = Array.from(e),
    n = t.slice(1);
  return (
    t[0] === "#" &&
    n.length === 6 &&
    n.every((e) => "0123456789abcdefABCDEF".includes(e))
  );
}
function n(e) {
  return Math.abs(e.x) <= 1e6 && Math.abs(e.y) <= 1e6;
}
function r(e) {
  switch (e.kind) {
    case "move":
    case "line":
      return n(e.to);
    case "curve":
      return n(e.to) && n(e.control1) && n(e.control2);
    case "close":
      return !0;
  }
}
function i(e) {
  let t = Math.trunc(e);
  return Math.abs(e - t) >= 0.5 ? t + Math.sign(e) : t;
}
console.assert("__eap_only__");
function a(e) {
  return { kind: "move", to: e };
}
function o(e) {
  return { kind: "line", to: e };
}
function s(e, t, n) {
  return { kind: "curve", to: e, control1: t, control2: n };
}
var c = { kind: "close" };
function l(e, t, n) {
  return s(
    n,
    { x: e.x + ((t.x - e.x) * 2) / 3, y: e.y + ((t.y - e.y) * 2) / 3 },
    { x: n.x + ((t.x - n.x) * 2) / 3, y: n.y + ((t.y - n.y) * 2) / 3 },
  );
}
function u(t) {
  let n = [];
  for (let e = 0; e < t.length; e += 1) n.push(t.charCodeAt(e));
  let i = 0,
    u = [],
    d = { x: 0, y: 0 },
    f = { x: 0, y: 0 },
    p = null,
    m = null,
    h = !1;
  function g() {
    let e = null;
    for (v(); i < n.length; ) {
      if (_(n[i])) {
        let t = n[i];
        if (((i += 1), (h = !1), t === 90 || t === 122)) {
          if (u.length === 0) return null;
          S(), (e = null), v();
          continue;
        }
        e = t;
      }
      if (e === null || !D(e)) return null;
      v();
    }
    return u.length === 0 || u[0].kind !== "move" || !u.every(r) ? null : u;
  }
  function _(e) {
    return e === 101 || e === 69
      ? !1
      : (e >= 97 && e <= 122) || (e >= 65 && e <= 90);
  }
  function v() {
    for (; i < n.length; ) {
      let e = n[i];
      if (e === 32 || e === 44 || e === 9 || e === 10 || e === 13) i += 1;
      else return;
    }
  }
  function y() {
    v();
    let e = i,
      r = i,
      a = (e) => (e < n.length ? n[e] : null),
      o = (e) => e !== null && e >= 48 && e <= 57;
    (a(r) === 45 || a(r) === 43) && (r += 1);
    let s = r;
    for (; o(a(r)); ) r += 1;
    if (a(r) === 46) for (r += 1; o(a(r)); ) r += 1;
    if (!(r > s) || (r === s + 1 && a(s) === 46)) return null;
    if (a(r) === 101 || a(r) === 69) {
      let e = r + 1;
      if (((a(e) === 45 || a(e) === 43) && (e += 1), o(a(e)))) {
        for (; o(a(e)); ) e += 1;
        r = e;
      }
    }
    let c = Number(t.slice(e, r));
    return Number.isNaN(c) || !(Math.abs(c) <= 1e6) ? null : ((i = r), c);
  }
  function b() {
    return (
      v(),
      i < n.length
        ? n[i] === 48
          ? ((i += 1), !1)
          : n[i] === 49
            ? ((i += 1), !0)
            : null
        : null
    );
  }
  function x(e) {
    let t = y();
    if (t === null) return null;
    let n = y();
    return n === null ? null : e ? { x: d.x + t, y: d.y + n } : { x: t, y: n };
  }
  function S() {
    u.push(c), (d = f), (p = null), (m = null);
  }
  function C(e) {
    u.push(o(e)), (d = e), (p = null), (m = null);
  }
  function w(e, t, n) {
    u.push(s(n, e, t)), (d = n), (p = t), (m = null);
  }
  function T(e, t) {
    u.push(l(d, e, t)), (d = t), (p = null), (m = e);
  }
  function E(e) {
    return e === null ? d : { x: 2 * d.x - e.x, y: 2 * d.y - e.y };
  }
  function D(e) {
    let t = e >= 97;
    switch (String.fromCharCode(e).toUpperCase()) {
      case "M": {
        let e = x(t);
        return (
          e !== null &&
          (h
            ? C(e)
            : (u.push(a(e)),
              (d = e),
              (f = e),
              (p = null),
              (m = null),
              (h = !0)),
          !0)
        );
      }
      case "L": {
        let e = x(t);
        if (e === null) return !1;
        C(e);
        break;
      }
      case "H": {
        let e = y();
        if (e === null) return !1;
        C({ x: t ? d.x + e : e, y: d.y });
        break;
      }
      case "V": {
        let e = y();
        if (e === null) return !1;
        C({ x: d.x, y: t ? d.y + e : e });
        break;
      }
      case "C": {
        let e = x(t);
        if (e === null) return !1;
        let n = x(t);
        if (n === null) return !1;
        let r = x(t);
        if (r === null) return !1;
        w(e, n, r);
        break;
      }
      case "S": {
        let e = E(p),
          n = x(t);
        if (n === null) return !1;
        let r = x(t);
        if (r === null) return !1;
        w(e, n, r);
        break;
      }
      case "Q": {
        let e = x(t);
        if (e === null) return !1;
        let n = x(t);
        if (n === null) return !1;
        T(e, n);
        break;
      }
      case "T": {
        let e = E(m),
          n = x(t);
        if (n === null) return !1;
        T(e, n);
        break;
      }
      case "A": {
        let e = y();
        if (e === null) return !1;
        let n = y();
        if (n === null) return !1;
        let r = y();
        if (r === null) return !1;
        let i = b();
        if (i === null) return !1;
        let a = b();
        if (a === null) return !1;
        let o = x(t);
        if (o === null) return !1;
        O(e, n, r, i, a, o);
        break;
      }
      default:
        return !1;
    }
    return (h = !1), !0;
  }
  function O(t, n, r, i, a, o) {
    let s = d;
    if (s.x === o.x && s.y === o.y) return;
    let c = Math.abs(t),
      l = Math.abs(n);
    if (!(c > 0 && l > 0)) {
      C(o);
      return;
    }
    let u = (r * Math.PI) / 180,
      f = Math.cos(u),
      m = Math.sin(u),
      h = (s.x - o.x) / 2,
      g = (s.y - o.y) / 2,
      _ = f * h + m * g,
      v = -m * h + f * g,
      y = (_ * _) / (c * c) + (v * v) / (l * l);
    y > 1 && ((c *= Math.sqrt(y)), (l *= Math.sqrt(y)));
    let b = c * c * l * l - c * c * v * v - l * l * _ * _,
      x = c * c * v * v + l * l * _ * _,
      S = x === 0 ? 0 : Math.sqrt(Math.max(0, b / x));
    i === a && (S = -S);
    let T = (S * c * v) / l,
      E = (-S * l * _) / c,
      D = f * T - m * E + (s.x + o.x) / 2,
      O = m * T + f * E + (s.y + o.y) / 2,
      k = Math.atan2((v - E) / l, (_ - T) / c),
      A = Math.atan2((-v - E) / l, (-_ - T) / c) - k;
    a && A < 0 && (A += 2 * Math.PI), !a && A > 0 && (A -= 2 * Math.PI);
    let j = e(Math.ceil(Math.abs(A) / (Math.PI / 2)), 1, 4),
      M = A / j,
      N = (4 / 3) * Math.tan(M / 4),
      P = (e) => {
        let t = Math.cos(e),
          n = Math.sin(e);
        return {
          point: { x: D + c * t * f - l * n * m, y: O + c * t * m + l * n * f },
          tangent: { x: -c * n * f - l * t * m, y: -c * n * m + l * t * f },
        };
      };
    for (let e = 0; e < j; e += 1) {
      let t = P(k + M * e),
        n = P(k + M * (e + 1)),
        r = e === j - 1 ? o : n.point;
      w(
        { x: t.point.x + N * t.tangent.x, y: t.point.y + N * t.tangent.y },
        { x: n.point.x - N * n.tangent.x, y: n.point.y - N * n.tangent.y },
        r,
      );
    }
    p = null;
  }
  return g();
}
function d(e, t) {
  return Math.sqrt((t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y));
}
function f(e, t) {
  return { x: (e.x + t.x) / 2, y: (e.y + t.y) / 2 };
}
export { t as a, u as i, f as n, i as o, l as r, e as s, d as t };
