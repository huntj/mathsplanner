/**
 * @statement GF-A11.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A11.c: Deduce roots algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

const roots = (a: number, b: number) => `x = ${Math.min(a, b)} \\text{ or } x = ${Math.max(a, b)}`;

export default defineGenerator<Params>({
  id: "GF-A11.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.QUADRATIC.ONE-ROOT"],

  params(rng) {
    const p = { a: rng.int(-9, 9), b: rng.int(-9, 9), k: rng.int(2, 12) };
    if (p.a === 0 || p.b === 0 || p.a === p.b || p.a === -p.b)
      reject("two different non-zero roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = `${poly([1, -(p.a + p.b), p.a * p.b])} = 0`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Find the roots of ", A.math(eq), " by factorising."],
          correct: A.math(roots(p.a, p.b)),
          distractors: [
            {
              content: A.math(roots(-p.a, -p.b)),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "If (x − a)(x − b) = 0 then x = a or x = b: the signs change.",
            },
            {
              content: A.math(`x = ${p.a * p.b}`),
              code: "ALG.QUADRATIC.ONE-ROOT",
              feedback: "The constant term is the product of the roots, not a root.",
            },
          ],
          solution: [
            {
              say: "",
              math: `(x ${p.a < 0 ? "+" : "-"} ${Math.abs(p.a)})(x ${p.b < 0 ? "+" : "-"} ${Math.abs(p.b)}) = 0 \\Rightarrow ${roots(p.a, p.b)}`,
            },
          ],
        });
      case 2: {
        const big = Math.max(p.a, p.b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The curve ",
                A.math(`y = ${poly([1, -(p.a + p.b), p.a * p.b])}`),
                " crosses the x-axis twice.",
              ],
              ask: "Find the x-coordinate of the crossing point further to the right.",
            },
          ],
          answer: A.number(big),
          wrong: signedWrongs(big, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(-Math.min(p.a, p.b)),
              feedback:
                "Solve y = 0: the roots have the opposite signs to the numbers in the brackets.",
            },
          ]),
          solution: [{ say: "Set y = 0 and factorise: ", math: roots(p.a, p.b) }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Al solves ",
                A.math(`x^2 = ${p.k}x`),
                " by dividing both sides by x, and says the only root is ",
                A.math(`x = ${p.k}`),
                ".",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Dividing by x loses the root x = 0. Factorise instead: x(x − ${p.k}) = 0, so x = 0 or x = ${p.k}.`,
                  correct: true,
                },
                {
                  text: "True. A quadratic has only one positive root.",
                  code: "ALG.QUADRATIC.ONE-ROOT",
                },
                { text: `False. The root is x = −${p.k}.`, code: "ALG.QUADRATIC.ROOT-SIGN" },
              ],
              solution: [{ say: "Never divide both sides by an expression that could be 0." }],
            }),
          [
            {
              statement: "Ola solves $x^2 = 16$ and gets x = 4 or x = −4.",
              truth: true,
              right: "True. Both 4² and (−4)² are 16.",
              wrong: [
                ["False. Only x = 4.", "ALG.QUADRATIC.ONE-ROOT"],
                ["False. x = 8.", "ALG.QUADRATIC.ROOT-SIGN"],
              ],
            },
            {
              claim: "Dividing both sides of $x^2 = 5x$ by x can lose a solution.",
              truth: "always",
              right: "Always. It loses x = 0, which also solves x² = 5x.",
              wrong: [
                ["Never. Dividing is always safe.", "ALG.QUADRATIC.ONE-ROOT"],
                ["Sometimes. Only for big numbers."],
              ],
            },
            {
              statement: "Kim solves $(x - 3)(x + 2) = 0$ and says x = 3 only.",
              truth: false,
              right: "False. x + 2 = 0 also gives x = −2.",
              wrong: [
                ["True. Only the first bracket counts.", "ALG.QUADRATIC.ONE-ROOT"],
                ["True. Solutions are positive.", "ALG.QUADRATIC.ROOT-SIGN"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === roots(p.a, p.b);
    if (question.key.depth === 2) return numberAnswer(question) === Math.max(p.a, p.b);
    return true;
  },
});
