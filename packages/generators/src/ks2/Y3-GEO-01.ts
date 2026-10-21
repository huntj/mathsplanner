/**
 * @statement Y3-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-GEO-01: Draw 2-D shapes and make 3-D shapes using modelling materials; recognise 3-D shapes in
// different orientations and describe them
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { FACTS, POLYHEDRA, sketch, type Solid } from "../shared/solids.ts";

interface Params {
  solid: number;
  pairs: number[];
  turned: number;
}

const TURNED: [string, string][] = [
  ["a cuboid stood on its end", "cuboid"],
  ["a square-based pyramid turned upside down", "square-based pyramid"],
  ["a triangular prism stood on one of its triangle faces", "triangular prism"],
  ["a cone lying on its side", "cone"],
];

export default defineGenerator<Params>({
  id: "Y3-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.SOLIDS.FACES-EDGES", "GEO.SOLIDS.VISIBLE-ONLY", "GEO.SHAPES.ORIENTATION"],

  params(rng) {
    return {
      solid: rng.int(0, POLYHEDRA.length - 1),
      pairs: rng.shuffle([1, 2, 3, 4, 5]).slice(0, 3),
      turned: rng.int(0, TURNED.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const solid = POLYHEDRA[p.solid] as Solid;
    const f = FACTS[solid];
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `Mia makes a skeleton of a ${solid} from straws joined by balls of modelling clay. Each straw is one edge.`,
            A.figure(sketch(solid)),
          ],
          ask: "How many straws does she need?",
          answer: A.number(f.edges),
          wrong: wrongs(f.edges, [
            {
              code: "GEO.SOLIDS.FACES-EDGES",
              value: A.number(f.vertices),
              feedback: "That is the number of corners, where the clay balls go. Count the edges.",
            },
            {
              code: "GEO.SOLIDS.VISIBLE-ONLY",
              value: A.number((sketch(solid).segments ?? []).filter((s) => !s.dashed).length),
              feedback: "Remember the hidden edges at the back (dashed).",
            },
          ]),
          solution: [{ say: `A ${solid} has ${f.edges} edges, so ${f.edges} straws.` }],
        });
      case 2:
        return A.reverse({
          question: [
            `Mia makes a skeleton of a ${solid} from straws joined by balls of modelling clay. A ball goes at every corner.`,
            A.figure(sketch(solid)),
          ],
          ask: "How many balls of clay does she need?",
          answer: A.number(f.vertices),
          wrong: wrongs(f.vertices, [
            {
              code: "GEO.SOLIDS.FACES-EDGES",
              value: A.number(f.faces),
              feedback: "Faces are the flat surfaces. The balls go at the vertices (corners).",
            },
          ]),
          solution: [{ say: `A ${solid} has ${f.vertices} vertices.` }],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question:
            "Each 3D shape is made from straws (edges) and clay balls (vertices). Match each shape to what it needs.",
          pairs: p.pairs
            .map((i) => POLYHEDRA[i] as Solid)
            .map(
              (s) =>
                [s, `${FACTS[s].edges} straws and ${FACTS[s].vertices} balls`] as [
                  A.RichInput,
                  A.RichInput,
                ],
            ),
          solution: [{ say: "Count the edges for the straws and the corners for the balls." }],
        });
      default: {
        const [what, shape] = TURNED[p.turned] as (typeof TURNED)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Theo says ${what} is no longer a ${shape}.`,
          truth: false,
          reasons: [
            {
              text: `False. Turning a shape does not change it: it has the same faces, edges and vertices, so it is still a ${shape}.`,
              correct: true,
            },
            {
              text: "True. A shape's name depends on which way up it is.",
              code: "GEO.SHAPES.ORIENTATION",
            },
            {
              text: "True. Turning a shape changes how many faces it has.",
              code: "GEO.SHAPES.ORIENTATION",
            },
          ],
          solution: [{ say: "A 3D shape keeps its name in any position." }],
        });
      }
    }
  },

  verify(p, question) {
    const f = FACTS[POLYHEDRA[p.solid] as Solid];
    if (question.archetype === "standard") return numberAnswer(question) === f.edges;
    if (question.archetype === "reverse") return numberAnswer(question) === f.vertices;
    return true;
  },
});
