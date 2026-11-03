/**
 * @statement Y8-GEO-04.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-04.d: Use the perpendicular distance as the shortest distance from a point to a line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  x: number;
  y: number;
  c: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y8-GEO-04.d",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.DISTANCE.SLANT", "ALG.COORD.ORDER"],

  params(rng) {
    const p = { x: rng.int(2, 9), y: rng.int(2, 9), c: rng.int(-4, 1) };
    if (p.x === p.y || Math.abs(p.x - p.c) === p.y) reject("distances that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "What is the shortest distance from the point ",
            A.math(coord([p.x, p.y])),
            " to the x-axis?",
          ],
          answer: A.number(p.y),
          wrong: wrongs(p.y, [
            {
              code: "GEO.DISTANCE.SLANT",
              value: A.number(r1(Math.hypot(p.x, p.y))),
              feedback:
                "That is the distance to the origin. The shortest distance to the axis is straight down, at right angles.",
            },
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.x),
              feedback: "The distance to the x-axis is the y-coordinate.",
            },
          ]),
          solution: [{ say: `Straight down to (${p.x}, 0): ${p.y} units.` }],
        });
      case 2: {
        const v = Math.abs(p.x - p.c);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "What is the shortest distance from ",
                A.math(coord([p.x, p.y])),
                " to the line ",
                A.math(`x = ${p.c}`),
                "?",
              ],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "GEO.DISTANCE.SLANT",
              value: A.number(r1(Math.hypot(v, p.y))),
              feedback: `Go straight across, at right angles to the line x = ${p.c}: the y-coordinate does not change.`,
            },
          ]),
          solution: [{ say: "", math: `|${p.x} - (${p.c})| = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Jo says the shortest path from a point to a straight line always meets the line at a right angle.",
              ],
              truth: true,
              reasons: [
                {
                  text: "True. Any other path is the hypotenuse of a right-angled triangle, which is longer than the perpendicular side.",
                  correct: true,
                },
                {
                  text: "False. The shortest path goes to the nearest end of the line.",
                  code: "GEO.DISTANCE.SLANT",
                },
                {
                  text: "False. Any straight path is as short as any other.",
                  code: "GEO.DISTANCE.SLANT",
                },
              ],
              solution: [{ say: "The perpendicular distance is the shortest distance." }],
            }),
          [
            {
              statement:
                "Point P is 5 cm from line L, measured at right angles. Leo says a slanted line from P to L could be 4 cm long.",
              truth: false,
              right:
                "False. The perpendicular is the shortest distance, so any other path to L is longer than 5 cm.",
              wrong: [
                ["True. A slanted line is a shortcut.", "GEO.DISTANCE.SLANT"],
                ["True. It depends where on L it goes."],
              ],
            },
            {
              statement:
                "Ali says the shortest distance from the point (3, 7) to the x-axis is 7 units.",
              truth: true,
              right: "True. Go straight down to (3, 0), a distance of 7.",
              wrong: [
                ["False. It is 3 units.", "ALG.COORD.ORDER"],
                ["False. It is the distance to the origin."],
              ],
            },
            {
              claim: "The distance from a point to a line is measured at right angles to the line.",
              truth: "always",
              right: "Always. That is the shortest way, so it is the one used.",
              wrong: [
                ["Sometimes. Any straight path will do.", "GEO.DISTANCE.SLANT"],
                ["Never. It is measured parallel to the line."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.y;
    if (question.key.depth === 2) return numberAnswer(question) === Math.abs(p.x - p.c);
    return true;
  },
});
