/**
 * @statement GF-A6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A6: Know the difference between an equation and an identity; argue mathematically to show
// algebraic expressions are equivalent, and use algebra to support and construct arguments
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  a: number;
  b: number;
  claim: number;
}

const CLAIMS: { latex: string; truth: boolean; why: string; code?: string }[] = [
  {
    latex: "x + x \\equiv x^2",
    truth: false,
    why: "x + x = 2x. For x = 3, 3 + 3 = 6 but 3² = 9.",
    code: "ALG.LIKE-TERMS.UNLIKE",
  },
  {
    latex: "(x + 1)^2 \\equiv x^2 + 2x + 1",
    truth: true,
    why: "Expanding (x + 1)(x + 1) gives x² + x + x + 1.",
  },
  {
    latex: "2(x + 4) \\equiv 2x + 4",
    truth: false,
    why: "Both terms are multiplied by 2: 2x + 8.",
    code: "ALG.EXPAND.FIRST-ONLY",
  },
];

export default defineGenerator<Params>({
  id: "GF-A6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EQUATION.IDENTITY", "ALG.EXPAND.FIRST-ONLY", "ALG.LIKE-TERMS.UNLIKE"],

  params(rng) {
    return {
      k: rng.int(2, 9),
      a: rng.int(2, 9),
      b: rng.int(2, 9),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const identity = `${p.k}(x + ${p.a}) = ${p.k}x + ${p.k * p.a}`;
        const equations = [`${p.k}x + ${p.a} = ${p.k * 2 + p.a}`, `x^2 = ${p.a * p.a}`];
        return A.choice({
          rng,
          question: "Which of these is an identity, true for every value of x?",
          correct: A.math(identity),
          distractors: equations.map((e) => ({
            content: A.math(e),
            code: "ALG.EQUATION.IDENTITY",
            feedback: "That is only true for particular values of x, so it is an equation.",
          })),
          solution: [
            {
              say: `Expanding ${p.k}(x + ${p.a}) always gives ${p.k}x + ${p.k * p.a}, whatever x is.`,
            },
          ],
        });
      }
      case 2:
        return A.missingValue({
          intro: "This is an identity. Find the missing number.",
          relation: [`${p.a}(x + ${p.b}) + ${p.k}x \\equiv ${p.a + p.k}x +`, p.a * p.b],
          hide: 1,
          wrong: wrongs(p.a * p.b, [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.number(p.b),
              feedback: `Multiply both terms in the bracket by ${p.a}.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.a}x + ${p.a * p.b} + ${p.k}x = ${p.a + p.k}x + ${p.a * p.b}` },
          ],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: ["Is this an identity? ", A.math(c.latex)],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. It works for one value of x, so it is an identity.`,
              code: "ALG.EQUATION.IDENTITY",
            },
            {
              text: `${c.truth ? "False" : "True"}. Any statement with ≡ is true.`,
              code: "ALG.EQUATION.IDENTITY",
            },
          ],
          solution: [
            {
              say: "To show an identity, simplify one side into the other. One counterexample disproves it.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "missing-value") return numberAnswer(question) === p.a * p.b;
    if (question.archetype === "standard") return chosenText(question).includes("(x +");
    return true;
  },
});
