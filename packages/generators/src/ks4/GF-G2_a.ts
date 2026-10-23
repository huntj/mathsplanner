/**
 * @statement GF-G2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G2.a: Use standard ruler and compass constructions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const NEEDS: [string, string][] = [
  [
    "the points that are the same distance from two points A and B",
    "The perpendicular bisector of AB",
  ],
  ["the points that are the same distance from two lines AB and AC", "The bisector of angle BAC"],
  ["the shortest distance from a point P to a line", "The perpendicular from P to the line"],
];

const ANGLES: [number, string][] = [
  [60, "Construct an equilateral triangle"],
  [30, "Construct an equilateral triangle, then bisect one of its angles"],
  [90, "Construct a perpendicular bisector of a line"],
  [45, "Construct a perpendicular, then bisect the right angle"],
];

interface Params {
  need: number;
  angle: number;
  length: number;
}

export default defineGenerator<Params>({
  id: "GF-G2.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CONSTRUCT.BISECTORS", "GEO.LOCUS.TYPE"],

  params(rng) {
    return {
      need: rng.int(0, NEEDS.length - 1),
      angle: rng.int(0, ANGLES.length - 1),
      length: rng.int(5, 12),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, right] = NEEDS[p.need] ?? NEEDS[0] ?? ["", ""];
        return A.choice({
          rng,
          question: [`Which construction finds ${what}?`],
          correct: right,
          distractors: NEEDS.filter((_, i) => i !== p.need).map(([, other]) => ({
            content: other,
            code: "GEO.CONSTRUCT.BISECTORS",
            feedback:
              "Perpendicular bisectors are about two points; angle bisectors are about two lines.",
          })),
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const [angle, right] = ANGLES[p.angle] ?? ANGLES[0] ?? [60, ""];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Using only a ruler and compasses, how can you make an angle of ${angle}°?`],
          correct: right,
          distractors: ANGLES.filter((_, i) => i !== p.angle)
            .slice(0, 2)
            .map(([other, how]) => ({
              content: how,
              feedback: `That makes an angle of ${other}°.`,
            })),
          solution: [{ say: `${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Every point on the perpendicular bisector of a line AB, ${p.length} cm long, is the same distance from A as from B.`,
          ],
          truth: true,
          reasons: [
            {
              text: "True. The perpendicular bisector is exactly the set of points equidistant from A and B.",
              correct: true,
            },
            {
              text: "False. Only the midpoint of AB is the same distance from both.",
              code: "GEO.LOCUS.TYPE",
            },
            {
              text: "False. That is true of the angle bisector, not the perpendicular bisector.",
              code: "GEO.CONSTRUCT.BISECTORS",
            },
          ],
          solution: [{ say: "Each point on it makes an isosceles triangle with A and B." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === NEEDS[p.need]?.[1];
    if (question.key.depth === 2) return chosenText(question) === ANGLES[p.angle]?.[1];
    return true;
  },
});
