/**
 * @statement AL-P10.1a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P10.1a: Use vectors in two dimensions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { add, col, ijk, scale, sub } from "../shared/vec.ts";

interface Params {
  a: [number, number];
  b: [number, number];
  /** Depth 2: (k, q·m) parallel to (p, q). */
  p: number;
  q: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "AL-P10.1a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.COMPONENTS", "GEO.VECTOR.DIRECTION"],

  params(rng) {
    const a: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    const b: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    const p = rng.int(1, 5);
    const q = rng.int(2, 6);
    if (a.includes(0) || b.includes(0) || (a[0] === b[0] && a[1] === b[1]) || p === q)
      reject("non-zero, different vectors");
    return { a, b, p, q, m: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = add(p.a, scale(2, p.b));
        return A.choice({
          rng,
          question: [
            "Given ",
            A.math(`\\mathbf{a} = ${ijk(p.a)}`),
            " and ",
            A.math(`\\mathbf{b} = ${ijk(p.b)}`),
            ", find ",
            A.math("\\mathbf{a} + 2\\mathbf{b}"),
            ".",
          ],
          correct: A.math(ijk(right)),
          distractors: [
            {
              content: A.math(ijk(add(p.a, p.b))),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Multiply both components of b by 2 first.",
            },
            {
              content: A.math(ijk([p.a[0] + 2 * p.b[0], p.a[1] + p.b[1]])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "The scalar 2 multiplies the j component too.",
            },
            {
              content: A.math(ijk(sub(p.a, scale(2, p.b)))),
              code: "GEO.VECTOR.DIRECTION",
              feedback: "Add 2b, do not subtract it.",
            },
          ].filter(distinctFrom(A.math(ijk(right)))),
          solution: [{ say: "", math: `${col(p.a)} + 2${col(p.b)} = ${col(right)}` }],
        });
      }
      case 2: {
        const k = p.p * p.m;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The vectors ",
                A.math(col([p.p, p.q])),
                " and ",
                A.math(col(["k", p.q * p.m])),
                " are parallel.",
              ],
              ask: "Find k.",
            },
          ],
          answer: A.number(k),
          wrong: signedWrongs(k, [
            {
              code: "GEO.VECTOR.COMPONENTS",
              value: A.number((p.q * p.q * p.m) / p.p),
              feedback: `The second vector is ${p.m} times the first, so k = ${p.m} × ${p.p}.`,
            },
          ]).filter((w) => Number.isInteger(w.value.value)),
          solution: [
            {
              say: `${p.q * p.m} = ${p.m} × ${p.q}, so the second vector is ${p.m} times the first: k = ${k}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jas says that for any vectors a and b, ",
            A.math("\\mathbf{a} - \\mathbf{b} = \\mathbf{b} - \\mathbf{a}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. b − a = −(a − b): it has the same length but points the opposite way.",
              correct: true,
            },
            {
              text: "True. Subtraction of vectors can be done in either order.",
              code: "GEO.VECTOR.DIRECTION",
            },
            {
              text: "True. Both have the same magnitude, so they are equal.",
              code: "GEO.VECTOR.DIRECTION",
            },
          ],
          solution: [
            {
              say: `For example, with a = ${ijk(p.a).replace(/\\mathbf\{(.)\}/g, "$1")} and b = ${ijk(p.b).replace(/\\mathbf\{(.)\}/g, "$1")}, the two differences point opposite ways.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === p.p * p.m;
    return true;
  },
});
