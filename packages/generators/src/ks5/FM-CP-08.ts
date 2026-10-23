/**
 * @statement FM-CP-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-08: Add, subtract and multiply conformable matrices; use zero and identity matrices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { mat, mul, type M2 } from "../shared/mat.ts";

export interface Params {
  A: M2;
  B: M2;
}

export default defineGenerator<Params>({
  id: "FM-CP-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MAT.PRODUCT"],

  params(rng) {
    const e = () => rng.int(-4, 5);
    const A_: M2 = [
      [e(), e()],
      [e(), e()],
    ];
    const B_: M2 = [
      [e(), e()],
      [e(), e()],
    ];
    if (
      JSON.stringify(mul(A_, B_)) === JSON.stringify(mul(B_, A_)) ||
      A_.flat().includes(0) ||
      B_.flat().includes(0)
    )
      reject("matrices that do not commute");
    return { A: A_, B: B_ };
  },

  build(p, depth, rng): QuestionDraft {
    const AB = mul(p.A, p.B);
    const intro = [
      A.math(`\\mathbf{A} = ${mat(p.A)}`),
      " and ",
      A.math(`\\mathbf{B} = ${mat(p.B)}`),
      ".",
    ];
    switch (depth) {
      case 1: {
        const v = AB[0]?.[1] ?? 0;
        const slip = (p.A[0]?.[1] ?? 0) * (p.B[0]?.[1] ?? 0);
        return A.standard({
          question: ["Let ", ...intro],
          ask: ["Find the entry in row 1, column 2 of ", A.math("\\mathbf{AB}"), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "MAT.PRODUCT",
              value: A.number(slip),
              feedback:
                "Multiply row 1 of A by column 2 of B and add: it is not the product of matching entries.",
            },
          ]),
          solution: [
            { say: `(${p.A[0]?.[0]})(${p.B[0]?.[1]}) + (${p.A[0]?.[1]})(${p.B[1]?.[1]}) = ${v}.` },
          ],
        });
      }
      case 2: {
        const entrywise: M2 = [
          [(p.A[0]?.[0] ?? 0) * (p.B[0]?.[0] ?? 0), (p.A[0]?.[1] ?? 0) * (p.B[0]?.[1] ?? 0)],
          [(p.A[1]?.[0] ?? 0) * (p.B[1]?.[0] ?? 0), (p.A[1]?.[1] ?? 0) * (p.B[1]?.[1] ?? 0)],
        ];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Let ", ...intro],
          ask: ["Find ", A.math("\\mathbf{AB}"), "."],
          correct: A.math(mat(AB)),
          distractors: [
            {
              content: A.math(mat(mul(p.B, p.A))),
              code: "MAT.PRODUCT",
              feedback: "That is BA. Matrix multiplication is not commutative.",
            },
            {
              content: A.math(mat(entrywise)),
              code: "MAT.PRODUCT",
              feedback: "Multiply rows of A by columns of B, not matching entries.",
            },
          ].filter(distinctFrom(A.math(mat(AB)))),
          solution: [{ say: "Each entry is a row of A times a column of B: ", math: mat(AB) }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Let ", ...intro, " Sam says AB = BA."],
          truth: false,
          reasons: [
            {
              text: `False. The top-left entry of AB is ${AB[0]?.[0]} but the top-left entry of BA is ${mul(p.B, p.A)[0]?.[0]}: matrix multiplication is not commutative in general.`,
              correct: true,
            },
            { text: "True. Multiplication can be done in either order.", code: "MAT.PRODUCT" },
            { text: "True. Both are 2 × 2 matrices.", code: "MAT.PRODUCT" },
          ],
          solution: [{ say: "Work out both products to compare." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (mul(p.A, p.B)[0]?.[1] ?? 0);
    return true;
  },
});
