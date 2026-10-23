/**
 * @statement GF-A14.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A14.b: Plot and interpret other graphs in real contexts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Euros per 10 pounds. */
  rate: number;
  pounds: number;
  start: number;
  fill: number;
}

function conversion(p: Params): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 100, step: 10, label: "\\text{pounds (£)}" },
    y: { min: 0, max: 10 * p.rate, step: p.rate > 12 ? 20 : 10, label: "\\text{euros (€)}" },
    grid: true,
    segments: [{ from: [0, 0], to: [100, 10 * p.rate] }],
    description: "A straight-line conversion graph from pounds to euros, through the origin.",
  };
}

function tank(p: Params): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 10, step: 1, label: "\\text{time (minutes)}" },
    y: { min: 0, max: p.start + 10 * p.fill + 10, step: 10, label: "\\text{water (litres)}" },
    grid: true,
    segments: [{ from: [0, p.start], to: [10, p.start + 10 * p.fill] }],
    description: "A straight-line graph of the water in a tank as it fills.",
  };
}

export default defineGenerator<Params>({
  id: "GF-A14.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.READ"],

  params(rng) {
    return {
      rate: rng.int(11, 13),
      pounds: 10 * rng.int(2, 9),
      start: 10 * rng.int(1, 4),
      fill: rng.int(2, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.pounds * p.rate) / 10;
        return A.standard({
          question: ["The graph converts pounds to euros.", A.figure(conversion(p))],
          ask: `How many euros is £${p.pounds}?`,
          answer: A.number(v, { units: "€", accuracy: { tolerance: 1 } }),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.READ",
              value: A.number(Math.round((p.pounds * 10) / p.rate), {
                units: "€",
                accuracy: { tolerance: 1 },
              }),
              feedback: "Go up from £ on the horizontal axis, then across to the euros axis.",
            },
          ]),
          solution: [{ say: `Up from £${p.pounds} and across: about €${v}.` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph shows the water in a tank as it fills.", A.figure(tank(p))],
              ask: "At what rate does the water flow in, in litres per minute?",
            },
          ],
          answer: A.number(p.fill, { units: "litres per minute" }),
          wrong: wrongs(p.fill, [
            {
              code: "ALG.GRAPH.READ",
              value: A.number((p.start + 10 * p.fill) / 10, { units: "litres per minute" }),
              feedback: `The tank already had ${p.start} litres: use the change in water, ${10 * p.fill} litres, over 10 minutes.`,
            },
          ]),
          solution: [
            {
              say: `It rises from ${p.start} to ${p.start + 10 * p.fill} litres in 10 minutes: ${p.fill} litres per minute.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The graph shows the water in a tank as it fills.",
            A.figure(tank(p)),
            " Lou says the tank was empty at the start.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The graph starts at ${p.start} litres when the time is 0: the intercept is the starting amount.`,
              correct: true,
            },
            { text: "True. Every graph starts at the origin.", code: "ALG.GRAPH.READ" },
            { text: "True. Time 0 means no water.", code: "ALG.GRAPH.READ" },
          ],
          solution: [{ say: "Read the value where time = 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.pounds * p.rate) / 10;
    if (question.key.depth === 2) return numberAnswer(question) === p.fill;
    return true;
  },
});
