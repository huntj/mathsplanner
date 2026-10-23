/**
 * @statement AL-S4.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S4.2: Use the normal distribution, including its points of inflection and standardisation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { normalCdf, round } from "../shared/dist.ts";

export interface Params {
  mu: number;
  sigma: number;
  x: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-S4.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.NORMAL.STANDARDISE"],

  params(rng) {
    const mu = 5 * rng.int(4, 20);
    const sigma = rng.int(3, 9);
    const x = mu + rng.pick([-2, -1, 1, 2]) * rng.int(1, 2) * sigma + rng.int(-2, 2);
    if (x === mu) reject("a value away from the mean");
    return { mu, sigma, x, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const dist = `X \\sim \\mathrm{N}(${p.mu}, ${p.sigma * p.sigma})`;
    switch (depth) {
      case 1: {
        const v = round(normalCdf(p.x, p.mu, p.sigma), 4);
        return A.standard({
          question: [
            "Given ",
            A.math(dist),
            ", find ",
            A.math(`P(X < ${p.x})`),
            " to 4 decimal places.",
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.NORMAL.STANDARDISE",
              value: A.number(round(normalCdf(p.x, p.mu, p.sigma * p.sigma), 4), {
                accuracy: { dp: 4 },
              }),
              feedback: `N(${p.mu}, ${p.sigma * p.sigma}) has variance ${p.sigma * p.sigma}, so σ = ${p.sigma}.`,
            },
          ]),
          solution: [
            { say: "", math: `P\\left(Z < \\frac{${p.x} - ${p.mu}}{${p.sigma}}\\right) = ${v}` },
          ],
        });
      }
      case 2: {
        const v = round(1 - normalCdf(p.x, p.mu, p.sigma), 4);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given ",
                A.math(dist),
                ", find ",
                A.math(`P(X > ${p.x})`),
                " to 4 decimal places.",
              ],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.NORMAL.STANDARDISE",
              value: A.number(round(normalCdf(p.x, p.mu, p.sigma), 4), { accuracy: { dp: 4 } }),
              feedback: "That is P(X < x). For the upper tail, subtract from 1.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `1 - P\\left(Z < \\frac{${p.x} - ${p.mu}}{${p.sigma}}\\right) = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? `Jen says the graph of N(${p.mu}, ${p.sigma * p.sigma}) has points of inflection at x = ${p.mu - p.sigma} and x = ${p.mu + p.sigma}.`
            : `Jen says the graph of N(${p.mu}, ${p.sigma * p.sigma}) has points of inflection at x = ${p.mu - p.sigma * p.sigma} and x = ${p.mu + p.sigma * p.sigma}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. The normal curve has points of inflection one standard deviation either side of the mean.",
                  correct: true,
                },
                {
                  text: "False. They are one variance either side of the mean.",
                  code: "PRO.NORMAL.STANDARDISE",
                },
                { text: "False. The normal curve has no points of inflection." },
              ]
            : [
                {
                  text: `False. They are at μ ± σ = ${p.mu} ± ${p.sigma}; the second number in N(μ, σ²) is the variance.`,
                  correct: true,
                },
                {
                  text: "True. Use the second parameter either side of the mean.",
                  code: "PRO.NORMAL.STANDARDISE",
                },
                { text: "True. They are two standard deviations from the mean." },
              ],
          solution: [{ say: "Points of inflection: μ ± σ." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === round(normalCdf(p.x, p.mu, p.sigma), 4);
    return true;
  },
});
