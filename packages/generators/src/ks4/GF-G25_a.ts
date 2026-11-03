/**
 * @statement GF-G25.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G25.a: Add and subtract vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { col } from "../shared/vec.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: [number, number];
  b: [number, number];
}

export default defineGenerator<Params>({
  id: "GF-G25.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.COMPONENTS", "GEO.VECTOR.DIRECTION"],

  params(rng) {
    const p = {
      a: [rng.int(-6, 6), rng.int(-6, 6)] as [number, number],
      b: [rng.int(-6, 6), rng.int(-6, 6)] as [number, number],
    };
    if (p.a.includes(0) || p.b.includes(0) || p.a[0] === p.b[0] || p.a[1] === p.b[1])
      reject("vectors with different non-zero parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [a1, a2] = p.a;
    const [b1, b2] = p.b;
    const given = [
      "",
      A.math(`\\mathbf{a} = ${col(p.a)}`),
      " and ",
      A.math(`\\mathbf{b} = ${col(p.b)}`),
      ".",
    ];
    switch (depth) {
      case 1: {
        const right = col([a1 + b1, a2 + b2]);
        return A.choice({
          rng,
          question: given,
          ask: ["Work out ", A.math("\\mathbf{a} + \\mathbf{b}"), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([a1 - b1, a2 - b2])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Add the top numbers, then add the bottom numbers.",
            },
            {
              content: A.math(col([a1 + b2, a2 + b1])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Add top to top and bottom to bottom.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "",
              math: `${col([`${a1} + ${b1}`, `${a2} + ${b2}`])} = ${right}`.replace(/\+ -/g, "- "),
            },
          ],
        });
      }
      case 2: {
        const right = col([a1 - b1, a2 - b2]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: given,
          ask: ["Work out ", A.math("\\mathbf{a} - \\mathbf{b}"), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([b1 - a1, b2 - a2])),
              code: "GEO.VECTOR.DIRECTION",
              feedback: "That is b − a, which points the opposite way.",
            },
            {
              content: A.math(col([a1 + b1, a2 + b2])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Subtract each part of b from the matching part of a.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: right }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [A.math("\\mathbf{a} + \\mathbf{b} = \\mathbf{b} + \\mathbf{a}")],
              truth: "always",
              reasons: [
                {
                  text: "Always. Following a then b, or b then a, ends at the same point: the two routes are sides of a parallelogram.",
                  correct: true,
                },
                {
                  text: "Never. Changing the order changes the direction.",
                  code: "GEO.VECTOR.DIRECTION",
                },
                {
                  text: "Sometimes. Only when a and b are parallel.",
                  code: "GEO.VECTOR.DIRECTION",
                },
              ],
              solution: [{ say: "Addition of vectors is commutative; subtraction is not." }],
            }),
          [
            {
              statement:
                "Kai says $\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix} + \\begin{pmatrix} 1 \\\\ -5 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$.",
              truth: true,
              right: "True. Add the tops and add the bottoms.",
              wrong: [
                ["False. It is (2, −15).", "GEO.VECTOR.COMPONENTS"],
                ["False. It is (5, −4).", "GEO.VECTOR.COMPONENTS"],
              ],
            },
            {
              claim: "$\\mathbf{a} - \\mathbf{b} = \\mathbf{b} - \\mathbf{a}$.",
              truth: "sometimes",
              right: "Sometimes. Only when a = b; otherwise they point in opposite directions.",
              wrong: [
                ["Always. Order does not matter.", "GEO.VECTOR.DIRECTION"],
                ["Never. Even when a = b."],
              ],
            },
            {
              statement:
                "Mia says $\\begin{pmatrix} 5 \\\\ 2 \\end{pmatrix} - \\begin{pmatrix} 1 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$.",
              truth: false,
              right: "False. 2 − 4 = −2: the answer is (4, −2).",
              wrong: [
                ["True. 5 − 1 = 4 and 2 + 4 = 6.", "GEO.VECTOR.COMPONENTS"],
                ["True. Subtract the tops, add the bottoms.", "GEO.VECTOR.DIRECTION"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === col([p.a[0] + p.b[0], p.a[1] + p.b[1]]);
    if (question.key.depth === 2)
      return chosenText(question) === col([p.a[0] - p.b[0], p.a[1] - p.b[1]]);
    return true;
  },
});
