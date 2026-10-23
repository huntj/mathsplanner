/**
 * @statement GF-A2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A2.a: Substitute values into expressions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  x: number;
  y: number;
  c: number;
  d: number;
}

const value = (p: Params) => p.a * p.k * p.k - p.b * p.k;

export default defineGenerator<Params>({
  id: "GF-A2.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SUBSTITUTE.NEGATIVE-SQUARE"],

  params(rng) {
    return {
      a: rng.int(2, 6),
      b: rng.int(1, 9),
      k: rng.int(2, 6),
      x: rng.int(2, 9),
      y: rng.int(2, 6),
      c: rng.int(2, 7),
      d: rng.int(2, 5),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // a x² + b x at x = −k
        const v = value(p);
        return A.standard({
          question: [
            "Work out the value of ",
            A.math(
              linear([
                [p.a, "x^2"],
                [p.b, "x"],
              ]),
            ),
            " when ",
            A.math(`x = -${p.k}`),
            ".",
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number(-p.a * p.k * p.k - p.b * p.k),
              feedback: `(−${p.k})² = +${p.k * p.k}: a negative number squared is positive.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a}(-${p.k})^2 + ${p.b}(-${p.k}) = ${p.a * p.k * p.k} - ${p.b * p.k} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        // c x − d y² at x, y = −y
        const v = p.c * p.x - p.d * p.y * p.y;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the value of ",
                A.math(`${p.c}x - ${p.d}y^2`),
                " when ",
                A.math(`x = ${p.x}`),
                " and ",
                A.math(`y = -${p.y}`),
                ".",
              ],
            },
            {
              question: [
                "Given ",
                A.math(`x = ${p.x}`),
                " and ",
                A.math(`y = -${p.y}`),
                ", work out ",
                A.math(`${p.c}x - ${p.d}y^2`),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number(p.c * p.x + p.d * p.y * p.y),
              feedback: `y² = (−${p.y})² = ${p.y * p.y}, which is positive; then subtract ${p.d} × ${p.y * p.y}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.c} \\times ${p.x} - ${p.d} \\times (-${p.y})^2 = ${p.c * p.x} - ${p.d * p.y * p.y} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["For a number x, ", A.math("x^2 > x"), "."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. It is true for x = 3 (9 > 3) and x = −2 (4 > −2), but not for x = ½ (¼ < ½) or x = 1.",
              correct: true,
            },
            {
              text: "Always. Squaring always makes a number bigger.",
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
            },
            {
              text: "Never. Squaring a negative number makes it more negative.",
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
            },
          ],
          solution: [
            {
              say: "Test values from different ranges: negative numbers, numbers between 0 and 1, and numbers above 1.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === value(p);
    if (question.key.depth === 2) return numberAnswer(question) === p.c * p.x - p.d * p.y * p.y;
    return true;
  },
});
