/**
 * @statement AL-P6.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.2: Know and use y = eˣ, including that the gradient of e^(kx) is ke^(kx)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  a: number;
}

export default defineGenerator<Params>({
  id: "AL-P6.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXP.DERIVATIVE"],

  params(rng) {
    return { k: rng.pick([-3, -2, 2, 3, 4, 5]), a: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find ", A.math("\\frac{dy}{dx}"), " for ", A.math(`y = e^{${p.k}x}`), "."],
          answer: A.exact(`${p.k}e^{${p.k}x}`),
          wrong: [
            {
              code: "ALG.EXP.DERIVATIVE",
              value: A.exact(`e^{${p.k}x}`),
              feedback: `The gradient of e^(kx) is ke^(kx): multiply by k = ${p.k}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{d}{dx}e^{${p.k}x} = ${p.k}e^{${p.k}x}` }],
        });
      case 2: {
        const g = p.a * p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the gradient of ",
                A.math(`y = ${p.a}e^{${p.k}x}`),
                " at the point where it crosses the y-axis.",
              ],
            },
            {
              question: ["The curve ", A.math(`y = ${p.a}e^{${p.k}x}`), " meets the y-axis at P."],
              ask: "Find the gradient of the curve at P.",
            },
          ],
          answer: A.number(g),
          wrong: signedWrongs(g, [
            {
              code: "ALG.EXP.DERIVATIVE",
              value: A.number(p.a),
              feedback: `dy/dx = ${p.a} × ${p.k}e^(${p.k}x); at x = 0 this is ${g}.`,
            },
          ]),
          solution: [
            { say: "", math: `\\frac{dy}{dx} = ${g}e^{${p.k}x};\\ x = 0 \\Rightarrow ${g}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo says the gradient of ",
            A.math(`y = e^{${p.k}x}`),
            " is ",
            A.math(`e^{${p.k}x}`),
            ", because eˣ is its own gradient.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. eˣ is its own gradient, but e^(${p.k}x) has gradient ${p.k}e^(${p.k}x): the ${p.k} comes down as a factor.`,
              correct: true,
            },
            {
              text: "True. Every exponential with base e is its own gradient.",
              code: "ALG.EXP.DERIVATIVE",
            },
            { text: `False. It is ${p.k}x e^(${p.k}x − 1).`, code: "ALG.EXP.DERIVATIVE" },
          ],
          solution: [{ say: "d/dx e^(kx) = ke^(kx)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === p.a * p.k;
    return true;
  },
});
