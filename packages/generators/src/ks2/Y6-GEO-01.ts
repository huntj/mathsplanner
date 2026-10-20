/**
 * @statement Y6-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y6-GEO-01: Draw 2D shapes using given dimensions and angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { triangleASA, type GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle } from "../shared/angles.ts";

interface Params {
  /** Base AB in cm, and the angles at A and B. */
  base: number;
  a: number;
  b: number;
  /** Three lengths, one of which is too long to make a triangle: [short, short, long]. */
  sides: [number, number, number];
}

function target(p: Params): GeometrySpec {
  return {
    type: "geometry",
    points: triangleASA(p.a, p.base, p.b),
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [{ from: "A", to: "B", label: `${p.base}\\text{ cm}`, length: p.base }],
    angles: [
      { vertex: "A", from: "B", to: "C", value: p.a },
      { vertex: "B", from: "C", to: "A", value: p.b },
    ],
    pointLabels: true,
  };
}

export default defineGenerator<Params>({
  id: "Y6-GEO-01",
  version: "1.0.1",
  depths: [3, 4],
  misconceptions: ["GEO.TRIANGLE.INEQUALITY"],

  params(rng, numbers) {
    const base = rng.int(numbers === "friendly" ? 5 : 4, numbers === "stretch" ? 11 : 9);
    const a = pickAngle(rng, numbers, 30, 80);
    const b = pickAngle(rng, numbers, 30, 80);
    if (180 - a - b < 25) return reject("third angle too small to draw");
    const s1 = rng.int(2, 6);
    const s2 = rng.int(2, 6);
    const long = s1 + s2 + rng.int(numbers === "stretch" ? 0 : 1, 4);
    return { base, a, b, sides: [s1, s2, long] };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 3) {
      return A.drawOrPlot({
        question: [
          `Draw triangle ABC with AB = ${p.base} cm, angle A = `,
          A.math(deg(p.a)),
          " and angle B = ",
          A.math(deg(p.b)),
          ". The side AB has been drawn for you.",
        ],
        canvas: {
          type: "geometry",
          points: { A: [0, 0], B: [p.base, 0] },
          segments: [{ from: "A", to: "B", label: `${p.base}\\text{ cm}`, length: p.base }],
          pointLabels: true,
        },
        target: target(p),
        tolerance: 0.2,
        solution: [
          {
            say: `Put the centre of the protractor on A, with the base line along AB, and mark ${p.a}°. Draw a long line from A through the mark.`,
          },
          { say: `Do the same at B with ${p.b}°.` },
          { say: "Where the two lines cross is C." },
          {
            say: `Check: angle C should measure ${180 - p.a - p.b}°, because the angles of a triangle add up to 180°.`,
          },
        ],
      });
    }
    const [x, y, long] = p.sides;
    const equal = x + y === long;
    return A.explainTheError({
      rng,
      claim: `Mo says he can draw a triangle with sides ${x} cm, ${y} cm and ${long} cm.`,
      correct: `He cannot: ${x} cm + ${y} cm = ${x + y} cm, which is ${equal ? "only equal to" : "less than"} ${long} cm, so the two shorter sides cannot meet.`,
      distractors: [
        {
          content: "He can: any three lengths make a triangle if you use a ruler carefully.",
          code: "GEO.TRIANGLE.INEQUALITY",
          feedback: "Try it: the two shorter sides cannot reach each other.",
        },
        { content: "He cannot, because the sides of a triangle must all be different." },
        { content: `He cannot, because a triangle cannot have a side longer than ${long - 1} cm.` },
      ],
      ask: "Which explanation is correct?",
      solution: [
        {
          say: "In any triangle, the two shorter sides must add up to more than the longest side.",
        },
        {
          say: `${x} + ${y} = ${x + y}, which is not more than ${long}, so these sides cannot make a triangle.`,
        },
      ],
    });
  },

  verify(p, question) {
    if (question.archetype === "draw-or-plot") {
      // The drawn triangle's third angle is what is left of 180°, and it is positive.
      return 180 - p.a - p.b > 0;
    }
    const [x, y, long] = p.sides;
    return x + y <= long;
  },
});
