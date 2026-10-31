// The flat line-drawing variant: reuses the token source up to its fragment
// main, widens the uniform block with line/fill/ink/slip/seal colours, and
// appends a 2D layer-compositing main.
import { tokenFragmentSource } from "./token-fragment";
import { ANY_GLYPH } from "../params";

/** Where the token's own fragment main begins; everything before it is reused. */
const FRAGMENT_OUTPUT_DECLARATION = "out vec4 fragColor;";

/** Last member of the token's uniform block, as it appears in the source. */
const TOKEN_BLOCK_END = `  vec4 page;
} u;`;

/** The same block end with the line drawing's extra members appended. */
const LINE_BLOCK_END = `  vec4 page;
  vec4 line;
  vec4 fill;
  vec4 ink;
  vec4 slip;
  vec4 seal;
} u;`;

export const LINE_FRAGMENT_BODY = `struct Layer {
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

export function lineFragmentSource(): string {
  const token = tokenFragmentSource(ANY_GLYPH);
  return (
    token.slice(0, token.indexOf(FRAGMENT_OUTPUT_DECLARATION)).replace(TOKEN_BLOCK_END, LINE_BLOCK_END) +
    LINE_FRAGMENT_BODY
  );
}
