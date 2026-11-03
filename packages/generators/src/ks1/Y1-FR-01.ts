/**
 * @statement Y1-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-FR-01: Recognise, find and name a half as one of two equal parts of an object, shape or
// quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    namedFraction(
      "Y1-FR-01",
      { friendly: [[1, 2]], standard: [[1, 2]], stretch: [[1, 2]] },
      { friendly: 5, standard: 10, stretch: 20 },
    ),
    [
      {
        claim: "The two halves of a shape are the same size.",
        truth: "always",
        right: "Always. A half is one of 2 equal parts.",
        wrong: [
          ["Sometimes. One half can be bigger.", "FR.PARTS.UNEQUAL"],
          ["Never. Halves are different."],
        ],
      },
      {
        statement: "Kai says half of 8 apples is 4 apples.",
        truth: true,
        right: "True. Share 8 into 2 equal groups: 4 in each.",
        wrong: [["False. Half of 8 is 2.", "FR.OF-AMOUNT.UNIT-ONLY"], ["False. Half of 8 is 6."]],
      },
      {
        statement:
          "A sandwich is cut into a big piece and a small piece. Mia says each piece is a half.",
        truth: false,
        right: "False. Halves must be the same size.",
        wrong: [
          ["True. 2 pieces are halves.", "FR.PARTS.UNEQUAL"],
          ["True. Any cut makes halves.", "FR.PARTS.UNEQUAL"],
        ],
      },
    ],
  ),
);
