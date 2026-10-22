/**
 * @statement FM-FS1-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-04: Carry out hypothesis tests for Poisson and geometric parameters
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { poissonCdf, poissonPmf, round } from "../shared/dist.ts";

interface Params {
  lambda: number;
  x: number;
}

const r4 = (v: number) => round(v, 4);
const tail = (p: Params) => r4(1 - poissonCdf(p.lambda, p.x - 1));
const REJECT = "Reject H₀: there is evidence at the 5% level that the rate has increased";
const KEEP = "Do not reject H₀: there is not enough evidence that the rate has increased";

export default defineGenerator<Params>({
  id: "FM-FS1-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HYPOTHESIS.TAIL", "STA.HYPOTHESIS.LANGUAGE"],

  params(rng) {
    const lambda = rng.int(2, 8);
    const x = lambda + rng.int(3, 8);
    const p = { lambda, x };
    const t = tail(p);
    if (Math.abs(t - 0.05) < 0.005) reject("a clear decision at 5%");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      `A shop usually receives a mean of ${p.lambda} complaints a week. After a change, it receives ${p.x} complaints in one week. The number of complaints is modelled by a Poisson distribution.`,
    ];
    switch (depth) {
      case 1: {
        const v = tail(p);
        return A.standard({
          question: intro,
          ask: [
            "Test H₀: λ = ",
            A.math(String(p.lambda)),
            " against H₁: λ > ",
            A.math(String(p.lambda)),
            ". Find the p-value, to 4 decimal places.",
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "STA.HYPOTHESIS.TAIL",
              value: A.number(r4(poissonPmf(p.lambda, p.x)), { accuracy: { dp: 4 } }),
              feedback: `The p-value is the probability of a result at least this extreme: P(X ≥ ${p.x}), not P(X = ${p.x}).`,
            },
          ]),
          solution: [{ say: "", math: `P(X \\ge ${p.x}) = 1 - P(X \\le ${p.x - 1}) = ${v}` }],
        });
      }
      case 2: {
        const t = tail(p);
        const right = t < 0.05 ? REJECT : KEEP;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: intro,
          ask: [
            "Carry out a test of H₀: λ = ",
            A.math(String(p.lambda)),
            " against H₁: λ > ",
            A.math(String(p.lambda)),
            " at the 5% level. What is the conclusion?",
          ],
          correct: right,
          distractors: [
            {
              content: t < 0.05 ? KEEP : REJECT,
              code: "STA.HYPOTHESIS.TAIL",
              feedback: `Compare P(X ≥ ${p.x}) = ${t} with 0.05.`,
            },
            {
              content: "H₁ is proved: the rate has definitely increased",
              code: "STA.HYPOTHESIS.LANGUAGE",
              feedback: "A hypothesis test gives evidence, never proof.",
            },
          ],
          solution: [
            { say: `P(X ≥ ${p.x}) = ${t}, which is ${t < 0.05 ? "less" : "more"} than 0.05.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Quin gets a p-value of 0.03 in a test at the 5% level, and says this proves H₀ is false.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It is significant evidence against H₀, but not proof: results this extreme happen 3% of the time even when H₀ is true.",
              correct: true,
            },
            {
              text: "True. Below 5% means H₀ is definitely wrong.",
              code: "STA.HYPOTHESIS.LANGUAGE",
            },
            {
              text: "True. There is a 97% chance that H₁ is true.",
              code: "STA.HYPOTHESIS.LANGUAGE",
            },
          ],
          solution: [{ say: "Conclusions are written as 'there is evidence that…'." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === tail(p);
    if (question.key.depth === 2) return chosenText(question) === (tail(p) < 0.05 ? REJECT : KEEP);
    return true;
  },
});
