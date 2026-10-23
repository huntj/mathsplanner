/**
 * @statement Y9-ALG-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-01.b: Factorise x² + bx + c with negative b or c
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
  s: number;
  t: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.SIGNS"],

  params(rng) {
    const v = { p: rng.int(2, 9), q: rng.int(1, 9), s: rng.int(1, 6), t: rng.int(2, 8) };
    if (v.p === v.q || v.s === v.t) reject("different numbers");
    return v;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // (x − p)(x + q)
        const right = `${bracket(-p.p)}${bracket(p.q)}`;
        return A.standard({
          question: ["Factorise ", A.math(poly([1, p.q - p.p, -p.p * p.q])), "."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`${bracket(p.p)}${bracket(-p.q)}`),
              feedback: `The numbers must add to ${p.q - p.p}: check the signs by expanding.`,
            },
          ],
          solution: [
            {
              say: `−${p.p} × ${p.q} = −${p.p * p.q} and −${p.p} + ${p.q} = ${p.q - p.p}: `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        // (x − s)(x − t)
        const right = `${bracket(-p.s)}${bracket(-p.t)}`;
        return A.variedForm({
          rng,
          forms: [{ question: ["Factorise ", A.math(poly([1, -(p.s + p.t), p.s * p.t])), "."] }],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`${bracket(p.s)}${bracket(p.t)}`),
              feedback: `The numbers multiply to +${p.s * p.t} but add to −${p.s + p.t}, so both are negative.`,
            },
          ],
          solution: [{ say: "Both numbers are negative: ", math: right }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "If the number term of ",
            A.math("x^2 + bx + c"),
            " is negative, the two brackets have different signs.",
          ],
          truth: "always",
          reasons: [
            {
              text: `Always. c is the product of the two numbers, and a negative product needs one positive and one negative number, e.g. (x − ${p.p})(x + ${p.q}).`,
              correct: true,
            },
            { text: "Never. Both brackets have a minus sign.", code: "ALG.FACTORISE.SIGNS" },
            { text: "Sometimes. It depends on b.", code: "ALG.FACTORISE.SIGNS" },
          ],
          solution: [{ say: "Positive × negative = negative." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === `${bracket(-p.p)}${bracket(p.q)}`;
    if (question.key.depth === 2)
      return exactAnswer(question) === `${bracket(-p.s)}${bracket(-p.t)}`;
    return true;
  },
});
