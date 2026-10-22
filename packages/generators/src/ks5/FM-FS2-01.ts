/**
 * @statement FM-FS2-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS2-01: Fit least squares regression lines and analyse residuals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  sxx: number;
  sxy: number;
  a: number;
  b: number;
  x: number;
  y: number;
}

const grad = (p: Params) => round(p.sxy / p.sxx, 3);
const residual = (p: Params) => round(p.y - (p.a + p.b * p.x), 2);

export default defineGenerator<Params>({
  id: "FM-FS2-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.REGRESSION.VARIABLES", "STA.RESIDUAL"],

  params(rng) {
    const p = {
      sxx: rng.int(40, 400),
      sxy: rng.int(-300, 300),
      a: round(rng.int(10, 200) / 10, 1),
      b: round(rng.int(-30, 30) / 10, 1),
      x: rng.int(2, 20),
      y: 0,
    };
    p.y = round(p.a + p.b * p.x + (rng.pick([-1, 1]) * rng.int(5, 40)) / 10, 1);
    if (Math.abs(p.sxy) < 20 || p.b === 0) reject("a clear gradient");
    if (Math.abs(grad(p) - round(p.sxx / p.sxy, 3)) < 0.01)
      reject("a gradient that differs from its reciprocal");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = grad(p);
        return A.standard({
          question: [
            "For some bivariate data, ",
            A.math(`S_{xx} = ${p.sxx}`),
            " and ",
            A.math(`S_{xy} = ${p.sxy}`),
            ".",
          ],
          ask: [
            "Find the gradient b of the least squares regression line of y on x, to 3 decimal places.",
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(v, [
            {
              code: "STA.REGRESSION.VARIABLES",
              value: A.number(round(p.sxx / p.sxy, 3), { accuracy: { dp: 3 } }),
              feedback: "For y on x, b = Sxy/Sxx.",
            },
          ]),
          solution: [
            { say: "", math: `b = \\frac{S_{xy}}{S_{xx}} = \\frac{${p.sxy}}{${p.sxx}} = ${v}` },
          ],
        });
      }
      case 2: {
        const v = residual(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The regression line of y on x is ",
                A.math(`y = ${p.a} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x`),
                ". One data point is ",
                A.math(`(${p.x}, ${p.y})`),
                ".",
              ],
              ask: "Find the residual for this point.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(v, [
            {
              code: "STA.RESIDUAL",
              value: A.number(-v, { accuracy: { dp: 2 } }),
              feedback: "Residual = observed − predicted.",
            },
          ]),
          solution: [
            {
              say: `Predicted y = ${round(p.a + p.b * p.x, 2)}, so the residual is ${p.y} − ${round(p.a + p.b * p.x, 2)} = ${v}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Val says that large residuals show that a regression line fits the data well.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Residuals measure how far points are from the line, so small residuals mean a good fit. A pattern in the residuals suggests a linear model is not suitable.",
              correct: true,
            },
            {
              text: "True. Large residuals mean the line explains a lot of the data.",
              code: "STA.RESIDUAL",
            },
            {
              text: "True. The least squares line makes the residuals as large as possible.",
              code: "STA.RESIDUAL",
            },
          ],
          solution: [{ say: "The least squares line minimises the sum of the squared residuals." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === grad(p);
    if (question.key.depth === 2) return numberAnswer(question) === residual(p);
    return true;
  },
});
