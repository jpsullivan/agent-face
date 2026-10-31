// Public surface of the original entry chunk (main.js export map in comments).
export { FaceEngineProvider } from "./face/FaceEngineProvider"; // a
export { CHANNEL_TINTS, channelIconFor, glyphForName } from "./channel/channel-icon"; // c, l, u
export { AgentFace } from "./face/AgentFace"; // i
export { TaskToken } from "./tokens/TaskToken"; // n
export { stillFaceFrame } from "./face/engine"; // o
export { useIsClayTileSurface } from "./tokens/clay-tile-loader"; // r
export { CHANNEL_GLYPHS } from "./channel/channel-glyphs"; // s
export { ChannelToken } from "./channel/ChannelToken"; // t

export type { AgentFaceProps, FaceGesture } from "./face/AgentFace";
export type { ChannelIcon } from "./channel/channel-icon";
export type { ChannelTokenProps } from "./channel/ChannelToken";
export type { TaskTokenProps } from "./tokens/TaskToken";
