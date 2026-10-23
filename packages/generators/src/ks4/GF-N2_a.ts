/**
 * @statement GF-N2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N2.a: Calculate with negative numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "GF-N2.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.NEGATIVE.SUBTRACT-NEGATIVE", "NPV.NEGATIVE.SIGN-RULE"],

  params(rng) {
    const p = { a: rng.int(-12, 12), b: rng.int(2, 9), c: rng.int(2, 9) };
    if (p.a === 0) reject("a non-zero start");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const sign = (n: number) => `${n < 0 ? "-" : "+"} ${Math.abs(n)}`;
    switch (depth) {
      case 1: {
        const v = p.a + p.b;
        return A.standard({
          question: ["Work out ", A.math(`${p.a} - (-${p.b})`), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
              value: A.number(p.a - p.b),
              feedback: `Subtracting a negative is the same as adding: ${p.a} + ${p.b}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} - (-${p.b}) = ${p.a} + ${p.b} = ${v}` }],
        });
      }
      case 2: {
        const v = p.b * p.c + p.a;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`(-${p.b}) \\times (-${p.c}) ${sign(p.a)}`), "."] },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.NEGATIVE.SIGN-RULE",
              value: A.number(-p.b * p.c + p.a),
              feedback: "A negative times a negative is positive.",
            },
          ]),
          solution: [{ say: "", math: `${p.b * p.c} ${sign(p.a)} = ${v}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Subtracting a number makes the answer smaller."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. Subtracting a positive number makes it smaller, but ${p.a} − (−${p.b}) = ${p.a + p.b}, which is bigger.`,
              correct: true,
            },
            {
              text: "Always. Subtracting means taking away.",
              code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
            },
            { text: "Never. The answer stays the same size." },
          ],
          solution: [{ say: "Subtracting a negative number moves up the number line." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a + p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.b * p.c + p.a;
    return true;
  },
});
