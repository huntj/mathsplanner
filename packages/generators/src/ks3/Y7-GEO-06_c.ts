/**
 * @statement Y7-GEO-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-06.c: Find interior and exterior angles of regular polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const SIDES = [5, 6, 8, 9, 10, 12, 15, 18, 20];

interface Params {
  n: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-06.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLYGON.INTERIOR-EXTERIOR"],

  params(rng) {
    return { n: rng.pick(SIDES), m: rng.pick(SIDES) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 360 / p.n;
        return A.standard({
          question: [
            `Find the size of each exterior angle of a regular polygon with ${p.n} sides.`,
          ],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
              value: A.degrees(180 - v),
              feedback: "That is the interior angle. The exterior angles share 360°.",
            },
          ]),
          solution: [{ say: "", math: `360^\\circ \\div ${p.n} = ${v}^\\circ` }],
        });
      }
      case 2: {
        const interior = 180 - 360 / p.m;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`Each interior angle of a regular polygon is ${interior}°.`],
              ask: "How many sides does it have?",
            },
          ],
          answer: A.number(p.m),
          wrong: wrongs(p.m, [
            Number.isInteger(360 / interior)
              ? {
                  code: "GEO.POLYGON.INTERIOR-EXTERIOR",
                  value: A.number(360 / interior),
                  feedback: `Use the exterior angle, 180° − ${interior}° = ${180 - interior}°, then 360° ÷ that.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: "",
              math: `180 - ${interior} = ${180 - interior}, \\; 360 \\div ${180 - interior} = ${p.m}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A regular polygon can have interior angles of 100°."],
          truth: "never",
          reasons: [
            {
              text: "Never. The exterior angle would be 80°, and 360° ÷ 80° = 4.5 is not a whole number of sides.",
              correct: true,
            },
            { text: "Always. Any angle under 180° works.", code: "GEO.POLYGON.INTERIOR-EXTERIOR" },
            {
              text: "Sometimes. If it has 100 ÷ 360 sides.",
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
            },
          ],
          solution: [{ say: "The exterior angle must divide 360° exactly." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 360 / p.n;
    if (question.key.depth === 2) return numberAnswer(question) === p.m;
    return true;
  },
});
