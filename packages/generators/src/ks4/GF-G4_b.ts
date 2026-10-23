/**
 * @statement GF-G4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G4.b: Use the properties of triangles and other plane figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const TRIANGLES: [string, string, string[]][] = [
  ["exactly one line of symmetry", "Isosceles", ["Equilateral", "Scalene"]],
  ["three lines of symmetry", "Equilateral", ["Isosceles", "Right-angled"]],
  ["no equal sides and no equal angles", "Scalene", ["Isosceles", "Equilateral"]],
];
const POLYGONS = ["pentagon", "hexagon", "octagon", "decagon"];

interface Params {
  tri: number;
  poly: number;
  a: number;
  b: number;
  extra: number;
}

export default defineGenerator<Params>({
  id: "GF-G4.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLYGON.REGULAR-SIDES-ONLY", "GEO.TRIANGLE.INEQUALITY"],

  params(rng) {
    const a = rng.int(2, 8);
    const b = rng.int(2, 8);
    return {
      tri: rng.int(0, TRIANGLES.length - 1),
      poly: rng.int(0, POLYGONS.length - 1),
      a,
      b,
      extra: rng.int(0, 3),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, right, others] = TRIANGLES[p.tri] ?? TRIANGLES[0] ?? ["", "", []];
        return A.choice({
          rng,
          question: [`Which type of triangle has ${what}?`],
          correct: right,
          distractors: others.map((o) => ({
            content: o,
            feedback: `Think about the sides and angles of a ${o.toLowerCase()} triangle.`,
          })),
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const name = POLYGONS[p.poly] ?? "hexagon";
        const right = "Not necessarily: its angles must all be equal too";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`A ${name} has all its sides equal. Is it a regular ${name}?`],
          correct: right,
          distractors: [
            {
              content: "Yes, because all its sides are equal",
              code: "GEO.POLYGON.REGULAR-SIDES-ONLY",
              feedback: "A regular polygon needs equal sides and equal angles. Think of a rhombus.",
            },
            {
              content: `No, a ${name} can never be regular`,
              feedback: `A regular ${name} has equal sides and equal angles.`,
            },
          ],
          solution: [
            {
              say: "A rhombus has equal sides but is not a regular quadrilateral unless it is a square.",
            },
          ],
        });
      }
      default: {
        const c = p.a + p.b + p.extra;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Tia says she can draw a triangle with sides ${p.a} cm, ${p.b} cm and ${c} cm.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.a} + ${p.b} = ${p.a + p.b}, which is not more than ${c}, so the two shorter sides cannot meet.`,
              correct: true,
            },
            { text: "True. Any three lengths make a triangle.", code: "GEO.TRIANGLE.INEQUALITY" },
            {
              text: `True. The longest side, ${c} cm, goes along the bottom.`,
              code: "GEO.TRIANGLE.INEQUALITY",
            },
          ],
          solution: [{ say: "The two shorter sides must add up to more than the longest side." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === TRIANGLES[p.tri]?.[1];
    if (question.key.depth === 2)
      return chosenText(question) === "Not necessarily: its angles must all be equal too";
    return true;
  },
});
