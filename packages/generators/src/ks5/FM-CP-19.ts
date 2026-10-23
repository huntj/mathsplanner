/**
 * @statement FM-CP-19
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-19: Find volumes of revolution about the x- and y-axes, including in modelling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { piLatex } from "../shared/trig.ts";

export interface Params {
  c: number;
  b: number;
  h: number;
}

/** (num/den)π as LaTeX. */
const piOf = (num: number, den: number) => piLatex((180 * num) / den);

export default defineGenerator<Params>({
  id: "FM-CP-19",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.VOLUME"],

  params(rng) {
    return { c: rng.int(1, 4), b: 2 * rng.int(1, 3), h: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // π∫ c²x dx from 0 to b = πc²b²/2
        const v = piOf(p.c * p.c * p.b * p.b, 2);
        return A.standard({
          question: [
            "The region between ",
            A.math(`y = ${p.c === 1 ? "" : p.c}\\sqrt{x}`),
            ", the x-axis and ",
            A.math(`x = ${p.b}`),
            " is rotated through 360° about the x-axis.",
          ],
          ask: "Find the exact volume of the solid formed.",
          answer: A.exact(v),
          wrong: [
            {
              code: "CALC.VOLUME",
              value: A.exact(String((p.c * p.c * p.b * p.b) / 2)),
              feedback: "V = π∫y² dx: keep the factor π.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\pi\\int_0^{${p.b}} ${p.c * p.c === 1 ? "" : p.c * p.c}x\\,dx = \\pi\\left[\\frac{${p.c * p.c === 1 ? "" : p.c * p.c}x^2}{2}\\right]_0^{${p.b}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        // About the y-axis: π∫ x² dy = π∫ y dy from 0 to h = πh²/2
        const v = piOf(p.h * p.h, 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The region between ",
                A.math("y = x^2"),
                ", the y-axis and ",
                A.math(`y = ${p.h}`),
                " is rotated through 360° about the y-axis.",
              ],
              ask: "Find the exact volume of the solid formed.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "CALC.VOLUME",
              value: A.exact(piOf(p.h ** 3, 3)),
              feedback: "About the y-axis, V = π∫x² dy, and x² = y here.",
            },
          ],
          solution: [
            { say: "", math: `\\pi\\int_0^{${p.h}} x^2\\,dy = \\pi\\int_0^{${p.h}} y\\,dy = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says the volume formed by rotating ",
            A.math("y = f(x)"),
            " about the x-axis is ",
            A.math("\\pi\\int_a^b y\\,dx"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Each slice is a disc of radius y, with area πy², so V = π∫y² dx.",
              correct: true,
            },
            { text: "True. Multiply the area under the curve by π.", code: "CALC.VOLUME" },
            { text: "True. It is 2π times the area under the curve.", code: "CALC.VOLUME" },
          ],
          solution: [{ say: "A thin disc of radius y and thickness δx has volume πy²δx." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === piOf(p.c * p.c * p.b * p.b, 2);
    if (question.key.depth === 2) return exactAnswer(question) === piOf(p.h * p.h, 2);
    return true;
  },
});
