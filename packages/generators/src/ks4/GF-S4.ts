/**
 * @statement GF-S4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-S4: Compare distributions using averages (median, mean, mode, modal class) and range, including
// outliers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { groupedTable, tableLatex } from "../shared/sta.ts";

interface Params {
  freqs: number[];
  /** Depth 2: two classes' test results. */
  medA: number;
  rangeA: number;
  medB: number;
  rangeB: number;
  /** Depth 4: typical weekly pocket money and one outlier. */
  money: number[];
  outlier: number;
}

const LOWS = [0, 10, 20, 30, 40];
const WIDTH = 10;
const HEADING = "\\text{time } (t \\text{ minutes})";
const r1 = (x: number) => Math.round(x * 10) / 10;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Sum of frequency × (class lower bound + offset): offset 5 uses midpoints, 10 upper bounds. */
const fx = (freqs: number[], offset: number) =>
  sum(LOWS.map((lo, i) => (freqs[i] ?? 0) * (lo + offset)));

export default defineGenerator<Params>({
  id: "GF-S4",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "STA.GROUPED.MIDPOINT",
    "STA.MEAN.DIVISOR",
    "STA.RANGE.HIGHER-BETTER",
    "STA.OUTLIER.MEAN",
  ],

  params(rng) {
    const p = {
      freqs: LOWS.map(() => rng.int(2, 15)),
      medA: rng.int(45, 75),
      rangeA: rng.int(15, 45),
      medB: rng.int(45, 75),
      rangeB: rng.int(15, 45),
      money: Array.from({ length: 7 }, () => rng.int(4, 12)),
      outlier: rng.int(60, 120),
    };
    if (Math.abs(p.medA - p.medB) < 4 || Math.abs(p.rangeA - p.rangeB) < 6)
      reject("clear differences");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const n = sum(p.freqs);
    const table = A.displayMath(groupedTable("t", HEADING, LOWS, WIDTH, p.freqs));
    const intro = "The table shows how long some pupils spent on their homework.";
    const mean = r1(fx(p.freqs, 5) / n);
    const meanWrongs = [
      {
        code: "STA.GROUPED.MIDPOINT",
        value: A.number(r1(fx(p.freqs, 10) / n), { accuracy: { dp: 1 } }),
        feedback: "Use the midpoint of each class, such as 5 for 0 < t ≤ 10.",
      },
      {
        code: "STA.MEAN.DIVISOR",
        value: A.number(r1(fx(p.freqs, 5) / LOWS.length), { accuracy: { dp: 1 } }),
        feedback: `Divide by the total frequency, ${n}, not by the number of classes.`,
      },
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro, table],
          ask: "Work out an estimate for the mean time. Give your answer to 1 decimal place.",
          answer: A.number(mean, { units: "minutes", accuracy: { dp: 1 } }),
          wrong: meanWrongs,
          solution: [
            { say: `Multiply each midpoint by its frequency: total ${fx(p.freqs, 5)}.` },
            { say: `${fx(p.freqs, 5)} ÷ ${n} = ${mean} minutes.` },
          ],
        });
      case 2: {
        const better = p.medA > p.medB ? "A" : "B";
        const consistent = p.rangeA < p.rangeB ? "A" : "B";
        const wide = consistent === "A" ? "B" : "A";
        const worse = better === "A" ? "B" : "A";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The table summarises two classes' test scores.",
            A.displayMath(
              tableLatex(
                ["", "median", "range"],
                [
                  ["class A", p.medA, p.rangeA],
                  ["class B", p.medB, p.rangeB],
                ],
              ),
            ),
          ],
          ask: "Which comparison is correct?",
          correct: `Class ${better} did better on average, and class ${consistent}'s scores were more consistent.`,
          distractors: [
            {
              content: `Class ${better} did better on average, and class ${wide}'s scores were more consistent.`,
              code: "STA.RANGE.HIGHER-BETTER",
              feedback: "A larger range means the scores are more spread out, so less consistent.",
            },
            {
              content: `Class ${wide} did better, because its range is larger.`,
              code: "STA.RANGE.HIGHER-BETTER",
              feedback: "Compare averages with the median; the range only measures spread.",
            },
            {
              content: `Class ${worse} did better on average, and class ${consistent}'s scores were more consistent.`,
              feedback: "The higher median shows the better average.",
            },
          ],
          solution: [
            {
              say: "Compare an average (the median) and a measure of spread (the range), in context.",
            },
          ],
        });
      }
      case 4: {
        const all = [...p.money, p.outlier];
        return A.trueOrFalseWhy({
          rng,
          statement: `Eight pupils get this much pocket money a week, in pounds: ${all.join(", ")}. Mo says the mean is the best average to describe a typical amount.`,
          truth: false,
          reasons: [
            {
              text: `False. £${p.outlier} is an outlier that drags the mean up; the median is more typical.`,
              correct: true,
            },
            {
              text: "True. The mean uses every value, so it is always the best average.",
              code: "STA.OUTLIER.MEAN",
            },
            { text: "False. The mode is always the best average." },
          ],
          solution: [
            {
              say: "When one value is far from the rest, the median gives a better picture of a typical value.",
            },
          ],
        });
      }
      default:
        return A.multiStepContext({
          context: [intro, table],
          parts: [
            {
              ask: "Use the midpoints to estimate the total time spent by all the pupils.",
              answer: A.number(fx(p.freqs, 5), { units: "minutes" }),
              wrong: [
                {
                  code: "STA.GROUPED.MIDPOINT",
                  value: A.number(fx(p.freqs, 10), { units: "minutes" }),
                  feedback: "Use the midpoint of each class, not its upper bound.",
                },
              ],
            },
            {
              ask: "Work out an estimate for the mean time. Give your answer to 1 decimal place.",
              answer: A.number(mean, { units: "minutes", accuracy: { dp: 1 } }),
              wrong: [meanWrongs[1] as (typeof meanWrongs)[number]],
            },
          ],
          solution: [
            { say: `Midpoints × frequencies: ${fx(p.freqs, 5)} minutes.` },
            { say: `${fx(p.freqs, 5)} ÷ ${n} = ${mean}.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(fx(p.freqs, 5) / sum(p.freqs));
    if (question.key.depth === 2)
      return (
        chosenText(question).startsWith(`Class ${p.medA > p.medB ? "A" : "B"} did better`) &&
        chosenText(question).includes(`class ${p.rangeA < p.rangeB ? "A" : "B"}'s`)
      );
    if (question.key.depth === 5) return numberAnswer(question) === fx(p.freqs, 5);
    return true;
  },
});
