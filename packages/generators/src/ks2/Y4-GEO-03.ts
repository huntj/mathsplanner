/**
 * @statement Y4-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y4-GEO-03: Identify lines of symmetry in 2D shapes presented in different orientations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import {
  regularPolygon,
  shape,
  type Coord,
  type GeometrySpec,
  type ShapeKind,
} from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { SHAPE_NAME, SYMMETRY_LINES } from "../shared/shapes.ts";

interface Params {
  /** A named shape, or a regular polygon with this many sides. */
  kind: ShapeKind | number;
  rotation: number;
  /** For the rectangle question: which true line of symmetry is offered. */
  across: boolean;
  claim: number;
}

const midpoint = (a: Coord, b: Coord): Coord => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const linesOf = (k: ShapeKind | number) => (typeof k === "number" ? k : (SYMMETRY_LINES[k] ?? 0));
const nameOf = (k: ShapeKind | number) =>
  typeof k === "number"
    ? `regular ${({ 5: "pentagon", 6: "hexagon", 8: "octagon" } as Record<number, string>)[k] ?? "polygon"}`
    : SHAPE_NAME[k];
const figureOf = (k: ShapeKind | number, rotation: number) =>
  typeof k === "number" ? regularPolygon(k, 1, -90 - 180 / k + rotation) : shape(k, { rotation });

/** A rectangle with one dashed line through it: between two given points. */
function rectangleWithLine(
  rotation: number,
  line: "across" | "down" | "diagonal" | "corner",
): GeometrySpec {
  const base = shape("rectangle", { rotation });
  const p = base.points as Record<"A" | "B" | "C" | "D", Coord>;
  const ends: Record<typeof line, [Coord, Coord]> = {
    across: [midpoint(p.A, p.D), midpoint(p.B, p.C)],
    down: [midpoint(p.A, p.B), midpoint(p.D, p.C)],
    diagonal: [p.A, p.C],
    corner: [p.A, midpoint(p.D, p.C)],
  };
  const [m, n] = ends[line];
  return {
    ...base,
    points: { ...p, M: m, N: n },
    segments: [{ from: "M", to: "N", dashed: true, extend: true }],
    description: `A rectangle with a dashed line ${{ across: "through the middles of its two shorter sides", down: "through the middles of its two longer sides", diagonal: "along one diagonal", corner: "from one corner to the middle of the opposite side" }[line]}.`,
  };
}

const CLAIMS = [
  {
    statement:
      "A rectangle has 4 lines of symmetry: two through the middles of its sides and two along its diagonals.",
    truth: false,
    reasons: [
      {
        text: "Folding along a diagonal does not make the halves match, so it has only 2.",
        correct: true,
      },
      {
        text: "Every line through the middle of a shape is a line of symmetry.",
        code: "GEO.SYMMETRY.DIAGONAL",
      },
      { text: "It has no lines of symmetry because its sides are different lengths." },
    ],
  },
  {
    statement: "An equilateral triangle has 3 lines of symmetry, even when it is turned.",
    truth: true,
    reasons: [
      {
        text: "Each line from a corner to the middle of the opposite side folds it exactly; turning the shape turns the lines too.",
        correct: true,
      },
      { text: "Only the vertical line counts, so it has 1." },
      { text: "Turning the triangle removes its lines of symmetry." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y4-GEO-03",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.SYMMETRY.DIAGONAL"],

  params(rng, numbers) {
    const kinds: (ShapeKind | number)[] =
      numbers === "friendly"
        ? ["square", "rectangle", "isosceles", "kite"]
        : numbers === "standard"
          ? ["rectangle", "rhombus", "parallelogram", "kite", "equilateral", "scalene", 5, 6]
          : ["parallelogram", "rhombus", "rectangle", 5, 6, 8];
    return {
      kind: rng.pick(kinds),
      rotation: numbers === "friendly" ? 0 : rng.int(15, 75),
      across: rng.bool(),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = linesOf(p.kind);
        const diagonalWrong =
          p.kind === "rectangle" ? 4 : p.kind === "parallelogram" ? 2 : undefined;
        return A.standard({
          question: [
            `This ${nameOf(p.kind)} has been turned.`,
            A.figure(figureOf(p.kind, p.rotation)),
          ],
          ask: "How many lines of symmetry does it have?",
          answer: A.number(n),
          wrong: wrongs(n, [
            diagonalWrong === undefined
              ? undefined
              : {
                  code: "GEO.SYMMETRY.DIAGONAL",
                  value: A.number(diagonalWrong),
                  feedback:
                    "The diagonals are not lines of symmetry here: folding along one, the halves do not match.",
                },
          ]),
          solution: [
            {
              say: `Imagine folding the shape so the two halves match exactly. A ${nameOf(p.kind)} has ${n} such line${n === 1 ? "" : "s"}${n === 0 ? "" : ", wherever it is turned"}.`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: "Each rectangle has a dashed line drawn on it.",
          ask: "Which dashed line is a line of symmetry?",
          correct: rectangleWithLine(p.rotation, p.across ? "across" : "down"),
          distractors: [
            {
              figure: rectangleWithLine(p.rotation, "diagonal"),
              code: "GEO.SYMMETRY.DIAGONAL",
              feedback: "Folding a rectangle along its diagonal does not make the halves match.",
            },
            { figure: rectangleWithLine(p.rotation, "corner") },
          ],
          solution: [
            {
              say: "A rectangle's lines of symmetry go through the middles of opposite sides. Its diagonals are not lines of symmetry.",
            },
          ],
        });
      default: {
        const c = CLAIMS[p.claim] ?? CLAIMS[0];
        return A.trueOrFalseWhy({
          rng,
          statement: c?.statement ?? "",
          truth: c?.truth ?? true,
          reasons: c?.reasons ?? [],
          solution: [{ say: c?.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    // Count the lines that map the drawn polygon onto itself. Every line of symmetry of a polygon
    // passes through its centre and either a vertex or the middle of a side.
    const pts = Object.values(question.diagrams[0]?.points as Record<string, Coord>);
    const cx = pts.reduce((s2, q) => s2 + q[0], 0) / pts.length;
    const cy = pts.reduce((s2, q) => s2 + q[1], 0) / pts.length;
    const through = [...pts, ...pts.map((q, i) => midpoint(q, pts[(i + 1) % pts.length] as Coord))];
    const angles = new Set<number>();
    for (const [x, y] of through) {
      const t = Math.atan2(y - cy, x - cx);
      const [ux, uy] = [Math.cos(t), Math.sin(t)];
      const reflect = ([qx, qy]: Coord): Coord => {
        const dx = qx - cx;
        const dy = qy - cy;
        const dot = dx * ux + dy * uy;
        return [cx + 2 * dot * ux - dx, cy + 2 * dot * uy - dy];
      };
      const maps = pts.every((q) =>
        pts.some((r) => Math.hypot(reflect(q)[0] - r[0], reflect(q)[1] - r[1]) < 1e-2),
      );
      if (maps) angles.add((Math.round((((t * 180) / Math.PI + 360) % 180) * 10) / 10) % 180);
    }
    const count = angles.size;
    return count === answer.value && count === linesOf(p.kind);
  },
});
