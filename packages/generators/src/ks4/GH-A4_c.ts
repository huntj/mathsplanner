/**
 * @statement GH-A4.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A4.c: Simplify algebraic fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, poly } from "../shared/alg.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GH-A4.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FRACTION.CANCEL-TERMS", "ALG.FACTORISE.SIGNS"],

  params(rng) {
    const p = { a: rng.int(-7, 8), b: rng.int(-7, 8), k: rng.int(2, 9) };
    if (p.a === 0 || p.b === 0 || p.a === p.b || p.a + p.b === 0) reject("two different factors");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const lin = (c: number) =>
      linear([
        [1, "x"],
        [c, ""],
      ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Simplify ",
            A.math(`\\frac{${poly([1, p.a + p.b, p.a * p.b])}}{${lin(p.a)}}`),
            ".",
          ],
          answer: A.exact(lin(p.b)),
          wrong: [
            {
              code: "ALG.FRACTION.CANCEL-TERMS",
              value: A.exact(lin(p.a)),
              feedback: "Factorise the top first, then cancel the common bracket.",
            },
          ],
          solution: [
            { say: "", math: `\\frac{(${lin(p.a)})(${lin(p.b)})}{${lin(p.a)}} = ${lin(p.b)}` },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Simplify fully ",
                A.math(`\\frac{x^2 - ${p.k * p.k}}{x^2 + ${p.k}x}`),
                ".",
              ],
            },
          ],
          answer: A.exact(`\\frac{x - ${p.k}}{x}`),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`\\frac{x + ${p.k}}{x}`),
              feedback: `x² − ${p.k * p.k} = (x − ${p.k})(x + ${p.k}); the (x + ${p.k}) cancels.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{(x - ${p.k})(x + ${p.k})}{x(x + ${p.k})} = \\frac{x - ${p.k}}{x}`,
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Rob says ", A.math(`\\frac{x + ${2 * p.k}}{x + ${p.k}} = 2`), "."],
              truth: false,
              reasons: [
                {
                  text: `False. Only common factors cancel, not terms. Try x = 1: ${1 + 2 * p.k}/${1 + p.k} is not 2.`,
                  correct: true,
                },
                {
                  text: `True. Cancel the x's and ${2 * p.k} ÷ ${p.k} = 2.`,
                  code: "ALG.FRACTION.CANCEL-TERMS",
                },
                { text: "True. The top is twice the bottom.", code: "ALG.FRACTION.CANCEL-TERMS" },
              ],
              solution: [
                {
                  say: `x + ${2 * p.k} has no factor of x + ${p.k}, so the fraction does not simplify.`,
                },
              ],
            }),
          [
            {
              statement: "Bea simplifies $\\frac{x^2 - 9}{x - 3}$ to $x + 3$.",
              truth: true,
              right: "True. x² − 9 = (x + 3)(x − 3), and x − 3 cancels (for x ≠ 3).",
              wrong: [
                ["False. It is x − 3.", "ALG.FACTORISE.SIGNS"],
                ["False. It is x² − 3.", "ALG.FRACTION.CANCEL-TERMS"],
              ],
            },
            {
              claim:
                "You can cancel a factor that multiplies the whole numerator and the whole denominator.",
              truth: "always",
              right: "Always, if it is not zero. Common factors cancel; separate terms do not.",
              wrong: [
                ["Never. Nothing cancels in algebra.", "ALG.FRACTION.CANCEL-TERMS"],
                ["Sometimes. Any matching term can go.", "ALG.FRACTION.CANCEL-TERMS"],
              ],
            },
            {
              statement: "Kai simplifies $\\frac{2x + 6}{2}$ to $x + 6$.",
              truth: false,
              right: "False. Both terms divide by 2: x + 3.",
              wrong: [
                ["True. Cancel the 2s.", "ALG.FRACTION.CANCEL-TERMS"],
                ["True. Only the first term is divided.", "ALG.FRACTION.CANCEL-TERMS"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return (
        a?.type === "exact" &&
        a.value ===
          linear([
            [1, "x"],
            [p.b, ""],
          ])
      );
    return true;
  },
});
