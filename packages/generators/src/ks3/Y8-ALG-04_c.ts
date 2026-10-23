/**
 * @statement Y8-ALG-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-04.c: Solve linear equations with fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-04.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    return { a: rng.int(1, 9), b: rng.int(2, 6), c: rng.int(-3, 9), k: rng.int(1, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = p.b * p.c - p.a;
        return A.standard({
          question: ["Solve ", A.math(`\\frac{x + ${p.a}}{${p.b}} = ${p.c}`), "."],
          answer: A.number(x),
          wrong: signedWrongs(x, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.c - p.a),
              feedback: `Multiply both sides by ${p.b} first: x + ${p.a} = ${p.b * p.c}.`,
            },
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.b * p.c + p.a),
              feedback: `To undo + ${p.a}, subtract ${p.a}.`,
            },
          ]),
          solution: [{ say: "", math: `x + ${p.a} = ${p.b * p.c} \\Rightarrow x = ${x}` }],
        });
      }
      case 2: {
        // x/2 + x/3 = 5k → x = 6k
        const x = 6 * p.k;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Solve ", A.math(`\\frac{x}{2} + \\frac{x}{3} = ${5 * p.k}`), "."] },
          ],
          answer: A.number(x),
          wrong: signedWrongs(x, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(5 * 5 * p.k),
              feedback: "Multiply every term by 6 (the LCM of 2 and 3): 3x + 2x = 30k.",
            },
          ]),
          solution: [
            {
              say: "Multiply every term by 6: ",
              math: `3x + 2x = ${30 * p.k} \\Rightarrow x = ${x}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "Multiplying every term on both sides of an equation by the same non-zero number keeps it true.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. Both sides change in the same way, so they stay equal. That is how you clear fractions.",
              correct: true,
            },
            {
              text: "Sometimes. Only the terms with fractions should be multiplied.",
              code: "ALG.SOLVE.WRONG-INVERSE",
            },
            { text: "Never. It changes the answer.", code: "ALG.SOLVE.WRONG-INVERSE" },
          ],
          solution: [{ say: "Do the same to every term on both sides." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.b * p.c - p.a;
    if (question.key.depth === 2) return numberAnswer(question) === 6 * p.k;
    return true;
  },
});
