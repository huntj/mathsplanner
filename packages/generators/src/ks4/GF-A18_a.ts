/**
 * @statement GF-A18.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A18.a: Solve quadratic equations by factorising
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-A18.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN"],

  params(rng) {
    const p = { a: rng.int(-9, 9), b: rng.int(-9, 9) };
    if (p.a === 0 || p.b === 0 || p.a === p.b || p.a === -p.b)
      reject("two different non-zero roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const big = Math.max(p.a, p.b);
    const small = Math.min(p.a, p.b);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Solve ", A.math(`${poly([1, -(p.a + p.b), p.a * p.b])} = 0`), "."],
          ask: "Give the larger solution.",
          answer: A.number(big),
          wrong: signedWrongs(big, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(-small),
              feedback: "From (x − a)(x − b) = 0 the solutions are x = a and x = b.",
            },
          ]),
          solution: [
            {
              say: "Factorise, then set each bracket to 0: ",
              math: `x = ${small} \\text{ or } x = ${big}`,
            },
          ],
        });
      case 2: {
        // x² + bx = −c, needing rearrangement first
        const bCoef = -(p.a + p.b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Solve ", A.math(`${poly([1, bCoef, 0])} = ${-p.a * p.b}`), "."],
              ask: "Give the smaller solution.",
            },
          ],
          answer: A.number(small),
          wrong: signedWrongs(small, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(-big),
              feedback: "Rearrange to = 0 first, then factorise and change the signs.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${poly([1, bCoef, p.a * p.b])} = 0 \\Rightarrow x = ${small} \\text{ or } x = ${big}`,
            },
          ],
        });
      }
      default: {
        const bracket = (r: number) => `(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})`;
        return A.spotTheMistake({
          question: ["Dev solves ", A.math(`${poly([1, -(p.a + p.b), p.a * p.b])} = 0`), "."],
          lines: [
            [A.math(`${bracket(p.a)}${bracket(p.b)} = 0`)],
            [A.math(`x = ${-p.a} \\text{ or } x = ${-p.b}`)],
          ],
          mistake: 1,
          code: "ALG.QUADRATIC.ROOT-SIGN",
          feedback: `${bracket(p.a)} = 0 when x = ${p.a}: the solutions are x = ${p.a} or x = ${p.b}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === Math.max(p.a, p.b);
    if (question.key.depth === 2) return numberAnswer(question) === Math.min(p.a, p.b);
    return true;
  },
});
