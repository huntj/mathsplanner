/**
 * @statement Y8-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y8-GEO-03: Derive and illustrate properties of triangles, quadrilaterals, circles and other plane
// figures (e.g. equal lengths and angles) using appropriate language and technologies
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec, ShapeKind } from "@mathsplanner/diagrams";
import {
  capital,
  describeDiagonals,
  diagonalFacts,
  QUADRILATERALS,
  shape,
  SHAPE_NAME,
  wrongNames,
} from "../shared/shapes.ts";

interface Params {
  /** Not a square: every other quadrilateral name also fits a square, so none would be wrong. */
  kind: ShapeKind;
  rotation: number;
  claim: number;
}

const POOL: ShapeKind[] = ["rectangle", "rhombus", "parallelogram", "kite", "trapezium"];

/** The shape with its diagonals drawn dashed. */
function withDiagonals(kind: ShapeKind, rotation: number): GeometrySpec {
  const base = shape(kind, { marks: true, rotation });
  return {
    ...base,
    segments: [
      ...(base.segments ?? []),
      { from: "A", to: "C", dashed: true },
      { from: "B", to: "D", dashed: true },
    ],
    description: `A ${SHAPE_NAME[kind]} with both diagonals drawn as dashed lines.`,
  };
}

const sentence = (kind: ShapeKind) =>
  `My diagonals ${describeDiagonals(diagonalFacts(shape(kind)))}.`;

const CLAIMS = [
  {
    claim: "The diagonals of a rectangle cross at right angles.",
    truth: "sometimes" as const,
    reasons: [
      { text: "Only when the rectangle is a square.", correct: true },
      {
        text: "All the angles in a rectangle are right angles, so this is always true.",
        code: "GEO.RECTANGLE.DIAGONALS-PERPENDICULAR",
      },
      { text: "Diagonals never cross at right angles." },
    ],
  },
  {
    claim: "The diagonals of a rhombus cross at right angles.",
    truth: "always" as const,
    reasons: [
      {
        text: "Each diagonal of a rhombus is a line of symmetry, so the other diagonal crosses it at right angles.",
        correct: true,
      },
      { text: "Only when the rhombus is a square.", code: "GEO.SHAPES.HIERARCHY" },
      { text: "Only when the rhombus is standing on a corner.", code: "GEO.SHAPES.ORIENTATION" },
    ],
  },
  {
    claim: "The diagonals of a parallelogram are equal in length.",
    truth: "sometimes" as const,
    reasons: [
      { text: "Only when the parallelogram is a rectangle (or a square).", correct: true },
      {
        text: "Never: a rectangle is a different shape from a parallelogram.",
        code: "GEO.SHAPES.HIERARCHY",
      },
      { text: "Always: opposite sides are equal, so the diagonals must be too." },
    ],
  },
  {
    claim: "The diagonals of a kite cut each other in half.",
    truth: "sometimes" as const,
    reasons: [
      {
        text: "Only when the kite is a rhombus; otherwise just one diagonal is cut in half.",
        correct: true,
      },
      { text: "Never: a rhombus is not a kite.", code: "GEO.SHAPES.HIERARCHY" },
      { text: "Always, because a kite is symmetrical." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y8-GEO-03",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: [
    "GEO.SHAPES.HIERARCHY",
    "GEO.SHAPES.ORIENTATION",
    "GEO.RECTANGLE.DIAGONALS-PERPENDICULAR",
  ],

  params(rng, numbers) {
    return {
      kind: rng.pick(numbers === "friendly" ? ["rectangle", "rhombus", "kite"] : POOL),
      rotation:
        numbers === "stretch" ? rng.int(15, 75) : numbers === "standard" ? rng.pick([0, 30]) : 0,
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const others = wrongNames(p.kind, QUADRILATERALS);
        if (others.length < 2) return reject("too few definitely wrong names");
        return A.choice({
          rng,
          question: ["I am a quadrilateral.", sentence(p.kind)],
          ask: "Which quadrilateral am I?",
          correct: capital(SHAPE_NAME[p.kind]),
          distractors: rng
            .sample(others, Math.min(3, others.length))
            .map((k) => ({ content: capital(SHAPE_NAME[k]) })),
          solution: [
            {
              say: `Draw the diagonals of each shape and check the three facts. Only the ${SHAPE_NAME[p.kind]} fits all of them.`,
              figure: withDiagonals(p.kind, 0),
            },
          ],
        });
      }
      case 3: {
        const kinds = rng.sample(POOL, 3);
        return A.matchRepresentations({
          rng,
          question: "Match each shape to the facts about its diagonals.",
          pairs: kinds.map(
            (k) =>
              [
                A.figure(withDiagonals(k, rng.pick([0, 20, 40]))),
                `The diagonals ${describeDiagonals(diagonalFacts(shape(k)))}.`,
              ] as [A.RichInput, A.RichInput],
          ),
          solution: [
            {
              say: "Check each fact in turn: are the diagonals the same length, do they meet at a right angle, and where do they cross?",
            },
          ],
        });
      }
      default: {
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
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    // The riddle's facts are those of the shape the answer names, measured from its drawing.
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { v?: string } | undefined;
    const stem = question.stem.map((n) => ("v" in n ? n.v : "")).join(" ");
    return (
      chosen?.v === capital(SHAPE_NAME[p.kind]) &&
      stem.includes(describeDiagonals(diagonalFacts(shape(p.kind, { rotation: 50 }))))
    );
  },
});
