/**
 * @statement AL-P7.1b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.1b: Use second derivatives for convex and concave sections and points of inflection;
// differentiate sin x and cos x from first principles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
  k: number;
  atPlus: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P7.1b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.SECOND-DERIVATIVE"],

  params(rng) {
    const p = rng.int(-4, 5);
    const q = rng.int(-6, 6);
    if (p === 0 || q === 0) reject("both terms present");
    return { p, q, k: rng.int(1, 4), atPlus: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Find ",
            A.math("\\frac{d^2y}{dx^2}"),
            " for ",
            A.math(`y = ${poly([p.p, p.q, 0, 0])}`),
            ".",
          ],
          answer: A.exact(poly([6 * p.p, 2 * p.q])),
          wrong: [
            {
              code: "CALC.SECOND-DERIVATIVE",
              value: A.exact(poly([3 * p.p, 2 * p.q, 0])),
              feedback: "That is dy/dx. Differentiate again.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{dy}{dx} = ${poly([3 * p.p, 2 * p.q, 0])},\\quad \\frac{d^2y}{dx^2} = ${poly([6 * p.p, 2 * p.q])}`,
            },
          ],
        });
      case 2: {
        const x = p.atPlus ? p.k : -p.k;
        const nature = x > 0 ? "minimum" : "maximum";
        const other = x > 0 ? "maximum" : "minimum";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The curve ",
            A.math(`y = x^3 - ${3 * p.k * p.k}x`),
            " has a stationary point where ",
            A.math(`x = ${x}`),
            ".",
          ],
          ask: "Use the second derivative to decide its nature.",
          correct: `A ${nature}, because d²y/dx² = ${6 * x} is ${x > 0 ? "positive" : "negative"}.`,
          distractors: [
            {
              content: `A ${other}, because d²y/dx² = ${6 * x} is ${x > 0 ? "positive" : "negative"}.`,
              code: "CALC.SECOND-DERIVATIVE",
              feedback:
                "A positive second derivative means the curve is concave up (∪): a minimum.",
            },
            {
              content: "A point of inflection, because dy/dx = 0.",
              code: "CALC.SECOND-DERIVATIVE",
              feedback:
                "dy/dx = 0 at every stationary point; the sign of d²y/dx² decides which kind.",
            },
          ],
          solution: [
            {
              say: `d²y/dx² = 6x = ${6 * x} at x = ${x}: ${x > 0 ? "positive, so a minimum" : "negative, so a maximum"}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "For ",
            A.math("y = x^4"),
            ", Sam finds that ",
            A.math("\\frac{d^2y}{dx^2} = 0"),
            " at x = 0 and says (0, 0) must be a point of inflection.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A point of inflection needs the second derivative to change sign. 12x² is positive on both sides of 0, so (0, 0) is a minimum.",
              correct: true,
            },
            {
              text: "True. f″(x) = 0 always means a point of inflection.",
              code: "CALC.SECOND-DERIVATIVE",
            },
            { text: "True. The curve is flat there." },
          ],
          solution: [{ say: "Check the sign of f″ either side; f″ = 0 alone is not enough." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return chosenText(question).startsWith(
        `A ${(p.atPlus ? p.k : -p.k) > 0 ? "minimum" : "maximum"}`,
      );
    return true;
  },
});
