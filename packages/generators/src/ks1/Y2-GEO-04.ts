/**
 * @statement Y2-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-GEO-04: Compare and sort common 2-D and 3-D shapes and everyday objects
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  solid: number;
  object: number;
  claim: number;
}

const SOLIDS = ["cube", "cuboid", "sphere", "cylinder", "cone", "pyramid"];
const FLATS = ["square", "rectangle", "circle", "triangle", "pentagon", "hexagon"];
const OBJECTS: [string, string][] = [
  ["a tin of beans", "cylinder"],
  ["a dice", "cube"],
  ["a football", "sphere"],
  ["an ice-cream cone", "cone"],
  ["a cereal box", "cuboid"],
  ["a party hat", "cone"],
  ["a tennis ball", "sphere"],
  ["a brick", "cuboid"],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "A cylinder and a cone both have a curved surface.",
    truth: true,
    why: "Both can roll, because each has a curved surface as well as flat circle faces.",
  },
  {
    text: "A sphere has one flat face.",
    truth: false,
    why: "A sphere is curved all over and has no flat faces.",
  },
  {
    text: "A cube and a cuboid have the same number of faces.",
    truth: true,
    why: "Both have 6 faces; a cube's are all squares.",
  },
  {
    text: "A square and a cube are both 3D shapes.",
    truth: false,
    why: "A square is flat (2D); a cube is solid (3D).",
  },
];

export default defineGenerator<Params>({
  id: "Y2-GEO-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SOLIDS.NAME-2D"],

  params(rng) {
    return {
      solid: rng.int(0, SOLIDS.length - 1),
      object: rng.int(0, OBJECTS.length - 1),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = SOLIDS[p.solid] ?? "cube";
        return A.choice({
          rng,
          question: "Sort the shapes into 2D (flat) and 3D (solid).",
          ask: "Which of these is a 3D shape?",
          correct: right,
          distractors: rng
            .shuffle(FLATS)
            .slice(0, 3)
            .map((f) => ({
              content: f,
              code: "GEO.SOLIDS.NAME-2D",
              feedback: `A ${f} is flat: it is a 2D shape.`,
            })),
          solution: [{ say: `A ${right} is solid, so it is 3D.` }],
        });
      }
      case 2: {
        const [thing, shape] = OBJECTS[p.object] as (typeof OBJECTS)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `What 3D shape is ${thing}?`,
          correct: shape,
          distractors: [
            ...rng
              .shuffle(SOLIDS.filter((s) => s !== shape))
              .slice(0, 2)
              .map((s) => ({
                content: s,
                feedback: `Think about the faces of ${thing}: is it like a ${s}?`,
              })),
            {
              content:
                shape === "sphere" || shape === "cylinder"
                  ? "circle"
                  : shape === "cone"
                    ? "triangle"
                    : "rectangle",
              code: "GEO.SOLIDS.NAME-2D",
              feedback: `${thing[0]?.toUpperCase()}${thing.slice(1)} is solid, so it is a 3D shape.`,
            },
          ],
          solution: [
            { say: `${thing[0]?.toUpperCase()}${thing.slice(1)} is shaped like a ${shape}.` },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Ben says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Flat shapes and solid shapes are sorted the same way.`,
              code: "GEO.SOLIDS.NAME-2D",
            },
            { text: `${c.truth ? "False" : "True"}. You can only sort shapes by colour.` },
          ],
          solution: [{ say: "Sort 3D shapes by their faces: flat or curved, and how many." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === SOLIDS[p.solid];
    if (question.archetype === "varied-form")
      return chosenText(question) === (OBJECTS[p.object] as (typeof OBJECTS)[number])[1];
    return true;
  },
});
