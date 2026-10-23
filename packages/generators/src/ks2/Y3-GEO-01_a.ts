/**
 * @statement Y3-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-01.a: Draw 2D shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon, type GeometrySpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { shape } from "../shared/shapes.ts";

const NAMES: Record<number, string> = { 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon" };

// Descriptions to draw from, with the shape that fits.
const BRIEFS = [
  { text: "4 equal sides and 4 right angles", answer: "Square", others: ["Rectangle", "Rhombus"] },
  {
    text: "4 sides, 4 right angles, and two long sides and two short sides",
    answer: "Rectangle",
    others: ["Square", "Kite"],
  },
  {
    text: "3 sides, two of them the same length",
    answer: "Isosceles triangle",
    others: ["Equilateral triangle", "Scalene triangle"],
  },
  {
    text: "3 sides and a right angle",
    answer: "Right-angled triangle",
    others: ["Equilateral triangle", "Rectangle"],
  },
];

interface Params {
  sides: number;
  brief: number;
  rotation: number;
}

const sidesOf = (spec: unknown) =>
  Object.keys((spec as GeometrySpec | undefined)?.points ?? {}).length;

export default defineGenerator<Params>({
  id: "Y3-GEO-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SHAPES.SIDES-VERTICES", "GEO.SHAPES.ORIENTATION"],

  params(rng, numbers) {
    const sides = rng.int(5, numbers === "friendly" ? 6 : 8);
    if (sides === 7 && numbers !== "stretch") reject("heptagons at stretch");
    return { sides, brief: rng.int(0, BRIEFS.length - 1), rotation: rng.int(20, 70) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.chooseTheDiagram({
          rng,
          question: [`Mo is asked to draw a ${NAMES[p.sides]}. Which drawing is right?`],
          correct: regularPolygon(p.sides),
          distractors: [5, 6, 7, 8]
            .filter((n) => n !== p.sides)
            .slice(0, 2)
            .map((n) => ({
              figure: regularPolygon(n),
              code: "GEO.SHAPES.SIDES-VERTICES",
              feedback: `That shape has ${n} sides. A ${NAMES[p.sides]} has ${p.sides}.`,
            })),
          solution: [
            { say: `A ${NAMES[p.sides]} has ${p.sides} straight sides and ${p.sides} vertices.` },
          ],
        });
      case 2: {
        const b = BRIEFS[p.brief] ?? BRIEFS[0];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Jen draws a shape with ${b?.text}.`],
          ask: "What shape has she drawn?",
          correct: b?.answer ?? "",
          distractors: (b?.others ?? []).map((o) => ({
            content: o,
            feedback: "Check every part of the description against the shape.",
          })),
          solution: [{ say: `Only a ${(b?.answer ?? "").toLowerCase()} has ${b?.text}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Theo draws a square standing on one corner.",
            A.figure(shape("square", { rotation: 45 })),
            "He says it is no longer a square.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It still has 4 equal sides and 4 right angles. Turning a shape does not change it.",
              correct: true,
            },
            {
              text: "True. Standing on a corner makes it a diamond, not a square.",
              code: "GEO.SHAPES.ORIENTATION",
            },
            { text: "True. A square must have a flat bottom.", code: "GEO.SHAPES.ORIENTATION" },
          ],
          solution: [
            { say: "A shape's name depends on its sides and angles, not which way it faces." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return sidesOf(chosenFigure(question)) === p.sides;
    if (question.key.depth === 2) return chosenText(question) === BRIEFS[p.brief]?.answer;
    return true;
  },
});
