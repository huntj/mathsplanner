/**
 * @statement R-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-GEO-01: Select, rotate and manipulate shapes in order to develop spatial reasoning skills
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon, type CartesianSpec, type Coord } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { rotate, sameShape, SHAPES, translate } from "../shared/pos.ts";

interface Params {
  sides: number;
  shape: number;
  other: number;
  quarters: number;
  claim: number;
}

const NAMES: Record<number, string> = { 3: "triangle", 4: "square", 6: "hexagon" };
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "A triangle turned upside down is still a triangle.",
    truth: true,
    why: "It still has 3 straight sides and 3 corners.",
  },
  {
    text: "A square standing on one of its corners is not a square any more.",
    truth: false,
    why: "Turning it does not change its 4 equal sides or its corners.",
  },
  {
    text: "If you turn a shape round, it stays the same shape.",
    truth: true,
    why: "Turning moves the shape but does not change its sides or corners.",
  },
];

/** A shape placed on a plain squared grid, moved so its lowest corner sits at (1, 1). */
function onGrid(v: Coord[]): CartesianSpec {
  const minX = Math.min(...v.map((q) => q[0]));
  const minY = Math.min(...v.map((q) => q[1]));
  const moved = translate(v, 1 - minX, 1 - minY);
  const maxX = Math.max(...moved.map((q) => q[0]));
  const maxY = Math.max(...moved.map((q) => q[1]));
  return {
    type: "cartesian",
    x: { min: 0, max: maxX + 1, step: 1 },
    y: { min: 0, max: Math.max(maxY + 1, 4), step: 1 },
    grid: true,
    axes: false,
    polygons: [{ vertices: moved, shaded: true }],
    description: "A shape on squared paper.",
  };
}
const normal = (v: Coord[]) => {
  const minX = Math.min(...v.map((q) => q[0]));
  const minY = Math.min(...v.map((q) => q[1]));
  return translate(v, 1 - minX, 1 - minY);
};

export default defineGenerator<Params>({
  id: "R-GEO-01",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.SHAPES.ORIENTATION"],

  params(rng) {
    const shape = rng.int(0, SHAPES.length - 1);
    const other = rng.int(0, SHAPES.length - 1);
    if (shape === other) reject("a different shape for the distractor");
    return {
      sides: rng.pick([3, 4, 6]),
      shape,
      other,
      quarters: rng.int(1, 3),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const name = NAMES[p.sides] ?? "shape";
        // Turned so it stands on a corner (or point).
        const turned = {
          ...regularPolygon(p.sides, 2, -90),
          description: "A flat shape that has been turned.",
        };
        return A.choice({
          rng,
          question: ["This shape has been turned.", A.figure(turned)],
          ask: "What shape is it?",
          correct: `a ${name}`,
          distractors: [
            {
              content: `not a ${name}, because it has been turned`,
              code: "GEO.SHAPES.ORIENTATION",
              feedback: "Turning a shape does not change it. Count its sides and corners.",
            },
            ...["circle", "triangle", "square", "hexagon"]
              .filter((s) => s !== name)
              .slice(0, 2)
              .map((s) => ({ content: `a ${s}`, feedback: `Count the sides: it has ${p.sides}.` })),
          ],
          solution: [
            {
              say: `It has ${p.sides} straight sides and ${p.sides} corners: a ${name}, just turned.`,
            },
          ],
        });
      }
      case 3: {
        const base = SHAPES[p.shape] as Coord[];
        const turned = rotate(base, p.quarters);
        const different = rotate(SHAPES[p.other] as Coord[], p.quarters);
        const stretched = base.map(([x, y]) => [x * 2, y] as Coord);
        return A.chooseTheDiagram({
          rng,
          question: [
            "Here is a shape.",
            A.figure(onGrid(base)),
            "Which of these is the same shape, just turned?",
          ],
          correct: onGrid(turned),
          distractors: [
            {
              figure: onGrid(different),
              code: "GEO.SHAPES.ORIENTATION",
              feedback: "That is a different shape. Count its sides and compare their lengths.",
            },
            {
              figure: onGrid(stretched),
              feedback: "That shape is stretched: some sides are longer.",
            },
          ],
          solution: [
            {
              say: "Imagine turning the shape round on the table: its sides and corners stay the same.",
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Isla says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. A shape changes its name when you turn it.`,
              code: "GEO.SHAPES.ORIENTATION",
            },
            { text: `${c.truth ? "False" : "True"}. Only squares can be turned.` },
          ],
          solution: [{ say: "Turning a shape does not change it." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === `a ${NAMES[p.sides] ?? "shape"}`;
    if (question.archetype === "choose-the-diagram") {
      const v =
        (chosenFigure(question) as CartesianSpec | undefined)?.polygons?.[0]?.vertices ?? [];
      return sameShape(v, normal(rotate(SHAPES[p.shape] as Coord[], p.quarters)));
    }
    return true;
  },
});
