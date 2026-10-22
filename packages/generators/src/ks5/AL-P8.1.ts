/**
 * @statement AL-P8.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.1: Know the fundamental theorem of calculus
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signed } from "../shared/alg.ts";

interface Params {
  a: number;
  y1: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P8.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.FTC"],

  params(rng) {
    return { a: rng.int(1, 4), y1: rng.int(-5, 12), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // f'(x) = 3a x², so f(x) = a x³ + c with f(1) = a + c = y1.
        const c = p.y1 - p.a;
        const fx = `${p.a === 1 ? "" : p.a}x^3${c === 0 ? "" : ` ${signed(c)}`}`;
        return A.standard({
          question: [
            "A curve has gradient ",
            A.math(`f'(x) = ${3 * p.a}x^2`),
            " and passes through ",
            A.math(`(1, ${p.y1})`),
            ".",
          ],
          ask: "Find f(x).",
          answer: A.exact(`f(x) = ${fx}`),
          wrong: [
            {
              code: "CALC.FTC",
              value: A.exact(`f(x) = ${p.a === 1 ? "" : p.a}x^3`),
              feedback: `Integrating gives ${p.a}x³ + c; use the point (1, ${p.y1}) to find c.`,
            },
          ].filter(() => c !== 0),
          solution: [
            {
              say: "",
              math: `f(x) = ${p.a}x^3 + c;\\ f(1) = ${p.a} + c = ${p.y1} \\Rightarrow c = ${c}`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "If F is a function with ",
            A.math("F'(x) = f(x)"),
            ", which of these equals ",
            A.math("\\int_a^b f(x)\\,dx"),
            "?",
          ],
          correct: A.math("F(b) - F(a)"),
          distractors: [
            {
              content: A.math("F(a) - F(b)"),
              code: "CALC.FTC",
              feedback: "Upper limit minus lower limit.",
            },
            {
              content: A.math("f(b) - f(a)"),
              code: "CALC.FTC",
              feedback: "Use the integral F, not f itself.",
            },
            {
              content: A.math("f'(b) - f'(a)"),
              code: "CALC.FTC",
              feedback: "Integration undoes differentiation: use F, whose derivative is f.",
            },
          ],
          solution: [
            {
              say: "The fundamental theorem: integrate, then evaluate at the upper limit minus the lower limit.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? [
                "Ria says that if ",
                A.math("F'(x) = f(x)"),
                ", then ",
                A.math("\\int f(x)\\,dx = F(x) + c"),
                ".",
              ]
            : ["Ria says that ", A.math("\\int f'(x)\\,dx = f'(x) + c"), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. Integration is the reverse of differentiation, up to a constant.",
                  correct: true,
                },
                { text: "False. You must differentiate F again.", code: "CALC.FTC" },
                { text: "False. There is no constant.", code: "CALC.FTC" },
              ]
            : [
                {
                  text: "False. Integrating f′(x) undoes the differentiation: the result is f(x) + c.",
                  correct: true,
                },
                {
                  text: "True. Integration leaves the function unchanged apart from + c.",
                  code: "CALC.FTC",
                },
                { text: "True. You only add a constant.", code: "CALC.FTC" },
              ],
          solution: [{ say: "Differentiation and integration are inverse processes." }],
        });
    }
  },

  verify() {
    return true;
  },
});
