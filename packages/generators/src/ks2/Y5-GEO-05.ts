/**
 * @statement Y5-GEO-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y5-GEO-05: Use the properties of rectangles to deduce related facts and find missing lengths and
// angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";

interface Params {
  /** Angle between the diagonal AC and the side AB; never 45°, which would make a square. */
  a: number;
  length: number;
  width: number;
  claim: number;
}

const round = (v: number) => Math.round(v * 1e9) / 1e9;

/** Rectangle ABCD with diagonal AC at angle `a` to AB; angle BAC is given and CAD is x. */
function withDiagonal(a: number): GeometrySpec {
  const rad = (a * Math.PI) / 180;
  const w = round(5 * Math.cos(rad));
  const h = round(5 * Math.sin(rad));
  const points: Record<string, Coord> = { A: [0, 0], B: [w, 0], C: [w, h], D: [0, h] };
  return {
    type: "geometry",
    points,
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [{ from: "A", to: "C" }],
    angles: [
      { vertex: "B", from: "C", to: "A", right: true },
      { vertex: "C", from: "D", to: "B", right: true },
      { vertex: "D", from: "A", to: "C", right: true },
      { vertex: "A", from: "B", to: "C", value: a },
      { vertex: "A", from: "C", to: "D", value: 90 - a, label: "x" },
    ],
    pointLabels: true,
    description: `Rectangle ABCD with diagonal AC. Angle BAC is ${a}° and angle CAD is marked x.`,
  };
}

const CLAIMS = [
  {
    statement: "Ali says the diagonals of every rectangle cross at right angles.",
    truth: false,
    reasons: [
      { text: "They cross at right angles only when the rectangle is a square.", correct: true },
      {
        text: "All the angles in a rectangle are right angles, so the diagonals must cross at right angles too.",
        code: "GEO.RECTANGLE.DIAGONALS-PERPENDICULAR",
      },
      { text: "The diagonals of a rectangle are parallel, so they never cross." },
    ],
  },
  {
    statement: "Ben says the two diagonals of a rectangle are always the same length.",
    truth: true,
    reasons: [
      {
        text: "Each diagonal joins opposite corners across the same length and width, so they match.",
        correct: true,
      },
      { text: "Only a square has diagonals the same length.", code: "GEO.SHAPES.HIERARCHY" },
      { text: "It depends which way round the rectangle is drawn." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y5-GEO-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "GEO.RECTANGLE.DIAGONAL-BISECTS",
    "GEO.ANGLES.ADDS-KNOWN",
    "GEO.RECTANGLE.PERIMETER-PAIRS",
    "GEO.RECTANGLE.DIAGONALS-PERPENDICULAR",
    "GEO.SHAPES.HIERARCHY",
  ],

  params(rng, numbers) {
    const max = { friendly: 10, standard: 20, stretch: 45 }[numbers];
    const length = rng.int(4, max);
    const width = rng.int(2, length - 1);
    return {
      a: pickAngle(rng, numbers, 25, 65, [45]),
      length,
      width,
      // Claim 2 is the diagonal question at depth 4, drawn from the rectangle above.
      claim: rng.int(0, CLAIMS.length),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["ABCD is a rectangle.", A.figure(withDiagonal(p.a))],
          ask: "Work out the size of angle x.",
          answer: A.degrees(90 - p.a),
          wrong: wrongs(90 - p.a, [
            {
              code: "GEO.RECTANGLE.DIAGONAL-BISECTS",
              value: A.degrees(p.a),
              feedback:
                "The diagonal does not cut the corner in half unless the rectangle is a square. Use the right angle at A.",
            },
            {
              code: "GEO.ANGLES.ADDS-KNOWN",
              value: A.degrees(90 + p.a),
              feedback: `The two angles at A make the right angle, so subtract: 90° − ${p.a}°.`,
            },
          ]),
          solution: [
            {
              say: "Every corner of a rectangle is a right angle, so the two angles at A add up to 90°.",
            },
            { say: "So", math: `x = 90^\\circ - ${deg(p.a)} = ${deg(90 - p.a)}` },
          ],
        });
      case 2: {
        const perimeter = 2 * (p.length + p.width);
        return A.reverse({
          question: [
            `This rectangle has a perimeter of ${perimeter} cm.`,
            A.figure({
              type: "geometry",
              points: { A: [0, 0], B: [p.length, 0], C: [p.length, p.width], D: [0, p.width] },
              polygons: [{ vertices: ["A", "B", "C", "D"] }],
              segments: [
                { from: "A", to: "B", label: `${p.length}\\text{ cm}`, length: p.length },
                { from: "B", to: "C", label: "w" },
              ],
              angles: ["A", "B", "C", "D"].map((v, i, all) => ({
                vertex: v,
                from: all[(i + 1) % 4] ?? "",
                to: all[(i + 3) % 4] ?? "",
                right: true,
              })),
              description: `A rectangle ${p.length} cm long with its width marked w.`,
            }),
          ],
          ask: "Work out the width, w.",
          answer: A.number(p.width, { units: "cm" }),
          wrong: wrongs(p.width, [
            {
              code: "GEO.RECTANGLE.PERIMETER-PAIRS",
              value: A.number(perimeter - p.length, { units: "cm" }),
              feedback:
                "The perimeter goes round all four sides: two lengths and two widths. Take off both lengths, then halve.",
            },
            {
              code: "GEO.RECTANGLE.PERIMETER-PAIRS",
              value: A.number(perimeter - 2 * p.length, { units: "cm" }),
              feedback: "That is both widths together. Halve it to get one width.",
            },
          ]),
          solution: [
            {
              say: "Opposite sides of a rectangle are equal, so one length and one width make half the perimeter.",
            },
            { say: "Half the perimeter:", math: `${perimeter} \\div 2 = ${perimeter / 2}` },
            { say: "So", math: `w = ${perimeter / 2} - ${p.length} = ${p.width}\\text{ cm}` },
          ],
        });
      }
      default: {
        if (p.claim === CLAIMS.length) {
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "ABCD is a rectangle. Cara says the diagonal AC cuts angle DAB exactly in half.",
              A.figure({
                ...withDiagonal(p.a),
                angles: withDiagonal(p.a).angles?.slice(0, 4) ?? [],
              }),
            ],
            truth: false,
            reasons: [
              {
                text: `Angle BAC is ${p.a}°, so angle CAD is ${90 - p.a}°. The two parts are not equal.`,
                correct: true,
              },
              {
                text: "A diagonal always cuts the corner of a rectangle in half.",
                code: "GEO.RECTANGLE.DIAGONAL-BISECTS",
              },
              { text: "You cannot tell without measuring with a protractor." },
            ],
            solution: [
              {
                say: `The angles at A add to 90°, so angle CAD = 90° − ${p.a}° = ${90 - p.a}°. A diagonal halves the corner only in a square.`,
              },
            ],
          });
        }
        const c = CLAIMS[p.claim];
        if (!c) return reject("no claim");
        return A.trueOrFalseWhy({
          rng,
          statement: c.statement,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    if (question.archetype === "reverse")
      return answer.value === (2 * (p.length + p.width)) / 2 - p.length;
    // The drawn diagonal makes angle a with AB; x is what is left of the right angle.
    const C = (question.diagrams[0]?.points as Record<string, Coord> | undefined)?.C;
    if (!C) return false;
    const measured = (Math.atan2(C[1], C[0]) * 180) / Math.PI;
    return Math.abs(90 - measured - answer.value) < 1e-6;
  },
});
