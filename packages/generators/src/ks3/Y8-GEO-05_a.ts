/**
 * @statement Y8-GEO-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-05.a: Use alternate angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { parallelAngles } from "../shared/geo.ts";

interface Params {
  angle: number;
}

export default defineGenerator<Params>({
  id: "Y8-GEO-05.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY", "GEO.ANGLES.STRAIGHT-LINE-360"],

  params(rng) {
    return { angle: rng.int(35, 80) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The diagram shows two parallel lines.",
            A.figure(parallelAngles(p.angle, "alternate")),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [
            {
              code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
              value: A.degrees(180 - p.angle),
              feedback: "These are alternate angles (a Z shape), which are equal.",
            },
          ]),
          solution: [{ say: "Alternate angles are equal: ", math: `x = ${p.angle}^\\circ` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Two parallel lines are crossed by a transversal. An angle of ${p.angle}° has an alternate angle y. The angle next to y on the same straight line is z.`,
              ],
              ask: "Find z.",
            },
          ],
          answer: A.degrees(180 - p.angle),
          wrong: wrongs(180 - p.angle, [
            {
              code: "GEO.ANGLES.STRAIGHT-LINE-360",
              value: A.degrees(360 - p.angle),
              feedback: "Angles on a straight line add up to 180°.",
            },
          ]),
          solution: [
            {
              say: `y = ${p.angle}° (alternate), so `,
              math: `z = 180^\\circ - ${p.angle}^\\circ = ${180 - p.angle}^\\circ`,
            },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Alternate angles on parallel lines add up to 180°."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. Alternate angles are equal, so they add to 180° only when both are 90°.",
              correct: true,
            },
            {
              text: "Always. They are on opposite sides of the transversal.",
              code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
            },
            { text: "Never. They add up to 360°.", code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY" },
          ],
          solution: [{ say: "Alternate: equal. Co-interior: add to 180°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.angle;
    if (question.key.depth === 2) return numberAnswer(question) === 180 - p.angle;
    return true;
  },
});
