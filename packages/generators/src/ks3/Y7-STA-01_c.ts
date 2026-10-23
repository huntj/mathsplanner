/**
 * @statement Y7-STA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-STA-01.c: Find the range
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  temps: number[];
  list: number[];
}

export default defineGenerator<Params>({
  id: "Y7-STA-01.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.NEGATIVE.SUBTRACT-NEGATIVE", "STA.MEDIAN.UNORDERED"],

  params(rng) {
    const temps = [
      -rng.int(1, 9),
      rng.int(-3, 12),
      rng.int(-3, 12),
      rng.int(2, 15),
      rng.int(-3, 12),
    ];
    const list = Array.from({ length: 6 }, () => rng.int(3, 40));
    const p = { temps, list };
    if (Math.min(...temps) >= 0 || Math.max(...temps) <= 0)
      reject("temperatures either side of zero");
    const ends = (list[5] ?? 0) - (list[0] ?? 0);
    if (ends <= 0 || ends === Math.max(...list) - Math.min(...list))
      reject("an unordered list whose ends are not the extremes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const hi = Math.max(...p.temps);
        const lo = Math.min(...p.temps);
        const v = hi - lo;
        return A.standard({
          question: [`The midday temperatures one week, in °C, were ${p.temps.join(", ")}.`],
          ask: "Find the range, in degrees.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
              value: A.number(hi + lo),
              feedback: `${hi} − (${lo}) = ${hi} + ${-lo}: subtracting a negative adds.`,
            },
          ]),
          solution: [{ say: "", math: `${hi} - (${lo}) = ${v}` }],
        });
      }
      case 2: {
        const v = Math.max(...p.list) - Math.min(...p.list);
        return A.variedForm({
          rng,
          forms: [{ question: [`Find the range of ${p.list.join(", ")}.`] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEDIAN.UNORDERED",
              value: A.number((p.list[5] ?? 0) - (p.list[0] ?? 0)),
              feedback: "Use the largest and smallest values, not the last and first ones listed.",
            },
          ]),
          solution: [{ say: "", math: `${Math.max(...p.list)} - ${Math.min(...p.list)} = ${v}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The range of a set of data can be negative."],
          truth: "never",
          reasons: [
            {
              text: "Never. The range is the largest value minus the smallest, which is never less than 0, even when the values are negative.",
              correct: true,
            },
            {
              text: "Sometimes. When the data has negative numbers.",
              code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
            },
            { text: "Always. Subtracting gives a negative.", code: "STA.MEDIAN.UNORDERED" },
          ],
          solution: [{ say: "The range measures spread, a distance, so it is 0 or more." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.max(...p.temps) - Math.min(...p.temps);
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.max(...p.list) - Math.min(...p.list);
    return true;
  },
});
