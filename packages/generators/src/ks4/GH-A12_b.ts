/**
 * @statement GH-A12.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A12.b: Recognise and sketch the graphs of sin x, cos x and tan x
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const FNS = ["sin", "cos", "tan"] as const;

interface Params {
  a: number;
  fn: number;
}

function trigGraph(fn: string): CartesianSpec {
  const tan = fn === "tan";
  return {
    type: "cartesian",
    x: { min: 0, max: 360, step: 90 },
    y: tan ? { min: -4, max: 4, step: 1 } : { min: -1, max: 1, step: 0.5 },
    grid: true,
    curves: tan
      ? [
          { y: "tan(x)", domain: [0, 76], degrees: true },
          { y: "tan(x)", domain: [104, 256], degrees: true },
          { y: "tan(x)", domain: [284, 360], degrees: true },
        ]
      : [{ y: `${fn}(x)`, domain: [0, 360], degrees: true }],
    description: "A trigonometric graph for 0° ≤ x ≤ 360°.",
  };
}

export default defineGenerator<Params>({
  id: "GH-A12.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.TRIG-VALUES", "ALG.GRAPH.SHAPE"],

  params(rng) {
    return { a: rng.int(2, 9), fn: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["What is the largest value of ", A.math(`y = ${p.a}\\sin x`), "?"],
          answer: A.number(p.a),
          wrong: wrongs(p.a, [
            {
              code: "ALG.GRAPH.TRIG-VALUES",
              value: A.number(90),
              feedback: `The largest value of sin x is 1 (at x = 90°), so the largest value of ${p.a} sin x is ${p.a}.`,
            },
          ]),
          solution: [{ say: `sin x is at most 1, so ${p.a} sin x is at most ${p.a}.` }],
        });
      case 2: {
        const fn = FNS[p.fn] ?? "sin";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which function is shown, for ",
            A.math("0^\\circ \\le x \\le 360^\\circ"),
            "?",
            A.figure(trigGraph(fn)),
          ],
          correct: A.math(`y = \\${fn} x`),
          distractors: FNS.filter((f) => f !== fn).map((f) => ({
            content: A.math(`y = \\${f} x`),
            code: "ALG.GRAPH.SHAPE",
            feedback: "sin starts at 0 and rises; cos starts at 1; tan has gaps at 90° and 270°.",
          })),
          solution: [
            {
              say:
                fn === "sin"
                  ? "It starts at (0, 0) and rises to 1 at 90°."
                  : fn === "cos"
                    ? "It starts at (0, 1)."
                    : "It has vertical asymptotes at 90° and 270°.",
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says the graph of ",
            A.math("y = \\cos x"),
            " passes through the origin.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. cos 0° = 1, so the graph starts at (0, 1). It is y = sin x that passes through the origin.",
              correct: true,
            },
            { text: "True. All trig graphs start at 0.", code: "ALG.GRAPH.TRIG-VALUES" },
            { text: "True. cos 0° = 0.", code: "ALG.GRAPH.TRIG-VALUES" },
          ],
          solution: [{ say: "cos x = 0 at 90° and 270°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a;
    if (question.key.depth === 2) return chosenText(question) === `y = \\${FNS[p.fn]} x`;
    return true;
  },
});
