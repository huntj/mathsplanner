/**
 * @statement FM-CP-21
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-21: Differentiate inverse trig functions; integrate to give inverse trig functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-21",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.INVERSE-TRIG", "CALC.CHAIN"],

  params(rng) {
    return { a: rng.int(2, 7), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Find the exact value of ",
            A.math(`\\int_0^{${p.a}} \\frac{1}{${p.a * p.a} + x^2}\\,dx`),
            ".",
          ],
          answer: A.exact(`\\frac{\\pi}{${4 * p.a}}`),
          wrong: [
            {
              code: "CALC.INVERSE-TRIG",
              value: A.exact("\\frac{\\pi}{4}"),
              feedback: `∫1/(a² + x²) dx = (1/a) arctan(x/a): keep the factor 1/${p.a}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\left[\\frac{1}{${p.a}}\\arctan\\frac{x}{${p.a}}\\right]_0^{${p.a}} = \\frac{1}{${p.a}} \\times \\frac{\\pi}{4} = \\frac{\\pi}{${4 * p.a}}`,
            },
          ],
        });
      case 2: {
        const k2 = p.k * p.k;
        const right = `\\frac{${p.k}}{\\sqrt{1 - ${k2}x^2}}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Differentiate ", A.math(`y = \\arcsin(${p.k}x)`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\frac{1}{\\sqrt{1 - ${k2}x^2}}`),
              code: "CALC.CHAIN",
              feedback: `Use the chain rule: multiply by the derivative of ${p.k}x.`,
            },
            {
              content: A.math(`\\frac{${p.k}}{1 + ${k2}x^2}`),
              code: "CALC.INVERSE-TRIG",
              feedback: "That is the derivative of arctan(kx).",
            },
          ],
          solution: [{ say: "d/dx arcsin u = u′/√(1 − u²): ", math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Max says ",
            A.math(
              `\\int \\frac{1}{\\sqrt{${p.a * p.a} - x^2}}\\,dx = \\arcsin\\left(\\frac{x}{${p.a * p.a}}\\right) + c`,
            ),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. ∫1/√(a² − x²) dx = arcsin(x/a) + c, and here a = ${p.a}, so it is arcsin(x/${p.a}) + c.`,
              correct: true,
            },
            {
              text: `True. Divide x by the number under the square root, ${p.a * p.a}.`,
              code: "CALC.INVERSE-TRIG",
            },
            { text: "False. The answer is arctan, not arcsin.", code: "CALC.INVERSE-TRIG" },
          ],
          solution: [
            {
              say: `Check by differentiating arcsin(x/${p.a}): (1/${p.a}) / √(1 − x²/${p.a * p.a}) = 1/√(${p.a * p.a} − x²).`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === `\\frac{\\pi}{${4 * p.a}}`;
    if (question.key.depth === 2)
      return chosenText(question) === `\\frac{${p.k}}{\\sqrt{1 - ${p.k * p.k}x^2}}`;
    return true;
  },
});
