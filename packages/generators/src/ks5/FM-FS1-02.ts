/**
 * @statement FM-FS1-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-02: Use the Poisson distribution, including additive property and approximation to the binomial
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { poissonCdf, poissonPmf, round } from "../shared/dist.ts";

interface Params {
  lambda: number;
  k: number;
  a: number;
  b: number;
  n: number;
}

const r4 = (x: number) => round(x, 4);

export default defineGenerator<Params>({
  id: "FM-FS1-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.POISSON"],

  params(rng) {
    const p = {
      lambda: rng.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5]),
      k: rng.int(1, 6),
      a: rng.pick([0.5, 1, 1.5, 2]),
      b: rng.pick([1, 1.5, 2, 2.5, 3]),
      n: rng.int(2, 5),
    };
    if (Math.abs(p.a * p.b - (p.a + p.b)) < 0.5)
      reject("a product of means that differs from their sum");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r4(poissonPmf(p.lambda, p.k));
        return A.standard({
          question: ["X has a Poisson distribution with mean ", A.math(String(p.lambda)), "."],
          ask: ["Find ", A.math(`P(X = ${p.k})`), ", to 4 decimal places."],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.POISSON",
              value: A.number(r4(poissonCdf(p.lambda, p.k)), { accuracy: { dp: 4 } }),
              feedback: `That is P(X ≤ ${p.k}). P(X = ${p.k}) = e^(−λ)λ^${p.k}/${p.k}!.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{e^{-${p.lambda}} \\times ${p.lambda}^{${p.k}}}{${p.k}!} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const sum = p.a + p.b;
        const v = r4(poissonCdf(sum, p.n));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The numbers of calls to two offices in an hour are independent, with Poisson distributions with means ${p.a} and ${p.b}.`,
              ],
              ask: `Find the probability that there are at most ${p.n} calls in total in an hour, to 4 decimal places.`,
            },
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.POISSON",
              value: A.number(r4(poissonCdf(p.a * p.b, p.n)), { accuracy: { dp: 4 } }),
              feedback: `The total has a Poisson distribution with mean ${p.a} + ${p.b} = ${sum}.`,
            },
          ]),
          solution: [{ say: `The total is Po(${sum}), so P(T ≤ ${p.n}) = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Oz says ",
            A.math("B(200, 0.5)"),
            " can be approximated well by a Poisson distribution with mean 100.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The Poisson approximation needs n large and p small (so np is moderate). With p = 0.5 the variance np(1 − p) = 50 is far from the Poisson variance 100; a normal approximation suits this better.",
              correct: true,
            },
            {
              text: "True. Any binomial with large n can be approximated by Po(np).",
              code: "PRO.POISSON",
            },
            { text: "True. The means match, so the distributions match.", code: "PRO.POISSON" },
          ],
          solution: [{ say: "For a Poisson distribution the mean equals the variance." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r4(poissonPmf(p.lambda, p.k));
    if (question.key.depth === 2) return numberAnswer(question) === r4(poissonCdf(p.a + p.b, p.n));
    return true;
  },
});
