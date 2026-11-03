/**
 * @statement GF-G25.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G25.b: Multiply a vector by a scalar
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { col } from "../shared/vec.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: [number, number];
  b: [number, number];
  k: number;
  m: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "GF-G25.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.SCALAR-ONE", "NPV.NEGATIVE.SIGN-RULE"],

  params(rng) {
    const p = {
      a: [rng.int(-6, 6), rng.int(-6, 6)] as [number, number],
      b: [rng.int(-5, 5), rng.int(-5, 5)] as [number, number],
      k: rng.int(2, 5),
      m: rng.int(2, 4),
      n: rng.int(2, 4),
    };
    if (p.a.includes(0) || p.b.includes(0) || p.a[0] === p.a[1])
      reject("vectors with different non-zero parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [a1, a2] = p.a;
    const [b1, b2] = p.b;
    switch (depth) {
      case 1: {
        const right = col([p.k * a1, p.k * a2]);
        return A.choice({
          rng,
          question: [A.math(`\\mathbf{a} = ${col(p.a)}`), "."],
          ask: ["Work out ", A.math(`${p.k}\\mathbf{a}`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([p.k * a1, a2])),
              code: "GEO.VECTOR.SCALAR-ONE",
              feedback: `Multiply both parts by ${p.k}.`,
            },
            {
              content: A.math(col([a1 + p.k, a2 + p.k])),
              code: "GEO.VECTOR.SCALAR-ONE",
              feedback: `${p.k}a means a + a + … (${p.k} times): multiply, do not add.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: `${p.k}${col(p.a)} = ${right}` }],
        });
      }
      case 2: {
        const right = col([p.m * a1 - p.n * b1, p.m * a2 - p.n * b2]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.math(`\\mathbf{a} = ${col(p.a)}`),
            " and ",
            A.math(`\\mathbf{b} = ${col(p.b)}`),
            ".",
          ],
          ask: ["Work out ", A.math(`${p.m}\\mathbf{a} - ${p.n}\\mathbf{b}`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([p.m * a1 + p.n * b1, p.m * a2 + p.n * b2])),
              code: "NPV.NEGATIVE.SIGN-RULE",
              feedback: `Subtract ${p.n}b; watch the signs when b has negative parts.`,
            },
            {
              content: A.math(col([p.m * a1 - b1, p.m * a2 - b2])),
              code: "GEO.VECTOR.SCALAR-ONE",
              feedback: `Multiply b by ${p.n} before subtracting.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "",
              math: `${col([p.m * a1, p.m * a2])} - ${col([p.n * b1, p.n * b2])} = ${right}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                A.math("-\\mathbf{a}"),
                " is the same length as ",
                A.math("\\mathbf{a}"),
                " but points in the opposite direction.",
              ],
              truth: true,
              reasons: [
                {
                  text: "True. Every part of a changes sign, so the length stays the same and the direction reverses.",
                  correct: true,
                },
                { text: "False. −a is shorter than a.", code: "GEO.VECTOR.SCALAR-ONE" },
                { text: "False. Only the top number changes sign.", code: "GEO.VECTOR.SCALAR-ONE" },
              ],
              solution: [
                { say: "A negative scalar reverses the direction; its size scales the length." },
              ],
            }),
          [
            {
              statement:
                "Ana says $3\\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -3 \\end{pmatrix}$.",
              truth: true,
              right: "True. Multiply each component by 3.",
              wrong: [
                ["False. It is (6, −1).", "GEO.VECTOR.SCALAR-ONE"],
                ["False. It is (5, 2).", "GEO.VECTOR.SCALAR-ONE"],
              ],
            },
            {
              claim: "$2\\mathbf{a}$ points in the same direction as $\\mathbf{a}$.",
              truth: "always",
              right: "Always. It is twice as long, in the same direction.",
              wrong: [
                ["Never. It points the other way.", "NPV.NEGATIVE.SIGN-RULE"],
                ["Sometimes. Only for short vectors."],
              ],
            },
            {
              statement:
                "Raj says $-2\\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix} = \\begin{pmatrix} -8 \\\\ -6 \\end{pmatrix}$.",
              truth: false,
              right: "False. −2 × −3 = 6: the answer is (−8, 6).",
              wrong: [
                ["True. Multiply each part by −2 and keep the signs.", "NPV.NEGATIVE.SIGN-RULE"],
                ["True. A negative scalar makes both negative.", "NPV.NEGATIVE.SIGN-RULE"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === col([p.k * p.a[0], p.k * p.a[1]]);
    if (question.key.depth === 2)
      return (
        chosenText(question) === col([p.m * p.a[0] - p.n * p.b[0], p.m * p.a[1] - p.n * p.b[1]])
      );
    return true;
  },
});
