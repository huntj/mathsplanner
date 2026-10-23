/**
 * @statement GF-S3.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S3.c: Construct and interpret histograms with equal class intervals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const LOWS = [140, 150, 160, 170, 180];

interface Params {
  f: number[];
  i: number;
  j: number;
}

function histogram(f: number[]): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 140, max: 190, step: 10, label: "\\text{height (cm)}" },
    y: { min: 0, max: 20, step: 2, label: "\\text{frequency}" },
    grid: true,
    polygons: f.map((v, k) => {
      const lo = LOWS[k] ?? 0;
      return {
        vertices: [
          [lo, 0],
          [lo + 10, 0],
          [lo + 10, v],
          [lo, v],
        ] as [number, number][],
        shaded: true,
      };
    }),
    description: "A histogram of heights in classes 10 cm wide; the vertical axis is frequency.",
  };
}

export default defineGenerator<Params>({
  id: "GF-S3.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ"],

  params(rng) {
    const p = { f: LOWS.map(() => rng.int(1, 9) * 2), i: rng.int(0, 4), j: rng.int(0, 4) };
    if (p.i === p.j || p.f[p.i] === p.f[p.j]) reject("two different bars");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const fig = A.figure(histogram(p.f));
    const name = (k: number) => `${LOWS[k]} cm to ${(LOWS[k] ?? 0) + 10} cm`;
    switch (depth) {
      case 1: {
        const v = p.f[p.i] ?? 0;
        return A.standard({
          question: ["The histogram shows the heights of some plants.", fig],
          ask: `How many plants were between ${name(p.i)} tall?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / 2),
              feedback: "The frequency axis goes up in 2s.",
            },
          ]),
          solution: [{ say: `The bar for ${name(p.i)} reaches ${v}.` }],
        });
      }
      case 2: {
        const v = Math.abs((p.f[p.i] ?? 0) - (p.f[p.j] ?? 0));
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The histogram shows the heights of some plants.", fig],
              ask: `What is the difference between the number of plants ${name(p.i)} tall and the number ${name(p.j)} tall?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / 2),
              feedback: "Each grid line on the frequency axis is worth 2.",
            },
          ]),
          solution: [{ say: "", math: `|${p.f[p.i]} - ${p.f[p.j]}| = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rae says the bars of a histogram should have gaps between them, like a bar chart.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A histogram shows continuous data, so each bar runs from one class boundary to the next and the bars touch.",
              correct: true,
            },
            { text: "True. All bar charts have gaps." },
            { text: "True. The gaps show where one class ends.", code: "STA.SCALE.READ" },
          ],
          solution: [{ say: "Continuous data has no gaps between classes." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.f[p.i];
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.abs((p.f[p.i] ?? 0) - (p.f[p.j] ?? 0));
    return true;
  },
});
