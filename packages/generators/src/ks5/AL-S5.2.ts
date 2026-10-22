/**
 * @statement AL-S5.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S5.2: Test a proportion in the binomial distribution and interpret in context
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { binomialCdf, round } from "../shared/dist.ts";

interface Params {
  n: number;
  p0: number;
  x: number;
  alpha: 0.05 | 0.1;
}

const upper = (p: Params, k: number) => 1 - binomialCdf(p.n, p.p0, k - 1);

export default defineGenerator<Params>({
  id: "AL-S5.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.BINOMIAL.CUMULATIVE", "STA.HYPOTHESIS.CONCLUSION"],

  params(rng) {
    const n = rng.pick([15, 20, 25]);
    const p0 = rng.pick([0.2, 0.25, 0.3, 0.4]);
    const x = Math.round(n * p0) + rng.int(2, 6);
    const p = { n, p0, x, alpha: rng.pick([0.05, 0.1] as const) };
    const pv = upper(p, x);
    if (x > n || Math.abs(pv - p.alpha) < 0.005)
      reject("a p-value clearly on one side of the level");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const pv = round(upper(p, p.x), 4);
    const context = `A company claims that ${p.p0 * 100}% of its customers renew their membership. A manager thinks the true proportion is higher. In a random sample of ${p.n} customers, ${p.x} renew.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: context,
          ask: [
            "Using ",
            A.math(`X \\sim \\mathrm{B}(${p.n}, ${p.p0})`),
            `, find the p-value, P(X ≥ ${p.x}), to 4 decimal places.`,
          ],
          answer: A.number(pv, { accuracy: { dp: 4 } }),
          wrong: wrongs(pv, [
            {
              code: "PRO.BINOMIAL.CUMULATIVE",
              value: A.number(round(upper(p, p.x + 1), 4), { accuracy: { dp: 4 } }),
              feedback: `P(X ≥ ${p.x}) = 1 − P(X ≤ ${p.x - 1}): include ${p.x} itself.`,
            },
          ]),
          solution: [{ say: "", math: `P(X \\ge ${p.x}) = 1 - P(X \\le ${p.x - 1}) = ${pv}` }],
        });
      case 2: {
        const rej = pv < p.alpha;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [context, ` The p-value is ${pv}. The test is at the ${p.alpha * 100}% level.`],
          ask: "What is the conclusion?",
          correct: rej
            ? "Reject H₀: there is evidence that more than the claimed proportion renew."
            : "Do not reject H₀: there is not enough evidence that more than the claimed proportion renew.",
          distractors: [
            rej
              ? {
                  content:
                    "Do not reject H₀: there is not enough evidence that more than the claimed proportion renew.",
                  code: "STA.HYPOTHESIS.CONCLUSION",
                  feedback: `${pv} < ${p.alpha}, so the result is significant.`,
                }
              : {
                  content:
                    "Reject H₀: there is evidence that more than the claimed proportion renew.",
                  code: "STA.HYPOTHESIS.CONCLUSION",
                  feedback: `${pv} > ${p.alpha}, so the result is not significant.`,
                },
            {
              content: rej
                ? "The company's claim is proved false."
                : "The company's claim is proved true.",
              code: "STA.HYPOTHESIS.CONCLUSION",
              feedback: "Tests give evidence, not proof; state the conclusion in context.",
            },
          ],
          solution: [{ say: `Compare the p-value ${pv} with ${p.alpha}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A two-tailed binomial test is carried out at the ${p.alpha * 100}% level. Uma compares the probability in one tail with ${p.alpha}.`,
          truth: false,
          reasons: [
            {
              text: `False. In a two-tailed test the ${p.alpha * 100}% is split between the tails, so compare each tail with ${p.alpha / 2}.`,
              correct: true,
            },
            {
              text: "True. The significance level is the same in either kind of test.",
              code: "STA.HYPOTHESIS.CONCLUSION",
            },
            { text: `False. Compare it with ${p.alpha * 2}.`, code: "STA.HYPOTHESIS.CONCLUSION" },
          ],
          solution: [{ say: "Two-tailed: halve the significance level for each tail." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === round(upper(p, p.x), 4);
    if (question.key.depth === 2)
      return chosenText(question).startsWith(
        round(upper(p, p.x), 4) < p.alpha ? "Reject" : "Do not",
      );
    return true;
  },
});
