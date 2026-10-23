/**
 * @statement GF-A9.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A9.d: Find the equation of a line through two points
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  m: number;
  c: number;
  x1: number;
  x2: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-A9.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRADIENT.RUN-RISE", "ALG.LINE.M-C"],

  params(rng) {
    const x1 = rng.int(-4, 4);
    const p = {
      m: rng.int(2, 5) * rng.pick([1, -1]),
      c: rng.int(-8, 8),
      x1,
      x2: x1 + rng.int(1, 4),
    };
    if (p.c === 0 || p.x1 === 0) reject("a first point off the y-axis and a non-zero intercept");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const y = (x: number) => p.m * x + p.c;
    const P = coord([p.x1, y(p.x1)]);
    const Q = coord([p.x2, y(p.x2)]);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the gradient of the line through ", A.math(P), " and ", A.math(Q), "."],
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(r2(1 / p.m)),
              feedback: "Gradient = change in y ÷ change in x.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${y(p.x2)} - ${y(p.x1) < 0 ? `(${y(p.x1)})` : y(p.x1)}}{${p.x2} - ${p.x1 < 0 ? `(${p.x1})` : p.x1}} = ${p.m}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the equation of the line through ",
                A.math(P),
                " and ",
                A.math(Q),
                ".",
              ],
              ask: "Give it in the form y = mx + c.",
            },
          ],
          answer: A.exact(lineLatex(p.m, p.c)),
          wrong: [
            {
              code: "ALG.LINE.M-C",
              value: A.exact(lineLatex(p.m, y(p.x1))),
              feedback: `Find c by substituting a point: ${y(p.x1)} = ${p.m}(${p.x1}) + c.`,
            },
          ],
          solution: [
            {
              say: `Gradient ${p.m}; then ${y(p.x1)} = ${p.m}(${p.x1}) + c gives c = ${p.c}: `,
              math: lineLatex(p.m, p.c),
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Max says the gradient from ",
            A.math(P),
            " to ",
            A.math(Q),
            ` is ${p.x2 - p.x1} ÷ ${y(p.x2) - y(p.x1)}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Gradient = change in y ÷ change in x = ${y(p.x2) - y(p.x1)} ÷ ${p.x2 - p.x1} = ${p.m}.`,
              correct: true,
            },
            { text: "True. Gradient is across over up.", code: "ALG.GRADIENT.RUN-RISE" },
            { text: "True. The order does not matter.", code: "ALG.GRADIENT.RUN-RISE" },
          ],
          solution: [{ say: "Rise over run: vertical change on top." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m;
    return true;
  },
});
