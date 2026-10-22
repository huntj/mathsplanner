/**
 * @statement AL-S2.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S2.4: Recognise and interpret outliers and clean data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  q1: number;
  med: number;
  q3: number;
  value: number;
}

export default defineGenerator<Params>({
  id: "AL-S2.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.OUTLIER.RULE"],

  params(rng) {
    const q1 = 2 * rng.int(10, 20);
    const med = q1 + 2 * rng.int(2, 6);
    const q3 = med + 2 * rng.int(2, 6);
    const iqr = q3 - q1;
    return { q1, med, q3, value: q3 + iqr + rng.pick([-6, -4, 4, 6, 10, 14]) };
  },

  build(p, depth, rng): QuestionDraft {
    const iqr = p.q3 - p.q1;
    const fence = p.q3 + 1.5 * iqr;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A data set has lower quartile ${p.q1}, median ${p.med} and upper quartile ${p.q3}. An outlier is a value more than 1.5 × IQR above the upper quartile.`,
          ask: "Above what value is a data point an outlier?",
          answer: A.number(fence),
          wrong: wrongs(fence, [
            {
              code: "STA.OUTLIER.RULE",
              value: A.number(p.med + 1.5 * iqr),
              feedback: "Measure 1.5 × IQR up from the upper quartile, not from the median.",
            },
          ]),
          solution: [{ say: `IQR = ${iqr}; ${p.q3} + 1.5 × ${iqr} = ${fence}.` }],
        });
      case 2: {
        const out = p.value > fence;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A data set has lower quartile ${p.q1}, median ${p.med} and upper quartile ${p.q3}. Outliers are values more than 1.5 × IQR beyond the quartiles.`,
          ask: `Is ${p.value} an outlier?`,
          correct: out ? `Yes: it is above ${fence}.` : `No: it is below ${fence}.`,
          distractors: [
            {
              content: out
                ? `No: it is below ${p.med + 1.5 * iqr}.`
                : `Yes: it is above ${p.med + 1.5 * iqr}.`,
              code: "STA.OUTLIER.RULE",
              feedback: "Use the upper quartile, not the median, as the starting point.",
            },
            {
              content: out
                ? `No: it is less than ${p.q3 + 3 * iqr}.`
                : `Yes: it is more than ${p.q3 + iqr}.`,
              code: "STA.OUTLIER.RULE",
              feedback: "The rule uses 1.5 × IQR.",
            },
          ],
          solution: [{ say: `IQR = ${iqr}; upper fence = ${p.q3} + ${1.5 * iqr} = ${fence}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ben says outliers should always be removed from a data set before it is analysed.",
          truth: false,
          reasons: [
            {
              text: "False. Remove an outlier only if it is an error (for example a recording mistake); a genuine extreme value is real data and should be kept.",
              correct: true,
            },
            { text: "True. Outliers are always mistakes.", code: "STA.OUTLIER.RULE" },
            { text: "True. Any value far from the mean must be wrong.", code: "STA.OUTLIER.RULE" },
          ],
          solution: [{ say: "Cleaning data means removing errors, not inconvenient values." }],
        });
    }
  },

  verify(p, question) {
    const fence = p.q3 + 1.5 * (p.q3 - p.q1);
    if (question.key.depth === 1) return numberAnswer(question) === fence;
    if (question.key.depth === 2)
      return chosenText(question).startsWith(p.value > fence ? "Yes" : "No");
    return true;
  },
});
