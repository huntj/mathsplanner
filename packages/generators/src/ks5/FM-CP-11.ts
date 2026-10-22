/**
 * @statement FM-CP-11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-11: Calculate determinants of 2×2 and 3×3 matrices and interpret them as scale factors; find
// inverses; use (AB)⁻¹ = B⁻¹A⁻¹
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { det2, det3, mat } from "../shared/mat.ts";

interface Params {
  m: number[][];
  n: number[][];
}

/** The 3 × 3 expansion with every cofactor added, the sign slip on the middle term. */
function slip3(m: number[][]): number {
  const e = (i: number, j: number) => m[i]?.[j] ?? 0;
  return (
    e(0, 0) * (e(1, 1) * e(2, 2) - e(1, 2) * e(2, 1)) +
    e(0, 1) * (e(1, 0) * e(2, 2) - e(1, 2) * e(2, 0)) +
    e(0, 2) * (e(1, 0) * e(2, 1) - e(1, 1) * e(2, 0))
  );
}

export default defineGenerator<Params>({
  id: "FM-CP-11",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MAT.DETERMINANT", "MAT.INVERSE"],

  params(rng) {
    const e = () => rng.int(-4, 6);
    const m = [
      [e(), e()],
      [e(), e()],
    ];
    const n = [
      [e(), e(), e()],
      [e(), e(), e()],
      [e(), e(), e()],
    ];
    if (det2(m) === 0 || det3(n) === 0) reject("non-singular matrices");
    if ((m[0]?.[1] ?? 0) * (m[1]?.[0] ?? 0) === 0)
      reject("a 2 × 2 matrix where ad + bc differs from ad − bc");
    if (slip3(n) === det3(n)) reject("a 3 × 3 matrix where the sign slip changes the value");
    return { m, n };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const d = det2(p.m);
        const [[a, b], [c, dd]] = p.m as [[number, number], [number, number]];
        return A.standard({
          question: ["Find the determinant of ", A.math(mat(p.m)), "."],
          answer: A.number(d),
          wrong: signedWrongs(d, [
            {
              code: "MAT.DETERMINANT",
              value: A.number(a * dd + b * c),
              feedback: "det = ad − bc: subtract the second diagonal product.",
            },
          ]),
          solution: [{ say: "", math: `(${a})(${dd}) - (${b})(${c}) = ${d}` }],
        });
      }
      case 2: {
        const d = det3(p.n);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Find the determinant of ", A.math(mat(p.n)), "."] },
            { question: ["Work out ", A.math(`\\det ${mat(p.n)}`), "."] },
          ],
          answer: A.number(d),
          wrong: signedWrongs(d, [
            {
              code: "MAT.DETERMINANT",
              value: A.number(slip3(p.n)),
              feedback: "Expanding along the top row, the signs alternate: +, −, +.",
            },
          ]),
          solution: [
            { say: "Expand along the top row with signs +, −, +, giving ", math: String(d) },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Cara says that for non-singular matrices A and B, ",
            A.math("(\\mathbf{AB})^{-1} = \\mathbf{A}^{-1}\\mathbf{B}^{-1}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. (AB)⁻¹ = B⁻¹A⁻¹: AB × B⁻¹A⁻¹ = A(BB⁻¹)A⁻¹ = I. The order reverses.",
              correct: true,
            },
            {
              text: "True. Each matrix is inverted separately in the same order.",
              code: "MAT.INVERSE",
            },
            { text: "True. Matrix multiplication is commutative.", code: "MAT.INVERSE" },
          ],
          solution: [
            { say: "Undo the last transformation first, like taking off socks and shoes." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === det2(p.m);
    if (question.key.depth === 2) return numberAnswer(question) === det3(p.n);
    return true;
  },
});
