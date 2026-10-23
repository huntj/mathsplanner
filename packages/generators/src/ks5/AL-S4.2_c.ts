/**
 * @statement AL-S4.2.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S4.2.c: Standardise to find an unknown mean or standard deviation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { invPhi, round } from "../shared/dist.ts";

interface Params {
  mu: number;
  sigma: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "AL-S4.2.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.NORMAL.STANDARDISE"],

  params(rng) {
    return { mu: rng.int(30, 70), sigma: rng.int(3, 10), q: rng.pick([5, 10, 20, 80, 90, 95]) };
  },

  build(p, depth, rng): QuestionDraft {
    const prob = p.q / 100;
    const z = invPhi(prob);
    const xval = round(p.mu + p.sigma * z, 1);
    switch (depth) {
      case 1: {
        const mu = round(xval - p.sigma * z, 1);
        return A.standard({
          question: [
            "X has a normal distribution with standard deviation ",
            A.math(String(p.sigma)),
            " and ",
            A.math(`P(X < ${xval}) = ${prob}`),
            ".",
          ],
          ask: "Find the mean of X, to 1 decimal place.",
          answer: A.number(mu, { accuracy: { dp: 1 } }),
          wrong: wrongs(mu, [
            {
              code: "PRO.NORMAL.STANDARDISE",
              value: A.number(round(xval + p.sigma * z, 1), { accuracy: { dp: 1 } }),
              feedback: "Use z = (x − μ)/σ, so μ = x − σz.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${xval} - \\mu}{${p.sigma}} = ${round(z, 4)} \\Rightarrow \\mu = ${mu}`,
            },
          ],
        });
      }
      case 2: {
        const sigma = round((xval - p.mu) / z, 1);
        return A.standard({
          question: [
            "X has a normal distribution with mean ",
            A.math(String(p.mu)),
            " and ",
            A.math(`P(X < ${xval}) = ${prob}`),
            ".",
          ],
          ask: "Find the standard deviation of X, to 1 decimal place.",
          answer: A.number(sigma, { accuracy: { dp: 1 } }),
          wrong: wrongs(sigma, [
            {
              code: "PRO.NORMAL.STANDARDISE",
              value: A.number(round(sigma * sigma, 1), { accuracy: { dp: 1 } }),
              feedback: "That is the variance. σ = (x − μ)/z.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${xval} - ${p.mu}}{\\sigma} = ${round(z, 4)} \\Rightarrow \\sigma = ${sigma}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `X ~ N(μ, ${p.sigma}²) and P(X < ${xval}) = ${prob}. Lily says μ = ${xval} + ${p.sigma} × ${round(z, 4)}.`,
          truth: false,
          reasons: [
            {
              text: `False. z = (x − μ)/σ rearranges to μ = x − σz = ${xval} − ${p.sigma} × ${round(z, 4)}.`,
              correct: true,
            },
            { text: "True. You always add σz to x.", code: "PRO.NORMAL.STANDARDISE" },
            { text: "True. The sign of z does not matter.", code: "PRO.NORMAL.STANDARDISE" },
          ],
          solution: [{ say: "", math: `\\mu = x - \\sigma z` }],
        });
    }
  },

  verify(p, question) {
    const z = invPhi(p.q / 100);
    const xval = round(p.mu + p.sigma * z, 1);
    if (question.key.depth === 1) return numberAnswer(question) === round(xval - p.sigma * z, 1);
    if (question.key.depth === 2) return numberAnswer(question) === round((xval - p.mu) / z, 1);
    return true;
  },
});
