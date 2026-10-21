/**
 * @statement GF-A9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A9: Plot graphs of equations that correspond to straight-line graphs in the coordinate plane;
// use the form y = mx + c to identify parallel lines; find the equation of the line through two
// given points, or through one point with a given gradient
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, poly } from "../shared/alg.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  m: number;
  c: number;
  x1: number;
  x2: number;
  k: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "GF-A9",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["ALG.LINE.M-C", "ALG.GRADIENT.RUN-RISE"],

  params(rng) {
    const m = rng.int(1, 5) * rng.pick([1, -1]);
    const c = rng.int(-9, 9);
    const x1 = rng.int(-4, 4);
    const x2 = x1 + rng.int(1, 4);
    const k = rng.int(-9, 9);
    if (
      c === 0 ||
      k === c ||
      k === m ||
      k === 0 ||
      Math.abs(m) === Math.abs(c) ||
      Math.abs(m) === 1
    )
      reject("numbers that tell the slips apart");
    return { m, c, x1, x2, k, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const y = (x: number) => p.m * x + p.c;
    const right = lineLatex(p.m, p.c);
    switch (depth) {
      case 1: {
        const A1: [number, number] = [p.x1, y(p.x1)];
        const B1: [number, number] = [p.x2, y(p.x2)];
        return A.standard({
          question: [
            "A straight line passes through ",
            A.math(coord(A1)),
            " and ",
            A.math(coord(B1)),
            ".",
          ],
          ask: "Find the equation of the line, in the form y = mx + c.",
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.exact(`y = \\frac{1}{${p.m}}x + ${p.c}`),
              feedback: "Gradient = change in y ÷ change in x.",
            },
          ],
          solution: [
            {
              say: `Gradient = (${B1[1]} − ${A1[1]}) ÷ (${B1[0]} − ${A1[0]}) = ${p.m}. Substitute ${coord(A1)}: ${A1[1]} = ${p.m} × ${A1[0]} + c, so c = ${p.c}. `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        const px = p.x2;
        const py = p.m * px + p.k;
        const ans = lineLatex(p.m, p.k);
        return A.standard({
          question: [
            "Line L has equation ",
            A.math(right),
            ". Line M is parallel to L and passes through ",
            A.math(coord([px, py])),
            ".",
          ],
          ask: "Find the equation of line M.",
          answer: A.exact(ans),
          wrong: [
            {
              code: "ALG.LINE.M-C",
              value: A.exact(lineLatex(p.k === 0 ? 1 : p.k, p.m)),
              feedback: "Parallel lines have the same gradient, m.",
            },
          ],
          solution: [
            {
              say: `Same gradient, ${p.m}. ${py} = ${p.m} × ${px} + c, so c = ${p.k}. `,
              math: ans,
            },
          ],
        });
      }
      case 4: {
        const other = p.claimTrue ? lineLatex(p.m, p.k) : lineLatex(p.c > 0 ? p.c : -p.c, p.m);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo says the lines ",
            A.math(right),
            " and ",
            A.math(other),
            " are parallel.",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. Both have gradient ${p.m}; only the intercepts differ.`,
                  correct: true,
                },
                {
                  text: "False. Parallel lines must have the same intercept.",
                  code: "ALG.LINE.M-C",
                },
                { text: "False. Lines with different equations always meet." },
              ]
            : [
                {
                  text: "False. Parallel lines have equal gradients, and these gradients are different.",
                  correct: true,
                },
                { text: "True. They share a number, so they are parallel.", code: "ALG.LINE.M-C" },
                { text: "True. All straight lines are parallel." },
              ],
          solution: [{ say: "In y = mx + c, m is the gradient. Parallel lines have the same m." }],
        });
      }
      default: {
        const A1: [number, number] = [p.x1, y(p.x1)];
        const B1: [number, number] = [p.x2, y(p.x2)];
        return A.multiStepContext({
          context: ["A line passes through ", A.math(coord(A1)), " and ", A.math(coord(B1)), "."],
          parts: [
            {
              ask: "Work out the gradient of the line.",
              answer: A.number(p.m),
              wrong: [
                {
                  code: "ALG.GRADIENT.RUN-RISE",
                  value: A.number(Math.round((1 / p.m) * 1000) / 1000),
                  feedback: "Change in y ÷ change in x, not the other way round.",
                },
              ],
            },
            { ask: "Write down the equation of the line.", answer: A.exact(right) },
            {
              ask: "Where does the line cross the y-axis? Give the y-coordinate.",
              answer: A.number(p.c),
            },
          ],
          solution: [
            {
              say: `Gradient ${p.m}; c = ${p.c}; so `,
              math: `${right}\\text{, crossing the y-axis at } (0, ${p.c})`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === lineLatex(p.m, p.c);
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === lineLatex(p.m, p.k) && poly([p.m, p.k]).length > 0;
    return true;
  },
});
