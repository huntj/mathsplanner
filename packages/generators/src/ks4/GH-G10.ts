/**
 * @statement GH-G10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// GH-G10: Apply and prove the standard circle theorems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";
import { circle, onCircle, RADIUS } from "../shared/circles.ts";

type Theorem = "centre" | "cyclic" | "tangent";

interface Params {
  theorem: Theorem;
  /** Angle at the circumference for the centre theorem (the centre angle is 2c). */
  c: number;
  /** For the centre theorem: whether the circumference angle is given (find the centre angle). */
  findCentre: boolean;
  /** Where C sits on the major arc. */
  shift: number;
  /** Angle DAB of the cyclic quadrilateral. */
  a: number;
  /** Angle PTO between the tangent and OT. */
  t: number;
  claim: number;
}

/** Points A and B on the circle with angle AOB = 2c, and C on the major arc. */
function centreFigure(
  p: Params,
  labels: { O?: string; C?: string; A?: string },
  chord = false,
): GeometrySpec {
  const pts = { A: onCircle(-90 - p.c), B: onCircle(-90 + p.c), C: onCircle(90 + p.shift) };
  return circle({
    points: pts,
    segments: [
      { from: "O", to: "A" },
      { from: "O", to: "B" },
      { from: "C", to: "A" },
      { from: "C", to: "B" },
      ...(chord ? [{ from: "A", to: "B" }] : []),
    ],
    angles: [
      { vertex: "O", from: "A", to: "B", value: 2 * p.c, ...(labels.O ? { label: labels.O } : {}) },
      { vertex: "C", from: "A", to: "B", value: p.c, ...(labels.C ? { label: labels.C } : {}) },
      ...(labels.A ? [{ vertex: "A", from: "B", to: "O", value: 90 - p.c, label: labels.A }] : []),
    ],
    pointLabels: ["O", "A", "B", "C"],
    description: `A circle with centre O. Points A, B and C are on the circle; angle AOB is at the centre and angle ACB at the circumference.`,
  });
}

/** Cyclic quadrilateral ABCD with angle DAB = a; angle BCD is marked x. */
function cyclicFigure(a: number): GeometrySpec {
  return circle({
    points: { A: onCircle(225), B: onCircle(45 - a), C: onCircle(45), D: onCircle(45 + a) },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    angles: [
      { vertex: "A", from: "B", to: "D", value: a },
      { vertex: "C", from: "D", to: "B", value: 180 - a, label: "x" },
    ],
    pointLabels: ["O", "A", "B", "C", "D"],
    description: `A cyclic quadrilateral ABCD inside a circle with centre O. Angle DAB is ${a}° and angle BCD is marked x.`,
  });
}

/** A tangent at P meeting OT; angle PTO = t, angle POT is marked x. The right angle is not marked. */
function tangentFigure(t: number): GeometrySpec {
  const P = onCircle(-90);
  const pt = RADIUS / Math.tan((t * Math.PI) / 180);
  const T: Coord = [Math.round(pt * 1e9) / 1e9, -RADIUS];
  return circle({
    points: { P, T, S: [-2.2, -RADIUS] },
    segments: [
      { from: "S", to: "T" },
      { from: "O", to: "P" },
      { from: "O", to: "T" },
    ],
    angles: [
      { vertex: "T", from: "O", to: "P", value: t },
      { vertex: "O", from: "P", to: "T", value: 90 - t, label: "x" },
    ],
    pointLabels: ["O", "P", "T"],
    description: `A circle with centre O and a tangent touching it at P. T is on the tangent; angle PTO is ${t}° and angle POT is marked x.`,
  });
}

/** The angle at `v` between the rays to `a` and `b`, in degrees (0° to 180°). */
function angleAt(points: Record<string, Coord>, v: string, a: string, b: string): number {
  const [V, P, Q] = [v, a, b].map((n) => points[n] ?? [0, 0]) as [Coord, Coord, Coord];
  const turn = Math.atan2(P[1] - V[1], P[0] - V[0]) - Math.atan2(Q[1] - V[1], Q[0] - V[0]);
  return Math.abs((((turn * 180) / Math.PI + 540) % 360) - 180);
}

const CLAIMS = [
  {
    statement:
      "The angle at the centre is half the angle at the circumference, when both stand on the same arc.",
    truth: false,
    reasons: [
      {
        text: "It is the other way round: the angle at the centre is twice the angle at the circumference.",
        correct: true,
      },
      {
        text: "The centre is halfway across the circle, so its angle is half.",
        code: "GEO.CIRCLE.CENTRE-HALF",
      },
      { text: "The two angles are always equal." },
    ],
  },
  {
    statement: "A tangent meets the radius at the point where it touches the circle at 90°.",
    truth: true,
    reasons: [
      {
        text: "The tangent is perpendicular to the radius at the point of contact.",
        correct: true,
      },
      {
        text: "They can meet at any angle, depending on where the tangent is drawn.",
        code: "GEO.CIRCLE.TANGENT-RADIUS",
      },
      { text: "Only when the tangent is horizontal." },
    ],
  },
  {
    statement: "Opposite angles in a cyclic quadrilateral are equal.",
    truth: false,
    reasons: [
      { text: "Opposite angles in a cyclic quadrilateral add up to 180°.", correct: true },
      {
        text: "Like a parallelogram, its opposite angles are equal.",
        code: "GEO.CIRCLE.CYCLIC-EQUAL",
      },
      { text: "They add up to 360°." },
    ],
  },
  {
    statement: "The angle in a semicircle is a right angle.",
    truth: true,
    reasons: [
      {
        text: "The diameter makes a 180° angle at the centre, so the angle at the circumference is half of it: 90°.",
        correct: true,
      },
      { text: "Only when the triangle is isosceles." },
      {
        text: "No: the angle at the circumference is 180°, the same as at the centre.",
        code: "GEO.CIRCLE.CENTRE-HALF",
      },
    ],
  },
];

export default defineGenerator<Params>({
  id: "GH-G10",
  version: "1.0.1",
  depths: [1, 4, 5],
  misconceptions: [
    "GEO.CIRCLE.CENTRE-HALF",
    "GEO.CIRCLE.CYCLIC-EQUAL",
    "GEO.CIRCLE.TANGENT-RADIUS",
    "GEO.ISOSCELES.APEX-EQUALS-BASE",
  ],

  params(rng, numbers) {
    return {
      theorem: rng.pick(["centre", "cyclic", "tangent"] as const),
      c: pickAngle(rng, numbers, 25, 75),
      findCentre: rng.bool(),
      shift: numbers === "friendly" ? 0 : rng.int(-30, 30),
      a: pickAngle(rng, numbers, 60, 120, [90]),
      t: pickAngle(rng, numbers, 25, 65, [45]),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        if (p.theorem === "centre") {
          const x = p.findCentre ? 2 * p.c : p.c;
          return A.standard({
            question: [
              "O is the centre of the circle.",
              A.figure(centreFigure(p, p.findCentre ? { O: "x" } : { C: "x" })),
            ],
            ask: "Work out the size of angle x.",
            answer: A.degrees(x),
            wrong: wrongs(x, [
              p.findCentre
                ? {
                    code: "GEO.CIRCLE.CENTRE-HALF",
                    value: A.degrees(p.c / 2),
                    feedback:
                      "The angle at the centre is twice the angle at the circumference, not half.",
                  }
                : {
                    code: "GEO.CIRCLE.CENTRE-HALF",
                    value: A.degrees(4 * p.c),
                    feedback: "The angle at the circumference is half the angle at the centre.",
                  },
            ]),
            solution: [
              {
                say: "The angle at the centre is twice the angle at the circumference.",
                math: p.findCentre
                  ? `x = 2 \\times ${deg(p.c)} = ${deg(x)}`
                  : `x = ${deg(2 * p.c)} \\div 2 = ${deg(x)}`,
              },
            ],
          });
        }
        if (p.theorem === "cyclic") {
          const x = 180 - p.a;
          return A.standard({
            question: ["A, B, C and D lie on the circle.", A.figure(cyclicFigure(p.a))],
            ask: "Work out the size of angle x.",
            answer: A.degrees(x),
            wrong: wrongs(x, [
              {
                code: "GEO.CIRCLE.CYCLIC-EQUAL",
                value: A.degrees(p.a),
                feedback:
                  "ABCD is a cyclic quadrilateral, so its opposite angles add up to 180°; they are not equal.",
              },
            ]),
            solution: [
              {
                say: "Opposite angles in a cyclic quadrilateral add up to 180°.",
                math: `x = 180^\\circ - ${deg(p.a)} = ${deg(x)}`,
              },
            ],
          });
        }
        const x = 90 - p.t;
        return A.standard({
          question: [
            "O is the centre of the circle. The line ST is a tangent to the circle at P.",
            A.figure(tangentFigure(p.t)),
          ],
          ask: "Work out the size of angle x.",
          answer: A.degrees(x),
          wrong: wrongs(x, [
            {
              code: "GEO.CIRCLE.TANGENT-RADIUS",
              value: A.degrees(180 - p.t),
              feedback:
                "Angle OPT is 90°, because a tangent meets a radius at a right angle. Use all three angles of triangle OPT.",
            },
          ]),
          solution: [
            { say: "A tangent meets the radius at a right angle, so angle OPT = 90°." },
            {
              say: "Angles in triangle OPT add up to 180°:",
              math: `x = 180^\\circ - 90^\\circ - ${deg(p.t)} = ${deg(x)}`,
            },
          ],
        });
      }
      case 4: {
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
      default: {
        const x = 2 * p.c;
        const y = 90 - p.c;
        return A.multiStepContext({
          context: [
            "O is the centre of the circle. A, B and C lie on the circle.",
            A.figure(centreFigure(p, { O: "x", A: "y" }, true)),
          ],
          parts: [
            {
              ask: "Work out the size of angle x.",
              answer: A.degrees(x),
              wrong: wrongs(x, [
                {
                  code: "GEO.CIRCLE.CENTRE-HALF",
                  value: A.degrees(p.c / 2),
                  feedback: "The angle at the centre is twice the angle at the circumference.",
                },
              ]),
            },
            {
              ask: "Work out the size of angle y.",
              answer: A.degrees(y),
              wrong: wrongs(y, [
                {
                  code: "GEO.ISOSCELES.APEX-EQUALS-BASE",
                  value: A.degrees(x),
                  feedback:
                    "OA = OB (both radii), so triangle OAB is isosceles: its base angles are equal, but not equal to the angle at O.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: "The angle at the centre is twice the angle at the circumference:",
              math: `x = 2 \\times ${deg(p.c)} = ${deg(x)}`,
            },
            {
              say: "OA and OB are radii, so triangle OAB is isosceles and its base angles are equal:",
              math: `y = (180^\\circ - ${deg(x)}) \\div 2 = ${deg(y)}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const values = question.parts.map((part) =>
      part.answer.type === "number" ? part.answer.value : NaN,
    );
    const points = question.diagrams[0]?.points as Record<string, Coord> | undefined;
    if (!points || values.some(Number.isNaN)) return true;
    const near = (a: number, b: number | undefined) => b !== undefined && Math.abs(a - b) < 1e-6;
    if (question.archetype === "multi-step-context")
      return (
        near(angleAt(points, "O", "A", "B"), values[0]) &&
        near(angleAt(points, "A", "B", "O"), values[1])
      );
    // Every point named on the circle really is on it, and x is the angle measured there.
    const onCircle = ["A", "B", "C", "D", "P"]
      .filter((n) => points[n])
      .every((n) => near(Math.hypot(...(points[n] as Coord)), RADIUS));
    const measured = {
      centre: p.findCentre ? angleAt(points, "O", "A", "B") : angleAt(points, "C", "A", "B"),
      cyclic: angleAt(points, "C", "B", "D"),
      tangent: angleAt(points, "O", "P", "T"),
    }[p.theorem];
    return onCircle && near(measured, values[0]);
  },
});
