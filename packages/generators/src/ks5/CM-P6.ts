/**
 * @statement CM-P6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P6: Use P(A′) = 1 − P(A), P(A ∪ B) = P(A) + P(B) − P(A ∩ B) and P(A ∩ B) = P(A)P(B|A)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  a: number;
  b: number;
  ab: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "CM-P6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.VENN.DOUBLE-COUNT", "PRO.TREE.ADD-ALONG", "PRO.COMPLEMENT"],

  params(rng) {
    const p = { a: rng.int(20, 70), b: rng.int(20, 70), ab: rng.int(5, 20), c: rng.int(10, 90) };
    if (p.ab >= Math.min(p.a, p.b) || p.a + p.b - p.ab > 100) reject("a consistent Venn diagram");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = round((p.a + p.b - p.ab) / 100, 2);
        return A.standard({
          question: [
            "Given ",
            A.math(`P(A) = ${p.a / 100}`),
            ", ",
            A.math(`P(B) = ${p.b / 100}`),
            " and ",
            A.math(`P(A \\cap B) = ${p.ab / 100}`),
            ",",
          ],
          ask: ["find ", A.math("P(A \\cup B)"), "."],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.number(round((p.a + p.b) / 100, 2), { accuracy: { dp: 2 } }),
              feedback: "Adding P(A) and P(B) counts the overlap twice: subtract P(A ∩ B) once.",
            },
          ]),
          solution: [{ say: "", math: `${p.a / 100} + ${p.b / 100} - ${p.ab / 100} = ${v}` }],
        });
      }
      case 2: {
        const v = round((p.a * p.c) / 10000, 4);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The probability that it rains on a given day is ${p.a / 100}. If it rains, the probability that a train is late is ${p.c / 100}.`,
              ],
              ask: "Find the probability that it rains and the train is late.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.TREE.ADD-ALONG",
              value: A.number(round((p.a + p.c) / 100, 4), { accuracy: { dp: 4 } }),
              feedback: "P(A ∩ B) = P(A) × P(B | A): multiply.",
            },
          ]),
          solution: [{ say: "", math: `${p.a / 100} \\times ${p.c / 100} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Wes says that if ",
            A.math(`P(A) = ${p.a / 100}`),
            ", then ",
            A.math(`P(A') = ${p.a / 100} - 1`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. P(A′) = 1 − P(A) = ${round(1 - p.a / 100, 2)}. A probability cannot be negative.`,
              correct: true,
            },
            { text: "True. Subtract 1 to find the opposite.", code: "PRO.COMPLEMENT" },
            { text: "True. P(A′) is always negative.", code: "PRO.COMPLEMENT" },
          ],
          solution: [{ say: "A and A′ together are certain: P(A) + P(A′) = 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === round((p.a + p.b - p.ab) / 100, 2);
    if (question.key.depth === 2) return numberAnswer(question) === round((p.a * p.c) / 10000, 4);
    return true;
  },
});
