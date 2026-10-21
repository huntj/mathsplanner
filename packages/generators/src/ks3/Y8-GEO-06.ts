/**
 * @statement Y8-GEO-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-GEO-06: Use the properties of faces, surfaces, edges and vertices of cubes, cuboids, prisms,
// cylinders, pyramids, cones and spheres to solve problems in 3-D
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  ask: "faces" | "edges" | "vertices";
  claim: number;
}

const POLY: Record<number, string> = {
  3: "triangle",
  4: "square",
  5: "pentagon",
  6: "hexagon",
  7: "heptagon",
  8: "octagon",
};
const prismFacts = (n: number) => ({ faces: n + 2, edges: 3 * n, vertices: 2 * n });
const pyramidFacts = (n: number) => ({ faces: n + 1, edges: 2 * n, vertices: n + 1 });
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "A cone has exactly one vertex.",
    truth: true,
    why: "The point at the top is a vertex; the circular edge has no corners.",
  },
  {
    text: "A cylinder has no edges.",
    truth: false,
    why: "It has two curved edges, where the flat circles meet the curved surface.",
  },
  {
    text: "A sphere has one curved surface and no edges.",
    truth: true,
    why: "A sphere is a single curved surface with no edges or vertices.",
  },
  {
    text: "A cylinder has two faces.",
    truth: false,
    why: "It has two flat circular faces and one curved surface: three surfaces.",
  },
];

export default defineGenerator<Params>({
  id: "Y8-GEO-06",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.SOLIDS.FACES-EDGES", "GEO.SOLIDS.PRISM-PYRAMID"],

  params(rng, numbers) {
    return {
      n: rng.int(numbers === "friendly" ? 3 : 5, numbers === "friendly" ? 6 : 8),
      ask: rng.pick(["faces", "edges", "vertices"] as const),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const shape = POLY[p.n] ?? "polygon";
    const pr = prismFacts(p.n);
    const py = pyramidFacts(p.n);
    switch (depth) {
      case 1: {
        const e = pr.faces + pr.vertices - 2;
        return A.standard({
          question: `For any polyhedron, faces + vertices − edges = 2 (Euler's formula). A polyhedron has ${pr.faces} faces and ${pr.vertices} vertices.`,
          ask: "How many edges does it have?",
          answer: A.number(e),
          wrong: wrongs(e, [
            {
              code: "GEO.SOLIDS.FACES-EDGES",
              value: A.number(pr.faces + pr.vertices),
              feedback: "F + V − E = 2, so E = F + V − 2.",
            },
          ]),
          solution: [{ say: `E = F + V − 2 = ${pr.faces} + ${pr.vertices} − 2 = ${e}.` }],
        });
      }
      case 2:
        return A.standard({
          question: `A prism has a ${shape} as its cross-section.`,
          ask: `How many ${p.ask} does it have?`,
          answer: A.number(pr[p.ask]),
          wrong: wrongs(pr[p.ask], [
            {
              code: "GEO.SOLIDS.PRISM-PYRAMID",
              value: A.number(py[p.ask]),
              feedback: `That is for a pyramid with a ${shape} base. A prism has two ${shape} ends.`,
            },
          ]),
          solution: [
            {
              say: `Two ${shape} ends and ${p.n} rectangles: ${pr.faces} faces, ${pr.edges} edges (${p.n} on each end and ${p.n} joining them), ${pr.vertices} vertices.`,
            },
          ],
        });
      case 4: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Eve says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Curved shapes have no faces, edges or vertices at all.`,
              code: "GEO.SOLIDS.FACES-EDGES",
            },
            {
              text: `${c.truth ? "False" : "True"}. Edges and vertices are the same thing on a curved shape.`,
              code: "GEO.SOLIDS.FACES-EDGES",
            },
          ],
          solution: [
            {
              say: "Cylinder: 2 flat faces, 1 curved surface, 2 edges, 0 vertices. Cone: 1 flat face, 1 curved surface, 1 edge, 1 vertex. Sphere: 1 curved surface.",
            },
          ],
        });
      }
      default:
        return A.multiStepContext({
          context: `A pyramid has a ${shape} as its base.`,
          parts: [
            {
              ask: "How many faces does it have?",
              answer: A.number(py.faces),
              wrong: wrongs(py.faces, [
                {
                  code: "GEO.SOLIDS.PRISM-PYRAMID",
                  value: A.number(pr.faces),
                  feedback: "A pyramid has one base, not two ends.",
                },
              ]),
            },
            {
              ask: "How many edges does it have?",
              answer: A.number(py.edges),
              wrong: wrongs(py.edges, [
                {
                  code: "GEO.SOLIDS.PRISM-PYRAMID",
                  value: A.number(pr.edges),
                  feedback: `There are ${p.n} edges round the base and ${p.n} up to the top.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `The base plus ${p.n} triangles: ${py.faces} faces.` },
            {
              say: `${p.n} base edges and ${p.n} sloping edges: ${py.edges}. Check: ${py.faces} + ${py.vertices} − ${py.edges} = 2.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    const pr = prismFacts(p.n);
    if (question.archetype === "standard")
      return numberAnswer(question) === pr.edges || numberAnswer(question) === pr[p.ask];
    if (question.archetype === "multi-step-context") return numberAnswer(question, 1) === 2 * p.n;
    return true;
  },
});
