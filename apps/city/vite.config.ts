import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths, so the build works in the /city/ folder of the Learn Maths site.
  base: "./",
  plugins: [react()],
  build: {
    // The generators make one large chunk, as in Learn Maths.
    chunkSizeWarningLimit: 4000,
  },
  resolve: {
    // Use workspace packages' TypeScript source rather than their dist builds.
    conditions: ["@mathsplanner/source", ...defaultClientConditions],
  },
});
