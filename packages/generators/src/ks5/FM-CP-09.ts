/**
 * @statement FM-CP-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-09: Use 2×2 and 3×3 matrices for linear transformations: reflections, rotations,
// enlargements, stretches, shears; combine transformations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mat, mul } from "../shared/mat.ts";

/** Transformations of the plane, each with the one most often mistaken for it. */
const TRANSFORMS: { name: string; m: number[][]; partner: number }[] = [
  {
    name: "a rotation of 90° anticlockwise about the origin",
    m: [
      [0, -1],
      [1, 0],
    ],
    partner: 1,
  },
  {
    name: "a rotation of 90° clockwise about the origin",
    m: [
      [0, 1],
      [-1, 0],
    ],
    partner: 0,
  },
  {
    name: "a reflection in the line y = x",
    m: [
      [0, 1],
      [1, 0],
    ],
    partner: 3,
  },
  {
    name: "a reflection in the line y = −x",
    m: [
      [0, -1],
      [-1, 0],
    ],
    partner: 2,
  },
  {
    name: "a reflection in the x-axis",
    m: [
      [1, 0],
      [0, -1],
    ],
    partner: 5,
  },
  {
    name: "a reflection in the y-axis",
    m: [
      [-1, 0],
      [0, 1],
    ],
    partner: 4,
  },
];

const get = (i: number) => TRANSFORMS[i] ?? (TRANSFORMS[0] as (typeof TRANSFORMS)[number]);
const same = (a: number[][], b: number[][]) => JSON.stringify(a) === JSON.stringify(b);

export interface Params {
  t: number;
  other: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-09",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MAT.TRANSFORM"],

  params(rng) {
    const p = {
      t: rng.int(0, TRANSFORMS.length - 1),
      other: rng.int(0, TRANSFORMS.length - 1),
      k: rng.int(2, 5),
    };
    const P = get(p.t).m;
    const Q = get(p.other).m;
    if (p.other === p.t || p.other === get(p.t).partner || same(mul(Q, P), mul(P, Q)))
      reject("two transformations that do not commute");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const T = get(p.t);
    const O = get(p.other);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Which matrix represents ${T.name}?`],
          correct: A.math(mat(T.m)),
          distractors: [
            {
              content: A.math(mat(get(T.partner).m)),
              code: "MAT.TRANSFORM",
              feedback: `That is ${get(T.partner).name}. The columns are the images of (1, 0) and (0, 1).`,
            },
            {
              content: A.math(mat(O.m)),
              code: "MAT.TRANSFORM",
              feedback: `That is ${O.name}. Check where (1, 0) and (0, 1) go.`,
            },
          ],
          solution: [
            {
              say: "The first column is the image of (1, 0) and the second column is the image of (0, 1): ",
              math: mat(T.m),
            },
          ],
        });
      case 2: {
        const QP = mul(O.m, T.m);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`P is ${T.name}. Q is ${O.name}.`],
          ask: "Which matrix represents P followed by Q?",
          correct: A.math(mat(QP)),
          distractors: [
            {
              content: A.math(mat(mul(T.m, O.m))),
              code: "MAT.TRANSFORM",
              feedback:
                "P followed by Q is QP: the first transformation is on the right, next to the vector.",
            },
            {
              content: A.math(mat(T.m.map((row, i) => row.map((x, j) => x + (O.m[i]?.[j] ?? 0))))),
              code: "MAT.TRANSFORM",
              feedback: "Combining transformations multiplies the matrices; it does not add them.",
            },
          ],
          solution: [{ say: "Apply P first, so the product is QP = ", math: mat(QP) }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Asha says the matrix ",
            A.math(
              mat([
                [p.k, 0],
                [0, 1],
              ]),
            ),
            ` represents an enlargement with scale factor ${p.k}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. It is a stretch parallel to the x-axis, scale factor ${p.k}: (0, 1) is not moved. An enlargement would be ${p.k} times the identity.`,
              correct: true,
            },
            { text: `True. The ${p.k} in the matrix is the scale factor.`, code: "MAT.TRANSFORM" },
            { text: "True. Any diagonal matrix is an enlargement.", code: "MAT.TRANSFORM" },
          ],
          solution: [{ say: `(1, 0) goes to (${p.k}, 0) but (0, 1) stays at (0, 1).` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === mat(get(p.t).m);
    if (question.key.depth === 2)
      return chosenText(question) === mat(mul(get(p.other).m, get(p.t).m));
    return true;
  },
});
