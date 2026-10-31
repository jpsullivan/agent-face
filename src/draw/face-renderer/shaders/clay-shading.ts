// GLSL shared by the fragment programs: the ES 3.00 preamble and the clay
// library (SDF primitives, hand-warp noise, pigment and lighting model).

export const FRAGMENT_PREAMBLE = `#version 300 es
precision highp float;
precision highp int;
`;

export const CLAY_SHADING = `const int kCharacterTofu = 0;

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

const float kPitchSin = 0.23345;

const float kPitchCos = 0.97237;

const vec3 kKey = vec3(-0.59148, 0.63158, 0.50125);

const float kLump = 0.7;

const float kSheen = 1.0;

struct TofuColumn {
  float x;
  float hz;
  float tr;
  float tl;
  float lump;
  float round;
  float fillet;
  float flank;
};

struct ClayScene {
  int character;
  float seed;
  vec3 light;
  float pixel;
  float stepScale;
  bool near;
  vec3 warp;
  vec2 turn;
  vec3 albedo;
  float chroma;
  TofuColumn column;
};

ClayScene scene;

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
}

vec3 linearToSrgb(vec3 c) {
  c = max(c, vec3(0.0));
  return mix(12.92 * c, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

vec3 shoulderK(vec3 c, float knee) {
  c = max(c, vec3(1e-5));
  return c * pow(1.0 + pow(c / knee, vec3(1.5)), vec3(-2.0 / 3.0));
}

float cellHash(vec2 i) {
  vec3 p = fract(vec3(i.x, i.y, i.x) * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

vec2 noiseSlope(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float a = cellHash(i), b = cellHash(i + vec2(1.0, 0.0));
  float c = cellHash(i + vec2(0.0, 1.0)), d = cellHash(i + vec2(1.0, 1.0));
  vec2 t = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float k = a - b - c + d;
  return du * vec2(b - a + k * t.y, c - a + k * t.x);
}

vec2 unroll(vec2 p, float c, float s) {
  return vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
}

float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

float extrude(float d2, float z, float hz, float f) {
  vec2 w = vec2(d2 + f, abs(z) - hz + f);
  return min(max(w.x, w.y), 0.0) + length(max(w, vec2(0.0))) - f;
}

vec3 handWarp(vec3 p, float seed) {
  float a = 0.0036 * kLump, s = seed * 1.7;
  vec3 w = vec3(
    0.6 * sin(p.y * 8.3 + 1.1 + s) + 0.4 * sin(p.y * 17.0 + p.z * 5.0 + 4.0 + s),
    0.6 * sin(p.x * 7.1 + 2.3 + s) + 0.4 * sin(p.x * 15.3 + p.z * 6.0 + 0.7 + s),
    0.7 * sin(p.x * 5.3 + p.y * 4.1 + s)
  );
  return p + w * a;
}

float thumbPads(vec3 p, float seed) {
  vec3 s = p + vec3(0.37, 1.13, 0.71) * (seed + 1.0);
  vec3 a = vec3(s.x * 0.8 + s.y * 0.6, -s.x * 0.6 + s.y * 0.8, s.z) * 14.0
           + vec3(0.0, 1.3, 2.1);
  vec3 sa = sin(a);
  float lo = dot(sa, cos(a.yzx));
  vec3 b = vec3(s.x * 0.6 - s.z * 0.8, s.y, s.x * 0.8 + s.z * 0.6) * 29.0 + 1.3 * sa.zxy;
  float hi = dot(sin(b), cos(b.yzx));
  return 0.56 * (lo - 0.25 * lo * lo) + 0.34 * (hi - 0.20 * hi * hi);
}

vec2 pressSlope(vec2 q, vec2 c, vec2 ax, vec2 r) {
  q -= c;
  vec2 pa = vec2(-ax.y, ax.x);
  vec2 w = vec2(dot(q, ax), dot(q, pa)) / r;
  return exp(-dot(w, w)) * 2.0 * (w.x / r.x * ax + w.y / r.y * pa);
}

vec3 clayColorK(
  vec3 N, vec3 Nv, float shadow, float gain, float fill, float knee
) {
  float x = (dot(N, scene.light) + 0.2) / 1.2;
  float D = min(0.5 * (x + sqrt(x * x + 0.0020)), 1.0) * shadow;
  float facing = clamp(Nv.z, 0.0, 1.0);
  float rim = kSheen * pow(1.0 - facing, 2.6)
            * clamp(dot(Nv.xy, vec2(0.86, 0.50)) + 0.18, 0.0, 1.0);
  float top = (1.0 - facing) * clamp(Nv.y * 1.3, 0.0, 1.0) * (0.5 + 0.5 * shadow);
  float amb = 0.20 * (1.0 - 0.08 * clamp(-Nv.y, 0.0, 1.0)) * mix(0.62, 1.0, shadow) + fill;
  vec3 E = vec3(1.08, 0.96, 0.98) * amb + vec3(2.7 * D) + vec3(0.97, 1.0, 1.05) * 0.55 * rim
           + vec3(1.04, 1.0, 0.94) * (1.10 * kSheen * top);
  vec3 c = scene.albedo * E * gain + vec3(0.014) * D + vec3(0.050, 0.052, 0.056) * rim;
  float Y = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float band = smoothstep(0.02, 0.22, D) * (1.0 - smoothstep(0.30, 0.72, D));
  c = max(vec3(Y) + (c - vec3(Y)) * (1.0 + scene.chroma * band), vec3(0.0));
  return linearToSrgb(shoulderK(c, knee));
}

vec3 clayColor(
  vec3 N, vec3 Nv, float shadow, float gain, float fill
) {
  return clayColorK(N, Nv, shadow, gain, fill, 0.8);
}

vec3 swatchFit(vec3 tint, vec3 swatch, vec3 correction) {
  vec3 d = tint - swatch;
  return exp(-60.0 * dot(d, d)) * correction;
}

vec3 clayPigmentK(vec3 tint, float spared, out float chroma) {
  vec3 al = max(srgbToLinear(tint), vec3(0.018));
  al *= 1.0 - 0.24 * smoothstep(0.25, 0.50, min(tint.r, tint.g) - tint.b);
  float warmth = smoothstep(0.0, 0.35, tint.r - max(tint.g, tint.b));

  float hiT = max(tint.r, max(tint.g, tint.b)), loT = min(tint.r, min(tint.g, tint.b));
  float pale = 1.0 - smoothstep(0.10, 0.33, (hiT - loT) / max(hiT, 1e-3));
  float cool = (1.0 - warmth) * (1.0 - pale);
  float milled = mix(1.0, smoothstep(0.30, 0.55, (hiT - loT) / max(hiT, 1e-3)), spared);
  al = mix(al, vec3(dot(al, vec3(0.2126, 0.7152, 0.0722))), 0.30 * cool * milled)
     * (1.0 - 0.36 * cool);
  if (pale > 0.0) {
    float hiL = max(al.r, max(al.g, al.b)), loL = min(al.r, min(al.g, al.b));
    float knead = mix(1.0, max(0.6931 / max(-log(loL / hiL), 0.15), 1.0), pale);
    al = hiL * pow(al / hiL, vec3(knead)) * (1.0 - 0.30 * pale);
  }
  vec3 albedo = al * (1.0 + 0.5 * al);
  albedo *= 1.0
    + swatchFit(tint, vec3(0.192, 0.706, 0.498), vec3(0.215, -0.084, -0.037))
    + swatchFit(tint, vec3(0.376, 0.608, 0.910), vec3(0.002, 0.024, 0.114))
    + swatchFit(tint, vec3(0.580, 0.541, 0.898), vec3(-0.255, -0.272, -0.250))
    + swatchFit(tint, vec3(0.894, 0.431, 0.596), vec3(0.113, -0.006, -0.124));

  chroma = 0.04 + 0.25 * (1.0 - warmth) + 0.15 * pale;
  return albedo;
}

vec3 toView(vec3 N, float ca, float sa) {
  vec3 d = vec3(N.x, N.y * kPitchCos + N.z * kPitchSin, -N.y * kPitchSin + N.z * kPitchCos);
  return vec3(unroll(d.xy, ca, sa), d.z);
}

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r), k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 1e-4);
}

float smoothMax(float a, float b, float k) { return -smoothMin(-a, -b, k); }
`;
