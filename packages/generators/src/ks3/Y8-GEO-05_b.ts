/**
 * @statement Y8-GEO-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-05.b: Use corresponding angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { parallelAngles } from "../shared/geo.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  angle: number;
}

export default defineGenerator<Params>({
  id: "Y8-GEO-05.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY", "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY"],

  params(rng) {
    return { angle: rng.int(100, 145) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The diagram shows two parallel lines.",
            A.figure(parallelAngles(p.angle, "corresponding")),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [
            {
              code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
              value: A.degrees(180 - p.angle),
              feedback: "These are corresponding angles (an F shape), which are equal.",
            },
          ]),
          solution: [{ say: "Corresponding angles are equal: ", math: `x = ${p.angle}^\\circ` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Two parallel lines are crossed by a transversal. An angle of ${p.angle}° has a corresponding angle y. The angle vertically opposite y is w.`,
              ],
              ask: "Find w.",
            },
          ],
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [
            {
              code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
              value: A.degrees(180 - p.angle),
              feedback: "Vertically opposite angles are equal too.",
            },
          ]),
          solution: [
            {
              say: `y = ${p.angle}° (corresponding), and w = y (vertically opposite): `,
              math: `w = ${p.angle}^\\circ`,
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Rae says corresponding angles are only equal when the two lines are parallel.",
              ],
              truth: true,
              reasons: [
                {
                  text: "True. If the lines are not parallel, the transversal meets them at different angles.",
                  correct: true,
                },
                {
                  text: "False. Corresponding angles are always equal.",
                  code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
                },
                {
                  text: "False. They always add to 180°.",
                  code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
                },
              ],
              solution: [{ say: "Equal corresponding angles are also a test for parallel lines." }],
            }),
          [
            {
              statement:
                "A line crosses two parallel lines. One angle is 50°. Ben says the angle corresponding to it is 130°.",
              truth: false,
              right: "False. Corresponding angles on parallel lines are equal, so it is 50°.",
              wrong: [
                [
                  "True. Corresponding angles add up to 180°.",
                  "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
                ],
                [
                  "True. It is opposite, and opposite angles add up to 180°.",
                  "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
                ],
              ],
            },
            {
              statement:
                "Ada says corresponding angles being equal, with vertically opposite angles, shows that alternate angles are equal.",
              truth: true,
              right:
                "True. An alternate angle is vertically opposite a corresponding angle, so both equal the first angle.",
              wrong: [
                ["False. Alternate angles add up to 180°.", "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY"],
                [
                  "False. Vertically opposite angles add up to 180°.",
                  "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
                ],
              ],
            },
            {
              claim: "Co-interior angles between parallel lines are equal.",
              truth: "sometimes",
              right:
                "Sometimes. Co-interior angles add up to 180°, so they are equal only when both are 90°.",
              wrong: [
                ["Always. They are on the same side of the line."],
                ["Never. They add up to 360°."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.angle;
    return true;
  },
});
