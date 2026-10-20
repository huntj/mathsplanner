/**
 * @statement Y2-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y2-GEO-01: Identify and describe properties of 2D shapes, including number of sides and line
// symmetry in a vertical line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon, type GeometrySpec, type ShapeKind } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { capital, shape } from "../shared/shapes.ts";

interface Params {
  /** A named shape, or a regular polygon with this many sides. */
  kind: ShapeKind | number;
  rotation: number;
  riddle: number;
  symmetric: "isosceles" | "kite" | "rectangle";
  oddSides: 3 | 5;
}

const sidesOf = (k: ShapeKind | number) =>
  typeof k === "number"
    ? k
    : ["equilateral", "isosceles", "scalene", "right-angled"].includes(k)
      ? 3
      : 4;
const figureOf = (k: ShapeKind | number, rotation: number): GeometrySpec =>
  typeof k === "number" ? regularPolygon(k) : shape(k, { rotation });

const RIDDLES = [
  { clue: "I have 3 straight sides and 3 corners.", name: "triangle" },
  { clue: "I have 4 equal sides and 4 square corners.", name: "square" },
  {
    clue: "I have 4 sides and 4 square corners, but my sides are not all the same length.",
    name: "rectangle",
  },
  { clue: "I have 5 straight sides.", name: "pentagon" },
  { clue: "I have 6 straight sides.", name: "hexagon" },
  { clue: "I have one curved side and no corners.", name: "circle" },
];

export default defineGenerator<Params>({
  id: "Y2-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.SHAPES.SIDES-VERTICES", "GEO.SHAPES.ORIENTATION"],

  params(rng, numbers) {
    const pools: Record<typeof numbers, (ShapeKind | number)[]> = {
      friendly: ["square", "rectangle", "isosceles", 5, 6],
      standard: ["kite", "parallelogram", "scalene", "trapezium", 5, 6, 7],
      stretch: [5, 6, 7, 8, "rhombus", "right-angled"],
    };
    const kinds = pools[numbers];
    return {
      kind: rng.pick(kinds),
      rotation: numbers === "friendly" ? 0 : rng.int(10, 80),
      riddle: rng.int(0, RIDDLES.length - 1),
      symmetric: rng.pick(["isosceles", "kite", "rectangle"] as const),
      oddSides: rng.pick([3, 5] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = sidesOf(p.kind);
        return A.standard({
          question: ["Look at this shape.", A.figure(figureOf(p.kind, p.rotation))],
          ask: "How many sides does it have?",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "GEO.SHAPES.SIDES-VERTICES",
              value: A.number(n + 1),
              feedback:
                "Put a finger on one side and count round once; stop when you get back to where you started.",
            },
          ]),
          solution: [
            { say: `Count the straight sides once each, going round the shape: there are ${n}.` },
          ],
        });
      }
      case 2: {
        const riddle = RIDDLES[p.riddle] ?? RIDDLES[0];
        // A square is also a rectangle, so "rectangle" is no distractor for the square's clue.
        const others = RIDDLES.filter(
          (r) => r.name !== riddle?.name && !(riddle?.name === "square" && r.name === "rectangle"),
        ).map((r) => r.name);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: riddle?.clue ?? "",
          ask: "What shape am I?",
          correct: capital(riddle?.name ?? ""),
          distractors: rng.sample(others, 3).map((name) => ({ content: capital(name) })),
          solution: [{ say: `Only a ${riddle?.name} fits every clue.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question:
            "A shape has a vertical line of symmetry if a straight line down the middle splits it into two halves that are mirror images.",
          ask: "Which shape has a vertical line of symmetry?",
          correct: shape(p.symmetric),
          distractors: [
            { figure: shape("scalene") },
            { figure: shape("parallelogram") },
            { figure: shape("right-angled") },
          ],
          solution: [
            {
              say: `The ${p.symmetric === "isosceles" ? "isosceles triangle" : p.symmetric} folds exactly in half along a line down its middle. The others do not.`,
            },
          ],
        });
      default: {
        // Three four-sided shapes and one with a different number of sides.
        const fours: ShapeKind[] = rng.sample(
          ["square", "kite", "parallelogram", "trapezium", "rhombus"],
          3,
        );
        const odd = p.oddSides === 3 ? shape("isosceles", { rotation: 20 }) : regularPolygon(5);
        return A.oddOneOut({
          rng,
          question: "Which shape is the odd one out?",
          items: [
            ...fours.map((k) => ({ content: A.figure(shape(k, { rotation: rng.int(0, 60) })) })),
            { content: A.figure(odd), odd: true },
          ],
          reasons: [
            { text: `It has ${p.oddSides} sides; the others all have 4.`, correct: true },
            { text: "It is the only one that has been turned.", code: "GEO.SHAPES.ORIENTATION" },
            { text: "It is the only one with a square corner." },
          ],
          solution: [
            { say: `Count the sides of each shape: three have 4 sides and one has ${p.oddSides}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    const polygon = (question.diagrams[0]?.polygons as { vertices: string[] }[] | undefined)?.[0];
    return polygon?.vertices.length === answer.value && answer.value === sidesOf(p.kind);
  },
});
