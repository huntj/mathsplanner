/**
 * @statement AL-P8.9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.9: Solve first-order separable differential equations, including particular solutions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  y0: number;
  k: number;
  a: number;
  b: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-P8.9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.SEPARABLE", "CALC.FTC"],

  params(rng) {
    return {
      y0: rng.int(2, 9),
      k: rng.pick([0.2, 0.3, 0.5, 0.7]),
      a: rng.int(2, 6),
      b: rng.int(2, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const y = r2(p.y0 * Math.exp(p.k));
        return A.standard({
          question: [
            "Solve ",
            A.math(`\\frac{dy}{dx} = ${p.k}y`),
            " given that ",
            A.math(`y = ${p.y0}`),
            " when ",
            A.math("x = 0"),
            ".",
          ],
          ask: "Find the value of y when x = 1, to 2 decimal places.",
          answer: A.number(y, { accuracy: { dp: 2 } }),
          wrong: wrongs(y, [
            {
              code: "CALC.SEPARABLE",
              value: A.number(r2(p.y0 + p.k), { accuracy: { dp: 2 } }),
              feedback: "Separate: ∫ dy/y = ∫ k dx gives ln y = kx + c, so y = Ae^(kx).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\ln y = ${p.k}x + c \\Rightarrow y = ${p.y0}e^{${p.k}x} \\Rightarrow y(1) = ${y}`,
            },
          ],
        });
      }
      case 2: {
        const y = r2(Math.sqrt(p.b * p.b + p.a * p.a));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math("\\frac{dy}{dx} = \\frac{x}{y}"),
                " given that ",
                A.math(`y = ${p.a}`),
                " when x = 0, with y > 0.",
              ],
              ask: `Find y when x = ${p.b}, to 2 decimal places.`,
            },
          ],
          answer: A.number(y, { accuracy: { dp: 2 } }),
          wrong: wrongs(y, [
            {
              code: "CALC.SEPARABLE",
              value: A.number(p.b, { accuracy: { dp: 2 } }),
              feedback: "∫ y dy = ∫ x dx gives y² = x² + c; use the starting values to find c.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tfrac{1}{2}y^2 = \\tfrac{1}{2}x^2 + c \\Rightarrow y^2 = x^2 + ${p.a * p.a} \\Rightarrow y = \\sqrt{${p.b * p.b + p.a * p.a}} = ${y}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mel says the general solution of ",
            A.math(`\\frac{dy}{dx} = ${2 * p.a}x`),
            " is ",
            A.math(`y = ${p.a}x^2`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The general solution includes the constant: y = ${p.a}x² + c, a family of curves.`,
              correct: true,
            },
            { text: "True. Integrate the right-hand side.", code: "CALC.FTC" },
            { text: "True. The constant is always zero.", code: "CALC.SEPARABLE" },
          ],
          solution: [
            {
              say: "A particular solution needs a condition such as a point the curve passes through.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.y0 * Math.exp(p.k));
    return true;
  },
});
