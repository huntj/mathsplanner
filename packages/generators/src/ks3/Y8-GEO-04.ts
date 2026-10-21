/**
 * @statement Y8-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-GEO-04: Use the standard ruler and compass constructions (perpendicular bisector of a line
// segment, constructing a perpendicular to a given line from/at a given point, bisecting a given
// angle); recognise and use the perpendicular distance from a point to a line as the shortest
// distance to the line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  ab: number;
  pa: number;
  /** Depth 1: which construction is shown. */
  shown: number;
  /** Depth 3: the point's height above the line and how far along it is. */
  h: number;
  along: number;
  claim: number;
}

const NAMES = ["the perpendicular bisector of AB", "the bisector of angle A"];

/** The perpendicular bisector of AB with its construction arcs drawn as faint circles. */
function bisector(ab: number): GeometrySpec {
  const r = ab * 0.7;
  const y = Math.sqrt(r * r - (ab / 2) ** 2);
  return {
    type: "geometry",
    points: { A: [0, 0], B: [ab, 0], P: [ab / 2, y + 1], Q: [ab / 2, -y - 1] },
    segments: [
      { from: "A", to: "B" },
      { from: "P", to: "Q" },
    ],
    circles: [
      { centre: "A", radius: r, dashed: true },
      { centre: "B", radius: r, dashed: true },
    ],
    pointLabels: ["A", "B"],
    description:
      "A line segment AB, two equal dashed circles centred on A and B, and a line through the two points where the circles cross.",
  };
}

/** An angle at A with arcs from A and from where they cut the arms, and the bisector. */
function angleBisector(): GeometrySpec {
  const t = (64 * Math.PI) / 180;
  const D: Coord = [4, 0];
  const E: Coord = [4 * Math.cos(t), 4 * Math.sin(t)];
  return {
    type: "geometry",
    points: {
      A: [0, 0],
      B: [7, 0],
      C: [7 * Math.cos(t), 7 * Math.sin(t)],
      D,
      E,
      M: [7 * Math.cos(t / 2), 7 * Math.sin(t / 2)],
    },
    segments: [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "A", to: "M" },
    ],
    circles: [
      { centre: "A", radius: 4, dashed: true },
      { centre: "D", radius: 2.6, dashed: true },
      { centre: "E", radius: 2.6, dashed: true },
    ],
    pointLabels: ["A"],
    description:
      "An angle at A, a dashed circle centred on A, two equal dashed circles centred where it cuts the arms, and a line from A through where those two circles cross.",
  };
}

/** A line, a point P above it, and a segment from P to the line, perpendicular or not. */
function toLine(h: number, along: number, slant: number): GeometrySpec {
  return {
    type: "geometry",
    points: { L: [0, 0], R: [12, 0], P: [along, h], F: [along + slant, 0] },
    segments: [
      { from: "L", to: "R", extend: true },
      { from: "P", to: "F" },
    ],
    ...(slant === 0 ? { angles: [{ vertex: "F", from: "R", to: "P", right: true }] } : {}),
    pointLabels: ["P"],
    description: "A straight line, a point P above it and a line segment from P to the line.",
  };
}

const CLAIMS: { text: string; truth: boolean; why: string; code?: string }[] = [
  {
    text: "Every point on the perpendicular bisector of AB is the same distance from A as from B.",
    truth: true,
    why: "The construction uses equal arcs from A and B, so every point on the line is equidistant from them.",
  },
  {
    text: "Every point on the bisector of an angle is the same distance from the two ends of the arms.",
    truth: false,
    why: "Points on an angle bisector are the same distance from the two arms (the lines), not from two points.",
    code: "GEO.CONSTRUCT.BISECTORS",
  },
  {
    text: "The shortest distance from a point to a line is along the perpendicular.",
    truth: true,
    why: "Any slanted line from the point is the hypotenuse of a right-angled triangle, so it is longer.",
  },
  {
    text: "The perpendicular bisector of AB meets AB at A.",
    truth: false,
    why: "It cuts AB at its midpoint, at right angles.",
    code: "GEO.CONSTRUCT.BISECTORS",
  },
];

export default defineGenerator<Params>({
  id: "Y8-GEO-04",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.CONSTRUCT.BISECTORS", "GEO.DISTANCE.SLANT"],

  params(rng) {
    return {
      ab: rng.int(6, 10),
      pa: rng.int(5, 12),
      shown: rng.int(0, 1),
      h: rng.int(3, 6),
      along: rng.int(3, 7),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = NAMES[p.shown] ?? "";
        return A.choice({
          rng,
          question: [
            "The construction lines have been left on this drawing.",
            A.figure(p.shown === 0 ? bisector(p.ab) : angleBisector()),
          ],
          ask: "What has been constructed?",
          correct: right,
          distractors: [
            {
              content: NAMES[1 - p.shown] ?? "",
              code: "GEO.CONSTRUCT.BISECTORS",
              feedback:
                p.shown === 0
                  ? "The arcs are centred on the two ends of a segment, so it bisects the segment."
                  : "The arcs start from the vertex of an angle, so it bisects the angle.",
            },
            {
              content: "a triangle with sides of equal length",
              feedback: "Look at where the arcs are centred and what the final line does.",
            },
          ],
          solution: [
            {
              say:
                p.shown === 0
                  ? "Equal arcs from A and B cross at two points; the line through them is the perpendicular bisector."
                  : "An arc from A cuts both arms; equal arcs from those points cross on the bisector.",
            },
          ],
        });
      }
      case 2:
        return A.standard({
          question: `P is a point on the perpendicular bisector of the line segment AB, which is ${p.ab} cm long. P is ${p.pa} cm from A.`,
          ask: "How far is P from B?",
          answer: A.number(p.pa, { units: "cm" }),
          wrong: wrongs(p.pa, [
            {
              code: "GEO.CONSTRUCT.BISECTORS",
              value: A.number(p.ab / 2, { units: "cm" }),
              feedback:
                "That is how far the midpoint is from B. Every point on the perpendicular bisector is equidistant from A and B.",
            },
            {
              code: "GEO.CONSTRUCT.BISECTORS",
              value: A.number(p.ab - p.pa > 0 ? p.ab - p.pa : p.ab + p.pa, { units: "cm" }),
              feedback:
                "P is not on AB. Points on the perpendicular bisector are the same distance from A as from B.",
            },
          ]),
          solution: [
            {
              say: `Points on the perpendicular bisector of AB are equidistant from A and B, so PB = PA = ${p.pa} cm.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which drawing shows the shortest distance from P to the line?"],
          correct: toLine(p.h, p.along, 0),
          distractors: [
            {
              figure: toLine(p.h, p.along, 2),
              code: "GEO.DISTANCE.SLANT",
              feedback: "A slanted line is longer than the perpendicular from P.",
            },
            {
              figure: toLine(p.h, p.along, -3),
              code: "GEO.DISTANCE.SLANT",
              feedback: "The shortest route meets the line at a right angle.",
            },
          ],
          solution: [
            { say: "The shortest distance is along the perpendicular: it meets the line at 90°." },
          ],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Zara says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. The perpendicular bisector and the angle bisector do the same job.`,
              code: "GEO.CONSTRUCT.BISECTORS",
            },
            {
              text: `${c.truth ? "False" : "True"}. The shortest distance can be along any line you like.`,
              code: "GEO.DISTANCE.SLANT",
            },
          ],
          solution: [
            {
              say: "Perpendicular bisector: equidistant from two points. Angle bisector: equidistant from two lines. Shortest distance to a line: the perpendicular.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.pa;
    if (question.archetype === "standard") return chosenText(question) === NAMES[p.shown];
    if (question.archetype === "choose-the-diagram") {
      const g = chosenFigure(question) as GeometrySpec | undefined;
      return g?.points.F?.[0] === p.along;
    }
    return true;
  },
});
