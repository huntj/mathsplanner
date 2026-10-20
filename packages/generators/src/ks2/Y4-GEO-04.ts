/**
 * @statement Y4-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y4-GEO-04: Complete a simple symmetric figure with respect to a specific line of symmetry
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";

interface Params {
  /** The left half: it starts and ends on the mirror line x = 5. */
  half: Coord[];
  /** Which vertex is P in the depth 1 question. */
  marked: number;
  /** Which corner the "one square out" distractor gets wrong. */
  slip: number;
  /** Depth 4 shows the correct figure (true) or a slid copy (false). */
  symmetric: boolean;
}

const MIRROR = 5;
const reflect = ([x, y]: Coord): Coord => [2 * MIRROR - x, y];

/** A squared grid with a dashed vertical mirror line and one or two halves drawn on it. */
function grid(
  halves: Coord[][],
  description: string,
  points: CartesianSpec["points"] = [],
): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 10, step: 1 },
    y: { min: 0, max: 8, step: 1 },
    grid: true,
    axes: false,
    verticals: [{ x: MIRROR, dashed: true }],
    segments: halves.flatMap((h) => h.slice(1).map((to, i) => ({ from: h[i] as Coord, to }))),
    points,
    description,
  };
}

const same = (a: Coord[], b: Coord[]) =>
  a.every((p, i) => p[0] === b[i]?.[0] && p[1] === b[i]?.[1]);

export default defineGenerator<Params>({
  id: "Y4-GEO-04",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.SYMMETRY.TRANSLATES", "GEO.SYMMETRY.HALF-DISTANCE"],

  params(rng, numbers) {
    // Friendly halves are boxes with square corners; others have slanted sides.
    const bottom = rng.int(1, 2);
    const top = rng.int(5, 7);
    const xs = numbers === "friendly" ? [rng.int(1, 3)] : [rng.int(1, 4), rng.int(1, 4)];
    const half: Coord[] =
      numbers === "friendly"
        ? [
            [MIRROR, bottom],
            [xs[0] ?? 2, bottom],
            [xs[0] ?? 2, top],
            [MIRROR, top],
          ]
        : [
            [MIRROR, bottom],
            [xs[0] ?? 2, rng.int(bottom, 3)],
            [xs[1] ?? 2, rng.int(4, top)],
            [MIRROR, top],
          ];
    return {
      half,
      marked: rng.int(1, half.length - 2),
      slip: rng.int(1, half.length - 2),
      symmetric: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const mirror = p.half.map(reflect);
    switch (depth) {
      case 1: {
        const P = p.half[p.marked] ?? [2, 3];
        const k = MIRROR - P[0];
        return A.standard({
          question: [
            "The dashed line is a mirror line. Each square on the grid is 1 unit.",
            A.figure(
              grid(
                [p.half],
                `A squared grid with a dashed vertical mirror line and half a shape on its left. Point P is ${k} squares to the left of the mirror.`,
                [{ at: P, label: "P" }],
              ),
            ),
          ],
          ask: "P′ is the reflection of P in the mirror line. How many squares apart are P and P′?",
          answer: A.number(2 * k),
          wrong: [
            {
              code: "GEO.SYMMETRY.HALF-DISTANCE",
              value: A.number(k),
              feedback: `That is how far P is from the mirror. P′ is another ${k} squares beyond the mirror.`,
            },
          ],
          solution: [
            {
              say: `P is ${k} squares from the mirror, so P′ is ${k} squares on the other side. They are ${k} + ${k} = ${2 * k} squares apart.`,
            },
          ],
        });
      }
      case 3: {
        const shift = MIRROR - Math.min(...p.half.map((q) => q[0]));
        const slid = p.half.map(([x, y]): Coord => [x + shift, y]);
        const slipped = mirror.map(([x, y], i): Coord => [i === p.slip ? x + 1 : x, y]);
        const flipped = mirror
          .map(([x, y]): Coord => [x, (p.half[0]?.[1] ?? 0) + (p.half.at(-1)?.[1] ?? 0) - y])
          .reverse();
        // A half that is the same upside down (a box) gets a second corner slip instead.
        const other = p.slip === 1 ? 2 : 1;
        const third =
          same(flipped, mirror) || same([...flipped].reverse(), mirror)
            ? {
                figure: grid(
                  [p.half, mirror.map(([x, y], i): Coord => [i === other ? x - 1 : x, y])],
                  "The half shape and a reflection with one corner a square too close to the mirror.",
                ),
                feedback:
                  "Count the squares from the mirror for each corner: one corner is a square too close.",
              }
            : {
                figure: grid(
                  [p.half, flipped],
                  "The half shape and a reflection turned upside down.",
                ),
              };
        return A.chooseTheDiagram({
          rng,
          question: "Half of a symmetric shape is drawn on the left of the dashed mirror line.",
          ask: "Which picture completes the shape correctly?",
          correct: grid(
            [p.half, mirror],
            "The half shape and its true reflection in the mirror line.",
          ),
          distractors: [
            {
              figure: grid(
                [p.half, slid],
                "The half shape and a copy slid to the right without flipping.",
              ),
              code: "GEO.SYMMETRY.TRANSLATES",
              feedback:
                "This half has been slid across, not flipped. Each corner should be the same distance from the mirror on the other side.",
            },
            {
              figure: grid(
                [p.half, slipped],
                "The half shape and a reflection with one corner a square too far out.",
              ),
              feedback:
                "Count the squares from the mirror for each corner: one corner is a square too far out.",
            },
            third,
          ],
          solution: [
            {
              say: "Reflect one corner at a time: count its squares to the mirror, then count the same number on the other side, at the same height.",
            },
          ],
        });
      }
      default: {
        const shift = MIRROR - Math.min(...p.half.map((q) => q[0]));
        const other = p.symmetric ? mirror : p.half.map(([x, y]): Coord => [x + shift, y]);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mia completes the shape. She says it is now symmetric about the dashed line.",
            A.figure(
              grid(
                [p.half, other],
                p.symmetric
                  ? "A shape whose right half is the reflection of its left half."
                  : "A shape whose right half is a slid copy of its left half.",
              ),
            ),
          ],
          truth: p.symmetric,
          reasons: p.symmetric
            ? [
                {
                  text: "Each corner on the right is the same distance from the mirror as its partner on the left.",
                  correct: true,
                },
                {
                  text: "It is not symmetric: the right half should look exactly like the left half, the same way round.",
                  code: "GEO.SYMMETRY.TRANSLATES",
                },
                { text: "It is not symmetric because the shape is not a square." },
              ]
            : [
                {
                  text: "The right half has been slid across instead of flipped, so folding on the mirror would not match it up.",
                  correct: true,
                },
                {
                  text: "Both halves are the same shape and size, so it must be symmetric.",
                  code: "GEO.SYMMETRY.TRANSLATES",
                },
                { text: "Any shape with a vertical dashed line through it is symmetric." },
              ],
          solution: [
            {
              say: "Imagine folding along the mirror line. Every corner must land on its partner, which means each pair is the same distance from the line on opposite sides.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type === "number") {
      const P = (question.diagrams[0]?.points as { at: Coord }[] | undefined)?.[0]?.at;
      return P !== undefined && answer.value === 2 * Math.abs(MIRROR - P[0]);
    }
    if (question.archetype !== "choose-the-diagram" || answer?.type !== "choice") return true;
    // The chosen picture folds onto itself: every segment's mirror image is also drawn.
    const index = (
      answer.options.find((o) => o.id === answer.correct)?.content[0] as { i?: number } | undefined
    )?.i;
    const segments = (question.diagrams[index ?? 0]?.segments ?? []) as {
      from: Coord;
      to: Coord;
    }[];
    const key = (a: Coord, b: Coord) =>
      [a, b]
        .map((c) => c.join(","))
        .sort()
        .join(" ");
    const drawn = new Set(segments.map((s) => key(s.from, s.to)));
    return (
      segments.length === 2 * (p.half.length - 1) &&
      segments.every((s) => drawn.has(key(reflect(s.from), reflect(s.to))))
    );
  },
});
