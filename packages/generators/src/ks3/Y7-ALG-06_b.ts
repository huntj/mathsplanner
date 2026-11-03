/**
 * @statement Y7-ALG-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-06.b: Solve two-step linear equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  x: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-06.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    return { a: rng.int(2, 9), b: rng.int(1, 15), x: rng.int(-5, 12), c: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const rhs = p.a * p.x + p.b;
        const slip = (rhs + p.b) / p.a;
        return A.standard({
          question: ["Solve ", A.math(`${p.a}x + ${p.b} = ${rhs}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            Number.isInteger(slip)
              ? {
                  code: "ALG.SOLVE.WRONG-INVERSE",
                  value: A.number(slip),
                  feedback: `Subtract ${p.b} from both sides first, then divide by ${p.a}.`,
                }
              : {
                  code: "ALG.SOLVE.WRONG-INVERSE",
                  value: A.number(rhs - p.b - p.a),
                  feedback: `${p.a}x means ${p.a} × x: divide by ${p.a}, do not subtract it.`,
                },
          ]),
          solution: [{ say: "", math: `${p.a}x = ${rhs - p.b} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        const x = p.c * p.x;
        const rhs = p.x - p.b;
        return A.variedForm({
          rng,
          forms: [{ question: ["Solve ", A.math(`\\frac{x}{${p.c}} - ${p.b} = ${rhs}`), "."] }],
          answer: A.number(x),
          wrong: signedWrongs(x, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.c * rhs + p.b),
              feedback: `Add ${p.b} to both sides first, then multiply by ${p.c}.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{x}{${p.c}} = ${p.x} \\Rightarrow x = ${x}` }],
        });
      }
      default: {
        const rhs = p.a * p.x + p.b;
        return orClaims(
          rng,
          () =>
            A.spotTheMistake({
              question: ["Ali solves ", A.math(`${p.a}x + ${p.b} = ${rhs}`), "."],
              lines: [
                [A.math(`${p.a}x = ${rhs + p.b}`)],
                [A.math(`x = ${Number(((rhs + p.b) / p.a).toFixed(3))}`)],
              ],
              mistake: 0,
              code: "ALG.SOLVE.WRONG-INVERSE",
              feedback: `To undo + ${p.b}, subtract ${p.b}: ${p.a}x = ${rhs - p.b}, so x = ${p.x}.`,
            }),
          [
            {
              statement: `Kim solves $${p.a}x + ${p.b} = ${p.a * p.x + p.b}$ and gets $x = ${p.x}$.`,
              truth: true,
              right: `True. Subtract ${p.b}: ${p.a}x = ${p.a * p.x}. Divide by ${p.a}: x = ${p.x}.`,
              wrong: [
                ["False. You must divide first, then subtract.", "ALG.SOLVE.WRONG-INVERSE"],
                ["False. An equation with two steps has two answers."],
              ],
            },
            {
              statement: `Max says the first step in solving $${p.c}x - ${p.b} = ${p.c * p.x - p.b}$ is to subtract ${p.b} from both sides.`,
              truth: false,
              right: `False. To undo − ${p.b}, add ${p.b} to both sides: ${p.c}x = ${p.c * p.x}, so x = ${p.x}.`,
              wrong: [
                ["True. Subtract the number you can see.", "ALG.SOLVE.WRONG-INVERSE"],
                ["True. You always subtract first.", "ALG.SOLVE.WRONG-INVERSE"],
              ],
            },
            {
              claim: "The solution of a linear equation is a whole number.",
              truth: "sometimes",
              right: "Sometimes. 2x = 6 gives x = 3, but 2x = 5 gives x = 2.5.",
              wrong: [
                ["Always. Equations are made to come out exactly."],
                ["Never. Solutions are usually fractions."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.c * p.x;
    return true;
  },
});
