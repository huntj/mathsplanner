/**
 * @statement AL-S4.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S4.1: Use discrete probability distributions, including the binomial distribution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { binomialCdf, binomialPmf, round } from "../shared/dist.ts";

export interface Params {
  n: number;
  p: number;
  k: number;
  less: boolean;
}

export default defineGenerator<Params>({
  id: "AL-S4.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.BINOMIAL.CUMULATIVE", "PRO.MODEL.ASSUMPTION"],

  params(rng) {
    const n = rng.int(8, 20);
    const p = rng.pick([0.2, 0.25, 0.3, 0.4, 0.6]);
    // Near the mean, so the probabilities are not tiny.
    const k = Math.min(n - 1, Math.max(1, Math.round(n * p) + rng.int(-2, 2)));
    return { n, p, k, less: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const dist = `X \\sim \\mathrm{B}(${p.n}, ${p.p})`;
    switch (depth) {
      case 1: {
        const v = round(binomialPmf(p.n, p.p, p.k), 4);
        return A.standard({
          question: [
            "Given ",
            A.math(dist),
            ", find ",
            A.math(`P(X = ${p.k})`),
            " to 4 decimal places.",
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.BINOMIAL.CUMULATIVE",
              value: A.number(round(p.p ** p.k * (1 - p.p) ** (p.n - p.k), 4), {
                accuracy: { dp: 4 },
              }),
              feedback: `Multiply by ⁿCᵣ = ${p.n}C${p.k}: the ${p.k} successes can come in any order.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\binom{${p.n}}{${p.k}}(${p.p})^{${p.k}}(${1 - p.p})^{${p.n - p.k}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const right = round(binomialCdf(p.n, p.p, p.less ? p.k - 1 : p.k), 4);
        const slip = round(binomialCdf(p.n, p.p, p.less ? p.k : p.k - 1), 4);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given ",
                A.math(dist),
                ", find ",
                A.math(`P(X ${p.less ? "<" : "\\le"} ${p.k})`),
                " to 4 decimal places.",
              ],
            },
          ],
          answer: A.number(right, { accuracy: { dp: 4 } }),
          wrong: wrongs(right, [
            {
              code: "PRO.BINOMIAL.CUMULATIVE",
              value: A.number(slip, { accuracy: { dp: 4 } }),
              feedback: p.less ? `X < ${p.k} means X ≤ ${p.k - 1}.` : `X ≤ ${p.k} includes ${p.k}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `P(X ${p.less ? "<" : "\\le"} ${p.k}) = P(X \\le ${p.less ? p.k - 1 : p.k}) = ${right}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Five cards are dealt from a normal pack without replacement. Ella models the number of hearts with B(5, ¼).",
          truth: false,
          reasons: [
            {
              text: "False. Without replacement the probability of a heart changes after each card, so the trials are not independent with constant probability.",
              correct: true,
            },
            {
              text: "True. A quarter of the cards are hearts, so each card has P = ¼.",
              code: "PRO.MODEL.ASSUMPTION",
            },
            { text: "True. Any count of successes is binomial.", code: "PRO.MODEL.ASSUMPTION" },
          ],
          solution: [
            {
              say: "Binomial conditions: fixed n, independent trials, two outcomes, constant probability.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === round(binomialPmf(p.n, p.p, p.k), 4);
    return true;
  },
});
