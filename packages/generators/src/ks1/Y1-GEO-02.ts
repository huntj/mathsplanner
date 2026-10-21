/**
 * @statement Y1-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-GEO-02: Recognise and name common 3-D shapes, including cuboids (including cubes), pyramids and
// spheres
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { FLAT_NAME, sketch, type Solid } from "../shared/solids.ts";

interface Params {
  solid: number;
  clue: number;
  claim: number;
}

const KS1: Solid[] = ["cube", "cuboid", "square-based pyramid", "sphere", "cylinder", "cone"];
const name = (s: Solid) => (s === "square-based pyramid" ? "pyramid" : s);
const CLUES: [string, Solid][] = [
  ["I am round all over and I have no flat faces. I can roll in any direction.", "sphere"],
  ["I have 6 faces and every face is a square.", "cube"],
  [
    "I have a square at the bottom and my sides meet at a point at the top.",
    "square-based pyramid",
  ],
  ["I can roll, and I have two flat faces that are circles.", "cylinder"],
  ["I have one flat face that is a circle and a point at the top.", "cone"],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "A cube is a square.",
    truth: false,
    why: "A square is flat. A cube is a solid shape whose faces are squares.",
  },
  {
    text: "A ball is shaped like a sphere.",
    truth: true,
    why: "A ball is round all over with no flat faces, like a sphere.",
  },
  {
    text: "A sphere is a circle.",
    truth: false,
    why: "A circle is flat. A sphere is a solid shape, round all over.",
  },
  {
    text: "A dice is shaped like a cube.",
    truth: true,
    why: "A dice has 6 square faces, like a cube.",
  },
];

export default defineGenerator<Params>({
  id: "Y1-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.SOLIDS.NAME-2D"],

  params(rng) {
    return {
      solid: rng.int(0, KS1.length - 1),
      clue: rng.int(0, CLUES.length - 1),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const solid = KS1[p.solid] as Solid;
    switch (depth) {
      case 1: {
        const flat = FLAT_NAME[solid];
        const others = KS1.filter((s) => s !== solid).slice(0, flat ? 2 : 3);
        return A.choice({
          rng,
          question: ["What is the name of this 3D shape?", A.figure(sketch(solid))],
          correct: name(solid),
          distractors: [
            ...(flat
              ? [
                  {
                    content: flat,
                    code: "GEO.SOLIDS.NAME-2D",
                    feedback: `A ${flat} is flat. This shape is solid.`,
                  },
                ]
              : []),
            ...others.map((s) => ({
              content: name(s),
              feedback: `A ${name(s)} looks different. Look at the faces and whether it has a point.`,
            })),
          ],
          solution: [{ say: `This is a ${name(solid)}.` }],
        });
      }
      case 2: {
        const [clue, answer] = CLUES[p.clue] as (typeof CLUES)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `"${clue}"`,
          ask: "Which 3D shape am I?",
          correct: name(answer),
          distractors: KS1.filter((s) => s !== answer)
            .slice(0, 3)
            .map((s) => ({ content: name(s), feedback: `Check the clue against a ${name(s)}.` })),
          solution: [{ say: `That describes a ${name(answer)}.` }],
        });
      }
      case 3: {
        const others = KS1.filter((s) => s !== solid);
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows a ${name(solid)}?`],
          correct: sketch(solid),
          distractors: rng
            .shuffle(others)
            .slice(0, 2)
            .map((s) => ({ figure: sketch(s), feedback: `That is a ${name(s)}.` })),
          solution: [{ say: `A ${name(solid)} looks like this one.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Amir says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Flat shapes and solid shapes are the same thing.`,
              code: "GEO.SOLIDS.NAME-2D",
            },
            {
              text: `${c.truth ? "False" : "True"}. Shapes only have names when they are flat.`,
              code: "GEO.SOLIDS.NAME-2D",
            },
          ],
          solution: [
            {
              say: "2D shapes are flat; 3D shapes are solid. A 3D shape's faces can be 2D shapes.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const solid = KS1[p.solid] as Solid;
    if (question.archetype === "standard") return chosenText(question) === name(solid);
    if (question.archetype === "varied-form")
      return chosenText(question) === name((CLUES[p.clue] as (typeof CLUES)[number])[1]);
    if (question.archetype === "choose-the-diagram")
      return JSON.stringify(chosenFigure(question)) === JSON.stringify(sketch(solid));
    return true;
  },
});
