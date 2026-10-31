# agent-face

A readable TSX reconstruction of the claude.ai chunk
`79805ad764c1702ba6f462e4567740b1eb35d0879717864b-DkXKH_cu.js`, the
first-party chunks it pulls in, and the two canvas renderers it loads. Minified
originals (prettier-formatted) are in `original/`, and
`original/MODULE_MAP.md` maps every minified export to its new name.

The React Compiler output (`useMemoCache` slots) has been removed, so every
component reads like the source the compiler was fed.

## Layout

| Path | From | What it is |
| --- | --- | --- |
| `src/face/engine.ts` | main | `FaceEngine`: spring physics for expressions, blinks, saccades, gestures, wearables |
| `src/face/AgentFace.tsx` | main | The agent's canvas face, with accessible labels per state |
| `src/face/use-face-drawing.ts` | main | Canvas draw loop: lazy kit load, viewport/visibility/focus wake-ups, sleep at rest |
| `src/face/FaceEngineProvider.tsx` | main | Shares one engine across faces |
| `src/face/face-codes.ts` | `7f29883a…` | Numeric glyph and wearable codes |
| `src/face/renderer-loader.ts` | `89cbbe19…` | Deferred loading of both renderers |
| `src/draw/mascot-kit/` | `8f49cd0b…`, `038ed117…`, `9631d644…` | 2D mascot kit: animated line marks picked from state or prop |
| `src/draw/face-renderer/` | `55bf623e…` | WebGL2 clay renderer (shaders byte-identical to the original) |
| `src/draw/path-data.ts` | `2ca6c542…` | Strict SVG path reader and point helpers |
| `src/draw/line-paint.ts` | `5accd2d8…` | Line-set paint → colour |
| `src/look/aibo-look.ts` | `fcee03b8…` (used subset) | Look types, token parsing, tint mappings |
| `src/tokens/task-look.ts` | `046ad1ef…` | Task icon tokens → glyph or mascot |
| `src/tokens/TaskToken.tsx`, `clay-tile-loader.ts` | main | Task token, with the clay tile code-split behind a surface context |
| `src/tiles/*` | `89cbbe19…` | Flat glyph tile, tint palettes, tile contexts |
| `src/tiles/clay-tile/` | `01d032c8…`, `4045a9b1…` | `AiboTaskTokenClayTile` and its glaze/pressing packer |
| `src/channel/*` | main | Channel icon choice, pictogram art, `ChannelToken` |
| `src/external/*` | — | Typed stubs for app services (see below) |

`c0ff9653e…` is `@noble/hashes` sha256, so it's a dependency, not a rewrite.

### What the mascot kit draws

The kit has no eyes, hats or sunglasses. It draws one animated line "mark"
(tilde, thinking, signal, orbit, spiral…), chosen by the face state or by a
held prop, or forced with `mascot`. The engine still simulates hats and
gestures, and the face still passes its whole look to the kit, but this kit
ignores them; other renderers in the app may not.

## Still stubbed

`src/external/` holds the app services these components call: theme, reduced
motion, UI density, device pixel ratio, window timers, page visibility,
background-task error reporting, the design-system `Icon`, Vite's preload
helper and an error-tagging helper. In the original they come from shared
chunks that make up most of the app. The stubs throw (or pass through where
it's obvious), and the playground replaces them with working stand-ins.

The kit's loader originally preloaded four app stylesheets; neither renderer
needs CSS.

## Verification

- `npm test`: 62 Vitest tests covering token formats, channel icons, the
  engine's timing, and the SVG path reader.
- The path reader and glaze packer were checked against the original chunks
  in Node: 50,000 random path strings and 54 packer configurations gave
  identical output.
- `playground/verify.html` draws 480 clay-tile configurations with the
  original WebGL chunk and the converted renderer and compares every pixel
  (about 4.3 million, all identical).
- The agent that converted the mascot kit diffed it against the original
  chunks: stills, seeded live runs and recorded canvas calls, with no
  differences. That harness wasn't kept.

```bash
npm install
npm run typecheck
npm test
npm run dev   # playground at http://localhost:5199
```

## Playground

`playground/` is a Vite page for trying the components. `vite.config.ts`
redirects `@/external/*` imports to stand-ins in `playground/shims/`, so
`src/` stays as converted. Tests skip the redirect.

- **Face lab**: drive `AgentFace` with the real mascot kit (states, props,
  mark override, amplitude, still vs animated). Next to it,
  `playground/EngineView.tsx` paints the same shared engine as plain shapes.
  That view is a debug tool written for the playground, not code from the
  original, and it's where gestures, characters, tints, hats and sunglasses
  become visible. Controls that only affect it are tagged "engine view only".
- **Task tokens**: every glyph tile × tint, drawn as WebGL clay tiles on a
  clay surface or as flat tiles otherwise, plus mascot tokens.
  Design-system icons in flat tiles are placeholder initials.
- **Channel tokens**: all pictograms at every size.
- **Icon resolver**: try `channelIconFor` with any id, name, color or token.
- **`/verify.html`**: the renderer pixel comparison above.

The colors in `playground/styles.css` stand in for the app's theme tokens.
