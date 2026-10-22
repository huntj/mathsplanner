/**
 * @statement AL-S5.1b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S5.1b: Test for zero correlation using a given PMCC and critical value or p-value
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

/** One-tailed 5% critical values of the PMCC for sample size n. */
const CRITICAL: Record<number, number> = {
  10: 0.5494,
  12: 0.4973,
  15: 0.4409,
  20: 0.3783,
  25: 0.3365,
};

interface Params {
  n: number;
  r: number;
}

export default defineGenerator<Params>({
  id: "AL-S5.1b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HYPOTHESIS.CONCLUSION", "STA.HYPOTHESIS.LANGUAGE"],

  params(rng) {
    const n = rng.pick([10, 12, 15, 20, 25]);
    const cv = CRITICAL[n] ?? 0.5;
    const r = Math.round((cv + rng.pick([-0.15, -0.08, 0.06, 0.12, 0.2])) * 1000) / 1000;
    if (r <= 0 || r >= 1) reject("a positive r below 1");
    return { n, r };
  },

  build(p, depth, rng): QuestionDraft {
    const cv = CRITICAL[p.n] ?? 0.5;
    const significant = p.r > cv;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `A sample of ${p.n} pairs gives a product moment correlation coefficient r = ${p.r}. A test at the 5% level of H₀: ρ = 0 against H₁: ρ > 0 has critical value ${cv}.`,
          ask: "What is the correct conclusion?",
          correct: significant
            ? "Reject H₀: there is evidence of positive correlation in the population."
            : "Do not reject H₀: there is not enough evidence of positive correlation.",
          distractors: [
            significant
              ? {
                  content:
                    "Do not reject H₀: there is not enough evidence of positive correlation.",
                  code: "STA.HYPOTHESIS.CONCLUSION",
                  feedback: `r = ${p.r} is greater than the critical value ${cv}, so it is in the critical region.`,
                }
              : {
                  content:
                    "Reject H₀: there is evidence of positive correlation in the population.",
                  code: "STA.HYPOTHESIS.CONCLUSION",
                  feedback: `r = ${p.r} is less than the critical value ${cv}.`,
                },
            {
              content: significant
                ? "H₁ is proved: the variables are correlated."
                : "H₀ is proved: there is no correlation.",
              code: "STA.HYPOTHESIS.CONCLUSION",
              feedback: "A hypothesis test gives evidence, never proof.",
            },
          ],
          solution: [
            {
              say: `Compare r = ${p.r} with ${cv}: ${significant ? "r is larger, so reject H₀" : "r is smaller, so do not reject H₀"}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A researcher wants to test whether there is positive correlation between two variables in a population, using a sample of ${p.n} pairs.`,
          ask: "Which hypotheses should be used?",
          correct: A.math("H_0: \\rho = 0,\\quad H_1: \\rho > 0"),
          distractors: [
            {
              content: A.math("H_0: r = 0,\\quad H_1: r > 0"),
              code: "STA.HYPOTHESIS.LANGUAGE",
              feedback:
                "Hypotheses are about the population correlation ρ, not the sample value r.",
            },
            {
              content: A.math("H_0: \\rho = 0,\\quad H_1: \\rho \\ne 0"),
              code: "STA.HYPOTHESIS.LANGUAGE",
              feedback: "The question asks about positive correlation, so the test is one-tailed.",
            },
          ],
          solution: [
            { say: "Use ρ for the population; a one-tailed test for a stated direction." },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A test finds r = ${Math.max(p.r, cv + 0.05).toFixed(3)} with critical value ${cv}. Amir says this proves that one variable causes the other.`,
          truth: false,
          reasons: [
            {
              text: "False. The test only gives evidence of correlation in the population; correlation does not show cause, and a test never proves anything.",
              correct: true,
            },
            {
              text: "True. Significant correlation means causation.",
              code: "STA.HYPOTHESIS.CONCLUSION",
            },
            {
              text: "True. r is above the critical value, so it is certain.",
              code: "STA.HYPOTHESIS.CONCLUSION",
            },
          ],
          solution: [{ say: "Conclusions should be about evidence of correlation, in context." }],
        });
    }
  },

  verify(p, question) {
    const cv = CRITICAL[p.n] ?? 0.5;
    if (question.key.depth === 1)
      return chosenText(question).startsWith(p.r > cv ? "Reject" : "Do not reject");
    return true;
  },
});
