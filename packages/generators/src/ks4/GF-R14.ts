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
import { orClaims } from "../shared/variety.ts";

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
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
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
                {
                  text: "True. Read the graph at 4 minutes to find the rate.",
                  code: "RAT.RATE.VALUE",
                },
                { text: "True. The rate increases as the tank fills.", code: "RAT.RATE.VALUE" },
              ],
              solution: [{ say: "A rate is a gradient: the change in y for each unit of x." }],
            }),
          [
            {
              statement:
                "A straight-line graph of distance against time goes from (0, 0) to (5, 40). Leo says the speed is 8 units per unit time.",
              truth: true,
              right: "True. The gradient is 40 ÷ 5 = 8.",
              wrong: [
                ["False. It is 40, the final distance.", "RAT.RATE.VALUE"],
                ["False. It is 5 ÷ 40.", "ALG.GRADIENT.RUN-RISE"],
              ],
            },
            {
              claim: "The gradient of a graph shows a rate of change.",
              truth: "always",
              right: "Always. It tells you how much y changes for each unit of x.",
              wrong: [
                ["Never. It shows the total.", "RAT.RATE.VALUE"],
                ["Sometimes. Only for money."],
              ],
            },
            {
              statement:
                "On a graph of water against time, the line is flat from 3 to 5 minutes. Sol says water is flowing in fastest then.",
              truth: false,
              right: "False. A flat line means no change: no water flows in.",
              wrong: [
                ["True. The value is highest there.", "RAT.RATE.VALUE"],
                ["True. Flat means fast."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.rate;
    if (question.archetype === "varied-form") return chosenText(question).startsWith("the rate");
    return true;
  },
});
