/**
 * @statement Y9-ALG-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-04.b: Find the intercept of a straight line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  m: number;
  c: number;
  x0: number;
  y0: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-04.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    const p = {
      m: rng.int(2, 6) * rng.pick([1, -1]),
      c: rng.int(-9, 9),
      x0: rng.int(1, 5),
      y0: rng.int(-6, 12),
    };
    if (p.c === 0 || Math.abs(p.c) === Math.abs(p.m) || p.y0 - p.m * p.x0 === p.y0 + p.m * p.x0)
      reject("values that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Where does the line ",
            A.math(`y = ${p.c} ${p.m < 0 ? "-" : "+"} ${Math.abs(p.m)}x`),
            " cross the y-axis?",
          ],
          ask: "Give the y-value.",
          answer: A.number(p.c),
          wrong: signedWrongs(p.c, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.m),
              feedback:
                "The number with x is the gradient; the number on its own is the intercept.",
            },
          ]),
          solution: [{ say: `When x = 0, y = ${p.c}.` }],
        });
      case 2: {
        const v = p.y0 - p.m * p.x0;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A line has gradient ${p.m} and passes through `,
                A.math(coord([p.x0, p.y0])),
                ".",
              ],
              ask: "Find its y-intercept, c.",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.y0 + p.m * p.x0),
              feedback: `Substitute into y = ${p.m}x + c: ${p.y0} = ${p.m * p.x0} + c, so subtract ${p.m * p.x0}.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.y0} = ${p.m} \\times ${p.x0} + c \\Rightarrow c = ${v}` },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Bo says the y-intercept of ",
                A.math(`y = ${Math.abs(p.m)}x`),
                ` is ${Math.abs(p.m)}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. When x = 0, y = 0, so the line goes through the origin: c = 0. ${Math.abs(p.m)} is the gradient.`,
                  correct: true,
                },
                {
                  text: "True. The only number in the equation is the intercept.",
                  code: "ALG.LINE.M-C",
                },
                {
                  text: "True. Every line crosses the y-axis at its gradient.",
                  code: "ALG.LINE.M-C",
                },
              ],
              solution: [{ say: "y = mx is y = mx + 0." }],
            }),
          [
            {
              statement: "Kit says the line $y = 4x - 3$ crosses the y-axis at (0, −3).",
              truth: true,
              right: "True. When x = 0, y = 4 × 0 − 3 = −3.",
              wrong: [
                ["False. It crosses at (0, 4).", "ALG.LINE.M-C"],
                ["False. It crosses at (−3, 0)."],
              ],
            },
            {
              statement: "Max says the line $y = 6 - 2x$ has y-intercept −2.",
              truth: false,
              right: "False. When x = 0, y = 6. The −2 is the gradient.",
              wrong: [
                ["True. The number next to x is the intercept.", "ALG.LINE.M-C"],
                ["True. The intercept is the last number."],
              ],
            },
            {
              claim: "The y-intercept of a straight line is where x = 0.",
              truth: "always",
              right: "Always. The y-axis is the line x = 0.",
              wrong: [
                ["Sometimes. Only for lines through the origin."],
                ["Never. It is where y = 0.", "ALG.SOLVE.WRONG-INVERSE"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.c;
    if (question.key.depth === 2) return numberAnswer(question) === p.y0 - p.m * p.x0;
    return true;
  },
});
