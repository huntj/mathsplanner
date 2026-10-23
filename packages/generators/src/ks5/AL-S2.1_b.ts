/**
 * @statement AL-S2.1.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S2.1.b: Interpret box plots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Lowest, lower quartile, median, upper quartile, highest. */
  five: [number, number, number, number, number];
  /** Depth 4: an outlier test at 1.5 × IQR above Q3. */
  top: number;
}

export default defineGenerator<Params>({
  id: "AL-S2.1.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.IQR.RANGE"],

  params(rng) {
    const lo = rng.int(2, 15);
    const q1 = lo + rng.int(3, 10);
    const med = q1 + rng.int(2, 10);
    const q3 = med + rng.int(2, 10);
    const hi = q3 + rng.int(3, 12);
    if (hi - lo === q3 - q1) reject("range and IQR differ");
    return {
      five: [lo, q1, med, q3, hi],
      top: q3 + Math.round(1.5 * (q3 - q1)) + rng.pick([-3, 4]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [lo, q1, med, q3, hi] = p.five;
    const summary = `A box plot of test marks has lowest value ${lo}, lower quartile ${q1}, median ${med}, upper quartile ${q3} and highest value ${hi}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: summary,
          ask: "Find the interquartile range.",
          answer: A.number(q3 - q1),
          wrong: wrongs(q3 - q1, [
            {
              code: "STA.IQR.RANGE",
              value: A.number(hi - lo),
              feedback: "That is the range. The interquartile range is Q3 − Q1.",
            },
          ]),
          solution: [{ say: `${q3} − ${q1} = ${q3 - q1}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: summary,
          ask: "What fraction of the marks are between the lower quartile and the highest value?",
          correct: "Three quarters",
          distractors: [
            {
              content: "A half",
              code: "STA.IQR.RANGE",
              feedback: "From Q1 to Q3 is a half; from Q3 to the top is another quarter.",
            },
            {
              content: "A quarter",
              code: "STA.IQR.RANGE",
              feedback: "Each section of a box plot holds a quarter of the data.",
            },
          ],
          solution: [{ say: "From Q1 to the highest value covers three of the four quarters." }],
        });
      default: {
        const limit = q3 + 1.5 * (q3 - q1);
        const outlier = p.top > limit;
        return A.trueOrFalseWhy({
          rng,
          statement: `${summary} Outliers are values more than 1.5 × IQR above the upper quartile. Nia says a mark of ${p.top} is an outlier.`,
          truth: outlier,
          reasons: outlier
            ? [
                {
                  text: `True. Q3 + 1.5 × ${q3 - q1} = ${limit}, and ${p.top} is above it.`,
                  correct: true,
                },
                {
                  text: `False. Use 1.5 × the range: ${q3} + 1.5 × ${hi - lo}.`,
                  code: "STA.IQR.RANGE",
                },
                { text: "False. A mark that has been recorded cannot be an outlier." },
              ]
            : [
                {
                  text: `False. Q3 + 1.5 × ${q3 - q1} = ${limit}, and ${p.top} is not above it.`,
                  correct: true,
                },
                {
                  text: "True. Any value above the upper quartile is an outlier.",
                  code: "STA.IQR.RANGE",
                },
                { text: "True. Every high mark is an outlier." },
              ],
          solution: [
            { say: "", math: `Q_3 + 1.5 \\times IQR = ${q3} + 1.5 \\times ${q3 - q1} = ${limit}` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.five[3] - p.five[1];
    if (question.key.depth === 2) return chosenText(question) === "Three quarters";
    return true;
  },
});
