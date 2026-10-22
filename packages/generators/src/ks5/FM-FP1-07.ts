/**
 * @statement FM-FP1-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-07: Solve differential equations numerically using Euler's method and the midpoint method; use
// Simpson's rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  x0: number;
  y0: number;
  h: number;
  k: number;
}

const euler = (p: Params) => round(p.y0 + p.h * (p.x0 * p.x0 + p.y0), 4);
const simpson = (p: Params, w = 4) => {
  const f = (x: number) => p.k / x;
  return round((p.h / 3) * (f(1) + w * f(1 + p.h) + f(1 + 2 * p.h)), 4);
};

export default defineGenerator<Params>({
  id: "FM-FP1-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.NUMERICAL"],

  params(rng) {
    return { x0: rng.int(0, 3), y0: rng.int(1, 6), h: rng.pick([0.1, 0.2, 0.5]), k: rng.int(1, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = euler(p);
        return A.standard({
          question: [
            "Given ",
            A.math("\\frac{dy}{dx} = x^2 + y"),
            " and ",
            A.math(`y = ${p.y0}`),
            " when ",
            A.math(`x = ${p.x0}`),
            ", use one step of Euler's method with step length ",
            A.math(String(p.h)),
            " to estimate y when ",
            A.math(`x = ${round(p.x0 + p.h, 1)}`),
            ".",
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "CALC.NUMERICAL",
              value: A.number(round(p.y0 + p.x0 * p.x0 + p.y0, 4), { accuracy: { dp: 4 } }),
              feedback: `y₁ = y₀ + h × f(x₀, y₀): multiply the gradient by h = ${p.h}.`,
            },
          ]),
          solution: [
            { say: "", math: `y_1 = ${p.y0} + ${p.h} \\times (${p.x0}^2 + ${p.y0}) = ${v}` },
          ],
        });
      }
      case 2: {
        const v = simpson(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use Simpson's rule with 2 strips to estimate ",
                A.math(`\\int_1^{${round(1 + 2 * p.h, 1)}} \\frac{${p.k}}{x}\\,dx`),
                ".",
              ],
              ask: "Give your answer to 4 decimal places.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "CALC.NUMERICAL",
              value: A.number(simpson(p, 2), { accuracy: { dp: 4 } }),
              feedback: "Simpson's rule weights the ordinates 1, 4, 1 for two strips.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${p.h}}{3}\\left(f(1) + 4f(${round(1 + p.h, 1)}) + f(${round(1 + 2 * p.h, 1)})\\right) = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Gil says Simpson's rule can be used with 5 strips."],
          truth: false,
          reasons: [
            {
              text: "False. Simpson's rule fits a parabola to each pair of strips, so it needs an even number of strips (an odd number of ordinates).",
              correct: true,
            },
            {
              text: "True. Any number of strips works, as with the trapezium rule.",
              code: "CALC.NUMERICAL",
            },
            { text: "True. It needs an odd number of strips.", code: "CALC.NUMERICAL" },
          ],
          solution: [{ say: "The weights 1, 4, 2, 4, …, 4, 1 only fit an even number of strips." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === euler(p);
    if (question.key.depth === 2) return numberAnswer(question) === simpson(p);
    return true;
  },
});
