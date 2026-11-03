// KaTeX draws some symbols as SVGs sized by its own stylesheet: the root sign, vector arrows such
// as AB with an arrow over it, and very tall brackets. A style that resizes every SVG in a question
// (say `.lesson-card svg { height: auto }`) squashes them to nothing, so 5/√6 shows as 5/6. Styles
// for question content must size diagrams by their wrapper, `.mp-diagram svg`, instead.
import { describe, expect, it } from "vitest";
import practice from "../../practice/src/styles.css?raw";
import widgets from "../../../packages/ui/src/widgets.css?raw";
import learn from "./styles.css?raw";

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
    ["the answer widgets", widgets],
    ["Learn Maths", learn],
    ["the practice app", practice],
  ])("%s resize only diagram SVGs, not KaTeX's", (_, css) => {
    expect(broadSvgRules(css)).toEqual([]);
  });
});
