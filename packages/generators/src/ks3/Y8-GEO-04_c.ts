/**
 * @statement Y8-GEO-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-04.c: Bisect an angle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y8-GEO-04.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CONSTRUCT.BISECTORS", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    return { a: rng.int(12, 85) * 2, b: rng.int(6, 22) * 4 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [`An angle of ${p.a}° is bisected.`],
          ask: "What size is each of the two new angles?",
          answer: A.degrees(p.a / 2),
          wrong: wrongs(p.a / 2, [
            {
              code: "GEO.CONSTRUCT.BISECTORS",
              value: A.degrees(90),
              feedback:
                "An angle bisector cuts the angle in half; it is not perpendicular to anything.",
            },
          ]),
          solution: [{ say: "", math: `${p.a}^\\circ \\div 2 = ${p.a / 2}^\\circ` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `An angle of ${p.b}° is bisected, and then one of the two halves is bisected again.`,
              ],
              ask: "What is the size of each of the smallest angles?",
            },
          ],
          answer: A.degrees(p.b / 4),
          wrong: wrongs(p.b / 4, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.degrees(p.b / 2),
              feedback: "It has been halved twice.",
            },
          ]),
          solution: [{ say: "", math: `${p.b}^\\circ \\div 2 \\div 2 = ${p.b / 4}^\\circ` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "Every point on the bisector of an angle is the same distance from the two arms of the angle.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. That is why the angle bisector is the locus of points equidistant from two lines.",
              correct: true,
            },
            {
              text: "Never. The points are the same distance from the ends of the arms.",
              code: "GEO.CONSTRUCT.BISECTORS",
            },
            { text: "Sometimes. Only for a right angle.", code: "GEO.CONSTRUCT.BISECTORS" },
          ],
          solution: [{ say: "Distance to a line is measured at right angles to it." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a / 2;
    if (question.key.depth === 2) return numberAnswer(question) === p.b / 4;
    return true;
  },
});
