/**
 * @statement GF-G13.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G13.a: Draw and interpret plans
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const SOLIDS: [string, string, string][] = [
  ["a cylinder standing on one of its circular ends", "A circle", "A rectangle"],
  ["a cone standing on its base", "A circle with a dot at its centre", "A triangle"],
  [
    "a square-based pyramid standing on its base",
    "A square with its diagonals drawn",
    "A triangle",
  ],
  ["a triangular prism lying on one of its rectangular faces", "A rectangle", "A triangle"],
  ["a sphere", "A circle", "A semicircle"],
];

interface Params {
  solid: number;
  l: number;
  w: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "GF-G13.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PLAN.ELEVATION"],

  params(rng) {
    const p = {
      solid: rng.int(0, SOLIDS.length - 1),
      l: rng.int(3, 12),
      w: rng.int(2, 9),
      h: rng.int(2, 9),
    };
    if (p.l === p.w || p.w === p.h || p.l === p.h) reject("three different edges");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [solid, right, wrong] = SOLIDS[p.solid] ?? SOLIDS[0] ?? ["", "", ""];
        const other = SOLIDS[(p.solid + 2) % SOLIDS.length]?.[1] ?? "";
        return A.choice({
          rng,
          question: [`What does the plan view of ${solid} look like?`],
          correct: right,
          distractors: [
            {
              content: wrong,
              code: "GEO.PLAN.ELEVATION",
              feedback:
                "That is the view from the front. The plan is the view from directly above.",
            },
            { content: other, feedback: "Imagine looking straight down on the solid." },
          ].filter((d) => d.content !== right),
          solution: [{ say: `From above: ${right.toLowerCase()}.` }],
        });
      }
      case 2: {
        const v = p.l * p.w;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A cuboid ${p.l} cm long, ${p.w} cm wide and ${p.h} cm high stands on its ${p.l} cm by ${p.w} cm face.`,
              ],
              ask: "What is the area of its plan view, in cm²?",
            },
            {
              question: [
                `A box measures ${p.l} cm by ${p.w} cm across its base and is ${p.h} cm tall.`,
              ],
              ask: "Find the area of its plan, in cm².",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "GEO.PLAN.ELEVATION",
              value: A.number(p.l * p.h),
              feedback: "That is the front elevation. The plan shows the length and the width.",
            },
            {
              code: "GEO.PLAN.ELEVATION",
              value: A.number(p.w * p.h),
              feedback: "That is a side elevation. The plan shows the length and the width.",
            },
          ]),
          solution: [
            {
              say: "From above you see a rectangle: ",
              math: `${p.l} \\times ${p.w} = ${v} \\text{ cm}^2`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Bo says the plan view of a cylinder standing on its end is a rectangle."],
          truth: false,
          reasons: [
            {
              text: "False. From directly above you see the circular top, so the plan is a circle. The rectangle is the front elevation.",
              correct: true,
            },
            { text: "True. A cylinder looks like a rectangle.", code: "GEO.PLAN.ELEVATION" },
            { text: "True. The plan shows the height and the width.", code: "GEO.PLAN.ELEVATION" },
          ],
          solution: [{ say: "Plan: from above. Elevations: from the front and the side." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === SOLIDS[p.solid]?.[1];
    if (question.key.depth === 2) return numberAnswer(question) === p.l * p.w;
    return true;
  },
});
