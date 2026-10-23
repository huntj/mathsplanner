/**
 * @statement GH-A22.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A22.b: Solve quadratic inequalities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  k: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GH-A22.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.QUADRATIC-REGION", "ALG.QUADRATIC.ONE-ROOT"],

  params(rng) {
    const p = { k: rng.int(2, 9), a: rng.int(-6, 3), b: 0 };
    p.b = p.a + rng.int(2, 7);
    if (p.a === 0 || p.b === 0 || p.a === -p.b) reject("roots off zero");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `-${p.k} < x < ${p.k}`;
        return A.choice({
          rng,
          question: ["Solve ", A.math(`x^2 < ${p.k * p.k}`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x < ${p.k}`),
              code: "ALG.QUADRATIC.ONE-ROOT",
              feedback: `Negative values work too: (−${p.k + 1})² is not less than ${p.k * p.k}, but (−1)² is.`,
            },
            {
              content: A.math(`x < -${p.k} \\text{ or } x > ${p.k}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `Those values make x² bigger than ${p.k * p.k}. The solution is between the roots.`,
            },
          ],
          solution: [
            {
              say: `x² = ${p.k * p.k} at x = ±${p.k}, and x² is smaller between them: `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        const right = `x < ${p.a} \\text{ or } x > ${p.b}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Solve ", A.math(`${poly([1, -(p.a + p.b), p.a * p.b])} > 0`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${p.a} < x < ${p.b}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback:
                "The U-shaped graph is below the x-axis between its roots, and above it outside them.",
            },
            {
              content: A.math(`x < ${-p.b} \\text{ or } x > ${-p.a}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: "The roots of (x − a)(x − b) are a and b; check the signs.",
            },
          ],
          solution: [
            {
              say: `The roots are ${p.a} and ${p.b}; the graph is above the x-axis outside them: `,
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Bea says the solution of ",
            A.math(`x^2 > ${p.k * p.k}`),
            " is ",
            A.math(`x > ${p.k}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. x = −${p.k + 1} also works, since (−${p.k + 1})² = ${(p.k + 1) ** 2}. The solution is x < −${p.k} or x > ${p.k}.`,
              correct: true,
            },
            { text: "True. Square root both sides.", code: "ALG.QUADRATIC.ONE-ROOT" },
            { text: `False. It is −${p.k} < x < ${p.k}.`, code: "ALG.INEQUALITY.QUADRATIC-REGION" },
          ],
          solution: [{ say: "Sketch y = x² and the line y = k² to see both parts." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `-${p.k} < x < ${p.k}`;
    if (question.key.depth === 2)
      return chosenText(question) === `x < ${p.a} \\text{ or } x > ${p.b}`;
    return true;
  },
});
