/**
 * @statement GH-S4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-S4.b: Draw and interpret box plots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ChartSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Five = [number, number, number, number, number];

interface Params {
  a: Five;
  b: Five;
}

function five(rng: { int: (a: number, b: number) => number }): Five {
  const lo = rng.int(5, 20) * 2;
  const q1 = lo + rng.int(2, 6) * 2;
  const med = q1 + rng.int(2, 6) * 2;
  const q3 = med + rng.int(2, 6) * 2;
  return [lo, q1, med, q3, Math.min(100, q3 + rng.int(2, 8) * 2)];
}

const RIGHT = "Class A had the higher median; Class B's marks were more consistent.";

export default defineGenerator<Params>({
  id: "GH-S4.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.IQR.RANGE", "STA.COMPARE", "STA.RANGE.HIGHER-BETTER"],

  params(rng) {
    const p = { a: five(rng), b: five(rng) };
    if (p.a[2] <= p.b[2] || p.a[3] - p.a[1] <= p.b[3] - p.b[1])
      reject("A with the higher median and the wider box");
    if ((p.a[0] + p.a[4]) / 2 === p.a[2] || p.a[4] <= p.a[3])
      reject("a median away from the middle of the whiskers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const plots = (both: boolean): ChartSpec => ({
      type: "chart",
      kind: "box",
      plots: both
        ? [
            { name: "\\text{Class A}", values: p.a },
            { name: "\\text{Class B}", values: p.b },
          ]
        : [{ values: p.a }],
      axis: { min: 0, max: 100, step: 10, label: "\\text{mark}" },
      description: both
        ? "Box plots of marks for Class A and Class B on the same scale."
        : "A box plot of marks.",
    });
    switch (depth) {
      case 1: {
        const v = p.a[2];
        return A.standard({
          question: ["The box plot shows the marks in a test.", A.figure(plots(false))],
          ask: "What is the median mark?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.IQR.RANGE",
              value: A.number((p.a[0] + p.a[4]) / 2),
              feedback:
                "The median is the line inside the box, not halfway between the ends of the whiskers.",
            },
          ]),
          solution: [{ say: `The line inside the box is at ${v}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The box plots show the marks of two classes.", A.figure(plots(true))],
          ask: "Which comparison is correct?",
          correct: RIGHT,
          distractors: [
            {
              content: "Class A was more consistent, because its box is wider.",
              code: "STA.RANGE.HIGHER-BETTER",
              feedback: "A wider box (bigger IQR) means less consistent.",
            },
            {
              content: "Class B did better, because its lowest mark is higher.",
              code: "STA.COMPARE",
              feedback: "Compare the medians for which did better, not one extreme value.",
            },
          ].filter((d) => d.content !== RIGHT),
          solution: [
            {
              say: `Medians ${p.a[2]} and ${p.b[2]}; IQRs ${p.a[3] - p.a[1]} and ${p.b[3] - p.b[1]}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Eli says half of the data lies inside the box of a box plot."],
          truth: true,
          reasons: [
            {
              text: "True. The box runs from the lower quartile to the upper quartile, which holds the middle 50% of the data.",
              correct: true,
            },
            { text: "False. The box holds a quarter of the data.", code: "STA.IQR.RANGE" },
            { text: "False. All the data is inside the box.", code: "STA.IQR.RANGE" },
          ],
          solution: [{ say: "Each whisker and each half of the box holds about a quarter." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a[2];
    if (question.key.depth === 2) return chosenText(question) === RIGHT;
    return true;
  },
});
