/**
 * @statement CM-LP2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP2: Plot straight-line graphs; find equations of lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  m: number;
  c: number;
  x1: number;
  x2: number;
}

export default defineGenerator<Params>({
  id: "CM-LP2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.GRADIENT.RUN-RISE"],

  params(rng) {
    const p = { m: rng.int(-5, 6), c: rng.int(-8, 9), x1: rng.int(-4, 3), x2: rng.int(4, 9) };
    if (p.m === 0 || Math.abs(p.m) === 1 || p.c === 0 || p.x1 === 0)
      reject("a clear gradient and intercept");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const y1 = p.m * p.x1 + p.c;
    const y2 = p.m * p.x2 + p.c;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "A straight line has gradient ",
            A.math(String(p.m)),
            " and passes through ",
            A.math(`(${p.x1}, ${y1})`),
            ".",
          ],
          ask: ["Its equation is ", A.math("y = mx + c"), ". Find c."],
          answer: A.number(p.c),
          wrong: signedWrongs(p.c, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(y1 + p.m * p.x1),
              feedback: `Substitute: ${y1} = ${p.m} × ${p.x1} + c, so c = ${y1} − (${p.m * p.x1}).`,
            },
          ]),
          solution: [{ say: "", math: `${y1} = ${p.m}(${p.x1}) + c \\Rightarrow c = ${p.c}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the gradient of the line through ",
                A.math(`(${p.x1}, ${y1})`),
                " and ",
                A.math(`(${p.x2}, ${y2})`),
                ".",
              ],
            },
          ],
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(round(1 / p.m, 2)),
              feedback: "Gradient = change in y ÷ change in x.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${p.x2} - ${p.x1 < 0 ? `(${p.x1})` : p.x1}} = \\frac{${y2 - y1}}{${p.x2 - p.x1}} = ${p.m}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Uli says the line ",
            A.math(`y = ${p.c} + ${p.m}x`.replace("+ -", "- ")),
            ` has gradient ${p.c}, because it comes first.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The gradient is the coefficient of x, ${p.m}, wherever it is written. ${p.c} is the y-intercept.`,
              correct: true,
            },
            {
              text: "True. The first number in the equation is the gradient.",
              code: "ALG.LINE.M-C",
            },
            { text: "True. The gradient and the intercept can be swapped.", code: "ALG.LINE.M-C" },
          ],
          solution: [{ say: `Rewrite as y = ${p.m}x + ${p.c}.`.replace("+ -", "- ") }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.c;
    if (question.key.depth === 2) return numberAnswer(question) === p.m;
    return true;
  },
});
