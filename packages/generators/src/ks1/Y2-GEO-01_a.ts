/**
 * @statement Y2-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-GEO-01.a: Describe the sides and vertices of 2D shapes
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-GEO-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y2-GEO-01.a", depths: [1, 2, 4] }, [
    {
      claim: "A square has 4 sides the same length.",
      truth: "always",
      right: "Always. That is part of what makes it a square.",
      wrong: [
        ["Sometimes. Some squares have 3 sides.", "GEO.SHAPES.SIDES-VERTICES"],
        ["Never. The sides are different."],
      ],
    },
    {
      statement: "Sam says a triangle has 3 sides and 3 corners.",
      truth: true,
      right: "True. Tri means three.",
      wrong: [
        ["False. It has 4 corners.", "GEO.SHAPES.SIDES-VERTICES"],
        ["False. It has 2 sides."],
      ],
    },
    {
      statement: "Mia turns a square on its corner. She says it is not a square any more.",
      truth: false,
      right: "False. Turning a shape does not change it: it is still a square.",
      wrong: [
        ["True. Now it is a diamond.", "GEO.SHAPES.ORIENTATION"],
        ["True. Squares must sit flat.", "GEO.SHAPES.ORIENTATION"],
      ],
    },
  ]),
);
