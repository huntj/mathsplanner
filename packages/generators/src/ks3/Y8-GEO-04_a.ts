/**
 * @statement Y8-GEO-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-04.a: Construct the perpendicular bisector of a line segment
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  ab: number;
}

const RIGHT = "More than half the length of AB";

export default defineGenerator<Params>({
  id: "Y8-GEO-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CONSTRUCT.BISECTORS"],

  params(rng) {
    return { ab: rng.int(5, 14) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "To construct the perpendicular bisector of a line AB, you draw arcs from A and from B with the same compass setting.",
          ],
          ask: "How wide must the compasses be opened?",
          correct: RIGHT,
          distractors: [
            {
              content: "Less than half the length of AB",
              feedback: "The arcs from A and B would not meet.",
            },
            {
              content: "Exactly the length of AB, always",
              code: "GEO.CONSTRUCT.BISECTORS",
              feedback: "That works, but any setting more than half of AB will do.",
            },
          ],
          solution: [
            {
              say: "The arcs must cross above and below AB, so each radius must be more than half of AB.",
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The perpendicular bisector of a line AB crosses it at M. AB = ${p.ab} cm.`,
              ],
              ask: "How long is AM, in cm?",
            },
          ],
          answer: A.number(p.ab / 2),
          wrong: wrongs(p.ab / 2, [
            {
              code: "GEO.CONSTRUCT.BISECTORS",
              value: A.number(p.ab),
              feedback: "Bisect means cut in half: M is the midpoint of AB.",
            },
          ]),
          solution: [{ say: "", math: `${p.ab} \\div 2 = ${p.ab / 2} \\text{ cm}` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The perpendicular bisector of AB crosses AB at its midpoint, at right angles."],
          truth: "always",
          reasons: [
            {
              text: "Always. Perpendicular means at right angles; bisector means it cuts AB into two equal halves.",
              correct: true,
            },
            { text: "Sometimes. Only when AB is horizontal.", code: "GEO.CONSTRUCT.BISECTORS" },
            { text: "Never. It cuts the angle at A in half.", code: "GEO.CONSTRUCT.BISECTORS" },
          ],
          solution: [{ say: "Every point on it is the same distance from A and B." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === RIGHT;
    if (question.key.depth === 2) return numberAnswer(question) === p.ab / 2;
    return true;
  },
});
