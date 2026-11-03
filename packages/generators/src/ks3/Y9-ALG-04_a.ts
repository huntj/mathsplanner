/**
 * @statement Y9-ALG-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-04.a: Find the gradient of a straight line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  x1: number;
  y1: number;
  dx: number;
  m: number;
  k: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-04.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRADIENT.RUN-RISE", "ALG.LINE.M-C"],

  params(rng) {
    const p = {
      x1: rng.int(-5, 5),
      y1: rng.int(-5, 5),
      dx: rng.int(1, 4),
      m: rng.int(2, 5) * rng.pick([1, -1]),
      k: rng.int(2, 4),
      c: rng.int(1, 9),
    };
    if (Math.abs(p.m) === p.dx) reject("a gradient that differs from its reciprocal");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x2 = p.x1 + p.dx;
        const y2 = p.y1 + p.m * p.dx;
        return A.standard({
          question: [
            "A straight line passes through ",
            A.math(coord([p.x1, p.y1])),
            " and ",
            A.math(coord([x2, y2])),
            ".",
          ],
          ask: "Find its gradient.",
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(Math.round((p.dx / (p.m * p.dx)) * 1000) / 1000),
              feedback: "Gradient = change in y ÷ change in x (rise over run).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${y2} - (${p.y1})}{${x2} - (${p.x1})} = \\frac{${p.m * p.dx}}{${p.dx}} = ${p.m}`,
            },
          ],
        });
      }
      case 2: {
        const eq = `${p.k}y = ${linear([
          [p.k * p.m, "x"],
          [p.c, ""],
        ])}`;
        return A.variedForm({
          rng,
          forms: [{ question: ["Find the gradient of the line ", A.math(eq), "."] }],
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.k * p.m),
              feedback: `Divide everything by ${p.k} first, to get y on its own.`,
            },
          ]),
          solution: [
            {
              say: `Divide every term by ${p.k}: `,
              math: `y = ${linear([[p.m, "x"]])} + ${toLatex(frac(p.c, p.k))} \\Rightarrow m = ${p.m}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["A straight line that goes down from left to right has a negative gradient."],
              truth: "always",
              reasons: [
                {
                  text: "Always. As x increases, y decreases, so the rise is negative for a positive run.",
                  correct: true,
                },
                { text: "Never. Gradients are always positive.", code: "ALG.GRADIENT.RUN-RISE" },
                {
                  text: "Sometimes. It depends where it crosses the y-axis.",
                  code: "ALG.LINE.M-C",
                },
              ],
              solution: [{ say: "Up to the right: positive. Down to the right: negative." }],
            }),
          [
            {
              statement: "A line passes through (1, 3) and (3, 7). Sam says its gradient is 2.",
              truth: true,
              right: "True. Gradient = change in y ÷ change in x = (7 − 3) ÷ (3 − 1) = 4 ÷ 2 = 2.",
              wrong: [
                ["False. It is 2 ÷ 4 = 0.5.", "ALG.GRADIENT.RUN-RISE"],
                ["False. It is 7 − 3 = 4."],
              ],
            },
            {
              statement: "A line passes through (0, 1) and (4, 3). Jo says its gradient is 2.",
              truth: false,
              right:
                "False. Gradient = (3 − 1) ÷ (4 − 0) = 2 ÷ 4 = 0.5. It is change in y over change in x.",
              wrong: [["True. 4 ÷ 2 = 2.", "ALG.GRADIENT.RUN-RISE"], ["True. The line goes up 2."]],
            },
            {
              claim: "A horizontal line has a gradient of 0.",
              truth: "always",
              right: "Always. y does not change as x changes, so the change in y is 0.",
              wrong: [
                ["Never. Its gradient is 1, as it is a straight line.", "ALG.LINE.M-C"],
                ["Sometimes. Only on the x-axis."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.m;
    return true;
  },
});
