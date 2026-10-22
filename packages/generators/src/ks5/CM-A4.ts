/**
 * @statement CM-A4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A4: Compare distributions using graphs, including box plots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ChartSpec } from "@mathsplanner/diagrams";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Five = [number, number, number, number, number];

interface Params {
  a: Five;
  b: Five;
}

const iqr = (v: number[]) => (v[3] ?? 0) - (v[1] ?? 0);
const range = (v: number[]) => (v[4] ?? 0) - (v[0] ?? 0);

function plots(p: Params): ChartSpec {
  return {
    type: "chart",
    kind: "box",
    plots: [
      { name: "\\text{Bus}", values: p.a },
      { name: "\\text{Train}", values: p.b },
    ],
    axis: { min: 0, max: 80, step: 10, label: "\\text{journey time (minutes)}" },
    description: "Box plots of journey times by bus and by train on the same scale.",
  };
}

/** Five increasing values between 5 and 75. */
function five(rng: { int: (a: number, b: number) => number }): Five {
  const v0 = rng.int(5, 20);
  const v1 = v0 + rng.int(3, 14);
  const v2 = v1 + rng.int(3, 14);
  const v3 = v2 + rng.int(3, 14);
  return [v0, v1, v2, v3, v3 + rng.int(3, 14)];
}

export default defineGenerator<Params>({
  id: "CM-A4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.IQR.RANGE", "STA.COMPARE"],

  params(rng) {
    const p = { a: five(rng), b: five(rng) };
    if (Math.max(...p.a, ...p.b) > 78) reject("values on the axis");
    if (p.a[2] === p.b[2] || iqr(p.a) === iqr(p.b)) reject("different medians and IQRs");
    if (iqr(p.a) - iqr(p.b) === range(p.a) - range(p.b))
      reject("an IQR difference that differs from the range difference");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const fig = A.figure(plots(p));
    switch (depth) {
      case 1: {
        const v = Math.abs(iqr(p.a) - iqr(p.b));
        return A.standard({
          question: [
            "The box plots show journey times for a group of commuters by bus and by train.",
            fig,
          ],
          ask: "Find the difference between the interquartile ranges, in minutes.",
          answer: A.number(v, { units: "minutes" }),
          wrong: signedWrongs(v, [
            {
              code: "STA.IQR.RANGE",
              value: A.number(Math.abs(range(p.a) - range(p.b)), { units: "minutes" }),
              feedback:
                "The IQR is the width of the box (upper quartile − lower quartile), not the whole range.",
            },
          ]),
          solution: [
            {
              say: `Bus IQR = ${iqr(p.a)}, train IQR = ${iqr(p.b)}; the difference is ${v} minutes.`,
            },
          ],
        });
      }
      case 2: {
        const busSlower = (p.a[2] ?? 0) > (p.b[2] ?? 0);
        const busSpread = iqr(p.a) > iqr(p.b);
        const right = `The median bus time is ${busSlower ? "higher" : "lower"} and bus times are ${busSpread ? "more" : "less"} varied (larger IQR ${busSpread ? "for the bus" : "for the train"}).`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The box plots show journey times by bus and by train.", fig],
          ask: "Which comparison is best supported by the box plots?",
          correct: right,
          distractors: [
            {
              content: `The ${Math.max(...p.a) > Math.max(...p.b) ? "bus" : "train"} is slower, because its longest journey is longer.`,
              code: "STA.COMPARE",
              feedback: "The maximum is one extreme journey. Compare medians for typical times.",
            },
            {
              content: `The median bus time is ${busSlower ? "lower" : "higher"} and bus times are ${busSpread ? "less" : "more"} varied.`,
              code: "STA.COMPARE",
              feedback: "Read the medians (the line in each box) and the box widths again.",
            },
          ],
          solution: [
            {
              say: `Medians: bus ${p.a[2]}, train ${p.b[2]}. IQRs: bus ${iqr(p.a)}, train ${iqr(p.b)}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gil says the box plots show that more people travel by bus than by train, because the bus box is wider.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Each box plot splits its own group into quarters. It shows spread, not how many people are in the group.",
              correct: true,
            },
            { text: "True. A wider box contains more people.", code: "STA.COMPARE" },
            { text: "True. Box plots show frequencies.", code: "STA.COMPARE" },
          ],
          solution: [
            {
              say: "Each quarter of a box plot holds 25% of that group, however many people it has.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === Math.abs(iqr(p.a) - iqr(p.b));
    if (question.key.depth === 2)
      return chosenText(question).startsWith(
        `The median bus time is ${(p.a[2] ?? 0) > (p.b[2] ?? 0) ? "higher" : "lower"}`,
      );
    return true;
  },
});
