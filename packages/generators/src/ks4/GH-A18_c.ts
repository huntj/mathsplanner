/**
 * @statement GH-A18.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A18.c: Solve quadratics that need rearranging first
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  s: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GH-A18.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.BOTH-SIDES", "ALG.QUADRATIC.ROOT-SIGN"],

  params(rng) {
    const p = { r: rng.int(1, 9), s: rng.int(1, 9) * rng.pick([1, -1]), k: rng.int(2, 9) };
    if (p.r === p.s || p.r + p.s === 0 || p.r === -p.s) reject("two different roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // Roots r and s: x² − (r + s)x + rs = 0
    const sum = p.r + p.s;
    const prod = p.r * p.s;
    const big = Math.max(p.r, p.s);
    switch (depth) {
      case 1: {
        // x(x − sum) = −prod
        return A.standard({
          question: [
            "Solve ",
            A.math(`x(x ${sum < 0 ? "+" : "-"} ${Math.abs(sum)}) = ${-prod}`),
            ".",
          ],
          ask: "Give the larger solution.",
          answer: A.number(big),
          wrong: signedWrongs(big, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(-Math.min(p.r, p.s)),
              feedback: "Expand, rearrange to = 0, factorise, then set each bracket to 0.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${poly([1, -sum, prod])} = 0 \\Rightarrow x = ${p.r} \\text{ or } x = ${p.s}`,
            },
          ],
        });
      }
      case 2: {
        // x + prod/x = sum, for x ≠ 0
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Solve ", A.math(`x + \\frac{${prod}}{x} = ${sum}`), "."],
              ask: "Give the larger solution.",
            },
          ],
          answer: A.number(big),
          wrong: signedWrongs(big, [
            {
              code: "ALG.SOLVE.BOTH-SIDES",
              value: A.number(sum - prod),
              feedback: "Multiply every term by x first: x² + … = …x.",
            },
          ]),
          solution: [
            {
              say: "Multiply by x and rearrange: ",
              math: `${poly([1, -sum, prod])} = 0 \\Rightarrow x = ${p.r} \\text{ or } x = ${p.s}`,
            },
          ],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Olu solves ", A.math(`x^2 + ${p.k} = ${p.k + 1}x`), "."],
          lines: [
            [A.math(`x^2 + ${p.k + 1}x + ${p.k} = 0`)],
            [A.math(`(x + 1)(x + ${p.k}) = 0`)],
            [A.math(`x = -1 \\text{ or } x = -${p.k}`)],
          ],
          mistake: 0,
          code: "ALG.SOLVE.BOTH-SIDES",
          feedback: `Subtracting ${p.k + 1}x gives x² − ${p.k + 1}x + ${p.k} = 0, so x = 1 or x = ${p.k}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === Math.max(p.r, p.s);
    return true;
  },
});
