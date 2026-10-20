/**
 * @statement Y9-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y9-GEO-03: Interpret mathematical relationships in geometric reasoning: derive angle facts,
// construct proofs, use known results
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import {
  transversal,
  triangleASA,
  type Coord,
  type GeoAngle,
  type GeometrySpec,
} from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";

type Relation =
  "alternate" | "corresponding" | "vertically opposite" | "co-interior" | "straight line";

interface Params {
  /** ∠BPQ, between the transversal and the lower parallel line. */
  g: number;
  relation: Relation;
  /** Which line of the working is wrong at depth 4. */
  mistake: number;
  /** Triangle angles at A and B at depth 5. */
  a: number;
  b: number;
}

const EQUAL: Relation[] = ["alternate", "corresponding", "vertically opposite"];
const isEqual = (r: Relation) => EQUAL.includes(r);

const REASON: Record<Relation, string> = {
  alternate: "alternate angles are equal",
  corresponding: "corresponding angles are equal",
  "vertically opposite": "vertically opposite angles are equal",
  "co-interior": "co-interior angles add up to 180°",
  "straight line": "angles on a straight line add up to 180°",
};

/** Where x sits for each relation, relative to the given angle ∠BPQ = g. */
function xAngle(r: Relation, g: number): GeoAngle {
  switch (r) {
    case "alternate":
      return { vertex: "Q", from: "C", to: "P", value: g, label: "x" };
    case "corresponding":
      return { vertex: "Q", from: "D", to: "T", value: g, label: "x" };
    case "vertically opposite":
      return { vertex: "P", from: "A", to: "S", value: g, label: "x" };
    case "co-interior":
      return { vertex: "Q", from: "P", to: "D", value: 180 - g, label: "x" };
    case "straight line":
      return { vertex: "P", from: "Q", to: "A", value: 180 - g, label: "x" };
  }
}

/** The angle at `v` between the rays to `a` and `b`, in degrees (0° to 180°). */
function angleAt(points: Record<string, Coord>, v: string, a: string, b: string): number {
  const [V, P, Q] = [v, a, b].map((n) => points[n] ?? [0, 0]) as [Coord, Coord, Coord];
  const t = Math.atan2(P[1] - V[1], P[0] - V[0]) - Math.atan2(Q[1] - V[1], Q[0] - V[0]);
  return Math.abs((((t * 180) / Math.PI + 540) % 360) - 180);
}

/** The triangle ABC with BC extended to D; x = ∠ACB and y = ∠ACD. */
function exterior(a: number, b: number): GeometrySpec {
  const c = 180 - a - b;
  const t = triangleASA(b, 4, c);
  const [B, C, A0] = [t.A, t.B, t.C];
  const D: Coord = [C[0] + 2.2, C[1]];
  return {
    type: "geometry",
    points: { A: A0, B, C, D },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [{ from: "C", to: "D" }],
    angles: [
      { vertex: "A", from: "B", to: "C", value: a },
      { vertex: "B", from: "C", to: "A", value: b },
      { vertex: "C", from: "A", to: "B", value: c, label: "x" },
      { vertex: "C", from: "D", to: "A", value: 180 - c, label: "y" },
    ],
    pointLabels: true,
    description: `Triangle ABC with BC extended to D. Angle BAC is ${a}°, angle ABC is ${b}°; angle ACB is x and angle ACD is y.`,
  };
}

export default defineGenerator<Params>({
  id: "Y9-GEO-03",
  version: "1.0.0",
  depths: [1, 4, 5],
  misconceptions: [
    "GEO.PROOF.REASON",
    "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
    "GEO.PARALLEL.CO-INTERIOR-EQUAL",
    "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
    "GEO.ANGLES.STRAIGHT-LINE-360",
    "GEO.ANGLES.TRIANGLE-360",
  ],

  params(rng, numbers) {
    const a = pickAngle(rng, numbers, 30, 80);
    return {
      g: pickAngle(rng, numbers, 40, 140, [90]),
      relation: rng.pick([
        "alternate",
        "corresponding",
        "vertically opposite",
        "co-interior",
        "straight line",
      ] as const),
      mistake: rng.int(0, 2),
      a,
      b: pickAngle(rng, numbers, 30, 140 - a - 10, [a]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const g = p.g;
    switch (depth) {
      case 1: {
        const value = isEqual(p.relation) ? g : 180 - g;
        const option = (v: number, reason: string) => [
          A.math(`x = ${deg(v)}`),
          `, because ${reason}`,
        ];
        const sameKind = (Object.keys(REASON) as Relation[]).filter(
          (r) => r !== p.relation && isEqual(r) === isEqual(p.relation),
        );
        const wrongValue: Record<Relation, A.Distractor> = {
          alternate: {
            content: option(180 - g, "alternate angles add up to 180°"),
            code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
            feedback: "Alternate angles are equal.",
          },
          corresponding: {
            content: option(180 - g, "corresponding angles add up to 180°"),
            code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
            feedback: "Corresponding angles are equal.",
          },
          "vertically opposite": {
            content: option(180 - g, "vertically opposite angles add up to 180°"),
            code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
            feedback: "Vertically opposite angles are equal.",
          },
          "co-interior": {
            content: option(g, "co-interior angles are equal"),
            code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
            feedback: "Co-interior angles add up to 180°.",
          },
          "straight line": {
            content: option(360 - g, "angles on a straight line add up to 360°"),
            code: "GEO.ANGLES.STRAIGHT-LINE-360",
            feedback: "Angles on a straight line add up to 180°.",
          },
        };
        return A.choice({
          rng,
          question: [
            "The arrows show parallel lines.",
            A.figure({
              ...transversal(g),
              angles: [{ vertex: "P", from: "B", to: "Q", value: g }, xAngle(p.relation, g)],
            }),
          ],
          ask: ["Which gives the size of ", A.math("x"), " with a correct reason?"],
          correct: option(value, REASON[p.relation]),
          distractors: [
            {
              content: option(value, REASON[rng.pick(sameKind)]),
              code: "GEO.PROOF.REASON",
              feedback: "The number is right but the reason does not describe these two angles.",
            },
            wrongValue[p.relation],
            {
              content: option(
                isEqual(p.relation) ? 180 - g : g,
                "angles in a triangle add up to 180°",
              ),
              feedback: "There is no triangle here.",
            },
          ],
          solution: [
            { say: `x and the ${g}° angle: ${REASON[p.relation]}.`, math: `x = ${deg(value)}` },
          ],
        });
      }
      case 4: {
        // ∠PQC (alternate), ∠PQD (straight line), ∠TQD (vertically opposite ∠PQC).
        const right = [
          [A.math(`\\angle PQC = ${deg(g)}`), " (alternate angles are equal)"],
          [
            A.math(`\\angle PQD = 180^\\circ - ${deg(g)} = ${deg(180 - g)}`),
            " (angles on a straight line add up to 180°)",
          ],
          [A.math(`\\angle TQD = ${deg(g)}`), " (vertically opposite angles are equal)"],
        ];
        const wrong = [
          {
            line: [A.math(`\\angle PQC = ${deg(g)}`), " (co-interior angles are equal)"],
            code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
            feedback:
              "∠PQC and ∠BPQ are alternate angles, not co-interior; the value is right but the reason is wrong.",
          },
          {
            line: [
              A.math(`\\angle PQD = 360^\\circ - ${deg(g)} = ${deg(360 - g)}`),
              " (angles on a straight line add up to 360°)",
            ],
            code: "GEO.ANGLES.STRAIGHT-LINE-360",
            feedback: "Angles on a straight line add up to 180°, not 360°.",
          },
          {
            line: [
              A.math(`\\angle TQD = 180^\\circ - ${deg(g)} = ${deg(180 - g)}`),
              " (vertically opposite angles add up to 180°)",
            ],
            code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
            feedback: "Vertically opposite angles are equal; they do not add up to 180°.",
          },
        ];
        const bad = wrong[p.mistake] ?? wrong[0];
        return A.spotTheMistake({
          question: [
            "The arrows show parallel lines. ",
            A.figure({
              ...transversal(g),
              angles: [{ vertex: "P", from: "B", to: "Q", value: g }],
              pointLabels: ["B", "P", "Q", "C", "D", "T"],
            }),
            ` Kai works out three angles at Q from ∠BPQ = ${g}°.`,
          ],
          lines: right.map((line, i) => (i === p.mistake ? (bad?.line ?? line) : line)),
          mistake: p.mistake,
          ...(bad ? { code: bad.code, feedback: bad.feedback } : {}),
        });
      }
      default: {
        const x = 180 - p.a - p.b;
        const y = p.a + p.b;
        return A.multiStepContext({
          context: ["BCD is a straight line.", A.figure(exterior(p.a, p.b))],
          parts: [
            {
              ask: "Work out the size of angle x.",
              answer: A.degrees(x),
              wrong: wrongs(x, [
                {
                  code: "GEO.ANGLES.TRIANGLE-360",
                  value: A.degrees(360 - p.a - p.b),
                  feedback: "The angles in a triangle add up to 180°.",
                },
              ]),
            },
            {
              ask: "Work out the size of angle y.",
              answer: A.degrees(y),
              wrong: wrongs(y, [
                {
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                  value: A.degrees(360 - x),
                  feedback: "x and y lie on the straight line BCD, so they add up to 180°.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: "Angles in a triangle add up to 180°:",
              math: `x = 180^\\circ - ${deg(p.a)} - ${deg(p.b)} = ${deg(x)}`,
            },
            {
              say: "Angles on a straight line add up to 180°:",
              math: `y = 180^\\circ - ${deg(x)} = ${deg(y)}`,
            },
            {
              say: `Notice that y = ${p.a}° + ${p.b}°: the exterior angle of a triangle equals the sum of the two interior opposite angles.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const points = question.diagrams[0]?.points as Record<string, Coord> | undefined;
    if (!points) return false;
    const near = (a: number, b: number | undefined) => b !== undefined && Math.abs(a - b) < 1e-6;
    if (question.archetype === "multi-step-context") {
      const values = question.parts.map((part) =>
        part.answer.type === "number" ? part.answer.value : NaN,
      );
      return (
        near(angleAt(points, "C", "A", "B"), values[0]) &&
        near(angleAt(points, "C", "D", "A"), values[1])
      );
    }
    if (question.archetype !== "standard") return true;
    // The chosen value is the angle measured at x.
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { v?: string } | undefined;
    const value = Number(/= (\d+)\^/.exec(chosen?.v ?? "")?.[1]);
    const x = xAngle(p.relation, p.g);
    return near(angleAt(points, x.vertex, x.from, x.to), value);
  },
});
