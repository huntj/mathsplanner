/**
 * @statement FM-FS2-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS2-02: Calculate PMCC and Spearman's rank correlation and test for association
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

/** One-tailed 5% critical values of Spearman's rank correlation coefficient. */
const CRITICAL: Record<number, number> = { 6: 0.8286, 7: 0.7143, 8: 0.6429, 9: 0.6, 10: 0.5636 };

export interface Params {
  n: number;
  d2: number;
}

const rs = (p: Params) => round(1 - (6 * p.d2) / (p.n * (p.n * p.n - 1)), 3);
const EVIDENCE = "Reject H₀: there is evidence of positive association";
const NONE = "Do not reject H₀: there is not enough evidence of positive association";

export default defineGenerator<Params>({
  id: "FM-FS2-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SPEARMAN"],

  params(rng) {
    const n = rng.int(6, 10);
    const p = { n, d2: rng.int(4, Math.floor((n * (n * n - 1)) / 6)) };
    const r = rs(p);
    if (r <= 0 || Math.abs(r - (CRITICAL[n] ?? 0.6)) < 0.02)
      reject("a positive coefficient and a clear decision");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const r = rs(p);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `Two judges rank ${p.n} competitors. The sum of the squared differences in rank is `,
            A.math(`\\sum d^2 = ${p.d2}`),
            ".",
          ],
          ask: "Find Spearman's rank correlation coefficient, to 3 decimal places.",
          answer: A.number(r, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(r, [
            {
              code: "STA.SPEARMAN",
              value: A.number(round(1 - (6 * p.d2) / (p.n * (p.n - 1)), 3), {
                accuracy: { dp: 3 },
              }),
              feedback: "The denominator is n(n² − 1).",
            },
          ]),
          solution: [
            { say: "", math: `r_s = 1 - \\frac{6 \\times ${p.d2}}{${p.n}(${p.n}^2 - 1)} = ${r}` },
          ],
        });
      case 2: {
        const crit = CRITICAL[p.n] ?? 0.6;
        const right = r > crit ? EVIDENCE : NONE;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `For ${p.n} pairs of ranks, Spearman's coefficient is ${r}. The critical value for a one-tailed test at the 5% level is ${crit}.`,
          ],
          ask: "Test H₀: ρ = 0 against H₁: ρ > 0. What is the conclusion?",
          correct: right,
          distractors: [
            {
              content: right === EVIDENCE ? NONE : EVIDENCE,
              code: "STA.SPEARMAN",
              feedback: `Compare ${r} with the critical value ${crit}.`,
            },
            {
              content: "The rankings are proved to be identical",
              code: "STA.SPEARMAN",
              feedback: "A test gives evidence of association, not proof.",
            },
          ],
          solution: [{ say: `${r} is ${r > crit ? "greater" : "less"} than ${crit}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Wyn finds a product moment correlation coefficient of 0 for some data and says there is no relationship between the variables.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. r = 0 means no linear relationship. There could still be a strong non-linear one, such as points on a U-shaped curve.",
              correct: true,
            },
            { text: "True. r measures every kind of relationship.", code: "STA.SPEARMAN" },
            { text: "True. A coefficient of 0 means the points are random.", code: "STA.SPEARMAN" },
          ],
          solution: [{ say: "Points on y = x² for x from −3 to 3 have r = 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === rs(p);
    if (question.key.depth === 2)
      return chosenText(question) === (rs(p) > (CRITICAL[p.n] ?? 0.6) ? EVIDENCE : NONE);
    return true;
  },
});
