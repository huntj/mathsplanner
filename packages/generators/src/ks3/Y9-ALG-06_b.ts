/**
 * @statement Y9-ALG-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-06.b: Solve simultaneous linear equations by substitution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  b: number;
  c: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-06.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.FIRST-ONLY", "ALG.SIMULTANEOUS.PAIR"],

  params(rng) {
    const p = { k: rng.int(1, 8), b: rng.int(2, 4), c: rng.int(2, 5), x: rng.int(-3, 8) };
    if (p.x === 0 || p.x + p.k === p.x) reject("a non-zero solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // y = x + k;  b·x + c·y = d
    const y = p.x + p.k;
    const d = p.b * p.x + p.c * y;
    switch (depth) {
      case 1: {
        const slip = (d - p.k) / (p.b + p.c);
        return A.standard({
          question: [
            "Solve ",
            A.math(`y = x + ${p.k}`),
            " and ",
            A.math(`${p.b}x + ${p.c}y = ${d}`),
            ".",
          ],
          ask: "Find x.",
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            Number.isInteger(slip)
              ? {
                  code: "ALG.EXPAND.FIRST-ONLY",
                  value: A.number(slip),
                  feedback: `${p.c}(x + ${p.k}) = ${p.c}x + ${p.c * p.k}.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: "Substitute: ",
              math: `${p.b}x + ${p.c}(x + ${p.k}) = ${d} \\Rightarrow ${p.b + p.c}x = ${d - p.c * p.k} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(`y = x + ${p.k}`),
                " and ",
                A.math(`${p.b}x + ${p.c}y = ${d}`),
                ".",
              ],
              ask: "Find y.",
            },
          ],
          answer: A.number(y),
          wrong: signedWrongs(y, [
            {
              code: "ALG.SIMULTANEOUS.PAIR",
              value: A.number(p.x),
              feedback: `That is x. Use y = x + ${p.k} to find y.`,
            },
          ]),
          solution: [{ say: `x = ${p.x}, so y = ${p.x} + ${p.k} = ${y}.` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Ivy finds x = ${p.x} and says she has finished solving the simultaneous equations.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The solution is a pair of values: she also needs y = ${y}. Checking both in the second equation confirms them.`,
                  correct: true,
                },
                { text: "True. One value is enough.", code: "ALG.SIMULTANEOUS.PAIR" },
                { text: "True. y is always equal to x.", code: "ALG.SIMULTANEOUS.PAIR" },
              ],
              solution: [{ say: "Give x and y, then check in both equations." }],
            }),
          [
            {
              statement:
                "Using $y = 2x$ in $x + y = 9$, Jay writes $x + 2x = 9$, so x = 3 and y = 6.",
              truth: true,
              right: "True. 3x = 9 gives x = 3, and y = 2 × 3 = 6. Check: 3 + 6 = 9.",
              wrong: [
                ["False. It gives x = 4.5.", "ALG.SIMULTANEOUS.PAIR"],
                ["False. You must eliminate, not substitute."],
              ],
            },
            {
              statement: "Using $y = x + 1$ in $3x + 2y = 12$, Sol writes $3x + 2x + 1 = 12$.",
              truth: false,
              right: "False. 2y = 2(x + 1) = 2x + 2, so it is 3x + 2x + 2 = 12.",
              wrong: [
                ["True. Swap y for x + 1.", "ALG.EXPAND.FIRST-ONLY"],
                ["True. The 2 only goes with the x."],
              ],
            },
            {
              claim: "Substitution gives the same solution as elimination.",
              truth: "always",
              right:
                "Always. Both are ways of finding the one pair of values that fits both equations.",
              wrong: [
                ["Sometimes. They can give different answers.", "ALG.SIMULTANEOUS.PAIR"],
                ["Never. Substitution only finds x."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.x + p.k;
    return true;
  },
});
