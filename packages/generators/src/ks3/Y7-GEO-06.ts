/**
 * @statement Y7-GEO-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y7-GEO-06: Derive and use the sum of angles in a triangle; use it to deduce the angle sum in
// any polygon and derive properties of regular polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon } from "@mathsplanner/diagrams";
import { deg, wrongs } from "../shared/angles.ts";

interface Params {
  /** Sides of the polygon whose angle sum is asked for. */
  sides: number;
  /** Sides of a regular polygon with whole-number angles. */
  regular: number;
  /** For regular polygons: ask for the interior or the exterior angle. */
  ask: "interior" | "exterior";
}

/** Regular polygons whose interior and exterior angles are whole numbers. */
const NICE_REGULAR = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
const NAMES: Record<number, string> = {
  5: "pentagon",
  6: "hexagon",
  7: "heptagon",
  8: "octagon",
  9: "nonagon",
  10: "decagon",
  12: "dodecagon",
};
const named = (n: number) => (NAMES[n] ? `a ${NAMES[n]}` : `a polygon with ${n} sides`);
const regularNamed = (n: number) =>
  NAMES[n] ? `a regular ${NAMES[n]}` : `a regular polygon with ${n} sides`;
const sumOf = (n: number) => (n - 2) * 180;

export default defineGenerator<Params>({
  id: "Y7-GEO-06",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.POLYGON.SUM-N-TIMES-180", "GEO.POLYGON.INTERIOR-EXTERIOR"],

  params(rng, numbers) {
    const sides = {
      friendly: rng.pick([5, 6, 8]),
      standard: rng.int(5, 12),
      stretch: rng.int(7, 20),
    }[numbers];
    const regular = {
      friendly: rng.pick([6, 8, 10, 12]),
      standard: rng.pick([5, 6, 8, 9, 10, 12]),
      stretch: rng.pick(NICE_REGULAR),
    }[numbers];
    return { sides, regular, ask: rng.pick(["interior", "exterior"] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `Work out the sum of the interior angles of ${named(p.sides)}.`,
            ...(p.sides <= 12 ? [A.figure(regularPolygon(p.sides))] : []),
          ],
          answer: A.degrees(sumOf(p.sides)),
          wrong: wrongs(sumOf(p.sides), [
            {
              code: "GEO.POLYGON.SUM-N-TIMES-180",
              value: A.degrees(p.sides * 180),
              feedback: `From one vertex, a ${p.sides}-sided polygon splits into ${p.sides - 2} triangles, not ${p.sides}.`,
            },
          ]),
          solution: A.steps.polygonAngleSum(p.sides),
        });
      case 2: {
        const exterior = 360 / p.regular;
        const interior = 180 - exterior;
        const answer = p.ask === "interior" ? interior : exterior;
        return A.standard({
          question: [
            `The diagram shows ${regularNamed(p.regular)}.`,
            ...(p.regular <= 12 ? [A.figure(regularPolygon(p.regular))] : []),
          ],
          ask: `Work out the size of each ${p.ask} angle.`,
          answer: A.degrees(answer),
          wrong: wrongs(answer, [
            {
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
              value: A.degrees(p.ask === "interior" ? exterior : interior),
              feedback: `That is the ${p.ask === "interior" ? "exterior" : "interior"} angle. Interior and exterior angles make a straight line, 180°.`,
            },
            p.ask === "interior"
              ? {
                  code: "GEO.POLYGON.SUM-N-TIMES-180",
                  value: A.degrees(180),
                  feedback: `Use (n − 2) × 180°, then share it between the ${p.regular} angles.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: "The exterior angles of any polygon add up to 360°, and in a regular polygon they are equal.",
              math: `360^\\circ \\div ${p.regular} = ${deg(exterior)}`,
            },
            ...(p.ask === "interior"
              ? [
                  {
                    say: "An interior and an exterior angle make a straight line.",
                    math: `180^\\circ - ${deg(exterior)} = ${deg(interior)}`,
                  },
                ]
              : []),
          ],
        });
      }
      case 4: {
        const wrong = p.sides * 180;
        return A.explainTheError({
          rng,
          claim: [
            `Ben says the interior angles of ${named(p.sides)} add up to `,
            A.math(deg(wrong)),
            `, because it has ${p.sides} sides and each triangle's angles add up to 180°.`,
          ],
          correct: `Joining one vertex to the others splits the polygon into ${p.sides - 2} triangles, not ${p.sides}.`,
          distractors: [
            {
              content: "The interior angles of every polygon add up to 360°.",
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
            },
            { content: `He should have multiplied by 360°, because there are ${p.sides} corners.` },
            { content: "He is right: each side gives one triangle." },
          ],
          solution: [
            ...A.steps.polygonAngleSum(p.sides),
            { say: `So the angles add up to ${sumOf(p.sides)}°, not ${wrong}°.` },
          ],
        });
      }
      default: {
        // Work backwards from an interior angle to the number of sides.
        const exterior = 360 / p.regular;
        const interior = 180 - exterior;
        return A.multiStepContext({
          context: ["Each interior angle of a regular polygon is ", A.math(deg(interior)), "."],
          parts: [
            {
              ask: "What is the size of each exterior angle?",
              answer: A.degrees(exterior),
            },
            {
              ask: "How many sides does the polygon have?",
              answer: A.number(p.regular),
              wrong: wrongs(p.regular, [
                Number.isInteger(360 / interior)
                  ? {
                      code: "GEO.POLYGON.INTERIOR-EXTERIOR",
                      value: A.number(360 / interior),
                      feedback: "Divide 360° by the exterior angle, not the interior angle.",
                    }
                  : undefined,
              ]),
            },
          ],
          solution: [
            {
              say: "Interior and exterior angles make a straight line.",
              math: `180^\\circ - ${deg(interior)} = ${deg(exterior)}`,
            },
            {
              say: "The exterior angles add up to 360°, and each is the same size.",
              math: `360^\\circ \\div ${deg(exterior)} = ${p.regular}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const first = question.parts[0]?.answer;
    if (first?.type !== "number") return true;
    if (question.parts.length === 2) {
      // The number of sides times the exterior angle is a full turn.
      const sides = question.parts[1]?.answer;
      return sides?.type === "number" && sides.value * first.value === 360;
    }
    if (question.stem.some((n) => n.t === "text" && n.v.includes("sum"))) {
      // Triangles from one vertex: n − 2 of them.
      return first.value / 180 + 2 === p.sides;
    }
    const exterior = 360 / p.regular;
    return p.ask === "interior" ? first.value + exterior === 180 : first.value * p.regular === 360;
  },
});
