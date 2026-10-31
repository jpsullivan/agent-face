// Vertex shader shared by every program: one oversized triangle covering the
// viewport, positioned from gl_VertexID so no vertex buffer is needed.

export const FULLSCREEN_TRIANGLE_VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID & 1) << 2) - 1.0, float((gl_VertexID & 2) << 1) - 1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}
`;
