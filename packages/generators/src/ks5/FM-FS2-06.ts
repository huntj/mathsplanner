/**
 * @statement FM-FS2-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS2-06: Use the t-distribution and F-distribution for tests and confidence intervals, including
// paired t-tests
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  n: number;
  mean: number;
  mu: number;
  s: number;
}

const tStat = (p: Params) => round((p.mean - p.mu) / (p.s / Math.sqrt(p.n)), 3);

export default defineGenerator<Params>({
  id: "FM-FS2-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.T-DIST"],

  params(rng) {
    const p = {
      n: rng.int(6, 20),
      mean: round(rng.int(100, 300) / 10, 1),
      mu: rng.int(10, 30),
      s: round(rng.int(10, 60) / 10, 1),
    };
    if (Math.abs(p.mean - p.mu) < 0.5) reject("a sample mean away from μ₀");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `A t-test for a population mean uses a random sample of ${p.n} values from a normal population with unknown variance.`,
          ],
          ask: "How many degrees of freedom does the t-distribution have?",
          answer: A.number(p.n - 1),
          wrong: wrongs(p.n - 1, [
            {
              code: "STA.T-DIST",
              value: A.number(p.n),
              feedback: "One degree of freedom is used up estimating the mean: ν = n − 1.",
            },
          ]),
          solution: [{ say: `ν = ${p.n} − 1 = ${p.n - 1}.` }],
        });
      case 2: {
        const v = tStat(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A random sample of ${p.n} values has mean ${p.mean} and unbiased standard deviation estimate s = ${p.s}.`,
              ],
              ask: [
                "Find the test statistic t for H₀: μ = ",
                A.math(String(p.mu)),
                ", to 3 decimal places.",
              ],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(v, [
            {
              code: "STA.T-DIST",
              value: A.number(round((p.mean - p.mu) / (p.s / p.n), 3), { accuracy: { dp: 3 } }),
              feedback: "The standard error is s/√n.",
            },
          ]),
          solution: [
            { say: "", math: `t = \\frac{${p.mean} - ${p.mu}}{${p.s}/\\sqrt{${p.n}}} = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Abi wants to compare the test scores of two different classes, and says a paired t-test is the right test.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A paired test needs matched pairs, such as the same students before and after. Two different classes are independent samples, so use a two-sample test.",
              correct: true,
            },
            { text: "True. Any two sets of scores can be paired.", code: "STA.T-DIST" },
            { text: "True. A paired test is always more powerful.", code: "STA.T-DIST" },
          ],
          solution: [
            {
              say: "Pairing only makes sense when each value in one sample matches one in the other.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n - 1;
    if (question.key.depth === 2) return numberAnswer(question) === tStat(p);
    return true;
  },
});
