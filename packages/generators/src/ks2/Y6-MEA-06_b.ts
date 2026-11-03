/**
 * @statement Y6-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-06.b: Calculate the area of triangles
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-MEA-06.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-MEA-06.b", depths: [1, 3, 4] }, [
    {
      statement:
        "A triangle has base 10 cm and perpendicular height 6 cm. Sam says its area is 30 cm².",
      truth: true,
      right: "True. Area = ½ × base × height = ½ × 10 × 6 = 30 cm².",
      wrong: [["False. It is 60 cm².", "MEA.AREA.TRIANGLE-HALF"], ["False. It is 16 cm²."]],
    },
    {
      claim:
        "Two triangles with the same base and the same perpendicular height have the same area.",
      truth: "always",
      right: "Always. Both are ½ × base × height, however they lean.",
      wrong: [
        ["Sometimes. Only if they are the same shape.", "MEA.AREA.SLANT"],
        ["Never. Different triangles have different areas."],
      ],
    },
    {
      statement:
        "Mia works out the area of a triangle with base 8 cm, height 3 cm and a slanted side of 5 cm as ½ × 8 × 5.",
      truth: false,
      right: "False. Use the perpendicular height, 3 cm: ½ × 8 × 3 = 12 cm².",
      wrong: [
        ["True. The slanted side is the height.", "MEA.AREA.SLANT"],
        ["True. Use the longest side you are given."],
      ],
    },
  ]),
);
