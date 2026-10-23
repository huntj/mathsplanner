/**
 * @statement GF-A6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A6.a: Tell an equation from an identity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  k: number;
  a: number;
  m: number;
  identity: boolean;
}

const IDENTITY = "An identity: true for every value of x";
const EQUATION = "An equation: true only for a particular value of x";

export default defineGenerator<Params>({
  id: "GF-A6.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EQUATION.IDENTITY", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    const p = { k: rng.int(2, 6), a: rng.int(1, 9), m: rng.int(1, 5), identity: rng.bool() };
    if (p.m === p.k) reject("a different coefficient for the equation");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const lhs = `${p.k}(x + ${p.a})`;
    const expanded = linear([
      [p.k, "x"],
      [p.k * p.a, ""],
    ]);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which of these is an identity?"],
          correct: A.math(`${lhs} \\equiv ${expanded}`),
          distractors: [
            {
              content: A.math(`${lhs} = ${p.k * p.a + p.k}`),
              code: "ALG.EQUATION.IDENTITY",
              feedback: "This is only true when x = 1: it is an equation.",
            },
            {
              content: A.math(`${p.k}x + ${p.a} = ${p.k * p.a}`),
              code: "ALG.EQUATION.IDENTITY",
              feedback: "This is true for one value of x only: an equation.",
            },
          ],
          solution: [
            {
              say: "An identity is true for every value of the letter: expanding the left side gives exactly the right side.",
            },
          ],
        });
      case 2: {
        const rhs = p.identity
          ? expanded
          : linear([
              [p.m, "x"],
              [p.k * p.a + (p.k - p.m), ""],
            ]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Is ", A.math(`${lhs} = ${rhs}`), " an equation or an identity?"],
          correct: p.identity ? IDENTITY : EQUATION,
          distractors: [
            {
              content: p.identity ? EQUATION : IDENTITY,
              code: "ALG.EQUATION.IDENTITY",
              feedback: p.identity
                ? `Expand ${lhs}: it is exactly ${expanded}, for every x.`
                : `Expand ${lhs} to ${expanded}: the two sides differ, and are equal only when x = 1.`,
            },
          ],
          solution: [
            {
              say: p.identity
                ? `${lhs} = ${expanded} for every x.`
                : `${expanded} = ${rhs} only when x = 1.`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["For a number x, ", A.math(`(x + ${p.a})^2 = x^2 + ${p.a * p.a}`), "."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. (x + ${p.a})² = x² + ${2 * p.a}x + ${p.a * p.a}, which equals x² + ${p.a * p.a} only when x = 0. It is an equation, not an identity.`,
              correct: true,
            },
            {
              text: "Always. Square each term in the bracket.",
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
            },
            { text: "Never. The two sides can never be equal.", code: "ALG.EQUATION.IDENTITY" },
          ],
          solution: [{ say: "Test x = 0 (equal) and x = 1 (not equal)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return chosenText(question) === (p.identity ? IDENTITY : EQUATION);
    return true;
  },
});
