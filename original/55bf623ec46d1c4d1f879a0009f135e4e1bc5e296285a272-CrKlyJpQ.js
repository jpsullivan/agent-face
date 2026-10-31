console.assert("__eap_only__");
var e = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID & 1) << 2) - 1.0, float((gl_VertexID & 2) << 1) - 1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}
`,
  t = `#version 300 es
precision highp float;
precision highp int;
`,
  n = `const int kCharacterTofu = 0;

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
`,
  r = `layout(std140) uniform Token {
  vec2 center;
  float scale;
  float seed;
  vec4 shape;
  vec4 marks;
  vec4 thumb;
  vec4 finish;
  vec4 pose;
  vec4 tint;
  vec4 tint2;
  vec4 wafer;
  vec4 page;
} u;

const int kTokenGlyphFixed = TOKEN_GLYPH;
const int kTokenAny = -2;

const int kTokenPlain = -1;
const int kTokenChecklist = 0;
const int kTokenCalendar = 1;
const int kTokenEmail = 2;
const int kTokenDollarSign = 3;
const int kTokenChart = 4;
const int kTokenGlobe = 5;
const int kTokenMapPin = 6;
const int kTokenHome = 7;
const int kTokenBox = 8;
const int kTokenSlides = 9;
const int kTokenFolder = 10;
const int kTokenEdit = 11;
const int kTokenSearch = 12;
const int kTokenAsk = 13;
const int kTokenDieTick = 14;

const int kTokenClawd = 15;
const int kTokenCode = 16;

const float kTokenClayBody = 0.0;
const float kTokenClayRod = 1.0;
const float kTokenClayWafer = 2.0;

const vec3 kTokenInk = vec3(0.0065, 0.0065, 0.0060);

struct TokenKit {
  int glyph;
  float well;
  float relief;
  float thick;
  float tick;
  float wafer;
  float crack;
  float edge;
  vec2 wellAt;
  float whorlTurn;
  float whorlSeed;
  float face;
  float seed;
  float lump;
  float wob;
  float pixel;
  float lift;
  vec3 light;

  vec3 boil;
  vec2 boil0, boil1;
  float boilDeep, boilOut, boilKeep, boilMix0, boilMix1;
  float pale;
  float casting;
  float clay;
  float ink;
  float scored;
};

vec2 tokenTurn(vec2 p, float a) { return unroll(p, cos(a), sin(a)); }

void tokenBoil(inout TokenKit kit, float state) {
  float on = step(0.25, state), whole = floor(state), part = 1.5707963 * (state - whole);
  kit.boil = vec3(
    2.6 * sin(0.83 * state + 0.7) + 1.9 * sin(0.31 * state + 2.9) + 1.3 * sin(1.27 * state + 4.1),
    2.4 * sin(0.71 * state + 3.3) + 2.0 * sin(0.43 * state + 0.4) + 1.2 * sin(1.39 * state + 1.9),
    2.5 * sin(0.77 * state + 5.0) + 1.8 * sin(0.37 * state + 1.2) + 1.4 * sin(1.19 * state + 2.6)
  );
  kit.boilDeep = on * 0.0270;
  kit.boilOut = on * 0.0022;
  kit.boilKeep = mix(1.0, 0.77, on);
  kit.boilMix0 = on * 0.64 * cos(part);
  kit.boilMix1 = on * 0.64 * sin(part);
  kit.boil0 = 3.0 + 40.0 * fract((whole + 1.0) * vec2(0.3819660, 0.7236068));
  kit.boil1 = 3.0 + 40.0 * fract((whole + 2.0) * vec2(0.3819660, 0.7236068));
}

vec3 tokenBoiled(inout TokenKit kit, vec3 p) {
  return p + kit.boilDeep * vec3(
    sin(p.y * 7.3 + p.z * 3.1 + kit.boil.x) + 0.6 * sin(p.y * 15.1 - p.x * 6.0 + kit.boil.z * 1.9),
    sin(p.x * 6.1 + p.z * 2.7 + kit.boil.y) + 0.6 * sin(p.x * 13.3 + p.y * 7.0 + kit.boil.x * 2.3),
    sin(p.x * 5.3 + p.y * 6.7 + kit.boil.z)
  );
}

vec3 tokenWarp(inout TokenKit kit, vec3 p) {
  vec3 w = mix(p, handWarp(p, kit.seed), kit.wob * kit.lump / kLump);
  return w + kit.boilOut * vec3(
    sin(p.y * 10.7 + kit.boil.x) + 0.5 * sin(p.y * 23.0 + p.z * 4.0 + kit.boil.z * 1.3),
    sin(p.x * 9.1 + kit.boil.y) + 0.5 * sin(p.x * 19.0 + p.z * 5.0 + kit.boil.x * 1.7),
    0.0
  );
}

float tokenArc(vec2 q, vec2 c, float r, float a0, float a1) {
  q = tokenTurn(q - c, 0.5 * (a0 + a1));
  float span = 0.5 * (a1 - a0);
  if (abs(atan(q.y, q.x)) < span) { return abs(length(q) - r); }
  vec2 e = r * vec2(cos(span), sin(span));
  return min(length(q - e), length(q - vec2(e.x, -e.y)));
}

float tokenCone(vec2 p, float r1, float r2, float h) {
  p.x = abs(p.x);
  float b = (r1 - r2) / h, a = sqrt(1.0 - b * b), k = dot(p, vec2(-b, a));
  if (k < 0.0) { return length(p) - r1; }
  if (k > a * h) { return length(p - vec2(0.0, h)) - r2; }
  return dot(p, vec2(a, b)) - r1;
}

float tokenTriangle(vec2 p, vec2 q) {
  p.x = abs(p.x);
  vec2 a = p - q * clamp(dot(p, q) / dot(q, q), 0.0, 1.0);
  vec2 b = p - q * vec2(clamp(p.x / q.x, 0.0, 1.0), 1.0);
  float s = -sign(q.y);
  vec2 d = min(
    vec2(dot(a, a), s * (p.x * q.y - p.y * q.x)), vec2(dot(b, b), s * (p.y - q.y))
  );
  return -sqrt(d.x) * sign(d.y);
}

vec2 tokenLean(vec2 q) {
  q.x += 0.012 * q.y * q.y / 0.19 - 0.006 * q.y;
  return q;
}
float tokenDisc(vec2 q, float R, float seed) {
  float a = atan(q.y, q.x);
  float k = 1.0 + 0.030 * sin(3.0 * a + seed * 1.3) + 0.020 * sin(5.0 * a + 2.1 * seed + 1.0)
          + 0.012 * sin(8.0 * a + 0.7 * seed);
  return length(tokenLean(q)) - R * k;
}
float tokenCard(vec2 q, vec2 b, float r) {
  q = tokenLean(q);
  return sdRoundedRect(q, b, r * (1.0 + 0.05 * q.x - 0.04 * q.y * sign(q.x)));
}

float tokenBox(vec2 l, vec2 c, vec2 b, float r) {
  return sdRoundedRect(l - c, b, r * (1.0 + 0.05 * l.x - 0.04 * l.y * sign(l.x)));
}

float tokenChevron(vec2 q, vec2 tip, vec2 arm) {
  return min(sdSegment(q, tip + arm, tip), sdSegment(q, tip, tip + vec2(arm.x, -arm.y)));
}

float tokenClawd(vec2 q, out float torso) {
  vec2 l = tokenLean(q), a = vec2(abs(l.x), l.y);
  torso = tokenBox(l, vec2(0.0, 0.070), vec2(0.280, 0.210), 0.050);
  float arm = sdRoundedRect(a - vec2(0.345, 0.070), vec2(0.075, 0.070), 0.034);
  float legs = min(
    sdRoundedRect(a - vec2(0.245, -0.195), vec2(0.036, 0.085), 0.028),
    sdRoundedRect(a - vec2(0.105, -0.195), vec2(0.036, 0.085), 0.028)
  );
  return smoothMin(smoothMin(torso, arm, 0.020), legs, 0.018);
}

float tokenClawdEyes(vec2 q) {
  vec2 l = tokenLean(q);
  return sdRoundedRect(vec2(abs(l.x) - 0.175, l.y - 0.172), vec2(0.044), 0.0123);
}

float tokenBlank(vec3 p, float d2, float hz, float zAdd, float reach, float fillet) {
  float zr = p.z - hz;
  float e = clamp(1.0 + d2 / (0.55 * reach), 0.0, 1.0);
  float front = mix(0.45, 1.0, smoothstep(-hz, 0.3 * hz, zr));
  return extrude(d2, zr + (0.55 * hz * e * e * e + zAdd) * front, hz, fillet);
}

float tokenStamp(float g, float depth) {
  return depth * (1.0 - smoothstep(-0.011, 0.011, g))
       - 0.16 * abs(depth) * exp(-g * g / (0.030 * 0.030)) * step(0.0, g * sign(depth));
}

float tokenBowl(
  vec2 q, vec2 c, float rot, float depth, vec2 radii, out float reach
) {
  vec2 w = tokenTurn(q - c, rot) / radii;
  reach = dot(w, w);
  float lw = sqrt(reach);
  return depth * exp(-reach) - 0.24 * depth * exp(-(lw - 1.45) * (lw - 1.45) / 0.20);
}

float tokenMark(vec2 q, int glyph) {
  switch (glyph) {
  case kTokenChecklist: {
    float d = 1e9;
    for (int i = 0; i < 3; i++) {
      float y = 0.165 - 0.165 * float(i);
      d = min(d, min(
        sdRoundedRect(q - vec2(0.070, y), vec2(0.150, 0.031), 0.020),
        length(q - vec2(-0.195, y)) - 0.044
      ));
    }
    return d;
  }
  case kTokenCalendar: {
    float d = sdRoundedRect(q - vec2(0.0, 0.140), vec2(0.265, 0.028), 0.018);
    for (int i = 0; i < 3; i++) {
      float x = -0.170 + 0.170 * float(i);
      d = min(d, min(
        length(q - vec2(x, -0.040)) - 0.044, length(q - vec2(x, -0.200)) - 0.044
      ));
    }
    return d;
  }
  case kTokenEmail:
    return min(
      sdSegment(q, vec2(-0.345, 0.205), vec2(0.0, -0.045)),
      sdSegment(q, vec2(0.0, -0.045), vec2(0.345, 0.205))
    ) - 0.032;
  case kTokenDollarSign:
    return min(
      min(
        tokenArc(q, vec2(0.0, 0.090), 0.090, 0.45, 4.712),
        tokenArc(q, vec2(0.0, -0.090), 0.090, -2.69, 1.571)
      ),
      sdSegment(q, vec2(0.0, -0.255), vec2(0.0, 0.255))
    ) - 0.030;
  case kTokenChart:
  case kTokenGlobe:
  case kTokenMapPin:
    return length(q - vec2(0.0, 0.125)) - 0.105;
  case kTokenHome:
    return sdRoundedRect(q - vec2(0.0, -0.225), vec2(0.068, 0.115), 0.045);
  case kTokenBox:
    return min(
      sdRoundedRect(q - vec2(0.0, 0.085), vec2(0.42, 0.024), 0.010),
      sdRoundedRect(q - vec2(0.0, 0.240), vec2(0.055, 0.160), 0.020)
    );
  case kTokenSlides:
    return min(
      sdRoundedRect(q - vec2(-0.105, 0.185), vec2(0.150, 0.028), 0.018),
      sdRoundedRect(q - vec2(0.0, 0.045), vec2(0.255, 0.028), 0.018)
    );
  case kTokenFolder:
    return sdRoundedRect(q - vec2(0.0, 0.105), vec2(0.345, 0.024), 0.012);
  case kTokenEdit: {
    vec2 r = tokenTurn(q, 0.7853982);
    float b = max(
      abs(r.y) - 0.060 * clamp((r.x + 0.335) / 0.150, 0.0, 1.0), max(-0.335 - r.x, r.x - 0.300)
    );
    return max(b, -(abs(r.x - 0.205) - 0.013));
  }
  case kTokenSearch:
    return length(q - vec2(-0.055, 0.055)) - 0.185;
  case kTokenAsk:
    return min(
      min(
        tokenArc(q, vec2(0.0, 0.105), 0.095, -1.05, 3.05),
        sdSegment(q, vec2(0.0473, 0.0227), vec2(0.0, -0.045))
      ),
      length(q - vec2(0.0, -0.175)) - 0.010
    ) - 0.034;
  case kTokenClawd:
    return tokenClawdEyes(q);
  case kTokenCode: {

    float prompt = min(
      tokenChevron(q, vec2(-0.100, -0.068), vec2(-0.155, 0.116)) - 0.035,
      sdRoundedRect(q - vec2(0.105, -0.178), vec2(0.108, 0.032), 0.016)
    );
    float dots = min(
      length(q - vec2(-0.315, 0.258)),
      min(length(q - vec2(-0.245, 0.258)), length(q - vec2(-0.175, 0.258)))
    ) - 0.021;
    float rule = sdRoundedRect(q - vec2(0.0, 0.180), vec2(0.46, 0.024), 0.010);
    return min(prompt, min(rule, dots));
  }
  default:
    return min(
      sdSegment(q, vec2(-0.150, -0.010), vec2(-0.045, -0.115)),
      sdSegment(q, vec2(-0.045, -0.115), vec2(0.165, 0.125))
    ) - 0.044;
  }
}

float tokenOutline(vec2 q, int glyph, float seed) {
  switch (glyph) {
  case kTokenChecklist:
    return tokenCard(q, vec2(0.350, 0.390), 0.110);
  case kTokenCalendar:

    return smoothMin(
      tokenCard(q - vec2(0.0, -0.025), vec2(0.370, 0.335), 0.100),
      min(
        sdRoundedRect(q - vec2(-0.170, 0.330), vec2(0.042, 0.078), 0.040),
        sdRoundedRect(q - vec2(0.170, 0.330), vec2(0.042, 0.078), 0.040)
      ),
      0.020
    );
  case kTokenEmail:
    return tokenCard(q, vec2(0.420, 0.300), 0.090);
  case kTokenChart: {

    float b1 = sdRoundedRect(q - vec2(-0.215, -0.150), vec2(0.080, 0.110), 0.055);
    float b2 = sdRoundedRect(q - vec2(0.0, 0.010), vec2(0.080, 0.270), 0.055);
    float b3 = sdRoundedRect(q - vec2(0.215, -0.075), vec2(0.080, 0.185), 0.055);
    return smoothMin(
      min(b1, min(b2, b3)), sdRoundedRect(q - vec2(0.0, -0.318), vec2(0.375, 0.052), 0.046),
      0.030
    );
  }
  case kTokenGlobe:
    return length(q) - 0.385;
  case kTokenMapPin:

    return tokenCone(vec2(q.x, 0.125 - q.y), 0.270, 0.036, 0.520);
  case kTokenHome:

    return smoothMin(
      sdRoundedRect(q - vec2(0.0, -0.150), vec2(0.295, 0.215), 0.055),
      tokenTriangle(q - vec2(0.0, 0.385), vec2(0.345, -0.285)) - 0.045,
      0.035
    );
  case kTokenBox:
    return tokenCard(q, vec2(0.355, 0.355), 0.085);
  case kTokenSlides:

    return smoothMin(
      smoothMin(
        tokenCard(q - vec2(0.0, 0.085), vec2(0.420, 0.270), 0.070),
        sdRoundedRect(q - vec2(0.0, -0.255), vec2(0.042, 0.085), 0.030),
        0.025
      ),
      sdRoundedRect(q - vec2(0.0, -0.348), vec2(0.170, 0.042), 0.036),
      0.025
    );
  case kTokenFolder:

    return smoothMin(
      tokenCard(q - vec2(0.0, -0.050), vec2(0.400, 0.275), 0.070),
      sdRoundedRect(q - vec2(-0.200, 0.250), vec2(0.170, 0.080), 0.058),
      0.030
    );
  case kTokenClawd: {

    float torso;
    return tokenClawd(q, torso);
  }
  case kTokenCode:

    return tokenCard(q, vec2(0.412, 0.320), 0.080);
  case kTokenSearch:

    return smoothMin(
      tokenDisc(q - vec2(-0.055, 0.055), 0.325, seed),
      sdSegment(q, vec2(0.170, -0.170), vec2(0.352, -0.352)) - 0.076,
      0.030
    );
  default:
    return tokenDisc(q, 0.400, seed);
  }
}

float tokenGlobe(inout TokenKit kit, vec3 p, float squash) {
  const float R = 0.370;
  vec3 q = p - vec3(0.0, 0.0, 0.62 * R * squash);
  q.z /= 0.74 * squash;
  float r = length(q);
  vec3 u = q / (r + 1e-5);
  float k = 1.0 + 0.016 * kit.lump * (
    sin(u.x * 3.1 + u.y * 2.3 + 0.8 + kit.seed) * sin(u.y * 3.7 - u.z * 1.9 + 2.0)
    + 0.6 * sin(u.x * 5.3 - u.y * 4.1 + u.z * 3.0 + 1.0)
  );
  float d = (r - R * k) * 0.74 * min(squash, 1.0);
  float g1 = abs(dot(q, normalize(vec3(0.0, 1.0, 0.30))));
  float g3 = abs(dot(q, normalize(vec3(0.66, 0.0, 0.75))));
  float g4 = abs(dot(q, normalize(vec3(-0.66, 0.0, 0.75))));
  float tube = length(vec2(min(g1, min(g3, g4)), r - R)) - mix(0.017, 0.022, kit.pale);
  kit.scored = 1.0 - smoothstep(-0.004, 0.012, tube);
  d = smoothMax(d, -tube * 0.74, 0.018);
  return smoothMax(d, -p.z, 0.020);
}

float tokenWafer(inout TokenKit kit, vec3 p, float R, float hz, float variant, float depth) {
  vec2 q = p.xy;
  float g = min(
    length(q - vec2(-0.34 * R, 0.10 * R)), length(q - vec2(0.34 * R, 0.10 * R))
  ) - 0.19 * R;
  float zAdd = tokenStamp(g, depth);
  if (variant > 0.5 && variant < 1.5) {
    float outline = abs(
      sdRoundedRect(q - vec2(0.0, 0.03 * R), vec2(0.70 * R, 0.60 * R), 0.32 * R)
    ) - 0.040 * R;
    zAdd += tokenStamp(outline, 0.5 * depth);
  }
  if (variant > 1.5) {
    float outline = abs(length(q) - 0.70 * R * (1.0 + 0.12 * cos(6.0 * atan(q.y, q.x)))) - 0.040 * R;
    zAdd += tokenStamp(outline, 0.5 * depth);
  }
  return tokenBlank(p, tokenDisc(q, R, kit.seed), hz, zAdd, R, min(0.6 * hz, 0.018));
}

float tokenCrack(vec2 q, float seed) {
  vec2 r = tokenTurn(q, seed * 2.0);
  float g = min(
    sdSegment(r, vec2(0.37, 0.21), vec2(0.155, 0.090)),
    min(
      sdSegment(r, vec2(0.155, 0.090), vec2(0.110, -0.050)),
      sdSegment(r, vec2(0.110, -0.050), vec2(-0.020, -0.130))
    )
  );
  return 0.026 * (1.0 - smoothstep(0.0, 0.015, g));
}

float tokenRod(
  vec3 p, vec2 a, vec2 b, float r, float bend, float pressed, float zc, float phase
) {
  vec2 ba = b - a;
  float L = length(ba);
  vec2 d = ba / L, n = vec2(-d.y, d.x), pa = p.xy - a;
  float h = clamp(dot(pa, d), 0.0, L), u = h / L;
  vec2 c = pa - d * h - n * bend * 4.0 * u * (1.0 - u);
  float rr = r * (0.93 + 0.07 * sin(u * 9.0 + phase) + 0.05 * sin(u * 21.0 + 2.0 * phase))
           * mix(0.86, 1.0, smoothstep(0.0, 0.18, min(u, 1.0 - u)));
  return length(vec3(c, (p.z - zc) * pressed)) - rr;
}

float tokenSolid(inout TokenKit kit, vec3 p) {
  int glyph = kit.glyph;
  float thick = max(kit.thick, 0.25);
  if (kit.edge > 0.001) {

    float c = cos(kit.edge), s = sin(kit.edge);
    vec2 yz = vec2(p.y + 0.40, p.z);
    p = vec3(p.x, c * yz.x + s * yz.y - 0.40, -s * yz.x + c * yz.y);
  }
  vec2 q = p.xy, at = kit.wellAt;
  float d, reach = 9.0, hz = 0.085 * thick;
  kit.clay = kTokenClayBody;
  kit.ink = 0.0;
  vec2 radii = vec2(0.150, 0.105);
  float bowl = 0.0;
  if (kit.well > 0.0005) { bowl = tokenBowl(q, at, 0.5 + kit.whorlTurn, kit.well, radii, reach); }
  if (glyph == kTokenGlobe) {
    hz = 0.2516 * thick;
    d = tokenGlobe(kit, p, thick);
    if (kit.well > 0.0005) {
      vec3 e = p - vec3(at, 2.0 * hz + 0.080 - 1.7 * kit.well);
      e.xy = tokenTurn(e.xy, 0.5 + kit.whorlTurn);
      d = smoothMax(d, -sdEllipsoid(e, vec3(radii, 0.080)), 0.030);
    }
  } else {
    if (glyph == kTokenDollarSign || glyph == kTokenBox) { hz = 0.105 * thick; }
    if (glyph == kTokenChart) { hz = 0.098 * thick; }
    if (glyph == kTokenClawd) { hz = 0.092 * thick; }
    float outline = tokenOutline(q, glyph, kit.seed);

    float zAdd = bowl + 0.0085 * kit.lump * (
      sin(q.x * 9.0 + kit.seed * 2.0) * sin(q.y * 8.0 + 1.3 + kit.seed)
      + 0.6 * sin(q.x * 5.0 - q.y * 6.5 + kit.seed)
    );
    if (glyph > kTokenPlain && kit.relief > 0.001 && glyph != kTokenChart) {
      float g = tokenMark(q, glyph);
      float depth = 0.045;
      if (glyph == kTokenDollarSign) { depth = -0.034; }
      if (glyph == kTokenEdit) { depth = -0.042; }
      if (glyph == kTokenSearch) { depth = 0.030; }
      if (glyph == kTokenMapPin) { depth = 0.052; }
      if (glyph == kTokenClawd) { depth = 0.050; }
      float mark = tokenStamp(g, depth);

      if (glyph == kTokenEdit) { mark = tokenStamp(g - 0.012, 0.012); }

      if (glyph == kTokenSearch) { mark -= 0.024 * exp(-(g - 0.036) * (g - 0.036) / (0.024 * 0.024)); }

      if (glyph == kTokenDollarSign) { mark += tokenStamp(abs(length(q) - 0.335) - 0.030, -0.020); }
      if (glyph == kTokenMapPin) {

        vec2 head = q - vec2(0.0, 0.125);
        mark -= 0.034 * exp(-dot(head, head) / (0.24 * 0.24));
      }

      zAdd += mark * kit.relief * (1.0 - clamp(kit.well / 0.035, 0.0, 1.0) * exp(-0.7 * reach));
    }
    if (glyph == kTokenClawd) {
      float torso;
      tokenClawd(q, torso);
      zAdd += 0.030 * smoothstep(0.0, 0.030, torso);

      kit.ink = kit.relief * (1.0 - smoothstep(-0.013, 0.003, tokenClawdEyes(q)))
              * (1.0 - clamp(kit.well / 0.035, 0.0, 1.0) * exp(-0.7 * reach));
    }

    if (glyph == kTokenCode) { zAdd += 0.014 * smoothstep(0.170, 0.200, q.y); }
    if (glyph == kTokenChart && kit.relief > 0.001) {

      vec2 t1 = q - vec2(-0.215, -0.075), t2 = q - vec2(0.0, 0.235), t3 = q - vec2(0.215, 0.075);
      zAdd += kit.relief * 0.030
            * (exp(-dot(t1, t1) / 0.0070) + exp(-dot(t2, t2) / 0.0070) + exp(-dot(t3, t3) / 0.0070));
    }
    if (kit.crack > 0.001) { zAdd += kit.crack * tokenCrack(q, kit.seed); }
    if (kit.face > 0.5) {

      float g = min(length(q - vec2(-0.105, -0.165)), length(q - vec2(0.105, -0.165))) - 0.046;
      zAdd += tokenStamp(g, 0.034);
    }
    if (kit.tick > 1.5) { zAdd += tokenStamp(tokenMark((q - at) / 0.95, kTokenDieTick) * 0.95, 0.045); }
    if (kit.tick > 0.5 && kit.tick < 1.5) {

      vec2 t = (q - at) / 0.62;
      float groove = min(
        sdSegment(t, vec2(-0.255, 0.015), vec2(-0.085, -0.165)),
        sdSegment(t, vec2(-0.085, -0.165), vec2(0.275, 0.215))
      ) * 0.62 - 0.048;
      zAdd += tokenStamp(groove, 0.014);
    }
    d = tokenBlank(p, outline, hz, zAdd, 0.340, 0.050);
    if (glyph == kTokenEdit && kit.relief > 0.5) {

      vec2 r = tokenTurn(q, 0.7853982);
      float radius = 0.060 * clamp((r.x + 0.345) / 0.150, 0.04, 1.0)
                   * (1.0 - 0.22 * exp(-(r.x - 0.205) * (r.x - 0.205) / 0.00022));
      float along = clamp(r.x, -0.335, 0.290);
      float pencil = length(
        vec3(r.x - along, r.y, (p.z - (2.0 * hz - 0.004 + 0.30 * radius)) * 1.30)
      ) - radius;
      d = smoothMin(d, pencil, 0.010);
    }
  }
  if (kit.tick > 0.5 && kit.tick < 1.5) {

    const float s = 0.62, r = 0.060;
    float rz = r * s / 1.45;
    vec3 t = vec3((q - at) / s, p.z / s);
    float zc = (2.0 * hz - kit.well + 0.42 * rz) / s;
    float rods = tokenRod(
      t, vec2(-0.255, 0.015), vec2(-0.085, -0.165), r * 0.96, 0.010, 1.45, zc, kit.seed + 5.0
    );
    rods = smoothMin(
      rods,
      tokenRod(t, vec2(-0.085, -0.165), vec2(0.275, 0.215), r, -0.014, 1.45, zc, kit.seed + 7.0),
      0.030
    );
    vec2 f1 = t.xy - vec2(-0.170, -0.075), f2 = t.xy - vec2(0.060, -0.010);
    vec2 f3 = t.xy - vec2(0.205, 0.145);
    float cut = max(
      exp(-dot(f1, f1) / 0.0036), max(exp(-dot(f2, f2) / 0.0042), exp(-dot(f3, f3) / 0.0036))
    );
    rods = smoothMax(rods, t.z - (zc + r / 1.45 - 0.30 * r * cut), 0.020) * s;
    if (rods < d) {
      d = rods;
      kit.clay = kTokenClayRod;
    }
  }

  if (kit.wafer > 0.5 && kit.casting < 0.5) {
    float wafer = tokenWafer(
      kit, p - vec3(0.205, -0.200, 2.0 * hz - 0.026), 0.118, 0.020,
      floor(fract(kit.wafer) * 10.0 + 0.5), 0.022
    );
    if (wafer < d) {
      d = wafer;
      kit.clay = kTokenClayWafer;
    }
  }
  return d;
}

const float kTokenStepScale = 2.0;

float tokenMap(inout TokenKit kit, vec3 p) {
  p.z -= kit.lift;
  float d = tokenSolid(kit, tokenWarp(kit, p)) / kTokenStepScale;
  float pads = 0.0036 * kit.lump;
  if (d < 0.014) {
    d -= pads * thumbPads(tokenBoiled(kit, p), kit.seed);
  } else {
    d -= pads * 1.2;
  }
  return d;
}

vec3 tokenNormal(inout TokenKit kit, vec3 p, float d0) {
  const float e = 0.0024;
  return normalize(vec3(
    tokenMap(kit, p + vec3(e, 0.0, 0.0)), tokenMap(kit, p + vec3(0.0, e, 0.0)),
    tokenMap(kit, p + vec3(0.0, 0.0, e))
  ) - d0);
}

float tokenShadow(inout TokenKit kit, vec3 P) {
  float lit = 1.0, t = 0.012;
  for (int i = 0; i < 22; i++) {
    float h = tokenMap(kit, P + kit.light * t);
    lit = min(lit, smoothstep(0.0, 1.0, 0.5 + h / (0.12 * t + 0.008)));
    t += clamp(h, 0.012, 0.075);
    if (lit < 0.02 || t > 1.1) { break; }
  }
  return lit;
}

vec2 tokenCast(inout TokenKit kit, vec3 P) {

  float relief = kit.relief;
  kit.relief = 0.0;
  kit.casting = 1.0;
  float lit = 1.0, t = 0.010, at = 0.0;
  for (int i = 0; i < 32; i++) {
    float h = tokenMap(kit, P + kit.light * t);
    float r = smoothstep(0.0, 1.0, 0.5 + h / (0.22 * t + 0.006));
    if (r < lit) {
      lit = r;
      at = t;
    }
    t += clamp(0.7 * h, 0.008, 0.045);
    if (lit < 0.02 || t > 1.0) { break; }
  }
  kit.relief = relief;
  kit.casting = 0.0;
  return vec2(lit, at);
}

vec3 tokenRelief(inout TokenKit kit, vec3 p) {
  p = tokenBoiled(kit, p);
  vec2 uv = p.xy + p.z * vec2(0.37, 0.53) + kit.seed * 3.1 + 20.0;
  vec2 g = 0.85 * 4.4 * (
      kit.boilKeep * noiseSlope(uv * 4.4) + kit.boilMix0 * noiseSlope(uv * 4.4 + kit.boil0)
      + kit.boilMix1 * noiseSlope(uv * 4.4 + kit.boil1)
    )
    + 0.34 * 11.0 * (
      kit.boilKeep * noiseSlope(uv * 11.0 + 7.3)
      + kit.boilMix0 * noiseSlope(uv * 11.0 + 7.3 + kit.boil0.yx)
      + kit.boilMix1 * noiseSlope(uv * 11.0 + 7.3 + kit.boil1.yx)
    );
  const vec2 along = vec2(0.1395, 0.990), across = vec2(0.990, -0.1395);
  vec2 v = vec2(dot(uv, across), dot(uv, along));
  vec2 gs = noiseSlope(vec2(v.x * 36.0 + 2.5 * sin(v.y * 3.7), v.y * 2.4));
  vec2 gv = vec2(gs.x * 36.0, gs.x * 9.25 * cos(v.y * 3.7) + gs.y * 2.4);
  g += 0.065 * (across * gv.x + along * gv.y);
  if (kit.pixel < 0.004) { g += 0.085 * 27.0 * noiseSlope(uv * 27.0 + 2.9); }
  return vec3(g, 0.37 * g.x + 0.53 * g.y);
}

vec2 tokenMarks(inout TokenKit kit, vec3 p) {
  vec2 g = vec2(0.0);
  if (kit.well > 0.004 && kit.glyph != kTokenGlobe) {
    vec2 w = tokenTurn(p.xy - kit.wellAt, 0.5 + kit.whorlTurn) / vec2(0.150, 0.105);
    float reach = dot(w, w), print = kit.whorlSeed;
    vec2 v = w - vec2(0.10 + 0.16 * sin(print * 6.283), -0.12 + 0.14 * cos(print * 9.1));
    float rr = length(v) + 1e-4;
    float ridges = 11.5 + 3.5 * fract(print * 7.3);
    float shows = smoothstep(3.0, 5.0, 0.060 / kit.pixel);
    g += shows * exp(-reach * 1.3) * 0.75 * min(kit.well / 0.045, 1.0)
       * cos(ridges * rr + 2.0 * sin(v.x * 2.0 + print * 5.0) + 2.0 * sin(print * 12.9) * v.y)
       * ridges * (v / rr) / 0.125;
  }
  g += 0.8 * pressSlope(p.xy, vec2(-0.20, 0.21), vec2(0.80, 0.60), vec2(0.105, 0.058))
     + 0.6 * pressSlope(p.xy, vec2(0.20, -0.18), vec2(0.94, -0.34), vec2(0.110, 0.055));
  return g;
}

vec3 tokenTrimPigment(vec3 tint, out float chroma) {
  vec3 al = max(srgbToLinear(tint), vec3(0.018));
  al *= 1.0 - 0.24 * smoothstep(0.25, 0.50, min(tint.r, tint.g) - tint.b);
  float cool = 1.0 - smoothstep(0.0, 0.35, tint.r - max(tint.g, tint.b));
  al = mix(al, vec3(dot(al, vec3(0.2126, 0.7152, 0.0722))), 0.30 * cool) * (1.0 - 0.36 * cool);
  chroma = 0.04 + 0.25 * cool;
  return al * (1.0 + 0.5 * al);
}

vec3 tokenFacing(vec3 Nv, float z) {
  return vec3(normalize(Nv.xy + vec2(1e-6)) * sqrt(max(1.0 - z * z, 0.0)), z);
}

vec4 tokenPixel(inout TokenKit kit, vec2 s, vec2 pixelAt) {
  vec4 pose = u.pose;
  float bound = u.wafer.w;
  float ca = cos(pose.x), sa = sin(pose.x);
  vec2 q = vec2(ca * s.x - sa * s.y, sa * s.x + ca * s.y) / pose.yz;
  kit.lift = max(pose.w, 0.0);
  vec2 key = vec2(ca * kKey.x - sa * kKey.y, sa * kKey.x + ca * kKey.y);
  kit.light = vec3(key.x, key.y * kPitchCos - kKey.z * kPitchSin, key.y * kPitchSin + kKey.z * kPitchCos);
  float fromMiddle = length(q - vec2(0.10, -0.10) * bound);
  if (fromMiddle > bound * 1.30) { return vec4(0.0); }

  scene.character = kCharacterTofu;
  scene.light = kit.light;
  scene.albedo = clayPigmentK(u.tint.rgb, 1.0, scene.chroma);

  float zStart = 0.95 + kit.lift, px = kit.pixel;
  vec3 ro = vec3(q.x, q.y * kPitchCos - zStart * kPitchSin, q.y * kPitchSin + zStart * kPitchCos);
  vec3 rd = vec3(0.0, kPitchSin, -kPitchCos);
  float t = 0.0, nearest = 1e9, tNearest = 0.0, dLast = 0.0, dNearest = 0.0;
  bool hit = false, gone = false;
  float hitEps = max(0.0006, 0.3 * px), minStep = max(0.0022, 0.6 * px);
  for (int i = 0; i < 64; i++) {
    vec3 pp = ro + rd * t;
    float d = tokenMap(kit, pp);
    dLast = d;
    if (d * kTokenStepScale < nearest) {
      nearest = d * kTokenStepScale;
      tNearest = t;
      dNearest = d;
    }
    if (d < hitEps) {
      hit = true;
      break;
    }
    t += max(d * 0.9, minStep);
    if (pp.z < -0.02 || t > zStart + 0.9) {
      gone = true;
      break;
    }
  }
  if (!hit && !gone && dLast < 0.004) { hit = true; }

  float bodyA = hit ? 1.0 : 1.0 - smoothstep(0.0, 1.5 * px, nearest);
  vec3 rgb = vec3(0.0);
  if (bodyA > 0.0) {
    vec3 p = ro + rd * (hit ? t : tNearest);
    vec3 Nb = tokenNormal(kit, p, hit ? dLast : dNearest);
    tokenMap(kit, p);
    float clay = kit.clay, scored = kit.scored, ink = kit.ink;
    vec3 onPage = p - vec3(0.0, 0.0, kit.lift);
    float lit = smoothstep(-0.12, 0.42, dot(Nb, kit.light));
    vec3 slope = 0.020 * kit.lump * mix(0.12, 1.0, lit) * tokenRelief(kit, onPage)
                 + vec3(0.0105 * kit.lump * mix(0.30, 1.0, lit) * tokenMarks(kit, onPage), 0.0);
    vec3 N = normalize(Nb - (slope - Nb * dot(slope, Nb)));
    vec3 Nv = toView(N, ca, sa);
    float shade = tokenShadow(kit, p + Nb * 0.006);

    float nearPage = exp(-max(p.z, 0.0) / 0.030);
    if (clay > 1.5) {
      scene.albedo = tokenTrimPigment(u.wafer.rgb, scene.chroma);
    } else if (clay > 0.5) {
      scene.albedo = tokenTrimPigment(u.tint2.rgb, scene.chroma);
    }
    if (ink > 0.001) {
      scene.albedo = mix(scene.albedo, kTokenInk, ink);
      scene.chroma = mix(scene.chroma, 0.10, ink);
    }
    float matte = u.finish.x;
    if (matte > 0.001) { Nv = tokenFacing(Nv, 1.0 - mix(1.0, 0.78, matte) * (1.0 - Nv.z)); }
    rgb = clayColor(N, Nv, shade, 1.0, 0.0) * (1.0 - 0.28 * nearPage * (1.0 - 0.5 * lit));

    if (kit.glyph == kTokenGlobe) { rgb *= 1.0 - 0.25 * kit.pale * scored; }
  }

  float shadowA = 0.0;
  vec3 shadowC = vec3(0.0);
  if (bodyA < 1.0) {
    vec3 P = ro + rd * (ro.z / kPitchCos);
    P.z = 0.0008;
    vec2 thrown = tokenCast(kit, P);
    float occluded = 1.0 - mix(1.0, thrown.x, 1.0 - smoothstep(0.30, 0.85, thrown.y));
    float dPage = tokenMap(kit, P + vec3(0.0, 0.0, 0.004));
    float toward = tokenMap(kit, P + vec3(normalize(kit.light.xy) * 0.020, 0.004));
    float contact = exp(-max(dPage, 0.0) / 0.016)
                  * mix(0.30, 1.0, smoothstep(-0.004, 0.010, dPage - toward));
    float edge = 1.0 - smoothstep(0.80, 1.0, fromMiddle / (bound * 1.30));
    vec3 deep = linearToSrgb(scene.albedo * 0.23);
    shadowA = clamp(0.56 * occluded + 0.62 * contact, 0.0, 0.92) * edge;
    shadowC = u.page.rgb * mix(vec3(0.45, 0.375, 0.315), deep, 0.30);
    if (u.finish.w > 0.5) {

      float core = clamp(0.29 * contact + 0.20 * occluded, 0.0, 0.55) * edge;
      float side = smoothstep(-0.15, 0.65, dot(normalize(q + vec2(1e-4)), vec2(0.741, -0.671)));
      vec3 rimC = mix(vec3(0.941, 0.937, 0.925), u.tint.rgb, 0.55);
      float rimA = 0.10 * exp(-max(dPage, 0.0) / 0.038) * (1.0 - exp(-max(dPage, 0.0) / 0.008))
                 * side * edge;
      shadowA = rimA + core * (1.0 - rimA);
      shadowC = rimC * rimA / max(shadowA, 1e-4);
    }
  }
  float A = bodyA + shadowA * (1.0 - bodyA);
  if (A <= 0.0) { return vec4(0.0); }
  vec3 colour = (rgb * bodyA + shadowC * shadowA * (1.0 - bodyA)) / A;
  colour += (cellHash(pixelAt + vec2(17.0, 43.0)) - 0.5) * (1.3 / 255.0);
  return vec4(colour, A);
}

out vec4 fragColor;
void main() {
  vec2 position = vec2(gl_FragCoord.x, 2.0 * u.center.y - gl_FragCoord.y);
  TokenKit kit;
  kit.pixel = 0.0;
  kit.lift = 0.0;
  kit.light = vec3(0.0);
  kit.casting = 0.0;
  kit.clay = 0.0;
  kit.ink = 0.0;
  kit.scored = 0.0;
  kit.glyph = kTokenGlyphFixed == kTokenAny ? int(u.shape.z) : kTokenGlyphFixed;
  kit.well = u.shape.x;
  kit.relief = u.shape.y;
  kit.thick = u.shape.w;
  kit.tick = u.marks.x;
  kit.wafer = u.marks.y;
  kit.crack = u.marks.z;
  kit.edge = u.marks.w;
  kit.wellAt = u.thumb.xy;
  kit.whorlTurn = u.thumb.z;
  kit.whorlSeed = u.thumb.w;
  kit.face = u.finish.y;
  kit.seed = u.seed;
  kit.lump = u.tint.w;
  kit.wob = u.tint2.w;
  kit.pixel = 1.0 / u.scale;

  kit.pale = smoothstep(0.60, 0.66, dot(u.tint.rgb, vec3(0.2126, 0.7152, 0.0722)))
           * smoothstep(0.004, 0.010, kit.pixel);
  tokenBoil(kit, u.finish.z);

  vec2 s = vec2(position.x - u.center.x, u.center.y - position.y) / u.scale;
  vec4 pixel = tokenPixel(kit, s, position);

  fragColor = vec4(pixel.rgb * pixel.a, pixel.a);
}
`,
  i = "Token";
function a(e) {
  return `${t}#define TOKEN_GLYPH ${e}
${n}
${r}`;
}
console.assert("__eap_only__");
var o = "out vec4 fragColor;",
  s = `  vec4 page;
} u;`,
  c = `  vec4 page;
  vec4 line;
  vec4 fill;
  vec4 ink;
  vec4 slip;
  vec4 seal;
} u;`,
  l = `struct Layer {
  vec3 rgb;
  float a;
};

Layer over(Layer top, Layer under) {
  Layer l;
  l.rgb = top.rgb + under.rgb * (1.0 - top.a);
  l.a = top.a + under.a * (1.0 - top.a);
  return l;
}

Layer paint(Layer l, vec3 colour, float cov) {
  cov = clamp(cov, 0.0, 1.0);
  Layer top = Layer(colour * cov, cov);
  return over(top, l);
}

float sdHexagon(vec2 p, float r) {
  const vec3 c = vec3(-0.8660254, 0.5, 0.5773503);
  p = abs(p);
  p -= 2.0 * min(dot(c.xy, p), 0.0) * c.xy;
  p -= vec2(clamp(p.x, -c.z * r, c.z * r), r);
  return length(p) * sign(p.y);
}

float lineTokenCover(float d, float pixel) { return clamp(0.5 - d / pixel, 0.0, 1.0); }

float lineTokenHexagon(vec2 p, float a, float r) {
  return sdHexagon(vec2(p.y, p.x), a - r) - r;
}

float lineTokenEllipse(vec2 p, vec2 r) {
  float k0 = length(p / r), k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 1e-4);
}

const float kLineBoilFirst = 8.0;
const float kLineBoilStep = 1.0;

const float kLineBoxReach = 0.42;
const float kLineGlobeTurn = 0.3752;

float lineTokenOutline(vec2 q, int glyph, float seed) {
  if (glyph == kTokenBox) {
    return lineTokenHexagon(tokenLean(q), 0.8660254 * kLineBoxReach, 0.050);
  }
  return tokenOutline(q, glyph, seed);
}

float lineTokenOwnLines(vec2 q, int glyph) {
  if (glyph == kTokenGlobe) {
    vec2 r = tokenTurn(q, kLineGlobeTurn);
    return min(abs(r.y), abs(lineTokenEllipse(r, vec2(0.165, 0.385))));
  }
  if (glyph == kTokenBox) {
    vec2 l = tokenLean(q);
    float R = kLineBoxReach, a = 0.8660254 * R;
    float edges = min(
      sdSegment(l, vec2(0.0, 0.0), vec2(0.0, -R)),
      min(
        sdSegment(l, vec2(0.0, 0.0), vec2(-a, 0.5 * R)),
        sdSegment(l, vec2(0.0, 0.0), vec2(a, 0.5 * R))
      )
    );
    float tape = min(
      sdSegment(l, vec2(-0.5 * a, 0.75 * R), vec2(0.5 * a, 0.25 * R)),
      sdSegment(l, vec2(0.5 * a, 0.25 * R), vec2(0.5 * a, 0.25 * R - 0.150))
    );
    return min(edges, tape);
  }
  float s = min(
    tokenArc(q, vec2(0.0, 0.105), 0.105, 0.45, 4.712),
    tokenArc(q, vec2(0.0, -0.105), 0.105, -2.69, 1.571)
  );
  float above = sdSegment(q, vec2(0.0, 0.210), vec2(0.0, 0.295));
  float below = sdSegment(q, vec2(0.0, -0.210), vec2(0.0, -0.295));
  return min(s, min(above, below));
}

out vec4 fragColor;
void main() {
  vec2 position = vec2(gl_FragCoord.x, 2.0 * u.center.y - gl_FragCoord.y);
  TokenKit kit;
  int glyph = int(u.shape.z);
  kit.glyph = glyph;
  kit.seed = u.seed;
  kit.lump = u.tint.w;
  kit.wob = u.tint2.w;
  tokenBoil(kit, kLineBoilFirst + kLineBoilStep * clamp(u.slip.w, 0.0, 2.0));
  kit.boilOut = u.ink.w;
  float pixel = 1.0 / u.scale;
  float ca = cos(u.pose.x), sa = sin(u.pose.x);
  vec2 s = vec2(position.x - u.center.x, u.center.y - position.y) / u.scale;
  vec2 drawnAt = u.pose.yz * (1.0 - clamp(u.slip.z, 0.0, 0.5));
  vec2 laid = vec2(ca * s.x - sa * s.y, sa * s.x + ca * s.y) / drawnAt;
  vec2 q = tokenWarp(kit, vec3(laid.x, laid.y, 0.0)).xy;
  vec2 slipped = tokenWarp(kit, vec3(laid.x - u.slip.x, laid.y + u.slip.y, 0.0)).xy;

  float d = lineTokenOutline(q, glyph, kit.seed);
  float inside = lineTokenCover(d, pixel);
  float filled = lineTokenCover(lineTokenOutline(slipped, glyph, kit.seed), pixel);
  Layer figure = Layer(vec3(0.0), 0.0);
  figure = paint(figure, u.fill.rgb, filled);
  vec3 ink = mix(u.line.rgb, u.ink.rgb, filled);

  vec2 at = u.thumb.xy;
  if (u.marks.y > 0.5) {
    vec2 w = q - vec2(0.205, -0.200);
    float R = 0.118;
    float disc = tokenDisc(w, R, kit.seed);
    figure = paint(figure, u.seal.rgb, lineTokenCover(disc, pixel));
    vec2 left = vec2(-0.34 * R, 0.10 * R), right = vec2(0.34 * R, 0.10 * R);
    float dots = min(length(w - left), length(w - right)) - 0.19 * R;
    figure = paint(figure, u.ink.rgb, lineTokenCover(dots, pixel));
    float rim = lineTokenCover(abs(disc) - 0.5 * u.fill.w, pixel);
    figure = paint(figure, u.line.rgb, rim);
  }

  float mark = 1e9, fine = 1e9;
  if (u.shape.y > 0.001) {
    if (glyph == kTokenGlobe || glyph == kTokenBox) {
      fine = lineTokenOwnLines(q, glyph);
    } else if (glyph == kTokenDollarSign) {
      mark = lineTokenOwnLines(q, glyph) - 0.5 * u.line.w;
    } else if (glyph == kTokenSearch) {
      fine = abs(tokenMark(q, glyph) - 0.036);
    } else if (glyph == kTokenClawd) {
      mark = tokenClawdEyes(q);
    } else if (glyph > kTokenPlain && glyph != kTokenChart) {
      mark = tokenMark(q, glyph);
    }
  }
  if (u.marks.x > 1.5) {
    mark = min(mark, tokenMark((q - at) / 0.95, kTokenDieTick) * 0.95);
  } else if (u.marks.x > 0.5) {
    vec2 t = (q - at) / 0.62;
    mark = min(mark, min(
      sdSegment(t, vec2(-0.255, 0.015), vec2(-0.085, -0.165)),
      sdSegment(t, vec2(-0.085, -0.165), vec2(0.275, 0.215))
    ) * 0.62 - 0.060 * 0.62);
  }
  figure = paint(figure, ink, lineTokenCover(mark, pixel) * inside);
  figure = paint(figure, ink, lineTokenCover(fine - 0.5 * u.fill.w, pixel) * inside);
  if (u.marks.z > 0.001) {
    figure = paint(figure, ink, tokenCrack(q, kit.seed) / 0.026 * inside * u.seal.w);
  }
  figure = paint(figure, u.line.rgb, lineTokenCover(abs(d) - 0.5 * u.line.w, pixel));
  fragColor = vec4(figure.rgb, figure.a);
}
`;
function u() {
  let e = a(-2);
  return e.slice(0, e.indexOf(o)).replace(s, c) + l;
}
console.assert("__eap_only__");
var d = 8e6,
  f = 3,
  p = 272,
  m = { first: -1, last: 16 };
function h(e) {
  return { key: `t:${e}`, source: () => a(e), block: i };
}
var g = { key: "t:line", source: u, block: i };
function _(e, t) {
  e.useProgram(t);
}
function v(e, t) {
  return `${t}:${String.fromCharCode(...new Uint8Array(e))}`;
}
function y() {
  if (typeof WebGL2RenderingContext > "u") return null;
  let t = document.createElement("canvas");
  (t.width = 256), (t.height = 256);
  let n = t.getContext("webgl2", {
    alpha: !0,
    antialias: !1,
    depth: !1,
    stencil: !1,
    premultipliedAlpha: !0,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: !0,
  });
  if (n === null) return null;
  let r = null,
    i = new Map(),
    a = new Map(),
    o = 0,
    s = !1,
    c = null,
    l = null,
    u = () => {
      (r = n.getExtension("KHR_parallel_shader_compile")),
        (c = n.createShader(n.VERTEX_SHADER)),
        c !== null && (n.shaderSource(c, e), n.compileShader(c)),
        (l = n.createBuffer()),
        n.bindBuffer(n.UNIFORM_BUFFER, l),
        n.bufferData(n.UNIFORM_BUFFER, p, n.DYNAMIC_DRAW),
        n.bindBufferBase(n.UNIFORM_BUFFER, 0, l),
        n.bindVertexArray(n.createVertexArray()),
        n.enable(n.BLEND),
        n.enable(n.SCISSOR_TEST),
        n.blendFunc(n.ONE, n.ONE_MINUS_SRC_ALPHA),
        n.clearColor(0, 0, 0, 0);
    };
  u(),
    t.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
    }),
    t.addEventListener("webglcontextrestored", () => {
      (i = new Map()), u();
    });
  let y = (e) => {
      if (r === null) {
        if (s) return;
        (s = !0),
          setTimeout(() => {
            s = !1;
          }, 0);
      } else {
        let e = 0;
        for (let t of i.values())
          t.pending &&
            n.getProgramParameter(t.program, r.COMPLETION_STATUS_KHR) !== !0 &&
            e++;
        if (e >= f) return;
      }
      let t = n.createShader(n.FRAGMENT_SHADER),
        a = n.createProgram();
      if (c === null || t === null || a === null) {
        n.deleteShader(t), n.deleteProgram(a);
        return;
      }
      n.shaderSource(t, e.source()),
        n.compileShader(t),
        n.attachShader(a, c),
        n.attachShader(a, t),
        n.linkProgram(a),
        n.deleteShader(t);
      let o = { program: a, pending: !0, failed: !1 };
      return i.set(e.key, o), o;
    },
    b = (e, t) => {
      let a = i.get(e.key) ?? (t ? y(e) : void 0);
      if (a !== void 0) {
        if (a.failed) return "failed";
        if (a.pending) {
          if (
            r !== null &&
            n.getProgramParameter(a.program, r.COMPLETION_STATUS_KHR) !== !0
          )
            return;
          let t = n.getProgramParameter(a.program, n.LINK_STATUS);
          if (t !== !0 && n.isContextLost()) return;
          if (((a.failed = t !== !0), (a.pending = !1), a.failed))
            return "failed";
          n.uniformBlockBinding(
            a.program,
            n.getUniformBlockIndex(a.program, e.block),
            0,
          );
        }
        return a.program;
      }
    },
    x = (e) => {
      if (n.isContextLost()) return { drawn: "pending" };
      let t = b(e, !0);
      return t === void 0
        ? { drawn: "pending" }
        : t === "failed"
          ? { drawn: "never" }
          : { program: t, drawn: "whole", own: !0 };
    },
    S = (e) => {
      let t = e.byteLength === 240;
      if (t || e.byteLength === 160) {
        let n = Math.round(new Float32Array(e)[6] ?? NaN);
        return n >= m.first && n <= m.last
          ? x(t ? g : h(r === null ? -2 : n))
          : { drawn: "never" };
      }
      return { drawn: "never" };
    },
    C = (e, r) => {
      let i = S(e);
      return i.program === void 0
        ? i.drawn
        : (t.width < r && ((t.width = r), (t.height = r)),
          n.viewport(0, 0, r, r),
          n.scissor(0, 0, r, r),
          n.clear(n.COLOR_BUFFER_BIT),
          _(n, i.program),
          n.bufferSubData(n.UNIFORM_BUFFER, 0, e),
          n.drawArrays(n.TRIANGLES, 0, 3),
          i.drawn);
    },
    w = (e, t, n) => {
      let { width: r, height: i } = e.canvas;
      e.clearRect(0, 0, r, i),
        e.drawImage(t, 0, t.height - n, n, n, 0, 0, r, i);
    },
    T = (e) => {
      let n = document.createElement("canvas");
      (n.width = e), (n.height = e);
      let r = n.getContext("2d");
      if (r !== null) return w(r, t, e), n;
    },
    E = (e, t) => {
      let n = t.width * t.height;
      a.set(e, { image: t, cost: n }), (o += n);
      for (let [e, t] of a) {
        if (o <= d) break;
        a.delete(e), (o -= t.cost);
      }
    };
  return {
    draw: (e, n, r) => {
      let i = C(n, r);
      return i === "whole" && w(e, t, r), i;
    },
    state: (e) => S(e).drawn,
    own: (e) => S(e).own === !0,
    kept: (e, t) => a.has(v(e, t)),
    still: (e, n, r) => {
      let i = v(n, r),
        o = a.get(i);
      if (o !== void 0)
        return a.delete(i), a.set(i, o), w(e, o.image, r), "whole";
      let s = C(n, r),
        c = s === "whole" ? T(r) : void 0;
      return (
        c === void 0 ? s === "whole" && w(e, t, r) : (E(i, c), w(e, c, r)), s
      );
    },
    pngUrl: (e, t) =>
      S(e).own === !0 && C(e, t) === "whole"
        ? T(t)?.toDataURL("image/png")
        : void 0,
  };
}
export { y as createRenderer };
