/**
 * @statement Y8-STA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-STA-02.a: Plot scatter graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

const XS = [1, 2, 3, 4, 5, 6, 7, 8];

interface Params {
  h: number;
  m: number;
  out: number;
  jitter: number[];
}

function scatter(p: Params): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 9, step: 1, label: "\\text{hours of sunshine}" },
    y: { min: 0, max: 40, step: 4, label: "\\text{ice creams sold}" },
    grid: true,
    points: XS.map((x, i) => ({
      at: [x, i === p.out ? 36 - 4 * x : 4 * x + (p.jitter[i] ?? 0)] as [number, number],
    })),
    description: "A scatter graph of ice creams sold against hours of sunshine, with eight points.",
  };
}

export default defineGenerator<Params>({
  id: "Y8-STA-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COORD.ORDER"],

  params(rng) {
    return {
      h: rng.int(140, 185),
      m: rng.int(35, 80),
      out: rng.int(5, 7),
      jitter: XS.map(() => rng.int(-2, 2)),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = coord([p.h, p.m]);
        return A.choice({
          rng,
          question: [
            `A scatter graph has height (cm) on the horizontal axis and mass (kg) on the vertical axis. A pupil is ${p.h} cm tall and has a mass of ${p.m} kg.`,
          ],
          ask: "Which point should be plotted?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([p.m, p.h])),
              code: "ALG.COORD.ORDER",
              feedback: "The horizontal value (height) comes first.",
            },
            {
              content: A.math(coord([p.h - p.m, p.m])),
              feedback: "Plot the two measurements as they are.",
            },
          ],
          solution: [{ say: "(horizontal, vertical) = ", math: right }],
        });
      }
      case 2: {
        const x = XS[p.out] ?? 6;
        const right = coord([x, 36 - 4 * x]);
        const normal = XS.filter((_, i) => i !== p.out).slice(0, 2);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The scatter graph shows ice cream sales on days with different amounts of sunshine.",
            A.figure(scatter(p)),
          ],
          ask: "Which point does not fit the pattern (an outlier)?",
          correct: A.math(right),
          distractors: normal.map((nx) => ({
            content: A.math(coord([nx, 4 * nx + (p.jitter[XS.indexOf(nx)] ?? 0)])),
            feedback: "That point fits the trend of the others.",
          })),
          solution: [
            {
              say: "Most points rise from left to right; this one is far below the trend: ",
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lou says that after plotting a scatter graph, you should join the points with straight lines in order.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The points are separate pairs of data. You may draw one line of best fit through the middle of them, but you do not join the dots.",
              correct: true,
            },
            { text: "True. It makes a line graph.", code: "ALG.COORD.ORDER" },
            { text: "True. Joining them shows the correlation." },
          ],
          solution: [{ say: "Scatter graphs show the pattern of the points." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === coord([p.h, p.m]);
    if (question.key.depth === 2) {
      const x = XS[p.out] ?? 6;
      return chosenText(question) === coord([x, 36 - 4 * x]);
    }
    return true;
  },
});
