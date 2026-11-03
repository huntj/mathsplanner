/**
 * @statement Y2-FR-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-01.b: Find ⅓ of a shape, length or quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    namedFraction(
      "Y2-FR-01.b",
      { friendly: [[1, 3]], standard: [[1, 3]], stretch: [[1, 3]] },
      { friendly: 5, standard: 10, stretch: 12 },
    ),
    [
      {
        claim: "Thirds of the same shape are equal in size.",
        truth: "always",
        right: "Always. A third is one of 3 equal parts.",
        wrong: [
          ["Sometimes. One third can be bigger.", "FR.PARTS.UNEQUAL"],
          ["Never. Thirds are all different."],
        ],
      },
      {
        statement: "A bar is cut into 3 equal parts and 1 is shaded. Sam says 1/3 is shaded.",
        truth: true,
        right: "True. 1 of 3 equal parts is one third.",
        wrong: [["False. 2/3 is shaded.", "FR.NAME.SHADED-UNSHADED"], ["False. 1/2 is shaded."]],
      },
      {
        statement: "Kim says 1/3 of 6 sweets is 3 sweets.",
        truth: false,
        right: "False. Share 6 into 3 equal groups: 2 in each, so 1/3 of 6 is 2.",
        wrong: [
          ["True. A third means 3.", "FR.OF-AMOUNT.UNIT-ONLY"],
          ["True. Half of 6 is 3, and a third is the same."],
        ],
      },
    ],
  ),
);
