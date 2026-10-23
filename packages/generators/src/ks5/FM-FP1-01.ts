/**
 * @statement FM-FP1-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-01: Use the vector product and scalar triple product, including areas and volumes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { det3 } from "../shared/mat.ts";
import { col, type Vec } from "../shared/vec.ts";

export interface Params {
  a: Vec;
  b: Vec;
  c: Vec;
}

function cross(a: Vec, b: Vec): Vec {
  const [a1 = 0, a2 = 0, a3 = 0] = a;
  const [b1 = 0, b2 = 0, b3 = 0] = b;
  return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
}

export default defineGenerator<Params>({
  id: "FM-FP1-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.CROSS"],

  params(rng) {
    const e = () => rng.int(-3, 4);
    const p = { a: [e(), e(), e()], b: [e(), e(), e()], c: [e(), e(), e()] };
    const x = cross(p.a, p.b);
    if (x.some((v) => v === 0)) reject("a cross product with no zero component");
    const v = Math.abs(det3([p.a, p.b, p.c]));
    if (v === 0 || v % 6 !== 0) reject("a tetrahedron with a whole-number volume");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const x = cross(p.a, p.b);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Find ",
            A.math("\\mathbf{a} \\times \\mathbf{b}"),
            " where ",
            A.math(`\\mathbf{a} = ${col(p.a)}`),
            " and ",
            A.math(`\\mathbf{b} = ${col(p.b)}`),
            ".",
          ],
          correct: A.math(col(x)),
          distractors: [
            {
              content: A.math(col(x.map((v) => -v))),
              code: "GEO.VECTOR.CROSS",
              feedback: "That is b × a. The order matters: b × a = −(a × b).",
            },
            {
              content: A.math(col([x[0] ?? 0, -(x[1] ?? 0), x[2] ?? 0])),
              code: "GEO.VECTOR.CROSS",
              feedback: "The middle component is a₃b₁ − a₁b₃: watch its sign.",
            },
          ],
          solution: [{ say: "Use the determinant with i, j, k on the top row: ", math: col(x) }],
        });
      case 2: {
        const v = Math.abs(det3([p.a, p.b, p.c]));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A tetrahedron has vertices at the origin and at the points with position vectors ",
                A.math(col(p.a)),
                ", ",
                A.math(col(p.b)),
                " and ",
                A.math(col(p.c)),
                ".",
              ],
              ask: "Find its volume.",
            },
          ],
          answer: A.number(v / 6),
          wrong: wrongs(v / 6, [
            {
              code: "GEO.VECTOR.CROSS",
              value: A.number(v),
              feedback:
                "|a · (b × c)| is the volume of the parallelepiped; the tetrahedron is ⅙ of it.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{6}\\left|\\mathbf{a} \\cdot (\\mathbf{b} \\times \\mathbf{c})\\right| = \\frac{${v}}{6} = ${v / 6}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ana says ",
            A.math("\\mathbf{a} \\times \\mathbf{b} = \\mathbf{b} \\times \\mathbf{a}"),
            " for any vectors a and b.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. a × b = −(b × a): they point in opposite directions. For example, with the vectors above, a × b = (${x.join(", ")}).`,
              correct: true,
            },
            {
              text: "True. Like the scalar product, the order does not matter.",
              code: "GEO.VECTOR.CROSS",
            },
            { text: "True. Both have magnitude |a||b| sin θ.", code: "GEO.VECTOR.CROSS" },
          ],
          solution: [{ say: "By the right-hand rule, swapping a and b reverses the direction." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === col(cross(p.a, p.b));
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.abs(det3([p.a, p.b, p.c])) / 6;
    return true;
  },
});
