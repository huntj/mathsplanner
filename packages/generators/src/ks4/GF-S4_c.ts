/**
 * @statement GF-S4.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S4.c: Use the range and identify outliers to compare distributions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  list: number[];
  meanA: number;
  meanB: number;
  rangeA: number;
  rangeB: number;
}

const RIGHT = "Class A did better on average; Class B's marks were more consistent.";

export default defineGenerator<Params>({
  id: "GF-S4.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.RANGE.HIGHER-BETTER", "STA.COMPARE", "STA.MEDIAN.UNORDERED"],

  params(rng) {
    const p = {
      list: [0, 1, 2, 3, 4, 5].map(() => rng.int(3, 40)),
      meanA: rng.int(55, 75),
      meanB: 0,
      rangeA: rng.int(25, 40),
      rangeB: 0,
    };
    p.meanB = p.meanA - rng.int(3, 12);
    p.rangeB = p.rangeA - rng.int(5, 15);
    const last = (p.list[5] ?? 0) - (p.list[0] ?? 0);
    const range = Math.max(...p.list) - Math.min(...p.list);
    if (last <= 0 || last === range) reject("an unordered list whose ends are not the extremes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = Math.max(...p.list) - Math.min(...p.list);
        return A.standard({
          question: [`Here are some temperatures, in °C: ${p.list.join(", ")}.`],
          ask: "Find the range.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEDIAN.UNORDERED",
              value: A.number((p.list[5] ?? 0) - (p.list[0] ?? 0)),
              feedback: "Use the largest and smallest values, not the last and first in the list.",
            },
          ]),
          solution: [{ say: "", math: `${Math.max(...p.list)} - ${Math.min(...p.list)} = ${v}` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `In a test, Class A had a mean of ${p.meanA} and a range of ${p.rangeA}. Class B had a mean of ${p.meanB} and a range of ${p.rangeB}.`,
          ],
          ask: "Which comparison is correct?",
          correct: RIGHT,
          distractors: [
            {
              content: "Class A did better, because its range is bigger.",
              code: "STA.RANGE.HIGHER-BETTER",
              feedback: "A bigger range means the marks were more spread out, not higher.",
            },
            {
              content: "Class B did better, because its marks were less spread out.",
              code: "STA.COMPARE",
              feedback: "Compare an average for which did better, and a spread for consistency.",
            },
          ],
          solution: [
            {
              say: "The higher mean shows who did better; the smaller range shows who was more consistent.",
            },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Adding one more value to a data set changes its range."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It changes only if the new value is above the maximum or below the minimum. Adding ${Math.min(...p.list) + 1} to the list here leaves the range the same.`,
              correct: true,
            },
            { text: "Always. Any new value changes the spread.", code: "STA.COMPARE" },
            { text: "Never. The range only depends on how many values there are." },
          ],
          solution: [{ say: "The range uses only the two extremes." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.max(...p.list) - Math.min(...p.list);
    if (question.key.depth === 2) return chosenText(question) === RIGHT;
    return true;
  },
});
