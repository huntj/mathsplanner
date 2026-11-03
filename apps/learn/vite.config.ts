import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // Relative asset paths, so the build works wherever it is served.
  base: "./",
  plugins: [react()],
  build: {
    // The generators make one large chunk, which is fine until they are split by key stage.
    chunkSizeWarningLimit: 4000,
    // `vite build --mode single` inlines the fonts, for hosts that serve only the page and scripts.
    ...(mode === "single" ? { assetsInlineLimit: () => true } : {}),
  },
  resolve: {
    // Use workspace packages' TypeScript source rather than their dist builds.
    conditions: ["@mathsplanner/source", ...defaultClientConditions],
  },
}));
