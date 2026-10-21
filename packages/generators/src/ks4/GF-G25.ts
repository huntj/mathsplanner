/**
 * @statement GF-G25
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G25: Apply addition and subtraction of vectors, multiplication of vectors by a scalar, and
// diagrammatic and column representations of vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";

interface Params {
  a: [number, number];
  b: [number, number];
  k: number;
}

const col = ([x, y]: [number, number]) => `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;

export default defineGenerator<Params>({
  id: "GF-G25",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.VECTOR.COMPONENTS", "NPV.NEGATIVE.SIGN-RULE"],

  params(rng) {
    const a: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    const b: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    if (a[0] === 0 || a[1] === 0 || b[0] === 0 || b[1] === 0 || (a[0] === b[0] && a[1] === b[1]))
      reject("non-zero, different vectors");
    return { a, b, k: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b] = [p.a, p.b];
    const intro = [
      "Given ",
      A.math(`\\mathbf{a} = ${col(a)}`),
      " and ",
      A.math(`\\mathbf{b} = ${col(b)}`),
      ",",
    ];
    switch (depth) {
      case 1: {
        const right = col([a[0] + b[0], a[1] + b[1]]);
        return A.choice({
          rng,
          question: [...intro, " work out ", A.math("\\mathbf{a} + \\mathbf{b}"), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([a[0] - b[0], a[1] - b[1]])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Add the top numbers together and the bottom numbers together.",
            },
            {
              content: A.math(col([a[0] + a[1], b[0] + b[1]])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Add matching components: top with top, bottom with bottom.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: `${col(a)} + ${col(b)} = ${right}` }],
        });
      }
      case 2: {
        const right = col([p.k * a[0] - b[0], p.k * a[1] - b[1]]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [...intro, " work out ", A.math(`${p.k}\\mathbf{a} - \\mathbf{b}`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([p.k * a[0] + b[0], p.k * a[1] + b[1]])),
              code: "NPV.NEGATIVE.SIGN-RULE",
              feedback: "Subtract each component of b.",
            },
            {
              content: A.math(col([p.k * (a[0] - b[0]), p.k * (a[1] - b[1])])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: `Only a is multiplied by ${p.k}.`,
            },
            {
              content: A.math(col([a[0] - b[0], a[1] - b[1]])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: `Multiply a by ${p.k} first.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: `${p.k}${col(a)} - ${col(b)} = ${right}` }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mia says ",
            A.math("\\mathbf{a} - \\mathbf{b} = \\mathbf{b} - \\mathbf{a}"),
            " for any vectors a and b.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. b − a points the opposite way: with these vectors a − b = (${a[0] - b[0]}, ${a[1] - b[1]}) but b − a = (${b[0] - a[0]}, ${b[1] - a[1]}).`,
              correct: true,
            },
            {
              text: "True. Vectors can be subtracted in any order.",
              code: "GEO.VECTOR.COMPONENTS",
            },
            {
              text: "True. Both have the same length, so they are equal.",
              code: "GEO.VECTOR.COMPONENTS",
            },
          ],
          solution: [{ say: "", math: "\\mathbf{b} - \\mathbf{a} = -(\\mathbf{a} - \\mathbf{b})" }],
        });
      default: {
        const right = col([b[0] - a[0], b[1] - a[1]]);
        return A.multiStepContext({
          context: [
            "O is the origin. ",
            A.math(`\\overrightarrow{OA} = ${col(a)}`),
            " and ",
            A.math(`\\overrightarrow{OB} = ${col(b)}`),
            ".",
          ],
          parts: [
            {
              ask: [
                "Which expression gives ",
                A.math("\\overrightarrow{AB}"),
                "? Write it in terms of a and b.",
              ],
              answer: A.exact("\\mathbf{b} - \\mathbf{a}"),
            },
            {
              ask: [
                "Write ",
                A.math("\\overrightarrow{AB}"),
                " as a column vector. Enter the top number.",
              ],
              answer: A.number(b[0] - a[0]),
            },
          ],
          solution: [
            {
              say: "From A to B: back along OA, then along OB.",
              math: `\\overrightarrow{AB} = -\\mathbf{a} + \\mathbf{b} = ${right}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === col([p.a[0] + p.b[0], p.a[1] + p.b[1]]);
    if (question.archetype === "varied-form")
      return chosenText(question) === col([p.k * p.a[0] - p.b[0], p.k * p.a[1] - p.b[1]]);
    return true;
  },
});
