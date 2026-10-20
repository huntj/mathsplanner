import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths: the app is published under the gallery, at /practice/.
  base: "./",
  plugins: [react()],
  // KaTeX, MathLive, the Compute Engine and the generators make large chunks, which is fine here.
  build: { chunkSizeWarningLimit: 4000 },
  resolve: {
    // Use workspace packages' TypeScript source rather than their dist builds.
    conditions: ["@mathsplanner/source", ...defaultClientConditions],
  },
});
