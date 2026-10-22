/**
 * @statement AL-P10.1b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P10.1b: Use vectors in three dimensions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { col, mag, sub } from "../shared/vec.ts";

/** Whole-number magnitudes in 3D: (a, b, c) with a² + b² + c² = d². */
const TRIPLES: [number, number, number, number][] = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [2, 6, 9, 11],
  [3, 4, 12, 13],
  [2, 10, 11, 15],
];

interface Params {
  t: number;
  signs: [number, number, number];
  A: [number, number, number];
  B: [number, number, number];
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P10.1b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.MAGNITUDE", "GEO.VECTOR.POSITION"],

  params(rng) {
    const A_: [number, number, number] = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)];
    const B_: [number, number, number] = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)];
    if (A_.some((x, i) => x === B_[i]) || A_.every((x) => x === 0))
      reject("every coordinate different");
    return {
      t: rng.int(0, TRIPLES.length - 1),
      signs: [rng.pick([1, -1]), rng.pick([1, -1]), rng.pick([1, -1])],
      A: A_,
      B: B_,
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, z, d] = TRIPLES[p.t] ?? (TRIPLES[0] as [number, number, number, number]);
    const v = [x * p.signs[0], y * p.signs[1], z * p.signs[2]];
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the magnitude of the vector ", A.math(col(v)), "."],
          answer: A.number(d),
          wrong: [
            {
              code: "GEO.VECTOR.MAGNITUDE",
              value: A.number(x + y + z),
              feedback: "Use Pythagoras in 3D: √(x² + y² + z²).",
            },
          ].filter(() => x + y + z !== d),
          solution: [
            { say: "", math: `\\sqrt{${x}^2 + ${y}^2 + ${z}^2} = \\sqrt{${d * d}} = ${d}` },
          ],
        });
      case 2: {
        const right = sub(p.B, p.A);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A has position vector ",
            A.math(col(p.A)),
            " and B has position vector ",
            A.math(col(p.B)),
            ".",
          ],
          ask: ["Find ", A.math("\\overrightarrow{AB}"), "."],
          correct: A.math(col(right)),
          distractors: [
            {
              content: A.math(col(sub(p.A, p.B))),
              code: "GEO.VECTOR.POSITION",
              feedback: "AB = b − a: end minus start.",
            },
            {
              content: A.math(col(p.A.map((a, i) => a + (p.B[i] ?? 0)))),
              code: "GEO.VECTOR.POSITION",
              feedback: "Subtract the position vectors: AB = b − a.",
            },
          ].filter(distinctFrom(A.math(col(right)))),
          solution: [
            { say: "", math: `\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a} = ${col(right)}` },
          ],
        });
      }
      default: {
        const claimed = p.claimTrue ? d : x + y + z;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Asha says the magnitude of ", A.math(col([x, y, z])), ` is ${claimed}.`],
          truth: claimed === d,
          reasons:
            claimed === d
              ? [
                  { text: `True. √(${x}² + ${y}² + ${z}²) = √${d * d} = ${d}.`, correct: true },
                  { text: `False. It is ${x + y + z}.`, code: "GEO.VECTOR.MAGNITUDE" },
                  { text: "False. 3D vectors have no magnitude." },
                ]
              : [
                  { text: `False. Square, add and square root: √${d * d} = ${d}.`, correct: true },
                  { text: "True. Add the components.", code: "GEO.VECTOR.MAGNITUDE" },
                  {
                    text: "True. The magnitude is the sum of the sizes of the components.",
                    code: "GEO.VECTOR.MAGNITUDE",
                  },
                ],
          solution: [{ say: "|v| = √(x² + y² + z²)." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        numberAnswer(question) ===
        mag([1, 1, 1].map((_, i) => (TRIPLES[p.t] ?? (TRIPLES[0] as number[]))[i] ?? 0))
      );
    return true;
  },
});
