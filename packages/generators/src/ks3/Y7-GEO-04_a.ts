/**
 * @statement Y7-GEO-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-04.a: Use conventional terms and notation for lines and angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { triangle } from "../shared/geo.ts";

const NOTATION: [string, string, string][] = [
  ["AB \\parallel CD", "AB is parallel to CD", "AB is perpendicular to CD"],
  ["AB \\perp CD", "AB is perpendicular to CD", "AB is parallel to CD"],
  ["AB = CD", "AB and CD are the same length", "AB and CD are parallel"],
];

interface Params {
  A: number;
  B: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.ANGLES.NAMING", "GEO.LINES.PARALLEL-PERPENDICULAR"],

  params(rng) {
    const p = { A: rng.int(40, 80), B: rng.int(40, 80), n: rng.int(0, NOTATION.length - 1) };
    if (Math.abs(p.A - p.B) < 10) reject("a clear scalene triangle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Which name is correct for the marked angle?",
            A.figure(triangle(p.A, 5, p.B, {}, { B: "?" })),
          ],
          correct: A.math("\\angle ABC"),
          distractors: [
            {
              content: A.math("\\angle BAC"),
              code: "GEO.ANGLES.NAMING",
              feedback:
                "The middle letter is the vertex, where the angle is. The marked angle is at B.",
            },
            {
              content: A.math("\\angle BCA"),
              code: "GEO.ANGLES.NAMING",
              feedback: "The middle letter must be B, the corner where the angle is.",
            },
          ],
          solution: [{ say: "The angle is at B, between BA and BC: ", math: "\\angle ABC" }],
        });
      case 2: {
        const [sym, right, wrong] = NOTATION[p.n] ?? NOTATION[0] ?? ["", "", ""];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["What does ", A.math(sym), " mean?"],
          correct: right,
          distractors: [
            {
              content: wrong,
              code: "GEO.LINES.PARALLEL-PERPENDICULAR",
              feedback: "∥ means parallel; ⊥ means perpendicular (at right angles).",
            },
            {
              content: "AB and CD cross at a point",
              feedback: "Look at the symbol between the two lines.",
            },
          ].filter((d) => d.content !== right),
          solution: [{ say: `${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ola says ",
            A.math("\\angle PQR"),
            " and ",
            A.math("\\angle RQP"),
            " are the same angle.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. Both have Q in the middle, so both name the angle at Q between QP and QR.",
              correct: true,
            },
            {
              text: "False. The first letter shows where the angle is.",
              code: "GEO.ANGLES.NAMING",
            },
            {
              text: "False. Reversing the letters gives the reflex angle.",
              code: "GEO.ANGLES.NAMING",
            },
          ],
          solution: [{ say: "Only the middle letter, the vertex, fixes which angle it is." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === "\\angle ABC";
    if (question.key.depth === 2) return chosenText(question) === NOTATION[p.n]?.[1];
    return true;
  },
});
