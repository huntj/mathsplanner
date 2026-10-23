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

interface Params {
  x: number;
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-06.a",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
          rng,
          statement: ["Kai solves ", A.math(`x - ${p.a} = ${p.x}`), ` and gets x = ${p.x - p.a}.`],
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.x;
    return true;
  },
});
