/**
 * @statement GF-G12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G12: Identify properties of the faces, surfaces, edges and vertices of: cubes, cuboids, prisms,
// cylinders, pyramids, cones and spheres
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { FACTS, sketch, SOLIDS, type Solid } from "../shared/solids.ts";

interface Params {
  solid: number;
  ask: "faces" | "edges" | "vertices";
  n: number;
  pyramid: boolean;
  claim: number;
}

const POLY: Record<number, string> = {
  5: "pentagonal",
  6: "hexagonal",
  7: "heptagonal",
  8: "octagonal",
};
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "A cylinder has two flat faces and one curved surface.",
    truth: true,
    why: "The ends are flat circles; the side is curved.",
  },
  { text: "A cone has no vertices.", truth: false, why: "The point at the top is a vertex." },
  {
    text: "Every prism has the same number of edges as a cube.",
    truth: false,
    why: "A prism with an n-sided cross-section has 3n edges, so only a 4-sided one has 12.",
  },
];

export default defineGenerator<Params>({
  id: "GF-G12",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SOLIDS.FACES-EDGES", "GEO.SOLIDS.PRISM-PYRAMID"],

  params(rng) {
    return {
      solid: rng.int(0, 5),
      ask: rng.pick(["faces", "edges", "vertices"] as const),
      n: rng.int(5, 8),
      pyramid: rng.bool(),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const kind = p.pyramid ? "pyramid" : "prism";
        const shape = POLY[p.n] ?? "polygonal";
        const facts =
          kind === "prism"
            ? { faces: p.n + 2, edges: 3 * p.n, vertices: 2 * p.n }
            : { faces: p.n + 1, edges: 2 * p.n, vertices: p.n + 1 };
        const other =
          kind === "prism"
            ? { faces: p.n + 1, edges: 2 * p.n, vertices: p.n + 1 }
            : { faces: p.n + 2, edges: 3 * p.n, vertices: 2 * p.n };
        return A.standard({
          question: `A ${shape} ${kind} has a ${p.n}-sided ${kind === "prism" ? "cross-section" : "base"}.`,
          ask: `How many ${p.ask} does it have?`,
          answer: A.number(facts[p.ask]),
          wrong: wrongs(facts[p.ask], [
            {
              code: "GEO.SOLIDS.PRISM-PYRAMID",
              value: A.number(other[p.ask]),
              feedback:
                kind === "prism"
                  ? "A prism has two matching ends joined by rectangles."
                  : "A pyramid has one base and triangles meeting at a point.",
            },
          ]),
          solution: [
            { say: `${facts.faces} faces, ${facts.edges} edges and ${facts.vertices} vertices.` },
          ],
        });
      }
      case 2: {
        const solid = SOLIDS[p.solid] as Solid;
        const f = FACTS[solid];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Here is a 3D shape.", A.figure(sketch(solid))],
          ask: "Which description is correct?",
          correct: `${f.faces} faces, ${f.edges} edges, ${f.vertices} vertices`,
          distractors: [
            {
              content: `${f.vertices} faces, ${f.edges} edges, ${f.faces} vertices`,
              code: "GEO.SOLIDS.FACES-EDGES",
              feedback: "Faces are the flat surfaces; vertices are the corners.",
            },
            {
              content: `${f.faces} faces, ${f.vertices} edges, ${f.edges} vertices`,
              code: "GEO.SOLIDS.FACES-EDGES",
              feedback: "Edges are where two faces meet.",
            },
          ].filter(
            (d, i, all) =>
              d.content !== `${f.faces} faces, ${f.edges} edges, ${f.vertices} vertices` &&
              all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [
            {
              say: `This ${solid} has ${f.faces} faces, ${f.edges} edges and ${f.vertices} vertices.`,
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Lola says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Curved shapes have no faces, edges or vertices.`,
              code: "GEO.SOLIDS.FACES-EDGES",
            },
            {
              text: `${c.truth ? "False" : "True"}. All prisms and pyramids have the same numbers of edges.`,
              code: "GEO.SOLIDS.PRISM-PYRAMID",
            },
          ],
          solution: [{ say: "Count carefully, including the hidden faces, edges and vertices." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "varied-form") {
      const f = FACTS[SOLIDS[p.solid] as Solid];
      return chosenText(question) === `${f.faces} faces, ${f.edges} edges, ${f.vertices} vertices`;
    }
    if (question.archetype === "standard") {
      const facts = p.pyramid
        ? { faces: p.n + 1, edges: 2 * p.n, vertices: p.n + 1 }
        : { faces: p.n + 2, edges: 3 * p.n, vertices: 2 * p.n };
      return numberAnswer(question) === facts[p.ask];
    }
    return true;
  },
});
