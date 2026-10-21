/**
 * @statement N-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-GEO-02: Combine shapes to make new ones, e.g. an arch, a bigger triangle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { COMPOSITES, type Composite } from "../shared/compose.ts";

interface Params {
  c: number;
  k: number;
  claimTrue: boolean;
}

// The composites made of exactly two pieces, for "what do they make?".
const PAIRS = COMPOSITES.filter((c) => c.count === 2);

/** k squares in a row. */
function squares(k: number): GeometrySpec {
  const points: Record<string, Coord> = { A: [0, 0], B: [2 * k, 0], C: [2 * k, 2], D: [0, 2] };
  const segments = Array.from({ length: k - 1 }, (_, i) => {
    points[`m${i}`] = [2 * (i + 1), 0];
    points[`n${i}`] = [2 * (i + 1), 2];
    return { from: `m${i}`, to: `n${i}` };
  });
  return {
    type: "geometry",
    points,
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments,
    description: "Squares put side by side in a row.",
  };
}

export default defineGenerator<Params>({
  id: "N-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.COMPOSE.COUNT"],

  params(rng) {
    return { c: rng.int(0, PAIRS.length - 1), k: rng.int(2, 4), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const c = PAIRS[p.c] as Composite;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Two ${c.parts} are pushed together.`, A.figure(c.spec)],
          ask: "What new shape do they make?",
          correct: `a ${c.whole}`,
          distractors: [
            {
              content: `two ${c.parts}`,
              code: "GEO.COMPOSE.COUNT",
              feedback: `Look at the outside edge of the whole shape: it is a ${c.whole}.`,
            },
            ...["circle", "triangle", "square", "rectangle"]
              .filter((s) => s !== c.whole)
              .slice(0, 2)
              .map((s) => ({ content: `a ${s}`, feedback: `Count the sides of the whole shape.` })),
          ],
          solution: [{ say: `The two ${c.parts} make a ${c.whole}.` }],
        });
      case 2:
        return A.standard({
          question: [
            "Mo puts some squares side by side to make a long rectangle.",
            A.figure(squares(p.k)),
          ],
          ask: "How many squares did Mo use?",
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "GEO.COMPOSE.COUNT",
              value: A.number(1),
              feedback: "Look for the lines inside the rectangle.",
            },
            {
              code: "GEO.COMPOSE.COUNT",
              value: A.number(p.k - 1),
              feedback: "Count the squares, not the lines between them.",
            },
          ]),
          solution: [{ say: `${p.k} squares make the rectangle.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Lola says two squares put side by side make a rectangle."
            : "Lola says two squares put side by side make a bigger square.",
          truth: p.claimTrue,
          reasons: [
            {
              text: p.claimTrue
                ? "True. The new shape is twice as long as it is tall, so it is a rectangle."
                : "False. The new shape is twice as long as it is tall, so it is a rectangle, not a square.",
              correct: true,
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. Two squares always make a square.`,
              code: "GEO.COMPOSE.COUNT",
            },
            { text: `${p.claimTrue ? "False" : "True"}. Shapes cannot be put together.` },
          ],
          solution: [{ say: "Two squares side by side make a rectangle." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.k;
    if (question.archetype === "standard")
      return chosenText(question) === `a ${(PAIRS[p.c] as Composite).whole}`;
    return true;
  },
});
