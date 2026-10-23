/**
 * @statement Y8-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-01.a: Find the circumference of a circle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  c: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y8-GEO-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CIRCLE.RADIUS-DIAMETER", "MEA.CIRCLE.FORMULA"],

  params(rng) {
    return { r: rng.int(2, 15), c: rng.int(20, 120) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(2 * Math.PI * p.r);
        return A.standard({
          question: [`A circle has radius ${p.r} cm.`],
          ask: "Find its circumference, in cm, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(Math.PI * p.r), { accuracy: { dp: 1 } }),
              feedback: "C = πd, and the diameter is twice the radius.",
            },
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(Math.PI * p.r * p.r), { accuracy: { dp: 1 } }),
              feedback: "πr² is the area. The circumference is 2πr.",
            },
          ]),
          solution: [{ say: "", math: `2 \\times \\pi \\times ${p.r} = ${v} \\text{ cm}` }],
        });
      }
      case 2: {
        const v = r1(p.c / Math.PI);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A circle has a circumference of ${p.c} cm.`],
              ask: "Find its diameter, in cm, to 1 decimal place.",
            },
            {
              question: [`A tree trunk is ${p.c} cm round.`],
              ask: "How wide is it (its diameter), in cm, to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(p.c / (2 * Math.PI)), { accuracy: { dp: 1 } }),
              feedback: "That is the radius. C = πd, so d = C ÷ π.",
            },
          ]),
          solution: [{ say: "", math: `${p.c} \\div \\pi = ${v} \\text{ cm}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A bicycle wheel has diameter ${2 * p.r * 5} cm. Ben says it moves about ${r1(Math.PI * 2 * p.r * 5)} cm forward each time it turns once.`,
          ],
          truth: true,
          reasons: [
            {
              text: "True. In one turn the wheel rolls out its circumference, π × diameter.",
              correct: true,
            },
            {
              text: "False. It moves forward its diameter each turn.",
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
            },
            { text: "False. It moves forward its area each turn.", code: "MEA.CIRCLE.FORMULA" },
          ],
          solution: [
            { say: "", math: `\\pi \\times ${2 * p.r * 5} \\approx ${r1(Math.PI * 2 * p.r * 5)}` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(2 * Math.PI * p.r);
    if (question.key.depth === 2) return numberAnswer(question) === r1(p.c / Math.PI);
    return true;
  },
});
