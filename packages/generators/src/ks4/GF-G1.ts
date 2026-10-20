/**
 * @statement GF-G1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// GF-G1: Use conventional geometric terms and notation; draw diagrams from written descriptions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";

type Template = "isosceles" | "parallelogram" | "straight";

interface Params {
  template: Template;
  /** The angle given in the description; even, so halves are whole. */
  a: number;
  rotation: number;
  claim: number;
}

/** Triangle ABC with a right angle at `right`; the two sides meeting there are equal if `equal`. */
function rightTriangle(right: "A" | "B" | "C", equal: boolean, rotation: number): GeometrySpec {
  const [p, q] = ["A", "B", "C"].filter((n) => n !== right) as [string, string];
  const t = (rotation * Math.PI) / 180;
  const turn = ([x, y]: Coord): Coord => [
    Math.round((x * Math.cos(t) - y * Math.sin(t)) * 1e9) / 1e9,
    Math.round((x * Math.sin(t) + y * Math.cos(t)) * 1e9) / 1e9,
  ];
  return {
    type: "geometry",
    points: { [right]: turn([0, 0]), [p]: turn([3, 0]), [q]: turn([0, equal ? 3 : 1.8]) },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: equal
      ? [
          { from: right, to: p, ticks: 1 },
          { from: right, to: q, ticks: 1 },
        ]
      : [],
    angles: [{ vertex: right, from: p, to: q, right: true }],
    pointLabels: true,
    description: `Triangle ABC with a right angle at ${right}${equal ? ` and the two sides meeting at ${right} marked equal` : ""}.`,
  };
}

export default defineGenerator<Params>({
  id: "GF-G1",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: [
    "GEO.ISOSCELES.APEX-EQUALS-BASE",
    "GEO.PARALLEL.CO-INTERIOR-EQUAL",
    "GEO.ANGLES.STRAIGHT-LINE-360",
    "GEO.ANGLES.NAMING",
    "GEO.LINES.PARALLEL-PERPENDICULAR",
  ],

  params(rng, numbers) {
    return {
      template: rng.pick(["isosceles", "parallelogram", "straight"] as const),
      a: 2 * pickAngle(rng, numbers, 15, 70, [45]),
      rotation: numbers === "friendly" ? 0 : rng.int(0, 11) * 30,
      claim: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        if (p.template === "isosceles") {
          const x = (180 - p.a) / 2;
          return A.standard({
            question: [
              "In triangle PQR, ",
              A.math(`PQ = PR`),
              " and ",
              A.math(`\\angle QPR = ${deg(p.a)}`),
              ". Sketch the triangle.",
            ],
            ask: ["Work out ", A.math("\\angle PQR"), "."],
            answer: A.degrees(x),
            wrong: wrongs(x, [
              {
                code: "GEO.ISOSCELES.APEX-EQUALS-BASE",
                value: A.degrees(p.a),
                feedback:
                  "∠QPR is the angle between the equal sides. The equal angles are the other two, at Q and R.",
              },
            ]),
            solution: [
              { say: "PQ = PR, so the angles opposite them, at R and Q, are equal." },
              { say: "So", math: `\\angle PQR = (180^\\circ - ${deg(p.a)}) \\div 2 = ${deg(x)}` },
            ],
          });
        }
        const x = 180 - p.a;
        return p.template === "parallelogram"
          ? A.standard({
              question: [
                "ABCD is a parallelogram with ",
                A.math(`\\angle DAB = ${deg(p.a)}`),
                ". Sketch it.",
              ],
              ask: ["Work out ", A.math("\\angle ADC"), "."],
              answer: A.degrees(x),
              wrong: wrongs(x, [
                {
                  code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
                  value: A.degrees(p.a),
                  feedback:
                    "∠DAB and ∠ADC are next to each other between the parallel sides AB and DC, so they add up to 180°.",
                },
              ]),
              solution: [
                {
                  say: "AB is parallel to DC, so ∠DAB and ∠ADC are co-interior.",
                  math: `\\angle ADC = 180^\\circ - ${deg(p.a)} = ${deg(x)}`,
                },
              ],
            })
          : A.standard({
              question: [
                "A, B and C lie on a straight line, in that order. D is a point not on the line, and ",
                A.math(`\\angle ABD = ${deg(p.a)}`),
                ". Sketch the diagram.",
              ],
              ask: ["Work out ", A.math("\\angle DBC"), "."],
              answer: A.degrees(x),
              wrong: wrongs(x, [
                {
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                  value: A.degrees(360 - p.a),
                  feedback: "∠ABD and ∠DBC lie on the straight line ABC, so they add up to 180°.",
                },
              ]),
              solution: [
                {
                  say: "Angles on a straight line add up to 180°.",
                  math: `\\angle DBC = 180^\\circ - ${deg(p.a)} = ${deg(x)}`,
                },
              ],
            });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [
            "Triangle ABC has ",
            A.math("\\angle ABC = 90^\\circ"),
            " and ",
            A.math("AB = BC"),
            ".",
          ],
          ask: "Which diagram matches the description?",
          correct: rightTriangle("B", true, p.rotation),
          distractors: [
            {
              figure: rightTriangle("A", true, p.rotation),
              code: "GEO.ANGLES.NAMING",
              feedback: "∠ABC is the angle at B, the middle letter, not at A.",
            },
            {
              figure: rightTriangle("C", true, p.rotation),
              code: "GEO.ANGLES.NAMING",
              feedback: "∠ABC is the angle at B, the middle letter, not at C.",
            },
            {
              figure: rightTriangle("B", false, p.rotation),
              feedback: "The right angle is at B, but AB and BC are not equal.",
            },
          ],
          solution: [
            {
              say: "∠ABC is the angle at B, so the right angle is at B. AB = BC means the two sides meeting at B are equal.",
            },
          ],
        });
      default: {
        const claims = [
          {
            statement: [
              "The statement ",
              A.math("AB \\parallel CD"),
              " means AB and CD are the same length.",
            ],
            truth: false,
            reasons: [
              { text: "∥ means parallel. Equal lengths are written AB = CD.", correct: true },
              { text: "Parallel lines are always the same length." },
              {
                text: "∥ means the lines are perpendicular.",
                code: "GEO.LINES.PARALLEL-PERPENDICULAR",
              },
            ],
          },
          {
            statement: [A.math("\\angle PQR"), " is the angle at P."],
            truth: false,
            reasons: [
              {
                text: "The middle letter is the vertex, so ∠PQR is the angle at Q.",
                correct: true,
              },
              {
                text: "The first letter of an angle's name is always its vertex.",
                code: "GEO.ANGLES.NAMING",
              },
              { text: "It could be the angle at any of P, Q or R." },
            ],
          },
          {
            statement: [
              A.math("AB \\perp CD"),
              " means that AB and CD meet at a right angle (extended if needed).",
            ],
            truth: true,
            reasons: [
              { text: "⊥ means perpendicular: the lines cross at 90°.", correct: true },
              {
                text: "No: ⊥ means the lines are parallel.",
                code: "GEO.LINES.PARALLEL-PERPENDICULAR",
              },
              { text: "No: it means AB is longer than CD." },
            ],
          },
        ];
        const c = claims[p.claim];
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
    if (answer?.type === "number")
      return answer.value === (p.template === "isosceles" ? (180 - p.a) / 2 : 180 - p.a);
    if (question.archetype !== "choose-the-diagram" || answer?.type !== "choice") return true;
    // The chosen drawing has a right angle at B and BA = BC, measured.
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { i?: number } | undefined;
    const drawn = question.diagrams[chosen?.i ?? -1] as GeometrySpec | undefined;
    const pt = (n: string) => drawn?.points[n] ?? [NaN, NaN];
    const [ax, ay] = [pt("A")[0] - pt("B")[0], pt("A")[1] - pt("B")[1]];
    const [cx, cy] = [pt("C")[0] - pt("B")[0], pt("C")[1] - pt("B")[1]];
    return (
      Math.abs(ax * cx + ay * cy) < 1e-6 && Math.abs(Math.hypot(ax, ay) - Math.hypot(cx, cy)) < 1e-6
    );
  },
});
