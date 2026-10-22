/**
 * @statement GH-R14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-R14: Recognise and interpret graphs showing direct and inverse proportion
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Direct: y = kx, marked at x = a. Inverse: y = n/x. */
  k: number;
  a: number;
  n: number;
  c: number;
}

function graph(
  y: string,
  points: { at: [number, number]; label?: string }[] = [],
  top = 24,
): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 8, step: 1, label: "x" },
    y: { min: 0, max: top, step: top > 12 ? 4 : 2, label: "y" },
    grid: true,
    curves: [{ y, domain: y.includes("/") ? [0.5, 8] : [0, 8] }],
    points,
    description: "A graph of y against x for positive x.",
  };
}

export default defineGenerator<Params>({
  id: "GH-R14",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: [
    "RAT.INVERSE.AS-DIRECT",
    "RAT.PROPORTION.LINEAR-INTERCEPT",
    "ALG.GRADIENT.RUN-RISE",
  ],

  params(rng) {
    return { k: rng.int(2, 3), a: rng.int(2, 5), n: rng.pick([6, 8, 12]), c: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["The graph shows how y changes with x.", A.figure(graph(`${p.n}/x`, [], 12))],
          ask: "What kind of relationship does it show?",
          correct: "y is inversely proportional to x",
          distractors: [
            {
              content: "y is directly proportional to x",
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "As x increases, y decreases: that is inverse proportion.",
            },
            {
              content: "y is directly proportional to x²",
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "y gets smaller as x gets bigger, so it is an inverse relationship.",
            },
          ],
          solution: [
            {
              say: "The curve falls steeply, then levels off, never reaching either axis: y = k/x.",
            },
          ],
        });
      case 2: {
        const ya = p.k * p.a;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "y is directly proportional to x. The graph passes through the marked point.",
                A.figure(graph(`${p.k}*x`, [{ at: [p.a, ya], label: `(${p.a}, ${ya})` }])),
              ],
              ask: "Find the value of k in y = kx.",
            },
          ],
          answer: A.number(p.k),
          wrong: [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(Math.round((p.a / ya) * 100) / 100),
              feedback: `k = y ÷ x = ${ya} ÷ ${p.a}.`,
            },
          ],
          solution: [{ say: `k = ${ya} ÷ ${p.a} = ${p.k}, so y = ${p.k}x.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: "Which graph shows y directly proportional to x?",
          correct: graph(`${p.k}*x`),
          distractors: [
            {
              figure: graph(`${p.k}*x + ${p.c}`),
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
              feedback: "Direct proportion is a straight line through the origin.",
            },
            {
              figure: graph(`${p.n}/x`, [], 12),
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "That curve shows inverse proportion.",
            },
          ],
          solution: [{ say: "y = kx is a straight line through the origin." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jack says the graph of ",
            A.math(`y = ${p.k}x + ${p.c}`),
            " shows that y is directly proportional to x, because it is a straight line.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. It does not pass through the origin: when x = 0, y = ${p.c}. Doubling x does not double y.`,
              correct: true,
            },
            {
              text: "True. Every straight line shows direct proportion.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
            { text: "True. The gradient is constant." },
          ],
          solution: [
            {
              say: `Check: x = 1 gives y = ${p.k + p.c}, but x = 2 gives y = ${2 * p.k + p.c}, not double.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === p.k;
    return true;
  },
});
