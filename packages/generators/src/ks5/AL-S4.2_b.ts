/**
 * @statement AL-S4.2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S4.2.b: Use the inverse normal
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { invPhi, round } from "../shared/dist.ts";

interface Params {
  mu: number;
  sigma: number;
  /** A probability in hundredths. */
  q: number;
  upper: boolean;
}

export default defineGenerator<Params>({
  id: "AL-S4.2.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.NORMAL.STANDARDISE"],

  params(rng) {
    return {
      mu: rng.int(20, 80),
      sigma: rng.int(2, 12),
      q: rng.pick([5, 10, 15, 20, 25, 30, 70, 75, 80, 90, 95]),
      upper: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const dist = `X \\sim N(${p.mu}, ${p.sigma * p.sigma})`;
    const prob = p.q / 100;
    const below = p.upper ? 1 - prob : prob;
    const a = round(p.mu + p.sigma * invPhi(below), 1);
    const slip = round(p.mu + p.sigma * invPhi(p.upper ? prob : 1 - prob), 1);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Given ",
            A.math(dist),
            ", find a such that ",
            A.math(`P(X ${p.upper ? ">" : "<"} a) = ${prob}`),
            ", to 1 decimal place.",
          ],
          answer: A.number(a, { accuracy: { dp: 1 } }),
          wrong: wrongs(a, [
            {
              code: "PRO.NORMAL.STANDARDISE",
              value: A.number(slip, { accuracy: { dp: 1 } }),
              feedback:
                "Calculators give the value with that probability below it; for an upper tail use 1 − p.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `a = ${p.mu} + ${p.sigma} \\times \\Phi^{-1}(${round(below, 2)}) = ${a}`,
            },
          ],
        });
      case 2: {
        const z = round(invPhi(below), 4);
        return A.standard({
          question: [
            "Given ",
            A.math(dist),
            " and ",
            A.math(`P(X ${p.upper ? ">" : "<"} a) = ${prob}`),
            ".",
          ],
          ask: "Find the z-value that a corresponds to, to 4 decimal places.",
          answer: A.number(z, { accuracy: { dp: 4 } }),
          wrong: wrongs(z, [
            {
              code: "PRO.NORMAL.STANDARDISE",
              value: A.number(-z, { accuracy: { dp: 4 } }),
              feedback: `Check the tail: a is ${below > 0.5 ? "above" : "below"} the mean, so z is ${below > 0.5 ? "positive" : "negative"}.`,
            },
          ]),
          solution: [{ say: "", math: `z = \\Phi^{-1}(${round(below, 2)}) = ${z}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Given ",
            A.math(dist),
            `, Ken finds a with P(X < a) = ${prob} by working out ${p.mu} + ${p.sigma * p.sigma} × Φ⁻¹(${prob}).`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. X = μ + σz uses the standard deviation, ${p.sigma}, not the variance, ${p.sigma * p.sigma}.`,
              correct: true,
            },
            {
              text: "True. The second number in N(μ, σ²) is what you multiply by.",
              code: "PRO.NORMAL.STANDARDISE",
            },
            {
              text: "True. Variance and standard deviation give the same answer.",
              code: "PRO.NORMAL.STANDARDISE",
            },
          ],
          solution: [{ say: "", math: `a = \\mu + \\sigma z = ${p.mu} + ${p.sigma}z` }],
        });
    }
  },

  verify(p, question) {
    const below = p.upper ? 1 - p.q / 100 : p.q / 100;
    if (question.key.depth === 1)
      return numberAnswer(question) === round(p.mu + p.sigma * invPhi(below), 1);
    if (question.key.depth === 2) return numberAnswer(question) === round(invPhi(below), 4);
    return true;
  },
});
