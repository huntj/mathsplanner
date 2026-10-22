/**
 * @statement FM-CP-18
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-18: Find the mean value of a function
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  c: number;
  b: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-18",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.MEAN-VALUE"],

  params(rng) {
    return { c: 3 * rng.int(1, 3), b: rng.int(2, 6), h: 2 * rng.int(1, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const integral = (p.c * p.b ** 3) / 3;
        const mean = (p.c * p.b ** 2) / 3;
        return A.standard({
          question: [
            "Find the mean value of ",
            A.math(`f(x) = ${p.c}x^2`),
            " for ",
            A.math(`0 \\le x \\le ${p.b}`),
            ".",
          ],
          answer: A.number(mean),
          wrong: wrongs(mean, [
            {
              code: "CALC.MEAN-VALUE",
              value: A.number(integral),
              feedback: `That is the integral. Divide by the width of the interval, ${p.b}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{${p.b}}\\int_0^{${p.b}} ${p.c}x^2\\,dx = \\frac{1}{${p.b}} \\times ${integral} = ${mean}`,
            },
          ],
        });
      }
      case 2: {
        const mean = p.h ** 3 / 4;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the mean value of ",
                A.math("f(x) = x^3"),
                " over the interval ",
                A.math(`[0, ${p.h}]`),
                ".",
              ],
            },
            {
              question: [
                "Work out the mean value of ",
                A.math("x^3"),
                " for ",
                A.math(`0 \\le x \\le ${p.h}`),
                ".",
              ],
            },
          ],
          answer: A.number(mean),
          wrong: wrongs(mean, [
            {
              code: "CALC.MEAN-VALUE",
              value: A.number(p.h ** 3 / 2),
              feedback:
                "Averaging the end values only works for straight lines. Integrate and divide by the width.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{${p.h}}\\left[\\frac{x^4}{4}\\right]_0^{${p.h}} = \\frac{${p.h ** 4 / 4}}{${p.h}} = ${mean}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jo says the mean value of a function over ",
            A.math("[a, b]"),
            " is always ",
            A.math("\\frac{f(a) + f(b)}{2}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The mean value is (1/(b − a))∫f(x) dx. Averaging the end values only works when f is linear.",
              correct: true,
            },
            {
              text: "True. A mean is the average of the first and last values.",
              code: "CALC.MEAN-VALUE",
            },
            {
              text: "True. Both give the height of a rectangle with the same area.",
              code: "CALC.MEAN-VALUE",
            },
          ],
          solution: [
            {
              say: `For x² on [0, ${p.b}]: the mean value is ${p.b ** 2}/3, but the end-value average is ${p.b ** 2 / 2}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.c * p.b ** 2) / 3;
    if (question.key.depth === 2) return numberAnswer(question) === p.h ** 3 / 4;
    return true;
  },
});
