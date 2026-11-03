/**
 * @statement GH-N8.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-N8.c: Rationalise denominators
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  c: number;
}

const simple = (p: Params) => Surd.from(p.a).div(Surd.term(1, p.b));
const conj = (p: Params) => Surd.from(p.a).div(Surd.from(p.c).add(Surd.term(1, p.b)));

export default defineGenerator<Params>({
  id: "GH-N8.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SURD.RATIONALISE"],

  params(rng) {
    return { a: rng.int(1, 12), b: rng.pick([2, 3, 5, 6, 7, 10, 11]), c: rng.int(1, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Rationalise the denominator of ",
            A.math(`\\frac{${p.a}}{\\sqrt{${p.b}}}`),
            ".",
          ],
          answer: A.exact(simple(p), "rationalised"),
          wrong: [
            {
              code: "NPV.SURD.RATIONALISE",
              value: A.exact(Surd.from(p.a).div(Surd.from(p.b))),
              feedback: `Multiply the top by √${p.b} as well as the bottom.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.a}}{\\sqrt{${p.b}}} \\times \\frac{\\sqrt{${p.b}}}{\\sqrt{${p.b}}} = ${toLatex(simple(p))}`,
            },
          ],
        });
      case 2: {
        const wrong = Surd.from(p.a)
          .mul(Surd.from(p.c).add(Surd.term(1, p.b)))
          .div(Surd.from(p.c * p.c - p.b));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Rationalise the denominator of ",
                A.math(`\\frac{${p.a}}{${p.c} + \\sqrt{${p.b}}}`),
                ".",
              ],
            },
          ],
          answer: A.exact(conj(p), "rationalised"),
          wrong: [
            {
              code: "NPV.SURD.RATIONALISE",
              value: A.exact(wrong),
              feedback: `Multiply top and bottom by ${p.c} − √${p.b}, which changes the sign of the root.`,
            },
          ],
          solution: [
            {
              say: `Multiply top and bottom by ${p.c} − √${p.b}; the bottom becomes ${p.c * p.c} − ${p.b} = ${p.c * p.c - p.b}: `,
              math: toLatex(conj(p)),
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "To rationalise ",
                A.math(`\\frac{1}{${p.c} + \\sqrt{${p.b}}}`),
                ", Ali multiplies the top and bottom by ",
                A.math(`${p.c} + \\sqrt{${p.b}}`),
                ".",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. That leaves a surd in the denominator. Multiply by ${p.c} − √${p.b}, so the bottom becomes ${p.c}² − ${p.b} = ${p.c * p.c - p.b}.`,
                  correct: true,
                },
                {
                  text: "True. Multiply by the denominator to clear it.",
                  code: "NPV.SURD.RATIONALISE",
                },
                {
                  text: `True. Only the √${p.b} needs to be squared.`,
                  code: "NPV.SURD.RATIONALISE",
                },
              ],
              solution: [
                {
                  say: "",
                  math: `(${p.c} + \\sqrt{${p.b}})(${p.c} - \\sqrt{${p.b}}) = ${p.c * p.c - p.b}`,
                },
              ],
            }),
          [
            {
              statement:
                "To rationalise $\\frac{3}{\\sqrt{5}}$, Gus multiplies top and bottom by $\\sqrt{5}$ to get $\\frac{3\\sqrt{5}}{5}$.",
              truth: true,
              right: "True. √5 × √5 = 5, a whole number.",
              wrong: [
                ["False. Multiply by 5.", "NPV.SURD.RATIONALISE"],
                ["False. The answer is 3/5."],
              ],
            },
            {
              claim: "$(a + \\sqrt{b})(a - \\sqrt{b})$ has no surd in it.",
              truth: "always",
              right: "Always. It equals a² − b.",
              wrong: [
                ["Never. The surds stay.", "NPV.SURD.RATIONALISE"],
                ["Sometimes. Only if a = b."],
              ],
            },
            {
              statement:
                "To rationalise $\\frac{1}{2 - \\sqrt{3}}$, Bea multiplies top and bottom by $2 - \\sqrt{3}$.",
              truth: false,
              right: "False. Multiply by 2 + √3, so the bottom becomes 4 − 3 = 1.",
              wrong: [
                ["True. Multiply by the bottom.", "NPV.SURD.RATIONALISE"],
                ["True. Squaring the bottom removes the root.", "NPV.SURD.RATIONALISE"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(simple(p));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(conj(p));
    return true;
  },
});
