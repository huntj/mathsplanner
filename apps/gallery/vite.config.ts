import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths, so the build works at any URL (GitHub Pages serves it from /mathsplanner/).
  base: "./",
  plugins: [react()],
  // KaTeX, React and all 686 statements make one large chunk, which is fine for this app.
  build: { chunkSizeWarningLimit: 1000 },
  resolve: {
    // Use workspace packages' TypeScript source rather than their dist builds.
    conditions: ["@mathsplanner/source", ...defaultClientConditions],
  },
});
