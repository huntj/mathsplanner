/**
 * @statement Y8-GEO-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-04.b: Construct a perpendicular from or at a point
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const STEPS = [
  "Draw an arc centred on P that crosses the line twice",
  "From the two crossing points, draw arcs of equal radius that meet",
  "Join P to the point where those arcs meet",
];

interface Params {
  step: number;
  a: number;
}

export default defineGenerator<Params>({
  id: "Y8-GEO-04.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.LINES.PARALLEL-PERPENDICULAR", "GEO.CONSTRUCT.BISECTORS"],

  params(rng) {
    const p = { step: rng.int(0, 2), a: rng.int(20, 70) };
    if (p.a % 5 !== 0) reject("a round angle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = STEPS[p.step] ?? "";
        return A.choice({
          rng,
          question: [
            `To construct the perpendicular from a point P to a line, what is step ${p.step + 1}?`,
          ],
          correct: right,
          distractors: STEPS.filter((_, i) => i !== p.step).map((s) => ({
            content: s,
            feedback:
              "Think about the order: cross the line first, then find a second point the same distance from both crossings, then join.",
          })),
          solution: [{ say: STEPS.map((s, i) => `${i + 1}. ${s}`).join(" ") }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A line is drawn from a point P to a line, making an angle of ${p.a}° with it.`,
              ],
              ask: "By how many degrees must it turn to become the perpendicular?",
            },
          ],
          answer: A.degrees(90 - p.a),
          wrong: wrongs(90 - p.a, [
            {
              code: "GEO.LINES.PARALLEL-PERPENDICULAR",
              value: A.degrees(180 - p.a),
              feedback: "Perpendicular means at 90°, not along the line (180°).",
            },
          ]),
          solution: [{ say: "", math: `90^\\circ - ${p.a}^\\circ = ${90 - p.a}^\\circ` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eli says the construction of a perpendicular from a point P to a line uses the same idea as the perpendicular bisector.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. The arc from P marks two points on the line, and the perpendicular is the perpendicular bisector of the segment between them.",
              correct: true,
            },
            { text: "False. It uses the angle bisector.", code: "GEO.CONSTRUCT.BISECTORS" },
            {
              text: "False. A perpendicular is parallel to the line.",
              code: "GEO.LINES.PARALLEL-PERPENDICULAR",
            },
          ],
          solution: [{ say: "Both rely on points equidistant from two given points." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === STEPS[p.step];
    if (question.key.depth === 2) return numberAnswer(question) === 90 - p.a;
    return true;
  },
});
