/**
 * @statement GF-G3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// GF-G3: Apply angle facts, including parallel lines, triangles and polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { triangleASA, type GeometrySpec } from "@mathsplanner/diagrams";
import { deg, splitAngles, wrongs } from "../shared/angles.ts";

interface Params {
  /** Two interior angles of a triangle, for the exterior-angle question. */
  a: number;
  b: number;
  /** A regular polygon with whole-number angles. */
  regular: number;
  /** Two regular polygons that meet a third at a point with no gap. */
  pair: [number, number, number];
  statement: number;
}

/** Vertex figures where three regular polygons fit round a point: [first, second, third]. */
const MEETINGS: [number, number, number][] = [
  [4, 8, 8],
  [3, 12, 12],
  [6, 6, 6],
  [4, 6, 12],
  [5, 5, 10],
  [3, 10, 15],
  [3, 8, 24],
  [3, 9, 18],
  [4, 5, 20],
];
const interior = (n: number) => 180 - 360 / n;
const polygonName: Record<number, string> = {
  3: "equilateral triangle",
  4: "square",
  5: "regular pentagon",
  6: "regular hexagon",
  8: "regular octagon",
  9: "regular nonagon",
  10: "regular decagon",
  12: "regular dodecagon",
};

const STATEMENTS = [
  {
    statement: "The exterior angles of any polygon add up to 360°.",
    truth: true,
    reasons: [
      {
        text: "Walking round the polygon, you turn through each exterior angle and end up facing the way you started: one full turn.",
        correct: true,
      },
      { text: "Only regular polygons, because their exterior angles are equal." },
      {
        text: "It depends on the number of sides: (n − 2) × 180°.",
        code: "GEO.POLYGON.INTERIOR-EXTERIOR",
      },
    ],
  },
  {
    statement: "Each interior angle of a regular polygon is always more than its exterior angle.",
    truth: false,
    reasons: [
      {
        text: "An equilateral triangle has interior angles of 60° but exterior angles of 120°.",
        correct: true,
      },
      { text: "Interior angles are inside the shape, so they are always bigger." },
      {
        text: "Interior and exterior angles are always equal in regular polygons.",
        code: "GEO.POLYGON.INTERIOR-EXTERIOR",
      },
    ],
  },
  {
    statement: "The interior angles of a hexagon add up to 1080°.",
    truth: false,
    reasons: [
      {
        text: "A hexagon splits into 4 triangles from one vertex, so its angles add up to 720°.",
        correct: true,
      },
      { text: "6 × 180° = 1080°, so it is true.", code: "GEO.POLYGON.SUM-N-TIMES-180" },
      { text: "The angles of every polygon add up to 360°." },
    ],
  },
];

function exteriorDiagram(a: number, b: number): GeometrySpec {
  return {
    type: "geometry",
    points: { ...triangleASA(a, 5, b), D: [7.2, 0] },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [{ from: "B", to: "D" }],
    angles: [
      { vertex: "A", from: "B", to: "C", value: a },
      { vertex: "C", from: "A", to: "B", value: 180 - a - b },
      { vertex: "B", from: "D", to: "C", value: a + 180 - a - b, label: "x" },
    ],
  };
}

export default defineGenerator<Params>({
  id: "GF-G3",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "GEO.POLYGON.INTERIOR-EXTERIOR",
    "GEO.POLYGON.SUM-N-TIMES-180",
    "GEO.ANGLES.TRIANGLE-360",
  ],

  params(rng, numbers) {
    const [a, c] = splitAngles(rng, numbers, 180, 3, { min: 30, max: 110 });
    return {
      a: a ?? 50,
      b: 180 - (a ?? 50) - (c ?? 60),
      regular: rng.pick(
        {
          friendly: [6, 8, 10, 12],
          standard: [5, 8, 9, 10, 12, 15],
          stretch: [9, 15, 18, 20, 24, 30, 36],
        }[numbers],
      ),
      pair: rng.pick(MEETINGS),
      statement: rng.int(0, STATEMENTS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // The exterior angle of a triangle equals the two interior angles opposite it.
        const c = 180 - p.a - p.b;
        const x = p.a + c;
        return A.standard({
          question: [
            "The side AB of the triangle is extended to D.",
            A.figure(exteriorDiagram(p.a, p.b)),
          ],
          ask: ["Work out the size of angle ", A.math("x"), "."],
          answer: A.degrees(x),
          wrong: wrongs(x, [
            {
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
              value: A.degrees(180 - x),
              feedback:
                "That is the interior angle at B. Angle x is outside the triangle, on the straight line with it.",
            },
            {
              code: "GEO.ANGLES.TRIANGLE-360",
              value: A.degrees(360 - p.a - c),
              feedback: "The angles in a triangle add up to 180°, not 360°.",
            },
          ]),
          solution: [
            {
              say: "The angles in a triangle add up to 180°, so the angle inside the triangle at B is",
              math: `180^\\circ - ${deg(p.a)} - ${deg(c)} = ${deg(180 - x)}`,
            },
            {
              say: "Angles on a straight line add up to 180°.",
              math: `x = 180^\\circ - ${deg(180 - x)} = ${deg(x)}`,
            },
            {
              say: "This shows the exterior angle equals the two opposite interior angles added together.",
            },
          ],
        });
      }
      case 2: {
        const e = 360 / p.regular;
        const i = 180 - e;
        return A.standard({
          question: [`A regular polygon has ${p.regular} sides.`],
          ask: "Work out the size of one interior angle.",
          answer: A.degrees(i),
          wrong: wrongs(i, [
            {
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
              value: A.degrees(e),
              feedback:
                "That is the exterior angle; the interior angle makes a straight line with it.",
            },
            {
              code: "GEO.POLYGON.SUM-N-TIMES-180",
              value: A.degrees(180),
              feedback: `The angle sum is (n − 2) × 180°, not n × 180°.`,
            },
          ]),
          solution: [
            {
              say: "The exterior angles add up to 360°.",
              math: `360^\\circ \\div ${p.regular} = ${deg(e)}`,
            },
            {
              say: "Interior and exterior angles add up to 180°.",
              math: `180^\\circ - ${deg(e)} = ${deg(i)}`,
            },
          ],
        });
      }
      case 4: {
        const s = STATEMENTS[p.statement] ?? STATEMENTS[0];
        return A.trueOrFalseWhy({
          rng,
          statement: s?.statement ?? "",
          truth: s?.truth ?? true,
          reasons: s?.reasons ?? [],
          solution: [{ say: s?.reasons[0]?.text ?? "" }],
        });
      }
      default: {
        const [m, n, third] = p.pair;
        const gap = 360 - interior(m) - interior(n);
        return A.multiStepContext({
          context: `Three regular polygons fit together round a point with no gaps and no overlaps. One is a ${polygonName[m] ?? `regular ${m}-sided polygon`} and one is a ${polygonName[n] ?? `regular ${n}-sided polygon`}.`,
          parts: [
            {
              ask: "What is the interior angle of the third polygon?",
              answer: A.degrees(gap),
              wrong: wrongs(
                gap,
                [
                  {
                    code: "GEO.ANGLES.POINT-180",
                    value: A.degrees(180 - interior(m) - interior(n)),
                    feedback: "The angles meet at a point, so they add up to 360°.",
                  },
                ].filter((w) => w.value.kind === "number" && w.value.value > 0),
              ),
            },
            {
              ask: "How many sides does the third polygon have?",
              answer: A.number(third),
              wrong: wrongs(third, [
                Number.isInteger(360 / gap)
                  ? {
                      code: "GEO.POLYGON.INTERIOR-EXTERIOR",
                      value: A.number(360 / gap),
                      feedback: "Divide 360° by the exterior angle, 180° minus the interior angle.",
                    }
                  : undefined,
              ]),
            },
          ],
          solution: [
            {
              say: `Interior angles: ${m} sides gives ${deg(interior(m))}, ${n} sides gives ${deg(interior(n))}.`,
            },
            {
              say: "Angles at a point add up to 360°.",
              math: `360^\\circ - ${deg(interior(m))} - ${deg(interior(n))} = ${deg(gap)}`,
            },
            {
              say: "Its exterior angle is 180° minus that, and the exterior angles add up to 360°.",
              math: `360^\\circ \\div (180^\\circ - ${deg(gap)}) = ${third}`,
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
      const sides = question.parts[1]?.answer;
      return (
        sides?.type === "number" &&
        interior(p.pair[0]) + interior(p.pair[1]) + first.value === 360 &&
        interior(sides.value) === first.value
      );
    }
    if (question.diagrams.length) return first.value === p.a + (180 - p.a - p.b);
    return first.value * p.regular === (p.regular - 2) * 180;
  },

  bounds: { friendly: { min: 1, dp: 0 }, standard: { min: 1, dp: 0 }, stretch: { min: 1, dp: 0 } },
});
