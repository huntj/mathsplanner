/**
 * @statement FM-FP1-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-06: Solve differential equations using Taylor series and by reducing them with a substitution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";

export interface Params {
  k: number;
  a: number;
}

/** For dy/dx = x + y², y(0) = k: y'(0) = k², y''(0) = 1 + 2k·k². */
const coeff2 = (k: number) => toLatex(frac(1 + 2 * k ** 3, 2));

export default defineGenerator<Params>({
  id: "FM-FP1-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.TAYLOR", "CALC.SUBSTITUTION"],

  params(rng) {
    return { k: rng.int(1, 3), a: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Given that ",
            A.math("\\frac{dy}{dx} = x + y^2"),
            " and ",
            A.math(`y = ${p.k}`),
            " when ",
            A.math("x = 0"),
            ",",
          ],
          ask: [
            "find the coefficient of ",
            A.math("x^2"),
            " in the Taylor series for y about x = 0.",
          ],
          answer: A.exact(coeff2(p.k)),
          wrong: [
            {
              code: "CALC.TAYLOR",
              value: A.exact(String(1 + 2 * p.k ** 3)),
              feedback: "That is y″(0). The coefficient of x² is y″(0)/2!.",
            },
          ],
          solution: [
            {
              say: `y′(0) = 0 + ${p.k}² = ${p.k ** 2}. Differentiating, y″ = 1 + 2yy′, so y″(0) = 1 + 2 × ${p.k} × ${p.k ** 2} = ${1 + 2 * p.k ** 3}.`,
            },
            {
              say: "The coefficient is ",
              math: `\\frac{${1 + 2 * p.k ** 3}}{2!} = ${coeff2(p.k)}`,
            },
          ],
        });
      case 2: {
        const right = `x\\frac{dv}{dx} = \\frac{${p.a}}{v}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Use the substitution ",
            A.math("y = vx"),
            " to transform ",
            A.math(`\\frac{dy}{dx} = \\frac{${p.a}x^2 + y^2}{xy}`),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\frac{dv}{dx} = \\frac{${p.a} + v^2}{v}`),
              code: "CALC.SUBSTITUTION",
              feedback: "dy/dx is not dv/dx: by the product rule, dy/dx = v + x dv/dx.",
            },
            {
              content: A.math(`x\\frac{dv}{dx} = \\frac{${p.a} + v^2}{v}`),
              code: "CALC.SUBSTITUTION",
              feedback: "Subtract the v from dy/dx = v + x dv/dx as well.",
            },
          ],
          solution: [
            {
              say: "",
              math: `v + x\\frac{dv}{dx} = \\frac{${p.a} + v^2}{v} \\Rightarrow ${right}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Fin says that if ",
            A.math("y = vx"),
            ", where v is a function of x, then ",
            A.math("\\frac{dy}{dx} = v"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. v depends on x, so by the product rule dy/dx = v + x dv/dx.",
              correct: true,
            },
            {
              text: "True. Differentiating vx with respect to x gives v.",
              code: "CALC.SUBSTITUTION",
            },
            { text: "True. x differentiates to 1.", code: "CALC.SUBSTITUTION" },
          ],
          solution: [{ say: "Only if v were a constant would dy/dx = v." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === coeff2(p.k);
    if (question.key.depth === 2)
      return chosenText(question) === `x\\frac{dv}{dx} = \\frac{${p.a}}{v}`;
    return true;
  },
});
