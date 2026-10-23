/**
 * @statement GF-A19.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A19.a: Solve simultaneous equations by elimination
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "GF-A19.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.SIGN"],

  params(rng) {
    const p = {
      a: rng.int(1, 5),
      b: rng.int(1, 5),
      c: rng.int(1, 5),
      d: rng.int(1, 5),
      x: rng.int(-5, 8),
      y: rng.int(-5, 8),
    };
    if (p.x === 0 || p.y === 0 || p.a === p.c || p.a * p.d === p.b * p.c)
      reject("a unique solution with different x coefficients");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // Same y coefficient: ax + by = e, cx + by = f → subtract
        const e = p.a * p.x + p.b * p.y;
        const f = p.c * p.x + p.b * p.y;
        const slip = (e + f) / (p.a + p.c);
        return A.standard({
          question: [
            "Solve the simultaneous equations ",
            A.math(
              `${linear([
                [p.a, "x"],
                [p.b, "y"],
              ])} = ${e}`,
            ),
            " and ",
            A.math(
              `${linear([
                [p.c, "x"],
                [p.b, "y"],
              ])} = ${f}`,
            ),
            ".",
          ],
          ask: "Find the value of x.",
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip)
              ? [
                  {
                    code: "ALG.SIMULTANEOUS.SIGN",
                    value: A.number(slip),
                    feedback:
                      "The y terms are the same sign, so subtract the equations to eliminate y.",
                  },
                ]
              : [],
          ),
          solution: [
            {
              say: "Subtract to eliminate y: ",
              math: `${p.a - p.c}x = ${e - f} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      case 2: {
        const e = p.a * p.x + p.b * p.y;
        const f = p.c * p.x + p.d * p.y;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(
                  `${linear([
                    [p.a, "x"],
                    [p.b, "y"],
                  ])} = ${e}`,
                ),
                " and ",
                A.math(
                  `${linear([
                    [p.c, "x"],
                    [p.d, "y"],
                  ])} = ${f}`,
                ),
                ".",
              ],
              ask: "Find the value of y.",
            },
          ],
          answer: A.number(p.y),
          wrong: signedWrongs(p.y, [
            {
              code: "ALG.SIMULTANEOUS.SIGN",
              value: A.number(-p.y),
              feedback:
                "Multiply to match a coefficient, then subtract carefully, keeping track of the signs.",
            },
          ]),
          solution: [
            {
              say: `Multiply the first by ${p.c} and the second by ${p.a}, then subtract to eliminate x: y = ${p.y} (and x = ${p.x}).`,
            },
          ],
        });
      }
      default: {
        const e = p.a * p.x + p.b * p.y;
        const f = p.c * p.x - p.b * p.y;
        return A.spotTheMistake({
          question: [
            "Max solves ",
            A.math(
              `${linear([
                [p.a, "x"],
                [p.b, "y"],
              ])} = ${e}`,
            ),
            " and ",
            A.math(
              `${linear([
                [p.c, "x"],
                [-p.b, "y"],
              ])} = ${f}`,
            ),
            ".",
          ],
          lines: [
            [A.math(`${p.a - p.c}x = ${e - f}`)],
            [A.math(`x = ${Number(((e - f) / (p.a - p.c)).toFixed(3))}`)],
          ],
          mistake: 0,
          code: "ALG.SIMULTANEOUS.SIGN",
          feedback: `The y terms have opposite signs, so add the equations: ${p.a + p.c}x = ${e + f}, giving x = ${p.x}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.y;
    return true;
  },
});
