/**
 * @statement Y6-MEA-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-06.a: Calculate the area of parallelograms
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-MEA-06.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-MEA-06.a", depths: [2, 4] }, [
    {
      statement:
        "A parallelogram has base 8 cm and perpendicular height 5 cm. Max says its area is 40 cm².",
      truth: true,
      right: "True. Area = base × perpendicular height = 8 × 5 = 40 cm².",
      wrong: [
        ["False. It is 20 cm², halving it.", "MEA.AREA.TRIANGLE-HALF"],
        ["False. Use the slanted side instead of the height.", "MEA.AREA.SLANT"],
      ],
    },
    {
      claim: "A parallelogram has the same area as a rectangle with the same base and height.",
      truth: "always",
      right:
        "Always. Cut the triangle off one end and move it to the other: it makes the rectangle.",
      wrong: [
        ["Never. The slanted sides make it bigger.", "MEA.AREA.SLANT"],
        ["Sometimes. Only if it leans a little."],
      ],
    },
    {
      statement:
        "A parallelogram has a base of 10 cm, slanted sides of 6 cm and a height of 4 cm. Ana says its area is 60 cm².",
      truth: false,
      right: "False. Use the perpendicular height, not the slanted side: 10 × 4 = 40 cm².",
      wrong: [
        ["True. Base × slanted side = 10 × 6.", "MEA.AREA.SLANT"],
        ["True. Multiply the two side lengths."],
      ],
    },
  ]),
);
