/**
 * @statement AL-P9.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P9.2: Solve equations approximately using iteration, with staircase and cobweb diagrams, and
// recognise convergence
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  x0: number;
  cobweb: boolean;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const g = (p: Params, x: number) => Math.cbrt(p.k + x);

export default defineGenerator<Params>({
  id: "AL-P9.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.ITERATION.SUBSTITUTE", "ALG.ITERATION.CONVERGE"],

  params(rng) {
    const p = { k: rng.int(3, 20), x0: rng.int(1, 3), cobweb: rng.bool() };
    if (r3(g(p, p.x0)) === r3(g(p, g(p, p.x0)))) reject("a start that is not already the root");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const formula = A.math(`x_{n+1} = \\sqrt[3]{${p.k} + x_n}`);
    switch (depth) {
      case 1: {
        const x1 = g(p, p.x0);
        const x2 = r3(g(p, x1));
        return A.standard({
          question: ["Use the iteration ", formula, " with ", A.math(`x_0 = ${p.x0}`), "."],
          ask: ["Find ", A.math("x_2"), " to 3 decimal places."],
          answer: A.number(x2, { accuracy: { dp: 3 } }),
          wrong: [
            {
              code: "ALG.ITERATION.SUBSTITUTE",
              value: A.number(r3(x1), { accuracy: { dp: 3 } }),
              feedback: "That is x₁. Put it back into the formula to get x₂.",
            },
          ],
          solution: [{ say: `x₁ = ${r3(x1)}, x₂ = ${x2}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: p.cobweb
            ? [
                "An iteration x = g(x) converges to a root α, and g′(α) is negative (between −1 and 0).",
              ]
            : [
                "An iteration x = g(x) converges to a root α, and g′(α) is positive (between 0 and 1).",
              ],
          ask: "What does the diagram of the iteration look like?",
          correct: p.cobweb
            ? "A cobweb, spiralling in towards α."
            : "A staircase, stepping towards α from one side.",
          distractors: [
            {
              content: p.cobweb
                ? "A staircase, stepping towards α from one side."
                : "A cobweb, spiralling in towards α.",
              code: "ALG.ITERATION.CONVERGE",
              feedback: p.cobweb
                ? "A negative gradient makes the values alternate either side of α: a cobweb."
                : "A positive gradient keeps the values on one side of α: a staircase.",
            },
            {
              content: "It moves away from α.",
              code: "ALG.ITERATION.CONVERGE",
              feedback: "|g′(α)| < 1, so the iteration converges.",
            },
          ],
          solution: [{ say: "0 < g′(α) < 1 gives a staircase; −1 < g′(α) < 0 gives a cobweb." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ned says every rearrangement of ",
            A.math("f(x) = 0"),
            " into the form ",
            A.math("x = g(x)"),
            " gives an iteration that converges to a root.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It only converges near a root α when |g′(α)| < 1; other rearrangements diverge.",
              correct: true,
            },
            {
              text: "True. The root satisfies every rearrangement, so the iteration finds it.",
              code: "ALG.ITERATION.CONVERGE",
            },
            {
              text: "True. Iterations always settle down eventually.",
              code: "ALG.ITERATION.CONVERGE",
            },
          ],
          solution: [
            { say: "Try a different rearrangement if the values move away from the root." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r3(g(p, g(p, p.x0)));
    return true;
  },
});
