/**
 * @statement AL-P2.8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.8: Understand functions: domain and range, composite and inverse functions and their graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, signed } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

export interface Params {
  h: number;
  k: number;
  a: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "ALG.FUNCTION.DOMAIN-RANGE",
    "ALG.QUADRATIC.TURNING",
    "ALG.FUNCTION.ORDER",
    "ALG.INVERSE.RECIPROCAL",
    "ALG.TRANSFORM.DIRECTION",
  ],

  params(rng) {
    const h = rng.int(-5, 5);
    const k = rng.int(-6, 6);
    if (h === 0 || k === 0 || h === k) reject("a turning point off the axes");
    return { h, k, a: rng.int(1, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The function f is defined by ",
            A.math(`f(x) = ${bracket(-p.h)}^2 ${signed(p.k)},\\ x \\in \\mathbb{R}`),
            ".",
          ],
          ask: "What is the range of f?",
          correct: A.math(`f(x) \\ge ${p.k}`),
          distractors: [
            {
              content: A.math(`x \\ge ${p.h}`),
              code: "ALG.FUNCTION.DOMAIN-RANGE",
              feedback: "The range is the set of output values, f(x), not values of x.",
            },
            {
              content: A.math(`f(x) \\ge ${p.h}`),
              code: "ALG.FUNCTION.DOMAIN-RANGE",
              feedback: `The smallest output is at the turning point (${p.h}, ${p.k}): it is the y-value.`,
            },
            {
              content: A.math(`f(x) \\le ${p.k}`),
              code: "ALG.QUADRATIC.TURNING",
              feedback: "A positive square makes this a U shape with a minimum, not a maximum.",
            },
          ],
          solution: [
            {
              say: `The square is never negative, so f(x) is smallest, ${p.k}, when x = ${p.h}: f(x) ≥ ${p.k}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The function f is defined by ",
            A.math(`f(x) = \\sqrt{x - ${p.a}},\\ x \\ge ${p.a}`),
            ".",
          ],
          ask: "Which describes the inverse function?",
          correct: A.math(`f^{-1}(x) = x^2 + ${p.a},\\ x \\ge 0`),
          distractors: [
            {
              content: A.math(`f^{-1}(x) = x^2 + ${p.a},\\ x \\ge ${p.a}`),
              code: "ALG.FUNCTION.DOMAIN-RANGE",
              feedback:
                "The domain of the inverse is the range of f: √ is never negative, so x ≥ 0.",
            },
            {
              content: A.math(`f^{-1}(x) = x^2 - ${p.a},\\ x \\ge 0`),
              code: "ALG.FUNCTION.ORDER",
              feedback: `Undo the steps in reverse: square, then add ${p.a}.`,
            },
            {
              content: A.math(`f^{-1}(x) = \\frac{1}{\\sqrt{x - ${p.a}}}`),
              code: "ALG.INVERSE.RECIPROCAL",
              feedback: "The inverse undoes f; it is not its reciprocal.",
            },
          ],
          solution: [
            {
              say: `y = √(x − ${p.a}) ⇒ x = y² + ${p.a}. The range of f is f(x) ≥ 0, which becomes the domain of the inverse.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Dan says the graph of ",
            A.math("y = f^{-1}(x)"),
            " is the reflection of the graph of ",
            A.math("y = f(x)"),
            " in the x-axis.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The inverse swaps x and y, which reflects the graph in the line y = x.",
              correct: true,
            },
            {
              text: "True. The inverse makes every output negative.",
              code: "ALG.TRANSFORM.DIRECTION",
            },
            { text: "False. It is the reflection in the y-axis.", code: "ALG.TRANSFORM.DIRECTION" },
          ],
          solution: [
            {
              say: "If (a, b) is on y = f(x), then (b, a) is on y = f⁻¹(x): a reflection in y = x.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(`f(x) \\ge ${p.k}`);
    return true;
  },
});
