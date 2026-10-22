/**
 * @statement AL-P6.7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.7: Use log graphs to estimate parameters in y = axⁿ and y = kbˣ
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  n: number;
  k: number;
  b: number;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "AL-P6.7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LOG.GRAPH"],

  params(rng) {
    return { a: rng.int(2, 9), n: rng.int(2, 4), k: rng.int(2, 9), b: rng.pick([2, 3, 4, 5]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = r3(Math.log10(p.a));
        return A.standard({
          question: [
            "Data that fit ",
            A.math("y = ax^n"),
            " give a straight line when ",
            A.math("\\log y"),
            " is plotted against ",
            A.math("\\log x"),
            `. The line has gradient ${p.n} and meets the vertical axis at ${c}.`,
          ],
          ask: "Estimate the value of a, to the nearest whole number.",
          answer: A.number(p.a, { accuracy: { dp: 0 } }),
          wrong: wrongs(p.a, [
            {
              code: "ALG.LOG.GRAPH",
              value: A.number(p.n, { accuracy: { dp: 0 } }),
              feedback: "The gradient is n. The intercept is log a, so a = 10^intercept.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\log y = \\log a + n\\log x \\Rightarrow \\log a = ${c} \\Rightarrow a = 10^{${c}} \\approx ${p.a}`,
            },
          ],
        });
      }
      case 2: {
        const g = r3(Math.log10(p.b));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Data that fit ",
                A.math("y = kb^x"),
                " give a straight line when ",
                A.math("\\log y"),
                " is plotted against x",
                `. The line has gradient ${g} and meets the vertical axis at ${r3(Math.log10(p.k))}.`,
              ],
              ask: "Estimate the value of b, to the nearest whole number.",
            },
          ],
          answer: A.number(p.b, { accuracy: { dp: 0 } }),
          wrong: wrongs(p.b, [
            {
              code: "ALG.LOG.GRAPH",
              value: A.number(p.k, { accuracy: { dp: 0 } }),
              feedback: "The intercept gives log k. The gradient is log b, so b = 10^gradient.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\log y = \\log k + x\\log b \\Rightarrow \\log b = ${g} \\Rightarrow b = 10^{${g}} \\approx ${p.b}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "For data that fit ",
            A.math("y = ax^n"),
            ", Tia says the gradient of the graph of ",
            A.math("\\log y"),
            " against ",
            A.math("\\log x"),
            " is a.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. log y = log a + n log x: the gradient is n, and the intercept is log a.",
              correct: true,
            },
            { text: "True. a multiplies x, so it is the gradient.", code: "ALG.LOG.GRAPH" },
            { text: "False. The gradient is log a.", code: "ALG.LOG.GRAPH" },
          ],
          solution: [{ say: "Take logs of both sides and compare with Y = mX + c." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a;
    if (question.key.depth === 2) return numberAnswer(question) === p.b;
    return true;
  },
});
