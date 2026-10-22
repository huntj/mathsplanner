/**
 * @statement AL-S5.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S5.3: Test the mean of a normal distribution with known variance
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  mu: number;
  sigma: number;
  n: number;
  xbar: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const z = (p: Params) => (p.xbar - p.mu) / (p.sigma / Math.sqrt(p.n));

export default defineGenerator<Params>({
  id: "AL-S5.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HYPOTHESIS.SAMPLE-MEAN", "STA.HYPOTHESIS.CONCLUSION"],

  params(rng) {
    const n = rng.pick([16, 25, 36, 49, 64]);
    const sigma = rng.int(4, 12);
    const mu = 10 * rng.int(5, 20);
    const p = {
      mu,
      sigma,
      n,
      xbar:
        Math.round((mu + rng.pick([0.8, 1.2, 1.5, 2.1, 2.6]) * (sigma / Math.sqrt(n))) * 10) / 10,
    };
    if (Math.abs(z(p) - 1.6449) < 0.05) reject("a test statistic clearly on one side");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const zs = r2(z(p));
    const context = `The masses of bags of flour are normally distributed with standard deviation ${p.sigma} g. The mean is claimed to be ${p.mu} g, but a baker thinks it is higher. A random sample of ${p.n} bags has mean ${p.xbar} g.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: context,
          ask: "Calculate the test statistic z, to 2 decimal places.",
          answer: A.number(zs, { accuracy: { dp: 2 } }),
          wrong: wrongs(zs, [
            {
              code: "STA.HYPOTHESIS.SAMPLE-MEAN",
              value: A.number(r2((p.xbar - p.mu) / p.sigma), { accuracy: { dp: 2 } }),
              feedback: `The sample mean has standard deviation σ/√n = ${p.sigma}/√${p.n}.`,
            },
          ]),
          solution: [
            { say: "", math: `z = \\frac{${p.xbar} - ${p.mu}}{${p.sigma}/\\sqrt{${p.n}}} = ${zs}` },
          ],
        });
      case 2: {
        const rej = zs > 1.6449;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `${context} The test statistic is z = ${zs}. The test is one-tailed at the 5% level, with critical value 1.6449.`,
          ask: "What is the conclusion?",
          correct: rej
            ? "Reject H₀: there is evidence that the mean mass is more than claimed."
            : "Do not reject H₀: there is not enough evidence that the mean mass is more than claimed.",
          distractors: [
            rej
              ? {
                  content:
                    "Do not reject H₀: there is not enough evidence that the mean mass is more than claimed.",
                  code: "STA.HYPOTHESIS.CONCLUSION",
                  feedback: `${zs} > 1.6449, so z is in the critical region.`,
                }
              : {
                  content: "Reject H₀: there is evidence that the mean mass is more than claimed.",
                  code: "STA.HYPOTHESIS.CONCLUSION",
                  feedback: `${zs} < 1.6449, so z is not in the critical region.`,
                },
            {
              content: `The mean mass is exactly ${p.xbar} g.`,
              code: "STA.HYPOTHESIS.CONCLUSION",
              feedback: "The sample mean only estimates the population mean.",
            },
          ],
          solution: [{ say: `Compare z = ${zs} with 1.6449.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${context} Ivy says the sample mean has standard deviation ${p.sigma} g, the same as a single bag.`,
          truth: false,
          reasons: [
            {
              text: `False. Averaging reduces variability: X̄ ~ N(μ, σ²/n), so its standard deviation is ${p.sigma}/√${p.n} = ${r2(p.sigma / Math.sqrt(p.n))} g.`,
              correct: true,
            },
            {
              text: "True. The sample comes from the same population.",
              code: "STA.HYPOTHESIS.SAMPLE-MEAN",
            },
            { text: `False. It is ${p.sigma} × ${p.n}.`, code: "STA.HYPOTHESIS.SAMPLE-MEAN" },
          ],
          solution: [
            { say: "The distribution of the sample mean is narrower than the population's." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(z(p));
    if (question.key.depth === 2)
      return chosenText(question).startsWith(r2(z(p)) > 1.6449 ? "Reject" : "Do not");
    return true;
  },
});
