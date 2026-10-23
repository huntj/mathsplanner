/**
 * @statement AL-P7.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.5: Differentiate functions defined implicitly or parametrically (first derivative)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

/** Points on x² + y² = r² with whole-number coordinates. */
const POINTS: [number, number, number][] = [
  [3, 4, 25],
  [4, 3, 25],
  [-3, 4, 25],
  [5, 12, 169],
  [-12, 5, 169],
  [6, -8, 100],
  [8, 6, 100],
];

export interface Params {
  k: number;
  t: number;
  pt: number;
}

export default defineGenerator<Params>({
  id: "AL-P7.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.PARAMETRIC", "CALC.IMPLICIT"],

  params(rng) {
    const k = rng.int(1, 6);
    const t = rng.int(1, 4);
    if (3 * t * t + k === 2 * t || (3 * t * t + k) * (3 * t * t + k) === 4 * t * t)
      reject("a gradient different from its reciprocal");
    return { k, t, pt: rng.int(0, POINTS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const g = frac(3 * p.t * p.t + p.k, 2 * p.t);
        return A.standard({
          question: [
            "A curve has parametric equations ",
            A.math("x = t^2"),
            ", ",
            A.math(`y = t^3 + ${p.k}t`),
            ".",
          ],
          ask: `Find dy/dx at the point where t = ${p.t}.`,
          answer: A.exact(g),
          wrong: [
            {
              code: "CALC.PARAMETRIC",
              value: A.exact(g.inv()),
              feedback: "dy/dx = (dy/dt) ÷ (dx/dt): y on top.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{dy}{dx} = \\frac{3t^2 + ${p.k}}{2t} = ${toLatex(g)} \\text{ at } t = ${p.t}`,
            },
          ],
        });
      }
      case 2: {
        const [x, y, r2] = POINTS[p.pt] ?? (POINTS[0] as [number, number, number]);
        const g = frac(-x, y);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the gradient of the curve ",
                A.math(`x^2 + y^2 = ${r2}`),
                " at the point ",
                A.math(`(${x}, ${y})`),
                ".",
              ],
            },
          ],
          answer: A.exact(g),
          wrong: [
            {
              code: "CALC.IMPLICIT",
              value: A.exact(frac(-y, x)),
              feedback: "2x + 2y dy/dx = 0 gives dy/dx = −x/y.",
            },
          ],
          solution: [
            {
              say: "",
              math: `2x + 2y\\frac{dy}{dx} = 0 \\Rightarrow \\frac{dy}{dx} = -\\frac{x}{y} = ${toLatex(g)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Dee says that differentiating ",
            A.math("y^2"),
            " with respect to x gives ",
            A.math("2y"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. y depends on x, so by the chain rule d/dx(y²) = 2y dy/dx.",
              correct: true,
            },
            { text: "True. Differentiate y² like x².", code: "CALC.IMPLICIT" },
            { text: "False. It gives 0, because y is a variable not x.", code: "CALC.IMPLICIT" },
          ],
          solution: [
            {
              say: "Each term in y picks up a factor dy/dx when you differentiate with respect to x.",
            },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
