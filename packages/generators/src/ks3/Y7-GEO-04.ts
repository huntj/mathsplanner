/**
 * @statement Y7-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y7-GEO-04: Describe, sketch and draw using conventional terms and notation: points, lines,
// parallel lines, perpendicular lines, right angles, regular polygons, and other polygons that are
// reflectively and rotationally symmetric
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { pointAt, triangleSSS, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";

interface Params {
  names: [string, string, string];
  /** The vertex whose angle is marked. */
  at: number;
  claimTrue: boolean;
}

const angleName = (letters: string[]) => `\\angle ${letters.join("")}`;

/** A scalene triangle with the angle at vertex `at` marked x. */
function marked(p: Params): GeometrySpec {
  const t = triangleSSS(4.2, 3.4, 3);
  const [X, Y, Z] = p.names;
  const pts: Record<string, Coord> = { [X]: t.A, [Y]: t.B, [Z]: t.C };
  // Anticlockwise from the next vertex to the previous one, so the arc sits inside.
  const v = p.names[p.at] ?? X;
  const next = p.names[(p.at + 1) % 3] ?? Y;
  const prev = p.names[(p.at + 2) % 3] ?? Z;
  return {
    type: "geometry",
    points: pts,
    polygons: [{ vertices: [X, Y, Z] }],
    angles: [{ vertex: v, from: next, to: prev, label: "x" }],
    pointLabels: true,
    description: `Triangle ${X}${Y}${Z} with the angle at ${v} marked x.`,
  };
}

const twoSegments = (
  pts: Record<string, Coord>,
  extra: Partial<GeometrySpec>,
  description: string,
): GeometrySpec => ({
  type: "geometry",
  points: pts,
  segments: [
    { from: "A", to: "B" },
    { from: "C", to: "D" },
  ],
  pointLabels: ["A", "B", "C", "D"],
  ...extra,
  description,
});

const PARALLEL = twoSegments(
  { A: [0, 0], B: [3, 0.6], C: [0.3, 1.6], D: [3.3, 2.2] },
  {
    segments: [
      { from: "A", to: "B", arrows: 1 },
      { from: "C", to: "D", arrows: 1 },
    ],
  },
  "Lines AB and CD marked with matching arrows.",
);
const PERPENDICULAR = twoSegments(
  { A: [0, 0], B: [3, 0], C: [1.5, -1.2], D: [1.5, 1.6], E: [1.5, 0] },
  { angles: [{ vertex: "E", from: "B", to: "D", right: true }] },
  "Lines AB and CD crossing with a right-angle mark.",
);
const EQUAL = twoSegments(
  { A: [0, 0], B: [3, 0], C: [0.4, 1], D: pointAt([0.4, 1], 35, 3) },
  {
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "C", to: "D", ticks: 1 },
    ],
  },
  "Lines AB and CD marked with matching dashes.",
);

export default defineGenerator<Params>({
  id: "Y7-GEO-04",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.ANGLES.NAMING"],

  params(rng, numbers) {
    return {
      names:
        numbers === "friendly"
          ? ["A", "B", "C"]
          : rng.pick([
              ["A", "B", "C"],
              ["P", "Q", "R"],
              ["L", "M", "N"],
              ["D", "E", "F"],
            ] as [string, string, string][]),
      at: rng.int(0, 2),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const v = p.names[p.at] ?? "A";
    const [before, after] = [p.names[(p.at + 2) % 3] ?? "", p.names[(p.at + 1) % 3] ?? ""];
    const correct = angleName([before, v, after]);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Look at the triangle.", A.figure(marked(p))],
          ask: ["Which is a correct name for angle ", A.math("x"), "?"],
          correct: A.math(correct),
          distractors: [
            {
              content: A.math(angleName([v, before, after])),
              code: "GEO.ANGLES.NAMING",
              feedback: `The middle letter names the vertex. This is the angle at ${before}.`,
            },
            {
              content: A.math(angleName([before, after, v])),
              code: "GEO.ANGLES.NAMING",
              feedback: `The middle letter names the vertex. This is the angle at ${after}.`,
            },
          ],
          solution: [
            {
              say: `The angle is at ${v}, so ${v} goes in the middle: `,
              math: `${correct} \\text{ or } ${angleName([after, v, before])}`,
            },
          ],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each diagram to the statement its marks show.",
          pairs: [
            [A.figure(PARALLEL), A.math("AB \\parallel CD")],
            [A.figure(PERPENDICULAR), A.math("AB \\perp CD")],
            [A.figure(EQUAL), A.math("AB = CD")],
          ],
          solution: [
            { say: "Matching arrows show parallel lines:", math: "AB \\parallel CD" },
            {
              say: "A small square shows a right angle, so the lines are perpendicular:",
              math: "AB \\perp CD",
            },
            { say: "Matching dashes show equal lengths:", math: "AB = CD" },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? [
                "Ravi says angle ",
                A.math("x"),
                " can be written as ",
                A.math(angleName([after, v, before])),
                ".",
                A.figure(marked(p)),
              ]
            : [
                "Ravi says angle ",
                A.math("x"),
                " is ",
                A.math(angleName([v, before, after])),
                ".",
                A.figure(marked(p)),
              ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `Yes: ${v} is in the middle, and the outer letters can go either way round.`,
                  correct: true,
                },
                { text: "No: the letters of an angle must be in alphabetical order." },
                {
                  text: `No: the first letter must be the vertex, ${v}.`,
                  code: "GEO.ANGLES.NAMING",
                },
              ]
            : [
                {
                  text: `No: the middle letter is the vertex, so that names the angle at ${before}.`,
                  correct: true,
                },
                {
                  text: "Yes: the first letter of an angle's name is its vertex.",
                  code: "GEO.ANGLES.NAMING",
                },
                { text: "Yes: any order of the three letters names the same angle." },
              ],
          solution: [
            {
              say: `In three-letter angle notation the vertex is the middle letter. Angle x is ${correct.replace("\\angle ", "∠")}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    // The middle letter of the chosen name is the vertex the arc is drawn at.
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { v?: string } | undefined;
    const letters = chosen?.v?.replace("\\angle ", "") ?? "";
    const arc = (question.diagrams[0] as GeometrySpec | undefined)?.angles?.[0]?.vertex;
    return letters.length === 3 && letters[1] === arc && arc === p.names[p.at];
  },
});
