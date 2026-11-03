/**
 * @statement Y4-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-GEO-01.a: Classify triangles by their properties
import { defineGenerator } from "@mathsplanner/core";
import type { ShapeKind } from "@mathsplanner/diagrams";
import { TRIANGLES } from "../shared/shapes.ts";
import parent, { RIDDLES } from "./Y4-GEO-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;
const POOL: ShapeKind[] = TRIANGLES;
const RIDDLE_POOL = RIDDLES.map((r, i) => (POOL.includes(r.kind) ? i : -1)).filter((i) => i >= 0);

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y4-GEO-01.a",
      depths: [1, 2, 4],
      params: (rng, numbers) => ({
        ...def.params(rng, numbers),
        kind: rng.pick(POOL),
        riddle: rng.pick(RIDDLE_POOL),
        claim: rng.pick([3]),
      }),
    },
    [
      {
        statement: "Ana says an equilateral triangle has three equal sides.",
        truth: true,
        right: "True. That is what equilateral means: all sides equal.",
        wrong: [
          ["False. It has two equal sides.", "GEO.SHAPES.HIERARCHY"],
          ["False. It has a right angle."],
        ],
      },
      {
        statement: "Leo says a triangle is only isosceles when it points upwards.",
        truth: false,
        right: "False. A triangle with two equal sides is isosceles whichever way it is turned.",
        wrong: [
          ["True. Isosceles triangles point up.", "GEO.SHAPES.ORIENTATION"],
          ["True. Turned over it is scalene.", "GEO.SHAPES.ORIENTATION"],
        ],
      },
      {
        claim: "An equilateral triangle is also isosceles.",
        truth: "always",
        right: "Always. It has at least two equal sides, so it is isosceles too.",
        wrong: [
          ["Never. They are different triangles.", "GEO.SHAPES.HIERARCHY"],
          ["Sometimes. Only when it is big."],
        ],
      },
    ],
  ),
);
