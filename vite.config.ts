import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const src = fileURLToPath(new URL("./src", import.meta.url));
const shims = fileURLToPath(new URL("./playground/shims", import.meta.url));

/**
 * The playground swaps `@/external/*` boundary stubs (which throw) for working
 * stand-ins in playground/shims. Modules without a shim keep the original stub.
 * Tests skip this, so they exercise src as converted.
 */
function playgroundShims(): Plugin {
  return {
    name: "playground-shims",
    enforce: "pre",
    resolveId(id) {
      // Vite's alias rewrites `@/external/x` to an absolute src path before this runs.
      const prefix = `${src}/external/`;
      if (!id.startsWith(prefix) && !id.startsWith("@/external/")) return null;
      const name = id.slice(id.startsWith(prefix) ? prefix.length : "@/external/".length).replace(/\.tsx?$/, "");
      for (const ext of [".ts", ".tsx"]) {
        const candidate = `${shims}/${name}${ext}`;
        if (existsSync(candidate)) return candidate;
      }
      return null;
    },
  };
}

export default defineConfig({
  root: "playground",
  plugins: [...(process.env.VITEST ? [] : [playgroundShims()]), react(), tailwindcss()],
  resolve: { alias: { "@": src } },
  server: { port: 5199, strictPort: true },
  test: { root: ".", include: ["src/**/*.test.ts"] },
});
