// KaTeX draws some symbols as SVGs sized by its own stylesheet: the root sign, vector arrows such
// as AB with an arrow over it, and very tall brackets. A style that resizes every SVG in a question
// (say `.lesson-card svg { height: auto }`) squashes them to nothing, so 5/√6 shows as 5/6. The
// apps' styles for question content must size diagrams by their wrapper, `.mp-diagram svg`, instead.
// (This lives here because the apps' tests cannot read stylesheets: Vitest blanks CSS imports.)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../", import.meta.url));
/** SVGs that are never KaTeX's: diagrams, the drawing area, a gallery diagram card. */
const SAFE = /\.mp-diagram\b|\.diagram-svg\b|\.plot-base\b/;

/** Selectors that resize every SVG inside something, rather than only diagrams. */
function broadSvgRules(css: string): string[] {
  const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  return rules
    .filter(([, , body]) => /\b(height|width|max-width|max-height)\s*:/.test(body ?? ""))
    .flatMap(([, selectors]) => (selectors ?? "").split(","))
    .map((s) => s.trim())
    .filter((s) => /(^|\s)svg$/.test(s) && !SAFE.test(s));
}

describe("styles for question content", () => {
  it.each([
    "packages/ui/src/widgets.css",
    "apps/learn/src/styles.css",
    "apps/practice/src/styles.css",
  ])("%s resizes only diagram SVGs, not KaTeX's", (sheet) => {
    const css = readFileSync(root + sheet, "utf8");
    expect(css.length).toBeGreaterThan(0);
    expect(broadSvgRules(css)).toEqual([]);
  });
});
