/**
 * @statement AL-P5.9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.9: Use trigonometry to solve problems in context, including vectors, kinematics and forces
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { deg, rad } from "../shared/trig.ts";

interface Params {
  force: number;
  angle: number;
  x: number;
  y: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;
const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "AL-P5.9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.RATIO"],

  params(rng) {
    return { force: rng.int(10, 60), angle: rng.int(20, 70), x: rng.int(3, 12), y: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const h = r2(p.force * Math.cos(rad(p.angle)));
        return A.standard({
          question: `A sledge is pulled by a rope with tension ${p.force} N at ${p.angle}° above the horizontal.`,
          ask: "Find the horizontal component of the tension, to 2 decimal places.",
          answer: A.number(h, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(h, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r2(p.force * Math.sin(rad(p.angle))), {
                units: "N",
                accuracy: { dp: 2 },
              }),
              feedback: "The horizontal component is adjacent to the angle: use cos.",
            },
          ]),
          solution: [{ say: `${p.force} cos ${p.angle}° = ${h} N.` }],
        });
      }
      case 2: {
        const theta = r1(deg(Math.atan2(p.y, p.x)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A particle has velocity ",
                A.math(`(${p.x}\\mathbf{i} + ${p.y}\\mathbf{j})\\text{ m s}^{-1}`),
                ".",
              ],
              ask: "Find the angle its velocity makes with the vector i, to 1 decimal place.",
            },
          ],
          answer: A.number(theta, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(theta, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.atan2(p.x, p.y))), { units: "°", accuracy: { dp: 1 } }),
              feedback: `tan θ = opposite/adjacent = ${p.y}/${p.x}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tan\\theta = \\frac{${p.y}}{${p.x}} \\Rightarrow \\theta = ${theta}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A force of ${p.force} N acts at ${p.angle}° to the horizontal. Dev says its vertical component is ${p.force} cos ${p.angle}° N.`,
          truth: false,
          reasons: [
            {
              text: `False. The vertical component is opposite the angle with the horizontal: ${p.force} sin ${p.angle}° N.`,
              correct: true,
            },
            { text: "True. Components always use cos.", code: "GEO.TRIG.RATIO" },
            { text: `False. It is ${p.force} tan ${p.angle}° N.`, code: "GEO.TRIG.RATIO" },
          ],
          solution: [
            {
              say: "Resolve: the component next to the angle uses cos, the one opposite uses sin.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r2(p.force * Math.cos(rad(p.angle)));
    return true;
  },
});
