/**
 * @statement GF-N16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N16: Apply and interpret limits of accuracy
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  len: number;
  side: number;
  dist: number;
  time: number;
}

const r = (v: number) => Math.round(v * 1e6) / 1e6;

export default defineGenerator<Params>({
  id: "GF-N16",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["NPV.BOUNDS.ENDS", "NPV.BOUNDS.DIVIDE"],

  params(rng) {
    return {
      len: rng.int(5, 30),
      side: rng.int(4, 15),
      dist: rng.int(10, 50) * 10,
      time: rng.int(20, 60),
    };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `A rod is ${p.len} cm long, measured to the nearest centimetre.`,
          ask: "What is the upper bound of its length?",
          answer: A.number(p.len + 0.5, { units: "cm" }),
          wrong: wrongs(p.len + 0.5, [
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(p.len + 1, { units: "cm" }),
              feedback: "To the nearest cm means within 0.5 cm either side.",
            },
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(r(p.len + 0.49), { units: "cm" }),
              feedback: "The upper bound is the boundary itself, even though it would round up.",
            },
          ]),
          solution: [
            {
              say: `Half a centimetre either side: the upper bound is ${p.len} + 0.5 = ${p.len + 0.5} cm.`,
            },
          ],
        });
      case 2: {
        const most = 4 * (p.side + 0.5);
        return A.standard({
          question: `Each side of a square is ${p.side} cm, to the nearest centimetre.`,
          ask: "What is the greatest possible perimeter of the square?",
          answer: A.number(most, { units: "cm" }),
          wrong: wrongs(most, [
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(4 * p.side + 0.5, { units: "cm" }),
              feedback:
                "Every side could be up to 0.5 cm longer, so add 0.5 to each side before multiplying by 4.",
            },
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(4 * p.side, { units: "cm" }),
              feedback: "That uses the rounded length. Use the upper bound of each side.",
            },
          ]),
          solution: [
            {
              say: `Upper bound of a side = ${p.side + 0.5} cm. 4 × ${p.side + 0.5} = ${most} cm.`,
            },
          ],
        });
      }
      default: {
        const dMax = p.dist + 5;
        const tMin = p.time - 0.5;
        const vMax = Math.round((dMax / tMin) * 1000) / 1000;
        return A.multiStepContext({
          context: `A car travels ${p.dist} m, to the nearest 10 m, in ${p.time} seconds, to the nearest second.`,
          parts: [
            {
              ask: "Write down the upper bound of the distance.",
              answer: A.number(dMax, { units: "m" }),
              wrong: wrongs(dMax, [
                {
                  code: "NPV.BOUNDS.ENDS",
                  value: A.number(p.dist + 0.5),
                  feedback: "To the nearest 10 m means within 5 m either side.",
                },
              ]),
            },
            {
              ask: "Work out the upper bound of the car's average speed, in m/s, to 3 decimal places.",
              answer: A.number(vMax, { units: "m/s", accuracy: { dp: 3 } }),
              wrong: wrongs(vMax, [
                {
                  code: "NPV.BOUNDS.DIVIDE",
                  value: A.number(Math.round((dMax / (p.time + 0.5)) * 1000) / 1000, {
                    accuracy: { dp: 3 },
                  }),
                  feedback:
                    "Dividing by a bigger number gives a smaller answer. For the greatest speed, divide the upper bound of distance by the lower bound of time.",
                },
              ]),
            },
          ],
          solution: [
            { say: `Upper bound of distance: ${dMax} m. Lower bound of time: ${tMin} s.` },
            { say: `Greatest speed = ${dMax} ÷ ${tMin} = ${vMax} m/s (3 d.p.).` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context") return numberAnswer(question) === p.dist + 5;
    const n = numberAnswer(question);
    return n === p.len + 0.5 || n === 4 * (p.side + 0.5);
  },
});
