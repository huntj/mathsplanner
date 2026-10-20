/**
 * @statement Y4-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y4-GEO-01: Compare and classify geometric shapes, including quadrilaterals and triangles,
// based on their properties and sizes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ShapeKind } from "@mathsplanner/diagrams";
import {
  capital,
  distinctKinds,
  QUADRILATERALS,
  shape,
  SHAPE_NAME,
  TRIANGLES,
  wrongNames,
} from "../shared/shapes.ts";

interface Params {
  kind: ShapeKind;
  rotation: number;
  riddle: number;
  claim: number;
}

const RIDDLES: { clue: string; kind: ShapeKind }[] = [
  { clue: "I have exactly one pair of parallel sides.", kind: "trapezium" },
  { clue: "I have four equal sides but no right angles.", kind: "rhombus" },
  {
    clue: "I have two pairs of equal sides next to each other, and no parallel sides.",
    kind: "kite",
  },
  { clue: "I am a triangle with exactly two equal sides.", kind: "isosceles" },
  { clue: "I am a triangle with all three sides different and no right angle.", kind: "scalene" },
  {
    clue: "I have two pairs of parallel sides, opposite sides equal, and no right angles, but my sides are not all equal.",
    kind: "parallelogram",
  },
];

const CLAIMS = [
  {
    claim: "A square is a rectangle.",
    truth: "always" as const,
    reasons: [
      {
        text: "A rectangle has four right angles and opposite sides equal, and every square has both.",
        correct: true,
      },
      {
        text: "A square cannot be a rectangle because its sides are all equal.",
        code: "GEO.SHAPES.HIERARCHY",
      },
      { text: "Only if the square is turned on its side." },
    ],
  },
  {
    claim: "A rectangle is a square.",
    truth: "sometimes" as const,
    reasons: [
      { text: "Only when its four sides are all the same length.", correct: true },
      {
        text: "Every rectangle has four right angles, so every rectangle is a square.",
        code: "GEO.SHAPES.HIERARCHY",
      },
      { text: "A rectangle can never have equal sides." },
    ],
  },
  {
    claim: "A rhombus is a parallelogram.",
    truth: "always" as const,
    reasons: [
      {
        text: "A rhombus has two pairs of parallel sides, which makes it a parallelogram.",
        correct: true,
      },
      {
        text: "A rhombus has equal sides, so it cannot be a parallelogram.",
        code: "GEO.SHAPES.HIERARCHY",
      },
      { text: "Only when it has right angles." },
    ],
  },
  {
    claim: "A triangle has two right angles.",
    truth: "never" as const,
    reasons: [
      {
        text: "Two right angles already make 180°, leaving nothing for the third angle.",
        correct: true,
      },
      { text: "A right-angled triangle has two right angles." },
      { text: "Only if it is isosceles." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y4-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.SHAPES.HIERARCHY", "GEO.SHAPES.ORIENTATION"],

  params(rng, numbers) {
    // Not squares: nearly every quadrilateral name also fits a square, so none would be a fair wrong answer.
    const pool: ShapeKind[] =
      numbers === "friendly"
        ? ["rectangle", "equilateral", "isosceles", "right-angled"]
        : [...QUADRILATERALS, ...TRIANGLES].filter((k) => k !== "square");
    return {
      kind: rng.pick(pool),
      rotation:
        numbers === "stretch" ? rng.int(15, 75) : numbers === "standard" ? rng.pick([0, 30]) : 0,
      riddle: rng.int(0, RIDDLES.length - 1),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const family = TRIANGLES.includes(p.kind) ? TRIANGLES : QUADRILATERALS;
    switch (depth) {
      case 1: {
        // Only names that are definitely wrong: a square is also a rectangle, so that is no distractor.
        const others = wrongNames(p.kind, family);
        if (others.length < 2) reject("too few definitely wrong names");
        return A.choice({
          rng,
          question: [
            "The marks show equal sides, parallel sides and right angles.",
            A.figure(shape(p.kind, { marks: true, rotation: p.rotation })),
          ],
          ask: "What is the name of this shape?",
          correct: capital(SHAPE_NAME[p.kind]),
          distractors: rng
            .sample(others, Math.min(3, others.length))
            .map((k) => ({ content: capital(SHAPE_NAME[k]) })),
          solution: [
            { say: `Read the marks: they show exactly the properties of a ${SHAPE_NAME[p.kind]}.` },
          ],
        });
      }
      case 2: {
        const riddle = RIDDLES[p.riddle] ?? RIDDLES[0];
        if (!riddle) return reject("no riddle");
        const pool = TRIANGLES.includes(riddle.kind) ? TRIANGLES : QUADRILATERALS;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: riddle.clue,
          ask: "What shape am I?",
          correct: capital(SHAPE_NAME[riddle.kind]),
          distractors: rng
            .sample(
              wrongNames(riddle.kind, pool),
              Math.min(3, wrongNames(riddle.kind, pool).length),
            )
            .map((k) => ({ content: capital(SHAPE_NAME[k]) })),
          solution: [{ say: `Only a ${SHAPE_NAME[riddle.kind]} fits.` }],
        });
      }
      case 3: {
        // Build a set where no shape could also be named as another (a rhombus is also a kite).
        const kinds: ShapeKind[] = [];
        for (const k of rng.shuffle([...QUADRILATERALS, ...TRIANGLES])) {
          if (kinds.length < 3 && distinctKinds([...kinds, k])) kinds.push(k);
        }
        return A.matchRepresentations({
          rng,
          question:
            "Match each shape to its name. The marks show equal sides, parallel sides and right angles.",
          pairs: kinds.map(
            (k) =>
              [
                A.figure(shape(k, { marks: true, rotation: rng.pick([0, 20, 40]) })),
                capital(SHAPE_NAME[k]),
              ] as [A.RichInput, A.RichInput],
          ),
          solution: [
            {
              say: "Use the marks, not how the shape is turned: dashes show equal sides, arrows show parallel sides, squares show right angles.",
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] ?? CLAIMS[0];
        if (!c) return reject("no claim");
        return A.alwaysSometimesNever({
          rng,
          claim: c.claim,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    // The drawn shape's own marks are those of the named kind.
    const drawn = question.diagrams[0];
    const reference = shape(p.kind, { marks: true });
    return JSON.stringify(drawn?.segments ?? []) === JSON.stringify(reference.segments ?? []);
  },
});
