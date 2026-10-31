# Minified chunk → source module map

Prettified originals live next to this file. Each first-party chunk is rewritten
under `src/`; everything else is an external boundary stubbed in `src/external/`.

## React (`vendor-frame-*.js`) — import from "react" / "react/jsx-runtime"

Inferred from usage (verify against call shapes if one looks off):

| alias | React API |
| --- | --- |
| `qa` | `jsx` (write JSX instead) |
| `Ja` | `jsxs` (write JSX instead) |
| `Ka` | `Fragment` |
| `Do` | `useState` |
| `Eo` | `useRef` |
| `Oo` | `useSyncExternalStore` |
| `ao` | `createElement` |
| `io` | `createContext` |
| `ho` | `use` (context read; React 19) |
| `vo` | `useEffect` |
| `yo` | `useEffectEvent` |
| `Co`, `fo` | infer from usage (likely `useCallback` / `useLayoutEffect` / `useMemo`) |

## React Compiler runtime (`shared-frame-*.js`)

`J9(n)` is `useMemoCache(n)`; `J0..J5` are "did these deps change" checks,
`K0..K5`/`I1..I5`/`Z1`/`Z2` write cache slots and return the value. Decompile
these away completely: write the plain component the compiler was fed (no
manual `useMemo`/`useCallback` unless the original clearly needs a stable
identity for an effect dependency).

## First-party chunks → src modules

### `fcee03b8…-BYoS-YJP.js` → `src/look/aibo-look.ts` (only the used subset)

| export | name |
| --- | --- |
| `Tt` | `AIBO_TINTS` |
| `Q` | `DEFAULT_AIBO_LOOK` |
| `vt` | `LINE_SHAPES` |
| `bt` | `LINE_TINTS` |
| `ht` | `LINE_ACCESSORIES` |
| `gt` | `LINE_STATES` |
| `_t` | `DEFAULT_LINE_LOOK` |
| `yt` | `LINE_DRAWING` (`{ byHandFrom, smallMarksGrow, smallMarksLineShare }`) |
| `Ct` | `lineTintForAiboTint(tint: AiboTint): LineTint` |
| `wt` | `baseLineTintForAiboTint(tint: AiboTint): LineTint` |
| `St` | `aiboTintForLineTint(tint: LineTint): AiboTint` |
| `rt` | `serializeLineLook(look: LineLook): string` |
| `dt` | `parseAibo1Token(token: string): AiboLook \| undefined` |
| `ft` | `parseAibo3Token(token?: string): LineLook \| undefined` |
| `et` | `toAiboLook(look: AiboLook): AiboLook` |
| `ut` | `isAibo1Token(token: string): boolean` |
| `nt` | `toFaceLookProps(look: AiboLook): FaceLookProps` |
| `st` | `aiboTintBgClass(tint)` |
| `lt` | `aiboTintTextClass(tint)` |

Types exported: `AiboTint`, `AiboFace`, `AiboHat`, `LineShape`, `LineTint`,
`LineAccessory`, `LineState`, `LineLook`, `AiboLook`, `FaceLookProps`.

### `7f29883a…-CGiVxYE0.js` → `src/face/face-codes.ts`

| export | name |
| --- | --- |
| `n` | `FACE_GLYPHS` (state name → numeric glyph) |
| `t` | `EMPTY_WEARABLE_FRAME` |
| `r` | `PROP_CODES` |
| `a` | `isPropCode(code)` |
| `c` | `slotForWearable(code): "head" \| "face"` |
| `o` | `wearablesFor(hat, prop, sunglasses): { head: number; face: number }` |
| `i` | `minimumWearSeconds(code)` |
| `s` | `hexToRgb(hex): [number, number, number]` |

Types: `FaceState`, `WearableFrame`, `HatName`, `PropName`.

### `89cbbe19…-BAz1nNdO.js` → split

- `src/face/renderer-loader.ts`: `p` → `createLazyRendererModule(load, tag)`,
  `c` → `loadFaceRenderer()`, `l` → `faceRendererNow()`,
  `d` → `loadMascotKit(urgent?)`, `f` → `mascotKitNow()`,
  `u` → `markPageInteractive()`, `s` → `IDLE_CALLBACK_FALLBACK_MS` (=1000).
  Types: `FaceRenderer`, `MascotKit`, `LazyRendererModule<T>`.
- `src/tiles/tints.ts`: `a` → `tileFillHex(tint)`, `o` → `tileInkHex(tint, isDark)`,
  `i` → `TASK_TINTS`.
- `src/tiles/tile-contexts.ts`: `r` → `TileStyleContext` ("grey" | "tinted"),
  `n` → `TileIconSizeContext` (number | undefined).
- `src/tiles/TaskGlyphTile.tsx`: `t` → `TaskGlyphTile`.

### `046ad1ef…-Cp0AY0vP.js` → `src/tokens/task-look.ts`

`t` → `TASK_GLYPHS`, `n` → `DEFAULT_TASK_LOOK`, `i` → `tintOfTaskLook`,
`r` → `taskLookToken(prefix, glyph)`, `a` → `parseTaskLook(token, color, setBy)`.
Types: `TaskGlyph`, `TaskLook`, `TaskWear`.

### `c0ff9653e-Cd7syOsb.js`

This is `@noble/hashes` sha256. `t` → `sha256`, `u` → `utf8ToBytes`.
Import from `@noble/hashes/sha2.js` and `@noble/hashes/utils.js`.

### `main.js` → `src/face/*`, `src/tokens/*`, `src/channel/*`

`a` → `FaceEngineProvider`, `c` → `CHANNEL_TINTS`, `i` → `AgentFace`,
`l` → `channelIconFor`, `n` → `TaskToken`, `o` → `stillFaceFrame`,
`r` → `useIsClayTileSurface`, `s` → `CHANNEL_GLYPHS`, `t` → `ChannelToken`,
`u` → `glyphForName`.

### `01d032c8…-7F--UbdT.js` (lazy) → `src/tiles/clay-tile/*`

Exports `AiboTaskTokenClayTile`.

## External boundaries (`src/external/`)

Anything from `shared-*.js`, `vendor-query`, `vendor-intl`, `preload-helper`
and second-level first-party chunks (`2ca6c542…`, `5accd2d8…`, `4045a9b1…`,
`55bf623e…`, `8f49cd0b…`, `6062917c…`) is not converted. Each gets a small
typed stub module in `src/external/` named for what it does, with a comment
naming the original chunk + export alias.

## Round 2: renderers and their helpers

### `2ca6c542…-DsoJFEEM.js` → `src/draw/path-data.ts` (converted)

`a` → `isHexColour`, `i` → `parsePathData`, `n` → `midpoint`,
`o` → `roundHalfAwayFromZero`, `r` → `quadraticToCubic`, `s` → `clampInt`,
`t` → `distance`. Types: `Point`, `PathPart`. Also exports `moveTo`, `lineTo`,
`curveTo`, `CLOSE`.

### `5accd2d8…-SYaPBvB9.js` → `src/draw/line-paint.ts` (converted)

`t` → `resolveLinePaint(paint, colours, inverted)`. Types: `LinePaint`, `PaintColours`.

### `4045a9b1…-BYpydOCE.js` → `src/tiles/clay-tile/clay-glaze.ts` (converted)

`a` → `claySeedFor`, `i` → `clayShadeFor`, `n` → `clayBlankForGlyph`,
`o` → `clayCanvasSize`, `r` → `packClayPressing`, `t` → `NEUTRAL_CLAY_PIGMENT`.

### `fcee03b8…` extra export

`xt` → `BEZIER_CIRCLE_KAPPA` in `src/look/aibo-look.ts`.

### `55bf623e…-CrKlyJpQ.js` → `src/draw/face-renderer/` (WebGL; no imports)

### `8f49cd0b…-D96hR7E2.js` + `038ed117…` + `9631d644…` → `src/draw/mascot-kit/`

It also imports six symbols from the 5 MB app chunk `eb869a9c…-DP0kYrJ7.js`:
`qt` (`LL = "tilde"`), `Jt` (`mRe`, mark names), `Yt` (`hRe`, face state →
mark), `Xt` (`gRe`, prop → mark), `Gt` (`SRe = [2e4, 4e4]`), `Kt` (`TRe`, true
when no hold counter is open). Their source is in
`original/eb869a9-mascot-symbols.js`; inline them into the mascot kit. The
455 bare `import "./…"` lines are Rollup execution-order hoists for that big
chunk and are not needed.
