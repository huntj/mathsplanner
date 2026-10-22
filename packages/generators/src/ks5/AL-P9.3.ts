/**
 * @statement AL-P9.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P9.3: Solve equations using the Newton-Raphson method
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  x0: number;
  c: number;
  claimTrue: boolean;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "AL-P9.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.NEWTON-RAPHSON"],

  params(rng) {
    const k = rng.int(5, 30);
    const x0 = Math.round(Math.sqrt(k));
    if (x0 * x0 === k) reject("a non-square");
    return { k, x0, c: rng.int(3, 15), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const fx = p.x0 * p.x0 - p.k;
        const x1 = r3(p.x0 - fx / (2 * p.x0));
        return A.standard({
          question: [
            "Use one step of the Newton–Raphson method on ",
            A.math(`f(x) = x^2 - ${p.k}`),
            " with ",
            A.math(`x_0 = ${p.x0}`),
            ".",
          ],
          ask: ["Find ", A.math("x_1"), " to 3 decimal places."],
          answer: A.number(x1, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(x1, [
            {
              code: "ALG.NEWTON-RAPHSON",
              value: A.number(r3(p.x0 + fx / (2 * p.x0)), { accuracy: { dp: 3 } }),
              feedback: "x₁ = x₀ − f(x₀)/f′(x₀): subtract.",
            },
          ]),
          solution: [{ say: "", math: `x_1 = ${p.x0} - \\frac{${fx}}{${2 * p.x0}} = ${x1}` }],
        });
      }
      case 2: {
        const x0 = Math.max(2, Math.round(Math.cbrt(p.c)) + 1);
        const f = x0 ** 3 - 2 * x0 - p.c;
        const d = 3 * x0 * x0 - 2;
        const x1 = r3(x0 - f / d);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Apply the Newton–Raphson method once to ",
                A.math(`f(x) = x^3 - 2x - ${p.c}`),
                ", starting from ",
                A.math(`x_0 = ${x0}`),
                ".",
              ],
              ask: "Give x₁ to 3 decimal places.",
            },
          ],
          answer: A.number(x1, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(
            x1,
            [
              {
                code: "ALG.NEWTON-RAPHSON",
                value: A.number(r3(x0 - d / f), { accuracy: { dp: 3 } }),
                feedback: "Divide f(x₀) by f′(x₀), not the other way round.",
              },
            ].filter(() => f !== 0),
          ),
          solution: [
            {
              say: "",
              math: `f(${x0}) = ${f},\\ f'(${x0}) = ${d},\\ x_1 = ${x0} - \\frac{${f}}{${d}} = ${x1}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Pip says the Newton–Raphson method fails if f′(x₀) = 0."
            : "Pip says the Newton–Raphson method always converges to the nearest root, whatever x₀ is.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. The formula divides by f′(x₀); geometrically the tangent is horizontal and never meets the x-axis.",
                  correct: true,
                },
                { text: "False. It only fails if f(x₀) = 0.", code: "ALG.NEWTON-RAPHSON" },
                { text: "False. It never fails." },
              ]
            : [
                {
                  text: "False. Near a stationary point the tangent can send x₁ far away, or to a different root; it can even diverge.",
                  correct: true,
                },
                { text: "True. Each step always gets closer.", code: "ALG.NEWTON-RAPHSON" },
                {
                  text: "True. Tangents always point at the nearest root.",
                  code: "ALG.NEWTON-RAPHSON",
                },
              ],
          solution: [{ say: "Choose x₀ close to the root and away from stationary points." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r3(p.x0 - (p.x0 * p.x0 - p.k) / (2 * p.x0));
    return true;
  },
});
