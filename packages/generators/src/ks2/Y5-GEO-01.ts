/**
 * @statement Y5-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-GEO-01: Identify 3-D shapes, including cubes and other cuboids, from 2-D representations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import {
  CUBE_NETS,
  FACTS,
  netGrid,
  PRISM_NET,
  PYRAMID_NET,
  PYRAMID_NET_SHORT,
  TETRA_NET,
  type Solid,
} from "../shared/solids.ts";

interface Params {
  net: number;
  faces: number;
  cubeNet: number;
}

const NETS: [Solid, () => CartesianSpec][] = [
  ["cube", () => netGrid(CUBE_NETS[4] ?? [])],
  ["square-based pyramid", () => netGrid(PYRAMID_NET.squares, PYRAMID_NET.triangles)],
  ["triangular prism", () => netGrid(PRISM_NET.squares, PRISM_NET.triangles)],
  ["triangular pyramid", () => netGrid(TETRA_NET.squares, TETRA_NET.triangles)],
];
const NAMES: Solid[] = [
  "cube",
  "square-based pyramid",
  "triangular prism",
  "triangular pyramid",
  "cuboid",
];
const PRISM_OR_PYRAMID: Partial<Record<Solid, Solid>> = {
  "square-based pyramid": "cuboid",
  "triangular prism": "triangular pyramid",
  "triangular pyramid": "triangular prism",
};

export default defineGenerator<Params>({
  id: "Y5-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.SOLIDS.PRISM-PYRAMID", "GEO.SOLIDS.FACE-SHAPE"],

  params(rng) {
    return {
      net: rng.int(0, NETS.length - 1),
      faces: rng.int(0, 2),
      cubeNet: rng.int(0, CUBE_NETS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [solid, net] = NETS[p.net] as (typeof NETS)[number];
        const mix = PRISM_OR_PYRAMID[solid];
        return A.choice({
          rng,
          question: ["This net folds up to make a 3D shape.", A.figure(net())],
          ask: "Which shape does it make?",
          correct: solid,
          distractors: NAMES.filter((s) => s !== solid)
            .slice(0, 3)
            .map((s) => ({
              content: s,
              ...(s === mix ? { code: "GEO.SOLIDS.PRISM-PYRAMID" } : {}),
              feedback: `A ${s} has ${FACTS[s].faceShapes}. Count the faces in the net.`,
            })),
          solution: [{ say: `The net has ${FACTS[solid].faceShapes}: a ${solid}.` }],
        });
      }
      case 2: {
        const solid = (
          ["triangular prism", "square-based pyramid", "triangular pyramid"] as Solid[]
        )[p.faces] as Solid;
        const mix = PRISM_OR_PYRAMID[solid];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A 3D shape has these faces: ${FACTS[solid].faceShapes}.`,
          ask: "What is it?",
          correct: solid,
          distractors: NAMES.filter((s) => s !== solid && s !== "cube")
            .slice(0, 3)
            .map((s) => ({
              content: s,
              ...(s === mix ? { code: "GEO.SOLIDS.PRISM-PYRAMID" } : {}),
              feedback: `A ${s}'s faces are ${FACTS[s].faceShapes}.`,
            })),
          solution: [{ say: `${FACTS[solid].faceShapes}: a ${solid}.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which net folds to make a square-based pyramid?"],
          correct: netGrid(PYRAMID_NET.squares, PYRAMID_NET.triangles),
          distractors: [
            {
              figure: netGrid(PRISM_NET.squares, PRISM_NET.triangles),
              code: "GEO.SOLIDS.PRISM-PYRAMID",
              feedback: "That net has three rectangles: it makes a triangular prism.",
            },
            {
              figure: netGrid(PYRAMID_NET_SHORT.squares, PYRAMID_NET_SHORT.triangles),
              code: "GEO.SOLIDS.FACE-SHAPE",
              feedback: "That net has only three triangles, so one side is left open.",
            },
          ],
          solution: [
            {
              say: "A square-based pyramid has a square base and four triangles that meet at the top.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ola says a square-based pyramid is a prism, because it has a square at one end.",
          truth: false,
          reasons: [
            {
              text: "False. A prism has the same shape all the way through, with two matching ends. A pyramid narrows to a point.",
              correct: true,
            },
            {
              text: "True. Any shape with a square face is a prism.",
              code: "GEO.SOLIDS.PRISM-PYRAMID",
            },
            {
              text: "True. Prisms and pyramids are the same thing.",
              code: "GEO.SOLIDS.PRISM-PYRAMID",
            },
          ],
          solution: [
            {
              say: "Prism: two identical ends joined by rectangles. Pyramid: one base, triangles meeting at a point.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === (NETS[p.net] as (typeof NETS)[number])[0];
    if (question.archetype === "varied-form")
      return (
        chosenText(question) ===
        (["triangular prism", "square-based pyramid", "triangular pyramid"] as const)[p.faces]
      );
    if (question.archetype === "choose-the-diagram")
      return ((chosenFigure(question) as CartesianSpec | undefined)?.polygons?.length ?? 0) === 5;
    return true;
  },
});
