/**
 * @statement FM-CP-10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-10: Find invariant points and lines of a linear transformation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { mat } from "../shared/mat.ts";

/** Matrices with a line of invariant points, and that line. */
const FIXED: { m: (k: number) => number[][]; line: string; wrong: string }[] = [
  {
    m: (k) => [
      [1, k],
      [0, 1],
    ],
    line: "y = 0",
    wrong: "x = 0",
  },
  {
    m: (k) => [
      [1, 0],
      [k, 1],
    ],
    line: "x = 0",
    wrong: "y = 0",
  },
  {
    m: () => [
      [0, 1],
      [1, 0],
    ],
    line: "y = x",
    wrong: "y = −x",
  },
  {
    m: () => [
      [0, -1],
      [-1, 0],
    ],
    line: "y = −x",
    wrong: "y = x",
  },
];

interface Params {
  f: number;
  k: number;
  b: number;
  d: number;
  m1: number;
  m2: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MAT.INVARIANT"],

  params(rng) {
    const p = {
      f: rng.int(0, FIXED.length - 1),
      k: rng.int(2, 5),
      b: rng.int(1, 2),
      d: rng.int(-3, 4),
      m1: rng.int(-3, 3),
      m2: rng.int(-3, 3),
    };
    if (p.m1 === p.m2 || p.m1 === 0 || p.m2 === 0 || p.m1 === -p.m2)
      reject("two different non-zero gradients");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const F = FIXED[p.f] ?? (FIXED[0] as (typeof FIXED)[number]);
        return A.choice({
          rng,
          question: ["The transformation T is represented by ", A.math(mat(F.m(p.k))), "."],
          ask: "Which line is a line of invariant points of T?",
          correct: A.math(F.line),
          distractors: [
            {
              content: A.math(F.wrong),
              code: "MAT.INVARIANT",
              feedback: "Check: a point on the line must map to itself. Try (1, 1) or (1, 0).",
            },
            {
              content: A.math(
                ["x = 0", "y = 0", "y = x", "y = −x"].find((l) => l !== F.line && l !== F.wrong) ??
                  "y = 2x",
              ),
              code: "MAT.INVARIANT",
              feedback: "Every point on a line of invariant points maps to itself.",
            },
          ],
          solution: [{ say: `Points on ${F.line} map to themselves under this matrix.` }],
        });
      }
      case 2: {
        // bm² + (a − d)m − c = b(m − m1)(m − m2)
        const a = p.d - p.b * (p.m1 + p.m2);
        const c = -p.b * p.m1 * p.m2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The matrix ",
                A.math(
                  mat([
                    [a, p.b],
                    [c, p.d],
                  ]),
                ),
                " has an invariant line ",
                A.math(`y = ${p.m1 === 1 ? "" : p.m1 === -1 ? "-" : p.m1}x`),
                ".",
              ],
              ask: "Find the gradient of the other invariant line through the origin.",
            },
          ],
          answer: A.number(p.m2),
          wrong: signedWrongs(p.m2, [
            {
              code: "MAT.INVARIANT",
              value: A.number(-p.m2),
              feedback: `Substitute (x, mx): the image (${a} + ${p.b}m)x, (${c} + ${p.d}m)x must also satisfy y = mx.`,
            },
          ]),
          solution: [
            {
              say: "The image of (x, mx) must lie on y = mx: ",
              math: `${c} + ${p.d}m = m(${a} + ${p.b}m)`,
            },
            {
              say: `This gives ${p.b}m² + ${a - p.d}m + ${-c} = 0, with roots ${p.m1} and ${p.m2}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says every invariant line of a transformation is a line of invariant points.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. On an invariant line each point maps to a point on the same line, but not necessarily to itself.",
              correct: true,
            },
            { text: "True. Invariant means nothing moves.", code: "MAT.INVARIANT" },
            { text: "True. The two phrases mean the same thing.", code: "MAT.INVARIANT" },
          ],
          solution: [
            {
              say: `For example, an enlargement with scale factor ${p.k} maps every line through the origin to itself, but only the origin is fixed.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === (FIXED[p.f] ?? FIXED[0])?.line;
    if (question.key.depth === 2) return numberAnswer(question) === p.m2;
    return true;
  },
});
