/**
 * @statement FM-FP2-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP2-05: Find eigenvalues and eigenvectors, diagonalise matrices and use the Cayley-Hamilton theorem
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { mat, mul } from "../shared/mat.ts";
import { col } from "../shared/vec.ts";

export interface Params {
  l1: number;
  l2: number;
  s: number;
}

/** M = P D P⁻¹ with P = [[1, s], [1, s + 1]], det P = 1: eigenvectors (1, 1) for l1 and (s, s + 1) for l2. */
function matrix(p: Params): number[][] {
  const P = [
    [1, p.s],
    [1, p.s + 1],
  ];
  const D = [
    [p.l1, 0],
    [0, p.l2],
  ];
  const Pinv = [
    [p.s + 1, -p.s],
    [-1, 1],
  ];
  return mul(mul(P, D), Pinv);
}

export default defineGenerator<Params>({
  id: "FM-FP2-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MAT.EIGEN"],

  params(rng) {
    const p = { l1: rng.int(-4, 6), l2: rng.int(-4, 6), s: rng.pick([-3, -2, 1, 2, 3]) };
    if (p.l1 === p.l2 || p.l1 === -p.l2) reject("distinct eigenvalues that a sign slip changes");
    const M = matrix(p);
    if (M.flat().some((x) => Math.abs(x) > 30) || (M[0]?.[1] ?? 0) === 0 || (M[1]?.[0] ?? 0) === 0)
      reject("a small matrix that is not triangular");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const M = matrix(p);
    const big = Math.max(p.l1, p.l2);
    const small = Math.min(p.l1, p.l2);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the larger eigenvalue of ", A.math(mat(M)), "."],
          answer: A.number(big),
          wrong: signedWrongs(big, [
            {
              code: "MAT.EIGEN",
              value: A.number(-small),
              feedback: "det(M − λI) = λ² − (trace)λ + det: check the sign of the λ term.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\lambda^2 - ${p.l1 + p.l2}\\lambda + ${p.l1 * p.l2} = 0 \\Rightarrow \\lambda = ${small} \\text{ or } ${big}`
                .replace(/- -/g, "+ ")
                .replace(/\+ -/g, "- "),
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The matrix ",
            A.math(`\\mathbf{M} = ${mat(M)}`),
            " has eigenvalues ",
            A.math(String(p.l1)),
            " and ",
            A.math(String(p.l2)),
            ".",
          ],
          ask: ["Which is an eigenvector for the eigenvalue ", A.math(String(p.l2)), "?"],
          correct: A.math(col([p.s, p.s + 1])),
          distractors: [
            {
              content: A.math(col([1, 1])),
              code: "MAT.EIGEN",
              feedback: `That is an eigenvector for ${p.l1}. Check: M multiplies it by ${p.l1}.`,
            },
            {
              content: A.math(col([p.s + 1, p.s])),
              code: "MAT.EIGEN",
              feedback: `Solve (M − ${p.l2}I)v = 0 and check the order of the components.`,
            },
          ],
          solution: [
            {
              say: "Check: ",
              math: `\\mathbf{M}${col([p.s, p.s + 1])} = ${col([p.l2 * p.s, p.l2 * (p.s + 1)])} = ${p.l2}${col([p.s, p.s + 1])}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lou says the eigenvalues of ",
            A.math(mat(M)),
            ` are ${M[0]?.[0]} and ${M[1]?.[1]}, the numbers on the leading diagonal.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. That only holds for triangular matrices. Solving det(M − λI) = 0 gives ${p.l1} and ${p.l2}.`,
              correct: true,
            },
            { text: "True. The eigenvalues are always on the diagonal.", code: "MAT.EIGEN" },
            { text: "True. Their sum is the trace.", code: "MAT.EIGEN" },
          ],
          solution: [
            {
              say: `The eigenvalues sum to the trace ${p.l1 + p.l2} and multiply to the determinant ${p.l1 * p.l2}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === Math.max(p.l1, p.l2);
    if (question.key.depth === 2) {
      const v = [p.s, p.s + 1];
      const Mv = mul(matrix(p), [[v[0] ?? 0], [v[1] ?? 0]]);
      return (
        chosenText(question) === col(v) &&
        Mv[0]?.[0] === p.l2 * p.s &&
        Mv[1]?.[0] === p.l2 * (p.s + 1)
      );
    }
    return true;
  },
});
