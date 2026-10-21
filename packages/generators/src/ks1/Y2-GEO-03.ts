/**
 * @statement Y2-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-GEO-03: Identify 2-D shapes on the surface of 3-D shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { FACTS, sketch, type Solid } from "../shared/solids.ts";

interface Params {
  q: number;
  r: number;
  claim: number;
}

// [solid, the question about a face, the answer, wrong answers]
const FACES: [Solid, string, string, string[]][] = [
  ["cube", "What shape is each face of a cube?", "square", ["rectangle", "triangle"]],
  ["cuboid", "What shape are the long faces of this cuboid?", "rectangle", ["square", "triangle"]],
  [
    "triangular prism",
    "What shape are the two end faces of a triangular prism?",
    "triangle",
    ["rectangle", "square"],
  ],
  [
    "square-based pyramid",
    "What shape is the bottom face of a square-based pyramid?",
    "square",
    ["triangle", "circle"],
  ],
  [
    "square-based pyramid",
    "What shape are the sloping faces of a square-based pyramid?",
    "triangle",
    ["square", "rectangle"],
  ],
  [
    "cylinder",
    "What shape are the two flat faces of a cylinder?",
    "circle",
    ["square", "rectangle"],
  ],
  ["cone", "What shape is the flat face of a cone?", "circle", ["triangle", "square"]],
];
const RIDDLES: [string, Solid][] = [
  ["Which 3D shape has 2 triangle faces and 3 rectangle faces?", "triangular prism"],
  ["Which 3D shape has 1 square face and 4 triangle faces?", "square-based pyramid"],
  ["Which 3D shape has 2 circle faces and a curved surface?", "cylinder"],
  ["Which 3D shape has 6 square faces?", "cube"],
  ["Which 3D shape has 4 triangle faces?", "triangular pyramid"],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "All the faces of a triangular prism are triangles.",
    truth: false,
    why: "Only the two end faces are triangles; the other three are rectangles.",
  },
  {
    text: "A cube has faces that are all squares.",
    truth: true,
    why: "All 6 faces of a cube are identical squares.",
  },
  {
    text: "A cone has a flat face that is a triangle.",
    truth: false,
    why: "A cone's only flat face is a circle; the rest is a curved surface.",
  },
  {
    text: "A square-based pyramid has triangle faces and a square face.",
    truth: true,
    why: "It has 4 triangles meeting at the top and a square at the bottom.",
  },
];
const OPTIONS: Solid[] = [
  "cube",
  "cuboid",
  "triangular prism",
  "square-based pyramid",
  "triangular pyramid",
  "cylinder",
  "cone",
  "sphere",
];

export default defineGenerator<Params>({
  id: "Y2-GEO-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SOLIDS.FACE-SHAPE"],

  params(rng) {
    return {
      q: rng.int(0, FACES.length - 1),
      r: rng.int(0, RIDDLES.length - 1),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [solid, ask, answer, wrong] = FACES[p.q] as (typeof FACES)[number];
        return A.choice({
          rng,
          question: [A.figure(sketch(solid))],
          ask,
          correct: answer,
          distractors: wrong.map((w) => ({
            content: w,
            code: "GEO.SOLIDS.FACE-SHAPE",
            feedback: `Look at that face on its own. A ${solid}'s faces are ${FACTS[solid].faceShapes}.`,
          })),
          solution: [{ say: `A ${solid}'s flat faces are ${FACTS[solid].faceShapes}.` }],
        });
      }
      case 2: {
        const [ask, answer] = RIDDLES[p.r] as (typeof RIDDLES)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ask,
          correct: answer,
          distractors: rng
            .shuffle(OPTIONS.filter((s) => s !== answer))
            .slice(0, 3)
            .map((s) => ({
              content: s,
              code: "GEO.SOLIDS.FACE-SHAPE",
              feedback: `A ${s}'s flat faces are ${FACTS[s].faceShapes}.`,
            })),
          solution: [{ say: `A ${answer}'s flat faces are ${FACTS[answer].faceShapes}.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Isla says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. A 3D shape is named after the shape of all its faces.`,
              code: "GEO.SOLIDS.FACE-SHAPE",
            },
            {
              text: `${c.truth ? "False" : "True"}. Every face of a 3D shape is the same 2D shape.`,
              code: "GEO.SOLIDS.FACE-SHAPE",
            },
          ],
          solution: [
            {
              say: "Look at each face of the 3D shape separately: they can be different 2D shapes.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === (FACES[p.q] as (typeof FACES)[number])[2];
    if (question.archetype === "varied-form")
      return chosenText(question) === (RIDDLES[p.r] as (typeof RIDDLES)[number])[1];
    return true;
  },
});
