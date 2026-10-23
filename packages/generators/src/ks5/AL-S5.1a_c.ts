/**
 * @statement AL-S5.1a.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S5.1a.c: Use p-values
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { wrongs } from "../shared/angles.ts";
import { binomialCdf, binomialPmf, round } from "../shared/dist.ts";

interface Params {
  n: number;
  /** p under H0, in tenths. */
  p0: number;
  x: number;
  alpha: number;
}

export default defineGenerator<Params>({
  id: "AL-S5.1a.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HYPOTHESIS.TAIL", "STA.HYPOTHESIS.CONCLUSION"],

  params(rng) {
    const s = { n: rng.int(10, 20), p0: rng.int(2, 5), x: 0, alpha: rng.pick([5, 10]) };
    s.x = Math.round((s.n * s.p0) / 10) + rng.int(2, 5);
    if (s.x > s.n) reject("a possible count");
    return s;
  },

  build(s, depth, rng): QuestionDraft {
    const p0 = s.p0 / 10;
    const pval = round(1 - binomialCdf(s.n, p0, s.x - 1), 4);
    const point = round(binomialPmf(s.n, p0, s.x), 4);
    const intro = `X ~ B(${s.n}, ${p0}) under H₀: p = ${p0}, against H₁: p > ${p0}. The observed value is x = ${s.x}.`;
    const reject0 = pval < s.alpha / 100;
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "Find the p-value, P(X ≥ x), to 4 decimal places.",
          answer: A.number(pval, { accuracy: { dp: 4 } }),
          wrong: wrongs(pval, [
            {
              code: "STA.HYPOTHESIS.TAIL",
              value: A.number(point, { accuracy: { dp: 4 } }),
              feedback: `The p-value is the tail probability, P(X ≥ ${s.x}), not P(X = ${s.x}).`,
            },
          ]),
          solution: [{ say: "", math: `P(X \\ge ${s.x}) = 1 - P(X \\le ${s.x - 1}) = ${pval}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`${intro} The p-value is ${pval}.`],
          ask: `What is the conclusion at the ${s.alpha}% level?`,
          correct: reject0
            ? "Reject H₀: there is evidence that p is bigger"
            : "Do not reject H₀: there is not enough evidence that p is bigger",
          distractors: [
            {
              content: reject0
                ? "Do not reject H₀: there is not enough evidence that p is bigger"
                : "Reject H₀: there is evidence that p is bigger",
              code: "STA.HYPOTHESIS.CONCLUSION",
              feedback: `Reject H₀ when the p-value is less than ${s.alpha / 100}.`,
            },
            {
              content: reject0 ? "H₁ is proved true" : "H₀ is proved true",
              code: "STA.HYPOTHESIS.CONCLUSION",
              feedback: "A test gives evidence; it never proves a hypothesis.",
            },
          ],
          solution: [
            {
              say: `${pval} ${reject0 ? "<" : "≥"} ${s.alpha / 100}, so ${reject0 ? "reject" : "do not reject"} H₀.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Jo compares P(X = ${s.x}) = ${point} with ${s.alpha}% to decide.`,
          truth: false,
          reasons: [
            {
              text: `False. She must use the tail probability, P(X ≥ ${s.x}) = ${pval}: values at least as extreme as the one observed.`,
              correct: true,
            },
            {
              text: "True. The probability of the observed value is the p-value.",
              code: "STA.HYPOTHESIS.TAIL",
            },
            {
              text: "True. Either probability gives the same conclusion.",
              code: "STA.HYPOTHESIS.TAIL",
            },
          ],
          solution: [{ say: "", math: `p\\text{-value} = P(X \\ge ${s.x}) = ${pval}` }],
        });
    }
  },

  verify(s, question) {
    const pval = round(1 - binomialCdf(s.n, s.p0 / 10, s.x - 1), 4);
    if (question.key.depth === 1) return numberAnswer(question) === pval;
    if (question.key.depth === 2)
      return chosenText(question).startsWith(pval < s.alpha / 100 ? "Reject" : "Do not");
    return true;
  },
});
