/**
 * @statement FM-FS2-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS2-04: Combine independent normal random variables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  s1: number;
  s2: number;
  a: number;
  n: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "FM-FS2-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.COMBINE"],

  params(rng) {
    const p = {
      s1: rng.int(2, 8),
      s2: rng.int(2, 8),
      a: rng.int(2, 4),
      n: rng.int(3, 8),
      s: rng.int(2, 9),
    };
    if (p.a * p.a * p.s1 * p.s1 <= p.s2 * p.s2) reject("a positive slip value");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a * p.a * p.s1 * p.s1 + p.s2 * p.s2;
        return A.standard({
          question: [
            "X and Y are independent with ",
            A.math(`X \\sim N(50, ${p.s1}^2)`),
            " and ",
            A.math(`Y \\sim N(30, ${p.s2}^2)`),
            ".",
          ],
          ask: ["Find ", A.math(`\\operatorname{Var}(${p.a}X - Y)`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.COMBINE",
              value: A.number(p.a * p.a * p.s1 * p.s1 - p.s2 * p.s2),
              feedback: "Variances add even when the variables are subtracted.",
            },
            {
              code: "PRO.COMBINE",
              value: A.number(p.a * p.s1 * p.s1 + p.s2 * p.s2),
              feedback: `Var(aX) = a²Var(X): square the ${p.a}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a}^2 \\times ${p.s1 * p.s1} + ${p.s2 * p.s2} = ${v}` }],
        });
      }
      case 2: {
        const v = p.n * p.s * p.s;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The masses of apples are independent and normally distributed with standard deviation ${p.s} g. A bag holds ${p.n} apples.`,
              ],
              ask: "Find the variance of the total mass of the apples in a bag, in g².",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.COMBINE",
              value: A.number(p.n * p.n * p.s * p.s),
              feedback: `The total is X₁ + … + X${p.n}, with variance ${p.n}σ². ${p.n}X (one apple ${p.n} times) would have variance ${p.n}²σ².`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\operatorname{Var}(X_1 + \\cdots + X_{${p.n}}) = ${p.n} \\times ${p.s}^2 = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Yan says the total mass of ${p.n} independent apples has the same distribution as ${p.n} times the mass of one apple.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Both have mean ${p.n}μ, but the total has variance ${p.n}σ² while ${p.n}X has variance ${p.n * p.n}σ²: heavy and light apples partly cancel out.`,
              correct: true,
            },
            {
              text: "True. Adding the same thing n times is multiplying by n.",
              code: "PRO.COMBINE",
            },
            { text: "True. The apples all have the same distribution.", code: "PRO.COMBINE" },
          ],
          solution: [{ say: "X₁ + X₂ is not the same random variable as 2X₁." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === p.a * p.a * p.s1 * p.s1 + p.s2 * p.s2;
    if (question.key.depth === 2) return numberAnswer(question) === p.n * p.s * p.s;
    return true;
  },
});
