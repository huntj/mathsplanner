/**
 * @statement Y6-GEO-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-03.c: Find unknown angles in quadrilaterals
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-GEO-03.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y6-GEO-03.c",
      depths: [1, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.angles.length !== 4) reject("a question for this step");
        return { ...p, claim: 1 };
      },
    },
    [
      {
        statement:
          "A quadrilateral has angles of 90°, 90° and 110°. Raj says the fourth angle is 70°.",
        truth: true,
        right: "True. The angles add up to 360°: 360 − 90 − 90 − 110 = 70°.",
        wrong: [
          ["False. It is 0°, as they add to 180°.", "GEO.ANGLES.QUADRILATERAL-180"],
          ["False. It is 290°.", "GEO.ANGLES.ADDS-KNOWN"],
        ],
      },
      {
        statement: "Ella says the angles of every quadrilateral add up to 180°.",
        truth: false,
        right:
          "False. A quadrilateral splits into two triangles, so its angles add up to 2 × 180° = 360°.",
        wrong: [
          ["True. Like a triangle.", "GEO.ANGLES.QUADRILATERAL-180"],
          ["True. Only squares add up to 360°."],
        ],
      },
      {
        claim: "A quadrilateral has four right angles.",
        truth: "sometimes",
        right: "Sometimes. Squares and rectangles do, but most quadrilaterals do not.",
        wrong: [
          [
            "Always. Quadrilaterals have four sides and four right angles.",
            "GEO.ANGLES.TRIANGLE-360",
          ],
          ["Never. Only squares do."],
        ],
      },
    ],
  ),
);
