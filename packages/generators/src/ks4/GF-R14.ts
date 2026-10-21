/**
 * @statement GF-R14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R14: Interpret the gradient of a straight line graph as a rate of change
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  start: number;
  rate: number;
  t: number;
}

/** A tank filling: volume against time. */
function tank(p: Params): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: p.t + 2, step: 2, label: "\\text{time (min)}" },
    y: {
      min: 0,
      max: p.start + p.rate * (p.t + 2),
      step: p.start + p.rate * (p.t + 2) > 60 ? 10 : 5,
      label: "\\text{volume (litres)}",
    },
    grid: true,
    curves: [{ y: `${p.rate}x + ${p.start}`, domain: [0, p.t] }],
    description: "A straight-line graph of the volume of water in a tank against time.",
  };
}

export default defineGenerator<Params>({
  id: "GF-R14",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.RATE.VALUE", "ALG.GRADIENT.RUN-RISE"],

  params(rng) {
    return { start: rng.int(1, 4) * 5, rate: rng.pick([2, 3, 4, 5]), t: rng.pick([6, 8, 10]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Water is pumped into a tank. The graph shows the volume of water.",
            A.figure(tank(p)),
          ],
          ask: "At what rate is water being added, in litres per minute?",
          answer: A.number(p.rate, { units: "litres per minute" }),
          wrong: wrongs(p.rate, [
            {
              code: "RAT.RATE.VALUE",
              value: A.number(p.start + p.rate * p.t),
              feedback:
                "That is the volume at the end. The rate is the change in volume ÷ the change in time.",
            },
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(Math.round((1 / p.rate) * 1000) / 1000),
              feedback: "Change in volume ÷ change in time, not the other way round.",
            },
          ]),
          solution: [
            {
              say: `From 0 to ${p.t} minutes the volume rises from ${p.start} to ${p.start + p.rate * p.t} litres: ${p.rate * p.t} ÷ ${p.t} = ${p.rate} litres per minute.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The graph shows the volume of water in a tank.", A.figure(tank(p))],
          ask: "What does the gradient of the line represent?",
          correct: "the rate at which water is added, in litres per minute",
          distractors: [
            {
              content: "the amount of water in the tank at the start",
              code: "RAT.RATE.VALUE",
              feedback: "That is the y-intercept.",
            },
            {
              content: "the time it takes to fill the tank",
              feedback: "The gradient is a change in volume per minute.",
            },
          ],
          solution: [{ say: "Gradient = change in volume ÷ change in time: litres per minute." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The graph shows the volume of water in a tank.",
            A.figure(tank(p)),
            `Mo says that after 4 minutes water is being added at ${p.start + 4 * p.rate} litres per minute.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.start + 4 * p.rate} litres is the volume after 4 minutes. The line is straight, so the rate is always ${p.rate} litres per minute.`,
              correct: true,
            },
            { text: "True. Read the graph at 4 minutes to find the rate.", code: "RAT.RATE.VALUE" },
            { text: "True. The rate increases as the tank fills.", code: "RAT.RATE.VALUE" },
          ],
          solution: [{ say: "A rate is a gradient: the change in y for each unit of x." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.rate;
    if (question.archetype === "varied-form") return chosenText(question).startsWith("the rate");
    return true;
  },
});
