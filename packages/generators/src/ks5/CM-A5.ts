/**
 * @statement CM-A5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A5: Compare distributions using averages, quartiles, IQR, variance and standard deviation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  xs: number[];
  m1: number;
  s1: number;
  m2: number;
  s2: number;
}

const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const sd = (xs: number[]) =>
  round(Math.sqrt(xs.reduce((s, x) => s + (x - mean(xs)) ** 2, 0) / xs.length), 2);

export default defineGenerator<Params>({
  id: "CM-A5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.VARIANCE.FORMULA", "STA.COMPARE"],

  params(rng) {
    const xs = Array.from({ length: 6 }, () => rng.int(2, 20));
    const p = {
      xs,
      m1: rng.int(40, 70),
      s1: round(rng.int(20, 120) / 10, 1),
      m2: rng.int(40, 70),
      s2: round(rng.int(20, 120) / 10, 1),
    };
    if (Math.abs(p.m1 - p.m2) < 3 || Math.abs(p.s1 - p.s2) < 1) reject("clear differences");
    if (sd(xs) === 0) reject("some spread");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = sd(p.xs);
        const meanSq = round(p.xs.reduce((s, x) => s + x * x, 0) / p.xs.length, 2);
        return A.standard({
          question: [`The numbers of hours six students worked in a week are ${p.xs.join(", ")}.`],
          ask: "Find the standard deviation, to 2 decimal places.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "STA.VARIANCE.FORMULA",
              value: A.number(round(Math.sqrt(meanSq), 2), { accuracy: { dp: 2 } }),
              feedback:
                "σ² = Σx²/n − x̄²: subtract the square of the mean before taking the square root.",
            },
          ]),
          solution: [{ say: `Mean = ${round(mean(p.xs), 2)}. σ = √(Σx²/n − x̄²) = ${v}.` }],
        });
      }
      case 2: {
        const higher = p.m1 > p.m2 ? "Shop A" : "Shop B";
        const steadier = p.s1 < p.s2 ? "Shop A" : "Shop B";
        const right = `${higher} has higher average daily sales, and ${steadier}'s sales are more consistent.`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Over a month, Shop A's daily sales had mean £${p.m1 * 10} and standard deviation £${Math.round(p.s1 * 10)}. Shop B's had mean £${p.m2 * 10} and standard deviation £${Math.round(p.s2 * 10)}.`,
          ],
          ask: "Which is the best comparison?",
          correct: right,
          distractors: [
            {
              content: `${steadier === "Shop A" ? "Shop B" : "Shop A"} is more consistent, because its standard deviation is bigger.`,
              code: "STA.COMPARE",
              feedback: "A bigger standard deviation means more spread: less consistent.",
            },
            {
              content: `${higher} is better, because its mean is higher.`,
              code: "STA.COMPARE",
              feedback: "Compare an average and a measure of spread, in context.",
            },
          ],
          solution: [
            {
              say: "Compare the means for the typical level and the standard deviations for consistency.",
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Hope says that if one value in a data set is changed to a much larger outlier, the median and IQR change as much as the mean and standard deviation.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The mean and standard deviation use every value, so an outlier pulls them a lot. The median and IQR depend on the middle values, so they barely change.",
              correct: true,
            },
            { text: "True. All averages and spreads are affected equally.", code: "STA.COMPARE" },
            { text: "True. The median always moves to the outlier.", code: "STA.COMPARE" },
          ],
          solution: [
            {
              say: "That is why the median and IQR are preferred for skewed data or data with outliers.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === sd(p.xs);
    if (question.key.depth === 2)
      return chosenText(question).startsWith(
        p.m1 > p.m2 ? "Shop A has higher" : "Shop B has higher",
      );
    return true;
  },
});
