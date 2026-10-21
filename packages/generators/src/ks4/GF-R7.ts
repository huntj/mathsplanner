/**
 * @statement GF-R7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R7: Understand and use proportion as equality of ratios
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-R7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE"],

  params(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 12);
    if (a === b) reject("different parts");
    return { a, b, k: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.missingValue({
          intro: "These ratios are equal. Find the missing number.",
          relation: [p.a, ":", p.b, "=", p.a * p.k, ":", p.b * p.k],
          hide: 6,
          wrong: wrongs(p.b * p.k, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.b + p.a * p.k - p.a),
              feedback: `${p.a} was multiplied by ${p.k}, not added to. Multiply ${p.b} by ${p.k} too.`,
            },
          ]),
          solution: [{ say: `${p.a} × ${p.k} = ${p.a * p.k}, so ${p.b} × ${p.k} = ${p.b * p.k}.` }],
        });
      case 2: {
        const right = `${p.a * p.k} : ${p.b * p.k}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which ratio is equal to ", A.math(`${p.a} : ${p.b}`), "?"],
          correct: right,
          distractors: [
            {
              content: `${p.a + p.k} : ${p.b + p.k}`,
              code: "RAT.ADDITIVE",
              feedback:
                "Adding the same number to both parts changes the ratio. Multiply both parts by the same number.",
            },
            { content: `${p.b * p.k} : ${p.a * p.k}`, feedback: "The order matters." },
          ],
          solution: [{ say: `Multiply both parts by ${p.k}: ${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jas says ",
            A.math(`${p.a} : ${p.b}`),
            " and ",
            A.math(`${p.a + p.k} : ${p.b + p.k}`),
            " are in proportion, because she added the same to both parts.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Equal ratios come from multiplying both parts by the same number. ${p.a}/${p.b} ≠ ${p.a + p.k}/${p.b + p.k}.`,
              correct: true,
            },
            { text: "True. Any change done to both parts keeps the ratio.", code: "RAT.ADDITIVE" },
            { text: "True. Both ratios grew by the same amount.", code: "RAT.ADDITIVE" },
          ],
          solution: [
            {
              say: "Ratios are equal when their parts are in the same multiplicative relationship.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "missing-value") return numberAnswer(question) === p.b * p.k;
    if (question.archetype === "varied-form")
      return chosenText(question) === `${p.a * p.k} : ${p.b * p.k}`;
    return true;
  },
});
