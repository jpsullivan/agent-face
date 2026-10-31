console.assert("__eap_only__");
var e = {
    idle: 0,
    listening: 1,
    thinking: 2,
    speaking: 3,
    happy: 4,
    confused: 5,
    sleeping: 6,
    error: 7,
    surprised: 8,
  },
  t = {
    bowler: 1,
    partyHat: 3,
    nightcap: 4,
    cap: 12,
    beanie: 13,
    crown: 14,
    headphones: 15,
    topHat: 16,
    gradCap: 17,
    chefHat: 18,
    propeller: 19,
    wizard: 20,
    sprout: 21,
    hardHat: 22,
    flower: 23,
    cowboy: 24,
    antenna: 25,
    halo: 26,
    bow: 27,
  },
  n = {
    pencil: 5,
    hammer: 6,
    keyboard: 7,
    book: 8,
    magnifier: 9,
    pot: 10,
    blocks: 11,
  };
function r(e) {
  return e >= 5 && e <= 11;
}
function i(e) {
  return e === 2 || r(e) ? "face" : "head";
}
function a(e, r = null, i = !1) {
  let a = e === null ? 0 : t[e];
  return r === null ? { head: a, face: i ? 2 : 0 } : { head: a, face: n[r] };
}
function o(e) {
  return e === t.propeller ? 3.2 : e === t.partyHat ? 2.2 : 0;
}
var s = { kind: 0, progress: 0, age: 0, fling: [0, 0, 0, 0] };
function c(e) {
  let t = Number.parseInt(e.slice(1), 16);
  return [((t >> 16) & 255) / 255, ((t >> 8) & 255) / 255, (t & 255) / 255];
}
export { r as a, i as c, o as i, e as n, a as o, n as r, c as s, s as t };
