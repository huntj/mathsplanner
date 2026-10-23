/**
 * @statement GF-G3.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G3.c: Use angle facts in polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const NAMES: Record<number, string> = {
  5: "pentagon",
  6: "hexagon",
  7: "heptagon",
  8: "octagon",
  9: "nonagon",
  10: "decagon",
  12: "dodecagon",
};
const REGULAR = [5, 6, 8, 9, 10, 12, 15, 18, 20];

interface Params {
  n: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "GF-G3.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLYGON.SUM-N-TIMES-180", "GEO.POLYGON.INTERIOR-EXTERIOR"],

  params(rng) {
    return { n: rng.pick([5, 6, 7, 8, 9, 10, 12]), m: rng.pick(REGULAR) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.n - 2) * 180;
        return A.standard({
          question: [`Find the sum of the interior angles of a ${NAMES[p.n]}.`],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.POLYGON.SUM-N-TIMES-180",
              value: A.degrees(p.n * 180),
              feedback: `A ${NAMES[p.n]} splits into ${p.n - 2} triangles from one corner, not ${p.n}.`,
            },
          ]),
          solution: [{ say: "", math: `(${p.n} - 2) \\times 180^\\circ = ${v}^\\circ` }],
        });
      }
      case 2: {
        const v = 180 - 360 / p.m;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Find the size of each interior angle of a regular polygon with ${p.m} sides.`,
              ],
            },
            {
              question: [`A floor tile is a regular polygon with ${p.m} sides.`],
              ask: "Find the size of each of its interior angles.",
            },
          ],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
              value: A.degrees(360 / p.m),
              feedback: `360° ÷ ${p.m} is the exterior angle. The interior angle is 180° minus that.`,
            },
          ]),
          solution: [{ say: "", math: `180^\\circ - \\frac{360^\\circ}{${p.m}} = ${v}^\\circ` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The exterior angles of a convex polygon add up to 360°."],
          truth: "always",
          reasons: [
            {
              text: `Always. Walking round the polygon you make one full turn, whatever the number of sides. For a regular ${p.m}-gon, ${p.m} × ${360 / p.m}° = 360°.`,
              correct: true,
            },
            {
              text: "Sometimes. Only for regular polygons.",
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
            },
            {
              text: "Never. They add up to (n − 2) × 180°.",
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
            },
          ],
          solution: [{ say: "Interior angle + exterior angle = 180° at every corner." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.n - 2) * 180;
    if (question.key.depth === 2) return numberAnswer(question) === 180 - 360 / p.m;
    return true;
  },
});
