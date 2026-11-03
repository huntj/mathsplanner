/**
 * @statement Y7-ALG-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-06.a: Solve one-step linear equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  x: number;
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-06.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    return { x: rng.int(-8, 20), a: rng.int(3, 25), k: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const b = p.x + p.a;
        return A.standard({
          question: ["Solve ", A.math(`x + ${p.a} = ${b}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(b + p.a),
              feedback: `To undo + ${p.a}, subtract ${p.a} from both sides.`,
            },
          ]),
          solution: [{ say: "", math: `x = ${b} - ${p.a} = ${p.x}` }],
        });
      }
      case 2: {
        const b = p.k * p.x;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Solve ", A.math(`${p.k}x = ${b}`), "."] },
            {
              question: [
                `${p.k} identical boxes have a total mass of ${b} kg. Write an equation and solve it.`,
              ],
              ask: "Find the mass of one box, x kg.",
            },
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(b - p.k),
              feedback: `${p.k}x means ${p.k} × x: divide both sides by ${p.k}.`,
            },
          ]),
          solution: [{ say: "", math: `x = ${b} \\div ${p.k} = ${p.x}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Kai solves ",
                A.math(`x - ${p.a} = ${p.x}`),
                ` and gets x = ${p.x - p.a}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. To undo − ${p.a}, add ${p.a}: x = ${p.x + p.a}. Check: ${p.x + p.a} − ${p.a} = ${p.x}.`,
                  correct: true,
                },
                { text: "True. Subtract again to solve.", code: "ALG.SOLVE.WRONG-INVERSE" },
                {
                  text: "True. The sign stays the same when you move a number.",
                  code: "ALG.SOLVE.WRONG-INVERSE",
                },
              ],
              solution: [{ say: "Use the inverse operation, and check by substituting." }],
            }),
          [
            {
              statement: `Lou solves $${p.k}x = ${p.k * p.x}$ and gets $x = ${p.x}$.`,
              truth: true,
              right: `True. Divide both sides by ${p.k}: ${p.k * p.x} ÷ ${p.k} = ${p.x}. Check: ${p.k} × ${p.x} = ${p.k * p.x}.`,
              wrong: [
                [`False. Subtract ${p.k}: x = ${p.k * p.x - p.k}.`, "ALG.SOLVE.WRONG-INVERSE"],
                [`False. Multiply by ${p.k}: x = ${p.k * p.k * p.x}.`, "ALG.SOLVE.WRONG-INVERSE"],
              ],
            },
            {
              claim: "Adding the same number to both sides of an equation keeps it true.",
              truth: "always",
              right: "Always. Both sides change by the same amount, so they stay equal.",
              wrong: [
                ["Sometimes. Only if the number is positive.", "ALG.SOLVE.WRONG-INVERSE"],
                ["Never. You must do the opposite to each side.", "ALG.SOLVE.WRONG-INVERSE"],
              ],
            },
            {
              statement: `Sam says the solution of $x + ${p.a} = ${p.x + p.a}$ is $x = ${p.x + 2 * p.a}$.`,
              truth: false,
              right: `False. Subtract ${p.a} from both sides: x = ${p.x}. Check: ${p.x} + ${p.a} = ${p.x + p.a}.`,
              wrong: [
                [`True. Add ${p.a} to both sides.`, "ALG.SOLVE.WRONG-INVERSE"],
                ["True. Move the number over without changing it.", "ALG.SOLVE.WRONG-INVERSE"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.x;
    return true;
  },
});
