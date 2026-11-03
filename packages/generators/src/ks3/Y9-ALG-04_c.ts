/**
 * @statement Y9-ALG-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-04.c: Identify parallel lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  m: number;
  c: number;
  d: number;
  x0: number;
  y0: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-04.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C"],

  params(rng) {
    const p = {
      m: rng.int(2, 6) * rng.pick([1, -1]),
      c: rng.int(-8, 8),
      d: rng.int(-8, 8),
      x0: rng.int(1, 4),
      y0: rng.int(-5, 9),
    };
    if (
      p.c === p.d ||
      p.c === 0 ||
      Math.abs(p.c) === Math.abs(p.m) ||
      Math.abs(p.d) === Math.abs(p.m)
    )
      reject("different lines");
    if (p.y0 - p.m * p.x0 === p.c) reject("a new line through the point");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = lineLatex(p.m, p.d);
        return A.choice({
          rng,
          question: ["Which line is parallel to ", A.math(lineLatex(p.m, p.c)), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(lineLatex(p.c, p.m)),
              code: "ALG.LINE.M-C",
              feedback: `Parallel lines have the same gradient, ${p.m}, the number with x.`,
            },
            { content: A.math(lineLatex(-p.m, p.c)), feedback: "That line slopes the other way." },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: `Same gradient, ${p.m}: `, math: right }],
        });
      }
      case 2: {
        const c2 = p.y0 - p.m * p.x0;
        const right = lineLatex(p.m, c2);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which line is parallel to ",
            A.math(lineLatex(p.m, p.c)),
            " and passes through ",
            A.math(coord([p.x0, p.y0])),
            "?",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(lineLatex(p.m, p.y0)),
              code: "ALG.LINE.M-C",
              feedback: `${p.y0} is the y-coordinate of the point, not the intercept. Substitute to find c.`,
            },
            {
              content: A.math(lineLatex(p.m, p.c)),
              feedback: `That is the same line, which does not pass through ${coord([p.x0, p.y0])}.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            { say: "", math: `${p.y0} = ${p.m} \\times ${p.x0} + c \\Rightarrow c = ${c2}` },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["Two different straight lines with the same y-intercept are parallel."],
              truth: "never",
              reasons: [
                {
                  text: "Never. They both pass through the same point on the y-axis, so they cross there. Parallel lines never meet.",
                  correct: true,
                },
                { text: "Always. The same c means the same direction.", code: "ALG.LINE.M-C" },
                { text: "Sometimes. If their gradients are close.", code: "ALG.LINE.M-C" },
              ],
              solution: [{ say: "Parallel lines share a gradient, not an intercept." }],
            }),
          [
            {
              statement: "Ali says $y = 3x + 1$ and $y = 3x - 5$ are parallel.",
              truth: true,
              right: "True. Both have gradient 3.",
              wrong: [
                ["False. They have different intercepts.", "ALG.LINE.M-C"],
                ["False. Parallel lines must have the same equation."],
              ],
            },
            {
              statement: "Bea says $y = 2x + 4$ and $y = 4x + 2$ are parallel.",
              truth: false,
              right: "False. Their gradients are 2 and 4, so they are not parallel.",
              wrong: [
                ["True. They use the same numbers.", "ALG.LINE.M-C"],
                ["True. Both go up from left to right."],
              ],
            },
            {
              claim: "Two lines with the same gradient are parallel.",
              truth: "sometimes",
              right:
                "Sometimes. They are parallel unless they also have the same intercept, when they are the same line.",
              wrong: [
                ["Never. Parallel lines need different gradients.", "ALG.LINE.M-C"],
                ["Always, even when they have the same equation."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === lineLatex(p.m, p.d);
    if (question.key.depth === 2) return chosenText(question) === lineLatex(p.m, p.y0 - p.m * p.x0);
    return true;
  },
});
