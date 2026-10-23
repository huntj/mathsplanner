/**
 * @statement Y8-ALG-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-04.a: Solve linear equations with the unknown on both sides
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  c: number;
  x: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.BOTH-SIDES"],

  params(rng) {
    const p = { a: rng.int(3, 9), c: rng.int(1, 6), x: rng.int(-4, 10), b: rng.int(-9, 12) };
    if (p.a <= p.c || p.b === 0) reject("more x on the left");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const d = (p.a - p.c) * p.x + p.b;
    const left = linear([
      [p.a, "x"],
      [p.b, ""],
    ]);
    const right = linear([
      [p.c, "x"],
      [d, ""],
    ]);
    switch (depth) {
      case 1: {
        const slip = (d - p.b) / (p.a + p.c);
        return A.standard({
          question: ["Solve ", A.math(`${left} = ${right}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            Number.isInteger(slip)
              ? {
                  code: "ALG.SOLVE.BOTH-SIDES",
                  value: A.number(slip),
                  feedback: `Subtract ${p.c}x from both sides: ${p.a - p.c}x, not ${p.a + p.c}x.`,
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `${p.a - p.c}x = ${d - p.b} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Ali thinks of a number, multiplies it by ${p.a} and ${p.b < 0 ? "subtracts" : "adds"} ${Math.abs(p.b)}. Ben multiplies the same number by ${p.c} and ${d < 0 ? "subtracts" : "adds"} ${Math.abs(d)}. They get the same answer.`,
              ],
              ask: "What was the number?",
            },
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SOLVE.BOTH-SIDES",
              value: A.number(-p.x),
              feedback: "Keep track of the signs when you move terms across.",
            },
          ]),
          solution: [{ say: "", math: `${left} = ${right} \\Rightarrow x = ${p.x}` }],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Jo solves ", A.math(`${left} = ${right}`), "."],
          lines: [
            [A.math(`${p.a + p.c}x ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)} = ${d}`)],
            [A.math(`${p.a + p.c}x = ${d - p.b}`)],
          ],
          mistake: 0,
          code: "ALG.SOLVE.BOTH-SIDES",
          feedback: `Subtracting ${p.c}x from both sides gives ${p.a - p.c}x, so x = ${p.x}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.x;
    return true;
  },
});
