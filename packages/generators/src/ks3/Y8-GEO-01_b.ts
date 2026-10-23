/**
 * @statement Y8-GEO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-01.b: Find the area of a circle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  d: number;
  r: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y8-GEO-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CIRCLE.RADIUS-DIAMETER", "NPV.POWER.ROOT-HALF", "RAT.SCALE.AREA-LINEAR"],

  params(rng) {
    return { d: rng.int(2, 15) * 2, r: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.PI * (p.d / 2) ** 2);
        return A.standard({
          question: [`A circular rug has a diameter of ${p.d} cm.`],
          ask: "Find its area, in cm², to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(Math.PI * p.d * p.d), { accuracy: { dp: 1 } }),
              feedback: `Use the radius in πr²: ${p.d} ÷ 2 = ${p.d / 2}.`,
            },
          ]),
          solution: [{ say: "", math: `\\pi \\times ${p.d / 2}^2 = ${v} \\text{ cm}^2` }],
        });
      }
      case 2: {
        const k = p.r * p.r;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A circle has an area of ", A.math(`${k}\\pi`), " cm²."],
              ask: "Find its radius, in cm.",
            },
          ],
          answer: A.number(p.r),
          wrong: wrongs(p.r, [
            {
              code: "NPV.POWER.ROOT-HALF",
              value: A.number(k / 2),
              feedback: `πr² = ${k}π, so r² = ${k} and r = √${k}.`,
            },
          ]),
          solution: [{ say: "", math: `r^2 = ${k} \\Rightarrow r = ${p.r}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Gil says doubling the radius of a circle from ${p.r} cm to ${2 * p.r} cm doubles its area.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The radius is squared, so the area is multiplied by 4: π × ${2 * p.r}² = ${4 * p.r * p.r}π, compared with ${p.r * p.r}π.`,
              correct: true,
            },
            { text: "True. Area grows in step with the radius.", code: "RAT.SCALE.AREA-LINEAR" },
            { text: "False. It multiplies the area by 8.", code: "RAT.SCALE.AREA-LINEAR" },
          ],
          solution: [{ say: "Scaling lengths by 2 scales areas by 2² = 4." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.PI * (p.d / 2) ** 2);
    if (question.key.depth === 2) return numberAnswer(question) === p.r;
    return true;
  },
});
