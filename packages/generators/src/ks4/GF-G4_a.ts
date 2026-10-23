/**
 * @statement GF-G4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G4.a: Use the properties of special quadrilaterals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const PROPERTIES: [string, string, string[]][] = [
  ["exactly one pair of parallel sides", "Trapezium", ["Parallelogram", "Kite"]],
  [
    "two pairs of equal adjacent sides and exactly one line of symmetry",
    "Kite",
    ["Rhombus", "Parallelogram"],
  ],
  ["four equal sides but no right angles", "Rhombus", ["Square", "Rectangle"]],
  ["four right angles but sides of two different lengths", "Rectangle", ["Square", "Rhombus"]],
  [
    "two pairs of parallel sides, no right angles and no lines of symmetry",
    "Parallelogram",
    ["Rhombus", "Trapezium"],
  ],
];

const CLAIMS: [string, "always" | "sometimes" | "never", string][] = [
  [
    "A square is a rectangle.",
    "always",
    "A square has four right angles, so it is a special rectangle.",
  ],
  [
    "A rhombus is a square.",
    "sometimes",
    "A rhombus is a square only when its angles are right angles.",
  ],
  [
    "A trapezium is a parallelogram.",
    "never",
    "A trapezium has exactly one pair of parallel sides; a parallelogram has two.",
  ],
  ["A rectangle is a parallelogram.", "always", "A rectangle has two pairs of parallel sides."],
];

interface Params {
  prop: number;
  angle: number;
  claim: number;
}

export default defineGenerator<Params>({
  id: "GF-G4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SHAPES.HIERARCHY", "GEO.PARALLEL.CO-INTERIOR-EQUAL"],

  params(rng) {
    return {
      prop: rng.int(0, PROPERTIES.length - 1),
      angle: rng.int(50, 80),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, right, others] = PROPERTIES[p.prop] ?? PROPERTIES[0] ?? ["", "", []];
        return A.choice({
          rng,
          question: [`Which quadrilateral has ${what}?`],
          correct: right,
          distractors: others.map((o) => ({
            content: o,
            code: "GEO.SHAPES.HIERARCHY",
            feedback: `Check each property against a ${o.toLowerCase()}.`,
          })),
          solution: [{ say: `A ${right.toLowerCase()}.` }],
        });
      }
      case 2: {
        const v = 180 - p.angle;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`ABCD is a parallelogram. Angle DAB = ${p.angle}°.`],
              ask: "Find angle ABC.",
            },
            {
              question: [`In a parallelogram one angle is ${p.angle}°.`],
              ask: "Find the size of the angle next to it.",
            },
          ],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
              value: A.degrees(p.angle),
              feedback:
                "Neighbouring angles in a parallelogram are co-interior, so they add up to 180°.",
            },
          ]),
          solution: [{ say: "", math: `180^\\circ - ${p.angle}^\\circ = ${v}^\\circ` }],
        });
      }
      default: {
        const [claim, truth, why] = CLAIMS[p.claim] ?? CLAIMS[0] ?? ["", "always", ""];
        const word = { always: "Always", sometimes: "Sometimes", never: "Never" };
        const others = (["always", "sometimes", "never"] as const).filter((t) => t !== truth);
        return A.alwaysSometimesNever({
          rng,
          claim: [claim],
          truth,
          reasons: [
            { text: `${word[truth]}. ${why}`, correct: true },
            ...others.map((t) => ({
              text: `${word[t]}. Each quadrilateral has its own name, so one cannot be another.`,
              code: "GEO.SHAPES.HIERARCHY",
            })),
          ],
          solution: [{ say: why }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === PROPERTIES[p.prop]?.[1];
    if (question.key.depth === 2) return numberAnswer(question) === 180 - p.angle;
    return true;
  },
});
