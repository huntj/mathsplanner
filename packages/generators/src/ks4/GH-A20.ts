/**
 * @statement GH-A20
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A20: Find approximate solutions to equations numerically using iteration
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** x(n+1) = √(k + x(n)), starting at x0. */
  k: number;
  x0: number;
  /** Depth 4: whether the claimed interval is the right one. */
  claimTrue: boolean;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const step = (k: number, x: number) => Math.sqrt(k + x);
const iterate = (p: Params, n: number) => {
  let x = p.x0;
  for (let i = 0; i < n; i++) x = step(p.k, x);
  return x;
};

export default defineGenerator<Params>({
  id: "GH-A20",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FUNCTION.ORDER", "ALG.ITERATION.SUBSTITUTE"],

  params(rng) {
    const p = { k: rng.int(3, 12), x0: rng.int(1, 3), claimTrue: rng.bool() };
    if (Number.isInteger(Math.sqrt(1 + 4 * p.k)) || r3(iterate(p, 1)) === r3(iterate(p, 3)))
      reject("a start that is not already the solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const formula = A.math(`x_{n+1} = \\sqrt{${p.k} + x_n}`);
    switch (depth) {
      case 1: {
        const x1 = r3(iterate(p, 1));
        return A.standard({
          question: ["Use the iteration formula ", formula, " with ", A.math(`x_0 = ${p.x0}`), "."],
          ask: ["Find ", A.math("x_1"), " to 3 decimal places."],
          answer: A.number(x1, { accuracy: { dp: 3 } }),
          wrong: [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(r3(Math.sqrt(p.k) + p.x0), { accuracy: { dp: 3 } }),
              feedback: `Add ${p.k} and ${p.x0} first, then take the square root.`,
            },
          ],
          solution: [
            { say: "", math: `x_1 = \\sqrt{${p.k} + ${p.x0}} = \\sqrt{${p.k + p.x0}} = ${x1}` },
          ],
        });
      }
      case 2: {
        const x3 = r3(iterate(p, 3));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use the iteration formula ",
                formula,
                " with ",
                A.math(`x_0 = ${p.x0}`),
                ".",
              ],
              ask: ["Find ", A.math("x_3"), " to 3 decimal places."],
            },
            {
              question: [
                "Starting with ",
                A.math(`x_0 = ${p.x0}`),
                ", iterate ",
                formula,
                " three times.",
              ],
              ask: ["Give ", A.math("x_3"), " to 3 decimal places."],
            },
          ],
          answer: A.number(x3, { accuracy: { dp: 3 } }),
          wrong: [
            {
              code: "ALG.ITERATION.SUBSTITUTE",
              value: A.number(r3(iterate(p, 1)), { accuracy: { dp: 3 } }),
              feedback: "Feed each answer back in: use x₁ to find x₂, then x₂ to find x₃.",
            },
          ],
          solution: [
            {
              say: `x₁ = ${r3(iterate(p, 1))}, x₂ = ${r3(iterate(p, 2))}, x₃ = ${x3} (keep full accuracy on the calculator between steps).`,
            },
          ],
        });
      }
      default: {
        const root = (1 + Math.sqrt(1 + 4 * p.k)) / 2;
        const a = Math.floor(root) + (p.claimTrue ? 0 : 1);
        const f = (x: number) => x * x - x - p.k;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The iteration ",
            formula,
            " solves ",
            A.math(`x^2 - x - ${p.k} = 0`),
            `. Raj says this equation has a solution between ${a} and ${a + 1}.`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. When x = ${a} the left side is ${f(a)}, and when x = ${a + 1} it is ${f(a + 1)}. The sign changes, so there is a solution between them.`,
                  correct: true,
                },
                { text: "False. You can only tell by solving the equation exactly." },
                { text: `False. Both values are ${f(a + 1) > 0 ? "positive" : "negative"}.` },
              ]
            : [
                {
                  text: `False. At x = ${a} the left side is ${f(a)} and at x = ${a + 1} it is ${f(a + 1)}: no sign change, so no solution is shown there.`,
                  correct: true,
                },
                { text: "True. Every interval contains a solution." },
                { text: "True. The iteration always converges to any interval you choose." },
              ],
          solution: [
            { say: "A change of sign between two values of x shows a solution lies between them." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r3(iterate(p, 1));
    if (question.key.depth === 2) return numberAnswer(question) === r3(iterate(p, 3));
    return true;
  },
});
