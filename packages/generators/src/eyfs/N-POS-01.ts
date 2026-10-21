/**
 * @statement N-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-POS-01: Talk about and explore 2D and 3D shapes using informal and mathematical language: sides,
// corners, straight, flat, round
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon, type GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  sides: number;
  clue: number;
  claim: number;
}

const NAMES: Record<number, string> = { 3: "triangle", 4: "square", 5: "pentagon", 6: "hexagon" };
const circle: GeometrySpec = {
  type: "geometry",
  points: { O: [0, 0] },
  circles: [{ centre: "O", radius: 1 }],
  description: "A flat round shape.",
};
const CLUES: [string, string][] = [
  ["I am flat and round, with no corners.", "circle"],
  ["I have 3 straight sides and 3 corners.", "triangle"],
  ["I have 4 straight sides that are all the same length.", "square"],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "A circle has corners.",
    truth: false,
    why: "A circle is round all the way round, so it has no corners.",
  },
  {
    text: "A triangle has 3 straight sides.",
    truth: true,
    why: "Count them: 1, 2, 3 straight sides.",
  },
  {
    text: "A ball is flat.",
    truth: false,
    why: "A ball is round all over. You cannot lay it flat like a sheet of paper.",
  },
];

export default defineGenerator<Params>({
  id: "N-POS-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SHAPES.SIDES-VERTICES"],

  params(rng, numbers) {
    return {
      sides: rng.int(3, numbers === "friendly" ? 4 : 6),
      clue: rng.int(0, CLUES.length - 1),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Look at this shape.",
            A.figure({
              ...regularPolygon(p.sides, 2),
              description: "A flat shape with straight sides.",
            }),
          ],
          ask: "How many corners does it have?",
          answer: A.number(p.sides),
          wrong: wrongs(p.sides, [
            {
              code: "GEO.SHAPES.SIDES-VERTICES",
              value: A.number(p.sides + 1),
              feedback:
                "Put your finger on one corner and count round once. Stop when you get back to the start.",
            },
          ]),
          solution: [
            {
              say: `The ${NAMES[p.sides] ?? "shape"} has ${p.sides} corners and ${p.sides} straight sides.`,
            },
          ],
        });
      case 2: {
        const [clue, answer] = CLUES[p.clue] as (typeof CLUES)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `"${clue}"`,
          ask: "Which shape am I?",
          correct: answer,
          distractors: ["circle", "triangle", "square", "rectangle"]
            .filter((s) => s !== answer)
            .slice(0, 2)
            .map((s) => ({
              content: s,
              code: "GEO.SHAPES.SIDES-VERTICES",
              feedback: `Check the clue: count the sides and corners of a ${s}.`,
            })),
          solution: [{ say: `That is a ${answer}.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: [`Max says: "${c.text}"`, ...(p.claim === 0 ? [A.figure(circle)] : [])],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Every shape has corners.`,
              code: "GEO.SHAPES.SIDES-VERTICES",
            },
            { text: `${c.truth ? "False" : "True"}. Round things and flat things are the same.` },
          ],
          solution: [{ say: "Straight sides meet at corners; round shapes have no corners." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.sides;
    if (question.archetype === "varied-form")
      return chosenText(question) === (CLUES[p.clue] as (typeof CLUES)[number])[1];
    return true;
  },
});
