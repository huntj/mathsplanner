/**
 * @statement GF-G4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// GF-G4: Derive and apply properties of special quadrilaterals, triangles and other plane figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { pointAt, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";
import { kite, parallelogram } from "../shared/shapes.ts";

interface Params {
  /** Angle DAB of the parallelogram. */
  a: number;
  target: "adjacent" | "opposite";
  /** Kite angles at A (bottom) and C (top); the equal angles are at B and D. */
  bottom: number;
  top: number;
  /** Angle ADC of the rhombus at depth 5; even, so half of 180° − d is whole. */
  d: number;
  claim: number;
}

/** The angle at `v` between the rays to `a` and `b`, in degrees (0° to 180°). */
function angleAt(points: Record<string, Coord>, v: string, a: string, b: string): number {
  const [V, P, Q] = [v, a, b].map((n) => points[n] ?? [0, 0]) as [Coord, Coord, Coord];
  const t = Math.atan2(P[1] - V[1], P[0] - V[0]) - Math.atan2(Q[1] - V[1], Q[0] - V[0]);
  return Math.abs((((t * 180) / Math.PI + 540) % 360) - 180);
}

/** Rhombus ABCD with angle ADC = d and diagonal AC; angle BAC is marked y. */
function rhombus(d: number): GeometrySpec {
  const A: Coord = [0, 0];
  const B: Coord = [3, 0];
  const D = pointAt(A, 180 - d, 3);
  const C: Coord = [B[0] + D[0], B[1] + D[1]];
  const sides = [
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["D", "A"],
  ] as const;
  return {
    type: "geometry",
    points: { A, B, C, D },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [...sides.map(([from, to]) => ({ from, to, ticks: 1 })), { from: "A", to: "C" }],
    angles: [
      { vertex: "D", from: "A", to: "C", value: d },
      { vertex: "A", from: "B", to: "C", value: (180 - d) / 2, label: "y" },
    ],
    pointLabels: true,
    description: `Rhombus ABCD with diagonal AC. Angle ADC is ${d}° and angle BAC is marked y.`,
  };
}

const CLAIMS = [
  {
    claim: "The opposite angles of a parallelogram are equal.",
    truth: "always" as const,
    reasons: [
      {
        text: "Each pair of neighbouring angles adds to 180°, so both opposite angles equal 180° minus the same angle.",
        correct: true,
      },
      {
        text: "Never: opposite angles of a parallelogram add up to 180°.",
        code: "GEO.PARALLELOGRAM.OPPOSITE-SUPPLEMENTARY",
      },
      { text: "Only when the parallelogram is a rectangle.", code: "GEO.SHAPES.HIERARCHY" },
    ],
  },
  {
    claim: "A parallelogram has a line of symmetry.",
    truth: "sometimes" as const,
    reasons: [
      { text: "Only when it is a rhombus or a rectangle (including a square).", correct: true },
      { text: "Always: its diagonals are lines of symmetry.", code: "GEO.SYMMETRY.DIAGONAL" },
      {
        text: "Never: rhombuses and rectangles are not parallelograms.",
        code: "GEO.SHAPES.HIERARCHY",
      },
    ],
  },
  {
    claim: "A kite has exactly one pair of equal angles.",
    truth: "sometimes" as const,
    reasons: [
      { text: "Most kites do, but a kite that is a rhombus has two pairs.", correct: true },
      { text: "Always: a rhombus is a different shape from a kite.", code: "GEO.SHAPES.HIERARCHY" },
      { text: "Never: all four angles of a kite are different." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "GF-G4",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "GEO.PARALLEL.CO-INTERIOR-EQUAL",
    "GEO.PARALLELOGRAM.OPPOSITE-SUPPLEMENTARY",
    "GEO.KITE.EQUAL-PAIR",
    "GEO.ANGLES.QUADRILATERAL-180",
    "GEO.SHAPES.HIERARCHY",
    "GEO.SYMMETRY.DIAGONAL",
  ],

  params(rng, numbers) {
    const bottom = pickAngle(rng, numbers, 50, 110);
    const top = pickAngle(rng, numbers, 40, 100, [bottom]);
    if ((360 - bottom - top) % 2 !== 0) reject("the kite's equal angles would not be whole");
    return {
      a: pickAngle(rng, numbers, 40, 140, [90]),
      target: rng.pick(["adjacent", "opposite"] as const),
      bottom,
      top,
      d: 2 * pickAngle(rng, numbers, 20, 70, [45]),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const answer = p.target === "adjacent" ? 180 - p.a : p.a;
        const at =
          p.target === "adjacent"
            ? { vertex: "B", from: "C", to: "A" }
            : { vertex: "C", from: "D", to: "B" };
        return A.standard({
          question: [
            "ABCD is a parallelogram.",
            A.figure(
              parallelogram(p.a, {
                angles: [
                  { vertex: "A", from: "B", to: "D", value: p.a },
                  { ...at, value: answer, label: "x" },
                ],
                pointLabels: true,
                description: `Parallelogram ABCD with angle DAB = ${p.a}° and angle x at ${at.vertex}.`,
              }),
            ),
          ],
          ask: "Work out the size of angle x.",
          answer: A.degrees(answer),
          wrong: wrongs(answer, [
            p.target === "adjacent"
              ? {
                  code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
                  value: A.degrees(p.a),
                  feedback:
                    "Neighbouring angles in a parallelogram are co-interior: they add up to 180°, they are not equal.",
                }
              : {
                  code: "GEO.PARALLELOGRAM.OPPOSITE-SUPPLEMENTARY",
                  value: A.degrees(180 - p.a),
                  feedback:
                    "Opposite angles of a parallelogram are equal; it is neighbouring angles that add up to 180°.",
                },
          ]),
          solution:
            p.target === "adjacent"
              ? [
                  {
                    say: "AD is parallel to BC, so angles A and B are co-interior and add up to 180°.",
                    math: `x = 180^\\circ - ${deg(p.a)} = ${deg(answer)}`,
                  },
                ]
              : [{ say: "Opposite angles of a parallelogram are equal.", math: `x = ${deg(p.a)}` }],
        });
      }
      case 2: {
        const equal = (360 - p.bottom - p.top) / 2;
        const figure = kite(p.bottom, p.top, {
          angles: [
            { vertex: "A", from: "B", to: "D", value: p.bottom },
            { vertex: "C", from: "D", to: "B", value: p.top },
            { vertex: "B", from: "C", to: "A", value: equal, label: "x" },
          ],
          pointLabels: true,
          description: `Kite ABCD with angle A = ${p.bottom}°, angle C = ${p.top}° and angle B marked x.`,
        });
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["ABCD is a kite.", A.figure(figure)],
              ask: "Work out the size of angle x.",
            },
            {
              question: [
                `ABCD is a kite with AB = AD and CB = CD. Angle DAB is ${p.bottom}° and angle BCD is ${p.top}°.`,
                A.figure(figure),
              ],
              ask: "Work out angle ABC.",
            },
          ],
          answer: A.degrees(equal),
          wrong: wrongs(equal, [
            {
              code: "GEO.KITE.EQUAL-PAIR",
              value: A.degrees(2 * equal),
              feedback:
                "That is angles B and D together. A kite's other two angles are equal, so share it between them.",
            },
            180 - p.bottom - p.top > 0
              ? {
                  code: "GEO.ANGLES.QUADRILATERAL-180",
                  value: A.degrees((180 - p.bottom - p.top) / 2),
                  feedback: "The angles in a quadrilateral add up to 360°, not 180°.",
                }
              : undefined,
          ]),
          solution: [
            {
              say: "The angles of a quadrilateral add up to 360°, so angles B and D together are",
              math: `360^\\circ - ${deg(p.bottom)} - ${deg(p.top)} = ${deg(2 * equal)}`,
            },
            {
              say: "A kite's angles at B and D are equal, so",
              math: `x = ${deg(2 * equal)} \\div 2 = ${deg(equal)}`,
            },
          ],
        });
      }
      case 4: {
        const c = CLAIMS[p.claim];
        if (!c) return reject("no claim");
        return A.alwaysSometimesNever({
          rng,
          claim: c.claim,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
      default: {
        const dab = 180 - p.d;
        return A.multiStepContext({
          context: ["ABCD is a rhombus. AC is a diagonal.", A.figure(rhombus(p.d))],
          parts: [
            {
              ask: "Work out angle DAB.",
              answer: A.degrees(dab),
              wrong: wrongs(dab, [
                {
                  code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
                  value: A.degrees(p.d),
                  feedback:
                    "AB is parallel to DC, so angles D and A are co-interior: they add up to 180°.",
                },
              ]),
            },
            { ask: "Work out the size of angle y.", answer: A.degrees(dab / 2) },
          ],
          solution: [
            {
              say: "AB is parallel to DC, so angles ADC and DAB are co-interior.",
              math: `\\angle DAB = 180^\\circ - ${deg(p.d)} = ${deg(dab)}`,
            },
            {
              say: "Triangle ADC is isosceles (DA = DC), and the diagonal of a rhombus cuts its angle in half.",
              math: `y = ${deg(dab)} \\div 2 = ${deg(dab / 2)}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const numbers = question.parts.map((part) =>
      part.answer.type === "number" ? part.answer.value : NaN,
    );
    const points = question.diagrams[0]?.points as Record<string, Coord> | undefined;
    if (!points || numbers.some(Number.isNaN)) return true;
    const near = (a: number, b: number | undefined) => b !== undefined && Math.abs(a - b) < 1e-6;
    switch (question.archetype) {
      case "standard":
        return near(
          p.target === "adjacent" ? angleAt(points, "B", "A", "C") : angleAt(points, "C", "B", "D"),
          numbers[0],
        );
      case "varied-form":
        return (
          near(angleAt(points, "B", "A", "C"), numbers[0]) &&
          near(angleAt(points, "D", "A", "C"), numbers[0])
        );
      case "multi-step-context":
        return (
          near(angleAt(points, "A", "B", "D"), numbers[0]) &&
          near(angleAt(points, "A", "B", "C"), numbers[1])
        );
      default:
        return true;
    }
  },
});
