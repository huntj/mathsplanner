/**
 * @statement Y7-NPV-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-03.c: Calculate with proper and improper fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  c: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-03.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.DIVIDE.MULTIPLIES", "FR.MULTIPLY.ALWAYS-BIGGER"],

  params(rng) {
    const b = rng.int(3, 9);
    const p = { a: rng.int(1, b - 1), c: rng.int(2, b + 3), b, k: rng.int(2, 5) };
    if (p.a + p.c <= p.b || gcdOf(p.a, b) > 1)
      reject("an improper total and a simplified first fraction");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = (n: number, d: number) => `\\frac{${n}}{${d}}`;
    switch (depth) {
      case 1: {
        const v = frac(p.a + p.c, p.b);
        return A.standard({
          question: [
            "Work out ",
            A.math(`${f(p.a, p.b)} + ${f(p.c, p.b)}`),
            ". Give your answer as a fraction.",
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              value: A.exact(frac(p.a + p.c, 2 * p.b)),
              feedback: `The denominators are the same, so they stay as ${p.b}: add only the numerators.`,
            },
          ],
          solution: [{ say: "", math: `${f(p.a + p.c, p.b)} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const v = frac(p.a, p.b * p.k);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`${f(p.a, p.b)} \\div ${p.k}`), "."] },
            {
              question: [
                A.math(f(p.a, p.b)),
                ` of a pizza is shared equally between ${p.k} people.`,
              ],
              ask: "What fraction of the whole pizza does each person get?",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.DIVIDE.MULTIPLIES",
              value: A.exact(frac(p.a * p.k, p.b)),
              feedback: `Sharing between ${p.k} makes each part smaller: multiply the denominator by ${p.k}.`,
            },
          ],
          solution: [
            { say: "", math: `${f(p.a, p.b)} \\div ${p.k} = ${f(p.a, p.b * p.k)} = ${toLatex(v)}` },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [
                "Multiplying two proper fractions gives an answer smaller than both of them.",
              ],
              truth: "always",
              reasons: [
                {
                  text: `Always. Taking a part of a part leaves less than either: ${p.a}/${p.b} × ½ = ${p.a}/${2 * p.b}.`,
                  correct: true,
                },
                {
                  text: "Never. Multiplying always makes things bigger.",
                  code: "FR.MULTIPLY.ALWAYS-BIGGER",
                },
                { text: "Sometimes. Only when the denominators are the same." },
              ],
              solution: [
                { say: "Multiplying by a number less than 1 makes a positive number smaller." },
              ],
            }),
          [
            {
              statement: "Zak says $\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}$.",
              truth: false,
              right:
                "False. Use a common denominator: 3/6 + 2/6 = 5/6. And 2/5 is less than ½ on its own, so it cannot be right.",
              wrong: [
                ["True. Add the numerators and add the denominators.", "FR.ADD.TOPS-AND-BOTTOMS"],
                ["True. 1 + 1 = 2 and 2 + 3 = 5.", "FR.ADD.TOPS-AND-BOTTOMS"],
              ],
            },
            {
              statement: "Kay says $\\frac{1}{2} \\div \\frac{1}{4} = 2$.",
              truth: true,
              right: "True. Two quarters fit into a half, so ½ ÷ ¼ = 2.",
              wrong: [
                ["False. Dividing makes it smaller, so it is ⅛.", "FR.DIVIDE.MULTIPLIES"],
                ["False. It is ½, the other way round."],
              ],
            },
            {
              claim: "Dividing a positive number by a fraction gives a bigger answer.",
              truth: "sometimes",
              right:
                "Sometimes. 4 ÷ ½ = 8 is bigger, but 4 ÷ 3/2 = 8/3 is smaller. It is bigger when the fraction is less than 1.",
              wrong: [
                ["Always. Dividing by a fraction is multiplying.", "FR.DIVIDE.MULTIPLIES"],
                ["Never. Dividing always makes things smaller.", "FR.MULTIPLY.ALWAYS-BIGGER"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.a + p.c, p.b));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.a, p.b * p.k));
    return true;
  },
});
