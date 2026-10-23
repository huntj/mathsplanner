/**
 * @statement GF-N8.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N8.b: Calculate exactly with multiples of π
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "GF-N8.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CIRCLE.FORMULA", "NPV.ROOT.EXACT-DECIMAL"],

  params(rng) {
    return { r: rng.int(3, 12), d: rng.pick([6, 8, 10, 12, 14, 16, 18, 20]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [`A circle has radius ${p.r} cm.`],
          ask: "Find its area, giving your answer in terms of π.",
          answer: A.exact(`${p.r * p.r}\\pi`),
          wrong: [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.exact(`${2 * p.r}\\pi`),
              feedback: "That is the circumference, 2πr. The area is πr².",
            },
          ],
          solution: [{ say: "", math: `\\pi \\times ${p.r}^2 = ${p.r * p.r}\\pi \\text{ cm}^2` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A circle has diameter ${p.d} cm.`],
              ask: "Find its circumference, giving your answer in terms of π.",
            },
            {
              question: [`A circular table top has diameter ${p.d} cm.`],
              ask: "Find the distance around its edge, in terms of π.",
            },
          ],
          answer: A.exact(`${p.d}\\pi`),
          wrong: [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.exact(`${(p.d * p.d) / 4}\\pi`),
              feedback: "That is the area. The circumference is πd.",
            },
          ],
          solution: [{ say: "", math: `\\pi d = ${p.d}\\pi \\text{ cm}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Lee says the area of a circle of radius ${p.r} cm is exactly ${Number((3.14 * p.r * p.r).toFixed(2))} cm².`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. That uses π ≈ 3.14, so it is rounded. The exact area is ${p.r * p.r}π cm².`,
              correct: true,
            },
            { text: "True. 3.14 is the value of π.", code: "NPV.ROOT.EXACT-DECIMAL" },
            { text: `False. It is exactly ${2 * p.r}π cm².`, code: "MEA.CIRCLE.FORMULA" },
          ],
          solution: [{ say: "Leaving π in the answer keeps it exact." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === `${p.r * p.r}\\pi`;
    if (question.key.depth === 2) return exactAnswer(question) === `${p.d}\\pi`;
    return true;
  },
});
