/**
 * @statement GH-A12.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A12.a: Recognise and sketch exponential graphs y = kˣ
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  k: number;
}

function expGraph(k: number): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: -3, max: 3, step: 1 },
    y: { min: 0, max: 10, step: 1 },
    grid: true,
    curves: [{ y: `${k}^x`, domain: [-3, Math.log(10) / Math.log(k)] }],
    description:
      "A curve that rises ever more steeply from left to right, staying above the x-axis.",
  };
}

export default defineGenerator<Params>({
  id: "GH-A12.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SHAPE"],

  params(rng) {
    return { a: rng.int(2, 9), k: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Where does the graph of ",
            A.math(`y = ${p.a} \\times ${p.k}^x`),
            " cross the y-axis?",
          ],
          ask: "Give the y-coordinate.",
          answer: A.number(p.a),
          wrong: wrongs(p.a, [
            {
              code: "ALG.GRAPH.SHAPE",
              value: A.number(p.a * p.k),
              feedback: `At x = 0, ${p.k}⁰ = 1, so y = ${p.a}.`,
            },
          ]),
          solution: [{ say: "", math: `y = ${p.a} \\times ${p.k}^0 = ${p.a}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The graph shows ", A.math("y = k^x"), ".", A.figure(expGraph(p.k))],
          ask: "What is the value of k?",
          correct: A.math(String(p.k)),
          distractors: [2, 3, 4, 5]
            .filter((k) => k !== p.k)
            .slice(0, 2)
            .map((k) => ({
              content: A.math(String(k)),
              code: "ALG.GRAPH.SHAPE",
              feedback: "Read y when x = 1: y = k¹ = k.",
            })),
          solution: [{ say: `When x = 1, y = ${p.k}, so k = ${p.k}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jake says the graph of ",
            A.math(`y = ${p.k}^x`),
            " crosses the x-axis when x is very negative.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.k}^x is positive for every x: for very negative x it gets closer and closer to 0 but never reaches it.`,
              correct: true,
            },
            { text: "True. Every curve crosses the x-axis eventually.", code: "ALG.GRAPH.SHAPE" },
            { text: `True. ${p.k}^(−10) is negative.`, code: "ALG.GRAPH.SHAPE" },
          ],
          solution: [{ say: `${p.k}^(−n) = 1/${p.k}^n, which is small but positive.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a;
    if (question.key.depth === 2) return chosenText(question) === String(p.k);
    return true;
  },
});
