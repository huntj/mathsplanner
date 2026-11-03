/**
 * @statement GH-A11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A11: Find turning points by completing the square
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signed } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** x² + 2hx + c = (x + h)² + (c − h²). */
  h: number;
  c: number;
  claimTrue: boolean;
}

const square = (h: number, q: number) => `${bracket(h)}^2${q === 0 ? "" : ` ${signed(q)}`}`;

export default defineGenerator<Params>({
  id: "GH-A11",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COMPLETE-SQUARE.HALF", "ALG.QUADRATIC.TURNING"],

  params(rng) {
    const h = rng.int(-6, 6);
    const c = rng.int(-9, 15);
    if (h === 0 || c === 0 || c === h * h || Math.abs(h) === 1)
      reject("a quadratic with a clear turning point");
    return { h, c, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const q = p.c - p.h * p.h;
    const quad = poly([1, 2 * p.h, p.c]);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Write ", A.math(quad), " in the form ", A.math("(x + a)^2 + b"), "."],
          answer: A.exact(square(p.h, q)),
          wrong: [
            {
              code: "ALG.COMPLETE-SQUARE.HALF",
              value: A.exact(square(p.h, p.c)),
              feedback: `(x ${signed(p.h)})² already contains ${p.h * p.h}, so subtract it.`,
            },
            {
              code: "ALG.COMPLETE-SQUARE.HALF",
              value: A.exact(square(2 * p.h, p.c - 4 * p.h * p.h)),
              feedback: `Halve the x coefficient: ${2 * p.h} ÷ 2 = ${p.h}.`,
            },
          ],
          solution: [
            {
              say: "Halve the x coefficient and subtract its square: ",
              math: `${square(p.h, 0)} - ${p.h * p.h} ${signed(p.c)} = ${square(p.h, q)}`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The curve ", A.math(`y = ${quad}`), " has a turning point."],
          ask: "What are its coordinates?",
          correct: A.math(`(${-p.h}, ${q})`),
          distractors: [
            {
              content: A.math(`(${p.h}, ${q})`),
              code: "ALG.QUADRATIC.TURNING",
              feedback: `(x ${signed(p.h)})² is smallest when x = ${-p.h}.`,
            },
            {
              content: A.math(`(${-p.h}, ${p.c})`),
              code: "ALG.COMPLETE-SQUARE.HALF",
              feedback: `Completing the square gives ${square(p.h, q)}, so the minimum y is ${q}.`,
            },
            {
              content: A.math(`(0, ${p.c})`),
              code: "ALG.QUADRATIC.TURNING",
              feedback: "That is where the curve crosses the y-axis.",
            },
          ],
          solution: [
            { say: "Complete the square: ", math: `y = ${square(p.h, q)}` },
            { say: `The square is 0 when x = ${-p.h}, giving the minimum point (${-p.h}, ${q}).` },
          ],
        });
      default: {
        const shown = p.claimTrue ? `(${-p.h}, ${q})` : `(${p.h}, ${q})`;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Eve says the turning point of ",
                A.math(`y = ${square(p.h, q)}`),
                " is ",
                A.math(shown),
                ".",
              ],
              truth: p.claimTrue,
              reasons: p.claimTrue
                ? [
                    {
                      text: `True. The square is zero when x = ${-p.h}, and then y = ${q}.`,
                      correct: true,
                    },
                    {
                      text: `False. It is (${p.h}, ${q}): read the number in the bracket.`,
                      code: "ALG.QUADRATIC.TURNING",
                    },
                    { text: `False. It is (0, ${q}).`, code: "ALG.QUADRATIC.TURNING" },
                  ]
                : [
                    {
                      text: `False. The square is zero when x = ${-p.h}, so the turning point is (${-p.h}, ${q}).`,
                      correct: true,
                    },
                    {
                      text: "True. The x-coordinate is the number in the bracket.",
                      code: "ALG.QUADRATIC.TURNING",
                    },
                    { text: "True. Turning points always have a positive x-coordinate." },
                  ],
              solution: [{ say: `y = (x + a)² + b has its turning point at (−a, b).` }],
            }),
          [
            {
              statement: "Kim writes $x^2 + 6x + 2$ as $(x + 3)^2 - 7$.",
              truth: true,
              right: "True. (x + 3)² = x² + 6x + 9, and 9 − 7 = 2.",
              wrong: [
                ["False. It is (x + 6)² + 2.", "ALG.COMPLETE-SQUARE.HALF"],
                ["False. It is (x + 3)² + 2.", "ALG.COMPLETE-SQUARE.HALF"],
              ],
            },
            {
              claim: "The minimum point of $y = (x - a)^2 + b$ is $(a, b)$.",
              truth: "always",
              right: "Always. The square is smallest, 0, when x = a.",
              wrong: [
                ["Never. It is (−a, b).", "ALG.QUADRATIC.TURNING"],
                ["Sometimes. Only if a is positive."],
              ],
            },
            {
              statement: "Raj writes $x^2 - 8x$ as $(x - 8)^2 - 64$.",
              truth: false,
              right: "False. Halve the coefficient: (x − 4)² − 16.",
              wrong: [
                ["True. Use the 8 as it is.", "ALG.COMPLETE-SQUARE.HALF"],
                ["True. Subtract 8² to balance.", "ALG.COMPLETE-SQUARE.HALF"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return chosenText(question).includes(`(${-p.h}, ${p.c - p.h * p.h})`);
    return true;
  },
});
