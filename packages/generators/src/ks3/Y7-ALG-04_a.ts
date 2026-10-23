/**
 * @statement Y7-ALG-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-04.a: Collect like terms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LIKE-TERMS.UNLIKE", "ALG.LIKE-TERMS.SIGN"],

  params(rng) {
    const p = { a: rng.int(2, 9), b: rng.int(2, 9), c: rng.int(2, 9), d: rng.int(1, 9) };
    if (p.b === p.d || p.a + p.c === p.b) reject("different results");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = linear([
          [p.a + p.c, "x"],
          [p.b, "y"],
        ]);
        return A.standard({
          question: ["Simplify ", A.math(`${p.a}x + ${p.b}y + ${p.c}x`), "."],
          answer: A.exact(right, "collected"),
          wrong: [
            {
              code: "ALG.LIKE-TERMS.UNLIKE",
              value: A.exact(`${p.a + p.b + p.c}xy`),
              feedback: "x terms and y terms are unlike: collect them separately.",
            },
          ],
          solution: [{ say: "", math: `${p.a}x + ${p.c}x + ${p.b}y = ${right}` }],
        });
      }
      case 2: {
        const right = linear([
          [p.a + p.c, "x"],
          [p.d - p.b, "y"],
        ]);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Simplify ", A.math(`${p.a}x - ${p.b}y + ${p.c}x + ${p.d}y`), "."] },
          ],
          answer: A.exact(right, "collected"),
          wrong: [
            {
              code: "ALG.LIKE-TERMS.SIGN",
              value: A.exact(
                linear([
                  [p.a + p.c, "x"],
                  [p.b + p.d, "y"],
                ]),
              ),
              feedback: `The minus belongs to ${p.b}y: −${p.b}y + ${p.d}y = ${linear([[p.d - p.b, "y"]])}.`,
            },
          ],
          solution: [{ say: "", math: `(${p.a} + ${p.c})x + (-${p.b} + ${p.d})y = ${right}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [A.math(`${p.a}a + ${p.b}b = ${p.a + p.b}ab`)],
          truth: "never",
          reasons: [
            {
              text: `Never true as a rule. a and b are unlike terms, so ${p.a}a + ${p.b}b cannot be simplified. Try a = 1, b = 2: ${p.a + 2 * p.b} is not ${2 * (p.a + p.b)}.`,
              correct: true,
            },
            {
              text: "Always. Add the numbers and put the letters together.",
              code: "ALG.LIKE-TERMS.UNLIKE",
            },
            {
              text: "Sometimes. Only when a and b are both positive.",
              code: "ALG.LIKE-TERMS.UNLIKE",
            },
          ],
          solution: [{ say: "Only like terms, with exactly the same letters, can be collected." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        exactAnswer(question) ===
        linear([
          [p.a + p.c, "x"],
          [p.b, "y"],
        ])
      );
    if (question.key.depth === 2)
      return (
        exactAnswer(question) ===
        linear([
          [p.a + p.c, "x"],
          [p.d - p.b, "y"],
        ])
      );
    return true;
  },
});
