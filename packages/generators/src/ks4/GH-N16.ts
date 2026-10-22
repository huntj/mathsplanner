/**
 * @statement GH-N16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-N16: Calculate with upper and lower bounds
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A rectangle (or plank and offcut) in whole centimetres, each to the nearest cm. */
  length: number;
  width: number;
  /** A distance to the nearest 10 m and a time to the nearest second. */
  distance: number;
  time: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "GH-N16",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["NPV.BOUNDS.ENDS", "NPV.BOUNDS.SUBTRACT", "NPV.BOUNDS.DIVIDE"],

  params(rng) {
    const length = rng.int(12, 40);
    const width = rng.int(5, 11);
    if (length - width < 4) reject("a clear difference");
    return { length, width, distance: rng.int(10, 40) * 10, time: rng.int(20, 60) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const ub = (p.length + 0.5) * (p.width + 0.5);
        return A.standard({
          question: `A rectangle measures ${p.length} cm by ${p.width} cm, each correct to the nearest centimetre.`,
          ask: "Work out the upper bound of its area.",
          answer: A.number(ub, { units: "cm²" }),
          wrong: wrongs(ub, [
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(p.length * p.width + 0.5, { units: "cm²" }),
              feedback: "Find the upper bound of each length first, then multiply.",
            },
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number((p.length + 1) * (p.width + 1), { units: "cm²" }),
              feedback:
                "To the nearest centimetre, each length can be up to half a centimetre more.",
            },
          ]),
          solution: [{ say: `${p.length + 0.5} × ${p.width + 0.5} = ${ub} cm².` }],
        });
      }
      case 2: {
        const lb = p.length - p.width - 1;
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A plank is ${p.length} cm long. A piece ${p.width} cm long is cut off. Both lengths are correct to the nearest centimetre.`,
              ask: "Work out the lower bound of the length left.",
            },
            {
              question: `A ribbon ${p.length} cm long has ${p.width} cm used for a bow. Both lengths are correct to the nearest centimetre.`,
              ask: "Work out the least possible length of ribbon left.",
            },
          ],
          answer: A.number(lb, { units: "cm" }),
          wrong: wrongs(lb, [
            {
              code: "NPV.BOUNDS.SUBTRACT",
              value: A.number(p.length - p.width, { units: "cm" }),
              feedback:
                "For the least difference, take the smallest start and the biggest piece removed.",
            },
          ]),
          solution: [{ say: `${p.length - 0.5} − ${p.width + 0.5} = ${lb} cm.` }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `A cyclist travels ${p.distance} m, to the nearest 10 m, in ${p.time} s, to the nearest second. Max says the upper bound of the speed is ${p.distance + 5} ÷ ${p.time + 0.5}.`,
          truth: false,
          reasons: [
            {
              text: `False. The greatest speed comes from the longest distance in the shortest time: ${p.distance + 5} ÷ ${p.time - 0.5}.`,
              correct: true,
            },
            {
              text: "True. Upper bounds always use the upper bound of every number.",
              code: "NPV.BOUNDS.DIVIDE",
            },
            { text: `False. It is ${p.distance + 10} ÷ ${p.time + 1}.`, code: "NPV.BOUNDS.ENDS" },
          ],
          solution: [
            {
              say: "Dividing by a smaller number gives a bigger answer, so divide by the lower bound of the time.",
            },
          ],
        });
      default: {
        const ubd = p.distance + 5;
        const speed = r2(ubd / (p.time - 0.5));
        return A.multiStepContext({
          context: `A runner covers ${p.distance} m, correct to the nearest 10 m, in ${p.time} s, correct to the nearest second.`,
          parts: [
            {
              ask: "Write down the upper bound of the distance.",
              answer: A.number(ubd, { units: "m" }),
              wrong: wrongs(ubd, [
                {
                  code: "NPV.BOUNDS.ENDS",
                  value: A.number(p.distance + 10, { units: "m" }),
                  feedback: "To the nearest 10 m means up to 5 m either side.",
                },
              ]),
            },
            {
              ask: "Work out the upper bound of the runner's average speed. Give your answer to 2 decimal places.",
              answer: A.number(speed, { units: "m/s", accuracy: { dp: 2 } }),
              wrong: wrongs(speed, [
                {
                  code: "NPV.BOUNDS.DIVIDE",
                  value: A.number(r2(ubd / (p.time + 0.5)), { units: "m/s", accuracy: { dp: 2 } }),
                  feedback: "Divide by the lower bound of the time to get the greatest speed.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.distance} + 5 = ${ubd} m.` },
            { say: `${ubd} ÷ ${p.time - 0.5} = ${speed} m/s to 2 decimal places.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.length + 0.5) * (p.width + 0.5);
    if (question.key.depth === 2) return numberAnswer(question) === p.length - p.width - 1;
    if (question.key.depth === 5) return numberAnswer(question) === p.distance + 5;
    return true;
  },
});
