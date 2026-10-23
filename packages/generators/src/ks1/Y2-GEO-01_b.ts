/**
 * @statement Y2-GEO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-GEO-01.b: Find a vertical line of symmetry
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import type { ShapeKind } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { shape, SHAPE_NAME } from "../shared/shapes.ts";
import parent from "./Y2-GEO-01.ts";

// As drawn, these have a vertical line of symmetry and these do not.
const SYMMETRIC: ShapeKind[] = ["square", "rectangle", "isosceles", "kite", "equilateral"];
const NOT: ShapeKind[] = ["scalene", "parallelogram", "right-angled"];

interface Params {
  kind: ShapeKind;
}

const own: GeneratorDefinition<Params> = {
  id: "Y2-GEO-01.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.SYMMETRY.DIAGONAL"],

  params(rng) {
    return { kind: rng.pick([...SYMMETRIC, ...NOT]) };
  },

  build(p, depth, rng): QuestionDraft {
    const yes = SYMMETRIC.includes(p.kind);
    if (depth === 1) {
      return A.choice({
        rng,
        question: ["Look at this shape.", A.figure(shape(p.kind))],
        ask: "Does it have a vertical line of symmetry?",
        correct: yes ? "Yes" : "No",
        distractors: [
          yes
            ? {
                content: "No",
                feedback:
                  "Imagine folding it along a line straight down the middle: the two halves match.",
              }
            : {
                content: "Yes",
                ...(p.kind === "parallelogram" ? { code: "GEO.SYMMETRY.DIAGONAL" } : {}),
                feedback:
                  "Fold it along a line straight down the middle: the two halves do not match.",
              },
        ],
        solution: [
          {
            say: `A ${SHAPE_NAME[p.kind]} drawn like this ${yes ? "folds" : "does not fold"} exactly in half along a vertical line.`,
          },
        ],
      });
    }
    return A.alwaysSometimesNever({
      rng,
      claim: ["A shape with four sides has a vertical line of symmetry."],
      truth: "sometimes",
      reasons: [
        { text: "Sometimes. A rectangle does, but a parallelogram does not.", correct: true },
        {
          text: "Always. Every four-sided shape can be folded in half.",
          code: "GEO.SYMMETRY.DIAGONAL",
        },
        { text: "Never. Only triangles have lines of symmetry." },
      ],
      solution: [
        {
          say: "Check each shape: a square, rectangle or kite folds onto itself, a parallelogram does not.",
        },
      ],
    });
  },

  verify(p, question) {
    return (
      question.key.depth !== 1 ||
      chosenText(question) === (SYMMETRIC.includes(p.kind) ? "Yes" : "No")
    );
  },
};

export default defineGenerator(
  mixFamilies("Y2-GEO-01.b", { 1: own, 3: { ...parent.definition, id: "Y2-GEO-01.b" }, 4: own }),
);
