/**
 * @statement GF-N7.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N7.b: Calculate with integer indices, including zero and negative indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  n: number;
  m: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-N7.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.INDEX.NEGATIVE", "NPV.INDEX.ZERO", "ALG.INDICES.MULTIPLY"],

  params(rng) {
    const p = { a: rng.int(2, 5), n: rng.int(1, 3), m: rng.int(-4, 7), k: rng.int(-4, 7) };
    if (p.m === 0 || p.k === 0 || p.m + p.k === p.m * p.k)
      reject("non-zero powers whose sum and product differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(1, p.a ** p.n);
        return A.standard({
          question: [
            "Work out ",
            A.math(`${p.a}^{-${p.n}}`),
            ", giving your answer as a fraction.",
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "NPV.INDEX.NEGATIVE",
              value: A.exact(String(-(p.a ** p.n))),
              feedback: "A negative power means a reciprocal, not a negative number.",
            },
          ],
          solution: [
            { say: "", math: `${p.a}^{-${p.n}} = \\frac{1}{${p.a}^{${p.n}}} = ${toLatex(v)}` },
          ],
        });
      }
      case 2: {
        const v = p.m + p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [A.math(`${p.a}^{${p.m}} \\times ${p.a}^{${p.k}} = ${p.a}^{x}`), "."],
              ask: "Find x.",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.number(p.m * p.k),
              feedback: "When multiplying powers of the same number, add the indices.",
            },
          ]),
          solution: [{ say: "", math: `x = ${p.m} + (${p.k}) = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ola says ",
            A.math(`${p.a + 4}^0 = 0`),
            ` because there are no ${p.a + 4}s multiplied together.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.a + 4}^0 = 1: for example ${p.a + 4}³ ÷ ${p.a + 4}³ = ${p.a + 4}^0, and anything divided by itself is 1.`,
              correct: true,
            },
            { text: "True. Any number to the power 0 is 0.", code: "NPV.INDEX.ZERO" },
            {
              text: `False. It is ${p.a + 4}, because the power does nothing.`,
              code: "NPV.INDEX.ZERO",
            },
          ],
          solution: [{ say: "Any non-zero number to the power 0 is 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(1, p.a ** p.n));
    if (question.key.depth === 2) return numberAnswer(question) === p.m + p.k;
    return true;
  },
});
