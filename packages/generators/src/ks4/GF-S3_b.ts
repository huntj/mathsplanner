/**
 * @statement GF-S3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S3.b: Construct and interpret frequency polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";
import { lineGraph } from "../shared/sta.ts";

const LOWS = [0, 10, 20, 30, 40];

interface Params {
  f: number[];
  i: number;
}

export default defineGenerator<Params>({
  id: "GF-S3.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.GROUPED.MIDPOINT", "STA.SCALE.READ"],

  params(rng) {
    const p = { f: LOWS.map(() => rng.int(1, 9) * 2), i: rng.int(0, 4) };
    if ((p.f[p.i] ?? 0) === (LOWS[p.i] ?? 0) + 5)
      reject("a frequency that differs from the midpoint");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const lo = LOWS[p.i] ?? 0;
    const f = p.f[p.i] ?? 0;
    switch (depth) {
      case 1: {
        const right = coord([lo + 5, f]);
        return A.choice({
          rng,
          question: [
            `In a grouped frequency table, the class `,
            A.math(`${lo} < m \\le ${lo + 10}`),
            ` has frequency ${f}.`,
          ],
          ask: "Where is its point plotted on a frequency polygon?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([lo + 10, f])),
              code: "STA.GROUPED.MIDPOINT",
              feedback: "Plot at the midpoint of the class, not the upper end.",
            },
            {
              content: A.math(coord([lo, f])),
              code: "STA.GROUPED.MIDPOINT",
              feedback: "Plot at the midpoint of the class, not the lower end.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "Midpoint across, frequency up: ", math: right }],
        });
      }
      case 2: {
        const graph = lineGraph(
          p.f.map((v, k): [number, number] => [(LOWS[k] ?? 0) + 5, v]),
          { min: 0, max: 50, step: 5, label: "mass (kg)" },
          { min: 0, max: 20, step: 2, label: "frequency" },
          "A frequency polygon of the masses of some parcels, plotted at the class midpoints.",
        );
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The frequency polygon shows the masses of some parcels, in classes 10 kg wide.",
                A.figure(graph),
              ],
              ask: `How many parcels had a mass of more than ${lo} kg, up to ${lo + 10} kg?`,
            },
          ],
          answer: A.number(f),
          wrong: wrongs(f, [
            {
              code: "STA.SCALE.READ",
              value: A.number(lo + 5),
              feedback:
                "That is the midpoint of the class. The frequency is read on the vertical axis.",
            },
          ]),
          solution: [{ say: `The point above ${lo + 5} kg is at ${f}.` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The points of a frequency polygon are plotted at the upper class boundaries."],
          truth: "never",
          reasons: [
            {
              text: "Never. They are plotted at the class midpoints, with the frequency as the height.",
              correct: true,
            },
            { text: "Always. That is where each class ends.", code: "STA.GROUPED.MIDPOINT" },
            {
              text: "Sometimes. It depends on the width of the classes.",
              code: "STA.GROUPED.MIDPOINT",
            },
          ],
          solution: [
            {
              say: "Cumulative frequency graphs use upper boundaries; frequency polygons use midpoints.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === coord([(LOWS[p.i] ?? 0) + 5, p.f[p.i] ?? 0]);
    if (question.key.depth === 2) return numberAnswer(question) === p.f[p.i];
    return true;
  },
});
