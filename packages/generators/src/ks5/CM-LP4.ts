/**
 * @statement CM-LP4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP4: Solve linear equations with the unknown on both sides
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  c: number;
  x: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "CM-LP4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE", "ALG.EXPAND.FIRST-ONLY"],

  params(rng) {
    const p = {
      a: rng.int(3, 9),
      c: rng.int(1, 8),
      x: rng.int(-6, 9),
      b: rng.int(-9, 9),
      k: rng.int(2, 5),
    };
    if (p.a === p.c || p.x === 0 || p.b === 0) reject("a unique non-zero solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const d = (p.a - p.c) * p.x + p.b;
        const slip = (d + p.b) / (p.a - p.c);
        return A.standard({
          question: [
            "Solve ",
            A.math(
              `${linear([
                [p.a, "x"],
                [p.b, ""],
              ])} = ${linear([
                [p.c, "x"],
                [d, ""],
              ])}`,
            ),
            ".",
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip)
              ? [
                  {
                    code: "ALG.SOLVE.WRONG-INVERSE",
                    value: A.number(slip),
                    feedback: `Subtract ${p.b} from both sides; do not add it.`,
                  },
                ]
              : [
                  {
                    code: "ALG.SOLVE.WRONG-INVERSE",
                    value: A.number(-p.x),
                    feedback:
                      "Collect the x terms on one side and the numbers on the other, changing signs as you move them.",
                  },
                ],
          ),
          solution: [{ say: "", math: `${p.a - p.c}x = ${d - p.b} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        // k(x + b) = (k + a)x + ...: choose the right side so the answer is x.
        const rhsConst = p.k * (p.x + p.b) - (p.k + p.c) * p.x;
        const slip = (p.b - rhsConst) / p.c;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(
                  `${p.k}(x ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}) = ${linear([
                    [p.k + p.c, "x"],
                    [rhsConst, ""],
                  ])}`,
                ),
                ".",
              ],
            },
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip) && slip !== p.x
              ? [
                  {
                    code: "ALG.EXPAND.FIRST-ONLY",
                    value: A.number(slip),
                    feedback: `Multiply both terms in the bracket by ${p.k}.`,
                  },
                ]
              : [
                  {
                    code: "ALG.SOLVE.WRONG-INVERSE",
                    value: A.number(-p.x),
                    feedback: "Expand, then collect like terms carefully.",
                  },
                ],
          ),
          solution: [
            {
              say: "",
              math: `${linear([
                [p.k, "x"],
                [p.k * p.b, ""],
              ])} = ${linear([
                [p.k + p.c, "x"],
                [rhsConst, ""],
              ])} \\Rightarrow ${p.k * p.b - rhsConst} = ${p.c}x \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Wyn says the solution of ",
            A.math(`${p.a}x + ${Math.abs(p.b)} = ${p.a}x + ${Math.abs(p.b) + 2}`),
            " is x = 0.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Subtracting ${p.a}x from both sides leaves ${Math.abs(p.b)} = ${Math.abs(p.b) + 2}, which is never true, so there is no solution. Check: x = 0 gives ${Math.abs(p.b)} ≠ ${Math.abs(p.b) + 2}.`,
              correct: true,
            },
            {
              text: "True. When the x terms cancel, x must be 0.",
              code: "ALG.SOLVE.WRONG-INVERSE",
            },
            {
              text: "True. Every linear equation has exactly one solution.",
              code: "ALG.SOLVE.WRONG-INVERSE",
            },
          ],
          solution: [{ say: "Always check a solution by substituting it back." }],
        });
    }
  },

  verify(p, question) {
    return question.key.depth === 4 || numberAnswer(question) === p.x;
  },
});
