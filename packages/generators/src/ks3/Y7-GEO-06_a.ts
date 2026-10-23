/**
 * @statement Y7-GEO-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-06.a: Use the angle sum of a triangle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { triangle } from "../shared/geo.ts";

interface Params {
  a: number;
  base: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-06.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.MULTISTEP.ONE-STEP", "GEO.ANGLES.TRIANGLE-360"],

  params(rng) {
    return { a: rng.int(25, 65), base: rng.int(25, 80) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = 90 - p.a;
        return A.standard({
          question: [
            "The triangle has a right angle at B.",
            A.figure({
              ...triangle(p.a, 5, 90, {}, { A: `${p.a}^\\circ`, B: "90^\\circ", C: "x" }),
            }),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(x),
          wrong: wrongs(x, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.degrees(180 - p.a),
              feedback: "Subtract the right angle too: 180° − 90° − the other angle.",
            },
          ]),
          solution: [{ say: "", math: `x = 180^\\circ - 90^\\circ - ${p.a}^\\circ = ${x}^\\circ` }],
        });
      }
      case 2: {
        const apex = 180 - 2 * p.base;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`An isosceles triangle has two equal angles of ${p.base}°.`],
              ask: "Find the third angle.",
            },
            {
              question: [
                A.figure(
                  triangle(
                    p.base,
                    5,
                    p.base,
                    {},
                    { A: `${p.base}^\\circ`, B: `${p.base}^\\circ`, C: "x" },
                  ),
                ),
              ],
              ask: "Find the angle x.",
            },
          ],
          answer: A.degrees(apex),
          wrong: wrongs(apex, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.degrees(180 - p.base),
              feedback: `There are two angles of ${p.base}°: subtract both from 180°.`,
            },
          ]),
          solution: [{ say: "", math: `180^\\circ - 2 \\times ${p.base}^\\circ = ${apex}^\\circ` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A triangle can have two obtuse angles."],
          truth: "never",
          reasons: [
            {
              text: "Never. Two obtuse angles already add up to more than 180°, leaving nothing for the third angle.",
              correct: true,
            },
            { text: "Sometimes. If the triangle is big enough.", code: "GEO.ANGLES.TRIANGLE-360" },
            {
              text: "Always. The angles add up to 360°, so there is room.",
              code: "GEO.ANGLES.TRIANGLE-360",
            },
          ],
          solution: [{ say: "The three angles of any triangle add up to 180°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 90 - p.a;
    if (question.key.depth === 2) return numberAnswer(question) === 180 - 2 * p.base;
    return true;
  },
});
