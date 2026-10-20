import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig, type Plugin } from "vite";
import { parseHeader } from "../../packages/generators/scripts/header.ts";

/** `virtual:generator-headers`: each generator file's header (author, AI note, reviews), by ID. */
function generatorHeaders(): Plugin {
  const id = "virtual:generator-headers";
  const src = resolve(import.meta.dirname, "../../packages/generators/src");
  return {
    name: "generator-headers",
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load(loaded) {
      if (loaded !== `\0${id}`) return undefined;
      const headers: Record<string, unknown> = {};
      for (const folder of ["eyfs", "ks1", "ks2", "ks3", "ks4", "ks5"]) {
        const dir = join(src, folder);
        if (!existsSync(dir)) continue;
        for (const file of readdirSync(dir).filter(
          (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
        )) {
          const path = join(src, folder, file);
          this.addWatchFile(path);
          headers[basename(file, ".ts")] = parseHeader(readFileSync(path, "utf8"));
        }
      }
      return `export default ${JSON.stringify(headers)};`;
    },
  };
}

export default defineConfig({
  // Relative asset paths, so the build works at any URL (GitHub Pages serves it from /mathsplanner/).
  base: "./",
  plugins: [react(), generatorHeaders()],
  // KaTeX, React and all 686 statements make one large chunk, which is fine for this app.
  build: { chunkSizeWarningLimit: 1000 },
  resolve: {
    // Use workspace packages' TypeScript source rather than their dist builds.
    conditions: ["@mathsplanner/source", ...defaultClientConditions],
  },
});
