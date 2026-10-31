// Layout of the parameter block callers pass in. It is uploaded verbatim into
// the std140 `Token` uniform block, so float slots map to block members:
//
//   0-1  center (px)        2 scale (px per unit)   3 seed
//   4-7  shape  x well depth, y relief, z glyph, w thickness
//   8-11 marks  x tick, y wafer, z crack, w edge tilt
//  12-15 thumb  xy well position, z whorl turn, w whorl seed
//  16-19 finish x matte, y face dimples, z boil state, w rim-light shadow
//  20-23 pose   x rotation, yz scale, w lift
//  24-27 tint   rgb body, w lump        28-31 tint2  rgb rod trim, w wobble
//  32-35 wafer  rgb, w bound radius     36-39 page   rgb backdrop
//
// The line drawing appends five more vec4s (40-59): line (rgb, w width),
// fill (rgb, w fine-line width), ink (rgb, w boil wobble), slip (xy spot slip,
// z draw shrink, w boil step) and seal (rgb, w crack ink).

/** A raymarched clay token: center through page. */
export const TOKEN_PARAMS_BYTES = 160;
/** The flat line drawing: the token block plus line/fill/ink/slip/seal. */
export const LINE_PARAMS_BYTES = 240;

/** Float index of `shape.z`, the glyph number. */
export const GLYPH_SLOT = 6;

/** Glyph numbers the shaders know: -1 is a plain blank, 0-16 the task glyphs. */
export const GLYPH_RANGE = { first: -1, last: 16 } as const;

/** `kTokenAny`: compile one program that reads the glyph from the block at run time. */
export const ANY_GLYPH = -2;
