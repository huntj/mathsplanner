import { defaultServerConditions } from "vite";
import { defineConfig } from "vitest/config";

// Workspace packages export their TypeScript source under this condition, so tests run
// against src/ without building dist/ first.
const conditions = ["@mathsplanner/source", ...defaultServerConditions];

export default defineConfig({
  resolve: { conditions },
  ssr: { resolve: { conditions } },
  test: {
    include: ["{packages,apps,tools}/*/{src,test,scripts}/**/*.test.ts"],
    // With a test file per generator, property and sweep tests share the machine with hundreds of
    // others and can pass 5 seconds under load while taking well under a second alone.
    testTimeout: 30_000,
  },
});
