/**
 * @statement GH-S4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-S4.a: Find quartiles and the interquartile range
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ChartSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  list: number[];
  five: [number, number, number, number, number];
}

export default defineGenerator<Params>({
  id: "GH-S4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.IQR.RANGE"],

  params(rng) {
    const list = Array.from({ length: 11 }, () => rng.int(10, 60)).sort((a, b) => a - b);
    const lo = rng.int(10, 30);
    const q1 = lo + rng.int(2, 10) * 2;
    const med = q1 + rng.int(2, 8) * 2;
    const q3 = med + rng.int(2, 8) * 2;
    const hi = Math.min(100, q3 + rng.int(2, 10) * 2);
    const p = { list, five: [lo, q1, med, q3, hi] as [number, number, number, number, number] };
    if ((list[8] ?? 0) - (list[2] ?? 0) === (list[10] ?? 0) - (list[0] ?? 0) || hi <= q3)
      reject("an IQR different from the range");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.list[8] ?? 0) - (p.list[2] ?? 0);
        return A.standard({
          question: [`Here are 11 values in order: ${p.list.join(", ")}.`],
          ask: "Find the interquartile range.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.IQR.RANGE",
              value: A.number((p.list[10] ?? 0) - (p.list[0] ?? 0)),
              feedback:
                "That is the range. The IQR is the upper quartile (9th value) minus the lower quartile (3rd value).",
            },
          ]),
          solution: [{ say: "", math: `${p.list[8]} - ${p.list[2]} = ${v}` }],
        });
      }
      case 2: {
        const [lo, q1, , q3, hi] = p.five;
        const v = q3 - q1;
        const box: ChartSpec = {
          type: "chart",
          kind: "box",
          plots: [{ values: p.five }],
          axis: { min: 0, max: 100, step: 10, label: "\\text{score}" },
          description: "A box plot of test scores.",
        };
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The box plot shows some test scores.", A.figure(box)],
              ask: "Find the interquartile range.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.IQR.RANGE",
              value: A.number(hi - lo),
              feedback: "That is the range, from the whiskers. The IQR is the width of the box.",
            },
          ]),
          solution: [{ say: "", math: `${q3} - ${q1} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ali says one very large value in a data set has a big effect on the interquartile range.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The IQR uses only the middle half of the data, so an extreme value hardly changes it. It does change the range.",
              correct: true,
            },
            { text: "True. The IQR uses the largest value.", code: "STA.IQR.RANGE" },
            { text: "True. Every value affects the IQR equally.", code: "STA.IQR.RANGE" },
          ],
          solution: [
            { say: "That is why the IQR is a better measure of spread when there are outliers." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.list[8] ?? 0) - (p.list[2] ?? 0);
    if (question.key.depth === 2) return numberAnswer(question) === p.five[3] - p.five[1];
    return true;
  },
});
