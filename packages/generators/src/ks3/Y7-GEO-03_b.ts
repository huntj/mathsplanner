/**
 * @statement Y7-GEO-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-03.b: Interpret scale drawings
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  d: number;
  x: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-GEO-03.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SCALE.DIVIDES", "MEA.CONVERT.FACTOR"],

  params(rng) {
    return { k: rng.pick([2, 3, 4, 5, 10]), d: rng.int(3, 15), x: rng.int(4, 30) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.d * p.k;
        return A.standard({
          question: [
            `On a plan of a school, 1 cm represents ${p.k} m. The hall is ${p.d} cm long on the plan.`,
          ],
          ask: "How long is the real hall, in m?",
          answer: A.number(v, { units: "m" }),
          wrong: wrongs(v, [
            {
              code: "GEO.SCALE.DIVIDES",
              value: A.number(r(p.d / p.k), { units: "m" }),
              feedback: `Each centimetre is ${p.k} m in real life, so multiply.`,
            },
          ]),
          solution: [{ say: "", math: `${p.d} \\times ${p.k} = ${v} \\text{ m}` }],
        });
      }
      case 2: {
        const v = r((p.x * 50) / 100);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A model is built to a scale of ",
                A.math("1 : 50"),
                `. A door on the model is ${p.x} cm tall.`,
              ],
              ask: "How tall is the real door, in m?",
            },
          ],
          answer: A.number(v, { units: "m" }),
          wrong: wrongs(v, [
            {
              code: "MEA.CONVERT.FACTOR",
              value: A.number(p.x * 50, { units: "m" }),
              feedback: `${p.x} × 50 = ${p.x * 50} cm. Change to metres by dividing by 100.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.x} \\times 50 = ${p.x * 50} \\text{ cm} = ${v} \\text{ m}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `On a scale drawing where 1 cm represents ${p.k} m, Kai says a right angle on the drawing stands for a ${90 * p.k}° angle in real life.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A scale drawing changes lengths but not angles, so a right angle is still 90°.",
              correct: true,
            },
            {
              text: "True. Everything on the drawing is multiplied by the scale.",
              code: "GEO.SCALE.DIVIDES",
            },
            { text: `False. It is ${90 / p.k}°.`, code: "GEO.SCALE.DIVIDES" },
          ],
          solution: [
            { say: "The real shape and the drawing are similar: same angles, scaled lengths." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.d * p.k;
    if (question.key.depth === 2) return numberAnswer(question) === r((p.x * 50) / 100);
    return true;
  },
});
