/**
 * @statement Y8-ALG-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-08.a: Read values from linear graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  x: number;
  x2: number;
}

function conversion(k: number): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 10, step: 1, label: "\\text{pounds (£)}" },
    y: { min: 0, max: 10 * k, step: k, label: "\\text{dollars (\\$)}" },
    grid: true,
    curves: [{ y: `${k}*x`, domain: [0, 10] as [number, number] }],
    description:
      "A conversion graph between pounds and dollars: a straight line through the origin.",
  };
}

export default defineGenerator<Params>({
  id: "Y8-ALG-08.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.READ", "RAT.PROPORTION.LINEAR-INTERCEPT"],

  params(rng) {
    return { k: rng.int(2, 5), x: rng.int(2, 9), x2: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const fig = A.figure(conversion(p.k));
    switch (depth) {
      case 1: {
        const v = p.k * p.x;
        return A.standard({
          question: ["The graph converts between pounds and a made-up currency of dollars.", fig],
          ask: `How many dollars is £${p.x}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.READ",
              value: A.number(p.x),
              feedback:
                "Go up from £" +
                p.x +
                " on the horizontal axis to the line, then across to the dollars axis.",
            },
          ]),
          solution: [{ say: `From £${p.x}, up to the line and across: $${v}.` }],
        });
      }
      case 2: {
        const d = p.k * p.x2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph converts between pounds and dollars.", fig],
              ask: `How many pounds is $${d}?`,
            },
          ],
          answer: A.number(p.x2),
          wrong: wrongs(p.x2, [
            {
              code: "ALG.GRAPH.READ",
              value: A.number(d * p.k),
              feedback:
                "Start on the dollars axis this time, go across to the line, then down to read pounds.",
            },
          ]),
          solution: [{ say: `From $${d}, across to the line and down: £${p.x2}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A taxi charges £3 plus £${p.k} per mile. Its cost graph is a straight line. Sam says a 10-mile trip costs twice as much as a 5-mile trip.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The fixed £3 is not doubled: 5 miles costs £${3 + 5 * p.k} and 10 miles costs £${3 + 10 * p.k}. The line does not go through the origin.`,
              correct: true,
            },
            {
              text: "True. Double the miles, double the cost.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
            {
              text: "True. Every straight-line graph shows direct proportion.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
          ],
          solution: [{ say: "Only lines through the origin show direct proportion." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.x2;
    return true;
  },
});
