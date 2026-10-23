/**
 * @statement FM-FS2-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS2-05: Use unbiased estimators and confidence intervals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  n: number;
  mean: number;
  ss: number;
  sigma: number;
  m: number;
}

const s2 = (p: Params) => round(p.ss / (p.n - 1), 2);
const upperLimit = (p: Params) => round(p.mean + (1.96 * p.sigma) / Math.sqrt(p.m), 2);

export default defineGenerator<Params>({
  id: "FM-FS2-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.VARIANCE.FORMULA", "STA.CONFIDENCE"],

  params(rng) {
    return {
      n: rng.int(8, 20),
      mean: round(rng.int(200, 900) / 10, 1),
      ss: rng.int(40, 400),
      sigma: rng.int(2, 9),
      m: rng.pick([16, 25, 36, 49, 64, 100]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = s2(p);
        return A.standard({
          question: [
            `A random sample of ${p.n} values has `,
            A.math(`\\sum (x - \\bar{x})^2 = ${p.ss}`),
            ".",
          ],
          ask: "Find an unbiased estimate of the population variance, to 2 decimal places.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "STA.VARIANCE.FORMULA",
              value: A.number(round(p.ss / p.n, 2), { accuracy: { dp: 2 } }),
              feedback: "Divide by n − 1 for an unbiased estimate.",
            },
          ]),
          solution: [{ say: "", math: `s^2 = \\frac{${p.ss}}{${p.n} - 1} = ${v}` }],
        });
      }
      case 2: {
        const v = upperLimit(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A random sample of ${p.m} values from a normal population with standard deviation ${p.sigma} has mean ${p.mean}.`,
              ],
              ask: "Find the upper limit of a 95% confidence interval for the population mean, to 2 decimal places.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "STA.CONFIDENCE",
              value: A.number(round(p.mean + 1.96 * p.sigma, 2), { accuracy: { dp: 2 } }),
              feedback: `Use the standard error σ/√n = ${p.sigma}/√${p.m}.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.mean} + 1.96 \\times \\frac{${p.sigma}}{\\sqrt{${p.m}}} = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Zak works out a 95% confidence interval (${round(p.mean - 1, 1)}, ${round(p.mean + 1, 1)}) and says there is a 95% probability that μ lies in this interval.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. μ is fixed, so this particular interval either contains it or not. 95% of intervals made this way would contain μ.",
              correct: true,
            },
            {
              text: "True. That is the definition of a 95% confidence interval.",
              code: "STA.CONFIDENCE",
            },
            { text: "True. 95% of the data lie in the interval.", code: "STA.CONFIDENCE" },
          ],
          solution: [{ say: "The probability is about the method, before the sample is taken." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === s2(p);
    if (question.key.depth === 2) return numberAnswer(question) === upperLimit(p);
    return true;
  },
});
