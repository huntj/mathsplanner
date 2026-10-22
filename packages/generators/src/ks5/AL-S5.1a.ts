/**
 * @statement AL-S5.1a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S5.1a: Use the language of hypothesis testing: hypotheses, significance level, test statistic,
// one and two tails, critical value and region, p-value
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { binomialCdf } from "../shared/dist.ts";

interface Params {
  n: number;
  p0: number;
  alpha: 0.05 | 0.1;
  prop: number;
}

/** Smallest c with P(X ≥ c) ≤ α for X ~ B(n, p0). */
function upperCritical(n: number, p0: number, alpha: number): number {
  for (let c = 0; c <= n; c++) if (1 - binomialCdf(n, p0, c - 1) <= alpha) return c;
  return n + 1;
}

export default defineGenerator<Params>({
  id: "AL-S5.1a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HYPOTHESIS.LANGUAGE", "PRO.BINOMIAL.CUMULATIVE"],

  params(rng) {
    const p = {
      n: rng.pick([20, 25, 30]),
      p0: rng.pick([0.2, 0.3, 0.4, 0.5]),
      alpha: rng.pick([0.05, 0.1] as const),
      prop: rng.pick([0.6, 0.65, 0.7]),
    };
    if (upperCritical(p.n, p.p0, p.alpha) > p.n) reject("a critical region that exists");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `A coin is thought to be biased towards heads. In 50 flips it lands on heads ${Math.round(50 * p.prop)} times. A test is carried out on p, the probability of heads.`,
          ask: "Which hypotheses are correct?",
          correct: A.math("H_0: p = 0.5,\\quad H_1: p > 0.5"),
          distractors: [
            {
              content: A.math("H_0: p = 0.5,\\quad H_1: p \\ne 0.5"),
              code: "STA.HYPOTHESIS.LANGUAGE",
              feedback:
                "The suspicion is biased towards heads, so the test is one-tailed: p > 0.5.",
            },
            {
              content: A.math(`H_0: p = ${p.prop},\\quad H_1: p > ${p.prop}`),
              code: "STA.HYPOTHESIS.LANGUAGE",
              feedback:
                "Hypotheses are about the population parameter, using the value assumed under H₀ (0.5), not the sample proportion.",
            },
          ],
          solution: [
            {
              say: "H₀ states the parameter's value if there is no bias; H₁ states the suspected direction.",
            },
          ],
        });
      case 2: {
        const c = upperCritical(p.n, p.p0, p.alpha);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A test uses `,
                A.math(`X \\sim \\mathrm{B}(${p.n}, ${p.p0})`),
                ` with `,
                A.math(`H_1: p > ${p.p0}`),
                ` at the ${p.alpha * 100}% level.`,
              ],
              ask: "The critical region is X ≥ c. Find c.",
            },
          ],
          answer: A.number(c),
          wrong: wrongs(c, [
            {
              code: "PRO.BINOMIAL.CUMULATIVE",
              value: A.number(c - 1),
              feedback: `P(X ≥ ${c - 1}) = ${(1 - binomialCdf(p.n, p.p0, c - 2)).toFixed(4)}, which is more than ${p.alpha}.`,
            },
          ]),
          solution: [
            {
              say: `P(X ≥ ${c}) = ${(1 - binomialCdf(p.n, p.p0, c - 1)).toFixed(4)} ≤ ${p.alpha}, but P(X ≥ ${c - 1}) = ${(1 - binomialCdf(p.n, p.p0, c - 2)).toFixed(4)} > ${p.alpha}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A test is carried out at the ${p.alpha * 100}% significance level. Ola says this means there is a ${p.alpha * 100}% chance that H₀ is true.`,
          truth: false,
          reasons: [
            {
              text: `False. The significance level is the probability of rejecting H₀ when H₀ is actually true.`,
              correct: true,
            },
            {
              text: "True. The significance level is the probability that H₀ is correct.",
              code: "STA.HYPOTHESIS.LANGUAGE",
            },
            {
              text: "True. It is the probability that H₁ is wrong.",
              code: "STA.HYPOTHESIS.LANGUAGE",
            },
          ],
          solution: [
            {
              say: "The significance level is the largest acceptable probability of wrongly rejecting H₀.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return numberAnswer(question) === upperCritical(p.n, p.p0, p.alpha);
    return true;
  },
});
