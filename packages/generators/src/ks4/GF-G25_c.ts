/**
 * @statement GF-G25.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G25.c: Represent vectors with diagrams and column vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";
import { col } from "../shared/vec.ts";

interface Params {
  A: [number, number];
  B: [number, number];
  t: number;
}

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 6, 10],
];

export default defineGenerator<Params>({
  id: "GF-G25.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.COMPONENTS", "GEO.VECTOR.POSITION", "GEO.VECTOR.MAGNITUDE"],

  params(rng) {
    const p = {
      A: [rng.int(-5, 5), rng.int(-5, 5)] as [number, number],
      B: [rng.int(-5, 5), rng.int(-5, 5)] as [number, number],
      t: rng.int(0, TRIPLES.length - 1),
    };
    const [dx, dy] = [p.B[0] - p.A[0], p.B[1] - p.A[1]];
    if (dx === 0 || dy === 0 || dx === dy) reject("a diagonal move with different parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const dx = p.B[0] - p.A[0];
    const dy = p.B[1] - p.A[1];
    switch (depth) {
      case 1: {
        const right = col([dx, dy]);
        return A.choice({
          rng,
          question: [
            "A is the point ",
            A.math(coord(p.A)),
            " and B is the point ",
            A.math(coord(p.B)),
            ".",
          ],
          ask: ["Write ", A.math("\\overrightarrow{AB}"), " as a column vector."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([-dx, -dy])),
              code: "GEO.VECTOR.POSITION",
              feedback: "From A to B is B − A, not A − B.",
            },
            {
              content: A.math(col([dy, dx])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "The top number is the movement across (x).",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "B − A: ", math: right }],
        });
      }
      case 2: {
        const right = coord(p.B);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A is the point ",
            A.math(coord(p.A)),
            " and ",
            A.math(`\\overrightarrow{AB} = ${col([dx, dy])}`),
            ".",
          ],
          ask: "What are the coordinates of B?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([p.A[0] - dx, p.A[1] - dy])),
              code: "GEO.VECTOR.POSITION",
              feedback: "Add the vector to A to move from A to B.",
            },
            {
              content: A.math(coord([dx, dy])),
              code: "GEO.VECTOR.POSITION",
              feedback: "The vector is a movement from A, not a position.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "",
              math: `(${p.A[0]} + ${dx}, ${p.A[1]} + ${dy}) = ${right}`.replace(/\+ -/g, "- "),
            },
          ],
        });
      }
      default: {
        const [x, y, len] = TRIPLES[p.t] ?? [3, 4, 5];
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ed says the vector ", A.math(col([x, y])), ` has length ${x + y}.`],
          truth: false,
          reasons: [
            {
              text: `False. The parts are at right angles, so use Pythagoras: √(${x}² + ${y}²) = ${len}.`,
              correct: true,
            },
            { text: "True. Add the parts to get the length.", code: "GEO.VECTOR.MAGNITUDE" },
            { text: `False. It is ${x * y}.`, code: "GEO.VECTOR.MAGNITUDE" },
          ],
          solution: [
            {
              say: "Draw the vector on squared paper: it is the hypotenuse of a right-angled triangle.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === col([p.B[0] - p.A[0], p.B[1] - p.A[1]]);
    if (question.key.depth === 2) return chosenText(question) === coord(p.B);
    return true;
  },
});
