/**
 * @statement GF-G13.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G13.b: Draw and interpret elevations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const SOLIDS: [string, string, string][] = [
  ["a cylinder standing on one of its circular ends", "A rectangle", "A circle"],
  ["a cone standing on its base", "A triangle", "A circle with a dot at its centre"],
  [
    "a square-based pyramid standing on its base",
    "A triangle",
    "A square with its diagonals drawn",
  ],
  ["a sphere", "A circle", "A semicircle"],
  ["a hemisphere resting on its flat face", "A semicircle", "A circle"],
];

interface Params {
  solid: number;
  l: number;
  w: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "GF-G13.b",
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
        return A.choice({
          rng,
          question: [`What does the front elevation of ${solid} look like?`],
          correct: right,
          distractors: [
            {
              content: wrong,
              code: "GEO.PLAN.ELEVATION",
              feedback:
                "That is the plan, the view from above. The front elevation is the view from the front.",
            },
            {
              content: "A square",
              feedback: "Picture the outline you would see from straight in front.",
            },
          ].filter((d) => d.content !== right),
          solution: [{ say: `From the front: ${right.toLowerCase()}.` }],
        });
      }
      case 2: {
        const v = p.w * p.h;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A cuboid is ${p.l} cm long (from left to right as you face it), ${p.w} cm deep and ${p.h} cm high.`,
              ],
              ask: "What is the area of its side elevation, in cm²?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "GEO.PLAN.ELEVATION",
              value: A.number(p.l * p.h),
              feedback:
                "That is the front elevation. From the side you see the depth and the height.",
            },
            {
              code: "GEO.PLAN.ELEVATION",
              value: A.number(p.l * p.w),
              feedback: "That is the plan. From the side you see the depth and the height.",
            },
          ]),
          solution: [{ say: "", math: `${p.w} \\times ${p.h} = ${v} \\text{ cm}^2` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The front and side elevations of a cuboid are the same."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. They match only when the length equals the depth. A ${p.l} by ${p.w} by ${p.h} cm cuboid has elevations ${p.l} × ${p.h} and ${p.w} × ${p.h}.`,
              correct: true,
            },
            { text: "Always. Every face of a cuboid is a rectangle.", code: "GEO.PLAN.ELEVATION" },
            { text: "Never. The side is always narrower than the front." },
          ],
          solution: [{ say: "Each elevation shows two of the three dimensions." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === SOLIDS[p.solid]?.[1];
    if (question.key.depth === 2) return numberAnswer(question) === p.w * p.h;
    return true;
  },
});
