/**
 * @statement GF-S6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S6.b: Draw lines of best fit, interpolating and extrapolating
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const XS = [2, 3, 4, 5, 6, 7, 8];

interface Params {
  m: number;
  c: number;
  x0: number;
  far: number;
  jitter: number[];
}

function scatter(p: Params): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 10, step: 1, label: "\\text{hours of revision}" },
    y: { min: 0, max: 50, step: 5, label: "\\text{test mark}" },
    grid: true,
    points: XS.map((x, i) => ({ at: [x, p.m * x + p.c + (p.jitter[i] ?? 0)] as [number, number] })),
    curves: [{ y: `${p.m}*x + ${p.c}`, domain: [0, 10] as [number, number], dashed: true }],
    description:
      "A scatter graph of test mark against hours of revision, with a dashed line of best fit.",
  };
}

export default defineGenerator<Params>({
  id: "GF-S6.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.EXTRAPOLATE", "STA.REGRESSION.VARIABLES"],

  params(rng) {
    const p = {
      m: rng.int(3, 4),
      c: rng.int(3, 10),
      x0: rng.int(3, 7),
      far: rng.int(15, 25),
      jitter: XS.map(() => rng.int(-2, 2)),
    };
    if (p.m * 10 + p.c > 50) reject("a line that stays on the graph");
    if ((p.m * p.x0 + p.c - p.c) / p.m === p.m * p.x0 + p.c) reject("a slip that differs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.m * p.x0 + p.c;
        const slip = Math.round(((p.x0 - p.c) / p.m) * 10) / 10;
        return A.standard({
          question: [
            "The scatter graph shows test marks and hours of revision, with a line of best fit.",
            A.figure(scatter(p)),
          ],
          ask: `Use the line of best fit to estimate the mark of someone who revised for ${p.x0} hours.`,
          answer: A.number(v, { accuracy: { tolerance: 1 } }),
          wrong: wrongs(v, [
            {
              code: "STA.REGRESSION.VARIABLES",
              value: A.number(slip, { accuracy: { tolerance: 1 } }),
              feedback:
                "Go up from the hours on the horizontal axis to the line, then across to read the mark.",
            },
          ]),
          solution: [
            { say: `From ${p.x0} on the horizontal axis, up to the line and across: about ${v}.` },
          ],
        });
      }
      case 2: {
        const right = `The estimate for ${p.x0} hours, because ${p.x0} is inside the range of the data`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The scatter graph shows test marks for 2 to 8 hours of revision.",
            A.figure(scatter(p)),
          ],
          ask: `Which estimate from the line of best fit is more reliable?`,
          correct: right,
          distractors: [
            {
              content: `The estimate for ${p.far} hours, because the line can be extended`,
              code: "STA.EXTRAPOLATE",
              feedback: `${p.far} hours is far outside the data, so the pattern may not continue.`,
            },
            {
              content: "Both are equally reliable, because they come from the same line",
              code: "STA.EXTRAPOLATE",
              feedback:
                "Interpolation (inside the data) is more reliable than extrapolation (outside it).",
            },
          ],
          solution: [
            { say: "Interpolating inside the data is more reliable than extrapolating beyond it." },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ana says a line of best fit must pass through the origin."],
          truth: false,
          reasons: [
            {
              text: "False. It follows the trend of the points, with about as many above as below; it need not go through (0, 0).",
              correct: true,
            },
            { text: "True. Every line on a graph starts at the origin.", code: "STA.EXTRAPOLATE" },
            { text: "True. Zero revision means zero marks.", code: "STA.EXTRAPOLATE" },
          ],
          solution: [{ say: "Here the line crosses the vertical axis at about " + p.c + "." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m * p.x0 + p.c;
    if (question.key.depth === 2)
      return chosenText(question).startsWith(`The estimate for ${p.x0} hours`);
    return true;
  },
});
