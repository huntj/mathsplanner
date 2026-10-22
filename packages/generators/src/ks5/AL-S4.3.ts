/**
 * @statement AL-S4.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S4.3: Select an appropriate distribution, including the normal approximation to the binomial
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { normalCdf, round } from "../shared/dist.ts";

interface Params {
  n: number;
  p: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "AL-S4.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.NORMAL.APPROX", "PRO.NORMAL.STANDARDISE"],

  params(rng) {
    const n = rng.pick([100, 120, 150, 200]);
    const p = rng.pick([0.4, 0.45, 0.5, 0.55]);
    return { n, p, k: Math.round(n * p) + rng.int(-8, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    const mu = p.n * p.p;
    const v = p.n * p.p * (1 - p.p);
    const sd = Math.sqrt(v);
    switch (depth) {
      case 1: {
        const right = round(normalCdf(p.k + 0.5, mu, sd), 4);
        return A.standard({
          question: [
            "Given ",
            A.math(`X \\sim \\mathrm{B}(${p.n}, ${p.p})`),
            ", use a normal approximation to estimate ",
            A.math(`P(X \\le ${p.k})`),
            ".",
          ],
          ask: "Give your answer to 4 decimal places.",
          answer: A.number(right, { accuracy: { dp: 4 } }),
          wrong: wrongs(right, [
            {
              code: "PRO.NORMAL.APPROX",
              value: A.number(round(normalCdf(p.k, mu, sd), 4), { accuracy: { dp: 4 } }),
              feedback: `Use a continuity correction: X ≤ ${p.k} becomes Y < ${p.k + 0.5}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `Y \\sim \\mathrm{N}(${mu}, ${round(v, 4)}),\\ P(Y < ${p.k + 0.5}) = ${right}`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which normal distribution approximates ",
            A.math(`\\mathrm{B}(${p.n}, ${p.p})`),
            "?",
          ],
          correct: A.math(`\\mathrm{N}(${mu}, ${round(v, 4)})`),
          distractors: [
            {
              content: A.math(`\\mathrm{N}(${mu}, ${round(sd, 4)})`),
              code: "PRO.NORMAL.STANDARDISE",
              feedback: "The second parameter is the variance np(1 − p), not its square root.",
            },
            {
              content: A.math(`\\mathrm{N}(${mu}, ${mu})`),
              code: "PRO.NORMAL.APPROX",
              feedback: "The variance is np(1 − p).",
            },
          ],
          solution: [{ say: `Mean np = ${mu}; variance np(1 − p) = ${round(v, 4)}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Zak says the normal distribution is a good approximation to B(20, 0.05).",
          truth: false,
          reasons: [
            {
              text: "False. The approximation needs n large and p close to 0.5: here np = 1, so the distribution is very skewed.",
              correct: true,
            },
            {
              text: "True. Any binomial can be approximated by a normal distribution.",
              code: "PRO.NORMAL.APPROX",
            },
            { text: "True. n = 20 is large enough whatever p is.", code: "PRO.NORMAL.APPROX" },
          ],
          solution: [
            { say: "Check that np and n(1 − p) are both reasonably large (say more than 5)." },
          ],
        });
    }
  },

  verify(p, question) {
    const mu = p.n * p.p;
    const sd = Math.sqrt(p.n * p.p * (1 - p.p));
    if (question.key.depth === 1)
      return numberAnswer(question) === round(normalCdf(p.k + 0.5, mu, sd), 4);
    return true;
  },
});
