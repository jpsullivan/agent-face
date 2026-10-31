import { a as e } from "./2ca6c54251d6542cb4c1de60673c38c8c09b48cd19fa0b27-DsoJFEEM.js";
import { t } from "./5accd2d8aef326b7039070330d0d0316f905050db1d7b073-SYaPBvB9.js";
console.assert("__eap_only__");
var n = "#141413";
function r(e, t, n) {
  let r =
      e.width > 0 && e.height > 0 && t > 0 && n > 0
        ? Math.min(t / e.width, n / e.height)
        : 0,
    i = Number.isFinite(r) ? r : 0;
  return {
    scale: i,
    originX: (t - e.width * i) / 2 - e.x * i,
    originY: (n - e.height * i) / 2 - e.y * i,
  };
}
function i(e) {
  return Number.isFinite(e.x) && Number.isFinite(e.y);
}
function a(e) {
  switch (e.kind) {
    case "move":
    case "line":
      return i(e.to);
    case "curve":
      return i(e.to) && i(e.control1) && i(e.control2);
    case "close":
      return !0;
  }
}
function o(e, t, n) {
  if (
    (e.beginPath(),
    !(
      t.scale > 0 &&
      Number.isFinite(t.originX) &&
      Number.isFinite(t.originY)
    ) || !n.every(a))
  )
    return !1;
  let r = (e) => t.originX + e.x * t.scale,
    i = (e) => t.originY + e.y * t.scale,
    o = !0;
  for (let t of n)
    switch (t.kind) {
      case "move":
        e.moveTo(r(t.to), i(t.to)), (o = !1);
        break;
      case "line":
        o ? e.moveTo(r(t.to), i(t.to)) : e.lineTo(r(t.to), i(t.to)), (o = !1);
        break;
      case "curve":
        if (o) continue;
        e.bezierCurveTo(
          r(t.control1),
          i(t.control1),
          r(t.control2),
          i(t.control2),
          r(t.to),
          i(t.to),
        );
        break;
      case "close":
        o || e.closePath();
    }
  return !o;
}
function s(r, i, a) {
  let o = t(r, i, a);
  return e(o) ? o : n;
}
function c(e) {
  return Number.isFinite(e) ? Math.min(Math.max(e, 0), 1) : 1;
}
function l(e, t, n, i, a) {
  if (!(a > 0)) return !1;
  e.clearRect(0, 0, a, a);
  let o = r(t.box, a, a);
  if (!(o.scale > 0)) return !1;
  e.save(),
    (e.globalCompositeOperation = "source-over"),
    (e.lineCap = "round"),
    (e.lineJoin = "round");
  for (let r of t.steps) u(r, e, o, n, i);
  return e.restore(), !0;
}
function u(e, t, n, r, i) {
  switch ((t.save(), e.kind)) {
    case "fill":
      d(e.ink, e.opacity, t, r, i), o(t, n, e.parts), t.fill("nonzero");
      break;
    case "stroke": {
      d(e.ink, e.opacity, t, r, i);
      let a = Number.isFinite(e.width) ? Math.max(0, e.width) * n.scale : 0;
      if (!(a > 0)) break;
      (t.lineWidth = a), o(t, n, e.parts), t.stroke();
      break;
    }
    case "erase":
      (t.globalCompositeOperation = "destination-out"),
        (t.globalAlpha = 1),
        (t.fillStyle = "#000000"),
        o(t, n, e.parts),
        t.fill("nonzero");
      break;
    case "fillInside":
      if (!o(t, n, e.region)) break;
      t.clip("nonzero"),
        d(e.ink, e.opacity, t, r, i),
        o(t, n, e.parts),
        t.fill("nonzero");
  }
  t.restore();
}
function d(e, t, n, r, i) {
  let a = s(e, r, i);
  (n.globalAlpha = c(t)), (n.fillStyle = a), (n.strokeStyle = a);
}
export { r as n, o as r, l as t };
