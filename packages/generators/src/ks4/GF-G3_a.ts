/**
 * @statement GF-G3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G3.a: Use angle facts with parallel lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { parallelAngles } from "../shared/geo.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  angle: number;
  corresponding: boolean;
}

export default defineGenerator<Params>({
  id: "GF-G3.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY", "GEO.PARALLEL.CO-INTERIOR-EQUAL"],

  params(rng) {
    return { angle: rng.int(35, 80), corresponding: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const kind = p.corresponding ? "corresponding" : "alternate";
        return A.standard({
          question: [
            "The diagram shows two parallel lines.",
            A.figure(parallelAngles(p.angle, kind)),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [
            {
              code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
              value: A.degrees(180 - p.angle),
              feedback: `These are ${kind} angles, which are equal.`,
            },
          ]),
          solution: [
            {
              say: `${kind === "corresponding" ? "Corresponding" : "Alternate"} angles on parallel lines are equal: `,
              math: `x = ${p.angle}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const v = 180 - p.angle;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The diagram shows two parallel lines.",
                A.figure(parallelAngles(p.angle, "co-interior")),
              ],
              ask: "Find the angle x.",
            },
            {
              question: [
                "Two parallel lines are crossed by a straight line.",
                A.figure(parallelAngles(p.angle, "co-interior")),
              ],
              ask: "Work out x, giving a reason.",
            },
          ],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
              value: A.degrees(p.angle),
              feedback: "These are co-interior angles: they add up to 180°.",
            },
          ]),
          solution: [
            {
              say: "Co-interior angles add up to 180°: ",
              math: `x = 180^\\circ - ${p.angle}^\\circ = ${v}^\\circ`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Mo says co-interior angles on parallel lines are always equal."],
              truth: false,
              reasons: [
                {
                  text: `False. Co-interior angles add up to 180°, so they are only equal when both are 90°. Here, ${p.angle}° pairs with ${180 - p.angle}°.`,
                  correct: true,
                },
                {
                  text: "True. Angles between parallel lines are always equal.",
                  code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
                },
                {
                  text: "True. Like alternate angles, they make a Z shape.",
                  code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
                },
              ],
              solution: [{ say: "Co-interior angles make a C (or U) shape and add to 180°." }],
            }),
          [
            {
              statement:
                "A line crosses two parallel lines. One alternate angle is 70°. Kai says the other is 70°.",
              truth: true,
              right: "True. Alternate angles on parallel lines are equal.",
              wrong: [
                ["False. It is 110°.", "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY"],
                ["False. It is 20°."],
              ],
            },
            {
              claim: "Co-interior angles on parallel lines add up to 180°.",
              truth: "always",
              right: "Always. One is supplementary to an angle equal to the other.",
              wrong: [
                ["Never. They are equal.", "GEO.PARALLEL.CO-INTERIOR-EQUAL"],
                ["Sometimes. Only for right angles."],
              ],
            },
            {
              statement: "One co-interior angle is 65°. Bea says the other is 65°.",
              truth: false,
              right: "False. Co-interior angles add to 180°: 115°.",
              wrong: [
                ["True. Co-interior angles are equal.", "GEO.PARALLEL.CO-INTERIOR-EQUAL"],
                ["True. They are on the same side.", "GEO.PARALLEL.CO-INTERIOR-EQUAL"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.angle;
    if (question.key.depth === 2) return numberAnswer(question) === 180 - p.angle;
    return true;
  },
});
