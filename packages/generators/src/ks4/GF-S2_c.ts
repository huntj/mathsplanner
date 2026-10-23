/**
 * @statement GF-S2.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S2.c: Interpret and construct time series graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lineGraph } from "../shared/sta.ts";

export interface Params {
  sales: number[];
  day: number;
  from: number;
  to: number;
}

export default defineGenerator<Params>({
  id: "GF-S2.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ", "STA.EXTRAPOLATE"],

  params(rng) {
    const sales = [1, 2, 3, 4, 5, 6, 7].map(() => rng.int(2, 18) * 5);
    const p = { sales, day: rng.int(1, 7), from: rng.int(1, 6), to: 0 };
    p.to = rng.int(p.from + 1, 7);
    if ((sales[p.to - 1] ?? 0) <= (sales[p.from - 1] ?? 0)) reject("a rise between the two days");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const graph = A.figure(
      lineGraph(
        p.sales.map((s, i): [number, number] => [i + 1, s]),
        { min: 0, max: 8, step: 1, label: "day" },
        { min: 0, max: 100, step: 10, label: "ice creams sold" },
        "A time series graph of ice creams sold each day for a week.",
      ),
    );
    switch (depth) {
      case 1: {
        const v = p.sales[p.day - 1] ?? 0;
        return A.standard({
          question: ["The graph shows how many ice creams a kiosk sold each day.", graph],
          ask: `How many were sold on day ${p.day}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / 10),
              feedback:
                "Each grid line on the vertical axis is worth 10, and a point halfway is worth 5.",
            },
          ]),
          solution: [{ say: `Read across from the point at day ${p.day}: ${v}.` }],
        });
      }
      case 2: {
        const v = (p.sales[p.to - 1] ?? 0) - (p.sales[p.from - 1] ?? 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph shows how many ice creams a kiosk sold each day.", graph],
              ask: `By how many did sales increase from day ${p.from} to day ${p.to}?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / 10),
              feedback: "Count the grid lines as 10 each, not 1.",
            },
          ]),
          solution: [{ say: "", math: `${p.sales[p.to - 1]} - ${p.sales[p.from - 1]} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A shop's sales have gone up every month this year. Lee says the graph proves they will keep going up for ever.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A trend only describes the data you have; predicting far beyond it is unreliable, as seasons and other changes affect sales.",
              correct: true,
            },
            { text: "True. A trend always continues.", code: "STA.EXTRAPOLATE" },
            { text: "True. The line can be extended as far as you like.", code: "STA.EXTRAPOLATE" },
          ],
          solution: [{ say: "Be careful predicting outside the time the data covers." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.sales[p.day - 1];
    if (question.key.depth === 2)
      return numberAnswer(question) === (p.sales[p.to - 1] ?? 0) - (p.sales[p.from - 1] ?? 0);
    return true;
  },
});
