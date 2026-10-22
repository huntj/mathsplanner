/**
 * @statement AL-P10.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P10.3: Add vectors and multiply by scalars, with geometric interpretation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { distinctFrom } from "../shared/pos.ts";
import { add, ijk, scale, sub } from "../shared/vec.ts";

interface Params {
  a: [number, number];
  b: [number, number];
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P10.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.COMPONENTS", "GEO.VECTOR.DIRECTION"],

  params(rng) {
    const a: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    const b: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    if (a.includes(0) || b.includes(0) || a[1] === b[1] || a[0] * b[1] === a[1] * b[0])
      reject("non-parallel vectors with different j parts");
    return { a, b, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = sub(scale(3, p.a), scale(2, p.b));
        return A.choice({
          rng,
          question: [
            "Given ",
            A.math(`\\mathbf{a} = ${ijk(p.a)}`),
            " and ",
            A.math(`\\mathbf{b} = ${ijk(p.b)}`),
            ", find ",
            A.math("3\\mathbf{a} - 2\\mathbf{b}"),
            ".",
          ],
          correct: A.math(ijk(right)),
          distractors: [
            {
              content: A.math(ijk(add(scale(3, p.a), scale(2, p.b)))),
              code: "GEO.VECTOR.DIRECTION",
              feedback: "Subtract 2b, component by component.",
            },
            {
              content: A.math(ijk(sub(scale(3, p.a), p.b))),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Multiply b by 2 before subtracting.",
            },
          ].filter(distinctFrom(A.math(ijk(right)))),
          solution: [{ say: "", math: `3(${ijk(p.a)}) - 2(${ijk(p.b)}) = ${ijk(right)}` }],
        });
      }
      case 2: {
        // a + λb has no j component when λ = −a_j / b_j.
        const lambda = frac(-p.a[1], p.b[1]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given ",
                A.math(`\\mathbf{a} = ${ijk(p.a)}`),
                " and ",
                A.math(`\\mathbf{b} = ${ijk(p.b)}`),
                ", find λ such that ",
                A.math("\\mathbf{a} + \\lambda\\mathbf{b}"),
                " is parallel to i.",
              ],
            },
          ],
          answer: A.exact(lambda),
          wrong: [
            {
              code: "GEO.VECTOR.DIRECTION",
              value: A.exact(lambda.neg()),
              feedback: `The j component must be 0: ${p.a[1]} + λ(${p.b[1]}) = 0.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.a[1]} + ${p.b[1] < 0 ? `(${p.b[1]})` : p.b[1]}\\lambda = 0 \\Rightarrow \\lambda = ${toLatex(lambda)}`,
            },
          ],
        });
      }
      default: {
        const k = 3;
        const w = p.claimTrue ? scale(-k, p.a) : add(p.a, [1, 0]);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo says ",
            A.math(ijk(w)),
            " is parallel to ",
            A.math(`\\mathbf{a} = ${ijk(p.a)}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. It is −${k}a: a scalar multiple, pointing the opposite way along the same line.`,
                  correct: true,
                },
                {
                  text: "False. Parallel vectors must point the same way.",
                  code: "GEO.VECTOR.DIRECTION",
                },
                { text: "False. Its components are different.", code: "GEO.VECTOR.COMPONENTS" },
              ]
            : [
                {
                  text: "False. It is not a scalar multiple of a: the components are not in the same ratio.",
                  correct: true,
                },
                { text: "True. Its components are close to a's.", code: "GEO.VECTOR.COMPONENTS" },
                {
                  text: "True. All vectors in the plane are parallel.",
                  code: "GEO.VECTOR.DIRECTION",
                },
              ],
          solution: [
            {
              say: "Vectors are parallel when one is a scalar multiple of the other (a negative scalar reverses the direction).",
            },
          ],
        });
      }
    }
  },

  verify() {
    return true;
  },
});
