/**
 * @statement Y2-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-GEO-02: Identify and describe the properties of 3-D shapes, including the number of edges,
// vertices and faces
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { FACTS, POLYHEDRA, sketch, type Solid } from "../shared/solids.ts";

export interface Params {
  solid: number;
  ask: "faces" | "edges" | "vertices";
  pairs: number[];
  claimTrue: boolean;
}

const KS1: Solid[] = POLYHEDRA.filter((s) => s !== "hexagonal prism");
const describe = (s: Solid) =>
  `${FACTS[s].faces} faces, ${FACTS[s].edges} edges, ${FACTS[s].vertices} vertices`;
/** Edges and vertices that can be seen in the sketch. */
function visible(s: Solid): { edges: number; vertices: number } {
  const g = sketch(s);
  const solid = (g.segments ?? []).filter((e) => !e.dashed);
  const ends = new Set(solid.flatMap((e) => [e.from, e.to]));
  return { edges: solid.length, vertices: ends.size };
}

export default defineGenerator<Params>({
  id: "Y2-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.SOLIDS.VISIBLE-ONLY", "GEO.SOLIDS.FACES-EDGES"],

  params(rng) {
    return {
      solid: rng.int(0, KS1.length - 1),
      ask: rng.pick(["faces", "edges", "vertices"] as const),
      pairs: rng.shuffle([0, 1, 2, 3, 4]).slice(0, 3),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const solid = KS1[p.solid] as Solid;
    const f = FACTS[solid];
    switch (depth) {
      case 1: {
        const answer = f[p.ask];
        const seen = visible(solid);
        const other = p.ask === "edges" ? f.vertices : f.edges;
        return A.standard({
          question: [
            `This is a ${solid}. Some edges are hidden at the back; they are shown dashed.`,
            A.figure(sketch(solid)),
          ],
          ask: `How many ${p.ask} does it have?`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            p.ask === "edges"
              ? {
                  code: "GEO.SOLIDS.VISIBLE-ONLY",
                  value: A.number(seen.edges),
                  feedback: "Count the dashed edges at the back too.",
                }
              : p.ask === "vertices"
                ? {
                    code: "GEO.SOLIDS.VISIBLE-ONLY",
                    value: A.number(seen.vertices),
                    feedback: "Some corners are hidden at the back.",
                  }
                : undefined,
            {
              code: "GEO.SOLIDS.FACES-EDGES",
              value: A.number(other),
              feedback:
                p.ask === "faces"
                  ? "Faces are the flat surfaces, not the lines."
                  : p.ask === "edges"
                    ? "Edges are where two faces meet; vertices are the corners."
                    : "Vertices are the corners, where edges meet.",
            },
          ]),
          solution: [{ say: `A ${solid} has ${describe(solid)}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A 3D shape has ${describe(solid)}.`,
          ask: "Which shape is it?",
          correct: solid,
          distractors: KS1.filter((s) => s !== solid && describe(s) !== describe(solid))
            .slice(0, 3)
            .map((s) => ({
              content: s,
              code: "GEO.SOLIDS.FACES-EDGES",
              feedback: `A ${s} has ${describe(s)}.`,
            })),
          solution: [{ say: `A ${solid} has ${describe(solid)}.` }],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each 3D shape to its properties.",
          pairs: p.pairs
            .map((i) => KS1[i] as Solid)
            .filter((s, i, all) => all.findIndex((t) => describe(t) === describe(s)) === i)
            .map((s) => [s, describe(s)] as [A.RichInput, A.RichInput]),
          solution: [
            {
              say: "Count the flat faces, the edges where faces meet, and the corners (vertices).",
            },
          ],
        });
      default: {
        const said = p.claimTrue ? f.edges : f.vertices;
        return A.trueOrFalseWhy({
          rng,
          statement: `Leo says a ${solid} has ${said} edges.`,
          truth: p.claimTrue || f.edges === f.vertices,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. A ${solid} has ${f.edges} edges, where pairs of faces meet.`,
                  correct: true,
                },
                { text: `False. It has ${f.vertices} edges.`, code: "GEO.SOLIDS.FACES-EDGES" },
                {
                  text: `False. You can only see ${visible(solid).edges}.`,
                  code: "GEO.SOLIDS.VISIBLE-ONLY",
                },
              ]
            : [
                {
                  text: `False. ${said} is the number of vertices (corners). It has ${f.edges} edges.`,
                  correct: true,
                },
                {
                  text: "True. Edges and vertices are the same thing.",
                  code: "GEO.SOLIDS.FACES-EDGES",
                },
                {
                  text: `True. Count the corners to find the edges.`,
                  code: "GEO.SOLIDS.FACES-EDGES",
                },
              ],
          solution: [{ say: `A ${solid} has ${describe(solid)}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const solid = KS1[p.solid] as Solid;
    if (question.archetype === "standard") return numberAnswer(question) === FACTS[solid][p.ask];
    if (question.archetype === "varied-form") return chosenText(question) === solid;
    if (question.archetype === "true-or-false-why")
      return FACTS[solid].edges !== FACTS[solid].vertices;
    return true;
  },
});
