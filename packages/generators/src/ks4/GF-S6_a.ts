/**
 * @statement GF-S6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S6.a: Describe correlation, knowing it is not causation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";

const TYPES = ["Positive correlation", "Negative correlation", "No correlation"];
const CONTEXTS: [string, number][] = [
  ["the temperature each day and the number of ice creams sold", 0],
  ["the age of a car and its value", 1],
  ["people's shoe sizes and their test scores", 2],
  ["the hours spent revising and the marks in a test", 0],
  ["the speed of a runner and the time taken to finish a race", 1],
];

interface Params {
  context: number;
  trend: number;
  jitter: number[];
}

const XS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function scatter(p: Params): CartesianSpec {
  const y = (x: number, i: number) =>
    p.trend === 0
      ? 4 + 3 * x + (p.jitter[i] ?? 0)
      : p.trend === 1
        ? 34 - 3 * x + (p.jitter[i] ?? 0)
        : 20 + (p.jitter[i] ?? 0) * 3;
  return {
    type: "cartesian",
    x: { min: 0, max: 10, step: 1 },
    y: { min: 0, max: 40, step: 4 },
    grid: true,
    points: XS.map((x, i) => ({ at: [x, y(x, i)] as [number, number] })),
    description: "A scatter graph of nine points.",
  };
}

export default defineGenerator<Params>({
  id: "GF-S6.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.CORRELATION.TYPE", "STA.SCATTER.CAUSATION"],

  params(rng) {
    return {
      context: rng.int(0, CONTEXTS.length - 1),
      trend: rng.int(0, 2),
      jitter: XS.map(() => rng.int(-3, 3)),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, t] = CONTEXTS[p.context] ?? CONTEXTS[0] ?? ["", 0];
        const right = TYPES[t] ?? "";
        return A.choice({
          rng,
          question: [`What type of correlation would you expect between ${what}?`],
          correct: right,
          distractors: TYPES.filter((x) => x !== right).map((x) => ({
            content: x,
            code: "STA.CORRELATION.TYPE",
            feedback:
              "Positive: both go up together. Negative: one goes up as the other goes down.",
          })),
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const right = TYPES[p.trend] ?? "";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Describe the correlation shown in the scatter graph.", A.figure(scatter(p))],
          correct: right,
          distractors: TYPES.filter((x) => x !== right).map((x) => ({
            content: x,
            code: "STA.CORRELATION.TYPE",
            feedback: "Look at the overall pattern from left to right.",
          })),
          solution: [{ say: `${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ice cream sales and cases of sunburn show strong positive correlation. Max says eating ice cream causes sunburn.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Correlation does not show causation. Both go up in hot, sunny weather, a third factor.",
              correct: true,
            },
            {
              text: "True. Strong correlation proves one thing causes the other.",
              code: "STA.SCATTER.CAUSATION",
            },
            {
              text: "True. The points lie close to a straight line.",
              code: "STA.SCATTER.CAUSATION",
            },
          ],
          solution: [{ say: "Look for a hidden variable that affects both." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === TYPES[CONTEXTS[p.context]?.[1] ?? 0];
    if (question.key.depth === 2) return chosenText(question) === TYPES[p.trend];
    return true;
  },
});
