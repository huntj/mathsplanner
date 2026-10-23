/**
 * @statement GH-A18.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A18.b: Solve quadratics using the quadratic formula
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;
const disc = (p: Params) => p.b * p.b - 4 * p.a * p.c;
const big = (p: Params) => r2((-p.b + Math.sqrt(disc(p))) / (2 * p.a));

export default defineGenerator<Params>({
  id: "GH-A18.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.FORMULA"],

  params(rng) {
    const p = { a: rng.int(1, 4), b: rng.int(-9, 9), c: rng.int(-9, 9) };
    if (p.b === 0 || p.c === 0 || disc(p) <= 0 || Number.isInteger(Math.sqrt(disc(p))))
      reject("two irrational roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = `${poly([p.a, p.b, p.c])} = 0`;
    switch (depth) {
      case 1: {
        const v = big(p);
        return A.standard({
          question: ["Use the quadratic formula to solve ", A.math(eq), "."],
          ask: "Give the larger solution to 2 decimal places.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(v, [
            {
              code: "ALG.QUADRATIC.FORMULA",
              value: A.number(r2((p.b + Math.sqrt(disc(p))) / (2 * p.a)), { accuracy: { dp: 2 } }),
              feedback: `The formula starts with −b: here −(${p.b}) = ${-p.b}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `x = \\frac{${-p.b} \\pm \\sqrt{${disc(p)}}}{${2 * p.a}} \\Rightarrow x = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = disc(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "For ",
                A.math(eq),
                ", find the value of the discriminant ",
                A.math("b^2 - 4ac"),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.QUADRATIC.FORMULA",
              value: A.number(p.b * p.b + 4 * p.a * p.c),
              feedback: `Keep the signs: 4 × ${p.a} × (${p.c}) = ${4 * p.a * p.c}, then subtract it.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `(${p.b})^2 - 4(${p.a})(${p.c}) = ${p.b * p.b} - ${4 * p.a * p.c} = ${v}`.replace(
                "- -",
                "+ ",
              ),
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Uma says that when ",
            A.math("b^2 - 4ac < 0"),
            ", the quadratic formula still gives two solutions.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The square root of a negative number has no real value, so there are no real solutions: the graph does not cross the x-axis.",
              correct: true,
            },
            {
              text: "True. The formula always gives two answers, from the ±.",
              code: "ALG.QUADRATIC.FORMULA",
            },
            {
              text: "True. Take the square root of the positive part.",
              code: "ALG.QUADRATIC.FORMULA",
            },
          ],
          solution: [{ say: "Discriminant > 0: two roots; = 0: one; < 0: none." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === big(p);
    if (question.key.depth === 2) return numberAnswer(question) === disc(p);
    return true;
  },
});
