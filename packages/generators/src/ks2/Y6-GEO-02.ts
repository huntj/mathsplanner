/**
 * @statement Y6-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-GEO-02: Recognise, describe and build simple 3-D shapes, including making nets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "../shared/counting.ts";
import { CUBE_NETS, FACTS, netGrid, NOT_CUBE_NETS, type Solid } from "../shared/solids.ts";

interface Params {
  good: number;
  bad: number;
  bad2: number;
  isNet: boolean;
  solid: number;
}

const ASK: Solid[] = [
  "cube",
  "cuboid",
  "triangular prism",
  "square-based pyramid",
  "triangular pyramid",
  "hexagonal prism",
];
const key = (s: Coord[]) => JSON.stringify([...s].sort());

export default defineGenerator<Params>({
  id: "Y6-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.NET.ANY-SIX", "GEO.SOLIDS.FACES-EDGES"],

  params(rng) {
    const [bad, bad2] = rng.shuffle(NOT_CUBE_NETS.map((_, i) => i));
    return {
      good: rng.int(0, CUBE_NETS.length - 1),
      bad: bad ?? 0,
      bad2: bad2 ?? 1,
      isNet: rng.bool(),
      solid: rng.int(0, ASK.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const good = CUBE_NETS[p.good] as Coord[];
    const bad = NOT_CUBE_NETS[p.bad] as Coord[];
    switch (depth) {
      case 1: {
        const shown = p.isNet ? good : bad;
        return A.choice({
          rng,
          question: [
            "Here are six squares joined edge to edge.",
            A.figure(netGrid(shown, [], "Six squares joined edge to edge on squared paper.")),
          ],
          ask: "Will they fold up to make a cube?",
          correct: p.isNet ? "Yes" : "No",
          distractors: [
            p.isNet
              ? {
                  content: "No",
                  feedback:
                    "Imagine folding: one square becomes the base and the others fold up around it with none overlapping.",
                }
              : {
                  content: "Yes",
                  code: "GEO.NET.ANY-SIX",
                  feedback:
                    "Six squares are not enough on their own: here two faces would land in the same place.",
                },
          ],
          solution: [
            {
              say: p.isNet
                ? "Folding it, every square becomes a different face of the cube."
                : "When it is folded, two squares overlap and one face is left open.",
            },
          ],
        });
      }
      case 2: {
        const solid = ASK[p.solid] as Solid;
        const f = FACTS[solid];
        return A.standard({
          question: `Asha draws a net of a ${solid}.`,
          ask: "How many shapes (faces) does her net have?",
          answer: A.number(f.faces),
          wrong: wrongs(f.faces, [
            {
              code: "GEO.SOLIDS.FACES-EDGES",
              value: A.number(f.edges),
              feedback:
                "Each face of the 3D shape is one shape in the net. That is the number of edges.",
            },
            {
              code: "GEO.SOLIDS.FACES-EDGES",
              value: A.number(f.vertices),
              feedback: "That is the number of vertices. Count the faces.",
            },
          ]),
          solution: [
            {
              say: `A ${solid} has ${f.faces} faces (${f.faceShapes}), so the net has ${f.faces} shapes.`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which of these is a net of a cube?"],
          correct: netGrid(good, [], "Six squares joined edge to edge on squared paper."),
          distractors: [p.bad, p.bad2].map((i) => ({
            figure: netGrid(
              NOT_CUBE_NETS[i] as Coord[],
              [],
              "Six squares joined edge to edge on squared paper.",
            ),
            code: "GEO.NET.ANY-SIX",
            feedback: "Fold it in your head: two faces end up on top of each other.",
          })),
          solution: [
            {
              say: "Pick a base square and fold the others up: in a cube net each lands on a different face.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Noah says any six squares joined edge to edge will fold into a cube, like this one.",
            A.figure(netGrid(bad, [], "Six squares joined edge to edge on squared paper.")),
          ],
          truth: false,
          reasons: [
            {
              text: "False. This arrangement folds with two squares overlapping, so one face of the cube is missing. Only 11 arrangements of six squares are cube nets.",
              correct: true,
            },
            {
              text: "True. A cube has six faces, so any six squares work.",
              code: "GEO.NET.ANY-SIX",
            },
            {
              text: "True. As long as the squares touch, they fold into a cube.",
              code: "GEO.NET.ANY-SIX",
            },
          ],
          solution: [
            {
              say: "Try folding it: if two squares meet on the same face, it is not a net of a cube.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === FACTS[ASK[p.solid] as Solid].faces;
    if (question.archetype === "standard") return chosenText(question) === (p.isNet ? "Yes" : "No");
    if (question.archetype === "choose-the-diagram") {
      const g = chosenFigure(question) as CartesianSpec | undefined;
      const squares = (g?.polygons ?? []).map((poly) => poly.vertices[0] as Coord);
      return key(squares) === key(CUBE_NETS[p.good] as Coord[]);
    }
    return true;
  },
});
